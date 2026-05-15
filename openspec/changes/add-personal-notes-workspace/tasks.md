## 1. Contract, permissions, and API actions

- [x] 1.1 Add `app/lib/personal-notes/definitions.ts` with `PersonalNoteResponse`, `CreatePersonalNoteRequest`, `UpdatePersonalNoteRequest`, list/page helpers, empty-content helpers, and note-label derivation from `contentHtml`.
- [x] 1.2 Add `app/lib/personal-notes/permissions.ts` with `personal-note:read`, `personal-note:create`, `personal-note:update`, `personal-note:delete`, and helper functions for read/create/update/delete checks.
- [x] 1.3 Add `app/api/personal-notes/action.ts` with authenticated `getPersonalNotes`, `getPersonalNote`, `createPersonalNote`, `updatePersonalNote`, and `deletePersonalNote` actions that use `fetchAuthenticated()`, return `ActionResult` for mutations, and revalidate note routes after writes.
- [x] 1.4 Verify the personal-note actions send only `contentHtml` for create/update and do not introduce frontend-only fields such as title, tags, workspace id, or presentation state.

## 2. Editor dependency and shared note components

- [x] 2.1 Preview the `@shadcn-editor/editor-x` registry item with the repo's shadcn workflow before installation, including dry-run/diff review and import path checks.
- [x] 2.2 Add or adapt the editor component only after confirming HTML export, HTML import, and read-only rendering work in this Next.js/shadcn setup.
- [x] 2.3 Add a shared personal-note editor/viewer component outside `components/ui` that accepts server HTML, tracks dirty state, exports `contentHtml`, and can render in editable or read-only mode.
- [x] 2.4 Add shared note save/status controls with explicit `Lưu`, disabled pending state, `Spinner`, saved/dirty feedback, and Vietnamese error/success copy.
- [x] 2.5 Add shared confirmation handling for discarding dirty note changes before close, note switch, or presentation transitions.

## 3. Header entry and quick Sheet

- [x] 3.1 Update `app/(main)/layout.tsx` or a small app-level header child component so `Ghi chú của tôi` appears beside `WorkspaceSwitcher` only when the user has `personal-note:read`.
- [x] 3.2 Build an app-level personal-note quick Sheet that opens from the header button, keeps the current page mounted behind it, and scopes loading/error states to the Sheet.
- [x] 3.3 In the quick Sheet, load recent notes from `/me/notes`, allow selecting a note, and show compact labels derived from sanitized `contentHtml`.
- [x] 3.4 In the quick Sheet, support starting a new note when the user has `personal-note:create`.
- [x] 3.5 In the quick Sheet, support explicit create/update save flows when the user has the matching permission and rehydrate the editor from the returned sanitized `contentHtml`.
- [x] 3.6 Add a clear quick Sheet action that navigates to the full `/notes` workspace for larger editing or teaching use.

## 4. Full notes workspace

- [x] 4.1 Add `app/(main)/notes/page.tsx` as a protected cardless workspace with permission handling, `Suspense`, and a loading skeleton that mirrors the final note rail and editor layout.
- [x] 4.2 Add `app/(main)/notes/error.tsx` for local notes workspace errors.
- [x] 4.3 Build the `/notes` client workspace with a note list rail, selected-note editor/viewer, create action, and empty state using `<Empty>`.
- [x] 4.4 Keep note list pagination in URL with `page` and `size`, using 1-indexed URL values and 0-indexed backend values.
- [x] 4.5 Keep selected note id in URL so refreshing `/notes` can restore the active note when possible.
- [x] 4.6 Ensure the note list rail derives labels/excerpts from `contentHtml` without mounting a rich editor instance for every row.
- [x] 4.7 Render timestamp metadata with the repo's secondary time treatment and avoid decorative badges or redundant body headings.

## 5. Presentation mode

- [x] 5.1 Add presentation mode for the selected note from the full `/notes` workspace, using a full-viewport authenticated surface that reduces app chrome for screen sharing.
- [x] 5.2 Render presentation content from backend-returned sanitized `contentHtml` through the note editor/viewer pipeline in read-only mode.
- [x] 5.3 Add visible controls for `Thoát trình bày` and returning to edit mode without losing selected note state.
- [x] 5.4 Require save or discard confirmation before presenting when the current note has unsaved changes.
- [x] 5.5 Verify presentation mode remains readable at common desktop screen-share sizes.

## 6. Delete flow and state recovery

- [x] 6.1 Add a delete action only for users with `personal-note:delete`.
- [x] 6.2 Guard deletion with `AlertDialog` and clear Vietnamese warning copy for an irreversible action.
- [x] 6.3 Refresh the list after successful deletion and clear or replace the selected-note state when the active note is deleted.
- [x] 6.4 Preserve the current note and avoid calling the API when the user cancels the delete dialog.

## 7. Documentation and verification

- [x] 7.1 Update `docs/APIMAPPING.md` so `/me/notes` endpoints map to the new frontend actions/routes and no longer appear as unmapped personal-note work.
- [x] 7.2 Run typecheck and lint for the changed scope.
- [ ] 7.3 Smoke-test permission-gated header visibility, quick Sheet open/close, create, update, sanitized rehydration, full `/notes` reload, pagination URL state, selected-note URL state, presentation mode, dirty discard confirmation, and delete confirmation.
- [x] 7.4 Verify the editor rejects visually empty notes even if the HTML string contains empty structural markup such as blank paragraphs.
- [x] 7.5 Run `openspec validate add-personal-notes-workspace --strict`.
