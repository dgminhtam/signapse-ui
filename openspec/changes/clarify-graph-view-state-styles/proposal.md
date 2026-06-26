## Why

Graph View hover and active effects currently share nearly identical visual styles but use state names whose purpose is not obvious at a glance. The dimmed context is also implemented with opacity, which can make dense graphs feel washed out and inconsistent across light and dark mode.

## What Changes

- Clarify Graph View state semantics so hover uses `highlight` and active selection uses `selected`.
- Keep G6 built-in hover and click selection behavior for first-degree related graph context instead of adding custom traversal.
- Change the `dim` treatment for unrelated nodes and edges from opacity-based fading to neutral gray coloring.
- Keep focused hover and selected treatments visually aligned while preserving separate state names for their different actions.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `graph-view-hover-spotlight`: Hover state naming and dim styling for unrelated graph context.
- `graph-view-selection-state-lifecycle`: Active selection state naming and dim styling for unrelated graph context.

## Impact

- Affected code: `app/[lang]/(main)/graph-view/graph-view-canvas.tsx`.
- No API, backend contract, dependency, route, or persisted data changes.
- Verification should include OpenSpec validation plus TypeScript/lint checks for the touched frontend code.
