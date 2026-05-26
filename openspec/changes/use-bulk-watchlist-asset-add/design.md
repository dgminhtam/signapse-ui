## Context

The workspace watchlist editor currently compares the initially loaded tracked assets with the user's selected assets. Removed assets are synchronized through `DELETE /watchlists/assets/{assetId}` and added assets are synchronized by calling `POST /watchlists` once per asset.

The current backend snapshot adds `POST /watchlists/assets` with `BulkCreateWatchlistAssetsRequest` and `BulkCreateWatchlistAssetsResponse`. The request accepts `assetIds` with `maxItems: 100`; the response returns created or already-existing asset ids plus the resulting watchlist items. The delete API remains asset-level.

## Goals / Non-Goals

**Goals:**
- Add frontend DTOs and a server action for `POST /watchlists/assets`.
- Replace the editor's per-asset add fan-out with bulk add calls.
- Preserve existing remove behavior, no-change behavior, pending feedback, permission gating, refresh behavior, and server-truth reload on failure.
- Respect the backend 100-item request limit with deterministic chunking.
- Update `docs/APIMAPPING.md` so the watchlist ledger reflects the new frontend integration state.

**Non-Goals:**
- Remove the legacy single-add action unless it becomes unused after implementation and can be deleted safely.
- Change watchlist read or delete endpoints.
- Redesign the watchlist editor, asset combobox, workspace switcher, or market chart asset selection.
- Expose grouped/named watchlists, watchlist descriptions, or multi-workspace watchlist management.
- Add client-side hard caps to selection count beyond what is necessary to submit chunks safely.

## Decisions

- Use the bulk endpoint for all add operations, including a single added asset.
  - Rationale: this keeps one canonical add path and aligns with the backend-preferred contract.
  - Alternative considered: call bulk only when adding two or more assets. That keeps two add paths alive and increases test surface for little benefit.

- Chunk `assetsToAdd` into batches of at most 100 asset ids.
  - Rationale: the OpenAPI schema declares `maxItems: 100`; chunking lets the UI handle larger editor selections without relying on backend rejection.
  - Alternative considered: block saving when more than 100 assets are newly added. That is stricter than necessary and can frustrate large workspace setup.

- Treat `existingAssetIds` as a successful idempotent result.
  - Rationale: an asset may already exist because of concurrent edits or stale client state. The backend explicitly reports existing assets separately, so this should not be handled as a failure.
  - Alternative considered: show a warning when existing ids are returned. That adds noise and does not change the final server truth.

- Keep remove operations asset-level with `Promise.all`.
  - Rationale: the backend snapshot does not expose a bulk delete endpoint.
  - Alternative considered: delay removal until a future bulk-delete API exists. That would regress current editor behavior.

## Risks / Trade-offs

- [Partial add chunk failure] -> Treat any failed bulk add or delete action as synchronization failure, keep the dialog open, reload watchlist state, and refresh the route.
- [Concurrent watchlist edits] -> Rely on backend idempotency via `existingAssetIds` and reload server truth after failures.
- [Legacy single-add action remains unused] -> Remove it during implementation only if no callers remain; otherwise leave it as an explicit legacy helper until a separate cleanup.
- [Docs drift] -> Update `docs/APIMAPPING.md` after code changes and keep unrelated watchlist/market chart notes intact.
