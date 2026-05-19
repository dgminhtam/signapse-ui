## Context

The personal notes feature already uses `/me/notes` with `contentHtml` as the only create/update payload field. Backend sanitizes HTML and returns sanitized `PersonalNoteResponse.contentHtml`; frontend must treat that returned HTML as the saved source of truth.

The current editor is intentionally small: `components/personal-note-editor.tsx` uses `contentEditable` and `document.execCommand`. That kept the first implementation small, but it does not provide the full editing capability now desired.

The preferred editor is `@shadcn-editor/editor-x`. A dry-run showed it is a large Lexical-based registry item:

- 145 files total
- 132 new files
- 13 skipped files already matching local files
- 24 runtime dependencies
- 1 dev dependency

The main risk is not just package count. The generated source includes many editor nodes, plugins, extensions, toolbar pieces, helpers, and shadcn wrappers. If left scattered under `components/`, it will be hard to review, upgrade, and keep separate from app-level components.

## Goals / Non-Goals

**Goals:**

- Use the full `@shadcn-editor/editor-x` capability set for personal notes.
- Keep `PersonalNoteEditor` as the stable app-facing adapter.
- Keep feature code and API actions working with HTML only.
- Rehydrate the editor from backend-returned sanitized HTML after create, update, and load.
- Support read-only rendering for note view and presentation mode through the x-editor pipeline.
- Keep generated editor source organized under an intentional boundary.
- Preserve existing note permissions, explicit save, dirty discard, presentation, and delete flows.

**Non-Goals:**

- Changing backend personal-note API payloads from HTML to Lexical JSON.
- Adding title, tags, sharing, realtime collaboration, student access, or workspace-scoped notes.
- Replacing global shadcn wrappers outside what the registry requires.
- Building a custom editor feature set from scratch.
- Silently disabling full x-editor features to simplify the first migration unless a specific feature is incompatible with this app.

## Decisions

### 1. Keep `PersonalNoteEditor` as the only app-facing editor boundary

The note Sheet and `/notes` workspace should continue importing `PersonalNoteEditor`. The implementation behind that component will change from `contentEditable` to x-editor.

The adapter API should stay close to:

```ts
interface PersonalNoteEditorProps {
  value: string
  onChange?: (contentHtml: string) => void
  readOnly?: boolean
  placeholder?: string
  className?: string
  editorClassName?: string
}
```

Why:

- Quick Sheet and full workspace already depend on this small HTML boundary.
- It keeps Lexical types out of API actions and note workspace state.
- It creates a rollback path if x-editor integration has issues.

Alternatives considered:

- Let note surfaces import x-editor directly.
- Rejected because it spreads Lexical state and registry details through feature code.
- Change backend to store Lexical JSON.
- Rejected because backend contract is already HTML and sanitization belongs to backend.

### 2. Treat x-editor source as an owned editor module, not loose shared components

Implementation should first install through the shadcn registry workflow, then inventory generated files and move or wrap editor-specific code behind a clear boundary such as `components/editor-x/` or `components/editor/`, preserving `components/ui/*` only for actual shadcn wrappers.

Why:

- The registry creates many editor-specific files that are not general app components.
- Future review and upgrade work needs a place to reason about the editor as one subsystem.
- A boundary prevents unrelated pages from accidentally depending on low-level editor internals.

Alternatives considered:

- Leave all generated files at `components/*`.
- Rejected because source ownership becomes unclear.
- Fork the registry manually before installation.
- Rejected because the repo rule is to use shadcn CLI workflow for registry components and review generated files.

### 3. Prove the HTML bridge before replacing the runtime editor

The migration must verify these four conversions before replacing the current editor:

```text
backend sanitized HTML -> x-editor initial state
x-editor state -> HTML for save
saved backend HTML -> x-editor rehydrate after mutation
x-editor read-only mode -> note view/presentation rendering
```

Why:

- The editor sample primarily exposes Lexical `EditorState` and `SerializedEditorState`.
- The personal-note API persists HTML only.
- Backend sanitization can change markup, so post-save rehydrate is mandatory.

Alternatives considered:

- Store Lexical JSON in local state and only approximate HTML on save.
- Rejected unless HTML export remains the reliable boundary used for dirty state and persistence.
- Render sanitized HTML outside the editor for view mode.
- Rejected because the user wants returned HTML rendered through the editor/viewer experience.

### 4. Preserve full x-editor functionality unless incompatibility is proven

The migration should keep the registry feature set enabled, including toolbar, markdown shortcuts, tables, checklists, links, images, embeds, layout blocks, code highlighting, import/export, and edit/read mode support.

Why:

- The user explicitly wants full x-editor capability despite the heavier dependency footprint.
- A partial install would undermine the reason for choosing x-editor.

Alternatives considered:

- Install only a minimal Lexical subset.
- Rejected because the product decision is now full x-editor.

### 5. Make dependency and generated-file review part of the implementation, not an afterthought

The implementation should record which dependencies are new versus already present, review generated wrappers for repo conventions, and avoid silently overwriting local shadcn wrapper changes.

Why:

- The dry-run includes both app dependencies and UI wrappers.
- The repo requires shadcn wrapper discipline and careful review of generated files.

## Risks / Trade-offs

- [Large source increase] -> Keep editor code under an explicit module boundary and add an inventory task.
- [HTML bridge may require extra Lexical utilities not included by the registry] -> Spike bridge helpers first and add the smallest additional dependency only if required.
- [Generated files may import paths that do not match repo structure after moving] -> Move files in one mechanical pass and run typecheck after import rewrites.
- [Registry wrappers may conflict with existing shadcn wrappers] -> Use dry-run/diff review and preserve local wrapper conventions.
- [Full x-editor features may not fit quick Sheet density] -> Keep full workspace as the primary rich editing surface and let quick Sheet use the same editor in a bounded overlay.
- [Images/embeds may produce HTML backend sanitizer removes] -> Always rehydrate from the backend response and document removed markup as sanitizer behavior, not frontend state loss.

## Migration Plan

1. Re-run `shadcn add @shadcn-editor/editor-x --dry-run` and capture dependency/file inventory.
2. Install the registry item through shadcn CLI.
3. Review generated shadcn wrappers and editor files for import paths, composition rules, and type errors.
4. Organize editor-specific generated files into a clear editor module boundary, keeping real shadcn wrappers in `components/ui`.
5. Implement x-editor HTML import/export/read-only helpers.
6. Replace the current `contentEditable` body of `PersonalNoteEditor` with the x-editor adapter.
7. Verify quick Sheet, full `/notes`, save rehydrate, read-only presentation, dirty state, and empty-note validation.
8. Run typecheck, scoped lint, build, and OpenSpec validation.

## Open Questions

- Does the registry's generated `doc-serialization.ts` already provide enough HTML import/export support, or is an additional Lexical HTML utility package needed?
- After installation, can all editor-specific files be safely moved under `components/editor-x/` in one pass, or should the first pass keep generated paths and add a follow-up normalization task?
- Which x-editor features produce HTML that the backend sanitizer strips, especially images, embeds, layout blocks, styles, and code highlighting?
