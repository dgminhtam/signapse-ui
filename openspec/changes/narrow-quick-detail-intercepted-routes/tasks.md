## 1. Remove Global Intercepted Quick Detail

- [x] 1.1 Remove the `quickDetail` parallel route prop and render point from `app/[lang]/(main)/layout.tsx`.
- [x] 1.2 Delete the active `app/[lang]/(main)/@quickDetail/**` route tree, including event/news article intercepted routes, default, error, and not-found files.
- [x] 1.3 Remove `components/entity-quick-detail-drawer.tsx` if it has no remaining active usage, or refactor it into a local-only helper that does not call `router.back()`.
- [x] 1.4 Update imports/usages so normal links to `/events/{id}` and `/news-articles/{id}` resolve to full detail pages only.

## 2. Add Local Quick-Detail Foundation

- [x] 2.1 Create or refactor an app-level local quick-detail drawer shell outside `components/ui` that is controlled by explicit `open` state and closes without route navigation.
- [x] 2.2 Add focused event quick-detail loading/error/access-denied handling that can be used from client workspace state.
- [x] 2.3 Add focused news article quick-detail loading/error/access-denied handling that can be used from client workspace state.
- [x] 2.4 Keep full detail escalation actions as canonical links to `/events/{id}` and `/news-articles/{id}`.

## 3. Update Graph View

- [x] 3.1 Replace Graph View event/news article detail `Link` interception with explicit local quick-detail state.
- [x] 3.2 Render local quick-detail drawers for Graph View event and news article nodes using the focused detail content.
- [x] 3.3 Ensure closing Graph View quick detail clears local state without changing the route or resetting graph selection/layout.
- [x] 3.4 Preserve unsupported node behavior so `asset` and `theme` nodes remain inspector-only.

## 4. Update Market Charts

- [x] 4.1 Replace market chart annotation title route links with explicit local event quick-detail actions.
- [x] 4.2 Preserve safe event resolution from `eventId` first and `links.eventDetail` fallback second.
- [x] 4.3 Render a local event quick-detail drawer from Market Charts without changing `assetId`, `timeframe`, loaded candle data, lazy history state, or chart instance.
- [x] 4.4 Close the local annotation popup when event quick detail opens, while preserving marker grouping, popup positioning, and annotation marker behavior.

## 5. Documentation And Repository Rules

- [x] 5.1 Update `docs/pdp-quick-view-drawer-nextjs-shadcn.md` so it documents local workspace quick-detail overlays instead of global intercepted routes.
- [x] 5.2 Add an `AGENTS.md` convention that analytical quick detail must be explicit and local by default, and global intercepted routes require a future proposal with bounded scope.
- [x] 5.3 Remove stale OpenSpec/docs references that describe `app/(main)/@quickDetail` as active or recommended default behavior.

## 6. Verification

- [x] 6.1 Run `openspec validate narrow-quick-detail-intercepted-routes --strict`.
- [x] 6.2 Run `pnpm typecheck`.
- [x] 6.3 Run `pnpm lint` if available in this repo.
- [x] 6.4 Run static search to verify there are no active `@quickDetail` route files, layout `quickDetail` slot usages, or quick-detail `router.back()` close handlers remaining.
- [x] 6.5 Run static search/code review to verify Market Charts annotation quick detail no longer navigates to `/events/{id}` for the local drawer flow.

User-owned manual QA note: after implementation, validate in the browser that Graph View and Market Charts open/close local quick detail without losing workspace state, and that normal event/news article links still open full detail pages.
