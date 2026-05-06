## Context

Graph View currently renders a canvas workspace with a lightweight `GraphNodeDetailInspector`. For `event` and `news-article` nodes, the inspector can link to `/events/{id}` or `/news-articles/{id}`, but following that link leaves the graph workspace entirely.

The newly documented Signapse quick detail overlay pattern recommends canonical entity URLs with two presentations:

- Soft navigation from an analytical workspace renders a right-side `Sheet` quick detail overlay.
- Hard navigation, reload, copied links, or direct entry render the full detail page.

This change applies that pattern to Graph View first. Market Charts annotation quick detail remains out of scope because several market-chart annotation changes are still active.

## Goals / Non-Goals

**Goals:**

- Let Graph View users open `event` and `news-article` node details in a right-side Sheet while preserving graph canvas context.
- Keep `/events/{id}` and `/news-articles/{id}` as canonical URLs.
- Keep full detail pages working for reload, direct URL entry, copied links, and hard navigation.
- Reuse existing server fetchers and permission checks.
- Keep graph node inspector lightweight; it should remain a summary/decision surface.
- Avoid changing `components/ui` primitives.

**Non-Goals:**

- No Market Charts quick detail support in this change.
- No quick detail support for `asset`, `theme`, source-document, graph clusters, or annotation groups.
- No backend API or DTO changes.
- No redesign of the Graph View canvas, node layout, hover spotlight, or selection lifecycle.
- No removal of full event/news article detail pages.

## Decisions

### Use `app/(main)/@quickDetail` as the Shared Overlay Slot

Add a parallel route slot under the existing protected `(main)` route group:

```text
app/(main)/@quickDetail/default.tsx
app/(main)/@quickDetail/(.)events/[id]/page.tsx
app/(main)/@quickDetail/(.)news-articles/[id]/page.tsx
```

Update `app/(main)/layout.tsx` to accept and render `quickDetail` beside `children`.

Why: this matches the documented pattern and keeps the route model reusable for later analytical workspaces without duplicating overlay slots per page.

Alternative considered: put the slot under `graph-view`. That would reduce initial routing scope but make later reuse from Market Charts harder and create a second URL presentation model.

### Use `Sheet`, Not Drawer or Dialog

Use `@/components/ui/sheet` with `side="right"` for the quick detail shell. This matches repository primitives and gives event/article content enough reading width in the admin dashboard.

Alternative considered: add shadcn Drawer. Drawer is more ecommerce/mobile-bottom-sheet oriented and would require a primitive this repo does not currently use.

### Extract Focused Content From Full Detail Pages

Introduce app-level detail content components outside `components/ui`, for example:

```text
app/(main)/events/event-detail-content.tsx
app/(main)/news-articles/news-article-detail-content.tsx
components/entity-quick-detail-sheet.tsx or feature-local quick sheet components
```

Full detail pages keep their page shell: back button, broad action set, technical panels, and page-specific layout. Quick detail routes use focused content: title, status, summary/description, dates, confidence, key evidence, source links, and a footer action to open the full page.

Why: rendering the full page inside a Sheet would duplicate breadcrumb/back chrome and produce a cramped reading surface.

Alternative considered: fetch entity detail in the Sheet and embed the existing page component. This is simpler short-term but creates layout drift and violates the documented summary/reading/full-page separation.

### Preserve Existing Graph Inspector Behavior for Unsupported Nodes

`asset` and `theme` nodes should continue to use the existing inspector without quick detail actions. Event and news-article nodes should expose a canonical detail action from the inspector; when opened through soft navigation, the quick detail slot may render the Sheet.

Why: only event and news-article have the right combination of route, permissions, and reading value for the first implementation.

### Close Sheet With `router.back()`

The quick detail Sheet should close by calling `router.back()`, aligning with browser Back. It should not hardcode a return URL such as `/graph-view`.

Why: Graph View context can include history, workspace state, future query params, or prior navigation sources.

### Permission And Error Handling Stays Server-Led

Quick detail routes should call existing permission helpers and fetchers. If the user lacks read permission, render an access-denied style state within the Sheet. If the entity is not found, use `notFound()` or a concise not-found state consistent with the full page strategy.

Why: quick detail must not bypass the same access model as full detail pages.

## Risks / Trade-offs

- [Risk] Intercepted route behavior can be subtle and may not appear on hard navigation. → Mitigation: explicitly test soft navigation from Graph View, direct URL, reload, copied URL, Back, and Forward.
- [Risk] Extracting focused detail content can become a broad refactor. → Mitigation: extract only the minimum shared event/article content needed for quick detail; leave page-only panels in the full page.
- [Risk] The existing full detail pages may contain mojibake text or legacy layout drift unrelated to quick detail. → Mitigation: do not rewrite unrelated page copy/layout unless required for extraction.
- [Risk] `router.back()` can surprise users if Sheet is opened without history. → Mitigation: intercepted route should only render for soft navigation; direct entry should render the full page.
- [Risk] Graph View has active historical changes. → Mitigation: only touch the inspector action path needed for supported entity links and avoid canvas/layout behavior changes.

## Migration Plan

1. Add the quick-detail slot to `(main)` layout and default null route.
2. Extract focused event and news article detail content with minimal page-shell changes.
3. Add event and news-article quick detail intercepted routes that fetch server data and render a Sheet.
4. Update Graph View inspector action copy/behavior for supported nodes while leaving selection and unsupported nodes unchanged.
5. Verify soft/hard navigation and run typecheck.

## Open Questions

- Should the quick detail footer use `Link` to the same canonical URL or a "Mở trang đầy đủ" action that intentionally performs hard navigation/replaces context? The implementation should choose the least surprising behavior after testing intercepted route behavior.
- Should quick detail include mutation actions like enrich/derive event, or keep actions read-only for the first pass? Recommended first pass: read-focused plus full-page escalation.
