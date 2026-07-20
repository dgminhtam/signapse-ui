## Context

`PersonalNotesQuickSheet` already owns create permission, the blank Plate value, editor identity, dirty flushing, provisional autosave, and local summary updates. Its only creation entry point is the automatic blank draft used when the first summary page is empty. The summary rail currently renders either the provisional item or persisted summaries, which would hide existing notes when an explicit new draft is started.

## Goals / Non-Goals

**Goals:**

- Let an authorized creator start another note from the Sheet after summaries load.
- Reuse the existing safe identity transition and provisional autosave flow.
- Keep the create action compact and confined to the summary rail.

**Non-Goals:**

- Creating empty backend records, changing the personal-note API, or changing autosave timing.
- Adding a title, delete flow, standalone notes route, dependency, or shared UI abstraction.

## Decisions

### Reuse the existing provisional draft

The action will initialize `EMPTY_PERSONAL_NOTE` with `noteId = null`. The first content change will continue through `createPersonalNoteAutosave()` and the existing `POST /me/notes` path. Creating a record on button activation was rejected because it would add empty notes and duplicate persistence logic.

### Keep the action in the summary rail

Render the existing outline `Button` with `PlusIcon` above the scrollable summaries after the collection loads successfully. Gate it with `personal-note:create` and reuse `personalNotes.draftLabel`; do not recreate a Sheet header or add localization keys.

### Use the current flush gate for the identity transition

The handler will return when `flushCurrentEditor()` fails. On success it will invalidate any outstanding detail request, clear the selected id, and initialize the editable blank draft. This preserves dirty content and prevents a stale detail response from replacing the new draft.

### Render provisional and persisted summaries together

The provisional item will be prepended to the same rail content instead of replacing the persisted list. `updateLocalSummary()` will continue to replace that provisional state naturally by assigning the returned id and prepending the created summary.

## Risks / Trade-offs

- [A stale detail response could replace the draft] -> Increment the existing detail request token before initializing the draft.
- [A failed flush could lose the active editor] -> Abort the transition and retain the current selection and editor.
- [Starting a draft could hide existing notes] -> Render the provisional item additively with persisted summaries.

## Migration Plan

No data migration is required; rollback is limited to reverting the Sheet component and this specification delta.

## Open Questions

None.
