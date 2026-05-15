## 1. Quick Sheet Width

- [x] 1.1 Update the personal notes quick Sheet content sizing so the right-side Sheet targets about 60vw on desktop without changing the global shadcn Sheet wrapper.
- [x] 1.2 Add responsive viewport bounds so the Sheet cannot overflow horizontally and still works on narrow desktop or zoomed browser windows.

## 2. Inner Layout Responsiveness

- [x] 2.1 Adjust the quick Sheet note rail/editor layout so the two-column layout only applies when the Sheet has enough usable width.
- [x] 2.2 Provide a stacked or compact recent-note layout for narrower Sheet widths.
- [x] 2.3 Verify the editor toolbar and writing area stay usable in the quick Sheet at common desktop widths.

## 3. Verification

- [x] 3.1 Run typecheck and scoped lint for the changed personal note components.
- [ ] 3.2 Smoke-test opening the quick Sheet, selecting recent notes, creating a new note, saving, dirty discard confirmation, and opening the full `/notes` workspace.
- [x] 3.3 Run `openspec validate refine-personal-notes-quick-sheet-width --strict`.
