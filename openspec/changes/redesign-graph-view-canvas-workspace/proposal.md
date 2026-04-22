## Why

The current `/graph-view` route already works, but it still reads like an admin page wrapped around a graph instead of a true exploration workspace. Too much of the viewport is spent on persistent settings, helper copy, and side information, which makes the graph harder to scan and pushes detail reading away from the interaction point.

## What Changes

- Reframe `/graph-view` as a canvas-first workspace instead of a standard card-based information page.
- Remove the persistent right-side inspector and show selected node or edge details in a modal inspection surface.
- Reduce default on-screen chrome by moving secondary settings, legend content, and helper guidance into compact on-demand controls.
- Preserve the existing graph contract, permissions, and browse-first drill-down behavior while simplifying the visual hierarchy around the canvas.
- Keep hover feedback lightweight and contextual so users inspect details on click rather than parsing a permanently expanded side column.

## Capabilities

### New Capabilities
- `graph-view-canvas-workspace`: Present `/graph-view` as a canvas-first graph workspace with contextual controls and modal-based selection details.

### Modified Capabilities
- None.

## Impact

- Primary UI refactor in `app/(main)/graph-view/page.tsx` and `app/(main)/graph-view/graph-view-workbench.tsx`.
- Supporting updates may be needed in `app/(main)/graph-view/graph-view-canvas.tsx` and `app/lib/graph-view/*` to support modal selection state and lighter default chrome.
- No backend API changes to `GET /graph-view`.
- No permission or navigation model changes beyond moving the detail presentation from a side inspector to a modal surface.
- Verification must cover desktop and narrow layouts, especially default information density, modal behavior, and hover stability.
