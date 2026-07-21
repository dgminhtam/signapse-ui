## Why

The Plate Insert dropdown is portaled to `document.body`, so Radix Sheet's modal scroll lock treats mouse-wheel input over the menu as outside the Sheet and prevents scrolling. The editor page works because it has no modal Sheet boundary, leaving the same menu behavior inconsistent across its two hosts.

## What Changes

- Provide the active Sheet content element as the overlay portal container through a small React context.
- Make shared dropdown content portal into that container when rendered inside a Sheet and retain the default body portal elsewhere.
- Preserve the Insert menu's existing maximum height and native vertical overflow behavior without adding `ScrollArea`.
- Preserve Sheet modality, focus isolation, and background scroll locking.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `plate-editor-overlay-composition`: Require Plate dropdown menus hosted inside a modal Sheet to remain scrollable by portaling within the Sheet content boundary, while standalone dropdowns retain their default portal behavior.

## Impact

- Affected shared UI composition: Sheet content, dropdown menu content, and a small overlay-container context.
- Affected user flow: scrolling the Plate Insert menu inside Personal Notes Quick Sheet.
- No API, localization, dependency, Plate plugin, or editor content changes.
