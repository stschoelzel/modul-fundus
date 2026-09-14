#!/usr/bin/env node
// Kompiliert export-templates/*.html + templates.yaml zu export-templates-data.js
// (window.EXPORT_TEMPLATES = [...], window.EXPORT_TEMPLATES_CSS = "..."), damit index.html
// sie per file:// ohne Server/fetch laden kann - gleiches Prinzip wie compile-fundus.js.
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const ROOT = path.join(__dirname, '..');
const DIR = path.join(ROOT, 'export-templates');
const MANIFEST = path.join(DIR, 'templates.yaml');
const OUT = path.join(ROOT, 'export-templates-data.js');
const PREVIEW_EXTENSIONS = ['png', 'jpg', 'jpeg', 'svg'];

const manifest = yaml.load(fs.readFileSync(MANIFEST, 'utf8'));
if (!Array.isArray(manifest) || manifest.length === 0) {
  throw new Error('templates.yaml ist leer oder keine Liste von Vorlagen');
}

const cssPath = path.join(DIR, 'export-templates.css');
const css = fs.existsSync(cssPath) ? fs.readFileSync(cssPath, 'utf8') : '';

const seenIds = new Set();
const templates = manifest.map(tpl => {
  ['id', 'label', 'size', 'html'].forEach(f => {
    if (!tpl[f]) throw new Error(`Vorlage ${tpl.id || '?'} fehlt Pflichtfeld "${f}"`);
  });
  if (seenIds.has(tpl.id)) throw new Error(`Doppelte Vorlagen-id: ${tpl.id}`);
  seenIds.add(tpl.id);

  const htmlPath = path.join(DIR, tpl.html);
  if (!fs.existsSync(htmlPath)) throw new Error(`Vorlage ${tpl.id}: ${tpl.html} nicht gefunden`);
  const html = fs.readFileSync(htmlPath, 'utf8');

  const previewExt = PREVIEW_EXTENSIONS.find(ext => fs.existsSync(path.join(DIR, `${tpl.id}-preview.${ext}`)));
  const preview = previewExt ? `export-templates/${tpl.id}-preview.${previewExt}` : null;

  return {id: tpl.id, label: tpl.label, size: tpl.size, html, preview};
});

const banner = '// Auto-generiert aus export-templates/ durch build/compile-templates.js - nicht manuell editieren.\n';
fs.writeFileSync(
  OUT,
  banner
  + 'window.EXPORT_TEMPLATES = ' + JSON.stringify(templates, null, 2) + ';\n'
  + 'window.EXPORT_TEMPLATES_CSS = ' + JSON.stringify(css) + ';\n'
);
console.log(`export-templates-data.js geschrieben (${templates.length} Vorlagen).`);
