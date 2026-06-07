## 1. API Contract And Mapping

- [ ] 1.1 Confirm backend message-page contract in `docs/api_mapping.json`, including path, query params, response shape, permission requirement, and message ordering.
- [ ] 1.2 Update `docs/APIMAPPING.md` from `docs/api_mapping.json` after the backend contract is available.
- [ ] 1.3 Add frontend message-page request/response types and Zod schemas in the market query definitions module.
- [ ] 1.4 Add an authenticated message-page fetch action using `fetchAuthenticated()` and defensive `response.text()` parsing.

## 2. Detail Data Flow

- [ ] 2.1 Update the conversation detail route to load conversation metadata separately from the latest message page.
- [ ] 2.2 Initialize client timeline state from the latest message page instead of full `conversation.messages`.
- [ ] 2.3 Preserve current analysis cache, evidence sheet, Telegram delivery, history sheet, permission gates, and locale-aware links while changing message loading.
- [ ] 2.4 Add localized loading, empty, and error copy for message-page failures and older-message loading states.

## 3. Chat Layout

- [ ] 3.1 Refactor `/market-conversations/[conversationId]` into a bounded chat workspace with header/actions, scrollable message viewport, and bottom composer.
- [ ] 3.2 Keep the follow-up composer visible at the bottom of the conversation workspace without using a global viewport-fixed overlay.
- [ ] 3.3 Ensure the detail skeleton mirrors the new chat viewport and bottom composer layout.
- [ ] 3.4 Keep timeline content width, long text wrapping, and analysis/evidence actions readable on mobile and desktop.

## 4. Reverse Lazy Loading

- [ ] 4.1 Add a top-of-viewport loader using an intersection sentinel or equivalent scroll threshold.
- [ ] 4.2 Fetch older messages with the current oldest-message cursor and a bounded page size only when older messages remain available.
- [ ] 4.3 Prepend older messages, dedupe by message id, and avoid duplicate in-flight requests for the same cursor.
- [ ] 4.4 Preserve apparent scroll position after prepending older messages by measuring and applying the scroll height delta.
- [ ] 4.5 Stop older-message requests when the backend indicates no older messages remain.

## 5. Submission Integration

- [ ] 5.1 Keep synchronous follow-up submission appending returned user and assistant messages to the paged timeline.
- [ ] 5.2 Preserve draft text and loaded message pages on submission failure.
- [ ] 5.3 Scroll to the latest messages after successful user submission unless the user is intentionally viewing older content.
- [ ] 5.4 Ensure pending assistant placeholders do not clear or reload older message pages.

## 6. Verification

- [ ] 6.1 Run `openspec validate add-market-conversation-message-lazy-loading --strict`.
- [ ] 6.2 Run `pnpm lint`.
- [ ] 6.3 Run `pnpm typecheck`.
- [ ] 6.4 Run static searches for legacy detail-timeline initialization from `conversation.messages` and direct `Textarea` composer usage in market conversation detail.
- [ ] 6.5 Perform deterministic code review for API mapping alignment, scroll-position preservation, duplicate request prevention, localized copy, shadcn wrapper usage, and history/message pagination separation.

User-owned manual QA: Compare the final conversation detail route against the chat reference with a long thread, including initial bottom position, scroll-up older loading, composer visibility, and mobile behavior.
