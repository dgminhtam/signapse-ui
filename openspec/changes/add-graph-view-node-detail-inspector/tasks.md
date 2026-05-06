## 1. Selection Model

- [x] 1.1 Inspect current G6 pointer, drag, hover, and state handling in `graph-view-canvas.tsx`.
- [x] 1.2 Add selected node state and selection clearing behavior.
- [x] 1.3 Add node click handling that selects nodes without firing after drag gestures.
- [x] 1.4 Add canvas background click handling that clears the selected node.

## 2. Relation Emphasis

- [x] 2.1 Use `relatedNodesByNodeId` and `relatedEdgesByNodeId` to derive selected relation sets.
- [x] 2.2 Apply selected node and selected relation graph states.
- [x] 2.3 De-emphasize unrelated nodes and edges while keeping labels readable.
- [x] 2.4 Clear selected graph states when selection changes, clears, or graph unmounts.

## 3. Detail Inspector

- [x] 3.1 Create a compact in-canvas inspector surface for the selected node.
- [x] 3.2 Render node kind, title, secondary label, timestamps, confidence, and metadata from the existing graph payload.
- [x] 3.3 Render related node and edge counts for the selected node.
- [x] 3.4 Add responsive placement: right-side floating inspector on desktop and bottom inspector on narrow screens.
- [x] 3.5 Keep inspector text and controls readable in light and dark mode.

## 4. Navigation Actions

- [x] 4.1 Parse selected event node ids and show an action to open `/events/[id]`.
- [x] 4.2 Parse selected news article node ids and show an action to open `/news-articles/[id]`.
- [x] 4.3 Show an external source URL action for news article nodes with `metadata.url`.
- [x] 4.4 Omit unavailable actions for asset, theme, or malformed node ids.

## 5. Regression Checks

- [x] 5.1 Verify hover tooltip still works without selecting a node.
- [x] 5.2 Verify dragging a node does not open the inspector.
- [x] 5.3 Verify drag canvas, icon zoom, and recenter still work while selection is active.
- [x] 5.4 Verify event, news article, asset, and theme node inspectors render sensible content.
- [x] 5.5 Run lint for touched graph-view files.
- [x] 5.6 Run typecheck.
