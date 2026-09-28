#!/usr/bin/env node
// url-map.mjs: map every URL of a Java web app to the code that handles it and to whatever calls, schedules or
// routes to it. Spec: SPEC.md in this folder. Node 18+, no dependencies. Reads only; writes the two outputs.
//
// Usage: node url-map.mjs --config <url-map.config.json> [--stdout]
// Config (paths absolute or relative to the config file):
//   {
//     "repoRoot":    "<git repo root; handler_at paths are relative to it>",
//     "backendRoot": "<folder with pom.xml and src/main>",            // default: repoRoot
//     "newCodePackage": "com/example/api",                            // status "new" (optional)
//     "devApis": ["myDevEndpoint"],                                    // Endpoints APIs shown as endpoints-dev
//     "dispatchYaml": "<path>",                                       // default: <backendRoot>/dispatch.yaml
//     "frontend": { "repoRoot": "<path>", "file": "<path to URL constants .ts>",
//                   "prefixConst": "APIGate", "objects": ["APIUrl"] },  // optional
//     "outTsv": "<path>", "outMd": "<path>"
//   }

import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join, resolve, relative, dirname, basename, sep } from "node:path";
import { execFileSync } from "node:child_process";

// ---------- config ----------
function fail(msg) { console.error(`url-map: ${msg}`); process.exit(2); }
const argv = process.argv.slice(2);
const cfgPath = argv[argv.indexOf("--config") + 1];
if (!argv.includes("--config") || !cfgPath) fail("usage: node url-map.mjs --config <url-map.config.json> [--stdout]");
let cfg;
try { cfg = JSON.parse(readFileSync(cfgPath, "utf8").replace(/^﻿/, "")); } catch (e) { fail(`cannot read config: ${e.message}`); }
const base = dirname(resolve(cfgPath));
const abs = (p) => (p ? resolve(base, p) : p);
const repoRoot = abs(cfg.repoRoot) ?? fail("config needs repoRoot");
const backendRoot = abs(cfg.backendRoot) ?? repoRoot;
const javaRoot = join(backendRoot, "src", "main", "java");
const webInf = join(backendRoot, "src", "main", "webapp", "WEB-INF");
const dispatchYaml = abs(cfg.dispatchYaml) ?? join(backendRoot, "dispatch.yaml");
const devApis = new Set(cfg.devApis ?? []);
const posix = (p) => p.split(sep).join("/");
const rel = (root, file) => posix(relative(root, file));

// ---------- small helpers ----------
function walk(dir, ext, out = []) {
  if (!existsSync(dir)) return out;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, ext, out);
    else if (p.endsWith(ext)) out.push(p);
  }
  return out;
}
// Blank out comments (keeping line breaks and string literals) so commented-out code is never read as code.
function stripComments(src) {
  let out = "", i = 0, mode = "code";
  while (i < src.length) {
    const c = src[i], n = src[i + 1];
    if (mode === "code") {
      if (c === "/" && n === "/") { mode = "line"; out += "  "; i += 2; continue; }
      if (c === "/" && n === "*") { mode = "block"; out += "  "; i += 2; continue; }
      if (c === '"' || c === "'") { mode = c; }
      out += c; i++; continue;
    }
    if (mode === "line") { if (c === "\n") { mode = "code"; out += c; } else out += " "; i++; continue; }
    if (mode === "block") {
      if (c === "*" && n === "/") { mode = "code"; out += "  "; i += 2; continue; }
      out += c === "\n" ? "\n" : " "; i++; continue;
    }
    // inside a string literal
    if (c === "\\") { out += c + (n ?? ""); i += 2; continue; }
    if (c === mode) mode = "code";
    out += c; i++;
  }
  return out;
}
const lineAt = (text, idx) => text.slice(0, idx).split("\n").length;
// Join URL path segments with single slashes: ("api", "/users/", "me") -> "/api/users/me".
const joinUrlPath = (...parts) => "/" + parts.map((p) => (p ?? "").replace(/^\/+|\/+$/g, "")).filter(Boolean).join("/");
// From an index at "(", return the text up to the matching ")".
function balanced(text, openIdx, open = "(", close = ")") {
  let depth = 0;
  for (let i = openIdx; i < text.length; i++) {
    if (text[i] === '"') { i = text.indexOf('"', i + 1); if (i < 0) break; continue; }
    if (text[i] === open) depth++;
    else if (text[i] === close && --depth === 0) return { inner: text.slice(openIdx + 1, i), end: i };
  }
  return { inner: text.slice(openIdx + 1), end: text.length };
}
const strings = (s) => [...s.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]);
function attr(args, name) {
  const m = args.match(new RegExp(String.raw`\b${name}\s*=\s*(\{[^}]*\}|"(?:[^"\\]|\\.)*"|[\w.]+)`));
  if (!m) return null;
  return m[1].startsWith("{") || m[1].startsWith('"') ? strings(m[1]) : [m[1]];
}
function simpleYamlList(file, key) {
  // Reads "- key: value" lists with nested "  k: v" lines (enough for cron/queue/dispatch yaml).
  if (!existsSync(file)) return [];
  const items = [];
  readFileSync(file, "utf8").split(/\r?\n/).forEach((raw, i) => {
    const line = raw.replace(/\s+#.*$/, "");
    const m = line.match(/^\s*(-\s+)?([\w-]+)\s*:\s*(.*)$/);
    if (!m) return;
    const value = m[3].trim().replace(/^['"]|['"]$/g, "");
    if (m[1]) items.push({ line: i + 1 });
    if (items.length && (m[1] || /^\s{2,}/.test(line))) items.at(-1)[m[2]] = value;
  });
  return items.filter((it) => key in it);
}

// ---------- compile status from pom.xml excludes ----------
const pomFile = join(backendRoot, "pom.xml");
const pomText = existsSync(pomFile) ? readFileSync(pomFile, "utf8") : "";
const excludes = [...pomText.matchAll(/<exclude>([^<]+)<\/exclude>/g)].map((m) => m[1].trim());
// Escape regex specials; `keep` lists characters to leave alone because the caller rewrites them next.
const escapeRe = (s, keep = "") => s.replace(/[.+^${}()|[\]\\]/g, (c) => (keep.includes(c) ? c : "\\" + c));
const globToRe = (g) => new RegExp("^" + escapeRe(g).replace(/\*\*\/?/g, "\u0000").replace(/\*/g, "[^/]*").replace(/\u0000/g, ".*") + "$");
const excludeRes = excludes.map(globToRe);
function statusOf(javaFile) {
  const r = rel(javaRoot, javaFile);
  if (excludeRes.some((re) => re.test(r))) return "excluded";
  if (cfg.newCodePackage && r.startsWith(cfg.newCodePackage.replace(/\/?$/, "/"))) return "new";
  return "legacy";
}

// ---------- collect handlers, callers, rules ----------
const handlers = [];     // { url, kind, http, handler, file, line, status, extraProblems[] }
const callers = [];      // { url, kind: task|frontend, at, queue? }
const queueUses = [];    // { name, at }
const filterRules = [];  // { substr, at, bypass }
const unresolved = [];   // strings describing what couldn't be resolved
const counts = { webServletFiles: 0, webFilter: 0, jaxrsPath: 0, apiMethod: 0, withUrl: 0, cron: 0, queues: 0, dispatch: 0, webXmlServlets: 0, frontend: 0 };
// Occurrences that only exist inside comments, so the counts can be reconciled with a plain grep.
const commented = { apiMethod: 0, withUrl: 0, webServlet: 0, path: 0 };
const countIn = (s, re) => (s.match(re) ?? []).length;

const javaFiles = walk(javaRoot, ".java");
const classFile = new Map(); // fully-qualified class name -> file
for (const f of javaFiles) classFile.set(rel(javaRoot, f).replace(/\.java$/, "").split("/").join("."), f);

for (const file of javaFiles) {
  const raw = readFileSync(file, "utf8");
  const text = stripComments(raw);
  for (const [k, re] of [["apiMethod", /@ApiMethod\b/g], ["withUrl", /\bwithUrl\s*\(/g], ["webServlet", /@WebServlet\b/g], ["path", /@Path\s*\(/g]]) {
    commented[k] += countIn(raw, re) - countIn(text, re);
  }
  const cls = basename(file, ".java");
  const at = (idx) => `${rel(repoRoot, file)}:${lineAt(text, idx)}`;
  const status = statusOf(file);
  const httpVerbs = ["Get", "Post", "Put", "Delete"].filter((v) => new RegExp(String.raw`\bdo${v}\s*\(`).test(text)).map((v) => v.toUpperCase());

  // @WebServlet / @WebFilter
  for (const m of text.matchAll(/@Web(Servlet|Filter)\s*\(/g)) {
    const { inner } = balanced(text, m.index + m[0].length - 1);
    const urls = attr(inner, "urlPatterns") ?? attr(inner, "value") ?? strings(inner.trim().startsWith('"') || inner.trim().startsWith("{") ? inner : "");
    if (m[1] === "Servlet") counts.webServletFiles++; else counts.webFilter++;
    if (!urls.length) unresolved.push(`@Web${m[1]} without a literal URL pattern at ${at(m.index)}`);
    for (const u of urls) handlers.push({ url: u, kind: m[1] === "Servlet" ? "servlet" : "filter", http: m[1] === "Servlet" ? httpVerbs.join(",") : "", handler: cls, file, line: lineAt(text, m.index), status });
  }

  // Filter URL rules: substrings tested on the request URI; a condition whose block passes the request on
  // (doFilter) without the normal checks is an auth bypass.
  if (/@WebFilter|implements\s+Filter\b/.test(text)) {
    for (const m of text.matchAll(/\bif\s*\(/g)) {
      const cond = balanced(text, m.index + m[0].length - 1);
      const braceIdx = text.indexOf("{", cond.end);
      const block = braceIdx >= 0 && braceIdx - cond.end < 5 ? balanced(text, braceIdx, "{", "}").inner : "";
      const bypass = /\bdoFilter\s*\(/.test(block) && /\breturn\b/.test(block);
      for (const c of cond.inner.matchAll(/(!?)\s*\w+\s*\.\s*contains\s*\(\s*"([^"]*)"\s*\)/g)) {
        filterRules.push({ substr: c[2], at: at(m.index + m[0].length + c.index), bypass: bypass && !c[1], cls });
      }
    }
  }

  // JAX-RS: class @Path + method @Path + HTTP annotation.
  // Cloud Endpoints: class @Api(name, version) + @ApiMethod(name, path, httpMethod).
  let classPath = null, api = null, pending = {};
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!t) continue;
    if (t.startsWith("@")) {
      const name = t.match(/^@(\w+)/)[1];
      let args = "";
      const open = t.indexOf("(");
      const annotationLine = i + 1;
      if (open >= 0 && t.slice(1, open).trim() === name) {
        const startIdx = lines.slice(0, i).join("\n").length + (i ? 1 : 0) + lines[i].indexOf("(");
        const b = balanced(text, startIdx);
        args = b.inner;
        i = lineAt(text, b.end) - 1; // an annotation can span several lines: continue after its ")"
      }
      if (name === "Path") { pending.path = strings(args)[0] ?? ""; counts.jaxrsPath++; pending.pathLine = annotationLine; }
      else if (["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"].includes(name)) pending.http = name;
      else if (name === "Api") api = { name: attr(args, "name")?.[0], version: attr(args, "version")?.[0] ?? "v1" };
      else if (name === "ApiMethod") {
        counts.apiMethod++;
        pending.apiMethod = { name: attr(args, "name")?.[0], path: attr(args, "path")?.[0], http: attr(args, "httpMethod")?.[0]?.split(".").pop() };
        pending.apiLine = annotationLine;
      }
      continue;
    }
    const classDecl = t.match(/\b(?:class|interface)\s+(\w+)/);
    if (classDecl && !t.includes("(")) {
      if (pending.path !== undefined) classPath = pending.path;
      pending = {};
      continue;
    }
    const method = t.match(/(\w+)\s*\(/);
    if (method && (pending.http || pending.path !== undefined || pending.apiMethod)) {
      if (pending.apiMethod) {
        const a = pending.apiMethod;
        const extra = [];
        let path = a.path;
        if (!path) { path = a.name ?? method[1]; extra.push("DEFAULT_PATH_GUESSED"); }
        if (!api?.name) unresolved.push(`@ApiMethod ${method[1]} in ${cls} with no @Api name`);
        handlers.push({ url: `/_ah/api/${api?.name ?? "?"}/${api?.version ?? "?"}/${path.replace(/^\//, "")}`, kind: devApis.has(api?.name) ? "endpoints-dev" : "endpoints", http: a.http ?? "", handler: `${cls}#${method[1]}`, file, line: pending.apiLine, status, extraProblems: extra });
      } else if (pending.http || pending.path !== undefined) {
        handlers.push({ url: null, jaxrs: { classPath, methodPath: pending.path ?? "" }, kind: "jaxrs", http: pending.http ?? "(sub-resource)", handler: `${cls}#${method[1]}`, file, line: pending.pathLine ?? i + 1, status });
      }
      pending = {};
    } else if (!t.startsWith("@")) {
      pending = {};
    }
  }

  // Task-queue producers: withUrl("...") and the queue it's added to.
  for (const m of text.matchAll(/\bwithUrl\s*\(\s*("(?:[^"\\]|\\.)*")?/g)) {
    counts.withUrl++;
    const stmtStart = Math.max(text.lastIndexOf(";", m.index), text.lastIndexOf("{", m.index), text.lastIndexOf("}", m.index));
    const stmt = text.slice(stmtStart + 1, m.index);
    const q = stmt.match(/getQueue\s*\(\s*"([^"]+)"\s*\)/)?.[1] ?? (/getDefaultQueue\s*\(/.test(stmt) ? "default" : "?");
    if (!m[1]) { unresolved.push(`withUrl(<not a string literal>) at ${at(m.index)}`); continue; }
    callers.push({ url: JSON.parse(m[1]).split("?")[0], kind: "task", at: at(m.index), queue: q });
  }
  for (const m of text.matchAll(/getQueue\s*\(\s*"([^"]+)"\s*\)/g)) queueUses.push({ name: m[1], at: at(m.index) });
}

// web.xml servlets (and the JAX-RS container mapping)
let jaxrsBase = null;
const webXml = join(webInf, "web.xml");
if (existsSync(webXml)) {
  const x = readFileSync(webXml, "utf8").replace(/<!--[\s\S]*?-->/g, (c) => c.replace(/[^\n]/g, " "));
  const classes = new Map([...x.matchAll(/<servlet>[\s\S]*?<servlet-name>\s*([^<]+?)\s*<\/servlet-name>[\s\S]*?<servlet-class>\s*([^<]+?)\s*<\/servlet-class>/g)].map((m) => [m[1], m[2]]));
  for (const m of x.matchAll(/<servlet-mapping>[\s\S]*?<servlet-name>\s*([^<]+?)\s*<\/servlet-name>([\s\S]*?)<\/servlet-mapping>/g)) {
    const klass = classes.get(m[1]) ?? "?";
    for (const p of m[2].matchAll(/<url-pattern>\s*([^<]+?)\s*<\/url-pattern>/g)) {
      if (/ServletContainer$/.test(klass)) { jaxrsBase = p[1].replace(/\/\*$/, ""); continue; }
      counts.webXmlServlets++;
      const f = classFile.get(klass);
      const line = x.slice(0, m.index).split("\n").length;
      // A class with no source here (e.g. from a library) keeps the spec's statuses: "legacy", and it's listed as
      // unresolved so nobody reads it as checked.
      if (!f) unresolved.push(`web.xml maps ${p[1]} to ${klass}, whose source isn't under ${rel(repoRoot, javaRoot)}`);
      handlers.push({ url: p[1], kind: "servlet", http: "", handler: klass.split(".").pop(), file: f ?? webXml, line: f ? 1 : line, status: f ? statusOf(f) : "legacy", fromWebXml: true });
    }
  }
}
const appPath = javaFiles.map((f) => readFileSync(f, "utf8").match(/@ApplicationPath\s*\(\s*"([^"]*)"/)?.[1]).find(Boolean);
if (jaxrsBase === null) jaxrsBase = appPath ?? "";
for (const h of handlers.filter((h) => h.kind === "jaxrs")) h.url = joinUrlPath(jaxrsBase, h.jaxrs.classPath, h.jaxrs.methodPath);

// cron / queue / dispatch
const cron = simpleYamlList(join(webInf, "cron.yaml"), "url");
const queues = simpleYamlList(join(webInf, "queue.yaml"), "name");
const dispatch = simpleYamlList(dispatchYaml, "url");
counts.cron = cron.length; counts.queues = queues.length; counts.dispatch = dispatch.length;

// frontend URL constants
if (cfg.frontend?.file) {
  const f = abs(cfg.frontend.file), feRoot = abs(cfg.frontend.repoRoot) ?? dirname(f);
  const src = stripComments(readFileSync(f, "utf8"));
  const consts = new Map([...src.matchAll(/export\s+const\s+(\w+)\s*=\s*'([^']*)'/g)].map((m) => [m[1], { value: m[2], idx: m.index }]));
  const prefix = cfg.frontend.prefixConst ? consts.get(cfg.frontend.prefixConst)?.value : "";
  for (const obj of cfg.frontend.objects ?? []) {
    const m = src.match(new RegExp(String.raw`export\s+const\s+${obj}\s*=\s*\{`));
    if (!m) { unresolved.push(`frontend object ${obj} not found in ${rel(feRoot, f)}`); continue; }
    const { inner } = balanced(src, m.index + m[0].length - 1, "{", "}");
    const off = m.index + m[0].length;
    for (const e of inner.matchAll(/(\w+)\s*:\s*'([^']*)'/g)) {
      counts.frontend++;
      callers.push({ url: joinUrlPath(prefix, e[2]), kind: "frontend", at: `${rel(feRoot, f)}:${lineAt(src, off + e.index)}` });
    }
    for (const e of inner.matchAll(/(\w+)\s*:\s*(?![\s'])([^,\n]+)/g)) unresolved.push(`frontend ${obj}.${e[1]} is not a plain string: ${e[2].trim()}`);
  }
  for (const [name, c] of consts) {
    if (name === cfg.frontend.prefixConst || !c.value.startsWith("/")) continue;
    counts.frontend++;
    callers.push({ url: c.value, kind: "frontend", at: `${rel(feRoot, f)}:${lineAt(src, c.idx)}` });
  }
}

// ---------- matching ----------
function servletMatch(pattern, url) {
  if (pattern === url) return true;
  if (pattern.endsWith("/*")) { const p = pattern.slice(0, -2); return url === p || url.startsWith(p + "/"); }
  if (pattern.startsWith("*.")) return url.endsWith(pattern.slice(1));
  if (pattern === "/") return true;
  return false;
}
// {param} segments become wildcards, so braces are left unescaped here.
const templateRe = (u) => new RegExp("^" + escapeRe(u, "{}").replace(/\{[^}]+\}/g, "[^/]+") + "/?$");
function handlerMatches(h, url) {
  if (h.kind === "servlet" || h.kind === "filter") return servletMatch(h.url, url);
  return templateRe(h.url).test(url);
}
const dispatchRe = (glob) => {
  const [host, ...rest] = glob.split("/");
  const path = "/" + rest.join("/");
  return { host, re: new RegExp("^" + escapeRe(path).replace(/\*/g, ".*") + "$") };
};
const routable = handlers.filter((h) => h.kind !== "filter");
const rows = routable.map((h) => ({ ...h, called_by: [], scheduled_by: [], routed_to: [], auth_note: [], problems: new Set(h.extraProblems ?? []) }));
const orphanRows = [];
function attach(target, fill, orphanKind) {
  const hits = rows.filter((r) => handlerMatches(r, target.url));
  if (hits.length === 0) {
    const o = { url: target.url, kind: orphanKind, http: "", handler: "", handler_at: "", status: "", called_by: [], scheduled_by: [], routed_to: [], auth_note: [], problems: new Set(["NO_HANDLER"]) };
    fill(o); orphanRows.push(o); return;
  }
  for (const r of hits) { fill(r); if (hits.length > 1) r.problems.add("AMBIGUOUS"); }
}
for (const c of callers) attach(c, (r) => r.called_by.push(c.kind === "task" ? `${c.at} (queue ${c.queue})` : c.at), c.kind);
for (const c of cron) attach(c, (r) => r.scheduled_by.push(`cron "${c.schedule}" (cron.yaml:${c.line})`), "cron");
for (const d of dispatch) {
  const { re } = dispatchRe(d.url);
  const hits = rows.filter((r) => re.test(r.url.replace(/\{[^}]+\}/g, "x")) || (r.url.endsWith("/*") && re.test(r.url.slice(0, -1) + "x")));
  for (const r of hits) r.routed_to.push(`${d.service} (dispatch.yaml:${d.line})`);
  if (!hits.length) orphanRows.push({ url: d.url, kind: "dispatch", http: "", handler: "", handler_at: "", status: "", called_by: [], scheduled_by: [], routed_to: [`${d.service} (dispatch.yaml:${d.line})`], auth_note: [], problems: new Set(["NO_HANDLER"]) });
}
for (const r of [...rows, ...orphanRows]) {
  for (const f of filterRules) {
    if (!r.url || !r.url.replace(/\/\*$/, "/").includes(f.substr)) continue;
    r.auth_note.push(`${f.bypass ? "skips login check" : "filter rule"}: contains("${f.substr}") (${f.at})`);
    if (f.bypass) r.problems.add("AUTH_BYPASS_SUBSTRING");
  }
}
for (const r of rows) {
  r.handler_at = `${rel(repoRoot, r.file)}:${r.line}`;
  if (r.status === "excluded") r.problems.add("EXCLUDED_FROM_BUILD");
  if (r.kind === "servlet" && !r.called_by.length && !r.scheduled_by.length) r.problems.add("NO_CALLER");
}
const declared = new Set(queues.map((q) => q.name));
const undeclared = queueUses.filter((q) => !declared.has(q.name));
for (const r of rows) for (const c of r.called_by) {
  const q = c.match(/\(queue ([^)]+)\)/)?.[1];
  if (q && q !== "default" && q !== "?" && !declared.has(q)) r.problems.add("QUEUE_NOT_DECLARED");
}

// ---------- output ----------
let commit = "unknown";
try {
  commit = execFileSync("git", ["-C", repoRoot, "rev-parse", "--short", "HEAD"], { encoding: "utf8" }).trim();
  const dirty = execFileSync("git", ["-C", repoRoot, "status", "--porcelain"], { encoding: "utf8" }).trim();
  const branch = execFileSync("git", ["-C", repoRoot, "rev-parse", "--abbrev-ref", "HEAD"], { encoding: "utf8" }).trim();
  commit = `${branch} @ ${commit}${dirty ? " + uncommitted changes" : ""}`;
} catch { /* not a git repo: keep "unknown" */ }
const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const generated = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())} (local time)`;
const all = [...rows, ...orphanRows].sort((a, b) => a.url.localeCompare(b.url) || a.kind.localeCompare(b.kind));
const cols = ["url", "kind", "http", "handler", "handler_at", "status", "called_by", "scheduled_by", "routed_to", "auth_note", "problems"];
const cell = (v) => (Array.isArray(v) ? v.join("; ") : v instanceof Set ? [...v].sort().join(" ") : v ?? "").toString().replace(/[\t\r\n]+/g, " ");
const tsv = [`# url-map · source: ${commit} · generated ${generated} · do not edit (regenerate with AI-skills/tools/url-map)`, cols.join("\t"), ...all.map((r) => cols.map((c) => cell(r[c])).join("\t"))].join("\n") + "\n";

const byProblem = {};
for (const r of all) for (const p of r.problems) (byProblem[p] ??= []).push(r);
const kinds = {};
for (const r of all) kinds[r.kind] = (kinds[r.kind] ?? 0) + 1;
const statuses = {};
for (const r of rows) statuses[r.status] = (statuses[r.status] ?? 0) + 1;
const listRows = (rs, max = 40) => rs.slice(0, max).map((r) => `- \`${r.url}\` (${r.kind}${r.handler ? `, ${r.handler}` : ""}${r.handler_at ? `, \`${r.handler_at}\`` : ""})`).join("\n") + (rs.length > max ? `\n- … and ${rs.length - max} more (see the TSV)` : "");
const explain = {
  NO_HANDLER: "Something calls, schedules or routes to this URL, but no handler in the code serves it.",
  EXCLUDED_FROM_BUILD: "The handler's class is excluded from compilation (pom.xml), so the URL 404s on the current build.",
  NO_CALLER: "A servlet that nothing in the code calls or schedules (it may still be called by a browser or an external system).",
  QUEUE_NOT_DECLARED: "Added to a queue that queue.yaml doesn't declare.",
  DEFAULT_PATH_GUESSED: "Endpoints method with no explicit path: URL assumed to be its name; confirm before relying on it.",
  AMBIGUOUS: "Several handlers match the same target.",
  AUTH_BYPASS_SUBSTRING: "A filter lets this URL skip the login check by a substring test, which can match more URLs than intended.",
};
const md = `# URL map — summary

Generated ${generated} from **${commit}** by \`AI-skills/tools/url-map\`. Do not edit: regenerate. Full table:
\`${basename(abs(cfg.outTsv) ?? "url-map.tsv")}\` (one row per handler URL, plus one per target nothing serves).

## Counts
Counts are of live code. "In comments" is what a plain grep also finds but the map ignores (commented-out code),
so grep total = found + in comments.

| Source | Found | In comments (ignored) |
|---|---|---|
| \`@WebServlet\` files | ${counts.webServletFiles} | ${commented.webServlet} |
| \`@WebFilter\` | ${counts.webFilter} | |
| web.xml servlet mappings (excl. the JAX-RS container) | ${counts.webXmlServlets} | |
| JAX-RS \`@Path\` annotations | ${counts.jaxrsPath} (base \`${jaxrsBase || "/"}\`) | ${commented.path} |
| Cloud Endpoints \`@ApiMethod\` | ${counts.apiMethod} | ${commented.apiMethod} |
| \`withUrl(...)\` calls | ${counts.withUrl} | ${commented.withUrl} |
| cron jobs / queues / dispatch rules | ${counts.cron} / ${counts.queues} / ${counts.dispatch} |
| frontend URL constants | ${counts.frontend} |

Rows by kind: ${Object.entries(kinds).map(([k, v]) => `${k} ${v}`).join(", ")}. Handlers by status: ${Object.entries(statuses).map(([k, v]) => `${k} ${v}`).join(", ")}.

## Problems found
${Object.keys(byProblem).length ? Object.entries(byProblem).sort().map(([p, rs]) => `### ${p} (${rs.length})\n${explain[p] ?? ""}\n\n${listRows(rs)}`).join("\n\n") : "None."}
${undeclared.length ? `\n### Queues used but not declared in queue.yaml\n${undeclared.map((q) => `- \`${q.name}\` at \`${q.at}\``).join("\n")}\n` : ""}
## Could not resolve
${unresolved.length ? unresolved.map((u) => `- ${u}`).join("\n") : "Nothing."}
`;

if (argv.includes("--stdout")) { process.stdout.write(tsv); process.exit(0); }
const outTsv = abs(cfg.outTsv) ?? fail("config needs outTsv");
const outMd = abs(cfg.outMd) ?? outTsv.replace(/\.tsv$/, ".md");
writeFileSync(outTsv, tsv);
writeFileSync(outMd, md);
console.log(`url-map: ${all.length} rows (${rows.length} handler URLs, ${orphanRows.length} targets with no handler) -> ${outTsv}`);
console.log(`problems: ${Object.entries(byProblem).map(([p, rs]) => `${p} ${rs.length}`).join(", ") || "none"}; unresolved: ${unresolved.length}`);
