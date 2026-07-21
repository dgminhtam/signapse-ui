## 1. Toolbar Cleanup

- [x] 1.1 Remove the standalone Link, To-do, and Toggle imports and controls from the shared fixed-toolbar composition.
- [x] 1.2 Remove the now-unused `TodoListToolbarButton` export and its dead imports from the shared list-toolbar module.
- [x] 1.3 Delete the unreferenced Toggle toolbar component and confirm no toolbar caller remains.

## 2. Preservation And Verification

- [x] 2.1 Statically confirm Link remains in Insert and the floating toolbar, To-do and Toggle remain in Insert and Turn Into, and LinkKit/ListKit/ToggleKit remain active.
- [x] 2.2 Run focused lint and repository typecheck for the toolbar cleanup.
- [x] 2.3 Run strict OpenSpec validation and `git diff --check`.
