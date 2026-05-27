## Context

Graph View now uses a canvas-first G6 workspace with visible priority labels, hover spotlight, drag, click inspection, and quick detail. The current node hover title is rendered as a separate tooltip-like surface while node titles may already be visible on the canvas. This duplicates information and makes hover feel like a second detail disclosure before click opens the inspector.

The desired interaction is simpler: labels live on the graph. Hover makes the relevant node label more readable and fuller, while click remains the action for details and metadata.

## Goals / Non-Goals

**Goals:**

- Replace node hover tooltip/card behavior with in-canvas hover label expansion.
- Define clear label treatments for normal, hovered, and non-hovered graph states.
- Remove heavy label background chrome while preserving light and dark mode readability.
- Keep click-to-open node inspector and quick detail flows intact.
- Keep icon-only control tooltips intact.

**Non-Goals:**

- No graph layout engine change.
- No backend graph contract change.
- No new dependency.
- No global theme token or shadcn primitive customization.
- No redesign of the node detail inspector content model.

## Decisions

### Use In-Canvas Label Expansion Instead Of Hover Tooltip

Hovering a node will update that node's label treatment inside G6 instead of rendering a separate React tooltip overlay. This keeps the user's attention on the graph and avoids a tooltip-to-inspector double-disclosure path.

Alternative considered: keep tooltip only for truncated or hidden labels. This preserves some discoverability but still creates a second surface and more conditional behavior. The simpler interaction is to make the graph label itself responsible for hover title reveal.

### Use Text Contrast Treatment Instead Of Label Background Boxes

Default labels should avoid opaque or heavy label background rectangles. Readability should come from text fill, text stroke/halo, font weight, label opacity, and restrained shadow/halo states.

Alternative considered: reduce background opacity while keeping the rectangle. This is safer for contrast but still creates a chip-like visual layer around many nodes and keeps the dense graph feeling visually noisy.

### Keep Three Label States

Normal labels stay short and bounded. The hovered node uses a fuller title label with stronger text emphasis. Non-hovered labels remain visible enough for context and should not disappear just because another node is hovered.

Alternative considered: hide unrelated labels during hover. This creates a cleaner spotlight but makes graph comparison harder and conflicts with the existing goal of preserving context.

### Keep Click As The Rich Detail Interaction

Clicking a node continues to select it and open the in-canvas inspector. Hover should help identify a node and its local relationships, not show metadata or compete with inspector content.

Alternative considered: move detail fields into a hover card. This would be faster for scanning one node but hurts dense graph navigation and conflicts with the quick detail overlay direction.

## Risks / Trade-offs

- Long titles may overlap neighboring nodes → Limit expanded hover labels with a max width and bounded line count.
- Removing label backgrounds may reduce contrast on some graph regions → Use graph-local label stroke/halo tuned separately for light and dark mode.
- G6 state updates for label text may be more delicate than React tooltip state → Keep hover state updates local, avoid restarting layout, and clear state reliably on pointer leave, drag start, and canvas interactions.
- Non-hovered labels may still add visual density → Use priority labels and subtle opacity changes rather than rendering every node title.
