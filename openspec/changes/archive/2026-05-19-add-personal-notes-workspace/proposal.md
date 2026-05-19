## Why

Backend now exposes `/me/notes` for user-owned HTML notes, but the admin frontend has no personal note surface, actions, types, editor, or permission mapping. Signapse needs a fast note entry point for instructors who screen-share their own dashboard and want to capture formulas, trade commands, and lesson notes without leaving the app.

## What Changes

- Add a protected personal-notes workspace for the current user, backed by the new `/me/notes` API.
- Add authenticated frontend actions and DTOs for listing, creating, reading, updating, and deleting personal notes.
- Gate note visibility and actions with `personal-note:read`, `personal-note:create`, `personal-note:update`, and `personal-note:delete`.
- Add a **Ghi chú của tôi** button beside the workspace selector in the app header when the user can read personal notes.
- Provide a quick note Sheet for creating or editing a note without leaving the current app screen.
- Provide a full `/notes` workspace for larger editing and screen-share-friendly teaching use.
- Provide a presentation mode that reduces app chrome and makes note content easier to read during screen sharing.
- Use `contentHtml` as the frontend-backend contract: frontend sends HTML, backend sanitizes and stores it, and frontend rehydrates the editor from the returned sanitized HTML.
- Keep save explicit with a dedicated **Lưu** button, dirty-state feedback, pending spinner, and discard confirmation when closing with unsaved edits.
- Use note content itself as the note identity in V1: derive list labels from the first meaningful text in `contentHtml` because the backend contract does not expose `title`.
- Support destructive deletion through `AlertDialog`.
- Update `docs/APIMAPPING.md` after implementation so personal-notes coverage no longer appears as unmapped frontend work.
- Do not add student sharing, realtime collaboration, public links, workspace-scoped notes, chat bubbles, tags, pinned notes, archived notes, or a separate note title field in this change.

## Capabilities

### New Capabilities

- `personal-notes-workspace`: Create, edit, view, present, list, and delete current-user personal HTML notes inside the protected admin app.

### Modified Capabilities

- None.

## Impact

- Affected API layer: new `app/api/personal-notes/action.ts` using `fetchAuthenticated()`.
- Affected DTOs and permissions: new `app/lib/personal-notes/*` definitions and permission helpers.
- Affected routes and UI: new protected `/notes` surface plus a header quick-entry control integrated into `app/(main)/layout.tsx`.
- Affected shared app components: likely a reusable personal-note editor shell and presentation surface outside `components/ui`.
- Affected dependencies/components: evaluate and add the shadcn `@shadcn-editor/editor-x` registry item only after dry-run/diff review; keep all shadcn primitives routed through `@/components/ui`.
- Affected docs: `docs/APIMAPPING.md` personal-notes mapping and completion notes.
