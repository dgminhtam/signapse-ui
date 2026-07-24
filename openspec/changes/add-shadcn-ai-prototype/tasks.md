## 1. Shadcn chat primitives

- [ ] 1.1 Add `message-scroller`, `message`, `bubble`, and `marker` through the shadcn workflow and inspect the generated wrappers and dependency diff.

## 2. Isolated prototype route

- [ ] 2.1 Add the protected locale-prefixed prototype page, dictionary entries, and breadcrumb mapping without adding sidebar navigation or modifying the existing assistant surface.
- [ ] 2.2 Add route-local deterministic fixtures for empty, history, older-message, pending, failed, and market-analysis states without importing market-conversation actions or Assistant UI runtime code.

## 3. Prototype conversation interaction

- [ ] 3.1 Compose fixture messages with shadcn `MessageScroller`, `Message`, `Bubble`, and `Marker`, including stable prepending of older messages and jump-to-latest behavior.
- [ ] 3.2 Add browser-local history selection, analysis expansion, and non-empty draft submission with localized labels, accessible controls, and no persistence side effects.

## 4. Verification

- [ ] 4.1 Run `pnpm.cmd typecheck` and `pnpm.cmd lint` and resolve prototype-related failures.
- [ ] 4.2 Statically verify the prototype does not import `@assistant-ui/react`, `useMarketConversationAssistant`, or market-conversation server actions.

User-owned manual QA: Compare the localized direct route against the existing global assistant at desktop and narrow widths; confirm no network request or persisted conversation is created by prototype interactions.
