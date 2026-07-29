## 1. Add persisted submission state

- [x] 1.1 Add localized English and Vietnamese labels for the editable persisted composer, pending state, and submission failure.
- [x] 1.2 Add route-local draft, pending, error, and stale-response protection for the selected persisted conversation while preserving the scripted state path.

## 2. Integrate the submit-message API

- [x] 2.1 Replace the selected persisted conversation's read-only composer with a controlled `InputGroupTextarea` that trims empty input and prevents duplicate submission.
- [x] 2.2 Call `submitMarketConversationMessage` for the selected conversation, merge the returned user and assistant messages through the existing history-state helper, clear the draft only on success, and retain it on failure.
- [x] 2.3 Preserve transcript pagination, auto-scroll, role spacing, tracking rails, History refresh behavior, and New chat restoration after submission.

## 3. Verify behavior

- [x] 3.1 Extend the deterministic demo conversation assertion to cover appending and deduplicating the returned user/assistant message pair.
- [x] 3.2 Run the deterministic assertion, targeted lint for touched source files, `pnpm.cmd typecheck`, diff integrity checks, and strict OpenSpec validation for this change.
