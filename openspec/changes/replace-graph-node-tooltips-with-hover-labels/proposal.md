## Why

Graph node hover currently creates a separate tooltip-like surface that repeats node titles already shown on the canvas, then click opens a second detail surface. This creates redundant disclosure and makes the graph feel busier than necessary, especially after the canvas-first simplification work.

## What Changes

- Remove the dedicated node hover tooltip/card from the graph canvas.
- Make the hovered node reveal a fuller title through its in-canvas label instead of a floating tooltip.
- Treat node labels across three states: normal, hovered, and non-hovered while another node is hovered.
- Remove the heavy label background treatment and use text contrast treatments such as stroke/halo, opacity, font weight, or size to keep labels readable in light and dark mode.
- Preserve click-to-open node detail inspector behavior; click remains the interaction for metadata and entity details.
- Keep tooltips for icon-only graph controls where they explain button actions.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `graph-view-hover-spotlight`: Hover title reveal changes from a separate hover surface to the node's in-canvas label.
- `graph-view-label-spacing`: Full label reveal remains required for hovered/selected nodes, but it should avoid label-card backgrounds that make dense graphs visually heavy.
- `graph-view-readability-interaction`: Label readability behavior changes across normal, hovered, and non-hovered states without relying on an opaque label background.
- `graph-view-node-detail-inspector`: Hover preview should no longer compete with click inspection; click remains the only rich detail disclosure.

## Impact

- Affected code: `app/[lang]/(main)/graph-view/graph-view-canvas.tsx`.
- Affected UI: Graph node label rendering, hover spotlight state, and the relationship between hover and click inspection.
- No backend API or graph payload contract changes.
- No dependency changes.
- No global theme token or shadcn primitive changes.
