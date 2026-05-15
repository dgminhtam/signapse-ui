## Why

Personal notes are currently backed by a small custom `contentEditable` editor, but the product direction now calls for the full `@shadcn-editor/editor-x` feature set. The migration needs a deliberate boundary because the registry item adds many Lexical packages and generated source files, and unmanaged installation would make the app source difficult to maintain.

## What Changes

- Integrate the full `@shadcn-editor/editor-x` registry item for personal notes.
- Replace the current custom `contentEditable` implementation behind the existing `PersonalNoteEditor` API.
- Keep the frontend/backend persistence contract as `contentHtml`; do not expose Lexical JSON state to API actions or note feature code.
- Add an HTML bridge so backend-returned sanitized HTML can initialize and rehydrate x-editor, and x-editor content can export HTML on explicit save.
- Preserve full x-editor capabilities such as rich toolbar actions, markdown shortcuts, tables, checklists, links, images, embeds, layout blocks, code highlighting, import/export, and read/edit mode support where the registry supports them.
- Organize generated editor source behind a clear editor module boundary so the registry output does not remain an unstructured pile of root-level app components.
- Keep quick Sheet, full `/notes` workspace, presentation mode, permissions, dirty protection, explicit save, and delete behavior intact.
- Do not change backend endpoints, DTO payload fields, note ownership, permissions, or add student sharing/collaboration.

## Capabilities

### New Capabilities
- `personal-notes-x-editor`: Covers the x-editor-backed personal note editor, source organization boundary, HTML persistence bridge, and surface migration.

### Modified Capabilities

## Impact

- Affected dependencies: `@shadcn-editor/editor-x` registry dependencies, currently estimated by dry-run as 24 runtime dependencies plus 1 dev dependency, with some already present in this repo.
- Affected generated source: dry-run currently reports 145 files total, 132 new and 13 skipped.
- Affected UI wrappers: may add missing shadcn wrappers such as checkbox, popover, tabs, toggle, calendar, button-group, toggle-group, and command through the registry workflow.
- Affected editor code: `components/personal-note-editor.tsx` and the generated editor module.
- Affected note surfaces: `components/personal-notes-quick-sheet.tsx` and `app/(main)/notes/personal-notes-workspace.tsx` only through the stable editor adapter.
- No backend, database, API mapping contract, or permission model change.
