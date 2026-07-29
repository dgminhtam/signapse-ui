## Context

The standalone demo currently owns a scripted `useChat` transcript and separately loads persisted conversation summaries into a History Popover. The summaries are deliberately informational. The existing market-conversation boundary already exposes `getMarketConversationMessages(conversationId, beforeMessageId?)`, validates its response, and returns up to 30 text messages plus an exclusive cursor.

The global assistant already demonstrates the required ordering, cursor pagination, and stale-response protection, but its controller also owns history loading, conversation creation, and message submission. Reusing that whole controller would duplicate the demo's existing history flow and broaden this change beyond read-only detail.

## Goals / Non-Goals

**Goals:**

- Let authorized users select a persisted History row with pointer or keyboard.
- Replace the demo content with the selected persisted transcript and title.
- Support localized initial loading, empty, failure, retry, and older-message loading states.
- Load older messages through the existing exclusive cursor while preserving chronological order.
- Prevent stale requests from replacing a newer selection or a reset scripted transcript.
- Keep the selected persisted conversation read-only.

**Non-Goals:**

- Creating a persisted conversation or submitting a new message.
- Replacing the scripted demo transport or the existing History search/pagination.
- Adding a conversation route or URL-backed selection.
- Rendering persisted analysis, evidence, attachments, or non-text message subtypes.
- Changing backend APIs, DTO contracts, permissions, or API mapping documentation.

## Decisions

### Use the paginated messages action

Selection will call `getMarketConversationMessages` instead of `getMarketConversationById`. The selected History summary already contains the title, and the messages action provides bounded loading and the cursor required for long transcripts.

Alternative considered: load the detail endpoint once. This repeats summary data and provides no explicit incremental-loading contract.

### Keep detail state local to the demo

`DemoConversation` will own the selected summary, message cursor, request states, and a dedicated request-generation ref. It will reuse the established ordering helpers from the market-query definitions and the existing `useChat().setMessages` entry point to feed mapped text messages into the current renderer.

Alternative considered: adopt `useMarketConversationAssistant`. That hook also owns duplicated history, create, and submit behavior, which conflicts with the narrower standalone demo scope.

### Map only the contract needed by the existing renderer

Persisted messages will be converted deterministically to AI SDK `UIMessage` values: numeric IDs become strings, `USER`/`ASSISTANT` become `user`/`assistant`, and non-null content becomes a text part. Messages remain text-only; no subtype or analysis inference will be introduced.

The pure mapping and chronological merge behavior will live with the demo's existing state helpers so the current assertion script can cover it without a new abstraction or test framework.

### Treat persisted selection as an explicit read-only mode

The selected conversation title will replace the scripted title, and the composer will not send either scripted or persisted messages while a persisted conversation is selected. Activating New chat will invalidate in-flight detail requests, clear selection state, and restore the initial scripted transcript and composer behavior.

No create or submit server action will be imported into the demo.

### Load older messages explicitly

The first request will show the latest page. When `hasMore` and `nextBeforeMessageId` are present, a localized Load older messages control will request the next page and prepend unique messages in chronological order. Concurrent older-page requests will be blocked.

### Preserve accessible interaction and request feedback

History summaries will use `CommandItem` selection semantics rather than click handlers on non-interactive elements. The Popover will close after selection. The content area will expose loading with `role="status"`/`aria-busy`, failures with `role="alert"` and Retry, and keyboard focus will remain on the restored History trigger after the Popover closes.

## Risks / Trade-offs

- [A user switches conversations before an older request completes] → Compare a dedicated request generation before applying every initial, retry, or pagination response.
- [Loading a persisted transcript briefly shows stale scripted content] → Clear rendered messages and show an explicit loading state as soon as selection starts.
- [Prepending older messages causes duplicate rows] → Normalize and deduplicate by backend message ID before mapping/rendering.
- [The scripted transport derives an unrelated next message from persisted content] → Gate the composer and scripted send path on the absence of a persisted selection.
- [A long transcript shifts the viewport when older messages are prepended] → Keep older loading user-initiated and preserve the current visible anchor where supported by the existing message scroller.
