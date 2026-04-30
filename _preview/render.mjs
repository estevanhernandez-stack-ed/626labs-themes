// Render preview HTML using Shiki — same TextMate engine VS Code uses.
// Loads each theme JSON, highlights the sample files, and writes a side-by-side
// HTML doc that we screenshot for the README.

import { createHighlighter } from 'shiki';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('..');
const SAMPLES = path.join(ROOT, 'preview', 'samples');
const THEMES = path.join(ROOT, 'themes');

const nightTheme = JSON.parse(fs.readFileSync(path.join(THEMES, '626labs-night-color-theme.json'), 'utf8'));
const stormTheme = JSON.parse(fs.readFileSync(path.join(THEMES, '626labs-storm-color-theme.json'), 'utf8'));

// Shiki needs each theme to have a name + properties it uses.
// Our JSON already has them, but normalize.
nightTheme.name = '626-labs-night';
stormTheme.name = '626-labs-storm';

const samples = [
  { file: 'example.ts',   lang: 'typescript', label: 'TypeScript' },
  { file: 'example.py',   lang: 'python',     label: 'Python' },
  { file: 'example.md',   lang: 'markdown',   label: 'Markdown' },
  { file: 'example.json', lang: 'json',       label: 'JSON' },
  { file: 'example.sh',   lang: 'bash',       label: 'Bash' },
  { file: 'example.css',  lang: 'css',        label: 'CSS' },
];

const highlighter = await createHighlighter({
  themes: [nightTheme, stormTheme],
  langs: samples.map(s => s.lang),
});

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function renderSample(themeName, themeColors, sample) {
  const code = fs.readFileSync(path.join(SAMPLES, sample.file), 'utf8');
  const html = highlighter.codeToHtml(code, { lang: sample.lang, theme: themeName });
  return { html, label: sample.label, file: sample.file };
}

function buildPanel(themeName, themeColors, displayName, accentEdge) {
  const editorBg = themeColors['editor.background'];
  const sidebarBg = themeColors['sideBar.background'];
  const tabActive = themeColors['tab.activeBackground'];
  const tabInactive = themeColors['tab.inactiveBackground'];
  const fg = themeColors['editor.foreground'];
  const tabFgActive = themeColors['tab.activeForeground'];
  const tabFgInactive = themeColors['tab.inactiveForeground'];
  const tabBorder = themeColors['tab.activeBorderTop'];
  const lineNumberFg = themeColors['editorLineNumber.foreground'];
  const statusBg = themeColors['statusBar.background'];
  const statusFg = themeColors['statusBar.foreground'];
  const activityBg = themeColors['activityBar.background'];
  const activityFg = themeColors['activityBar.foreground'];

  const panels = samples.map(s => renderSample(themeName, themeColors, s));

  const tabs = panels.map((p, i) => `
    <div class="tab ${i === 0 ? 'active' : ''}" data-target="${themeName}-${i}">${p.file}</div>
  `).join('');

  const editors = panels.map((p, i) => `
    <div class="editor-pane ${i === 0 ? 'active' : ''}" id="${themeName}-${i}">
      <div class="line-gutter"></div>
      <div class="code-area">${p.html}</div>
    </div>
  `).join('');

  return `
    <section class="vscode-window" style="--editor-bg:${editorBg};--sidebar-bg:${sidebarBg};--tab-active:${tabActive};--tab-inactive:${tabInactive};--fg:${fg};--tab-fg-active:${tabFgActive};--tab-fg-inactive:${tabFgInactive};--tab-border:${tabBorder};--ln-fg:${lineNumberFg};--status-bg:${statusBg};--status-fg:${statusFg};--activity-bg:${activityBg};--activity-fg:${activityFg};">
      <header class="title-bar">
        <span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span>
        <span class="title">${displayName}</span>
      </header>
      <div class="window-body">
        <aside class="activity-bar">
          <div class="activity-item active"></div>
          <div class="activity-item"></div>
          <div class="activity-item"></div>
          <div class="activity-item"></div>
        </aside>
        <aside class="side-bar">
          <div class="sidebar-section">
            <div class="sidebar-header">EXPLORER</div>
            <div class="sidebar-folder">626labs-night</div>
            <div class="sidebar-file selected">example.ts</div>
            <div class="sidebar-file">example.py</div>
            <div class="sidebar-file">example.md</div>
            <div class="sidebar-file">example.json</div>
            <div class="sidebar-file">example.sh</div>
            <div class="sidebar-file">example.css</div>
          </div>
        </aside>
        <main class="editor-shell">
          <div class="tab-strip">${tabs}</div>
          <div class="editor-stack">${editors}</div>
        </main>
      </div>
      <footer class="status-bar">
        <span>main</span>
        <span>UTF-8</span>
        <span>${displayName}</span>
      </footer>
    </section>
  `;
}

const PAGE_CSS = `
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; }
  body {
    background: #050c18;
    color: #c4cdda;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    padding: 32px;
  }
  h1 {
    font-family: 'Space Grotesk', system-ui, sans-serif;
    font-size: 28px;
    font-weight: 700;
    letter-spacing: -0.02em;
    margin: 0 0 6px 0;
  }
  .subhead { color: #8e9bad; margin: 0 0 32px 0; font-size: 14px; }
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  .vscode-window {
    background: var(--editor-bg);
    border: 1px solid #1e2a3d;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 12px 40px rgba(0,0,0,0.55);
  }
  .title-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    height: 30px;
    padding: 0 12px;
    background: var(--editor-bg);
    border-bottom: 1px solid #0a1524;
  }
  .dot { width: 11px; height: 11px; border-radius: 50%; display: inline-block; }
  .dot.red { background: #ff5f57; }
  .dot.yellow { background: #febc2e; }
  .dot.green { background: #28c841; }
  .title {
    margin-left: 12px;
    font-size: 11px;
    color: #8e9bad;
    letter-spacing: 0.04em;
    font-family: 'JetBrains Mono', monospace;
    text-transform: uppercase;
  }
  .window-body {
    display: flex;
    height: 720px;
  }
  .activity-bar {
    width: 42px;
    background: var(--activity-bg);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 12px;
    gap: 14px;
  }
  .activity-item {
    width: 22px; height: 22px;
    border-radius: 4px;
    background: rgba(255,255,255,0.06);
  }
  .activity-item.active {
    background: rgba(23,212,250,0.18);
    border-left: 2px solid var(--activity-fg);
    margin-left: -2px;
  }
  .side-bar {
    width: 200px;
    background: var(--sidebar-bg);
    padding: 8px 0;
    border-right: 1px solid #0a1524;
    font-size: 12px;
  }
  .sidebar-header {
    padding: 6px 12px;
    font-size: 10px;
    color: #c4cdda;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-weight: 600;
  }
  .sidebar-folder {
    padding: 4px 12px;
    color: #c4cdda;
    font-weight: 600;
  }
  .sidebar-file {
    padding: 4px 24px;
    color: #c4cdda;
    cursor: pointer;
  }
  .sidebar-file.selected {
    background: rgba(23,212,250,0.14);
    color: #e7edf5;
  }
  .editor-shell {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: var(--editor-bg);
    overflow: hidden;
  }
  .tab-strip {
    display: flex;
    background: var(--sidebar-bg);
    border-bottom: 1px solid #0a1524;
    overflow-x: auto;
  }
  .tab {
    padding: 8px 14px;
    font-size: 12px;
    color: var(--tab-fg-inactive);
    background: var(--tab-inactive);
    border-right: 1px solid #0a1524;
    cursor: pointer;
    font-family: 'JetBrains Mono', monospace;
  }
  .tab.active {
    color: var(--tab-fg-active);
    background: var(--tab-active);
    border-top: 2px solid var(--tab-border);
    padding-top: 6px;
  }
  .editor-stack {
    flex: 1;
    position: relative;
    overflow: hidden;
  }
  .editor-pane {
    display: none;
    height: 100%;
    overflow: auto;
  }
  .editor-pane.active { display: flex; }
  .code-area {
    flex: 1;
    padding: 12px 16px;
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    font-size: 13px;
    line-height: 1.55;
    overflow: auto;
  }
  .code-area pre {
    margin: 0;
    background: transparent !important;
  }
  .code-area .shiki { background: transparent !important; }
  .status-bar {
    height: 24px;
    background: var(--status-bg);
    color: var(--status-fg);
    font-size: 11px;
    display: flex;
    align-items: center;
    padding: 0 12px;
    gap: 24px;
    font-family: 'JetBrains Mono', monospace;
  }
`;

function buildPage() {
  const nightPanel = buildPanel('626-labs-night', nightTheme.colors, '626 Labs Night');
  const stormPanel = buildPanel('626-labs-storm', stormTheme.colors, '626 Labs Storm');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>626 Labs Night — preview</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;600&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
<style>${PAGE_CSS}</style>
</head>
<body>
<h1>626 Labs Night</h1>
<p class="subhead">Two variants — Night (deeper) and Storm (lighter). Same syntax palette. Cyan owns logic, magenta owns decision.</p>
<div class="grid">
${nightPanel}
${stormPanel}
</div>
</body>
</html>`;
}

const html = buildPage();
fs.writeFileSync(path.join('..', 'preview', 'side-by-side.html'), html);
console.log('Wrote preview/side-by-side.html');

// Per-language single-theme renders for the README.
for (const sample of samples) {
  for (const variant of [
    { themeName: '626-labs-night', themeColors: nightTheme.colors, displayName: 'Night' },
    { themeName: '626-labs-storm', themeColors: stormTheme.colors, displayName: 'Storm' },
  ]) {
    const code = fs.readFileSync(path.join(SAMPLES, sample.file), 'utf8');
    const code_html = highlighter.codeToHtml(code, { lang: sample.lang, theme: variant.themeName });
    const editorBg = variant.themeColors['editor.background'];
    const fg = variant.themeColors['editor.foreground'];
    const lnBg = variant.themeColors['editor.lineHighlightBackground'] || 'transparent';
    const out = `<!doctype html><html><head><meta charset="utf-8">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
    <style>
      html,body{margin:0;padding:0;background:#050c18;}
      .frame{background:${editorBg};color:${fg};padding:24px;font-family:'JetBrains Mono',ui-monospace,monospace;font-size:13px;line-height:1.55;}
      .frame pre{margin:0;background:transparent !important;}
      .frame .shiki{background:transparent !important;}
    </style></head><body><div class="frame">${code_html}</div></body></html>`;
    const fileName = `${sample.lang}-${variant.displayName.toLowerCase()}.html`;
    fs.writeFileSync(path.join('..', 'preview', fileName), out);
  }
}

console.log('Wrote per-language preview HTML');
