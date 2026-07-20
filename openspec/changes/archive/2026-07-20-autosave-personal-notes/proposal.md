## Why

The Personal Notes Sheet currently shows backend summaries beside a transient Plate playground value, so edits cannot load or persist the user's actual notes. The backend now exposes versioned JSON note content, and Plate provides `onValueChange` as the natural persistence boundary without controlling every keystroke.

## What Changes

- Load selected personal-note detail JSON into the shared Plate editor while preserving Plate ownership of editor state, selection, history, and normalization.
- Autosave meaningful editor value changes after a short debounce through `POST /me/notes` for a new draft and `PUT /me/notes/{id}` for an existing note.
- Serialize saves so only one mutation is in flight, retain the newest pending value, and flush pending work before note switches or Sheet close.
- Display localized inline loading, saving, saved, unsupported-version, and save-error states without adding a Save button or routine save toasts.
- Adopt Plate JSON content schema version `1`, validate mutation requests, and refuse to autosave unsupported note versions.
- Gate creation and editing with `personal-note:create` and `personal-note:update`; read-only users can still inspect permitted notes.
- Update the personal-note API mapping entries after the frontend detail/create/update integration is complete.

## Capabilities

### New Capabilities
- `personal-notes-autosave`: Debounced, version-aware Plate JSON persistence, mutation ordering, recovery states, and no-button autosave behavior for the Personal Notes Sheet.

### Modified Capabilities
- `personal-notes-sheet-only`: Replace the transient, non-interactive editor behavior with selectable persisted note detail and Sheet-owned autosave while retaining the Sheet-only product surface.
- `personal-notes-workspace`: Align the personal-note contract from legacy `contentHtml` and explicit saving to versioned JSON content and automatic persistence, and remove requirements for the intentionally unavailable full `/notes` workspace.

## Impact

- Affected UI: shared `PlateEditor` inputs and the header Personal Notes Sheet; the `/editor` playground remains non-persistent.
- Affected data layer: personal-note DTOs, permission constants, request validation, and authenticated detail/create/update Server Actions.
- Affected backend APIs: `GET /me/notes/{id}`, `POST /me/notes`, and `PUT /me/notes/{id}` using `{ content, contentSchemaVersion }`.
- Affected documentation: personal-note integration status in `docs/APIMAPPING.md`.
- Existing dependencies are sufficient (`platejs`, `use-debounce`, Zod); no new package is required.
