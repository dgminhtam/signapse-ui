## Why

The Personal Notes Sheet can create the first note only when the collection is empty, so a creator has no way to start another note after summaries exist. The Sheet needs one explicit create action that reuses the existing provisional-draft and autosave flow without restoring removed header chrome.

## What Changes

- Add a localized `Ghi chú mới` action to the summary rail for users with `personal-note:create`.
- Flush the current editor before starting a new blank provisional draft, preserving the current note when persistence fails.
- Keep persisted summaries visible while a provisional draft is active, then replace the provisional item with the created summary after autosave succeeds.
- Keep note creation deferred until the draft changes; do not create empty backend records.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `personal-notes-sheet-only`: Allow authorized creators to start an additional personal-note draft from the Sheet summary rail while retaining existing summaries and autosave behavior.

## Impact

- Affects the Personal Notes Sheet composition and transition handling in `components/personal-notes-quick-sheet.tsx`.
- Reuses the existing localized draft label, Plate empty value, permission checks, autosave controller, and personal-note create action.
- No backend contract, route, dependency, shared shadcn primitive, or standalone editor behavior changes.
