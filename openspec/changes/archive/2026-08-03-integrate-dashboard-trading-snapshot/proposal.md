## Why

The production `/dashboard` currently stops at the Current Workspace overview, while the reviewed dashboard prototype already defines a Trading Snapshot that helps users scan the next high-impact event, recent market events, active narratives, and latest news. The backend now exposes these values through one workspace-scoped `GET /dashboard/summary` response, so the production dashboard can adopt the reviewed section without issuing four separate aggregate requests or using mock data.

## What Changes

- Add the live Trading Snapshot section to the protected localized `/dashboard` route.
- Add a frontend action and validated response definitions for `GET /dashboard/summary`.
- Render the prototype's four-card hierarchy with backend values for `nextKeyEvent`, `marketEvents24h`, `activeNarratives`, and `latestNews6h`.
- Preserve the backend distinction between `AVAILABLE`, `EMPTY`, `DENIED`, and `ERROR`; denied or failed metrics must not appear as zero counts.
- Preserve the existing Current Workspace gate, watchlist preview, permissions, loading behavior, and localized dashboard copy.
- Keep `/dashboard-prototype` isolated with its route-local mock data and review scenarios.
- Keep `docs/APIMAPPING.md` aligned with the already-updated backend snapshot.

## Capabilities

### New Capabilities

- `dashboard-trading-snapshot`: Live Trading Snapshot data loading and four-card presentation on the production dashboard.

### Modified Capabilities

- `workspace-overview-surface`: Extend the successful dashboard overview composition with the live Trading Snapshot while preserving the Current Workspace surface as the workspace-orientation anchor and retaining all existing gate/watchlist states.

## Impact

- Frontend data layer: add a dashboard summary action and response schemas/types under `app/api/dashboard` and `app/lib/dashboard`.
- Dashboard route: update `app/[lang]/(main)/dashboard` to load and render the summary once after workspace context is available.
- UI and localization: reuse the prototype's snapshot hierarchy and existing economic-calendar formatters, with localized production labels and metric-state copy in both dictionaries.
- API documentation: retain the synchronized `docs/APIMAPPING.md` entry for `/dashboard/summary`.
- No backend API, database, dependency, route, or prototype mock-data changes are required.
