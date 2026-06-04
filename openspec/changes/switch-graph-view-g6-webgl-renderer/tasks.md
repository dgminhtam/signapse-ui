## 1. Docs Snapshot

- [x] 1.1 Vendor official G6 v5 docs into `.codex/vendor-docs/g6-v5/upstream/packages/site/docs`.
- [x] 1.2 Add source metadata with repository URL, branch, commit hash, commit date, retrieval date, and snapshot path.
- [x] 1.3 Confirm vendored docs include WebGL renderer guidance.

## 2. Renderer Dependency

- [x] 2.1 Add `@antv/g-webgl` to project dependencies and update `pnpm-lock.yaml`.
- [x] 2.2 Keep `@antv/g6` installed; do not migrate graph engines.

## 3. Graph View Renderer

- [x] 3.1 Import `WebGLRenderer` in `graph-view-canvas.tsx`.
- [x] 3.2 Configure the existing `new Graph({ ... })` call with `renderer: () => new WebGLRenderer()`.
- [x] 3.3 Preserve existing data mapping, force layout, bounded drag, hover activation, selection lifecycle, zoom/recenter, and quick detail behavior.

## 4. Verification

- [x] 4.1 Run `openspec validate switch-graph-view-g6-webgl-renderer --strict`.
- [x] 4.2 Run static search confirming `@antv/g-webgl` and `renderer` are wired only in Graph View.
- [x] 4.3 Run `pnpm typecheck`.
- [x] 4.4 Run `pnpm build`.

User-owned manual QA note: Browser verification should cover Graph View load, pan, zoom, recenter, hover highlight, node drag, click selection, local quick detail, and light/dark rendering.
