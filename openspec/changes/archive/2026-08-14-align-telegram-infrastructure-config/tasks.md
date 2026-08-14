## 1. Align Telegram Contracts

- [x] 1.1 Remove the unsupported Bot Telegram update, Điểm nhận update, and destination test-message server actions and all active imports/callers.
- [x] 1.2 Narrow Bot Telegram creation validation and request typing to `botToken` only while preserving backend-owned response label fields.
- [x] 1.3 Delete obsolete update schemas/request types and the standalone destination test-message component.

## 2. Build Bot Telegram Configuration Boundary

- [x] 2.1 Extract the Bot Telegram Card, Item list, lifecycle actions, and focused create Dialog into a feature-local module.
- [x] 2.2 Implement backend-owned identity fallbacks, `INVALID` validation context, lifecycle ordering, `REMOVED` filtering, and read-only permission treatment.
- [x] 2.3 Implement the token-only Dialog with labelled field validation, focus management, pending feedback, retry-safe in-memory token handling, and close/success cleanup.
- [x] 2.4 Replace pause language with confirmed `Vô hiệu hóa` behavior and add concise manual replacement guidance without introducing a reactivation or migration workflow.

## 3. Build Điểm Nhận Configuration Boundary

- [x] 3.1 Extract the Điểm nhận Card, Item list, lifecycle actions, and focused linking Dialog into a feature-local module.
- [x] 3.2 Implement destination identity fallbacks, linked-bot metadata, lifecycle ordering, `REMOVED` filtering, and read-only permission treatment.
- [x] 3.3 Implement active-bot selection rules, link-token generation, progressive command result, private/group handoff, copy fallback, expiry handling, and token regeneration.
- [x] 3.4 Remove outbound-link refresh behavior and implement explicit `Đã liên kết, làm mới` close-and-refresh feedback without optimistic success claims.
- [x] 3.5 Keep channel records displayable while omitting channel-creation, destination edit, and test-message controls.

## 4. Integrate Responsive Infrastructure UI

- [x] 4.1 Compose the two configuration Cards as a responsive shared-infrastructure grid while preserving the cardless workspace, readiness summary, feature routing, and schedule behavior.
- [x] 4.2 Replace table-specific empty and loading states with Card/Item states that reflow without page overflow and do not duplicate primary actions.
- [x] 4.3 Keep disable/delete AlertDialogs open through pending and error states, restore originating focus, and use backend responses as the final dependency authority.
- [x] 4.4 Remove obsolete table, Sheet, edit, test-message, and implementation-badge imports and code from the Telegram workspace module.

## 5. Localize And Synchronize Documentation

- [x] 5.1 Update English and Vietnamese dictionaries for canonical Bot Telegram/Điểm nhận terminology, read-only states, terminal disable language, Dialog flows, expiry/retry states, and truthful success feedback.
- [x] 5.2 Remove localized edit/test-message/pause copy that has no remaining active caller and keep dictionary parity.
- [x] 5.3 Update `docs/APIMAPPING.md` to mark the three removed endpoints and token-only create contract as synchronized after implementation.

## 6. Verify The Change

- [x] 6.1 Run formatter on the changed TypeScript/TSX files and review the diff for narrow, UTF-8-safe edits.
- [x] 6.2 Run lint and resolve all findings introduced by the change.
- [x] 6.3 Run typecheck and resolve all contract, prop, and dictionary typing errors introduced by the change.
- [x] 6.4 Validate the OpenSpec change and run `git diff --check`.
- [x] 6.5 Run scoped static searches confirming active code and specs contain no removed endpoint paths, action symbols, update schemas/types, test-message component references, or obsolete localized keys.

User-owned manual QA: verify the authenticated Telegram route at representative mobile, tablet, and desktop widths and at 200 percent zoom; this is not an archive-blocking checkbox.
