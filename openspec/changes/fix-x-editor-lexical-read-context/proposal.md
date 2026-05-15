## Why

The x-editor-backed personal note editor can throw a Lexical runtime error when exporting or reading editor state because some read callbacks run without an active editor context. This blocks reliable quick-note and `/notes` smoke testing after the x-editor migration.

## What Changes

- Ensure personal-note x-editor HTML export runs inside a Lexical read scope that provides the active editor.
- Audit x-editor toolbar, floating UI, image, and counter reads for the same active-editor-context requirement.
- Keep the existing HTML persistence boundary, note APIs, permissions, save flow, and generated x-editor feature set unchanged.
- Add targeted verification for edit, save/export, note switching, and read-only rendering paths that previously could trigger the runtime error.

## Capabilities

### New Capabilities
- `x-editor-lexical-runtime-safety`: Covers active editor context requirements for Lexical read/export operations inside the personal note x-editor integration.

### Modified Capabilities

## Impact

- Affected code: `components/editor-x/*`, especially the HTML bridge in `components/editor-x/editor.tsx`.
- Affected surfaces: personal notes quick Sheet and `/notes` workspace through the existing `PersonalNoteEditor` adapter.
- No backend API, DTO, database, dependency, permission, or persistence-contract change.
