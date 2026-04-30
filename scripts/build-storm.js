// Build the Storm variant from Night by lifting chrome surfaces one ink-step.
// Storm uses a slightly lighter editor bg + lighter sidebar; syntax + accents
// are identical to Night. Foreground "on-accent" colors (text on cyan
// buttons, status items, etc.) stay deep so the cyan still pops.

const fs = require('fs');
const path = require('path');

const NIGHT = path.join(__dirname, '..', 'themes', '626labs-night-color-theme.json');
const STORM = path.join(__dirname, '..', 'themes', '626labs-storm-color-theme.json');

// Keys whose value is a foreground / on-accent text color and must NOT be lifted.
// (These read text on a bright background; lifting them ruins contrast.)
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
]);

// Map: Night chrome color → Storm chrome color.
// Editor: ink-900 → ink-800. Sidebar: navy-deep → ink-700.
// Raised (was elevated/fold bg): ink-800 → ink-700. Popover: ink-700 → ink-600.
const SUBS = {
  '#0a1524': '#152135', // editor.background
  '#0f1f31': '#1e2a3d', // sidebar / activity / status / panels
  '#152135': '#1e2a3d', // raised surfaces (fold, indent guide, etc.)
  '#1e2a3d': '#2a3649', // popover-level (hover widget, dropdown borders)
};

function transform(value, key) {
  if (typeof value !== 'string') return value;
  if (FOREGROUND_KEYS.has(key)) return value;
  // Match #RRGGBB or #RRGGBBAA, keep alpha when present.
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
  name: '626 Labs Storm',
  colors: {},
};

for (const [k, v] of Object.entries(src.colors)) {
  out.colors[k] = transform(v, k);
}

// tokenColors: pure syntax — leave untouched.
out.tokenColors = src.tokenColors;
out.semanticTokenColors = src.semanticTokenColors;
out.semanticHighlighting = src.semanticHighlighting;
out.type = src.type;

// Storm-specific overrides: tab top accent stays cyan, but the bracket-matched
// background should stay readable on the lighter surface.
out.colors['editor.lineHighlightBackground'] = '#ffffff0d'; // a touch stronger on lighter bg
out.colors['editorIndentGuide.background1'] = '#1e2a3d';
out.colors['editorRuler.foreground'] = '#1e2a3d';

fs.writeFileSync(STORM, JSON.stringify(out, null, 2) + '\n');
console.log('Wrote', STORM);
