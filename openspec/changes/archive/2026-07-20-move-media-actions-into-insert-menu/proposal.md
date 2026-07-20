## Why

The fixed Plate toolbar exposes four standalone media actions while Image is already duplicated in the Insert menu. Consolidating all media insertion actions under Insert reduces toolbar clutter and gives Image, Video, Audio, and File one consistent entry point.

## What Changes

- Add Image, Video, Audio, and File to the existing Media section of the Insert menu.
- Open the existing localized URL dialog for the selected media type without changing URL validation or node insertion behavior.
- Remove the four standalone media buttons from the fixed toolbar and remove their unused wrapper component.
- Preserve local HTML, Markdown, and DOCX document import as a separate toolbar action.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `plate-editor-link-only-media`: Require the four URL-only media actions to be exposed together in the Insert menu instead of as standalone fixed-toolbar actions.

## Impact

- Affects the Plate Insert menu, fixed-toolbar composition, and shared media URL dialog module.
- Does not change APIs, dependencies, serialized media node types, media rendering, or document import behavior.
