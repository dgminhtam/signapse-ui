## Why

Personal Notes currently persists after every one-second editing pause, producing avoidable create and update calls during a writing session. An explicit Save control with safety flushes at note and Sheet boundaries reduces routine server load while preserving the existing protection against losing dirty content.

## What Changes

- Remove the one-second timed autosave trigger; document changes remain local and dirty until an explicit or boundary save.
- Add a Personal Notes-owned Save action row above the shared Plate formatting toolbar, with the Save button disabled when no changes are pending and while persistence is running.
- Support `Ctrl+S` and `Cmd+S` inside the Personal Notes Sheet through the same save path as the button.
- Continue flushing dirty content before selecting another note, starting a new draft, or closing the Sheet; a failed flush keeps the current editor and Sheet state intact.
- Preserve serialized persistence, latest-value draining, create-id adoption, permissions, mutation payloads, title behavior, forced-title layout, placeholders, and standalone editor behavior.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `personal-notes-autosave`: Replace timer-driven autosave and save-button prohibition with explicit Save plus existing safety flush boundaries.
- `personal-notes-sheet-only`: Add the Sheet-owned save action row, keyboard shortcut, and accessible save feedback without changing the shared editor toolbar.

## Impact

- Personal Notes coordination and UI: `components/personal-notes-quick-sheet.tsx`.
- Existing persistence coordinator: `components/personal-note-autosave.ts` remains the serialized dirty-value/flush mechanism; no new persistence abstraction is required.
- Localized copy reuses the existing common Save label and Personal Notes saving, saved, and error messages.
- OpenSpec and behavior documentation for Personal Notes persistence must describe explicit and boundary saves instead of a one-second autosave.
- Backend endpoints, request/response DTOs, permissions, dependencies, shared Plate editor plugins, title extraction, and stored data do not change.
