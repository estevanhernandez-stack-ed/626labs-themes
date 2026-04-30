# 626 Labs Themes

A neon-duotone dark theme family for VS Code. Three variants — **Night** (deeper), **Storm** (lighter), and **Void** (true OLED black) — all built on the 626 Labs palette: cyan and magenta on deep navy.

The structural inspiration is [Tokyo Night by Enkia](https://github.com/enkia/tokyo-night-vscode-theme). The colors are 626 Labs.

## What you get

- **626 Labs Night** — `#0a1524` editor on `#0f1f31` chrome. The default. Use it when you want the screen to feel like a recording booth.
- **626 Labs Storm** — `#152135` editor on `#1e2a3d` chrome. Same syntax palette, lifted one ink-step. Use it in daylight or on a glossy display.
- **626 Labs Void** — `#000000` editor on `#000000` chrome. Built for OLED. Pixels actually turn off; cyan and magenta accents hit harder against true black. Power-friendly on phones, laptops with OLED panels, and the latest displays.

Cyan `#17d4fa` carries logic — functions, methods, properties, types. Magenta `#f22f89` carries decision — keywords, control flow, HTML tags, links. Strings ride green `#2bd99a`, numbers and constants ride amber `#ffb454`. The duo is always paired, never solo.

## Install

From the VS Code Marketplace:

1. `Ctrl+P` (or `Cmd+P` on Mac) → `ext install 626LabsLLC.626labs-themes`
2. Open the command palette → **Preferences: Color Theme**
3. Pick **626 Labs Night**, **626 Labs Storm**, or **626 Labs Void**

Or grab the `.vsix` from [Releases](https://github.com/estevanhernandez-stack-ed/626labs-themes/releases) and:

```
code --install-extension 626labs-themes-0.1.1.vsix
```

## Why three variants

No single dark works in every room. **Night** goes deeper for night sessions and dim ambient — the editor surface is `#0a1524`, near-black with navy in it. **Storm** lifts the editor to `#152135` for ambient light and matte panels. **Void** pushes all the way to `#000000` for OLED screens, where each black pixel actually turns off — that's the only place a "true black" theme stops being aesthetic and starts being functional. The syntax highlighting is identical across all three, so you can switch without re-learning what color means what.

## Recommended settings

Pair this theme with a coding font that has wide-spaced uppercase and clear punctuation. Suggestions:

- **JetBrains Mono** (free, the brand mono — what 626 Labs ships)
- **Berkeley Mono** (paid, premium feel)
- **Commit Mono** (free, alternative)

```json
{
  "editor.fontFamily": "'JetBrains Mono', 'Cascadia Code', Menlo, monospace",
  "editor.fontLigatures": false,
  "workbench.colorTheme": "626 Labs Night"
}
```

The theme turns ligatures off through `font-variant-ligatures: none` on its own code block CSS — but VS Code's editor renders them by default. Either choice is fine; the syntax colors are tuned for both.

## Color decisions

The principle: cyan owns "this is being executed" (functions, properties, types). Magenta owns "this is decisive" (keywords, control flow, links, HTML tags). Green and amber are for content and constants — they keep strings and numbers distinct from the brand duo so the eye doesn't get lost in neon noise.

| Token | Color | Why |
|---|---|---|
| Functions, methods, properties | `#17d4fa` cyan | Things being invoked — logic |
| Types, classes, interfaces | `#5ce6ff` cyan-bright italic | A different cyan so types don't blend with calls |
| Keywords, control flow, HTML tags | `#f22f89` magenta | Decisions — the program changing direction |
| Storage modifiers, language keywords | `#ff5aa3` magenta-bright | A lift on the same accent |
| Strings | `#2bd99a` green | Content — distinct from the brand duo |
| Numbers, booleans, null, escapes | `#ffb454` amber | Constants — also distinct |
| Comments | `#5e6b7f` italic | Quiet — visible but not loud |
| Variables, plain text | `#e7edf5` | Bright readable foreground |
| Operators, parameters, CSS props | `#c4cdda` | Dimmer than text — supporting structure |
| Punctuation | `#8e9bad` | Dimmest — frame, not focus |
| Errors | `#ff5472` | Stop |

Status bar goes magenta when a debug session is active. That's intentional — the brand pairs cyan with magenta, and debug is a moment that earns the second color.

## Screenshots

Drop in once published — or [open the preview folder](./preview/) for the local renders.

## Credits

- Structural inspiration: **Tokyo Night** by Enkia — scope coverage, the two-variant shape, the editor-on-chrome layout
- Colors and voice: **626 Labs** — `626labs.dev`

## License

MIT. See [LICENSE](./LICENSE).
