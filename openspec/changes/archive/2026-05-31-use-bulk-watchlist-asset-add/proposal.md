## Why

The backend snapshot now exposes `POST /watchlists/assets` for adding multiple assets to the current workspace watchlist in one request, while the frontend editor still calls the single-asset `POST /watchlists` endpoint once per added asset. Moving the add path to the bulk endpoint reduces request fan-out and aligns the editor with the current backend-supported workflow.

## What Changes

- Add frontend request and response definitions for `BulkCreateWatchlistAssetsRequest` and `BulkCreateWatchlistAssetsResponse`.
- Add a server action that calls `POST /watchlists/assets` with `{ assetIds }`.
- Update `WorkspaceWatchlistEditor` so newly selected assets are added through the bulk endpoint instead of multiple single-asset create calls.
- Keep asset removal on `DELETE /watchlists/assets/{assetId}` because the backend still exposes remove as an asset-level operation.
- Treat `existingAssetIds` in the bulk response as successful/idempotent outcomes, not synchronization failures.
- Respect the backend `maxItems: 100` constraint by chunking add payloads when more than 100 assets are newly selected.
- Update `docs/APIMAPPING.md` after the frontend no longer uses the single-add API for workspace watchlist additions.

## Capabilities

### New Capabilities

### Modified Capabilities
- `workspace-watchlist-management`: Change watchlist save behavior from per-asset add operations to bulk add operations while preserving asset-level removals and server-truth recovery on failure.

## Impact

- Affected frontend code:
  - `app/api/watchlists/action.ts`
  - `app/lib/watchlists/definitions.ts`
  - `components/workspace-watchlist-editor.tsx`
- Affected documentation:
  - `docs/APIMAPPING.md`
- Affected backend API usage:
  - Start using `POST /watchlists/assets`
  - Keep using `GET /watchlists` and `DELETE /watchlists/assets/{assetId}`
- No route, permission, dependency, workspace switcher, asset combobox, or backend changes are required.
