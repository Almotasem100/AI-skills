#!/usr/bin/env node
// Checks an LLD section against the template's rules, so every agent's output meets the same bar.
//
// Usage: node check-lld.mjs <lld.md> [--size small|normal]
// Prints JSON: { errors, warnings, needsInput }. Exits 1 when there are errors.

import { readFileSync } from 'node:fs';

const REQUIRED = {
  normal: ['1', '2', '3', '6', '7', '8'],
  small: ['1', '2', '7'],
};
const HEADER = /^# LLD — [A-Z][A-Z0-9]*-\d+: .+\s*$/;
// Wording that sounds precise but names nothing an architect can check.
const VAGUE = /\b(seamless(ly)?|robust|absolute|cleanly|leverag(e|es|ing)|best[- ]in[- ]class|state[- ]of[- ]the[- ]art|etc\.?)(?![\w-])/gi;

function parseArgs(argv) {
  const args = { size: 'normal' };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--size') args.size = argv[++i]; else args.file = argv[i];
  }
  return args;
}

function sections(md) {
  const result = {};
  const parts = md.split(/\n(?=## )/);
  for (const part of parts) {
    const m = part.match(/^## (\d+)\.\s*(.+)/);
    if (m) result[m[1]] = { title: m[2].trim(), body: part.slice(part.indexOf('\n') + 1).replace(/<!--[\s\S]*?-->/g, '') };
  }
  return result;
}

function tableRows(body) {
  return body.split('\n').filter(l => /^\s*\|/.test(l) && !/^\s*\|[\s:|-]+\|\s*$/.test(l))
    .slice(1)
    .map(l => l.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim()));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.file || !REQUIRED[args.size]) throw new Error('Usage: check-lld.mjs <lld.md> [--size small|normal]');
  const md = readFileSync(args.file, 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n');
  const errors = [];
  const warnings = [];

  const firstLine = md.split('\n').find(l => l.trim() !== '') || '';
  if (!HEADER.test(firstLine.trim())) {
    errors.push('First line must be: # LLD — <JIRA-ID>: <Title>');
  }
  if (!/\*\*Release \/ Sprint:\*\*.*\*\*Tech designer:\*\*.*\*\*Status:\*\*/.test(md)) {
    errors.push('Missing the metadata line: **Release / Sprint:** … · **Tech designer:** … · **Status:** …');
  }
  if (/<!--/.test(md)) errors.push('Template comments are still present; remove every <!-- … --> block.');
  if (/^\s*(N\/A|n\/a|NA|None\.?)\s*$/m.test(md) || /\|\s*N\/A\s*\|/.test(md)) {
    errors.push('"N/A" found: remove sections or rows that don\'t apply instead.');
  }

  const s = sections(md);
  for (const n of REQUIRED[args.size]) if (!s[n]) errors.push(`Section ${n} is required for a ${args.size} ticket.`);
  if (!s['4'] && !s['5']) errors.push('At least one of section 4 (Backend design) or 5 (Frontend design) is required.');

  for (const [n, { title, body }] of Object.entries(s)) {
    const content = body.replace(/^###.*$/gm, '').trim();
    if (!content) errors.push(`Section ${n} (${title}) is empty: fill it or remove it.`);
    const emptySub = body.match(/^### .+\n+(?=###|$)/gm);
    if (emptySub) errors.push(`Section ${n} has empty subsections (${emptySub.map(x => x.trim()).join('; ')}): remove them.`);
  }

  if (s['2'] && !/out of scope/i.test(s['2'].body)) warnings.push('Section 2 has no "Out of scope" list.');

  if (s['3']) {
    const rows = tableRows(s['3'].body);
    if (!rows.length) errors.push('Section 3 has no decisions in its table.');
    rows.forEach((r, i) => {
      if (r.length !== 4) return errors.push(`Decision row ${i + 1} must have 4 columns: Area | Planned design | Alternative or deferred option | Key boundary.`);
      if (!r[1]) errors.push(`Decision row ${i + 1} ("${r[0]}") has no planned design.`);
    });
  }

  if (s['6']) {
    tableRows(s['6'].body).forEach((r, i) => {
      if (r.length >= 3 && !r[2]) warnings.push(`Risk row ${i + 1} ("${r[0]}") has no mitigation.`);
    });
  }

  if (s['7']) {
    const lines = s['7'].body.split('\n').filter(l => /^\s*([-*]|\d+\.)\s+/.test(l));
    const loose = lines.filter(l => !/^\s*([-*]|\d+\.)\s+(Verify\b|Verified\b|\[NEEDS INPUT\])/.test(l));
    if (loose.length) warnings.push(`Section 7: ${loose.length} line(s) are not phrased as a verification check ("Verify …").`);
  }

  const vague = [...new Set([...md.matchAll(VAGUE)].map(m => m[0].toLowerCase()))];
  if (vague.length) warnings.push(`Vague wording, replace with something checkable: ${vague.join(', ')}.`);

  const needsInput = (md.match(/\[NEEDS INPUT\]/g) || []).length;
  process.stdout.write(JSON.stringify({ errors, warnings, needsInput }, null, 2) + '\n');
  if (errors.length) process.exit(1);
}

try {
  main();
} catch (e) {
  process.stderr.write(`create-lld check: ${e.message}\n`);
  process.exit(2);
}
