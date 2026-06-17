## Context

The market conversation API now uses the existing `assistantMessage.kind` and nullable `analysisId` fields to separate normal assistant turns from persisted analysis turns. `POST /market-conversations/{id}/messages`, `GET /market-conversations/{id}`, and `GET /market-conversations/{id}/messages` share the same mapper: chat, clarification, and refusal assistant turns return `kind=TEXT` with `analysisId=null`; analysis turns return `kind=ANALYSIS` with a persisted analysis identifier.

The frontend already uses Assistant UI's external-store runtime and can render named data parts for persisted market analysis. This change aligns the runtime contract, documentation, and regression checks with the updated backend behavior so non-analysis turns stay conversational and do not show analysis affordances.

## Goals / Non-Goals

**Goals:**

- Treat `assistantMessage.kind` as the authoritative UI discriminator for analysis rendering.
- Accept nullable `analysisId` in submit, detail, and message-list responses without error states or placeholder analysis UI.
- Render only text for `TEXT` messages, including chat, clarification, and refusal turns.
- Render analysis details only for `ANALYSIS` messages with a valid non-null `analysisId`.
- Document the API mapping and add deterministic checks for nullable and inconsistent payloads.

**Non-Goals:**

- Adding a `responseType` concept in frontend state before the backend exposes one.
- Guessing chat, clarification, or refusal from assistant text content.
- Changing `/market-analyses/{id}`, `/market-analyses/{id}/evidence`, or `POST /query`.
- Adding evidence browsing, Telegram delivery, analysis workbench controls, tool-call UI, or generative UI.
- Eagerly fetching analysis details while listing or opening conversations.

## Decisions

### Prefer `kind` over `analysisId` when the payload is inconsistent

The converter treats a message as analysis-renderable only when both conditions are true: the assistant message has `kind === "ANALYSIS"` and `analysisId` is a valid positive number. If a `TEXT` message includes a stray `analysisId`, the UI still renders text only. If an `ANALYSIS` message has `analysisId=null`, the UI preserves the assistant text and does not attempt to load analysis detail.

Alternative considered: render analysis whenever `analysisId` is non-null. Rejected because the backend contract explicitly classifies the assistant turn through `kind`, and a stray identifier should not turn a chat, clarification, or refusal into analysis UI.

### Keep non-analysis subtypes out of the UI contract

The frontend does not model `CHAT`, `CLARIFICATION`, or `REFUSAL` as separate runtime variants because the API intentionally does not return `responseType`. These turns share the `TEXT` presentation: normal assistant text with no analysis disclosure, loading state, badge, or detail action.

Alternative considered: infer subtype from wording or keywords. Rejected because this would be brittle, locale-sensitive, and inconsistent with backend-owned orchestration.

### Keep analysis detail lazy and endpoint-stable

The analysis disclosure continues to fetch details only through the existing authenticated `getMarketAnalysisById()` action after the user expands a valid analysis part. The backend update does not require new endpoints, request fields, or changes to the standalone market analysis APIs.

Alternative considered: fetch analysis detail immediately after submit when the response includes `analysisId`. Rejected because the modal should keep answers immediately readable and avoid unnecessary requests for collapsed historical messages.

### Verify the contract at the runtime boundary

Focused deterministic checks should cover `TEXT + null`, `TEXT + stray id`, `ANALYSIS + id`, and `ANALYSIS + null`. This keeps the highest-risk contract behavior close to the runtime converter and avoids relying on visual inspection.

Alternative considered: only rely on typechecking. Rejected because all four payload combinations can be type-valid while still producing incorrect UI behavior.

## Risks / Trade-offs

- [Backend later exposes a stable non-analysis subtype] -> Add a separate proposal to introduce subtype-specific copy or UI only after the field is part of the contract.
- [Inconsistent payloads hide a valid analysis reference] -> Prefer contract safety and text continuity; document the inconsistency so backend mapper issues can be fixed without confusing users.
- [Users expect clarification/refusal to look distinct] -> Keep them natural as assistant text unless a product requirement defines stable subtype presentation.
- [OpenAPI snapshot lags behind backend behavior] -> Update `docs/api_mapping.json` only when a refreshed backend snapshot is available, and keep `docs/APIMAPPING.md` explicit about the current runtime contract.

## Migration Plan

1. Confirm DTO typing accepts nullable `analysisId` and preserves `assistantMessage.kind`.
2. Harden the runtime converter so only `ANALYSIS` plus a valid identifier emits a `data-market-analysis` part.
3. Keep modal rendering analysis-free for `TEXT` turns and preserve existing lazy analysis behavior for valid analysis parts.
4. Update API mapping documentation and add deterministic converter checks for the nullable contract.
5. Validate the OpenSpec change, run targeted lint/type checks, and perform static searches for forbidden subtype guessing or eager analysis loading.

Rollback is straightforward: revert the converter and documentation updates. The backend contract remains unchanged, and normal assistant text remains displayable.

## Open Questions

- None for the current backend contract. Subtype-specific UI for chat, clarification, or refusal should wait for a stable frontend-facing field.
