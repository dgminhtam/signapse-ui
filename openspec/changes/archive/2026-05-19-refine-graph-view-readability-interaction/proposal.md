## Why

Graph view now has the right canvas-first direction, but dense datasets still feel hard to read because nodes overlap, labels are mostly hidden until interaction, and hover makes the rest of the graph fade too aggressively. This change improves graph analysis ergonomics so users can read important titles at a glance, gently rearrange crowded nodes, and inspect relationships without losing spatial context.

## What Changes

- Add bounded, readable node labels by default so the graph communicates entity meaning before hover or click.
- Show full node titles on hover or selection, with a stronger node halo or shadow treatment that keeps the rest of the graph readable.
- Soften hover dimming so unrelated nodes remain visible enough for context while secondary edges recede.
- Add drag-to-position for nodes so users can manually separate crowded areas during analysis.
- Refine layout anti-overlap and light settle motion so the graph feels alive on load without becoming an unstable physics simulation.
- Preserve current modal inspection, graph API contract, permission-aware drill-downs, and multigraph support.

## Capabilities

### New Capabilities
- `graph-view-readability-interaction`: Graph view supports readable default labels, full-title hover emphasis, node dragging, softer focus dimming, and improved anti-overlap motion for dense graph analysis.

### Modified Capabilities

## Impact

- Affected frontend graph rendering and interaction code in `app/(main)/graph-view/graph-view-canvas.tsx` and graph model/layout tuning in `app/(main)/graph-view/graph-view-workbench.tsx`.
- May add small local helpers for label truncation, drag state, and Sigma canvas drawing behavior.
- No backend API changes, data contract changes, or new dependencies are expected.
