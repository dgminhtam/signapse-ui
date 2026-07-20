## Why

The Personal Notes Sheet reserves a persistent header for a repeated title, close button, and autosave status, reducing the editor's usable vertical space. The Sheet can keep its accessible dialog identity and safe autosave-close behavior while moving active-note feedback into the note rail and removing visible header chrome.

## What Changes

- Remove the visible Personal Notes Sheet header and default close button so the note rail and editor begin at the top of the Sheet.
- Keep an accessible, visually hidden Sheet title while preserving overlay-click and Escape dismissal through the existing controlled close flow.
- Show saving, saved, and save-error feedback inside the active note item instead of in a persistent Sheet header.
- Represent an unsaved first note as a localized provisional item so create progress and failures remain visible before the backend assigns an id.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `personal-notes-quick-sheet-layout`: Replace the visible header and close control with a headerless content layout while retaining an accessible hidden title and safe Sheet dismissal.
- `personal-notes-autosave`: Move localized autosave feedback from the persistent header into the active or provisional note item without changing persistence behavior.

## Impact

- Affects the Personal Notes Sheet composition and localized Personal Notes labels.
- Requires no backend contract, API action, permission, Plate editor, autosave engine, dependency, or shared `Sheet` wrapper changes.
- Updates existing requirements that currently mandate a persistent header autosave state and reachable visible close button.
