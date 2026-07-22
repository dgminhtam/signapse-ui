## Why

The Plate emoji picker portals to `document.body`, so selecting an emoji from the Personal Notes modal Sheet is treated as interaction outside the Sheet: the Sheet closes before Plate inserts the emoji. The standalone `/editor` route works because it has no modal portal boundary.

## What Changes

- Route the shared shadcn Popover portal through the nearest Sheet overlay container, while retaining the default body portal outside a Sheet.
- Migrate the Plate emoji picker from a direct Radix Popover import to the local shadcn Popover wrapper.
- Preserve emoji insertion, picker dismissal, focus behavior, and the existing standalone `/editor` experience.
- Keep Sheet modality and background interaction isolation intact.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `plate-editor-overlay-composition`: Extend the local wrapper and modal-boundary requirements to Plate emoji Popovers.

## Impact

- Affects `components/ui/popover.tsx` and `components/ui/emoji-toolbar-button.tsx`.
- Reuses the existing `OverlayPortalContainerProvider`; no new dependency or API change is required.
- Changes portal ownership only for shadcn Popovers rendered beneath a Sheet provider.
