## Why

Graph View becomes noticeably laggy when dense payloads render many graph entities and labels. The current canvas work is correct functionally, but large-graph interactions can repaint too much of the graph for simple hover and click actions.

## What Changes

- Add large-graph performance behavior for Graph View so dense canvases remain responsive during initial render, hover, selection, and drag.
- Apply a level-of-detail label policy that reduces default text drawing cost when node counts are high while preserving hover and selected-node full-title reveal.
- Replace full-graph interaction state churn with incremental state updates for hover and selection where practical.
- Reduce nonessential visual rendering cost such as default shadows, heavy label strokes, and continuous animation on non-focused elements.
- Keep the current G6 canvas engine, current backend graph contract, current local quick-detail behavior, and current graph controls.

## Capabilities

### New Capabilities

- `graph-view-large-graph-performance`: Defines responsiveness and large-payload behavior for Graph View rendering and interactions.

### Modified Capabilities

- `graph-view-hover-spotlight`: Hover emphasis should avoid full-graph repaint/state churn and remain responsive on dense graphs.
- `graph-view-readability-interaction`: Dense graph readability should use performance-aware label priority and avoid rendering unnecessary labels by default.
- `graph-view-g6-force-layout`: Force layout should remain bounded and avoid unnecessary continuous animation after the graph is readable.

## Impact

- Affected code: `app/[lang]/(main)/graph-view/graph-view-canvas.tsx`, and dictionary copy only if user-facing labels change.
- Affected specs: Graph View performance, hover spotlight, readability interaction, and G6 force layout behavior.
- APIs: No backend contract changes.
- Dependencies: No new graph engine or package migration.
