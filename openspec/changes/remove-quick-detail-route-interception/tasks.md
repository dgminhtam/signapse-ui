## 1. Remove Global Route Interception

- [x] 1.1 Remove the `quickDetail` parallel route prop and render point from `app/[lang]/(main)/layout.tsx`.
- [x] 1.2 Delete the active `app/[lang]/(main)/@quickDetail/**` route tree, including event/news article intercepted routes, default, error, not-found, and placeholder files.
- [x] 1.3 Remove route-level quick-detail drawer wrappers, adapters, imports, and types when they have no remaining local state-based usage.
- [x] 1.4 Verify normal internal links to `/events/{id}` and `/news-articles/{id}` resolve to full detail pages only.

## 2. Preserve Local Drawer Quick Detail

- [x] 2.1 Keep or create an app-level local quick-detail drawer shell outside `components/ui` that is controlled by explicit workspace state.
- [x] 2.2 Ensure the local drawer closes by clearing state and never by `router.back()`, `router.push()`, or `router.replace()`.
- [x] 2.3 Keep focused event quick-detail loading, error, access-denied, and missing-entity handling inside the drawer.
- [x] 2.4 Keep focused news article quick-detail loading, error, access-denied, and missing-entity handling inside the drawer.
- [x] 2.5 Keep full detail escalation actions as canonical links to `/events/{id}` and `/news-articles/{id}`.

## 3. Update Graph View

- [x] 3.1 Replace Graph View event/news article detail route-interception entry points with explicit local quick-detail state.
- [x] 3.2 Render the local quick-detail drawer for Graph View `event` and `news-article` nodes using focused detail content.
- [x] 3.3 Ensure closing Graph View quick detail preserves route, selected node state, graph layout, and graph instance.
- [x] 3.4 Preserve unsupported node behavior so `asset`, `theme`, and other non-readable nodes remain inspector-only.

## 4. Update Market Charts

- [x] 4.1 Replace market chart annotation title route links with explicit local event quick-detail actions.
- [x] 4.2 Preserve safe event resolution from `eventId` first and `links.eventDetail` fallback second.
- [x] 4.3 Render a local event quick-detail drawer from Market Charts without changing `assetId`, `timeframe`, loaded candle data, lazy history state, or chart instance.
- [x] 4.4 Close the local annotation popup when event quick detail opens while preserving marker grouping, popup positioning, and annotation marker behavior.

## 5. Documentation And Repository Rules

- [x] 5.1 Update `docs/pdp-quick-view-drawer-nextjs-shadcn.md` so it documents local workspace quick-detail overlays instead of global intercepted routes.
- [x] 5.2 Update `AGENTS.md` to state that analytical quick detail must be explicit and local by default, and global intercepted routes require a future proposal with bounded scope.
- [x] 5.3 Update `AGENTS.vi.md` with the synchronized Vietnamese rule changes from `AGENTS.md`.
- [x] 5.4 Remove stale OpenSpec/docs references that describe `app/(main)/@quickDetail` as active or recommended default behavior.

## 6. Verification

- [x] 6.1 Run `openspec validate remove-quick-detail-route-interception --strict`.
- [x] 6.2 Run `pnpm typecheck`.
- [x] 6.3 Run `pnpm lint` if available in this repo. Ran and found unrelated pre-existing lint errors outside this change.
- [x] 6.4 Run static search to verify there are no active `@quickDetail` route files, layout `quickDetail` slot usages, route-level quick-detail placeholders, or quick-detail `router.back()` close handlers remaining.
- [x] 6.5 Run static search/code review to verify Graph View and Market Charts local quick detail no longer navigates to `/events/{id}` or `/news-articles/{id}` for drawer opening.

User-owned manual QA note: after implementation, validate in the browser that Graph View and Market Charts open/close local quick detail without losing workspace state, and that normal event/news article links still open full detail pages.
