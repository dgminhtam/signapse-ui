## 1. Contract And Documentation

- [x] 1.1 Refresh `docs/api_mapping.json` from the updated backend OpenAPI snapshot, confirm POST/PUT personal-note request schemas include `title` while DELETE remains available, and document that the frontend keeps the confirmed always-present nullable contract because the generator omits those semantics.
- [x] 1.2 Update the personal-note Zod mutation schema and DTO typing so create/update requests carry `title: string | null` and response summaries expose required nullable title.
- [x] 1.3 Add the `personal-note:delete` permission constant and a localized `deletePersonalNote(id)` Server Action using `fetchAuthenticated()` and `ActionResult<void>`.
- [x] 1.4 Use the API mapping sync workflow to update `docs/APIMAPPING.md` and revise `docs/personal-notes-title.md` for explicit nullable title mutation, integrated rename/delete, and title-only rail presentation.

## 2. Title Persistence

- [x] 2.1 Track the active note's latest backend-confirmed nullable title alongside editor identity and initialize provisional drafts with `null`.
- [x] 2.2 Include the active nullable title in every serialized POST/PUT persistence request and refresh it from successful responses so later content saves cannot restore a stale title.
- [x] 2.3 Split summary reconciliation from active-editor synchronization so rename responses can update the targeted record without unintended selection or Plate state changes.

## 3. Compact Summary Actions

- [x] 3.1 Add matching Vietnamese and English Personal Notes copy for the action menu, rename form, delete confirmation, pending states, successes, errors, and accessible labels.
- [x] 3.2 Replace timestamped persisted rows and two-line skeletons with compact title-only `Item` rows whose title selection control and `ItemActions` overflow trigger are valid sibling interactive elements.
- [x] 3.3 Compose the permission-gated `DropdownMenu` with Rename and destructive Delete items, hiding the trigger when neither action is permitted and keeping provisional drafts actionless.
- [x] 3.4 Implement the controlled rename `Dialog` with `FieldGroup`, `Field`, `FieldLabel`, `Input`, Cancel, pending Save, blank-to-null normalization, safe dirty-content flush, target detail loading, and full PUT submission.
- [x] 3.5 Implement the controlled delete `AlertDialog`, destructive pending action, localized feedback, stale-request invalidation, local page-count reconciliation, and selected/empty-state recovery.
- [x] 3.6 Leave one dependency-free runnable assertion check for the post-delete reconciliation helper, covering inactive deletion, selected-note fallback, and final-record outcomes.

## 4. Verification

- [x] 4.1 Run focused ESLint on all modified Personal Notes TypeScript/TSX files and the dependency-free reconciliation check.
- [x] 4.2 Run `pnpm typecheck`.
- [x] 4.3 Run strict OpenSpec validation for `simplify-personal-note-list-actions` and the repository.
- [x] 4.4 Statically verify that summary rows contain no visible date metadata or nested interactive controls, mutation payloads always include nullable title, permission-gated actions use the intended shadcn wrappers, and run `git diff --check`.
