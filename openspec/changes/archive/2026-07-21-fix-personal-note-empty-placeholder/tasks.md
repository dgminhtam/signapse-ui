## 1. Consolidate Plate placeholder composition

- [x] 1.1 Remove `BlockPlaceholderKit` from `EditorKit` and delete the redundant kit file.
- [x] 1.2 Configure exactly one `BlockPlaceholderPlugin` in `PlateEditor`, preserving the existing styling, using localized paragraph copy when supplied, and relying on Plate's default root-block query.

## 2. Cover the pristine empty editor

- [x] 2.1 Pass `bodyPlaceholder` to the Plate editor-level placeholder only for editable content so a new blank Personal Notes draft displays its localized hint without exposing that hint in read-only mode.
- [x] 2.2 Preserve the existing public `PlateEditor` inputs, freeform document value, active empty paragraph behavior, and persistence-neutral change callback.

## 3. Verify the focused change

- [x] 3.1 Run a static search confirming one block-placeholder plugin registration remains and no `BlockPlaceholderKit` references remain.
- [x] 3.2 Run focused lint for the changed editor files and run `pnpm typecheck`.
- [x] 3.3 Run strict OpenSpec validation and confirm all change tasks are complete.
