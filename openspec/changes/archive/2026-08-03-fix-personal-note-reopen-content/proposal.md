## Why

After a successful personal-note save, closing and reopening the Sheet can remount Plate from a stale initial snapshot, so a newly created note appears empty and an updated note can show older content even though the backend persisted the latest document.

## What Changes

- Retain the backend-returned `content` as the active editor's persisted remount snapshot after each successful create or update.
- Reopen the cached Personal Notes Sheet from that successful snapshot without adding a detail request.
- Keep Plate uncontrolled while the user edits; do not mirror every document mutation through React state.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `personal-notes-autosave`: Require a successfully saved active note to remount with the backend-returned content after the Sheet closes and reopens.

## Impact

- `components/personal-notes-quick-sheet.tsx`: successful-save state synchronization.
- Personal-note create and update response handling; no API contract, endpoint, dependency, or shared Plate editor change.

