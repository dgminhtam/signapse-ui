## Why

The current market-query surface is a one-shot form that loses conversation history and does not expose persisted analyses, evidence snapshots, or manual Telegram delivery. Backend now exposes synchronous market conversation and market analysis APIs, so the frontend should promote the persisted conversation experience as the primary workflow.

## What Changes

- Add a protected market conversation surface at `/market-conversations` with a list, conversation detail, message composer, analysis messages, evidence drawer, and manual Telegram send action.
- Create conversations from the user's first submitted question, deriving the initial conversation title from that question instead of asking for a separate title first.
- Use `GET/POST /market-conversations`, `GET /market-conversations/{id}`, `POST /market-conversations/{id}/messages`, `GET /market-analyses/{id}`, `GET /market-analyses/{id}/evidence`, and `POST /market-analyses/{id}/telegram-deliveries`.
- Consume active Telegram destinations from the existing Telegram destination API for manual analysis delivery; `status === "ACTIVE"` is sufficient for Phase 10 destination eligibility.
- Render persisted analysis content with answer, limitations, assets considered, reasoning, key events, key narratives, evidence access, and Telegram delivery state.
- Remove the legacy one-shot `/market-query` product experience from navigation and route behavior; the conversation UI becomes the market query entry point.
- Exclude token streaming, `/market-conversations/{id}/messages/stream`, conversation rename/delete/archive, message edit/delete/regenerate, retry-by-message-id, default Telegram feature routing, and raw trace visualization.

## Capabilities

### New Capabilities
- `market-conversation-ui`: Covers protected persisted market conversation listing, creation from first question, conversation detail timeline, synchronous message submission, analysis detail rendering, evidence drawer, and manual Telegram delivery.

### Modified Capabilities
- `market-query-workbench`: Retire the one-shot `/market-query` workbench requirement in favor of the persisted `/market-conversations` surface and remove legacy `/query` as the primary frontend market query flow.

## Impact

- Frontend routes/navigation: add `/market-conversations` and `/market-conversations/[conversationId]`; update sidebar and breadcrumb mapping away from `/market-query`.
- API actions/types: extend market query data layer for conversation, analysis, evidence, and Telegram delivery endpoints using `fetchAuthenticated()` and Zod validation.
- UI components: add list/create prompt, conversation timeline, composer, assistant analysis message, evidence drawer, Telegram destination picker/send action, skeletons, empty states, and error states.
- Existing market query UI: remove or replace the one-shot workbench and avoid calls to `POST /query` from the primary product surface.
- Localization: add English and Vietnamese dictionary copy for all new user-facing labels, validation, toasts, empty states, and errors.
- Telegram dependency: reuse active destinations from the existing Telegram configuration integration without adding a `MANUAL_MARKET_ANALYSIS` feature route.
- Documentation/verification: keep `docs/APIMAPPING.md` aligned after integration and validate OpenSpec plus TypeScript/lint checks.
