## Why

The backend market-conversation contract no longer classifies messages as `TEXT` or `ANALYSIS` and no longer returns `analysisId` or `PENDING` message state. The frontend still requires those removed fields, so valid conversation responses can fail parsing and the assistant retains an unreachable analysis-detail path.

## What Changes

- **BREAKING** Align conversation message DTOs and Zod schemas with the backend text-only `ChatMessageResponse` and submit response.
- Render every assistant conversation response as ordinary text while preserving user/assistant role, completed/failed status, failure feedback, history, and synchronous submission behavior.
- Remove the Assistant UI `market-analysis` data part, its disclosure component, conversation-scoped analysis cache/loading controls, obsolete analysis-only localization, and focused runtime check.
- Remove frontend market-analysis actions and contracts that become unreferenced after the conversation disclosure is removed; keep the still-published backend endpoints documented without claiming an active frontend surface.
- Update `docs/APIMAPPING.md` to record the confirmed backend contract and remaining frontend ownership.
- Replace the main OpenSpec requirements that still mandate `kind`, `analysisId`, analysis disclosure, evidence browsing, or Telegram delivery from a conversation message.
- Keep the standalone `add-demo-conversation` change and route unchanged.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `ai-assistant-nullable-analysis-contract`: Replace nullable analysis-kind handling with backend text-only message mapping and no subtype inference.
- `ai-assistant-market-analysis-parts`: Remove the obsolete structured market-analysis message-part capability.
- `market-conversation-ui`: Make persisted and submitted assistant messages text-only and remove analysis detail, evidence, and Telegram actions that depended on `analysisId`.

## Impact

- Contract and validation: `app/lib/market-query/definitions.ts`.
- Server actions: `app/api/market-conversations/action.ts`.
- Assistant runtime and UI: `components/assistant-ui/market-conversation-runtime.ts`, `assistant-modal.tsx`, `use-market-conversation-assistant.ts`, and removal of `market-analysis-part.tsx`.
- Localization and checks: analysis-only assistant dictionary entries and `scripts/check-assistant-market-analysis-runtime.ts`.
- Documentation and specifications: `docs/APIMAPPING.md` plus the three modified OpenSpec capabilities.
- No dependency, route, persistence, permission, or `add-demo-conversation` changes.
