## 1. Registry Install And Inventory

- [x] 1.1 Re-run `shadcn add @shadcn-editor/editor-x --dry-run` and capture the current file/dependency inventory in implementation notes.
- [x] 1.2 Install `@shadcn-editor/editor-x` through the repo shadcn workflow without overwriting unrelated local changes.
- [x] 1.3 Review generated shadcn wrapper files and preserve repo conventions for `components/ui`.
- [x] 1.4 Identify dependencies that are newly added versus already present in `package.json`.

## 2. Source Boundary

- [x] 2.1 Inventory generated editor-specific nodes, plugins, extensions, themes, transformers, hooks, and utilities.
- [x] 2.2 Move or wrap editor-specific generated source behind a clear editor module boundary while keeping actual shadcn wrappers in `components/ui`.
- [x] 2.3 Rewrite generated imports after any source move and run a focused typecheck to verify the editor module compiles.
- [x] 2.4 Document any generated files that cannot be moved safely in the first pass and why.

## 3. HTML Bridge

- [x] 3.1 Locate or implement the x-editor HTML import path for initializing Lexical state from backend `contentHtml`.
- [x] 3.2 Locate or implement the x-editor HTML export path for deriving `contentHtml` from the current editor state on save.
- [x] 3.3 Verify save success rehydrates x-editor from backend-returned sanitized `contentHtml`.
- [x] 3.4 Verify visually empty x-editor content is still rejected by the existing meaningful HTML check.

## 4. Personal Note Adapter Migration

- [x] 4.1 Replace the current `contentEditable` implementation inside `components/personal-note-editor.tsx` with an x-editor-backed adapter that keeps `value`, `onChange`, and `readOnly` HTML-oriented props.
- [x] 4.2 Ensure quick Sheet and `/notes` workspace continue using `PersonalNoteEditor` without importing Lexical or generated editor internals.
- [x] 4.3 Preserve explicit save, dirty state, discard confirmation, and permission-gated read/write behavior.
- [x] 4.4 Render read-only note viewing and presentation mode through the x-editor/viewer pipeline.

## 5. Verification

- [x] 5.1 Run typecheck and scoped lint for the generated editor module and personal note surfaces.
- [x] 5.2 Run a production build to catch bundling, CSS, and client boundary issues.
- [x] 5.3 Manual QA transferred out of the agent-owned archive gate.
  User-owned manual QA: Smoke-test quick Sheet create/update, sanitized rehydrate, note switching, dirty discard, full `/notes`, read-only presentation, and empty-note rejection.
- [x] 5.4 Review generated source size and package impact before finalizing the migration.
- [x] 5.5 Run `openspec validate integrate-x-editor-personal-notes --strict`.
