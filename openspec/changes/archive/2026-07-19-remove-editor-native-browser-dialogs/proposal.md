## Why

The editor still exposes browser-native feedback through Plate's default Image URL prompt and two blocking comment alerts. These paths bypass the application's localized, consistent modal and toast surfaces.

## What Changes

- Route Insert → Image through the existing localized media URL dialog used by the fixed Image toolbar action.
- Remove the editor call path that reaches Plate's default `window.prompt()` while preserving URL validation and `img` node insertion.
- Replace the two missing-comment-ID `alert()` guards with one localized `sonner` error toast message.
- Verify that no application path invokes native `prompt()`, `alert()`, or `confirm()` dialogs.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `plate-editor-link-only-media`: Require every Image insertion entry point to use the localized URL dialog rather than a browser-native prompt.
- `product-localization`: Require recoverable editor feedback to use dictionary-backed application surfaces instead of native browser dialogs.

## Impact

- Affected editor code: Insert toolbar media selection, shared media URL dialog composition, the obsolete Image branch in shared block transforms, and comment edit/delete guards.
- Affected localization: matching Vietnamese and English editor comment feedback keys.
- No backend contract, persisted document shape, dependency, or shadcn primitive changes.
