#!/usr/bin/env node
// Renders a PR title and body from a draft (JSON contract) and a template. The model never formats markdown;
// this script does, so the format is identical whichever agent wrote the draft.
//
// Usage: node render.mjs --context <context.json> --draft <draft.json> [--body-out <file>] [--strict]
// Prints JSON: { title, body, needsInput, warnings }. With --strict, exits 2 if anything is [NEEDS INPUT].

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';

const SKILL_DIR = join(dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = ['feat', 'fix', 'hotfix', 'refactor', 'perf', 'chore', 'test', 'docs', 'release'];
const NEEDS_INPUT = '[NEEDS INPUT]';
const TITLE_MAX = 72;

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    const key = argv[i].replace(/^--/, '');
    if (key === 'strict') args.strict = true; else args[key] = argv[++i];
  }
  return args;
}

const readJson = path => JSON.parse(readFileSync(path, 'utf8').replace(/^﻿/, ''));

function templatePath(context) {
  const name = `${context.template}.md`;
  if (context.templatesDir) {
    const dir = isAbsolute(context.templatesDir) ? context.templatesDir : join(context.root, context.templatesDir);
    if (existsSync(join(dir, name))) return join(dir, name);
  }
  return join(SKILL_DIR, 'templates', name);
}

function renderTitle(draft, context, warnings) {
  const t = draft.title || {};
  const type = t.type || NEEDS_INPUT;
  const summary = (t.summary || NEEDS_INPUT).trim();
  const ticketId = t.ticketId || context.branch.ticketId;
  if (!TYPES.includes(type)) warnings.push(`Title type "${type}" is not one of: ${TYPES.join(', ')}.`);
  if (/\.$/.test(summary)) warnings.push('Title summary ends with a period.');
  if (/^[A-Z]/.test(summary)) warnings.push('Title summary should start lowercase.');
  if (/^\w+(ing|ed)\b/i.test(summary)) warnings.push('Title summary should be imperative ("add", not "adding"/"added").');
  if (t.scope && context.scopes?.length && !context.scopes.includes(t.scope)) {
    warnings.push(`Scope "${t.scope}" is not in the repo's scope list (${context.scopes.join(', ')}).`);
  }
  if (type === 'release') return `release: ${context.branch.releaseVersion || summary}`;
  const head = t.scope ? `${type}(${t.scope})` : type;
  const title = `${head}: ${summary} [#${ticketId || NEEDS_INPUT}]`;
  if (title.length > TITLE_MAX) warnings.push(`Title is ${title.length} characters (max ${TITLE_MAX}).`);
  return title;
}

function fillPlaceholders(text, values) {
  return text.replace(/\{\{(\w+)(?:\|([^}]*))?\}\}/g, (_, key, fallback) => {
    const v = values[key];
    if (v !== undefined && v !== null && String(v).trim() !== '') return String(v);
    return fallback !== undefined ? fallback : NEEDS_INPUT;
  });
}

function renderBody(template, draft, context) {
  const sections = draft.sections || {};
  const required = new Set(context.requiredSections || []);
  const values = {
    ticketId: draft.title?.ticketId || context.branch.ticketId,
    releaseVersion: context.branch.releaseVersion,
    designDoc: context.designDocUrl,
    ...(draft.fields || {}),
  };

  const blocks = template.replace(/\r\n/g, '\n').split(/\n(?=## )/);
  const out = [];
  for (const block of blocks) {
    const keyMatch = block.match(/<!--\s*key:\s*(\w+)\s*-->/);
    if (!keyMatch) {
      out.push(block);
      continue;
    }
    const key = keyMatch[1];
    const text = (sections[key]?.text ?? '').trim();
    if (!text && !required.has(key)) continue;
    const filled = block.replace(keyMatch[0], text || NEEDS_INPUT);
    out.push(filled);
  }
  const body = out.join('\n')
    .replace(/<!--[\s\S]*?-->\n?/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return fillPlaceholders(body, values) + '\n';
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.context || !args.draft) throw new Error('Usage: render.mjs --context <file> --draft <file> [--body-out <file>] [--strict]');
  const context = readJson(args.context);
  const draft = readJson(args.draft);
  const warnings = [];

  const title = renderTitle(draft, context, warnings);
  const template = readFileSync(templatePath(context), 'utf8');
  const body = renderBody(template, draft, context);

  const templateKeys = [...template.matchAll(/<!--\s*key:\s*(\w+)\s*-->/g)].map(m => m[1]);
  const unknown = Object.keys(draft.sections || {}).filter(k => !templateKeys.includes(k));
  if (unknown.length) warnings.push(`Draft sections not in the ${context.template} template were ignored: ${unknown.join(', ')}.`);

  const concerns = draft.detected?.unrelatedConcerns || [];
  if (concerns.length > 2) warnings.push(`This PR appears to bundle ${concerns.length} unrelated concerns (${concerns.join(', ')}). Consider splitting it.`);
  const needsInput = (title + body).split(NEEDS_INPUT).length - 1;

  if (args['body-out']) writeFileSync(args['body-out'], body);
  process.stdout.write(JSON.stringify({ title, body, needsInput, warnings }, null, 2) + '\n');
  if (args.strict && needsInput > 0) process.exit(2);
}

try {
  main();
} catch (e) {
  process.stderr.write(`describe-pr render: ${e.message}\n`);
  process.exit(1);
}
