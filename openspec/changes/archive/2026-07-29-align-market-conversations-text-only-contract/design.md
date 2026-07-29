## Context

`docs/api_mapping.json` now defines `ChatMessageResponse` without `kind` or `analysisId`, limits message status to `COMPLETED | FAILED`, and defines `SubmitConversationMessageResponse` with only `userMessage` and `assistantMessage`. The frontend still validates the removed fields and converts analysis messages into a named Assistant UI data part that owns lazy detail loading.

This change crosses the contract, server-action, assistant runtime, UI, localization, documentation, and main-spec boundaries. The standalone `/demo-conversation` fixture does not call these APIs and is outside the change.

## Goals / Non-Goals

**Goals:**

- Parse current conversation list, detail, history, and submit responses without requiring removed fields.
- Represent backend conversation messages as user or assistant text with completed or failed status.
- Delete the unreachable conversation analysis-part path and its state, actions, copy, and check.
- Keep API mapping documentation and main OpenSpec requirements consistent with the new backend contract.

**Non-Goals:**

- Change conversation endpoints, permissions, pagination, persistence, synchronous submission, or optional `asOfTime` behavior.
- Change the standalone `add-demo-conversation` route or artifacts.
- Remove backend market-analysis endpoints from the source snapshot.
- Add a replacement analysis detector, text parser, metadata field, compatibility adapter, or feature flag.

## Decisions

### Map the backend DTO directly

`MarketChatMessageResponse` will retain only the fields published by `ChatMessageResponse`. Its role and status enums will match the backend exactly, and the submit response will not model a top-level analysis identifier.

The implementation will change only confirmed conversation-contract drift. It will not use the OpenAPI generator's broader omission of response `required` arrays as a reason to make unrelated DTO fields optional.

Alternative considered: preserve `kind` and `analysisId` as optional compatibility fields. Rejected because the backend removed them and keeping aliases would preserve dead branches and future drift.

### Emit text parts only

The shared conversation mapper will convert assistant content directly to an Assistant UI text part and will keep failed responses mapped to the existing incomplete status. Backend `PENDING` mapping, analysis metadata, data-part validation, and named data rendering will be removed.

Alternative considered: infer whether text looks like analysis and retain the disclosure. Rejected because content heuristics recreate a discriminator the backend deliberately removed.

### Delete the analysis disclosure path at its only entry point

Removing the named data part makes `MarketAnalysisPart`, analysis cache state, load/toggle callbacks, and their focused check unreachable. These sources and analysis-only dictionary entries will be deleted rather than retained for a hypothetical future caller.

Frontend actions and contract types for `/market-analyses/*` will also be removed when static usage confirms the deleted disclosure was their only caller. The backend endpoints remain in `docs/api_mapping.json` and will be described in the ledger as having no active frontend surface.

Alternative considered: keep unused actions and types because the endpoints still exist. Rejected because a future surface can add the contract it actually needs; unused integration code would otherwise imply support that no UI can reach.

### Update requirements through delta specs

The nullable-analysis and structured-analysis-part capabilities will lose requirements that depend on `kind` or `analysisId`. The market-conversation capability will describe ordinary assistant text and remove detail, evidence, and Telegram behaviors that were reachable only through a message analysis identifier.

Alternative considered: edit archived changes or `add-demo-conversation`. Rejected because archived artifacts are historical records and the demo is explicitly independent.

## Risks / Trade-offs

- [Backend still emits an undocumented removed field during rollout] → Zod object parsing may ignore it, but no frontend behavior will depend on it.
- [A hidden caller still uses a market-analysis action or type] → Run CodeGraph/static reference checks before deletion and keep any source with a real non-conversation caller.
- [Analysis-specific dictionary removal breaks typed dictionary parity] → Remove matching English and Vietnamese entries together and run typecheck.
- [Main specs contain unrelated historical route drift] → Modify only requirements affected by text-only messages; leave broader route cleanup to a separate change.

## Migration Plan

1. Align conversation DTOs and schemas, then simplify the runtime mapper.
2. Remove the modal data renderer, controller analysis state, disclosure component, dead actions/contracts, localization, and obsolete check.
3. Update `docs/APIMAPPING.md` from the current JSON snapshot.
4. Run the replacement text-only runtime check, targeted lint, typecheck, static stale-reference search, and strict OpenSpec validation.

Rollback restores the previous frontend mapper and disclosure sources only if the backend restores `kind`, `analysisId`, and the previous status enum. No data migration is required.

## Open Questions

None.
