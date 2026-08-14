## 1. Telegram Contract And Copy

- [x] 1.1 Add a destination test-message server action that validates the numeric destination identifier, calls the authenticated `POST /telegram/destinations/{destinationId}/test-message` endpoint without a body, returns the void action-result shape, and performs no route revalidation.
- [x] 1.2 Add matching Vietnamese and English dictionary entries for the send label, pending state, success message, fallback error, ambiguous timeout, missing permission, inactive destination, and destination overflow actions.

## 2. Destination Row Interaction

- [x] 2.1 Add a focused destination test-message action component with per-row transition state, localized toast feedback, no automatic retry, and no client refresh after success.
- [x] 2.2 Keep the test action visible for read-only and inactive states using focusable `aria-disabled`, guarded activation, `aria-describedby`, and a permission-or-status explanation available on hover and focus; use native disabled only while pending.
- [x] 2.3 Integrate the send icon and `Gửi thử` label into every destination row, preserving the full label at supported breakpoints and allowing only `ACTIVE` destinations with manage permission to invoke the action.
- [x] 2.4 Recompose destination actions as `Gửi thử`, `Sửa`, and an overflow menu containing `Tạm dừng`, a separator, and `Xóa`, while preserving confirmation behavior, localized feedback, and focus restoration for pause and delete.
- [x] 2.5 Update the destination action-column sizing and Telegram loading skeleton so the final table hierarchy remains stable and horizontal overflow stays within the table surface.

## 3. Documentation And Verification

- [x] 3.1 Update `docs/APIMAPPING.md` after integration to record the frontend action and remove the test-message item from known Telegram drift without changing unrelated API notes.
- [x] 3.2 Run `pnpm lint` and resolve findings introduced by this change.
- [x] 3.3 Run `pnpm typecheck` and resolve type errors introduced by this change.
- [x] 3.4 Run `openspec validate add-telegram-destination-test-message --type change --strict --no-interactive` and resolve all proposal, design, delta-spec, and task validation errors.
- [x] 3.5 Perform a targeted static review confirming the test-message request has no body or refresh, all user-facing states are localized, unavailable reasons are programmatically associated, pending state is row-scoped, and obsolete UI-only Telegram requirements are covered by the delta spec.

User-owned manual QA (non-blocking): with authenticated manage and read-only users plus real active and inactive Telegram destinations, verify actual message arrival, ambiguous failure recovery, keyboard and screen-reader behavior, light/dark mode, narrow viewport behavior, and zoom at 200%.
