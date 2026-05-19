## Why

Graph View already lets users inspect selected nodes, but opening a full event or news-article detail page takes them out of the graph context. Now that the Signapse quick detail overlay pattern is documented, Graph View should be the first implementation so users can read event/article detail without losing canvas context.

## What Changes

- Add a quick detail overlay flow for Graph View node actions.
- Support `event` and `news-article` graph nodes as the first quick-detail entity types.
- Keep `asset` and `theme` nodes in the existing lightweight inspector only.
- Add a future-proof App Router quick-detail slot under the main route group for intercepted `events/[id]` and `news-articles/[id]` navigation.
- Use shadcn `Sheet` from `@/components/ui/sheet` as the quick detail shell.
- Reuse the same server-side detail fetchers and permission checks used by full detail pages.
- Keep canonical full detail pages intact for direct URLs, reloads, copied links, and hard navigation.
- Update Graph View node inspector actions so supported nodes open canonical detail URLs and can render as quick detail during soft navigation.
- Do not include Market Charts annotation quick detail in this change.

## Capabilities

### New Capabilities

- `graph-view-quick-detail-overlay`: Defines Graph View quick detail behavior for event and news-article nodes, including canonical URL navigation, Sheet overlay rendering, close/back behavior, permissions, loading/error states, and full-page fallback.

### Modified Capabilities

- None.

## Impact

- Affected routes: `app/(main)/layout.tsx`, new `app/(main)/@quickDetail` slot routes for events and news articles.
- Affected Graph View code: `app/(main)/graph-view/graph-view-canvas.tsx` and related local components if extraction is needed.
- Affected detail pages: event and news article detail pages may need focused content extraction so Sheet content does not duplicate full page shell chrome.
- Affected shared app components: likely new app-level quick detail sheet/content components outside `components/ui`.
- No backend API or dependency changes are expected.
