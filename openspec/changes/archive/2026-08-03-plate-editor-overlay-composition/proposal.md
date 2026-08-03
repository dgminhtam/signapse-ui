## Why

Plate's block-selection renderer mounts its shadow input into `document.body`. When the editor is rendered inside the Personal Notes Sheet, that input sits outside the Sheet's focus boundary, so `Ctrl/Cmd+A` followed by Delete can fail or close the overlay instead of deleting the selected blocks. The current `disableSelectAll: true` workaround avoids the faulty path by falling back to native editor selection, but it removes Plate's block-selection behavior for select-all. We need to keep that behavior while making the shadow input local to the active editor/overlay.

## What Changes

- Add a local `afterEditable` renderer based on the installed Plate block-selection renderer.
- Keep Plate's block-selection keyboard, clipboard, deletion, duplicate, undo/redo, and focus behavior synchronized with the upstream renderer.
- Portal the shadow input to the nearest existing overlay portal container (Sheet/Dialog boundary), falling back to the local Plate editor container rather than `document.body`.
- Remove the application-level `disableSelectAll: true` override so Plate's normal block-selection select-all behavior is restored.
- Preserve the existing block-selection visual renderer, context-menu behavior, and selectable-block exclusions.
- Add an explicit maintenance note and verification task for re-syncing the local renderer when `@platejs/selection` or `platejs` is upgraded.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `plate-editor-overlay-composition`: require block-selection's shadow input and select-all interactions to stay inside the nearest editor/overlay boundary while preserving existing Plate block-selection behavior.

## Impact

- Affected code: `components/editor/plugins/block-selection-kit.tsx` and a new local block-selection `afterEditable` renderer under `components/editor/plugins/`.
- Reused code: the existing `useOverlayPortalContainer` Sheet/Dialog boundary and Plate's public block-selection helpers; no new overlay abstraction is needed.
- Dependencies: no package, dependency, or lockfile changes.
- User-visible behavior: `Ctrl/Cmd+A` plus Delete works in both `/editor` and the Personal Notes Sheet without sacrificing block-selection operations or closing the Sheet.
- Maintenance: the local renderer is an intentional small upstream fork and must be compared with the installed Plate renderer on future Plate selection/core upgrades.
