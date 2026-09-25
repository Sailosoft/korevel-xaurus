# Add Mermaid diagram support (Docusaurus 3.10.2)

## Context

- Site: Docusaurus 3.10.2 (classic preset, `@docusaurus/faster`, TypeScript config, npm with `package-lock.json`).
- `docusaurus.config.ts` has no `markdown`, `themes`, or mermaid config today; grep shows zero existing mermaid references.
- Official support = `@docusaurus/theme-mermaid` + `markdown.mermaid: true` (verified against https://docusaurus.io/docs/markdown-features/diagrams for 3.10.2).
- Decision (user-confirmed): Mermaid themes `{light: 'neutral', dark: 'dark'}` to pair with GitHub-light / Dracula and `respectPrefersColorScheme: true`.
- `docs/reference/markdown-mdx-reference.mdx:114-117` currently says "Math and diagrams — Not enabled in this project" and must be updated or it becomes stale/wrong.

## Tasks

1. **Install dependency** (exact pin, matching how all `@docusaurus/*` packages are pinned):
   ```
   npm install --save-exact @docusaurus/theme-mermaid@3.10.2
   ```
   Updates `package.json` and `package-lock.json`.

2. **`docusaurus.config.ts`** — three additions:
   - Top level (near `presets`):
     ```ts
     markdown: {
       mermaid: true,
     },
     themes: ['@docusaurus/theme-mermaid'],
     ```
     Both keys exist on the `Config` type (`markdown.mermaid`, `themes?: PluginConfig[]`) — no casts needed.
   - Inside `themeConfig` (before the `satisfies Preset.ThemeConfig`):
     ```ts
     mermaid: {
       theme: {light: 'neutral', dark: 'dark'},
     },
     ```
     Type-safe: `BaseThemeConfig` carries `[key: string]: unknown`, so `satisfies Preset.ThemeConfig` accepts the extra key; runtime Joi validation comes from the theme.

3. **`docs/reference/markdown-mdx-reference.mdx`** — replace the "Math and diagrams" section:
   - New heading `## Diagrams (Mermaid)` with a fenced `mermaid` example (use a 4-backtick outer fence so the inner 3-backtick example renders, same pattern as the existing Code blocks section):
     ````md
     ```mermaid
     graph TD
       A[Author] --> B[Review]
       B --> C[Publish]
     ```
     ````
   - Note: diagrams follow light/dark mode (`neutral` / `dark` themes); syntax link https://mermaid.js.org/.
   - Keep math explicitly out of scope: "Math/KaTeX is not enabled."

4. **`docs/reference/docusaurus-config-reference.mdx`** — add a `## Mermaid (diagrams)` section after `## Prism (code highlighting)` documenting `markdown.mermaid`, `themes: ['@docusaurus/theme-mermaid']`, and `themeConfig.mermaid.theme`, so the config reference stays complete.

## Out of scope

- Math/KaTeX (`remark-math` + `rehype-katex`).
- Optional `@mermaid-js/layout-elk` layout engine.
- Swizzling, search integration changes, `src/css` styling.

## Risks

- Bundle size grows (mermaid is a large client dependency) — acceptable for a docs site.
- `onBrokenLinks: 'throw'` unaffected; no link changes.
- If `npm run typecheck` flags anything unexpected in `docusaurus.config.ts`, fall back to typing the block as `Config['themeConfig']` rather than weakening `satisfies`.

## Validation

1. `npm run typecheck` — config still compiles.
2. `npm run build` — full build with `onBrokenLinks: 'throw'` passes; confirms theme loads in production bundle.
3. `npm start` (port 4000) — open `/docs/reference/markdown-mdx-reference`, verify the example diagram renders and re-renders with the correct palette after toggling light/dark mode.
