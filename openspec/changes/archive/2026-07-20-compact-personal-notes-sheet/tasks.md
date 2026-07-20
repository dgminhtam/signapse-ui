## 1. Compact Sheet Composition

- [x] 1.1 Configure the Personal Notes `SheetContent` to hide its default close button, remove the visible header section, and retain the localized `SheetTitle` as `sr-only` content.
- [x] 1.2 Remove header-only imports and layout reservations while preserving the existing controlled `onOpenChange` autosave flush path.

## 2. Note-Scoped Autosave Feedback

- [x] 2.1 Add localized English and Vietnamese copy for the provisional first-note item.
- [x] 2.2 Render saving, saved, and error feedback only inside the selected persisted summary item, preserving timestamp metadata and live-region semantics.
- [x] 2.3 Render a provisional selected item for an editable note without an id and replace it through the existing create-success summary update without adding per-note status state.

## 3. Verification

- [x] 3.1 Run static searches confirming the visible Personal Notes header is removed, `components/ui/sheet.tsx` is unchanged, and no explicit Save control or custom blur/outside-click listener was introduced.
- [x] 3.2 Run `openspec validate compact-personal-notes-sheet --strict` and resolve any change artifact errors.
- [x] 3.3 Run `pnpm typecheck` and `pnpm lint`, resolving errors introduced by the change.
- [x] 3.4 Restore one deterministic Personal Notes Sheet content id shared by the trigger and content, then verify the affected files.

User-owned manual QA: confirm click-outside and Escape dismissal, failed-save retention, focus restoration, keyboard operation, and the compact layout at narrow widths or 200% zoom.
