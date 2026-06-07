## Why

The conversation detail route currently receives and renders the entire `messages[]` array, so long threads push the composer out of view and become increasingly expensive to load. The desired market conversation experience is a chat-style detail page where the composer stays available at the bottom and older messages load incrementally as the user scrolls upward.

## What Changes

- Add a paginated/cursor-based market conversation message loading contract for `/market-conversations/{id}` detail views.
- Change the conversation detail route to load the latest message page first instead of relying on a full `messages[]` payload for the main timeline.
- Add reverse lazy loading: when the user scrolls near the top of the message viewport, fetch older messages, prepend them, and preserve scroll position.
- Keep the follow-up composer fixed at the bottom of the conversation workspace while only the message viewport scrolls.
- Preserve current synchronous message submission behavior, local pending placeholders, analysis expansion, evidence sheet, Telegram delivery, history sheet, permissions, and locale-aware routing.
- Keep the existing conversation history sheet pagination separate from message pagination.

## Capabilities

### New Capabilities

- `market-conversation-message-lazy-loading`: Covers paginated conversation message retrieval, reverse infinite scroll behavior, scroll-position preservation, and the sticky-bottom composer on `/market-conversations/{id}`.

### Modified Capabilities

None.

## Impact

- Backend/API contract: add or align a message-page endpoint such as `GET /market-conversations/{id}/messages` with cursor or `beforeMessageId` semantics, plus `size` and `hasMore`/next-cursor metadata.
- Frontend API mapping/docs: update `docs/api_mapping.json` and `docs/APIMAPPING.md` when the backend contract changes.
- Frontend data layer: add message page request/response types, Zod schemas, and authenticated server action/client-accessible fetch flow.
- Frontend route/UI: update `/market-conversations/[conversationId]` detail layout, initial load, older-message fetch state, pending submission append behavior, skeletons, empty states, and localized copy.
- Verification: OpenSpec validation, lint, typecheck, deterministic review of scroll behavior and API contract handling.
