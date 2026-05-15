## Context

The personal note editor now wraps the full x-editor/Lexical stack while keeping app-facing state as sanitized HTML. During smoke testing, Lexical 0.44 reports `Unable to find an active editor` when code reads an `EditorState` without providing the editor context required by helpers that call `$getEditor()` internally.

The clearest trigger is the HTML bridge export path in `components/editor-x/editor.tsx`: `OnChangePlugin` receives an `editorState` and calls `$generateHtmlFromNodes(activeEditor, null)` inside `editorState.read(() => ...)`. Lexical 0.44 documents that editor-aware reads must use `editor.read(...)` or `editor.getEditorState().read(..., { editor })`.

## Goals / Non-Goals

**Goals:**

- Remove the active-editor runtime error from personal note edit/export flows.
- Keep the x-editor HTML bridge compatible with Lexical 0.44 read semantics.
- Audit generated x-editor read sites that can run outside a command/update callback.
- Preserve the existing personal-note adapter API and HTML persistence contract.

**Non-Goals:**

- Replacing x-editor, downgrading Lexical, or disabling full x-editor features.
- Changing backend note sanitization, DTOs, endpoints, permissions, or save semantics.
- Refactoring generated editor source beyond the minimal compatibility fix.

## Decisions

### 1. Fix editor context at each read boundary, not inside feature state

Use Lexical-supported read scopes where editor context is required:

- Prefer `editor.read(() => { ... })` when reading the current editor state from a known editor instance.
- Use `editorState.read(() => { ... }, { editor })` when a callback receives a specific `EditorState`.

Why:

- This follows the Lexical 0.44 API contract directly.
- It keeps the fix local to editor integration code.
- It avoids leaking Lexical concerns into quick Sheet or `/notes` workspace state.

Alternative considered:

- Catch and suppress the runtime error. Rejected because it would hide broken export behavior and could save stale HTML.

### 2. Treat HTML export as the primary blocking path

Fix the `HtmlBridgePlugin` export first because it produces the `contentHtml` draft used by save, dirty state, and empty-content validation.

Why:

- The pasted runtime error matches an editor-aware read missing `{ editor }`.
- `$generateHtmlFromNodes` uses Lexical DOM/render helpers that depend on active editor context.
- A failed export makes the rest of the note workflow unreliable even if the UI renders.

Alternative considered:

- Audit every generated plugin before touching the bridge. Rejected because the bridge is the root persistence path and can be fixed independently.

### 3. Audit generated read callbacks after the bridge fix

Review other generated read sites such as toolbar update listeners, floating link/text toolbar listeners, image selection checks, and code action mutation listeners. Convert only read sites that can require active editor context or reproduce the same error.

Why:

- Generated x-editor code has several `editorState.read(() => ...)` and `editor.getEditorState().read(() => ...)` calls.
- Some are safe because they only use state helpers, while others may invoke node methods or editor-aware helpers.
- A surgical audit avoids broad churn in generated code while still addressing the compatibility issue.

Alternative considered:

- Mechanically rewrite all reads. Rejected because broad generated-source churn can introduce regressions in command callbacks that already execute in valid Lexical context.

## Risks / Trade-offs

- [Generated editor code has more context-sensitive reads] -> Audit all matching read sites and smoke-test toolbar, image, link, and selection interactions.
- [HTML export still updates draft too frequently] -> Keep current `OnChangePlugin` behavior unchanged for this fix; defer performance tuning unless profiling shows a problem.
- [Sanitized backend HTML differs after save] -> Preserve existing post-save rehydrate behavior from backend-returned `contentHtml`.
- [Read-only presentation has a separate editor instance] -> Verify read-only mode loads saved HTML without toolbar plugins and without edit/export callbacks.
