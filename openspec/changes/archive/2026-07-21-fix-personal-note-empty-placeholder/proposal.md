## Why

New Personal Notes drafts contain one pristine empty paragraph, but the current integration relies only on Plate's active-block placeholder plugin, which intentionally ignores that whole-editor empty state. The shared editor also registers the same placeholder plugin twice, making ownership of its localized configuration unclear.

## What Changes

- Show the localized Personal Notes writing hint for a completely empty editable draft through Plate's editor-level `placeholder` input.
- Keep Plate's block placeholder behavior for the active empty root paragraph after the document contains other content.
- Register exactly one `BlockPlaceholderPlugin` and remove the duplicate placeholder kit/configuration path.
- Rely on Plate's default root-block query and paragraph placeholder mapping unless Personal Notes supplies localized copy.
- Keep placeholder text presentation-only and out of Plate values and mutation payloads.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `personal-notes-sheet-only`: Extend the localized paragraph hint requirement to pristine empty drafts and clarify that shared editor composition uses a single Plate block-placeholder plugin.

## Impact

- Shared Plate plugin composition in `components/editor/editor-kit.tsx` and `components/editor/plate-editor.tsx`.
- Removal of the redundant `components/editor/plugins/block-placeholder-kit.tsx` configuration path.
- Personal Notes continues to supply existing localized `bodyPlaceholder` copy; no dictionary, API, persistence, schema-version, permission, or dependency changes.
- Depends on the freeform draft behavior established by `remove-personal-note-forced-title-layout`; it does not restore title-specific layout or placeholder behavior.
