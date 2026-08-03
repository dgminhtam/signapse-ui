## 1. Dashboard summary data layer

- [x] 1.1 Add `app/lib/dashboard/definitions.ts` with Zod-backed response types for `DashboardSummaryResponse`, scope, event data, count/narrative metrics, windows, states, and nullable values from `GET /dashboard/summary`.
- [x] 1.2 Add `app/api/dashboard/action.ts` with one authenticated `getDashboardSummary()` action that sends no body or query parameters and returns the validated response.
- [x] 1.3 Add the smallest transport/error handling needed for summary-level failures without changing the existing behavior of unrelated API actions.

## 2. Production dashboard composition

- [x] 2.1 Add a production-local Trading Snapshot component by adapting only the prototype's four-card presentation and `SnapshotCard` layout; do not import prototype mock constants, scenario controls, or static event values.
- [x] 2.2 Update `app/[lang]/(main)/dashboard/page.tsx` to load the summary once after the existing workspace gate and current-workspace resolution, running it in parallel with the existing tracked-asset preview where possible.
- [x] 2.3 Map `nextKeyEvent` with canonical title, scheduled time, currency, and the existing economic-calendar impact helpers; map the three count metrics using localized number formatting.
- [x] 2.4 Render `AVAILABLE`, `EMPTY`, `DENIED`, and `ERROR` independently, ensuring only backend `EMPTY` count states render a known zero and top-level 403/409/transport failures do not create mock or stale card values.

## 3. Localization and UI states

- [x] 3.1 Add production Trading Snapshot labels, descriptions, no-data copy, unavailable/error copy, and accessible names to both `vi` and `en` dictionaries.
- [x] 3.2 Add loading skeleton, summary-level failure, and metric-level empty/denied/error treatments that preserve the final responsive card footprint and existing Current Workspace surface.
- [x] 3.3 Verify responsive, semantic-heading, keyboard-focus, decorative-icon, light/dark, and 200%-zoom behavior using existing shadcn primitives and semantic tokens.

## 4. Documentation and verification

- [x] 4.1 Verify `docs/APIMAPPING.md` remains aligned with `docs/api_mapping.json` for `/dashboard/summary`, operationId `getSummary`, response schemas, states, permissions, and frontend integration status.
- [x] 4.2 Run `pnpm typecheck` and `pnpm lint`, fixing only regressions caused by this change.
- [x] 4.3 Run `openspec.cmd validate integrate-dashboard-trading-snapshot --type change --strict --no-interactive` and resolve change-spec validation issues.

User-owned manual QA: authenticated `/vi/dashboard` and `/en/dashboard` checks with active/empty/denied/error summary states, plus visual comparison against `/dashboard-prototype` at desktop, mobile, dark mode, and 200% zoom.
