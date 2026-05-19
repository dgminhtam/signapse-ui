## Context

`/graph-view` currently renders an AntV G6 force canvas with hover spotlight, tooltip, draggable nodes, bounded interaction space, icon zoom controls, recenter, and compact HUD counts. The backend `/graph-view` response already includes enough node metadata to show a useful first-pass inspector without fetching detail endpoints: node kind, label, secondary label, URL, timestamps, status-like fields, symbol, asset type, source outlet, canonical key, slug, and confidence.

The app also already has detail routes for the two node kinds that most need deep inspection:

- Event: `/events/[id]`
- News article: `/news-articles/[id]`

The best first version is therefore a canvas-native inspector that uses the graph payload immediately, plus explicit navigation actions for event and news article nodes.

## Goals / Non-Goals

**Goals:**

- Let users click a node to keep it selected.
- Show a compact detail inspector inside the graph canvas.
- Make the selected node and its direct relations easier to analyze.
- Preserve the current hover preview and force graph interactions.
- Provide direct detail-page navigation for event and news article nodes.
- Keep asset and theme nodes useful even without dedicated detail routes.
- Keep the graph screen canvas-first, without adding large external cards.

**Non-Goals:**

- Adding new backend endpoints.
- Fetching full event or news article detail data in the first version.
- Replacing existing `/events/[id]` or `/news-articles/[id]` pages.
- Adding edit, delete, enrichment, crawl, or mutation actions inside the inspector.
- Persisting selected node state to the backend.
- Reworking graph layout, zoom, hover styling, or global navigation.

## Decisions

### Use an in-canvas inspector instead of immediate navigation

Clicking a node should select it and open a detail inspector rather than immediately navigating away.

Why:
- Graph view is an analysis workspace; immediate navigation breaks spatial context.
- Selection lets users compare neighboring entities before deciding whether to open a full page.
- A persistent inspector makes click distinct from hover.

Alternative considered:
- Click directly opens `/events/[id]` or `/news-articles/[id]`. Rejected for the first version because it makes the graph feel like a link map instead of an analysis surface.

### Use existing graph payload for the first inspector version

The inspector should render fields already available on `GraphViewNode`.

Why:
- It avoids backend coupling and keeps the change small.
- The graph payload already contains enough metadata for orientation.
- Detail routes remain available for deeper reading.

Alternative considered:
- Lazy fetch full entity details after click. Deferred because it increases loading, permissions, and error states before the basic click-to-inspect loop is proven.

### Treat click selection as separate from hover preview

Hover should remain temporary and lightweight. Click should create a persistent selected node until the user closes the inspector, clicks another node, or clicks the canvas background.

Why:
- Users already rely on hover to quickly scan labels.
- Persistent selection is needed for reading details without holding the pointer still.
- The mental model stays simple: hover previews, click inspects.

Alternative considered:
- Reuse hover tooltip as the click detail surface. Rejected because the tooltip is intentionally small and pointer anchored.

### Highlight direct relations while selected

When a node is selected, the selected node, directly related nodes, and related edges should remain visually emphasized.

Why:
- The user is trying to analyze graph relationships, not just read metadata.
- `GraphModel` already stores `relatedNodesByNodeId` and `relatedEdgesByNodeId`, so this can be implemented without recomputing graph topology.

Alternative considered:
- Show inspector only, without relation emphasis. Rejected because it misses the main value of graph view.

### Keep inspector actions narrow

The inspector should only include navigation actions:

- `Mở sự kiện` for event nodes with a parsed entity id.
- `Mở bài viết` for news article nodes with a parsed entity id.
- `Mở nguồn gốc` for news article nodes with `metadata.url`.

Why:
- The graph should remain a read/analyze surface.
- Mutations belong on detail pages where context and permissions are richer.

Alternative considered:
- Add enrichment/crawl actions inside the inspector. Rejected as too heavy for a canvas HUD.

## Risks / Trade-offs

- [Click conflicts with drag] -> Track drag start/end and ignore click selection immediately after a drag gesture.
- [Inspector covers graph content] -> Use a compact right-side floating panel on desktop and a bottom sheet-style panel on mobile.
- [Selected relation styles conflict with hover states] -> Give selected state precedence and clear temporary hover state when needed.
- [Asset/theme nodes lack detail routes] -> Show useful metadata and related counts, but omit unavailable navigation actions.
- [Metadata can be sparse] -> Render only populated fields plus sensible empty copy for missing core fields.

## Migration Plan

1. Add selected-node state in the graph canvas.
2. Add G6 node click and canvas click handlers.
3. Apply selected relation emphasis using existing graph model relation maps.
4. Add the in-canvas inspector component and responsive placement.
5. Add detail-route and source URL actions where available.
6. Verify hover, drag, click, zoom, recenter, light mode, and dark mode.

Rollback strategy:
- Remove click handlers, selected state, selected graph state updates, and inspector rendering. Existing graph view behavior should return to hover-only inspection.

## Open Questions

- Whether future versions should lazy fetch full event/news article details after the inspector opens.
- Whether double-click should become a shortcut to open the full detail page after the first version lands.
