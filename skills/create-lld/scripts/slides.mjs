#!/usr/bin/env node
// Extracts the text, speaker notes and images of a PowerPoint (.pptx) file, slide by slide, so any agent can
// read customer slides. No dependencies: a .pptx is a zip of XML files.
//
// Usage: node slides.mjs <file.pptx> [--media-dir <dir>] [--out <file.md>]
// Prints markdown (or writes it to --out). With --media-dir, each slide's images are saved there as
// slide-<n>-<name> and listed under the slide, so the agent can look at them.

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';
import { join, posix } from 'node:path';

function readZip(path) {
  const buf = readFileSync(path);
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error(`${path} is not a zip file (a .pptx is one; for .ppt, save it as .pptx or PDF first).`);
  const count = buf.readUInt16LE(eocd + 10);
  let offset = buf.readUInt32LE(eocd + 16);
  if (offset === 0xffffffff) throw new Error('ZIP64 files are not supported; save the presentation as PDF instead.');

  const entries = new Map();
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(offset) !== 0x02014b50) throw new Error('Corrupt zip central directory.');
    const method = buf.readUInt16LE(offset + 10);
    const size = buf.readUInt32LE(offset + 20);
    const nameLen = buf.readUInt16LE(offset + 28);
    const extraLen = buf.readUInt16LE(offset + 30);
    const commentLen = buf.readUInt16LE(offset + 32);
    const local = buf.readUInt32LE(offset + 42);
    const name = buf.toString('utf8', offset + 46, offset + 46 + nameLen);
    entries.set(name, { method, size, local });
    offset += 46 + nameLen + extraLen + commentLen;
  }

  return {
    names: [...entries.keys()],
    read(name) {
      const e = entries.get(name);
      if (!e) return null;
      const start = e.local + 30 + buf.readUInt16LE(e.local + 26) + buf.readUInt16LE(e.local + 28);
      const data = buf.subarray(start, start + e.size);
      if (e.method === 0) return Buffer.from(data);
      if (e.method === 8) return inflateRawSync(data);
      throw new Error(`Unsupported zip compression method ${e.method} in ${name}.`);
    },
  };
}

const decode = s => s
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&amp;/g, '&');

function paragraphs(xml) {
  const out = [];
  for (const [, p] of xml.matchAll(/<a:p(?:\s[^>]*)?>([\s\S]*?)<\/a:p>/g)) {
    const text = [...p.matchAll(/<a:t(?:\s[^>]*)?>([\s\S]*?)<\/a:t>/g)].map(m => decode(m[1])).join('').trim();
    if (text) out.push(text);
  }
  return out;
}

function rels(zip, partPath) {
  const relPath = posix.join(posix.dirname(partPath), '_rels', `${posix.basename(partPath)}.rels`);
  const xml = zip.read(relPath)?.toString('utf8') || '';
  return [...xml.matchAll(/<Relationship\b([^>]*)\/?>/g)].map(([, attrs]) => {
    const get = k => attrs.match(new RegExp(`\\b${k}="([^"]*)"`))?.[1];
    return { id: get('Id'), type: get('Type') || '', target: posix.normalize(posix.join(posix.dirname(partPath), get('Target') || '')) };
  });
}

function slideOrder(zip) {
  const pres = zip.read('ppt/presentation.xml')?.toString('utf8');
  const byId = Object.fromEntries(rels(zip, 'ppt/presentation.xml').map(r => [r.id, r.target]));
  const ordered = pres ? [...pres.matchAll(/<p:sldId\b[^>]*\br:id="([^"]+)"/g)].map(m => byId[m[1]]).filter(Boolean) : [];
  if (ordered.length) return ordered;
  return zip.names.filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n))
    .sort((a, b) => Number(a.match(/(\d+)\.xml$/)[1]) - Number(b.match(/(\d+)\.xml$/)[1]));
}

function main() {
  const argv = process.argv.slice(2);
  let file;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) i++; else file ??= argv[i];
  }
  const opt = k => { const i = argv.indexOf(`--${k}`); return i >= 0 ? argv[i + 1] : undefined; };
  if (!file) throw new Error('Usage: slides.mjs <file.pptx> [--media-dir <dir>] [--out <file.md>]');
  const mediaDir = opt('media-dir');
  if (mediaDir) mkdirSync(mediaDir, { recursive: true });

  const zip = readZip(file);
  const lines = [`# Slides: ${file.split(/[\\/]/).pop()}`, ''];
  slideOrder(zip).forEach((slidePath, index) => {
    const n = index + 1;
    const xml = zip.read(slidePath)?.toString('utf8') || '';
    const text = paragraphs(xml);
    const slideRels = rels(zip, slidePath);
    lines.push(`## Slide ${n}${text[0] ? ` — ${text[0]}` : ''}`, '');
    lines.push(...(text.length > 1 ? text.slice(1).map(t => `- ${t}`) : text.length ? [] : ['_(no text on this slide)_']));

    const notesPart = slideRels.find(r => r.type.endsWith('/notesSlide'));
    const notes = notesPart ? paragraphs(zip.read(notesPart.target)?.toString('utf8') || '').filter(t => !/^\d+$/.test(t)) : [];
    if (notes.length) lines.push('', `**Speaker notes:** ${notes.join(' ')}`);

    const images = slideRels.filter(r => r.type.endsWith('/image'));
    if (images.length) {
      if (mediaDir) {
        const saved = images.map(img => {
          const data = zip.read(img.target);
          if (!data) return null;
          const out = join(mediaDir, `slide-${n}-${posix.basename(img.target)}`);
          writeFileSync(out, data);
          return out;
        }).filter(Boolean);
        lines.push('', `**Images:** ${saved.join(', ')}`);
      } else lines.push('', `**Images:** ${images.length} (run with --media-dir to extract and view them)`);
    }
    lines.push('');
  });

  const md = lines.join('\n');
  if (opt('out')) writeFileSync(opt('out'), md); else process.stdout.write(md + '\n');
}

try {
  main();
} catch (e) {
  process.stderr.write(`create-lld slides: ${e.message}\n`);
  process.exit(1);
}
