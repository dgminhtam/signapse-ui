## 1. Dashboard Contract Boundary

- [x] 1.1 Re-check the latest `docs/api_mapping.json` `GET /dashboard/summary` path and dashboard schemas against this change, update the mapping ledger/artifacts if BE has changed them, and treat the latest backend contract as authoritative.
- [x] 1.2 Add the Assets in Focus context, item, metric, and asset-type Zod schemas; enforce the backend maximum of six items; require `assetsInFocus` on `DashboardSummaryResponse`; and align dashboard required-nullable fields and open string error codes with OpenAPI.
- [x] 1.3 Add a focused deterministic schema check covering a valid one-to-six-item metric, all documented asset types and metric states, `context.summary: null`, an unknown canonical error-code string, a missing required field, and more than six items.

## 2. Production Assets In Focus Surface

- [x] 2.1 Add Vietnamese and English `workspaceOverview.assetsInFocus` copy for headings, descriptions, actions, asset-type labels, empty/denied/error states, accessible names, and invalid-time fallback.
- [x] 2.2 Create a production-local Assets in Focus Server Component that renders available items in backend order with asset identity, neutral type Badge, context title, optional summary, localized observed time, and no unsupported source, direction, price, or quick-detail inference.
- [x] 2.3 Implement independent endpoint-error, `EMPTY`, `DENIED`, and `ERROR` states without mock/stale fallback data or a duplicate tracked-asset management action.
- [x] 2.4 Add permission-aware Graph View header navigation and per-item Market Charts links using the existing capability helpers and `/market-charts?assetId={assetId}&timeframe=1h`.
- [x] 2.5 Add an accessible responsive Assets in Focus skeleton that preserves the Card header action and representative row footprint with motion-reduction-safe Skeletons.

## 3. Dashboard Composition

- [x] 3.1 Integrate `summary.assetsInFocus`, summary error, locale, dictionary, and destination capabilities into the production dashboard after the Event Timeline/Latest News row without adding a data request.
- [x] 3.2 Render Assets in Focus at the available production width while Market Narratives is absent, and add the matching section to `WorkspaceOverviewSkeleton`.
- [x] 3.3 Confirm Current Workspace remains the only tracked-asset management surface and `/dashboard-prototype` remains unchanged and isolated.

## 4. Verification

- [x] 4.1 Run the focused schema assertion, `pnpm typecheck`, `pnpm lint`, and `git diff --check`.
- [x] 4.2 Run strict OpenSpec validation for `add-dashboard-assets-in-focus` and static searches confirming no prototype mock/scenario import, no Assets in Focus aggregation request, no frontend item re-sort, and no duplicate watchlist management trigger.

User-owned manual QA: compare authenticated `/vi/dashboard` and `/en/dashboard` against `/dashboard-prototype` using available, empty, denied, error, and destination-permission combinations at desktop/mobile widths, light/dark themes, and 200% zoom.
