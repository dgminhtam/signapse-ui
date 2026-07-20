## Context

The protected app layout renders a permission-gated `PersonalNotesQuickSheet`. That client component currently owns note loading, selection, dirty state, create/update calls, fullscreen state, and save/discard UI, and delegates editing to `PersonalNoteEditor`, whose only implementation is `XEditor`. The generated `components/editor-x/**` module contains 118 files and is the only live source importing Lexical packages.

The desired interim product state is narrower: the header trigger and Sheet remain discoverable for users with `personal-note:read`, but the opened Sheet contains no note workflow or placeholder content. The separate Plate editor source is not a caller of `XEditor` and is outside this change.

## Goals / Non-Goals

**Goals:**

- Remove the complete x-editor/Lexical frontend implementation and dependencies.
- Reduce the personal-notes Sheet to an empty, accessible shell with no data access or editing state.
- Delete frontend personal-note modules and localization entries that become unreachable.
- Keep active OpenSpec requirements aligned with the interim behavior.
- Leave the repository passing deterministic static, lint, type, build, and OpenSpec checks.

**Non-Goals:**

- Replace x-editor with another editor.
- Remove or redesign the backend `/me/notes` API or its generated API mapping documentation.
- Remove archived OpenSpec history.
- Audit or delete the separate Plate editor stack and its dependencies.
- Preserve dormant frontend personal-note actions or DTOs for a future implementation.

## Decisions

### 1. Keep only the Sheet entry point

`PersonalNotesQuickSheet` will retain the localized `Ghi chú` trigger, `SheetContent`, an `sr-only` title, and the standard Sheet close behavior. It will not own controlled open state, fullscreen state, note state, effects, API calls, editor content, save/discard controls, or visible placeholder copy.

This is preferred over hiding the trigger because the product explicitly wants the personal-note Sheet retained. It is preferred over rendering an empty-state message because the requested temporary state is a blank Sheet and no new explanatory product copy is required.

### 2. Remove the unreachable personal-note frontend chain

Delete `components/editor-x/**`, `PersonalNoteEditor`, `PersonalNoteSaveBar`, and `PersonalNoteDiscardDialog`. Once the Sheet no longer reads or writes notes, also delete the frontend personal-note action and definitions modules rather than retaining unused scaffolding.

The protected layout will continue gating the trigger with `hasPermission(permissions, "personal-note:read")`. The feature-specific permission module can be removed because its create/update/delete checks and navigation aliases have no remaining consumers.

### 3. Remove only dependencies proven exclusive to x-editor

Remove `lexical` and the direct `@lexical/*` dependencies declared in `package.json`, then regenerate `pnpm-lock.yaml`. Static source analysis found no imports of these packages outside `components/editor-x/**`.

Do not remove `cmdk`, `react-day-picker`, `lodash`, or `@types/lodash` in this change. Although some were introduced during the historical editor integration, current Plate-related source still imports them and removing them without that broader source cleanup would break compilation. Shared shadcn wrappers also remain because each has another source consumer.

### 4. Remove only active specification and localization residue

The active `personal-notes-x-editor` and `x-editor-lexical-runtime-safety` requirements will be removed. The `personal-notes-sheet-only` capability will retain the header entry point and define the empty accessible surface while removing requirements for editing, fullscreen, toolbar, Markdown, and font-size behavior. The Plate AI boundary will stop promising preservation of the deleted Lexical editor while continuing to protect the remaining unrelated AI product areas.

Archived changes remain untouched as historical records. The editor dictionary subtree and personal-note strings used only by removed UI/actions will be deleted from both locale dictionaries; the trigger label remains.

## Risks / Trade-offs

- [Users can no longer view or edit existing notes from the frontend] → Mark the change as breaking and specify the empty interim state explicitly.
- [A generated editor dependency is still referenced outside the deleted module] → Run static searches before dependency removal, then typecheck and build after lockfile regeneration.
- [Shared UI wrappers are deleted because they originated with x-editor] → Keep every wrapper with any remaining source consumer; limit deletion to editor-owned and personal-note-owned modules.
- [Archived x-editor references make cleanup searches appear to fail] → Require zero references only in active code, package metadata, and active specs; preserve `openspec/changes/archive/**`.
- [Future personal-note work must recreate frontend contracts] → Accept this cost rather than maintaining unreachable scaffolding; backend API mapping remains the source for a future integration.

## Migration Plan

1. Simplify the Sheet and layout permission wiring so no live code imports personal-note editing/data modules.
2. Delete the now-unreachable editor, supporting UI, action, definitions, permission, and localization sources.
3. Remove direct Lexical dependencies and regenerate the lockfile.
4. Update active OpenSpec requirements and run deterministic verification.
5. Roll back by reverting this change as a unit; there is no backend or persisted-data migration.

## Open Questions

None. Removal of the separate Plate editor requires an explicitly scoped follow-up change.
