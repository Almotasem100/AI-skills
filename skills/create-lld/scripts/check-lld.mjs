#!/usr/bin/env node
// Structural/content-smell checks for the adaptive feature-level LLD.
// Usage: node check-lld.mjs <lld.md> [--size small|normal]
// Prints JSON: { errors, warnings, needsInput }. Exits 1 on structural errors.

import { readFileSync } from 'node:fs';

const HEADER = /^# LLD — [A-Za-z0-9][A-Za-z0-9._-]*: .+\s*$/;
const CORE = ['Context', 'Objectives & constraints', 'Design'];
const CONDITIONAL = ['Impact & risks', 'Verification intent', 'Rollout & rollback', 'Open questions'];
const VAGUE = /\b(seamless(ly)?|robust|absolute|cleanly|leverag(e|es|ing)|best[- ]in[- ]class|state[- ]of[- ]the[- ]art|etc\.?)(?![\w-])/gi;

function parseArgs(argv) {
  const args = { size: 'normal' };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--size') args.size = argv[++i]; else args.file = argv[i];
  }
  return args;
}

function sections(md) {
  const out = new Map();
  const re = /^##\s+(.+)$/gm;
  const matches = [...md.matchAll(re)];
  for (let i = 0; i < matches.length; i++) {
    const title = matches[i][1].trim();
    const start = matches[i].index + matches[i][0].length;
    const end = i + 1 < matches.length ? matches[i + 1].index : md.length;
    out.set(title, md.slice(start, end).replace(/<!--[\s\S]*?-->/g, '').trim());
  }
  return out;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.file || !['small', 'normal'].includes(args.size)) {
    throw new Error('Usage: check-lld.mjs <lld.md> [--size small|normal]');
  }
  const md = readFileSync(args.file, 'utf8').replace(/^﻿/, '').replace(/\r\n/g, '\n');
  const errors = [], warnings = [];

  const first = md.split('\n').find(l => l.trim()) || '';
  if (!HEADER.test(first.trim())) errors.push('First line must be: # LLD — <FEATURE-ID>: <Title>');
  if (/<!--/.test(md)) errors.push('Template comments remain; remove every <!-- … --> block.');
  if (/^\s*(N\/A|n\/a|NA|None\.?)\s*$/m.test(md) || /\|\s*N\/A\s*\|/.test(md)) {
    errors.push('Remove inapplicable sections/rows instead of writing N/A/None.');
  }

  const s = sections(md);
  for (const title of CORE) {
    if (!s.has(title)) errors.push(`Required core section missing: ${title}.`);
  }
  for (const [title, body] of s.entries()) {
    if (!body) errors.push(`Section "${title}" is empty; fill it or omit it.`);
  }

  if (s.has('Material decisions')) {
    const body = s.get('Material decisions');
    const rows = body.split('\n').filter(l => /^\s*\|/.test(l));
    if (rows.length < 3) warnings.push('Material decisions has no populated table row; remove the section if no decision is material.');
  }

  for (const title of CONDITIONAL) {
    if (s.has(title) && !s.get(title).trim()) errors.push(`Conditional section "${title}" is empty; omit it.`);
  }

  const repeated = ['Functional requirements', 'User flows', 'Business rules', 'Acceptance criteria']
    .filter(k => md.includes(k));
  if (repeated.length) warnings.push('This looks like Functional Design content; keep the LLD technical and avoid requirement repetition.');

  const vague = [...new Set([...md.matchAll(VAGUE)].map(x => x[0].toLowerCase()))];
  if (vague.length) warnings.push(`Vague wording, replace with something checkable: ${vague.join(', ')}.`);

  const needsInput = (md.match(/\[NEEDS INPUT\]/g) || []).length;
  process.stdout.write(JSON.stringify({ errors, warnings, needsInput }, null, 2) + '\n');
  if (errors.length) process.exit(1);
}

try { main(); } catch (e) {
  process.stderr.write(`create-lld check: ${e.message}\n`);
  process.exit(2);
}
