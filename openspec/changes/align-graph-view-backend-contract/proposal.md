## Why

`/graph-view` is failing before render because the frontend Zod schema still validates the older graph edge contract while the backend snapshot now returns the news-article based contract. This should be fixed now because strict response validation currently rejects the whole graph payload and leaves the user with a generic console error.

## What Changes

- Align Graph View edge kind handling with the backend contract by replacing `source-artifact-event` with `news-article-event` across validation, labels, counts, HUD, and visual styling.
- Keep graph node kinds aligned with the current backend contract: `event`, `asset`, `theme`, and `news-article`.
- Improve validation diagnostics enough that future backend contract drift surfaces the failing paths and expected values clearly during development.
- Update Graph View contract documentation notes so the frontend ledger no longer claims the old edge kind is current.
- Do not redesign graph interaction, selection, hover, layout, or node detail behavior in this change.

## Capabilities

### New Capabilities

- `graph-view-backend-contract`: Graph View accepts and renders the current backend graph payload contract, including news article event edges.

### Modified Capabilities

- None.

## Impact

- Affects `app/lib/graph-view/definitions.ts`.
- Affects Graph View canvas/model files under `app/(main)/graph-view/`.
- Affects `app/api/graph-view/action.ts` validation diagnostics only if needed.
- Affects `docs/APIMAPPING.md` Graph View contract notes.
- No backend endpoint, dependency, route, or G6 engine changes are expected.
