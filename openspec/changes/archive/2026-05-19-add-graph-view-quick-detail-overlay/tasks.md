## 1. Route Foundation

- [x] 1.1 Update `app/(main)/layout.tsx` to accept and render a `quickDetail` parallel route slot beside `children`.
- [x] 1.2 Add `app/(main)/@quickDetail/default.tsx` that renders `null`.
- [x] 1.3 Add quick detail loading/error/not-found handling where needed so overlay states stay scoped to the quick detail area.

## 2. Shared Quick Detail Shell

- [x] 2.1 Add an app-level quick detail Sheet shell outside `components/ui` using `@/components/ui/sheet`.
- [x] 2.2 Ensure the Sheet has accessible title/description handling, closes with `router.back()`, and contains a footer action for opening the full detail page.
- [x] 2.3 Keep the Sheet read-focused and avoid mutation-heavy page actions in the first pass unless already needed for parity.

## 3. Event Detail Extraction

- [x] 3.1 Extract focused event detail content from the full event detail page into a reusable app-level or feature-local component.
- [x] 3.2 Keep the existing `/events/[id]` full page behavior, permissions, actions, and page shell intact.
- [x] 3.3 Add `app/(main)/@quickDetail/(.)events/[id]/page.tsx` that fetches event detail server-side, checks permissions, and renders the focused Sheet content.

## 4. News Article Detail Extraction

- [x] 4.1 Extract focused news article detail content from the full news article detail page into a reusable app-level or feature-local component.
- [x] 4.2 Keep the existing `/news-articles/[id]` full page behavior, permissions, actions, and page shell intact.
- [x] 4.3 Add `app/(main)/@quickDetail/(.)news-articles/[id]/page.tsx` that fetches article detail server-side, checks permissions, and renders the focused Sheet content.

## 5. Graph View Integration

- [x] 5.1 Update `GraphNodeDetailInspector` so valid `event` and `news-article` node detail actions use canonical URLs and are labeled as reading details from the graph context.
- [x] 5.2 Preserve existing inspector summary behavior for all node kinds, including unsupported `asset` and `theme` nodes.
- [x] 5.3 Ensure closing quick detail returns to the previous Graph View context without resetting node selection or canvas state during normal soft navigation.

## 6. Verification

- [x] 6.1 Verify direct `/events/{id}` and `/news-articles/{id}` navigation still renders full pages.
- [x] 6.2 Verify soft navigation from Graph View opens event and news article quick detail Sheets.
- [x] 6.3 Verify browser Back/Forward and Sheet close behavior from Graph View.
- [x] 6.4 Verify permission-denied, loading, and missing-entity states for quick detail routes.
- [x] 6.5 Run `pnpm typecheck`.
- [x] 6.6 Run `openspec validate add-graph-view-quick-detail-overlay --strict`.
