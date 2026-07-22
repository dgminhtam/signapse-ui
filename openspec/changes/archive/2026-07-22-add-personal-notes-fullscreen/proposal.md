## Why

The Personal Notes Sheet provides a wide editor but still limits long-form work to the side-panel width, while its full-width New note action consumes more rail space than necessary. Users need an optional focused editing surface without restoring the removed standalone `/notes` workspace.

## What Changes

- Add a compact native full-screen toggle beside the New note action in the summary rail.
- Make the New note action use the existing compact button size instead of filling the rail width.
- Keep the full-screen state synchronized with the browser Fullscreen API, including browser Escape exits and localized unavailable/failure feedback.
- Expand the complete Sheet content in full-screen mode so the note list, editor, save control, menus, and confirmation dialogs remain available.
- Remove stale specification language that requires a separate `/notes` expansion action or the superseded Save action row.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `personal-notes-quick-sheet-layout`: Add the compact rail action composition and native full-screen behavior, and remove the obsolete standalone-workspace expansion requirement.
- `personal-notes-sheet-only`: Keep the Sheet as the sole notes surface while replacing stale Save action-row requirements with the current Sheet-owned floating save control contract.
- `personal-notes-autosave`: Replace the remaining read-only reference to the removed Save action row with the current floating Save control.

## Impact

- `components/personal-notes-quick-sheet.tsx`: rail actions, Fullscreen API state, and Sheet full-screen layout.
- `app/lib/i18n/dictionaries/en.ts` and `app/lib/i18n/dictionaries/vi.ts`: localized enter, exit, unavailable, and failure labels.
- No backend API, route, permission, shared Sheet wrapper, or new dependency changes.
