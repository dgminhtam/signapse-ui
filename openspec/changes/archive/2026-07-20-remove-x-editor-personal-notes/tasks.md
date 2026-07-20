## 1. Reduce Personal Notes To An Empty Sheet

- [x] 1.1 Simplify `PersonalNotesQuickSheet` to the localized header trigger, empty `SheetContent`, accessible title, and standard close behavior with no controlled state, data calls, editing controls, fullscreen controls, or placeholder copy.
- [x] 1.2 Update the protected app layout to gate the no-prop Sheet with `personal-note:read` and remove create/update permission wiring.

## 2. Remove Unreachable Personal-Note And Editor Source

- [x] 2.1 Delete `components/editor-x/**`, `PersonalNoteEditor`, `PersonalNoteSaveBar`, and `PersonalNoteDiscardDialog` after their callers have been removed.
- [x] 2.2 Delete the now-unreferenced frontend personal-note action, definitions, and feature permission modules while leaving backend API mapping documentation unchanged.
- [x] 2.3 Remove the editor dictionary subtree and personal-note strings used only by deleted UI/actions from both locale dictionaries while retaining the Sheet trigger copy and matching dictionary shapes.

## 3. Remove X-Editor Dependencies

- [x] 3.1 Remove `lexical` and every direct `@lexical/*` dependency from `package.json`, regenerate `pnpm-lock.yaml`, and retain packages or shared shadcn wrappers still referenced by the out-of-scope Plate/app source.

## 4. Verify The Removal

- [x] 4.1 Run static searches across active application source and package metadata to confirm no x-editor, editor adapter, personal-note workflow, Lexical import, or removed localization references remain; archived OpenSpec history is allowed.
- [x] 4.2 Run strict OpenSpec validation for `remove-x-editor-personal-notes`, scoped ESLint for changed source, and full `pnpm typecheck`.
- [x] 4.3 Run the production build to verify the simplified Sheet and dependency graph compile successfully.
- [x] 4.4 Sync active OpenSpec capabilities so no main spec requires the removed x-editor or promises preservation of a separate Lexical editor.

Verification notes: strict OpenSpec validation, scoped ESLint, static searches, diff checks, and the Next.js production compilation passed. Full `pnpm typecheck` and the build's TypeScript gate were run and remain blocked by the pre-existing `initialFocus` prop in `components/ui/date-node.tsx`, which targets react-day-picker 10.0.1 and belongs to the out-of-scope Plate stack. The file and dependency version are unchanged from HEAD, the lockfile does not change react-day-picker, and no removed x-editor or personal-note source appears in the error output.
