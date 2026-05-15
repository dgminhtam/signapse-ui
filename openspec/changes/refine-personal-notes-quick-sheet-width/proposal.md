## Why

The personal notes quick Sheet currently becomes too narrow for the two-column note rail and rich editor layout, causing the editor toolbar and writing area to collapse awkwardly on desktop. Instructors need the quick note surface to stay usable while the current app page remains visible behind it.

## What Changes

- Increase the personal notes quick Sheet to a wider desktop surface around 60% of the viewport.
- Keep the Sheet bounded so it remains a quick overlay, not a replacement for the full `/notes` workspace.
- Adjust the quick Sheet inner layout so the note rail and editor only render side-by-side when there is enough horizontal space.
- Preserve the existing quick Sheet behavior: open from the header, keep the current page mounted behind it, support recent note selection, create/update save, dirty discard confirmation, and the `Mở rộng` action to `/notes`.
- Do not change the backend API contract, personal-note permissions, saved HTML flow, or full `/notes` workspace behavior.

## Capabilities

### New Capabilities
- `personal-notes-quick-sheet-layout`: Covers the desktop width, responsive inner layout, and visual usability of the personal notes quick Sheet.

### Modified Capabilities

## Impact

- Affected UI: `components/personal-notes-quick-sheet.tsx`.
- Affected shared editor behavior only if layout props need minor adjustment: `components/personal-note-editor.tsx`.
- No API, DTO, permission, dependency, or database impact.
