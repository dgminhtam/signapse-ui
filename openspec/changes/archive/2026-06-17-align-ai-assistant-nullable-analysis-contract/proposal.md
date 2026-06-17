## Why

Backend market conversation responses now distinguish analysis turns from non-analysis turns through the existing message fields: non-analysis assistant turns return `kind=TEXT` with `analysisId=null`, while analysis turns return `kind=ANALYSIS` with a persisted `analysisId`. The frontend needs an explicit contract so chat, clarification, and refusal turns remain natural text responses instead of being treated as analysis attempts.

## What Changes

- Treat `assistantMessage.kind` as the primary discriminator for Assistant UI analysis-part mapping.
- Render a compact analysis disclosure only when an assistant message has `kind=ANALYSIS` and a valid non-null `analysisId`.
- Render `TEXT` assistant messages as normal assistant text, including chat, clarification, and refusal turns.
- Keep `analysisId` nullable across submit, conversation detail, and message-list flows.
- Do not infer chat, clarification, or refusal subtypes from text content because the API does not expose a `responseType` field.
- Do not add endpoints or change `/market-analyses/{id}`, `/market-analyses/{id}/evidence`, or `POST /query`.
- Add deterministic checks that prevent future regressions such as rendering analysis UI for `TEXT` messages with null or stray analysis identifiers.

## Capabilities

### New Capabilities

- `ai-assistant-nullable-analysis-contract`: Covers frontend mapping and UX behavior for nullable market conversation `analysisId` values and `TEXT` versus `ANALYSIS` assistant message kinds.

### Modified Capabilities

None.

## Impact

- Assistant conversation DTO typing and runtime conversion in `components/assistant-ui/market-conversation-runtime.ts`.
- Assistant modal message-part rendering in `components/assistant-ui/assistant-modal.tsx` and analysis disclosure behavior.
- Submit, detail, and message-list handling for `POST /market-conversations/{id}/messages`, `GET /market-conversations/{id}`, and `GET /market-conversations/{id}/messages`.
- API mapping documentation in `docs/APIMAPPING.md` and, if the OpenAPI snapshot changes, `docs/api_mapping.json`.
- Focused deterministic runtime checks for nullable `analysisId`, `TEXT` messages, and inconsistent backend payloads.
