## Why

Graph View still uses G6's default canvas renderer for a dense, interactive graph surface. The local G6 v5 docs snapshot confirms G6 supports WebGL by installing `@antv/g-webgl` and passing a `renderer` callback during `Graph` initialization. Switching renderer backend is a smaller step than replacing G6, while preserving the existing force layout, drag lifecycle, selection lifecycle, and backend contract.

## What Changes

- Vendor the official G6 v5 docs snapshot for local reference.
- Add `@antv/g-webgl` and configure Graph View's G6 instance to use `WebGLRenderer`.
- Preserve the current G6 data mapping, d3-force layout, bounded drag behavior, hover/selection behavior, controlled zoom/recenter controls, and local quick detail behavior.

## Impact

- Affected code: `app/[lang]/(main)/graph-view/graph-view-canvas.tsx`.
- Affected dependencies: `package.json`, `pnpm-lock.yaml`.
- Affected docs: `.codex/vendor-docs/g6-v5`.
- Affected specs: Graph View G6 force layout renderer behavior.
- APIs: No backend contract changes.
