## Context

The Personal Notes Sheet renders persisted summaries as `Item` buttons containing a one-line backend title and a last-modified timestamp. The whole `Item` is currently the selection button, so adding an action trigger inside it would create invalid nested interactive controls. The frontend mutation schema still sends only Plate content and schema version, while this change assumes the updated backend contract requires `title: string | null` in both POST and PUT requests and continues returning the full personal-note response.

The backend already exposes `DELETE /me/notes/{id}` with `personal-note:delete`, but the frontend has no delete action or permission constant. All required radix-nova shadcn wrappers (`Item`, `DropdownMenu`, `Dialog`, `Field`, `Input`, `AlertDialog`, `Button`, and `Spinner`) are already installed.

## Goals / Non-Goals

**Goals:**

- Make the summary rail title-only and compact while preserving one-line truncation, selected state, keyboard selection, pagination, and provisional-draft behavior.
- Give each persisted summary one overflow trigger containing Rename and Delete when permitted.
- Persist nullable titles through the existing full create/update contract without letting content saves restore stale titles.
- Integrate guarded deletion and recover the Sheet to a valid selected, provisional, or empty state.
- Keep nested menu/dialog focus behavior accessible inside the existing Sheet.

**Non-Goals:**

- Search, sort, tags, duplicate-title disambiguation, inline editing, or a standalone `/notes` workspace.
- A title field inside Plate or title derivation from Plate content.
- A new partial-update endpoint, optimistic concurrency protocol, shared row-action abstraction, shadcn wrapper update, or dependency addition.

## Decisions

### 1. Treat title as explicit nullable mutation state

`PersonalNoteMutationRequest` will contain `title: string | null`, `content`, and `contentSchemaVersion`. A provisional draft starts with title `null`; POST sends that value until the backend returns the persisted response. Subsequent content saves read the latest backend-confirmed active title and include it in every PUT, so a save cannot revert a successful rename to an older value.

Rename input is initialized from the persisted summary title. Submission trims surrounding whitespace and maps an empty result to `null`, which intentionally restores the localized untitled presentation. The backend response remains the source of truth for the summary and active title.

Alternative considered: derive or edit the first Plate block. Rejected because the editor is deliberately freeform and title is independent API data.

### 2. Compose each row from separate selection and action controls

Each persisted record will use a compact `Item` container with a dedicated title selection button and sibling `ItemActions`. `ItemActions` will contain an icon-only ghost `Button` as the `DropdownMenuTrigger`; the menu will use one `DropdownMenuGroup`, a Rename item with `PencilIcon`, and a destructive Delete item with `Trash2Icon`. The trigger receives a localized accessible name.

The current `Item asChild` whole-row button will not wrap the overflow trigger. This preserves valid HTML and independent keyboard/focus behavior. The provisional draft remains a selected, actionless item because it has no backend id.

Alternative considered: `ContextMenu`, inline title input, or a permanently visible pair of icon buttons. Rejected because the overflow menu is discoverable across pointer and keyboard input, keeps one action surface per row, and avoids layout churn.

### 3. Use controlled Dialog and AlertDialog flows outside the menu

Rename opens a controlled `Dialog` containing `FieldGroup`, `Field`, `FieldLabel`, and `Input`, with a ghost Cancel action and a default Save action. Save is disabled while pending and includes `Spinner`. Delete opens a controlled `AlertDialog` with localized irreversible-action copy, Cancel, and a destructive pending action. Menu selection closes the menu before the corresponding modal opens, following the existing `NewsArticleDetailActions` pattern.

No generic dialog wrapper will be introduced: the rename and delete flows have feature-specific state and lifecycle, and the existing similarly named confirmation helpers are feature-local.

### 4. Reuse the full PUT contract safely for rename

Because PUT remains a full personal-note mutation, rename must submit the latest content and schema version with the new title. Before opening rename for a persisted row, the Sheet will flush dirty active content. It will then ensure the target note detail is loaded through the existing detail path and use that persisted content snapshot for the title update. A failed flush or detail load prevents the dialog/update and preserves the current editor.

The successful response updates the summary title and active title state without treating title editing as a Plate document change. This reuses the existing GET/PUT paths and avoids a speculative title-only endpoint.

### 5. Delete locally and recover selection explicitly

The frontend will add `PERSONAL_NOTE_DELETE_PERMISSION` and a localized `deletePersonalNote(id)` Server Action returning `ActionResult<void>`. Delete is offered only to authorized users and is disabled while a conflicting mutation is pending.

After success, the deleted summary is removed from the loaded page and pagination counts are reconciled. Deleting an inactive note leaves the editor unchanged. Deleting the selected note invalidates its detail/autosave ownership and loads an adjacent remaining summary; if no loaded record remains but the backend count is nonzero, the first page is reloaded. If the collection is empty, creators receive a blank provisional draft and read-only users receive the existing empty state. A failed delete preserves the list and editor and surfaces the returned localized error.

Delete is an explicit destructive boundary: confirmed deletion of the selected note discards its dirty local content rather than saving content immediately before removing the record. The confirmation copy must state that unsaved changes and the note will be permanently removed.

### 6. Remove timestamp presentation, not response metadata

The rail will remove `AppTimeMetadata`, date formatting, and the second skeleton line. Response timestamps remain in DTOs because they are still backend metadata used by other persistence/reconciliation behavior. Duplicate or untitled summaries may therefore look identical; this is accepted until product evidence justifies another discriminator.

### 7. Synchronize contract documentation from the refreshed snapshot

Implementation will first replace `docs/api_mapping.json` with the updated backend-generated snapshot that adds title to both mutation request schemas. Because the generator does not encode its nullable/required semantics explicitly, the frontend will retain the user-confirmed always-present `string | null` contract. `docs/APIMAPPING.md` and `docs/personal-notes-title.md` will record that nuance, remove the old derived/immutable-title behavior, and mark delete plus title mutation as integrated.

## Risks / Trade-offs

- Full PUT rename could overwrite stale content → flush the active editor and load the target's latest detail before submitting the title change.
- A content save could restore an older title → keep the active backend-confirmed title in mutation state and refresh it from every successful create/update response.
- Nested menu and modal focus can conflict inside the Sheet → use sibling interactive controls, controlled modal state, required dialog titles, and the established menu-to-dialog sequence.
- Delete can race with save/detail work → disable conflicting actions, invalidate stale detail ownership after success, and ignore out-of-order responses.
- Removing dates reduces disambiguation for duplicate titles → accept the compact design and retain the localized untitled fallback; add another discriminator only if usage demonstrates the need.
- The OpenAPI generator omits explicit nullable/required metadata for mutation title → document the snapshot limitation and keep the confirmed frontend `string | null` contract.

## Migration Plan

1. Refresh the backend OpenAPI snapshot and synchronize the frontend API ledger.
2. Update nullable title validation, request types, permissions, and Server Actions.
3. Thread active title state through create/update persistence and returned-response reconciliation.
4. Replace summary timestamps with the compact Item/DropdownMenu composition and add controlled rename/delete dialogs.
5. Update localized dictionaries and Personal Notes behavior documentation.
6. Run scoped lint, typecheck, strict OpenSpec validation, static contract checks, and `git diff --check`.

Rollback removes the row actions and restores the previous summary presentation, but must keep the required nullable title field in POST/PUT requests while the backend contract requires it.

## Open Questions

None. Implementation proceeds with the user-confirmed backend assumption that POST and PUT require a nullable `title` field alongside the existing content fields.
