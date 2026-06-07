## Context

The market conversation detail page currently hydrates from `GET /market-conversations/{id}`, stores `conversation.messages` in local state, renders every message in one document flow, and places the follow-up composer after the timeline. This is acceptable for short threads but it does not match a chat product: the composer can be pushed below the viewport, long conversations grow expensive to load, and there is no way to incrementally fetch older messages.

The existing backend contract exposes conversation summaries, a full conversation detail payload, synchronous message submission, analysis detail, evidence, and Telegram delivery. It does not currently expose paginated conversation messages. Correct reverse lazy loading therefore requires a backend contract addition before the frontend can do more than a sticky-composer UI refinement.

## Goals / Non-Goals

**Goals:**
- Load the latest messages for a conversation first.
- Keep the follow-up composer fixed at the bottom of the conversation workspace while the message viewport scrolls independently.
- Fetch older messages when the user scrolls near the top of the message viewport.
- Prepend older messages without visually jumping the user's current scroll position.
- Preserve current message submission, pending placeholders, assistant analysis expansion, evidence drawer, Telegram delivery, history sheet, permissions, and locale routing.
- Update frontend schemas and API mapping documentation when the backend contract is available.

**Non-Goals:**
- Token streaming, SSE, or streaming assistant response rendering.
- Message edit, delete, retry-by-message-id, regenerate, reactions, pinning, or thread search.
- Conversation rename/delete/archive.
- Virtualized rendering unless normal DOM rendering proves insufficient after paginated loading.
- Changing conversation history sheet pagination or route-level conversation list behavior.

## Decisions

### Message page endpoint

Use a dedicated message-page endpoint rather than overloading `GET /market-conversations/{id}`.

Recommended contract:

```text
GET /market-conversations/{id}/messages?beforeMessageId={id}&size={n}
```

Response shape should include ordered messages and pagination metadata:

```ts
interface MarketConversationMessagePageResponse {
  content: MarketChatMessageResponse[]
  hasMore: boolean
  nextBeforeMessageId: number | null
}
```

`beforeMessageId` is omitted for the initial latest page. The backend returns messages in chronological order for display, limited to the latest `size` on the initial request and older-than-cursor messages on subsequent requests.

Alternative considered: keep full `messages[]` in `GET /market-conversations/{id}` and slice locally. Rejected because it does not reduce payload size or support true lazy loading.

Alternative considered: use page numbers. Rejected because page indexes drift when new messages are appended; `beforeMessageId` is stable for prepend loading.

### Detail data split

Keep `GET /market-conversations/{id}` for conversation metadata needed by the header, but stop treating its `messages[]` as the authoritative timeline source after this change. The frontend should either ignore `messages[]` for timeline rendering or tolerate it only as a temporary fallback until the paginated message endpoint is confirmed.

Alternative considered: remove `messages[]` from detail response immediately. Rejected as a backend breaking change unless coordinated separately; the frontend can migrate without requiring immediate removal.

### Chat layout

Render the detail page as a bounded flex workspace:

```text
ConversationDetail
├─ Header / actions
├─ MessageViewport  flex-1 overflow-y-auto
│  ├─ top load sentinel / button
│  ├─ messages
│  └─ bottom anchor
└─ Composer          shrink-0 bottom region
```

Use the app's existing layout constraints rather than a global `position: fixed` composer. The composer should stay inside the main content area so it does not overlap the app header, sidebar, or sheet overlays.

### Reverse lazy loading behavior

When the message viewport nears its top and `hasMore` is true, request older messages with `beforeMessageId`/`nextBeforeMessageId`, prepend them, and restore the viewport by the height delta between pre- and post-prepend content. This keeps the message under the user's eyes stable.

Use an `IntersectionObserver` top sentinel when practical; a scroll-threshold fallback is acceptable if the sentinel becomes unreliable due to dynamic message heights.

### Initial scroll position and append behavior

After initial message page load, scroll to the bottom anchor. After successful follow-up submission, append the returned user and assistant messages, clear the composer, and scroll to bottom unless the user has intentionally scrolled away from the latest messages. Pending local placeholders remain acceptable while the synchronous request is in flight.

### State ownership

Keep message loading state local to the detail client component or a small route-local hook. Do not introduce a global conversation store for this feature. The history sheet remains independent and continues to use conversation summary pagination.

## Risks / Trade-offs

- [Backend endpoint is not available yet] -> Keep implementation blocked until `docs/api_mapping.json` includes the message-page contract, or implement only the non-lazy sticky composer as a separate UI-only change.
- [Scroll jumps when prepending dynamic-height messages] -> Measure `scrollHeight` and `scrollTop` before fetch, then adjust by the height delta after React renders the prepended messages.
- [New messages arrive while viewing older messages] -> For synchronous submission, append only local returned messages; do not add polling or streaming in this change.
- [Analysis expansion changes message height] -> Preserve normal browser scroll behavior for user-triggered expansion; only perform height-delta restoration for explicit older-message prepends.
- [Initial detail route needs metadata and latest messages] -> Load metadata and latest message page in parallel where possible, but keep error states distinct so a metadata failure denies the page while a message-page failure can show retry in the viewport.

## Migration Plan

1. Add or confirm backend API mapping for paginated market conversation messages.
2. Add frontend request/response definitions and Zod schemas for message pages.
3. Add authenticated message-page server action or route-local data fetcher.
4. Refactor conversation detail to use message page state instead of full `conversation.messages`.
5. Convert the page layout to a bounded chat workspace with a bottom composer.
6. Add reverse lazy loading, prepend dedupe, and scroll-position restoration.
7. Update skeletons, empty/error states, dictionaries, and API mapping docs.
8. Run OpenSpec validation, lint, typecheck, and deterministic code review.

Rollback is local if the backend endpoint remains additive: restore detail timeline initialization from `conversation.messages` and keep the new endpoint unused. If backend removes `messages[]` from detail response, rollback requires restoring the message-page path or reintroducing a compatible detail payload.

## Open Questions

- Should the backend return `content` in chronological order or newest-first? Chronological order is recommended to simplify display and prepend behavior.
- What should the default page size be? `30` messages is recommended as a balance between chat feel and analysis message height.
- Should `GET /market-conversations/{id}` keep `messages[]` after this migration? Keeping it temporarily reduces deployment coupling, but long-term removal would simplify the contract.
