## 1. Local afterEditable renderer

- [x] 1.1 Add `components/editor/plugins/block-selection-after-editable.tsx` as a local fork of the installed `BlockSelectionAfterEditable` renderer, preserving its keyboard, clipboard, deletion, replacement, duplicate, undo/redo, focus, and read-only logic.
- [x] 1.2 Resolve the portal host as the nearest `useOverlayPortalContainer()` value, then the local Plate container or its parent; render nothing until a client-side host exists and never fall back to `document.body`.
- [x] 1.3 Reuse public `@platejs/selection/react` helpers and add a provenance/version comment documenting the intentional portal-host delta and the manual upstream-sync rule.

## 2. Plate plugin wiring

- [x] 2.1 Update `components/editor/plugins/block-selection-kit.tsx` to register the local renderer through `render.afterEditable` while preserving `belowRootNodes`, `enableContextMenu`, selectable-block exclusions, and existing typing.
- [x] 2.2 Remove the application-level `disableSelectAll: true` override so the installed Plate default block-selection select-all transform is active.
- [x] 2.3 Confirm the change does not modify Sheet/Dialog wrappers, overlay portal context, package manifests, lockfiles, or any dependency source.

## 3. Verification

- [x] 3.1 Run `openspec.cmd validate "plate-editor-overlay-composition" --type change --strict` and resolve any proposal/spec/task validation errors.
- [x] 3.2 Run `pnpm typecheck` and fix type errors introduced by the renderer or plugin configuration.
- [x] 3.3 Run `pnpm lint` and fix lint errors introduced by the renderer or plugin configuration.
- [x] 3.4 Run a static review confirming no app-level `disableSelectAll` override remains and no local renderer portal targets `document.body`.

User-owned manual QA: verify `/editor` and Personal Notes Sheet Ctrl/Cmd+A + Delete, block-selection movement and clipboard actions, read-only guards, context menu, nested overlay providers, and focus isolation with Tab/Escape/Enter/arrows.
