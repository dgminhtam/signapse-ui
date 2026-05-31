## 1. Confirm contract and current usage

- [x] 1.1 Reconfirm `POST /watchlists/assets` request, response, permission, and `maxItems: 100` directly from `docs/api_mapping.json`.
- [x] 1.2 Search existing watchlist actions, definitions, editor, and docs for single-add usage and related copy.
- [x] 1.3 Confirm removal remains asset-level through `DELETE /watchlists/assets/{assetId}`.

## 2. Add bulk watchlist API definitions and action

- [x] 2.1 Add `BulkCreateWorkspaceWatchlistAssetsRequest` and `BulkCreateWorkspaceWatchlistAssetsResponse` definitions matching the backend schema.
- [x] 2.2 Add a server action that calls `POST /watchlists/assets` with `{ assetIds }` and returns `ActionResult<BulkCreateWorkspaceWatchlistAssetsResponse>`.
- [x] 2.3 Remove or retain the legacy single-add action based on actual remaining callers, without leaving dead imports.

## 3. Update workspace watchlist synchronization

- [x] 3.1 Replace per-asset add calls in `WorkspaceWatchlistEditor` with bulk add calls for newly selected asset ids.
- [x] 3.2 Chunk bulk add payloads into batches of at most 100 asset ids.
- [x] 3.3 Treat `existingAssetIds` in successful responses as synchronized assets, not as failures.
- [x] 3.4 Preserve asset-level delete calls for removed assets.
- [x] 3.5 Preserve no-change behavior, pending state, duplicate-submit prevention, partial-failure reload, toast behavior, and route refresh.

## 4. Update API mapping documentation

- [x] 4.1 Update the watchlists endpoint table in `docs/APIMAPPING.md` so `POST /watchlists/assets` maps to the new frontend bulk action.
- [x] 4.2 Update drift notes so they no longer say the workspace watchlist editor adds assets through multiple `POST /watchlists` calls.
- [x] 4.3 Keep unrelated API drift notes intact.

## 5. Verification

- [x] 5.1 Run targeted search to confirm workspace watchlist add flow no longer calls the single-add action from the editor.
- [x] 5.2 Run targeted lint for touched watchlist action, definitions, editor, and docs-adjacent TypeScript files.
- [x] 5.3 Run `pnpm typecheck`.
- [x] 5.4 Run `openspec validate use-bulk-watchlist-asset-add --strict`.

User-owned manual QA:
- With a backend session that has workspace/watchlist data, save a watchlist edit that adds one asset, adds multiple assets, and adds more than 100 assets if practical; confirm the dialog refreshes and the tracked list matches server truth.
