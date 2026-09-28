#!/usr/bin/env node
// check-citations.mjs: re-check every `file:line` citation in markdown files against the real files.
//
// Recognised forms (inside or outside backticks):
//   path/to/File.java:82        File.java:82-90        File.java:35,52        .gitignore:21
//   C:\abs\path\File.java:82    File.java:82 "TOOL_TYPES"   (the quoted token must appear on that line / range)
// A bare name or partial path is looked up under the --root folders (suffix match). Fenced code blocks are
// skipped. URLs are ignored.
//
// Result per citation: OK, WARN (ambiguous: several files match and nothing disambiguates) or STALE (file
// missing, line out of range, or token not on the cited lines). Exit code 1 if anything is STALE, so a
// closeout can be blocked on it; 2 on a usage error; 0 otherwise.
//
// Usage: node check-citations.mjs <file.md>... --root <dir> [--root <dir>...] [--json]
// Node 18+, no dependencies.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, resolve, isAbsolute, sep } from "node:path";

const SKIP_DIRS = new Set([".git", "node_modules", "target", "dist", "build", "bin", ".angular", "out", "coverage"]);

function parseArgs(argv) {
  const opts = { files: [], roots: [], json: false };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--root") opts.roots.push(argv[++i]);
    else if (a === "--json") opts.json = true;
    else if (a === "-h" || a === "--help") opts.help = true;
    else if (a.startsWith("--")) throw new Error(`unknown option ${a}`);
    else opts.files.push(a);
  }
  return opts;
}

// Every file under the roots, as absolute paths with forward slashes, for suffix lookup.
function indexRoots(roots) {
  const all = [];
  const walk = (dir) => {
    let entries;
    try { entries = readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const p = join(dir, e.name);
      if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) walk(p); }
      else if (e.isFile()) all.push(p.split(sep).join("/"));
    }
  };
  for (const r of roots) walk(resolve(r));
  return all;
}

const CITATION = new RegExp(
  String.raw`(?<![\w/\\.:-])` +                                   // not in the middle of a word, path or URL
  String.raw`(?<path>(?:[A-Za-z]:[\\/])?(?:[\w.-]+[\\/])*[\w.-]*\.[A-Za-z][A-Za-z0-9]*)` +
  String.raw`:(?<lines>\d+(?:-\d+)?(?:,\s?\d+(?:-\d+)?)*)(?![\w])` +
  String.raw`(?:\`?\s+"(?<token>[^"\n]+)")?`,
  "g",
);

function extractCitations(text) {
  const out = [];
  let inFence = false;
  text.split(/\r?\n/).forEach((line, i) => {
    if (/^\s*(```|~~~)/.test(line)) { inFence = !inFence; return; }
    if (inFence) return;
    for (const m of line.matchAll(CITATION)) {
      if (/https?:\/\/\S*$/.test(line.slice(0, m.index))) continue; // part of a URL
      out.push({ docLine: i + 1, raw: m[0], ...m.groups });
    }
  });
  return out;
}

function parseLines(spec) {
  return spec.split(",").map((part) => {
    const [a, b] = part.trim().split("-").map(Number);
    return { from: a, to: b ?? a };
  });
}

function candidates(path, index, roots) {
  if (isAbsolute(path) || /^[A-Za-z]:[\\/]/.test(path)) return existsSync(path) ? [resolve(path)] : [];
  // A path written from a root wins, even inside a folder the index skips (e.g. node_modules/...).
  const direct = roots.map((r) => resolve(r, path)).filter((p) => existsSync(p) && statSync(p).isFile());
  if (direct.length) return [...new Set(direct)];
  const suffix = "/" + path.replace(/\\/g, "/").replace(/^\.\//, "");
  return index.filter((f) => f.endsWith(suffix));
}

function checkOne(c, index, cache, roots) {
  const files = candidates(c.path, index, roots);
  if (files.length === 0) return { status: "STALE", reason: "file not found under the roots" };
  const ranges = parseLines(c.lines);
  const verdicts = files.map((f) => {
    if (!cache.has(f)) cache.set(f, readFileSync(f, "utf8").split(/\r?\n/));
    const lines = cache.get(f);
    const count = lines.length - (lines.at(-1) === "" ? 1 : 0);
    for (const r of ranges) {
      if (r.from < 1 || r.to < r.from) return { file: f, ok: false, reason: `bad range ${r.from}-${r.to}` };
      if (r.to > count) return { file: f, ok: false, reason: `line ${r.to} > ${count} lines` };
    }
    if (c.token) {
      const hit = ranges.some((r) => lines.slice(r.from - 1, r.to).some((l) => l.includes(c.token)));
      if (!hit) return { file: f, ok: false, reason: `"${c.token}" not on line ${c.lines}` };
    }
    return { file: f, ok: true };
  });
  const good = verdicts.filter((v) => v.ok);
  if (files.length === 1) {
    return good.length ? { status: "OK", file: files[0] } : { status: "STALE", file: files[0], reason: verdicts[0].reason };
  }
  if (good.length === 0) return { status: "STALE", reason: `${files.length} matches, none valid: ${verdicts[0].reason}`, files };
  if (good.length === 1 && c.token) return { status: "OK", file: good[0].file, note: `${files.length} matches, token picks one` };
  return { status: "WARN", reason: `ambiguous: ${files.length} files match; give a longer path or a "token"`, files };
}

function main() {
  let opts;
  try { opts = parseArgs(process.argv.slice(2)); } catch (e) { console.error(e.message); process.exit(2); }
  if (opts.help || opts.files.length === 0) {
    console.error("Usage: node check-citations.mjs <file.md>... --root <dir> [--root <dir>...] [--json]");
    process.exit(opts.help ? 0 : 2);
  }
  for (const r of opts.roots) {
    if (!existsSync(r) || !statSync(r).isDirectory()) { console.error(`--root is not a folder: ${r}`); process.exit(2); }
  }
  const index = indexRoots(opts.roots);
  const cache = new Map();
  const results = [];
  for (const doc of opts.files) {
    let text;
    try { text = readFileSync(doc, "utf8"); } catch { console.error(`cannot read ${doc}`); process.exit(2); }
    for (const c of extractCitations(text)) results.push({ doc, ...c, ...checkOne(c, index, cache, opts.roots) });
  }
  const count = (s) => results.filter((r) => r.status === s).length;
  const summary = { citations: results.length, ok: count("OK"), warn: count("WARN"), stale: count("STALE") };

  if (opts.json) {
    console.log(JSON.stringify({ summary, results }, null, 2));
  } else {
    for (const r of results) {
      if (r.status === "OK") continue;
      console.log(`${r.status.padEnd(5)} ${r.doc}:${r.docLine}  ${r.raw}  -> ${r.reason}`);
      for (const f of r.files ?? []) console.log(`        ${f}`);
    }
    console.log(`\n${summary.citations} citations: ${summary.ok} OK, ${summary.warn} WARN, ${summary.stale} STALE`);
    console.log(summary.stale ? "BLOCKED: fix or remove the STALE citations, then re-run." : "No stale citations.");
  }
  process.exit(summary.stale ? 1 : 0);
}

main();
