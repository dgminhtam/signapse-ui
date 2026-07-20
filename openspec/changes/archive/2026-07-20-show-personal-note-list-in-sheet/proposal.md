## Why

The personal-notes Sheet currently renders only the shared Plate editor with demo content, while the updated backend now exposes a paged personal-note summary list. Showing that list first gives users visibility into their existing notes without prematurely coupling the editor to detail or mutation contracts.

## What Changes

- Add a read-only personal-note summary rail to the existing header Sheet while keeping the shared Plate editor unchanged.
- Load `GET /me/notes` lazily when the Sheet opens, using local page and size parameters without a sort query parameter.
- Show loading, empty, error/retry, and incremental load-more states inside the Sheet.
- Display each summary using its id and update/create timestamp because the list contract does not expose title or content.
- Add only the frontend summary DTO and authenticated list action required for this read path.
- Keep personal-note detail, selection, editor binding, create, update, delete, and schema-version handling out of scope.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `personal-notes-sheet-only`: Allow the permission-gated Sheet to load and display the backend personal-note summary list while retaining a transient, unbound shared Plate editor.

## Impact

- Affected API boundary: new read-only personal-note definitions and `GET /me/notes` action using the existing authenticated transport and page query helper.
- Affected UI: `components/personal-notes-quick-sheet.tsx` gains a responsive summary rail and Sheet-local request states.
- Affected localization: Vietnamese and English personal-note list, loading, empty, retry, timestamp, and load-more copy.
- Affected documentation: `docs/APIMAPPING.md` will mark only the personal-note list endpoint as integrated.
- No new dependency, standalone `/notes` route, shared Plate editor change, or personal-note mutation is introduced.
