## 1. Gate and scope the route

- [x] 1.1 Update the server page to resolve current permissions and the active workspace, render the localized `AccessDenied` state without `query:execute`, and key `DemoConversation` by workspace identity.
- [x] 1.2 Add localized permission, no-active-workspace, create-pending, submit-pending, and failed-message copy in both dictionaries.
- [x] 1.3 Pass `workspaceId` into the client surface, guard all backend entry points when it is null, and render the localized no-active-workspace state without making conversation requests.

## 2. Replace the scripted lifecycle

- [x] 2.1 Remove `useChat`, `createChat`, scripted turns, fixture transport, `nextMessage`, and scripted New chat behavior while preserving the existing empty state and demo-specific transcript UI.
- [x] 2.2 Store `MarketChatMessageResponse[]` directly and reuse the existing normalization and reconciliation helpers so role, status, failure reason, and creation date survive loading and merging.
- [x] 2.3 Implement one controlled persisted draft and create-on-first-message using the existing title, create, and submit actions; select the created conversation before submitting and clear the draft only after submit success.
- [x] 2.4 Ensure New chat resets persisted selection, messages, cursors, History query/results, draft, loading state, and operation errors without creating a conversation until the first valid submission.

## 3. Complete rendering and retry behavior

- [x] 3.1 Render failed assistant messages even with empty content, expose their failure reason or localized fallback accessibly, and use failure content in tracking-rail previews.
- [x] 3.2 Replace boolean/shared message errors with string-valued History, initial transcript, older-message, create, and submit errors sourced from thrown requests or `ActionResult.error`.
- [x] 3.3 Keep initial transcript retry on the latest page and older-message retry on the unchanged failed cursor without discarding the loaded timeline.
- [x] 3.4 Preserve the selected conversation and draft after create-success/submit-failure so retry submits to the existing conversation and never creates a duplicate.

## 4. Align the composer

- [x] 4.1 Submit the native form on Enter, retain Shift+Enter newline behavior, and suppress submission during IME composition.
- [x] 4.2 Disable the composer for no workspace, initial transcript loading, create, and submit operations; provide stable operation-specific spinner text and connect errors with `aria-invalid`, `aria-describedby`, and an announced error state.

## 5. Remove obsolete surface and dependencies

- [x] 5.1 Remove the nonfunctional attachment, image, research, and web-search menu plus their unused icons and dictionary entries.
- [x] 5.2 Remove or consolidate the misleading fixture module and update deterministic demo checks to cover backend message metadata, failed-message retention, create/submit retry identity, reconciliation, and tracking widths.
- [x] 5.3 Statically confirm no remaining consumers, then remove direct `@ai-sdk/react`, `@shadcn/helpers`, and `ai` dependencies and update the pnpm lockfile.

## 6. Verify the completed adaptation

- [x] 6.1 Run the updated deterministic demo and market-conversation checks.
- [x] 6.2 Run targeted lint for the demo route, dictionaries, helpers, and checks, then run `pnpm.cmd typecheck`.
- [x] 6.3 Run static searches for scripted fixture and unsupported action remnants, inspect the scoped diff, and run `openspec validate complete-demo-conversation-api-adaptation --strict`.

## 7. Add pending marker and progressive response reveal

- [x] 7.1 Update the change artifacts to distinguish synchronous backend transport from the route-local Thinking marker and progressive response reveal.
- [x] 7.2 Add localized pending Marker feedback, bounded grapheme-safe response reveal, reduced-motion and screen-reader behavior, and matching tracking previews without changing persisted message truth.
- [x] 7.3 Add deterministic reveal checks and run targeted lint, typecheck, demo checks, and strict OpenSpec validation.
