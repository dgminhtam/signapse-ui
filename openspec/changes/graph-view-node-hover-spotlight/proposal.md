## Why

Graph view is now a canvas-first workspace, but dense graphs still need a clearer way to inspect one node without losing the surrounding structure. Dark mode also reduces label readability because canvas labels currently use light-mode-oriented styling, making Vietnamese titles and related context harder to scan.

## What Changes

- Add a lightweight node hover spotlight mode for the G6 graph canvas.
- Show the hovered node title in full inside the canvas without opening a side panel, modal, or card-heavy inspector.
- Highlight first-degree related nodes and edges while keeping unrelated graph context visible with only a soft opacity reduction.
- Improve graph label and hover-title contrast in both light and dark mode using graph-view-local styling.
- Preserve drag, pan, zoom, bounded interaction space, team clustering, and canvas-first layout behavior.
- Avoid restarting force layout or changing node geometry on hover.

## Capabilities

### New Capabilities

- `graph-view-hover-spotlight`: Covers node hover title disclosure, related-element emphasis, soft context dimming, and light/dark readability for graph canvas labels.

### Modified Capabilities

None.

## Impact

- Affects `app/(main)/graph-view/graph-view-canvas.tsx`.
- May touch graph-view-local visual helpers if needed.
- No backend API contract changes.
- No new route, modal detail flow, persisted graph position, or global theme token changes.
- No new dependency expected; should use existing G6 state/behavior APIs and `next-themes` already present in the app.
