// Build the Void variant — true OLED black. Chrome and editor go to #000000
// so OLED pixels actually turn off. A single faint tier (#050c18) is reserved
// for "elevated" surfaces (popover-like widgets, fold backgrounds, inlay
// hints) where text is rendered on top — it's barely 2% brightness but
// enough that small UI characters stay legible. Borders keep their existing
// faint navy (#1e2a3d) — at 1px they don't draw meaningful power but provide
// the structural delineation that the lost background contrast used to give.
//
// Foreground "on-accent" colors (text on cyan/magenta) stay deep dark so the
// brand accents still pop with high contrast.

const fs = require('fs');
const path = require('path');

const NIGHT = path.join(__dirname, '..', 'themes', '626labs-night-color-theme.json');
const VOID = path.join(__dirname, '..', 'themes', '626labs-void-color-theme.json');

const FOREGROUND_KEYS = new Set([
  'button.foreground',
  'button.secondaryForeground',
  'extensionButton.prominentForeground',
  'extensionBadge.remoteForeground',
  'chat.avatarForeground',
  'statusBarItem.remoteForeground',
  'statusBarItem.errorForeground',
  'statusBarItem.warningForeground',
  'inputValidation.warningForeground',
  'badge.foreground',
  'activityBarBadge.foreground',
  'statusBar.debuggingForeground',
  'terminalCursor.background',
  // Terminal ANSI black must stay visible — not literally pure-black on black.
  'terminal.ansiBlack',
]);

// Night → Void substitutions.
// Editor + every chrome surface collapses to true black. The mid-tier
// (#152135 in Night, used for fold/indent/elevated) lifts to #050c18 so
// elevated UI keeps a hair of contrast. Popover borders (#1e2a3d) stay put.
const SUBS = {
  '#0a1524': '#000000', // editor.background
  '#0f1f31': '#000000', // sidebar / activity / status / panel / terminal — all chrome
  '#152135': '#050c18', // raised: fold bg, indent guide, inlay hint, debug state label
};

function transform(value, key) {
  if (typeof value !== 'string') return value;
  if (FOREGROUND_KEYS.has(key)) return value;
  return value.replace(/#([0-9a-fA-F]{6})([0-9a-fA-F]{2})?/g, (m, hex6, alpha) => {
    const base = ('#' + hex6).toLowerCase();
    if (SUBS[base]) {
      return SUBS[base] + (alpha || '');
    }
    return m;
  });
}

const src = JSON.parse(fs.readFileSync(NIGHT, 'utf8'));
const out = {
  ...src,
  name: '626 Labs Void',
  colors: {},
};

for (const [k, v] of Object.entries(src.colors)) {
  out.colors[k] = transform(v, k);
}

out.tokenColors = src.tokenColors;
out.semanticTokenColors = src.semanticTokenColors;
out.semanticHighlighting = src.semanticHighlighting;
out.type = src.type;

// Void-specific overrides — small tweaks where pure-black needs a touch
// of help.
//
// Line highlight: bump alpha so the active line is more visible against
// true black (Night's 3% white reads as ~8/255 on #000, fine but worth a
// small bump for keyboard-driven users).
out.colors['editor.lineHighlightBackground'] = '#ffffff0d';
// Tree indent guides — invisible at #152135 against pure black. Lift.
out.colors['editorIndentGuide.background1'] = '#0a1524';
// Editor ruler: same.
out.colors['editorRuler.foreground'] = '#0a1524';
// Whitespace markers: bump for visibility.
out.colors['editorWhitespace.foreground'] = '#ffffff14';

fs.writeFileSync(VOID, JSON.stringify(out, null, 2) + '\n');
console.log('Wrote', VOID);
