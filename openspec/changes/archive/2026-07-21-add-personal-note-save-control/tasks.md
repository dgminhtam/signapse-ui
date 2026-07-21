## 1. Explicit Save Coordination

- [x] 1.1 Remove the 1000 ms debounce import, scheduling, and cancellation from `components/personal-notes-quick-sheet.tsx` so Plate document changes only update the existing dirty revision coordinator.
- [x] 1.2 Add one Sheet-owned save handler that reuses `flushCurrentEditor()` for the visible Save control and retry behavior without changing mutation payloads or the serialized coordinator.
- [x] 1.3 Add a `SheetContent` capture-phase handler for `Ctrl+S` and `Cmd+S` that prevents browser Save Page only for an editable supported note and invokes the same save handler.

## 2. Save Action Row And Feedback

- [x] 2.1 Restructure the editable detail pane with a non-scrolling action row above the shared Plate toolbar and keep the Plate editor in its own scroll region.
- [x] 2.2 Render the localized standard Save button with `aria-keyshortcuts`, enable it only for dirty/error state, and disable it for idle/saved/saving state with a spinner while pending.
- [x] 2.3 Move active saving, saved, and error feedback from selected/provisional rail items into one action-row status or alert region, and omit the action row for read-only or unsupported notes.

## 3. Safety Boundaries And Documentation

- [x] 3.1 Verify note selection, New Note, and Sheet close still await the existing flush path, skip mutations when clean, and abort their transition when persistence fails.
- [x] 3.2 Update Personal Notes behavior documentation and API-mapping integration notes to describe explicit Save plus safety flushes without changing title, editor-layout, or backend-contract behavior.

## 4. Verification

- [x] 4.1 Run focused lint for the touched Personal Notes files and resolve in-scope findings.
- [x] 4.2 Run `pnpm typecheck` and resolve in-scope type errors.
- [x] 4.3 Run `openspec validate --all --strict` and confirm the change remains valid and apply-ready.
- [x] 4.4 Use a static search to confirm Personal Notes no longer imports or schedules the 1000 ms debounce and that shared `PlateEditor` / `FixedToolbarButtons` contain no Personal Notes Save control.

User-owned manual QA: confirm typing past one second sends no mutation; button and `Ctrl/Cmd+S` save once; dirty note switch, New Note, and Sheet close flush once; failed persistence blocks the transition and leaves Save retryable; read-only notes and the standalone editor remain unchanged.
