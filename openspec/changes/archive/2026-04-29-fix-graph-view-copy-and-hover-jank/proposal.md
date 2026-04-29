## Why

The `graph-view` screen currently has two high-visibility regressions: user-facing Vietnamese copy is corrupted in parts of the workbench, and hover feedback causes the surrounding layout to update too aggressively, which makes the screen feel jittery and heavy. These bugs undermine trust in a browse surface that is supposed to feel clear, stable, and professional.

## What Changes

- Restore correct Vietnamese copy across the `graph-view` route and workbench so all user-facing text renders consistently with the repo's language rules.
- Reduce hover-driven UI churn so node hover stays a lightweight exploratory signal instead of repeatedly rewriting page chrome and inspector prose.
- Keep selection-driven detail behavior intact while narrowing hover feedback to the canvas and other low-cost contextual surfaces.
- Preserve the current graph contract, protected route behavior, and Sigma-based browse interactions while improving perceived stability.

## Capabilities

### New Capabilities
- `graph-view-copy-and-hover-stability`: Defines correct Vietnamese copy rendering and stable, low-jank hover behavior for the graph-view browse surface.

### Modified Capabilities

## Impact

- Affected code: `app/(main)/graph-view/page.tsx`, `app/(main)/graph-view/graph-view-workbench.tsx`, and `app/(main)/graph-view/graph-view-canvas.tsx`.
- Affected systems: graph-view page chrome, inspector copy, canvas hover feedback, and client-side interaction state flow.
- APIs and permissions: no backend or permission changes; the fix stays within the existing `GET /graph-view` contract and protected route behavior.
