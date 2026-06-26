## Why

Graph View has accumulated custom G6 layout, state, label, and lifecycle code that now does more than the product interaction needs. This change trims that surface back to G6-supported behavior so the canvas is easier to maintain and less likely to lag from graph-wide custom state work.

## What Changes

- Remove custom hierarchy/is-leaf derivation and dense-label heuristics that only support bespoke canvas styling.
- Simplify force layout configuration to a small G6-supported force setup instead of per-kind force/link/many-body tuning tables.
- Simplify hover and active visual states to static G6 `highlight`, `selected`, and `dim` styles.
- Keep hover and active first-degree context behavior, but remove custom expanded-label and geometry-affecting state logic.
- Remove custom drag timestamp click suppression if G6 behavior handles drag and click separation sufficiently.
- Keep existing quick detail, zoom controls, wheel zoom, recenter, canvas drag, node drag, and localized HUD counts unless directly affected by cleanup.
- Deduplicate graph fallback/skeleton shape where the same loading surface is maintained twice.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `graph-view-g6-force-layout`: Graph View should use a minimal G6 force layout configuration and no longer require custom team clustering, hierarchy anchors, or per-kind force tuning.
- `graph-view-hover-spotlight`: Hover should rely on G6 state behavior and simple state styling instead of custom expanded-label callbacks or graph-local label heuristics.
- `graph-view-selection-state-lifecycle`: Active selection should continue using G6 `selected`/`highlight`/`dim` behavior while reducing custom state styling and cleanup code.
- `graph-view-g6-drag-lifecycle`: Drag behavior should remain G6-owned, with custom click-after-drag guards removed unless still required after verification.

## Impact

- Affected code is expected to stay within `app/[lang]/(main)/graph-view/graph-view-canvas.tsx`, `app/[lang]/(main)/graph-view/graph-view-workbench.tsx`, and `app/[lang]/(main)/graph-view/graph-view-visuals.ts`.
- No backend API or graph payload contract changes.
- No new dependencies.
- Verification should use OpenSpec validation plus `pnpm.cmd typecheck`; run lint only if implementation touches broader shared code.
