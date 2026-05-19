## Why

Dense graph payloads are still hard to read because the current graph view can force labels for too many visible nodes and ForceAtlas2 does not guarantee a minimum visual gap between node circles. This change tightens the readability contract so global graph mode stays scannable while users can still reveal full titles and manually inspect crowded regions.

## What Changes

- Add a priority label policy so global view does not force labels for every visible node in dense graphs.
- Keep full node titles available on hover, selection, and local-focus center while default labels remain bounded and density-aware.
- Add a deterministic minimum node spacing pass after the initial layout so node circles are nudged apart when they land too close.
- Add drag-drop collision handling so a dragged node is not left directly stacked on nearby nodes.
- Preserve the existing backend graph contract, modal inspection flow, multigraph support, and local-only drag behavior.

## Capabilities

### New Capabilities

- `graph-view-label-spacing`: Graph view uses priority-based label rendering and minimum node spacing to keep dense graphs readable.

### Modified Capabilities

## Impact

- Affected frontend graph rendering and layout code in `app/(main)/graph-view/graph-view-canvas.tsx` and `app/(main)/graph-view/graph-view-workbench.tsx`.
- No backend API changes, persistence changes, or new runtime dependencies are required.
- Complements the active `refine-graph-view-readability-interaction` change by constraining label visibility and node spacing behavior for dense datasets.
