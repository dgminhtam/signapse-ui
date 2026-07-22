## 1. Compact Rail Actions

- [x] 1.1 Add localized enter-full-screen, exit-full-screen, unavailable, and failure copy to both Personal Notes dictionaries.
- [x] 1.2 Replace the full-width New note control with the built-in standard icon-button size and add a matching icon-only full-screen toggle that remains available without create permission.

## 2. Native Full-Screen Behavior

- [x] 2.1 Add a `SheetContent` ref, browser-derived full-screen state, `fullscreenchange` synchronization, and the Market Charts request/exit error path to the Personal Notes Sheet.
- [x] 2.2 Apply Personal Notes-owned full-screen width, border, and shadow overrides so the complete Sheet fills the viewport without modifying the shared Sheet wrapper.
- [x] 2.3 Preserve the existing editor instance, floating Save behavior, dirty-boundary flushes, keyboard shortcut, summary list, and nested menu/dialog portal behavior across full-screen transitions.

## 3. Verification

- [x] 3.1 Run Prettier and focused ESLint checks for the changed TypeScript and TSX files.
- [x] 3.2 Run `pnpm typecheck`, `openspec validate add-personal-notes-fullscreen`, and static searches confirming no implementation restores `/notes` navigation or a Save action row.

User-owned manual QA: In a supported desktop browser, verify toggle entry/exit, Escape exit while the Sheet stays open, read-only visibility, editor scrolling, and rename/delete overlays in full-screen mode.
