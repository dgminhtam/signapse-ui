## 1. Backend Contract And Shared Conversation Mapping

- [x] 1.1 Confirm `docs/api_mapping.json` contains `GET /market-conversations/{conversationId}/messages` with optional exclusive `beforeMessageId`, bounded `size`, `hasMore`, `nextBeforeMessageId`, and permission `query:execute`.
- [x] 1.2 Add or reuse Zod-backed request and response types plus an authenticated action for loading latest and older market conversation message pages with `size=30`; accept a null or absent next cursor only when `hasMore` is false.
- [x] 1.3 Extract focused pure helpers for bounded first-message title derivation, ascending-id page normalization, message reconciliation/deduplication, and backend-to-Assistant-UI message conversion.
- [x] 1.4 Reuse existing authenticated conversation list, create, detail metadata, and message submission actions without duplicating API clients or bypassing `fetchAuthenticated()`.
- [x] 1.5 Confirm `docs/APIMAPPING.md` records the new cursor endpoint, response shape, permission, and current frontend integration gap.

## 2. Workspace-Scoped Conversation Coordinator

- [x] 2.1 Implement a client coordinator hook for active workspace id, new-thread draft, selected conversation, recent summaries, loaded messages, cursors, pending state, and recoverable failures.
- [x] 2.2 Load a bounded recent conversation page for the active workspace and support incremental history loading with localized loading, empty, retry, and exhausted states.
- [x] 2.3 Implement explicit persisted-thread selection and latest-message loading with stale workspace and stale conversation result guards.
- [x] 2.4 Implement older-message loading with exclusive cursor pagination, ascending-id normalization, chronological prepend, identifier reconciliation, and preservation of the existing loaded timeline on failure.
- [x] 2.5 Implement new-conversation reset behavior that returns to a fresh draft without mutating the previously selected persisted conversation.
- [x] 2.6 Clear coordinator state when workspace id changes and prevent in-flight results from a previous workspace from committing afterward.

## 3. Assistant UI Runtime And Submission

- [x] 3.1 Replace the placeholder runtime with `useExternalStoreRuntime` backed by coordinator messages, loading state, and submission callbacks.
- [x] 3.2 Implement first-message flow as bounded-title derivation, conversation creation, and message submission to the returned identifier.
- [x] 3.3 Handle the partial-success case where conversation creation succeeds but first-message submission fails by selecting the created thread and allowing retry without duplicate creation.
- [x] 3.4 Implement synchronous follow-up submission with duplicate-submit prevention, stable pending state, backend reconciliation, and recoverable input on failure.
- [x] 3.5 Ignore blank submissions and keep attachment, edit, regenerate, branch, rename, delete, archive, streaming, and Assistant Cloud behavior disabled or absent.

## 4. Compact Assistant Conversation Surface

- [x] 4.1 Replace placeholder content with a compact Assistant UI thread that renders supported user and assistant message content without embedding the canonical market conversation page.
- [x] 4.2 Add accessible new-conversation and recent-history controls using existing shadcn wrappers and the current Assistant Modal composition.
- [x] 4.3 Add latest-message, older-message, submission, empty, and recoverable failure states while keeping the composer usable inside mobile and desktop modal bounds.
- [x] 4.4 Remove the full-conversation action so the assistant modal is the only market conversation UI surface.
- [x] 4.5 Keep full structured analysis, evidence, Telegram delivery, list-page controls, and canonical route chrome out of the compact modal.

## 5. Protected Shell, Localization, And Accessibility

- [x] 5.1 Pass `currentWorkspace.id` from the protected layout through `ProtectedAiAssistant` without weakening the existing `query:execute` permission gate or server/client boundary.
- [x] 5.2 Add synchronized English and Vietnamese dictionary keys for history, new-thread, loading, pagination, pending, empty, retry, and failure states.
- [x] 5.3 Verify all assistant market conversation copy, tooltips, accessible names, and error messages use the active locale dictionary.
- [x] 5.4 Verify keyboard focus order and focus restoration across trigger, history, thread selection, new conversation, composer, pagination retry, fullscreen toggle, and close behavior.
- [x] 5.5 Remove canonical `/market-conversations`, `/market-conversations/{id}`, and `/market-query` UI routes and legacy redirects now that the modal is the primary surface.

## 6. Verification

- [x] 6.1 Run `openspec validate migrate-market-conversations-to-ai-assistant --strict`.
- [x] 6.2 Run scoped lint for changed assistant, protected layout, market conversation action/helper, and localization files.
- [x] 6.3 Run `pnpm typecheck` and report any pre-existing blockers separately from errors introduced by this change.
- [x] 6.4 Run targeted deterministic tests or helper-level checks for title derivation, message conversion, chronological deduplication, workspace reset, and stale-result rejection.
- [x] 6.5 Run static searches confirming no hard-coded assistant copy, unauthenticated market conversation request, unsupported Assistant UI action, Assistant Cloud configuration, or embedded canonical detail component was introduced.
- [x] 6.6 Perform deterministic review against the capability scenarios, Assistant UI external-store contract, `radix-nova` wrapper policy, locale routing, permission gating, and responsive modal constraints.

User-owned manual QA: With authenticated backend data, open the assistant in English and Vietnamese, create a conversation, retry a failed first message, switch recent threads, load older messages, change workspaces during a request, open the canonical detail route, and verify users without `query:execute` do not see or initialize the assistant.

Implementation readiness (2026-06-11): the cursor endpoint and response schema are present in `docs/api_mapping.json`, and `docs/APIMAPPING.md` records the frontend gap. The frontend may proceed with `size=30`, normalize each page by ascending message id, reconcile duplicate identifiers with the latest payload, and treat `hasMore=false` as exhausted even when `nextBeforeMessageId` is null or absent.
