## Context

Backend now exposes a compact current-user personal note API:

- `GET /me/notes` returns `PagePersonalNoteResponse`
- `POST /me/notes` accepts `{ contentHtml }`
- `GET /me/notes/{id}` returns one note
- `PUT /me/notes/{id}` accepts `{ contentHtml }`
- `DELETE /me/notes/{id}` deletes one note

The backend owns note sanitization. Frontend sends HTML from the editor, then treats the returned `PersonalNoteResponse.contentHtml` as the sanitized source of truth. The response currently contains only `id`, `contentHtml`, `createdDate`, and `lastModifiedDate`; it does not contain `title`, `excerpt`, `tags`, `archived`, `pinned`, workspace context, or sharing fields.

The product goal is personal note taking for instructors using screen share. Students do not open these notes directly. The frontend therefore needs an always-near entry point, a quick capture surface, and a larger reading/editing workspace, but it does not need student permissions, collaboration, public sharing, or realtime synchronization.

Relevant repo constraints:

- protected routes live under `app/(main)`
- authenticated backend calls use `fetchAuthenticated()`
- app and feature code compose through shadcn wrappers from `@/components/ui`
- user-facing text is Vietnamese
- submit/save buttons show `Spinner` and are disabled while pending
- destructive actions use `AlertDialog`
- create/update/detail pages avoid top-level Card shells when the layout itself is the workspace

## Goals / Non-Goals

**Goals:**

- Add current-user personal notes to the protected admin app.
- Keep the note entry point visible beside the workspace selector when the user has `personal-note:read`.
- Let users create, edit, view, present, and delete their own HTML notes.
- Keep saving explicit through a dedicated **Lưu** action.
- Rehydrate the editor from backend-returned sanitized HTML after create/update/read.
- Provide a full notes workspace and a screen-share presentation mode for teaching.
- Respect `personal-note:*` permissions for navigation and actions.
- Keep the frontend aligned with the backend's minimal contract.

**Non-Goals:**

- Student access, public links, sharing, realtime collaboration, comments, or presence.
- Workspace-scoped notes.
- A chat bubble or assistant-style note UI.
- Autosave as the primary persistence behavior.
- Adding note metadata that the backend does not expose, including title, tag, pin, archive, status, or context fields.
- Backend search/filter beyond the existing pageable list contract.
- Rendering unsanitized saved note HTML outside the editor/viewer pipeline.

## Decisions

### 1. Put the global entry point in the header beside the workspace selector

The app header will render a **Ghi chú của tôi** button in the right-side control group when the signed-in user has `personal-note:read`.

Why:

- Personal notes follow the user, not the current workspace, but instructors need the entry point available while they work across the app.
- The workspace selector already occupies the user's global working context area, so a neighboring note button is discoverable without looking like a sidebar destination.

Alternatives considered:

- Chat bubble floating above every page.
- Rejected because it suggests assistant/chat behavior, can cover chart/table content, and adds overlay/focus complexity without matching the teaching use case.
- Primary sidebar navigation only.
- Rejected because notes are a global utility and quick capture should not require leaving the current screen.

### 2. Split the experience into quick Sheet and full `/notes` workspace

The header button opens a right-side quick Sheet for current-screen capture and lightweight editing. The Sheet exposes a path into the full `/notes` workspace for extended editing and teaching.

Why:

- Sheet is good for quick capture without losing context.
- Sheet is too narrow for screen-share teaching, formulas, and lesson content.
- `/notes` can provide stable layout, larger editor space, a note rail, and presentation controls.

Alternatives considered:

- Sheet-only implementation.
- Rejected because screen-share readability would be constrained by panel width.
- Full page only.
- Rejected because it removes the fast capture benefit that makes notes useful while browsing other app surfaces.

### 3. Use backend-returned `contentHtml` as the only persisted content source

Create and update requests will send `{ contentHtml }`. After success, frontend will replace the draft with the returned `PersonalNoteResponse.contentHtml`.

Why:

- Backend sanitizes content and must be the authority for saved HTML.
- Rehydrating from the saved response prevents frontend from continuing to display markup that backend removed.

Alternatives considered:

- Client-side sanitization as the source of truth.
- Rejected because backend already owns the security boundary.
- Store editor JSON in frontend state and convert only on submit.
- Rejected for persistence because the backend contract is HTML-only. The editor may use internal state while editing, but the persisted boundary remains HTML.

### 4. Do not introduce a title field in MVP

The list rail and page identity will derive a display label from the first meaningful text in sanitized `contentHtml`. If extraction fails, the UI will show `Ghi chú chưa có tiêu đề`.

Why:

- The backend contract has no title field.
- Adding a frontend-only title would create unsaved or misleading metadata.
- Instructors can naturally put a heading at the top of the note when they need a clear label.

Alternatives considered:

- Ask backend to add title before frontend work starts.
- Rejected for this change because the current API is enough for the desired MVP.
- Store title in browser local state.
- Rejected because notes must follow the user through backend persistence.

### 5. Keep save explicit and guard dirty exits

The editor will track whether the current draft differs from the last sanitized server version. Save buttons are enabled only when the content is meaningful and dirty. Closing the Sheet or switching away from a dirty note will require confirmation.

Why:

- Instructors need predictable control while screen sharing.
- Explicit save avoids surprise writes during a live teaching flow.
- Dirty-exit protection prevents accidental loss when switching notes or closing quick capture.

Alternatives considered:

- Autosave every edit.
- Rejected because it complicates feedback, conflict expectations, and teaching flow control.
- No dirty confirmation.
- Rejected because rich notes can be substantial and accidental loss would be painful.

### 6. Use a read-only editor/viewer for viewing and presentation

The full workspace and presentation mode will render saved HTML through the same editor/viewer pipeline in read-only mode when not editing, instead of using an unrelated raw HTML surface.

Why:

- The user explicitly wants returned HTML rendered on the editor for view.
- Using one rendering pipeline reduces mismatch between edit and presentation states.

Alternatives considered:

- Render saved HTML directly with `dangerouslySetInnerHTML` in presentation mode.
- Rejected for MVP because it can drift from editor rendering and makes the boundary easier to misuse.

### 7. Add presentation mode as a notes-workspace mode, not a separate shared surface

Presentation mode will be reachable from `/notes` for a selected note and will reduce app chrome through a page-local full-viewport presentation surface.

Why:

- Screen share does not require public URLs or student permissions.
- A page-local full-viewport surface can cover sidebar/header chrome without adding a new route group or sharing model.
- The selected note remains within the authenticated admin app.

Alternatives considered:

- Public presentation route.
- Rejected because students do not access notes directly.
- Separate route group that bypasses the main layout.
- Rejected for MVP because it increases routing/layout complexity.

### 8. Treat `@shadcn-editor/editor-x` as the preferred editor candidate with a verification step

Implementation should evaluate the registry item with shadcn dry-run/diff workflow before adding it, then verify HTML import/export and read-only rendering before wiring the final notes UI around it.

Why:

- The user prefers this custom editor component.
- The repo requires shadcn wrapper discipline and review of added registry files.
- The decisive technical requirement is HTML round-trip, not just rich editing.

Alternatives considered:

- Build a custom contenteditable editor.
- Rejected because formatting, selection, toolbar behavior, and HTML conversion are too easy to get subtly wrong.
- Use a plain `Textarea`.
- Rejected because instructors need formatted notes for formulas, trade commands, checklists, and teaching.

## Risks / Trade-offs

- [Editor registry item may not support clean HTML import/export] -> Run a focused spike during implementation before committing deep UI integration; if it fails, choose the smallest compatible editor path that satisfies the HTML contract.
- [No backend title makes note lists less structured] -> Derive display labels from sanitized HTML and keep a backend title field out of scope until the API exposes one.
- [Large HTML notes may make list rendering expensive] -> Derive short labels/excerpts locally and avoid rendering full editor instances inside the list rail.
- [Sanitized HTML may differ after save] -> Always refresh the editor state from the backend response after create/update.
- [Presentation overlay could hide important app controls] -> Keep clear `Sửa`, `Lưu` when dirty, and `Thoát trình bày` controls inside the presentation surface.
- [No backend search means list discovery is limited] -> Start with recent/paginated notes sorted by last modification, and avoid promising full content search in MVP.
- [Delete is destructive] -> Require `AlertDialog` confirmation and refresh list selection after deletion.

## Migration Plan

1. Add personal-note definitions and permission helpers under `app/lib/personal-notes`.
2. Add authenticated server actions under `app/api/personal-notes/action.ts`.
3. Evaluate and add the editor dependency/component through shadcn dry-run/diff workflow.
4. Add reusable personal-note editor/viewer composition outside `components/ui`.
5. Add the header `Ghi chú của tôi` button and quick Sheet shell.
6. Add the full `/notes` workspace, loading skeleton, local error boundary, and access handling.
7. Add presentation mode for selected notes.
8. Wire create/update/delete flows with explicit save, dirty protection, pending feedback, toast feedback, and revalidation.
9. Update `docs/APIMAPPING.md` to mark personal-notes frontend coverage.
10. Verify typecheck/lint and smoke-test create, update, reload, present, delete, permission-gated, and sanitized HTML rehydration flows.

## Open Questions

- Does `@shadcn-editor/editor-x` provide stable APIs for HTML import/export and read-only rendering in this repo's React/Next/shadcn version?
- Does backend sort `/me/notes` by `lastModifiedDate` by default, or should frontend explicitly request `sort=lastModifiedDate,desc`?
