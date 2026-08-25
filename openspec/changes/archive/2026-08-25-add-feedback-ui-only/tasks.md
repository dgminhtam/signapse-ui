## 1. Feedback Fixture Domain And State

- [x] 1.1 Add contract-aligned feedback view types, status/type display mappings, permission constants, optional screenshot/context/sender shapes, and explicit per-record action capabilities without adding transport functions.
- [x] 1.2 Add deterministic Vietnamese and English synthetic records covering both feedback types, all statuses, missing optional fields, long content, previewable and unsupported screenshots, review outcomes, GitHub references, sender variants, and action-capability combinations.
- [x] 1.3 Implement one feature-scoped in-memory fixture state owner with selectors for personal and moderation records plus compose, withdraw, promote, dismiss, and erase commands that update all consumers and reset on full reload.
- [x] 1.4 Add deterministic fixture mutation modes for success, pending, validation failure, and recoverable mutation failure while keeping failed state unchanged.
- [x] 1.5 Mount the feedback fixture state owner only in supported P0 fixture submode and keep it above the personal and moderation routes so client navigation preserves state.

## 2. Localization, Route Gates, And Navigation

- [x] 2.1 Add matching Vietnamese and English dictionary keys for feedback navigation, types, statuses, compose fields, technical context, screenshots, personal states, moderation controls, review outcomes, confirmations, pending/success/error feedback, and accessibility labels.
- [x] 2.2 Add Server Component fixture-mode gates for personal list/detail and moderation list/detail routes so non-fixture direct access resolves as not found and no synthetic data renders.
- [x] 2.3 Add the `Gửi phản hồi` controlled Dialog trigger and `Phản hồi của tôi` localized route entry to the authenticated user menu only in fixture submode, preserving existing Clerk-safe fixture behavior and focus restoration.
- [x] 2.4 Add `Phản hồi người dùng` after user management and before developer tooling in the settings navigation, gated by fixture submode and `feedback:read` through the existing permission-filtering model.
- [x] 2.5 Add localized breadcrumbs, one-H1 page identities, canonical route links, and route-local error boundaries for both personal and moderation feature trees.

## 3. Compose Dialog

- [x] 3.1 Build the controlled compose Dialog with `Lỗi` / `Ý tưởng` selection, visible labels, contract-derived title/description/expected-outcome validation, and bug-only optional reproduction steps.
- [x] 3.2 Add the enabled-by-default technical-context control and disclosure, capture the page context at Dialog open, and omit technical context when the sender opts out.
- [x] 3.3 Add a singular manual screenshot picker with constrained preview, meaningful alternative text, metadata fallback for unsupported previews, remove/reset behavior, and object-URL cleanup.
- [x] 3.4 Add pending, deterministic failure, and success behavior that prevents duplicate submission, preserves valid draft state after failure, closes only after success, keeps the current route, and offers `Xem phản hồi` from the success toast.
- [x] 3.5 Add dirty-dismiss protection using application Dialog/AlertDialog composition, keep browser-native confirmation APIs out of the flow, and restore focus to the originating trigger after final close.
- [x] 3.6 Ensure invalid submission focuses the first invalid field, announces field errors, preserves layout footprint, and remains usable with keyboard, screen reader, reduced motion, narrow viewport, and 200% zoom.

## 4. Personal Feedback Surfaces

- [x] 4.1 Build the bounded `/feedback` history surface with newest-first fixture records, type/title/status/date/screenshot presentation, semantic title links, 10-item shared pagination, and no personal search, filters, aggregate cards, or navigation badges.
- [x] 4.2 Add personal loading skeleton, first-use Empty action, no-results-safe pagination behavior, localized error recovery, and stable content width across all states.
- [x] 4.3 Build canonical personal detail with submission content, localized status, timestamps, optional screenshot/context, user-visible `Kết quả xem xét`, optional read-only GitHub issue reference, and safe handling of absent optional fields.
- [x] 4.4 Add capability-gated `Rút phản hồi` with localized destructive confirmation, pending stability, successful in-memory removal/recovery behavior, and recoverable failure without deriving availability from status.
- [x] 4.5 Reflow personal list and detail for mobile without page-level horizontal overflow and verify light/dark semantic contrast, non-color status cues, heading order, focus visibility, and localized formatting.

## 5. Moderation Queue And Detail

- [x] 5.1 Build the fluid moderation queue with an effective default `PENDING_REVIEW` status, URL-backed title search, type/status Select filters, sort, page, and size state, reset-to-page-1 behavior, and fixture-side selection isolated from future backend serialization.
- [x] 5.2 Compose the queue with shared list/table and pagination surfaces, semantic detail links, contract-aligned columns only, no sender column, no whole-row click target, no facet counts, and no metric cards.
- [x] 5.3 Add moderation loading, empty, no-results, error, and permission-denied states that preserve toolbar/table/pagination geometry and keep active controls available for recovery.
- [x] 5.4 Build canonical moderation detail with main evidence content and secondary sender/context/status/action rail on wide screens plus a single logical column on narrow screens and at 200% zoom.
- [x] 5.5 Add `feedback:review` plus explicit-capability gating for `Chuyển xử lý` and `Không tiếp nhận`, with required user-visible review-message Dialogs, first-invalid-field focus, pending stability, recoverable failure, and success that updates detail without redirecting.
- [x] 5.6 Add `feedback:delete` plus explicit-capability gating for `Xóa phản hồi`, separated destructive presentation, localized AlertDialog consequences, duplicate-submit prevention, and recoverable failure.
- [x] 5.7 Preserve moderation queue URL state and browser Back/Forward behavior when navigating to detail and back after search, filter, sort, page, or size changes.
- [x] 5.8 Verify moderation copy, actions, tables, Dialogs, and states in Vietnamese and English with keyboard-only operation, screen-reader semantics, focus restoration, reduced motion, mobile touch targets, light/dark themes, and no unintended overflow.

## 6. P0 Browser Verification

- [x] 6.1 Extend the deterministic P0 fixture scenario surface with isolated feedback permissions, records, mutation outcomes, and reset behavior without introducing live feedback, Clerk, GitHub, or external media requests.
- [x] 6.2 Add one feedback Playwright suite covering user-menu compose, validation, conditional reproduction steps, technical-context opt-out, screenshot preview/fallback, dirty dismissal, success/failure recovery, personal history/detail, and withdrawal through observable UI behavior.
- [x] 6.3 Extend the feedback Playwright suite to cover authorized/unauthorized moderation navigation, default pending queue, URL-backed search/filter/sort/pagination, canonical detail, read/review/delete permission combinations, explicit capabilities, review outcomes, deletion recovery, and preserved Back context.
- [x] 6.4 Add axe coverage for agreed compose, personal, queue, detail, review, deletion, empty, and error states plus explicit keyboard/focus assertions for covered Dialog and AlertDialog flows.
- [x] 6.5 Assert feedback P0 produces no external network violations and retains the existing trace, screenshot, video, and fixture/application diagnostics on failure without inspecting React or fixture-store internals.

## 7. Deterministic Validation

- [x] 7.1 Run formatting on the feedback-owned TypeScript and TSX files, then run `pnpm lint` and resolve feedback-owned findings without changing default shadcn wrapper chrome.
- [x] 7.2 Run `pnpm typecheck` and `pnpm test`, preserving the existing narrow `zodResolver` boundary workaround policy and introducing no unchecked `any`.
- [x] 7.3 Run `pnpm test:contract` and confirm the UI-only change does not claim or add live feedback endpoint coverage.
- [x] 7.4 Run `pnpm build` and verify feedback fixture-only routes compile without exposing synthetic navigation or route content outside fixture submode.
- [ ] 7.5 Run the focused feedback Playwright suite and then `pnpm test:browser`, resolving deterministic accessibility, navigation, state, and network-isolation failures.
- [x] 7.6 Run strict OpenSpec validation for `add-feedback-ui-only` and verify static searches show no feedback Server Action, live endpoint call, multipart transport, binary proxy, `githubIssueUrl` input, automatic screenshot capture, persisted fixture storage, or unread badge in the implemented scope.

Verification note: the focused feedback suite passes 6/6. The full `pnpm test:browser` run completed with 18 passing and 10 failures in existing dashboard, landing, market-chart, quick-detail, shell, and visual suites (45-second compile/timeouts and baseline snapshot drift); all feedback tests passed.

User-owned manual QA is not an archive-blocking checkbox. Product review may inspect the fixture UI at desktop/mobile widths and in both themes after deterministic checks pass.
