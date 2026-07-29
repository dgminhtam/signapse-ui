## 1. Remove the Legacy Application Graph

- [x] 1.1 Confirm `ProtectedAiAssistant` still dynamically loads `MarketConversationAssistant`, then delete all files under `components/assistant-ui/**` and `scripts/check-assistant-market-conversation-runtime.ts` without changing the active entry point.
- [x] 1.2 Remove the obsolete `components/assistant-ui/**` scoped instruction from `components/AGENTS.override.md`.

## 2. Remove Runtime Dependency and Dead Copy

- [x] 2.1 Remove `@assistant-ui/react` with pnpm so `package.json` and `pnpm-lock.yaml` prune the unused Assistant UI dependency graph without manual lockfile editing.
- [x] 2.2 Remove English and Vietnamese `aiAssistant` keys used only by the deleted modal while retaining the active `open`, `loading`, and `error` labels.

## 3. Align Current Ownership and Repository Tooling

- [x] 3.1 Replace `components/assistant-ui/*` ownership references in `docs/APIMAPPING.md` with `components/market-conversation-assistant/*` without changing `docs/api_mapping.json` or backend contract notes.
- [x] 3.2 Review the change delta specs against their current main-spec requirement blocks and confirm historical OpenSpec archives remain unchanged.
- [x] 3.3 Delete the 13 tracked skill directories whose `skills-lock.json` source is exactly `assistant-ui/skills`.
- [x] 3.4 Remove the corresponding 13 Assistant UI skill entries from `skills-lock.json` while preserving the shadcn, UI/UX, and repo-local skills.

## 4. Verify the Active Conversation Boundary

- [x] 4.1 Run static searches confirming current application source, scripts, manifest, lockfile, guidance, and API ownership docs contain no legacy Assistant UI runtime imports, symbols, paths, or direct dependency, with archives and agent tooling explicitly excluded.
- [x] 4.2 Run the deterministic `components/market-conversation-assistant/history-state.assert.mjs` check and targeted ESLint for the active conversation, protected boundary, dictionaries, and affected documentation-supporting source.
- [ ] 4.3 Run the repository typecheck and production build to verify dependency pruning leaves the active protected conversation graph compilable.
- [x] 4.4 Run `openspec validate remove-legacy-assistant-ui-conversation --strict` and confirm all artifacts remain apply-ready.
- [x] 4.5 Confirm no Assistant UI-owned skill directory or lock entry remains and all unrelated skill directories still exist.

User-owned manual QA: verify the authorized floating trigger, History, create/submit flow, close/reopen session preservation, workspace switch reset, focus return, and localized loading/error fallbacks in an authenticated browser.
