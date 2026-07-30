## 1. Localization

- [x] 1.1 Add English and Vietnamese `expandConversation` and `collapseConversation` labels to the existing conversation dictionaries.

## 2. Conversation Popover

- [x] 2.1 Add local compact/expanded state and a toggle handler that closes the nested History Popover without clearing its loaded state.
- [x] 2.2 Apply conditional compact and viewport-clamped expanded width/height classes to the existing Popover without transitions or conversation-tree remounting.
- [x] 2.3 Add the localized Expand/Restore icon button between New chat and Close with dynamic `aria-label`, `aria-pressed`, keyboard activation, and existing focus styling.

## 3. Verification

- [x] 3.1 Confirm the change adds no resizable/fullscreen/dialog/sheet integration and does not modify package files, shared Popover, MessageScroller, APIs, DTOs, or permissions.
- [x] 3.2 Run `node --experimental-strip-types components/market-conversation-assistant/history-state.assert.mjs`.
- [x] 3.3 Run targeted ESLint for the three implementation files and run `pnpm typecheck`.
- [x] 3.4 Run strict OpenSpec validation for `add-expandable-conversation-popover`.

User-owned manual QA (not archive-blocking): verify at 320, 375, 768, 1024, and 1440 px; 200% zoom; light and dark themes; History open; long Markdown tables/code; active reveal; deliberate scroll-away; and focus retention after toggling.
