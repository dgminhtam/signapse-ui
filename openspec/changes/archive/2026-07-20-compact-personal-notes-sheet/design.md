## Context

The Personal Notes Sheet currently renders a visible `SheetHeader` containing the repeated Notes title and the active editor's autosave state. The shared `SheetContent` also renders its default close button, so the header consumes vertical space without providing navigation or editing controls. The Sheet is controlled by the feature and already flushes the active editor before completing any close request.

The summary rail only stores backend summaries, while autosave state belongs to the one active editor. An empty collection is a special case: an authorized creator can edit a blank draft before the backend has assigned an id or returned a summary.

## Goals / Non-Goals

**Goals:**

- Let the note rail and editor use the full Sheet height without a visible header section.
- Hide the default close button through the existing `SheetContent` API rather than changing the shared shadcn wrapper.
- Preserve an accessible dialog title, overlay-click and Escape dismissal, focus restoration, and dirty-content flushing.
- Place localized autosave feedback beside the note whose editor owns that state.
- Keep first-draft save progress and failure visible before a persisted summary exists.

**Non-Goals:**

- Changing the personal-note API contract, permissions, pagination, Plate document format, or autosave scheduling.
- Adding a Save button, per-note background saving, a status map, or routine success toasts.
- Modifying `components/ui/sheet.tsx` or introducing a new shared component.

## Decisions

### Use the existing headerless Sheet composition

The feature will pass `showCloseButton={false}` to `SheetContent`, remove the visible `SheetHeader`, and render the existing localized `SheetTitle` with `className="sr-only"` directly inside the content. The hidden title has no layout footprint but preserves the dialog's accessible name.

Editing the shared Sheet wrapper or removing `SheetTitle` entirely was rejected because the behavior is feature-specific and every Sheet still requires an accessible title.

### Keep dismissal in the controlled Sheet lifecycle

Outside-pointer and Escape dismissal will continue to request `onOpenChange(false)`. The existing handler will flush the active editor and set `open` to false only after persistence succeeds; a failed flush keeps the Sheet and editor mounted. No `blur`, document-click, or custom overlay handler will be added.

A custom focus-loss listener was rejected because focus legitimately moves among controls inside the Sheet and would create premature closes.

### Render one autosave status at its owning rail item

The existing `saveStatus` remains a single value because only the selected editor can mutate. Saving, saved, and error feedback will render only inside the selected persisted summary item. Existing timestamp metadata remains available, and live-region semantics remain attached to the dynamic feedback.

A per-note status record was rejected because inactive notes do not save in the background and therefore have no independent state to track.

### Represent the first unsaved note as a provisional item

When an authorized creator has an editable draft and no persisted note id, the rail will render one localized provisional item. It owns the current autosave feedback until the first create succeeds. The existing save callback then adds the returned summary and id, naturally replacing the provisional presentation with the persisted selected item.

Hiding first-create progress or reporting failure only through a toast was rejected because a failed create must remain visible and associated with the draft whose content is still in the editor.

## Risks / Trade-offs

- **Removing the visible close button reduces dismissal discoverability** → Preserve click-outside and Escape behavior, safe focus restoration, and the header trigger; restore the existing default button if product testing shows the compact interaction is unclear.
- **Autosave text can compete with timestamp space in a narrow rail** → Show it only on the active item and use the existing compact secondary treatment without widening the rail.
- **The provisional item adds a distinct empty-collection state** → Keep it local to the existing summary rail and replace it from the current save response rather than introducing synthetic data into `notesPage`.
- **A close request can appear delayed while flushing** → Preserve the current controlled behavior because preventing draft loss is more important than immediate dismissal.

## Migration Plan

No data or API migration is required. The change is a reversible UI composition update; rollback restores the visible header and default close button while leaving persistence unchanged.

## Open Questions

None.
