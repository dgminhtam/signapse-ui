## 1. Contract And Integration Ledger

- [x] 1.1 Restore the destination test-message server action with positive-integer validation, authenticated no-body POST, void result, localized fallback, and no route revalidation.
- [x] 1.2 Update `docs/APIMAPPING.md` from the rebuilt live OpenAPI to restore only the test-message operation while keeping bot and destination rename/update operations removed.

## 2. Destination Item Interaction

- [x] 2.1 Restore matching Vietnamese and English copy for the send, pending, success, fallback error, ambiguous timeout, permission-required, and inactive states, plus the Test message domain glossary entry.
- [x] 2.2 Restore a focused destination test-message client component with row-scoped pending state, guarded focusable `aria-disabled` availability, programmatic description, Tooltip explanation, and no retry or refresh.
- [x] 2.3 Integrate the labeled test action before the existing lifecycle overflow in each destination Item without restoring edit-label controls, Tables, or Sheets.
- [x] 2.4 Update responsive Item actions and the Telegram infrastructure skeleton so the labeled test action and overflow remain usable without page overflow.

## 3. Verification

- [x] 3.1 Run scoped ESLint for the changed TypeScript and TSX files and resolve introduced findings.
- [x] 3.2 Run `pnpm typecheck` and resolve introduced type errors.
- [x] 3.3 Run strict OpenSpec validation for `restore-telegram-destination-test-message` and resolve artifact errors.
- [x] 3.4 Run static contract and scope checks confirming the request has no body or revalidation, test feedback is localized, and bot/destination update symbols or controls were not restored.

User-owned manual QA (non-blocking): with authenticated manage and read-only users plus real active and inactive Telegram destinations, verify actual message arrival, ambiguous timeout recovery, keyboard and screen-reader behavior, light/dark mode, narrow viewport behavior, and zoom at 200%.
