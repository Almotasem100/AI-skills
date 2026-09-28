#!/usr/bin/env node
// compare.mjs: diff two recorded JSON API responses (a reference and a candidate) and list every difference.
//
// Made for "old endpoint vs ported endpoint" checks: record the old response, record the new one with the
// same inputs, compare. Nothing is ignored silently: fields skipped by the config are listed in the report,
// and values that differ only in type (the string "42" vs the number 42) are reported in their own group.
//
// A recording is either the raw JSON response, or an envelope {"meta": {...}, "response": <json>}
// (the envelope's meta, e.g. endpoint, inputs, version, date, is printed but not compared).
//
// Usage: node compare.mjs <reference.json> <candidate.json> [--config <rules.json>] [--json]
// Rules file (all optional):
//   {
//     "ignore":    ["items[*].createdAt", "**.updatedAt"],   // paths to skip (listed in the report)
//     "rename":    {"userEmail": "email"},                    // reference path -> candidate path, applied first
//     "unordered": ["roles", "items"]                         // arrays compared regardless of order
//   }
// Paths: dot-separated keys, [n] or [*] for array items, * for any one key, ** for any depth.
// Exit code: 0 identical (after the rules), 1 differences found, 2 usage or input error. Node 18+, no deps.

import { readFileSync } from "node:fs";

function fail(msg) { console.error(msg); process.exit(2); }

function parseArgs(argv) {
  const o = { files: [], config: null, json: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--config") o.config = argv[++i];
    else if (argv[i] === "--json") o.json = true;
    else if (argv[i].startsWith("--")) fail(`unknown option ${argv[i]}`);
    else o.files.push(argv[i]);
  }
  if (o.files.length !== 2) fail("Usage: node compare.mjs <reference.json> <candidate.json> [--config <rules.json>] [--json]");
  return o;
}

function load(file) {
  let data;
  try { data = JSON.parse(readFileSync(file, "utf8").replace(/^﻿/, "")); }
  catch (e) { fail(`cannot read JSON from ${file}: ${e.message}`); }
  const isEnvelope = data && typeof data === "object" && !Array.isArray(data) && "response" in data && "meta" in data;
  return isEnvelope ? { meta: data.meta, body: data.response } : { meta: null, body: data };
}

// ---- paths -------------------------------------------------------------------------------------------
const join = (base, key) => (typeof key === "number" ? `${base}[${key}]` : base ? `${base}.${key}` : key);
const tokens = (path) => path.replace(/\[(\d+|\*)\]/g, ".[$1]").split(".").filter(Boolean);

function matches(pattern, path) {
  const p = tokens(pattern), s = tokens(path);
  const walk = (i, j) => {
    if (i === p.length) return j === s.length;
    if (p[i] === "**") return Array.from({ length: s.length - j + 1 }, (_, k) => j + k).some((k) => walk(i + 1, k));
    if (j === s.length) return false;
    const ok = p[i] === s[j] || (p[i] === "*" && !s[j].startsWith("[")) || (p[i] === "[*]" && s[j].startsWith("["));
    return ok && walk(i + 1, j + 1);
  };
  return walk(0, 0);
}
const stripIndexes = (path) => path.replace(/\[\d+\]/g, "[*]");

// ---- rename: move values in the reference so its shape matches the candidate's --------------------------
function getAt(obj, keys) { return keys.reduce((o, k) => (o == null ? undefined : o[k]), obj); }
function applyRenames(body, renames, notes) {
  for (const [from, to] of Object.entries(renames ?? {})) {
    const fk = from.split("."), tk = to.split(".");
    const parent = getAt(body, fk.slice(0, -1));
    if (!parent || typeof parent !== "object" || !(fk.at(-1) in parent)) { notes.push(`rename ${from} -> ${to}: not present in reference`); continue; }
    const value = parent[fk.at(-1)];
    delete parent[fk.at(-1)];
    let target = body;
    for (const k of tk.slice(0, -1)) target = target[k] ??= {};
    target[tk.at(-1)] = value;
    notes.push(`rename ${from} -> ${to}`);
  }
}

// ---- diff ----------------------------------------------------------------------------------------------
const kind = (v) => (v === null ? "null" : Array.isArray(v) ? "array" : typeof v);
const canon = (v) => JSON.stringify(v, (_, x) => (x && typeof x === "object" && !Array.isArray(x) ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, x[k]])) : x));

function diff(a, b, rules, path, out) {
  if (rules.ignore.some((pat) => matches(pat, path) || matches(pat, stripIndexes(path)))) {
    if (path) out.ignored.add(stripIndexes(path));
    return;
  }
  const ka = kind(a), kb = kind(b);
  if (ka !== kb) {
    const numStr = (x, y) => typeof x === "string" && typeof y === "number" && x.trim() !== "" && Number(x) === y;
    if (numStr(a, b) || numStr(b, a)) out.typeOnly.push({ path, reference: a, candidate: b });
    else out.changed.push({ path, reference: a, candidate: b });
    return;
  }
  if (ka === "object") {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      const p = join(path, k);
      if (!(k in b)) { if (!isIgnored(p, rules, out)) out.missing.push({ path: p, reference: a[k] }); }
      else if (!(k in a)) { if (!isIgnored(p, rules, out)) out.added.push({ path: p, candidate: b[k] }); }
      else diff(a[k], b[k], rules, p, out);
    }
    return;
  }
  if (ka === "array") {
    if (rules.unordered.some((pat) => matches(pat, path) || matches(pat, stripIndexes(path)))) {
      const sa = [...a].sort((x, y) => canon(x).localeCompare(canon(y)));
      const sb = [...b].sort((x, y) => canon(x).localeCompare(canon(y)));
      out.notes.add(`${stripIndexes(path) || "(root)"}: compared as unordered`);
      a = sa; b = sb;
    }
    if (a.length !== b.length) out.changed.push({ path: `${path}.length`, reference: a.length, candidate: b.length });
    for (let i = 0; i < Math.min(a.length, b.length); i++) diff(a[i], b[i], rules, join(path, i), out);
    return;
  }
  if (a !== b) out.changed.push({ path, reference: a, candidate: b });
}
function isIgnored(p, rules, out) {
  const hit = rules.ignore.some((pat) => matches(pat, p) || matches(pat, stripIndexes(p)));
  if (hit) out.ignored.add(stripIndexes(p));
  return hit;
}

// ---- main ----------------------------------------------------------------------------------------------
const opts = parseArgs(process.argv.slice(2));
let rules = { ignore: [], rename: {}, unordered: [] };
if (opts.config) {
  try { rules = { ...rules, ...JSON.parse(readFileSync(opts.config, "utf8").replace(/^﻿/, "")) }; }
  catch (e) { fail(`cannot read rules from ${opts.config}: ${e.message}`); }
}
const ref = load(opts.files[0]), cand = load(opts.files[1]);
const renameNotes = [];
applyRenames(ref.body, rules.rename, renameNotes);
const out = { changed: [], missing: [], added: [], typeOnly: [], ignored: new Set(), notes: new Set(renameNotes) };
diff(ref.body, cand.body, rules, "", out);

const total = out.changed.length + out.missing.length + out.added.length + out.typeOnly.length;
const report = {
  reference: { file: opts.files[0], meta: ref.meta },
  candidate: { file: opts.files[1], meta: cand.meta },
  identical: total === 0,
  counts: { changed: out.changed.length, missing: out.missing.length, added: out.added.length, typeOnly: out.typeOnly.length },
  changed: out.changed, missing: out.missing, added: out.added, typeOnly: out.typeOnly,
  ignoredByRules: [...out.ignored].sort(), notes: [...out.notes],
};

if (opts.json) {
  console.log(JSON.stringify(report, null, 2));
} else {
  const show = (v) => { const s = JSON.stringify(v); return s === undefined ? "undefined" : s.length > 120 ? s.slice(0, 117) + "..." : s; };
  const where = (p) => p || "(root)";
  console.log(`reference: ${opts.files[0]}${ref.meta ? `  ${show(ref.meta)}` : ""}`);
  console.log(`candidate: ${opts.files[1]}${cand.meta ? `  ${show(cand.meta)}` : ""}\n`);
  for (const d of out.changed) console.log(`CHANGED   ${where(d.path)}: ${show(d.reference)} -> ${show(d.candidate)}`);
  for (const d of out.missing) console.log(`MISSING   ${where(d.path)} (in reference only): ${show(d.reference)}`);
  for (const d of out.added) console.log(`ADDED     ${where(d.path)} (in candidate only): ${show(d.candidate)}`);
  for (const d of out.typeOnly) console.log(`TYPE-ONLY ${where(d.path)}: ${show(d.reference)} -> ${show(d.candidate)} (same value, string vs number)`);
  if (report.ignoredByRules.length) console.log(`\nIgnored by rules (not compared): ${report.ignoredByRules.join(", ")}`);
  if (report.notes.length) console.log(`Notes: ${report.notes.join("; ")}`);
  console.log(`\n${total ? `${total} difference(s)` : "IDENTICAL"}: ${out.changed.length} changed, ${out.missing.length} missing, ${out.added.length} added, ${out.typeOnly.length} type-only`);
}
process.exit(total ? 1 : 0);
