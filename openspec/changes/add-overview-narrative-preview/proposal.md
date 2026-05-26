## Why

The workspace overview now clearly shows the active workspace and tracked-asset readiness, but it does not yet surface the market thesis layer that the backend already exposes through `/narratives`. Adding a small narrative preview helps users understand what market stories are currently relevant to their workspace without turning the overview into a full dashboard.

## What Changes

- Add a separate `Luận điểm nổi bật` preview section below the existing workspace/tracked-asset overview panel.
- Fetch narrative summaries from `GET /narratives` for users with `narrative:read`.
- Show at most three backend-ranked/relevant narratives with title, thesis or summary, status, confidence, primary asset symbol, and last updated metadata.
- Treat backend filtering/ranking as authoritative; the frontend MUST NOT client-filter narratives by watchlist assets or workspace membership.
- Hide the narrative preview for users without `narrative:read` instead of showing an access-denied block on the overview.
- Preserve the current overview hierarchy: workspace identity first, tracked assets second, narrative preview as a separate insight section third.
- Do not add narrative create/update/archive/refresh actions, detail routes, quick-detail drawers, or navigation entries in this change.

## Capabilities

### New Capabilities

- `workspace-overview-narrative-preview`: Defines the overview narrative preview layout, permissions, data source, backend filtering expectation, and empty/error behavior.

### Modified Capabilities

- None.

## Impact

- Affected code: root overview page, new or existing narrative API action/definition helpers, narrative permission helper or literal, i18n dictionary entries, and overview skeleton.
- Affected backend contract: frontend consumes `GET /narratives` and relies on backend query behavior to return the relevant top narratives for the overview. If query parameters are needed, they should express overview relevance/page size while leaving filtering/ranking on the backend.
- Affected UX: overview gains a compact read-only market thesis preview without adding operator controls.
- No new dependencies are expected.
