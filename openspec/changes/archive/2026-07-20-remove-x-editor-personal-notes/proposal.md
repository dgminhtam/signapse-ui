## Why

The personal-notes x-editor integration contributes a large generated Lexical surface and editor-only dependencies while the product no longer needs note editing in the current UI. Removing it now reduces maintenance and build risk while retaining the header Sheet as an intentionally empty placeholder for a future personal-notes experience.

## What Changes

- **BREAKING** Remove personal-note listing, loading, editing, fullscreen, save, discard, and persistence behavior from the header Sheet.
- Keep the permission-gated `Ghi chú` header trigger, an accessible Sheet title, the Sheet close behavior, and otherwise empty Sheet content.
- Remove the x-editor source module, its app adapter, and personal-note UI components that become unreachable.
- Remove unused frontend personal-note actions, DTO/helpers, permission helpers, and localization copy that only supported the removed workflow.
- Remove direct Lexical dependencies and update the package lockfile.
- Remove active x-editor requirements and align the Sheet-only requirements with the temporary empty state.
- Leave backend API mapping documentation, archived OpenSpec history, and the unrelated Plate editor stack unchanged.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `personal-notes-x-editor`: Remove all requirements for the x-editor adapter, Lexical/HTML bridge, read-only rendering, and editor workflow behavior.
- `personal-notes-sheet-only`: Retain the header Sheet entry point while replacing its editing workflow with an intentionally empty, accessible Sheet surface.
- `x-editor-lexical-runtime-safety`: Remove runtime-safety and HTML-persistence requirements that only apply to the deleted x-editor integration.
- `plate-editor-ai-boundary`: Remove the obsolete promise to preserve a separate Lexical editor while keeping the remaining unrelated AI product boundaries unchanged.

## Impact

- Affected UI: `components/editor-x/**`, personal-note adapter/supporting components, the personal-notes quick Sheet, and the protected app layout.
- Affected frontend boundaries: `app/api/personal-notes/action.ts`, `app/lib/personal-notes/**`, and personal-note/editor dictionary entries.
- Affected dependencies: `lexical` and all direct `@lexical/*` packages currently declared by the project; `pnpm-lock.yaml` will be pruned accordingly.
- Unchanged systems: backend `/me/notes` contracts and `docs/api_mapping.json`, archived OpenSpec changes, shared shadcn wrappers still referenced elsewhere, and the separate Plate editor source/dependencies.
