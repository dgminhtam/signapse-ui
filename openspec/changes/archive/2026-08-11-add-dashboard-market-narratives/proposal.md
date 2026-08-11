## Why

Backend now returns a required, workspace-scoped `marketNarratives` metric from the existing `GET /dashboard/summary` contract, but the production dashboard validation boundary strips the field and the accepted Market Narratives presentation remains available only in the mock prototype. Integrating the metric now gives users a compact view of emerging, weakening, and active market theses without frontend aggregation, detail fan-out, or a second dashboard request.

## What Changes

- Extend the production dashboard summary validation and types to preserve the required `marketNarratives` metric and its exact backend required-versus-nullable contract.
- Add a production-local, localized Market Narratives section adapted from `/dashboard-prototype` and populated only by the existing authenticated summary response.
- Render at most three narratives in backend order with title, thesis, lifecycle status, optional confidence, primary theme title when available, all returned asset symbols, and localized update time.
- Provide explicit `AVAILABLE`, defensive empty, `EMPTY`, `DENIED`, `ERROR`, endpoint-failure, and loading presentations without mock or stale fallback data.
- Gate the module-wide Graph View action with the existing destination permission and avoid adding narrative detail links that the production app does not own.
- Pair the existing Assets in Focus and new Market Narratives sections in the accepted seven-to-five desktop grid while preserving stacked responsive behavior.
- Keep `/dashboard-prototype` isolated and unchanged.

## Capabilities

### New Capabilities

- `dashboard-market-narratives`: Defines contract validation, live rendering, states, localization, navigation, accessibility, backend-order preservation, and prototype isolation for the production Market Narratives section.

### Modified Capabilities

- `dashboard-trading-snapshot`: Expands the one-request dashboard summary contract from six to seven required metrics and includes Market Narratives in validation and independent metric-state behavior.
- `workspace-overview-surface`: Adds Market Narratives to the successful and loading overview composition and pairs it with Assets in Focus at the accepted seven-to-five desktop relationship.

## Impact

- Affected contract boundary: `app/lib/dashboard/definitions.ts`, `app/lib/narratives/definitions.ts`, and the focused dashboard schema assertion; `app/api/dashboard/action.ts` transport remains unchanged.
- Affected production UI: `app/[lang]/(main)/dashboard/page.tsx` plus a new route-local Market Narratives Server Component and matching skeleton.
- Affected localization: Vietnamese and English `workspaceOverview` dictionary copy for Market Narratives content, actions, states, and formatting fallbacks.
- Existing Graph View permission helpers, localized links, shadcn wrappers, and the current `GET /dashboard/summary` request are reused; no new endpoint, dependency, client aggregation, or N+1 request is introduced.
- `docs/api_mapping.json` remains the backend source of truth. `docs/APIMAPPING.md` has been synchronized to the current snapshot and must be rechecked if BE adjusts the contract again before apply.
