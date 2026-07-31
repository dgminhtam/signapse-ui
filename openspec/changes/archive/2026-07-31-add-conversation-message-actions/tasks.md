## 1. Localized Message Footer

- [x] 1.1 Add matching Vietnamese and English `demoConversation` keys for Copy, copy success/error, Send to Telegram, placeholder feedback, and accessible timestamp labeling.
- [x] 1.2 Render persisted-message `MessageFooter` content with existing icon Button, Tooltip, semantic `time`, locale-bound formatting, and `AppTimeMetadata` primitives without modifying shared primitive APIs.

## 2. Role-Aware Actions And Visibility

- [x] 2.1 Wire Copy to the exact untrimmed message source string through `navigator.clipboard.writeText`, with localized Sonner success and error feedback.
- [x] 2.2 Expose the Telegram placeholder only for stable completed assistant content, make it report localized unavailable feedback without external effects, and omit content actions for pending, revealing, empty, or failed assistant states.
- [x] 2.3 Apply CSS-only hover, focus-within, no-hover, pointer, and reduced-motion behavior so available footers remain keyboard/touch operable and appear without transcript reflow.

## 3. Deterministic Verification

- [x] 3.1 Extend the existing conversation check to cover source-string clipboard usage, assistant-only Telegram gating, localized footer wiring, and stable-content conditions.
- [x] 3.2 Run the conversation check, `pnpm lint`, and `pnpm typecheck`; resolve any failures caused by this change.
