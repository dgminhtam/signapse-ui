## Context

`GET /market-charts/annotations` now returns the primary annotation reaction as `topMarketReaction`. The current frontend DTO still exposes the removed `reaction` field and the popup reads that field for reaction-derived confidence.

## Goals / Non-Goals

**Goals:**

- Map `topMarketReaction` in the market chart annotation response type and Zod schema.
- Read popup reaction confidence from `annotation.topMarketReaction`.
- Omit reaction-derived confidence when `topMarketReaction` is null or missing.

**Non-Goals:**

- No outcome mapping or outcome display.
- No fallback to removed `reaction`.
- No fallback to `marketReactions[0]`.
- No helper function, new component, new label, or popup layout expansion.

## Decisions

1. Replace the direct popup read with a direct `topMarketReaction` read.
   - This matches the backend primary-reaction contract and avoids keeping compatibility logic for a removed field.
   - Alternative considered: helper with `topMarketReaction -> reaction -> marketReactions[0]`. Rejected because the legacy field is gone and `topMarketReaction` is the backend-owned primary selection.

2. Map `marketReactions[]` only if needed for contract completeness, not for popup behavior.
   - The popup will not derive a primary reaction from the list.
   - This keeps list handling available for a later outcome/list UI without changing current behavior.

3. Leave marker direction unchanged.
   - Marker grouping and color already use top-level `annotation.direction`.
   - This change is only about the primary reaction field used by annotation detail.

## Risks / Trade-offs

- [Risk] Backend may return `marketReactions[]` without `topMarketReaction`. -> Mitigation: the popup omits reaction-derived confidence as requested; no guessed primary reaction.
- [Risk] Existing local fixtures using `reaction` lose popup reaction confidence. -> Mitigation: update fixtures or accept omission because the field is no longer in the contract.
