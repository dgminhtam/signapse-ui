## Why

The production dashboard currently stops after Current Workspace and Trading Snapshot, even though `/dashboard-prototype` already defines the reviewed Event Timeline surface. Backend has now extended the existing `GET /dashboard/summary` contract with `recentEvents`, so the production route can adopt the timeline without a new endpoint or client-side aggregation.

## What Changes

- Add a production `Event Timeline` section to the localized dashboard, sourced from `summary.recentEvents`.
- Extend the dashboard summary Zod schema and types so the existing authenticated action preserves the new metric instead of stripping it.
- Render `AVAILABLE`, `EMPTY`, `DENIED`, and `ERROR` states independently, with loading skeleton, responsive layout, accessibility, and localized copy.
- Render event title, description, occurred time, confidence, themes, affected-asset symbols, and links to `/events/{id}`; keep a module-level link to `/events`.
- Keep `/dashboard-prototype` route-local mocks and scenarios unchanged; do not add a separate dashboard events request or introduce a new API endpoint.

## Capabilities

### New Capabilities

- `dashboard-event-timeline`: Production dashboard Event Timeline behavior, including the `recentEvents` metric contract, state handling, event presentation, navigation, localization, and responsive/accessibility rules.

### Modified Capabilities

- `dashboard-trading-snapshot`: The production summary response validation and dashboard data flow expand from four metrics to include the additive `recentEvents` metric while preserving independent metric states.
- `workspace-overview-surface`: The successful overview gains the live Event Timeline as a separate decision-oriented section after the existing Trading Snapshot.

## Impact

- **Frontend:** `app/lib/dashboard/definitions.ts`, `app/api/dashboard/action.ts`, the localized dashboard page/components, and `en`/`vi` dictionaries.
- **API contract:** Consumes the additive `recentEvents` field from `GET /dashboard/summary`; no endpoint or request-parameter change is required.
- **Navigation:** Uses the existing `/events` list and `/events/{id}` detail routes; no events API implementation changes are in scope.
- **Documentation:** `docs/APIMAPPING.md` is already synchronized with the backend contract update.
- **Dependencies:** No new dependency or prototype-route cleanup is required.
