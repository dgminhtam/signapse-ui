## Why

The production `/dashboard` is missing the Latest News module that already exists in the dashboard prototype. The existing `GET /news-articles` contract is sufficient to provide the five most recent global articles, so the module can be added without a backend change.

## What Changes

- Add a live Latest News module to the protected, localized `/dashboard` route.
- Load five global articles from `GET /news-articles`, ordered by `publishedAt` descending; do not scope the request to the active workspace.
- Keep the news request independent from the existing workspace, trading snapshot, and event timeline loading so a news failure does not blank the rest of the dashboard.
- Reuse the production news list route for the module header action and display only article title, description, source, and publication time; do not expose internal derivation status, event relations, calendar data, or row-level detail links.
- Add localized copy and loading, empty, error, and permission-aware states. Place Latest News beside Event Timeline in the dashboard layout and hide it when the user lacks the existing news read permission.
- Keep `dashboard-prototype` unchanged and add no backend endpoint, database migration, dependency, or router structure change.

## Capabilities

### New Capabilities

- `dashboard-latest-news`: The production dashboard renders the five latest global news articles using the existing authenticated news-articles API and provides resilient, localized module states.

### Modified Capabilities

- `workspace-overview-surface`: The dashboard overview composition includes an independent Latest News module alongside the existing workspace and trading modules while preserving the current workspace permission and empty-state gates.

## Impact

- Frontend route composition under `app/[lang]/(main)/dashboard`.
- Existing news-article action, definitions, and permission helpers are reused; no API contract or backend code changes are expected.
- English and Vietnamese dashboard dictionaries gain the required module labels and state copy.
- Automated verification remains frontend lint/typecheck plus OpenSpec validation; authenticated backend-data and visual QA remain follow-up checks for the implementation phase.
