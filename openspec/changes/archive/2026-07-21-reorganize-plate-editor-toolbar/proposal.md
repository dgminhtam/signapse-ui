## Why

The fixed Plate toolbar duplicates Link, To-do, and Toggle actions that are already available through Insert and contextual editing surfaces, adding persistent toolbar noise without adding unique content capabilities. Removing the redundant shortcuts keeps the shared toolbar easier to scan while preserving creation and conversion paths.

## What Changes

- Remove the standalone Link, To-do, and Toggle controls from the fixed toolbar.
- Keep Link available in Insert and the floating toolbar for contextual link editing.
- Keep To-do and Toggle available in Insert for new blocks and Turn Into for current-block conversion.
- Remove the now-unused To-do toolbar export and Toggle toolbar component while retaining their Plate plugins and content rendering support.

## Capabilities

### New Capabilities

- `plate-editor-toolbar-composition`: Defines which redundant actions are omitted from the fixed toolbar and which Insert, Turn Into, and floating-toolbar access paths remain available.

### Modified Capabilities

None.

## Impact

- Affected UI code: fixed toolbar composition, list toolbar exports, and the unused Toggle toolbar component.
- No editor schema, content migration, localization, dependency, plugin, Insert menu, Turn Into menu, or floating-toolbar behavior changes.
