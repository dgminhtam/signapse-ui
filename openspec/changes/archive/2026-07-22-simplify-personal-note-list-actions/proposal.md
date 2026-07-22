## Why

The Personal Notes summary rail spends scarce space on timestamps while omitting the record-management actions users need. The backend mutation contract now accepts a nullable `title`, so the Sheet can present a compact title-only list with direct rename and delete workflows.

## What Changes

- Reduce each persisted summary row to its localized display title and one overflow action menu; remove visible created/last-modified metadata from the rail.
- Add a rename dialog that updates the nullable title through the existing personal-note update endpoint without changing Plate content.
- Integrate the existing personal-note delete endpoint with permission gating, destructive confirmation, localized feedback, and safe selected-note recovery.
- Update create and content-update payloads to include `title: string | null`, with new provisional drafts starting at `null` and later saves preserving the latest backend-confirmed title.
- Keep provisional drafts actionless until the first create succeeds, and keep title selection and row actions as separate keyboard-operable controls.
- Synchronize the frontend API ledger and title-behavior documentation with the updated backend contract snapshot.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `personal-notes-workspace`: Update the personal-note mutation contract, title ownership, delete integration, and permission behavior.
- `personal-notes-sheet-only`: Replace timestamped summary rows with title-only rows and add accessible rename/delete actions inside the Sheet.
- `personal-notes-autosave`: Include and preserve the nullable title in serialized create/update payloads without changing Plate value ownership.

## Impact

- `components/personal-notes-quick-sheet.tsx`: summary-row composition, title state, rename/delete dialogs, mutation lifecycle, and local list reconciliation.
- `app/lib/personal-notes/definitions.ts` and `permissions.ts`: nullable title mutation validation and delete permission.
- `app/api/personal-notes/action.ts`: updated create/update payloads and the delete Server Action.
- Vietnamese and English Personal Notes dictionary entries for actions, dialogs, validation, pending, success, and error feedback.
- `docs/api_mapping.json`, `docs/APIMAPPING.md`, and `docs/personal-notes-title.md`: refreshed backend snapshot and frontend integration notes.
- Existing radix-nova shadcn wrappers are sufficient; no dependency or shared wrapper addition is required.
