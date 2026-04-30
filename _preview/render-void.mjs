// Quick Void-only preview: renders the TS sample on pure-black so we can
// screenshot it for the README and confirm contrast.

import { createHighlighter } from 'shiki';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('..');
const SAMPLES = path.join(ROOT, 'preview', 'samples');
const THEMES = path.join(ROOT, 'themes');

const voidTheme = JSON.parse(fs.readFileSync(path.join(THEMES, '626labs-void-color-theme.json'), 'utf8'));
voidTheme.name = '626-labs-void';

const samples = [
  { file: 'example.ts', lang: 'typescript' },
  { file: 'example.py', lang: 'python' },
];

const hl = await createHighlighter({
  themes: [voidTheme],
  langs: samples.map(s => s.lang),
});

for (const s of samples) {
  const code = fs.readFileSync(path.join(SAMPLES, s.file), 'utf8');
  const codeHtml = hl.codeToHtml(code, { lang: s.lang, theme: '626-labs-void' });
  const out = `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>
  html,body{margin:0;padding:0;background:#000000;}
  .frame{background:#000000;color:#e7edf5;padding:24px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:13px;line-height:1.55;}
  .frame pre{margin:0;background:transparent !important;}
  .frame .shiki{background:transparent !important;}
</style></head><body><div class="frame">${codeHtml}</div></body></html>`;
  fs.writeFileSync(path.join('..', 'preview', `${s.lang}-void.html`), out);
}
console.log('Wrote void HTML previews');
