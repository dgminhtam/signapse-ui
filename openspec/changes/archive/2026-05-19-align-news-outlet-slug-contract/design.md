## Context

`docs/api_mapping.json` is the source of truth for the current backend snapshot. The latest news outlet schemas no longer expose `slug` on create, update, list, or detail responses, and `NewsOutletListResponse` no longer exposes `description`. The frontend list already avoids rendering `slug` and `description`, but the shared definitions and create/edit form still model, render, and submit `slug`.

`docs/APIMAPPING.md` now notes the removed fields, but its endpoint table still marks parts of the detail/update flow as fully implemented. The ledger should identify the remaining drift until the frontend code is cleaned up.

## Goals / Non-Goals

**Goals:**
- Make `docs/APIMAPPING.md` internally consistent for news outlet detail and update rows.
- Align frontend news outlet DTOs with the current backend snapshot by removing `slug`.
- Remove `slug` from the create/edit form UI and submitted payload.
- Keep `description` available in create/edit/detail flows and absent from list usage.

**Non-Goals:**
- Redesign the detail/edit screen beyond removing obsolete `slug` fields.
- Change backend endpoints, permissions, pagination, sorting, or route names.
- Reintroduce a separate read-only detail page.
- Modify unrelated workspace, asset, article, graph, or market-query contract drift.

## Decisions

- Treat backend-generated slug as an internal backend concern.
  - Rationale: the current OpenAPI snapshot removed it from all news outlet frontend-facing contracts.
  - Alternative considered: keep an optional frontend-only slug field. This would preserve stale UI but continue submitting an unsupported field.

- Keep one `NewsOutletRequest` type for create and update unless the implementation needs stricter create/update split.
  - Rationale: the backend request shapes now share the same optional fields except `name` and `homepageUrl` requiredness; the existing action layer already uses one request type.
  - Alternative considered: introduce separate create/update request types. This adds precision but is not required to remove slug safely.

- Update APIMAPPING endpoint rows and drift notes together.
  - Rationale: endpoint status and notes should not contradict the drift summary.
  - Alternative considered: only update the drift summary. This leaves the row-level ledger misleading for implementers scanning the table.

## Risks / Trade-offs

- Existing bookmarked/detail URLs may previously have displayed slug metadata -> remove only the obsolete metadata, while keeping name, description, URLs, active state, and timestamps intact.
- Backend may tolerate unknown fields today -> removing `slug` is still safer because it matches the published snapshot and avoids relying on permissive parsing.
- Form layout will become slightly shorter -> verify focused form shell spacing and skeletons still mirror the final layout.
