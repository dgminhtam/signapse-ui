## 1. Personal-note Contract and Actions

- [x] 1.1 Extend personal-note definitions with version-1 Plate JSON request/detail response types and Zod mutation validation for `{ content, contentSchemaVersion }`.
- [x] 1.2 Add centralized `personal-note:read`, `personal-note:create`, and `personal-note:update` permission constants and replace the existing layout literal with the shared read constant.
- [x] 1.3 Add authenticated `getPersonalNote`, `createPersonalNote`, and `updatePersonalNote` Server Actions with localized `ActionResult` mutation errors.

## 2. Shared Plate Editor Boundary

- [x] 2.1 Update the shared `PlateEditor` to accept an initial Plate value, `onValueChange`, and read-only inputs without mirroring live editor content into React state.
- [x] 2.2 Preserve the standalone `/editor` demo value and verify that the playground supplies no personal-note persistence callback.

## 3. Personal Notes Detail Lifecycle

- [x] 3.1 Make summary rows keyboard-selectable, load `GET /me/notes/{id}`, show scoped detail loading/error states, and ignore stale out-of-order detail responses.
- [x] 3.2 Initialize supported version-1 content as a note-specific editor instance and render unsupported versions safely without an editable editor.
- [x] 3.3 Render an editable blank document only when the collection is empty and the user has create permission; otherwise preserve the localized empty/read-only state.

## 4. Autosave and Feedback

- [x] 4.1 Implement the 1000 ms debounced, single-flight autosave coordinator that POSTs once for a new draft, PUTs existing notes, and immediately persists the latest value queued during an in-flight request.
- [x] 4.2 Add one focused dependency-free runnable check for create deduplication, mutation ordering, and dirty-value retention in the autosave coordinator.
- [x] 4.3 Flush and await dirty content before note switches or Sheet close, keeping the current editor open when the flush fails.
- [x] 4.4 Update local summary identity and timestamps from successful create/update responses without refetching the full list after every autosave.
- [x] 4.5 Add localized inline loading/saving/saved/error/unsupported-version copy with polite status and alert semantics, and confirm no Save button or routine success toast is rendered.

## 5. Documentation and Verification

- [x] 5.1 Update the personal-note detail/create/update frontend integration status and ownership notes in `docs/APIMAPPING.md` without changing backend snapshot semantics.
- [x] 5.2 Run the focused autosave coordinator check, targeted ESLint for affected files, and `pnpm typecheck`.
- [x] 5.3 Run static checks confirming `/editor` does not call personal-note actions, no Save control was added, and unsupported schema versions cannot reach autosave.
- [x] 5.4 Run strict OpenSpec validation for `autosave-personal-notes` and resolve all artifact errors.
