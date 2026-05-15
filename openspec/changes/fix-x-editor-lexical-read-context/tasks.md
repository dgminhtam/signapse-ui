## 1. Root Cause Fix

- [x] 1.1 Update `HtmlBridgePlugin` so `$generateHtmlFromNodes` runs inside a Lexical read scope with the active editor context.
- [x] 1.2 Confirm HTML import from backend `contentHtml` still runs inside `editor.update()` and does not need persistence contract changes.

## 2. Generated Editor Read Audit

- [x] 2.1 Audit `components/editor-x` read sites that use `editorState.read(...)`, `editor.getEditorState().read(...)`, or `activeEditor.getEditorState().read(...)`.
- [x] 2.2 Update any generated plugin read that can require active editor context, keeping changes surgical and scoped to runtime compatibility.
- [x] 2.3 Avoid changing command callbacks or update callbacks that already execute with valid Lexical context unless reproduction proves they are involved.
- [x] 2.4 Disable `SelectionAlwaysOnDisplayExtension` because its upstream `markSelection()` listener reads editor state without active editor context in Lexical 0.44.

## 3. Personal Note Workflow Verification

- [x] 3.1 Run typecheck or a focused TypeScript compile check for the editor and personal-note surfaces.
- [ ] 3.2 Smoke-test quick Sheet editing so typing exports HTML without the active-editor runtime error.
- [ ] 3.3 Smoke-test explicit save, backend sanitized rehydrate, note switching, dirty discard, and empty-note rejection.
- [ ] 3.4 Smoke-test `/notes` read-only presentation mode to confirm it renders saved HTML without edit/export callbacks.
- [x] 3.5 Run `openspec validate fix-x-editor-lexical-read-context --strict`.
