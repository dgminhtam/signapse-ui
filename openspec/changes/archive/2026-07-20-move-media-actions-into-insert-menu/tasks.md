## 1. Consolidate Media Actions

- [x] 1.1 Add localized Image, Video, Audio, and File items to the Insert menu's Media section and open one `MediaUrlDialog` configured for the selected node type.
- [x] 1.2 Remove the standalone Image, Video, Audio, and File group and its import from the fixed toolbar while leaving document import unchanged.
- [x] 1.3 Remove the now-unused `MediaToolbarButton` wrapper and its dead imports while preserving `MediaUrlDialog` and its URL-only insertion behavior.

## 2. Verification

- [x] 2.1 Statically confirm that `MediaToolbarButton` has no remaining references, all four media types are present in the Insert menu, and `ImportToolbarButton` remains in the fixed toolbar.
- [x] 2.2 Run ESLint for the affected toolbar and media files and run the project TypeScript typecheck.
- [x] 2.3 Validate the OpenSpec change and confirm all implementation tasks are complete.
