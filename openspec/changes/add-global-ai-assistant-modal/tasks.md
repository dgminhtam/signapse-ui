## 1. Assistant UI Dependency And Source Review

- [x] 1.1 Preview the official Assistant UI `assistant-modal` registry item and dependency changes through the shadcn CLI before modifying the project.
- [x] 1.2 Add the minimum Assistant UI React dependency required by the modal and placeholder thread without configuring Assistant Cloud or adding it as a direct dependency.
- [x] 1.3 Add reviewed source under `components/assistant-ui/` for the modal, reduced thread, and accessible trigger helpers using existing `@/components/ui/` wrappers.
- [x] 1.4 Remove registry-provided attachment, edit, regenerate, branch, export, tool-call, reasoning-trace, and other controls that are outside the current Signapse contract.

## 2. Protected Shell Integration

- [x] 2.1 Add a small Client Component that owns the assistant runtime and modal without moving authentication, permission, workspace, or dictionary loading out of the protected server layout.
- [x] 2.2 Mount the client assistant surface inside `app/[lang]/(main)/layout.tsx` and render it only when `query:execute` is present.
- [x] 2.3 Keep modal open and close state local so opening, dismissing, and pressing Escape do not change the current URL or browser history.
- [x] 2.4 Ensure unauthorized users do not render the assistant trigger or initialize Assistant UI runtime code.

## 3. Localized Placeholder Conversation

- [x] 3.1 Add synchronized English and Vietnamese dictionary keys for the trigger, accessible title, welcome state, unavailable composer state, loading/error copy, and full-conversation action.
- [x] 3.2 Build the placeholder thread with an honest disabled or unavailable submission state that does not create fake assistant replies or imply backend persistence.
- [x] 3.3 Add a locale-aware action from the modal to `/market-conversations` while preserving the canonical list/detail routes.
- [x] 3.4 Use existing shadcn wrappers, Lucide icons, semantic tokens, repo-standard spinner/error composition, and `data-icon` treatment throughout the assistant source.

## 4. Runtime Boundary And Responsive Behavior

- [x] 4.1 Isolate Assistant UI runtime creation in the protected assistant client component so a future persisted-conversation adapter can replace the placeholder runtime without changing the app shell.
- [x] 4.2 Document or type the mapping boundary for backend `USER`/`ASSISTANT`, `PENDING`/`COMPLETED`/`FAILED`, message content, failure reason, and conversation id without introducing a second persisted browser history.
- [x] 4.3 Size and position the lower-right trigger and modal so the conversation surface stays inside mobile and desktop viewports and does not overlap its own composer or close control.
- [x] 4.4 Verify focus entry, focus order, Escape dismissal, accessible names, and focus restoration against the repository accessibility guidance.

## 5. Verification

- [x] 5.1 Run `openspec validate add-global-ai-assistant-modal --strict`.
- [x] 5.2 Run `pnpm typecheck`.
- [x] 5.3 Run scoped lint for the protected layout, assistant components, providers, and localization files changed by this work.
- [x] 5.4 Run static searches confirming there is no hard-coded user-facing assistant copy, Assistant Cloud integration, unsupported assistant action, or unauthenticated backend call.
- [x] 5.5 Perform deterministic review against the Assistant UI registry diff, `radix-nova` chrome policy, permission gating, locale routing, responsive constraints, and accessible overlay behavior.

User-owned manual QA: Open representative protected workspaces on desktop and mobile, confirm the trigger does not cover important controls, verify the localized placeholder in English and Vietnamese, and confirm users without `query:execute` cannot see the assistant.

Future backend-integration note: replace the placeholder runtime with an external-store or equivalent custom runtime backed by the existing market conversation actions; create the conversation from the first message, preserve recoverable drafts on failure, reset stale thread state on workspace changes, and coordinate long-thread loading with `add-market-conversation-message-lazy-loading`.

Verification notes: strict OpenSpec validation, scoped ESLint, static searches, dependency review, and a targeted TypeScript check for the assistant components and dictionaries passed. Full-repo `pnpm typecheck` was run and remains blocked by pre-existing Web Speech API typing errors in `components/editor-x/speech-to-text-plugin.tsx`; no assistant file appeared in that error output. In-app browser automation could not start because the Windows sandbox denied the browser helper process, so interactive desktop/mobile checks remain in the user-owned manual QA note.
