## 1. Dashboard contract and data flow

- [x] 1.1 Add Zod schemas and inferred types for `DashboardRecentEventItemResponse` and `DashboardRecentEventsMetricResponse`, including nested theme/affected-asset summaries and the documented metric states/error code.
- [x] 1.2 Extend `dashboardSummaryResponseSchema` and `DashboardSummaryResponse` so the existing authenticated `getDashboardSummary` action preserves `recentEvents` without adding a second request or endpoint.
- [x] 1.3 Confirm the dashboard page only loads the summary after the existing workspace gate and passes the validated metric/state to the production timeline.

## 2. Production Event Timeline UI

- [x] 2.1 Create a dashboard-local Event Timeline component using existing Card, Badge, Empty, Skeleton, icon, spacing, and semantic-token patterns; render backend item order with title, description, occurred time, confidence, themes, and affected-asset symbols/names.
- [x] 2.2 Implement independent `AVAILABLE`, `EMPTY`, `DENIED`, and `ERROR` rendering with no zero/mock fallback, plus a loading skeleton that preserves the final module footprint.
- [x] 2.3 Integrate the timeline after Trading Snapshot as a full-width section in the localized production dashboard and its loading fallback, without importing prototype mocks or scenario controls.
- [x] 2.4 Add localized module/row links using the existing navigation pattern: `/events` for the module action and `/events/{id}` for each event row.
- [x] 2.5 Add Vietnamese and English dictionary keys and apply existing locale-aware time/number formatting, compact icon-bearing time metadata, semantic headings, keyboard focus, and responsive no-overflow behavior.

## 3. Verification

- [x] 3.1 Run `pnpm typecheck` and resolve contract, route, and component typing errors.
- [x] 3.2 Run `pnpm lint` and resolve lint or accessibility-rule violations in the changed files.
- [x] 3.3 Run OpenSpec status validation for `add-dashboard-event-timeline`, `git diff --check`, and focused static searches confirming no prototype mock import or extra dashboard `/events` data request was introduced.
