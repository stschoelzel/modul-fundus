#!/usr/bin/env node
// Kompiliert fundus.yaml zu fundus-data.js (window.FUNDUS_DATA = [...]),
// damit index.html per file:// ohne Server/fetch geladen werden kann.
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'fundus.yaml');
const OUT = path.join(ROOT, 'fundus-data.js');

const REQUIRED_FIELDS = ['id', 'thema', 'typ', 'echtheit', 'freigabe'];

const data = yaml.load(fs.readFileSync(SRC, 'utf8'));
if (!Array.isArray(data) || data.length === 0) {
  throw new Error('fundus.yaml ist leer oder keine Liste von Items');
}

const seenIds = new Set();
data.forEach((item, i) => {
  REQUIRED_FIELDS.forEach(f => {
    if (item[f] === undefined || item[f] === null) {
      throw new Error(`Item #${i} (${item.id || '?'}) fehlt Pflichtfeld "${f}"`);
    }
  });
  if (seenIds.has(item.id)) throw new Error(`Doppelte id: ${item.id}`);
  seenIds.add(item.id);
});

const banner = '// Auto-generiert aus fundus.yaml durch build/compile-fundus.js - nicht manuell editieren.\n';
fs.writeFileSync(OUT, banner + 'window.FUNDUS_DATA = ' + JSON.stringify(data, null, 2) + ';\n');
console.log(`fundus-data.js geschrieben (${data.length} Items).`);
