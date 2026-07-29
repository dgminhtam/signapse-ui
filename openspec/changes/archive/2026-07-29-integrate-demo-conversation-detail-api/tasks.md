## 1. Persisted Message State

- [x] 1.1 Extend the existing demo state helpers with deterministic backend-message to `UIMessage` mapping and chronological deduplication for initial and older pages.
- [x] 1.2 Extend the existing assertion script to cover role/content mapping, null content, ordering, prepend behavior, and duplicate message IDs.

## 2. Conversation Selection And Loading

- [x] 2.1 Add selected-conversation, initial request, error, cursor, and older-page state to the standalone demo without importing create or submit actions.
- [x] 2.2 Convert persisted History summaries into keyboard-selectable `CommandItem` controls that close the Popover, update the title, and request the selected conversation's latest messages.
- [x] 2.3 Guard initial, retry, and pagination responses so an older request cannot replace a newer selection or a reset scripted conversation.

## 3. Read-only Transcript Experience

- [x] 3.1 Render localized initial loading, persisted empty, failure, and retry states in the content area and feed successful mapped messages into the existing message renderer.
- [x] 3.2 Add localized cursor-based older-message loading that prevents concurrent requests, prepends unique messages chronologically, and preserves the current reading position where supported.
- [x] 3.3 Gate the composer and scripted send path while a persisted transcript is selected, and make New chat invalidate detail requests and restore the initial scripted title, transcript, and composer.

## 4. Localization And Accessibility

- [x] 4.1 Add matching English and Vietnamese labels for persisted transcript loading, empty, failure, retry, read-only, and older-message states.
- [x] 4.2 Verify selection is operable with Enter and Space, focus returns safely after the Popover closes, dynamic loading/error feedback is announced, and actionable controls retain accessible names.

## 5. Verification

- [x] 5.1 Run the demo conversation state assertion script.
- [x] 5.2 Run targeted lint for the demo conversation and dictionary files.
- [x] 5.3 Run the repository TypeScript typecheck.
- [x] 5.4 Run static searches confirming the demo does not import or call conversation creation or message submission.
- [x] 5.5 Run strict OpenSpec validation for `integrate-demo-conversation-detail-api`.

## 6. Same-role Message Spacing Regression

- [x] 6.1 Compact consecutive messages with the same role to 8 px while preserving the existing 24 px gap between role transitions.
- [x] 6.2 Run targeted lint, typecheck, and strict OpenSpec validation for the spacing fix.

User-owned manual QA: test selection, retry, older-message loading, New chat reset, and keyboard operation against an authenticated backend workspace with persisted conversations.
