## 1. Fix affected Plate toolbar menus

- [x] 1.1 Move the Insert menu's `min-w-[180px]` constraint from individual items to `DropdownMenuContent`, replacing its `min-w-0` override.
- [x] 1.2 Move the Line height menu's `min-w-[180px]` constraint from individual radio items to `DropdownMenuContent`, replacing its `min-w-0` override.
- [x] 1.3 Move the Turn into menu's `min-w-[180px]` constraint from individual radio items to `DropdownMenuContent`, replacing its `min-w-0` override.

## 2. Verify scope and behavior

- [x] 2.1 Run static inspection confirming the three text-bearing menus own their width, Align and Table remain unchanged, and `components/ui/dropdown-menu.tsx` has no diff from this change.
- [x] 2.2 Run scoped lint for the affected toolbar files and run `pnpm typecheck`.
- [x] 2.3 Run `pnpm build` and strict OpenSpec validation for `fix-plate-toolbar-dropdown-widths`.
