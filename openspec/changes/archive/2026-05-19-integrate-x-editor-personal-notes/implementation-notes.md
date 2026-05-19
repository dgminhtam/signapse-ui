## Registry Inventory

Generated from:

```text
.\node_modules\.bin\shadcn.cmd add @shadcn-editor/editor-x --dry-run
```

Latest dry-run result:

- Files: 145 total
- New files: 132
- Skipped identical files: 13
- Runtime dependencies requested by registry: 24
- Dev dependencies requested by registry: 1

Runtime dependencies requested:

```text
sonner
next-themes
react-day-picker@latest
date-fns
cmdk
@lexical/code
@lexical/code-shiki
@lexical/code-prism
@lexical/extension
@lexical/file
@lexical/hashtag
@lexical/link
@lexical/list
@lexical/markdown
@lexical/overflow
@lexical/react
@lexical/rich-text
@lexical/selection
@lexical/table
@lexical/text
@lexical/utils
lexical
lodash
lucide-react
```

Dev dependency requested:

```text
@types/lodash
```

Skipped identical shadcn/app files reported by dry-run:

```text
components\ui\button.tsx
components\ui\separator.tsx
components\ui\input.tsx
components\ui\textarea.tsx
components\ui\dropdown-menu.tsx
components\ui\label.tsx
components\ui\scroll-area.tsx
components\ui\select.tsx
components\ui\tooltip.tsx
components\ui\sonner.tsx
components\ui\dialog.tsx
components\ui\input-group.tsx
components\ui\field.tsx
```

## Install And Dependency Review

Installed with:

```text
.\node_modules\.bin\shadcn.cmd add @shadcn-editor/editor-x
```

The registry created the editor source and added the missing shadcn wrappers:

```text
components\ui\button-group.tsx
components\ui\calendar.tsx
components\ui\checkbox.tsx
components\ui\command.tsx
components\ui\popover.tsx
components\ui\tabs.tsx
components\ui\toggle-group.tsx
components\ui\toggle.tsx
```

Wrappers were left under `components/ui`. `calendar.tsx` needed one compatibility adjustment for `react-day-picker@10`: the generated `classNames.table` key was changed to `classNames.month_grid`.

Dependencies already present before the registry install:

```text
sonner
next-themes
date-fns
lucide-react
```

New runtime dependencies from the registry:

```text
react-day-picker
cmdk
@lexical/code
@lexical/code-shiki
@lexical/code-prism
@lexical/extension
@lexical/file
@lexical/hashtag
@lexical/link
@lexical/list
@lexical/markdown
@lexical/overflow
@lexical/react
@lexical/rich-text
@lexical/selection
@lexical/table
@lexical/text
@lexical/utils
lexical
lodash
```

New dev dependency from the registry:

```text
@types/lodash
```

Additional Lexical dependencies required by the generated sample/runtime bridge:

```text
@lexical/history
@lexical/html
```

## Source Boundary

Editor-specific generated files were moved behind `components/editor-x/`; current inventory is 125 files including nodes, plugins, extensions, themes, transformers, hooks, and utilities. Actual shadcn wrappers remain in `components/ui`.

Import rewrites were completed so generated source no longer imports from root `@/components/*` paths except `@/components/ui/*` and `@/components/editor-x/*`. No generated editor files had to remain at root after the move.

Minor generated-source compatibility fixes applied:

- `images-extension.tsx` now creates the transparent drag image lazily so module evaluation does not touch `document` at import time.
- `editor-theme.ts` table class typos were corrected.
- `caret-from-point.ts`, `table-plugin.tsx`, and `component-picker-menu-plugin.tsx` were adjusted to satisfy TypeScript and lint.
- A few registry files keep narrow eslint disables for React compiler rules that reject vendor-style hook internals while the source is actively used by the editor.

## HTML Bridge And Adapter

`components/editor-x/editor.tsx` now hosts the full x-editor composition and keeps the app-facing contract HTML-only:

- HTML import: backend `contentHtml` is parsed with `DOMParser` and `$generateNodesFromDOM`.
- HTML export: editor updates emit `$generateHtmlFromNodes`.
- Save rehydrate: existing note surfaces call `hydrateNote(result.data)`, and the bridge imports the backend-returned sanitized `contentHtml`.
- Read-only: `editor.setEditable(false)` is applied and toolbars/actions are hidden.

`components/personal-note-editor.tsx` is now a small adapter over `XEditor`, so quick Sheet and `/notes` keep importing only `PersonalNoteEditor`.

## Verification Notes

Passing checks:

```text
pnpm typecheck
pnpm lint -- components/editor-x components/personal-note-editor.tsx components/personal-notes-quick-sheet.tsx "app/(main)/notes/personal-notes-workspace.tsx" components/ui/calendar.tsx
pnpm build
```

Build note: the default `.next` directory had a locked `personal-notes-start.err.log` from an external process, so build was verified once with a temporary `distDir` and the temporary build output was removed after success. The build compiled `/notes` successfully.

Manual smoke still needs an authenticated app session and backend running for quick Sheet create/update and full `/notes` flows.
