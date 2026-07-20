## Context

The fixed Plate toolbar currently renders separate Image, Video, Audio, and File buttons. The Insert dropdown already contains a Media section with Image and already reuses `MediaUrlDialog`, so Image has two entry points while the other media types have one. All four actions insert URL-backed nodes; local media upload is intentionally disabled, and document import is a separate workflow.

## Goals / Non-Goals

**Goals:**

- Give Image, Video, Audio, and File one consistent location in the Insert menu's Media section.
- Preserve the existing localized URL dialog, validation, and node insertion behavior for every media type.
- Remove the redundant fixed-toolbar buttons and their dead wrapper code.

**Non-Goals:**

- Add local file upload, API calls, or new media node types.
- Move or change HTML, Markdown, or DOCX document import.
- Change media rendering, editing, serialization, or plugin configuration.

## Decisions

1. **The Insert menu owns all media insertion entry points.** The existing Media section will contain Image, Video, Audio, and File in the same order used by the current toolbar. Keeping one entry point removes duplication without introducing another menu or component.
2. **One dialog instance handles the selected media type.** `InsertToolbarButton` will track the selected media node type and pass it with the corresponding localized title to the existing `MediaUrlDialog`. This preserves the current validation and insertion implementation instead of duplicating four dialogs.
3. **Remove code that becomes unreachable.** The fixed-toolbar media group and `MediaToolbarButton` wrapper will be removed after their callers disappear. `MediaUrlDialog` remains shared from the existing module. No new abstraction or dependency is needed.
4. **Document import remains separate.** `ImportToolbarButton` continues to import HTML, Markdown, and DOCX nodes because document import is not media URL insertion.

## Risks / Trade-offs

- **A media item could open the dialog with the wrong node type or title** → Keep the node type, localized label, and localized dialog title in one keyed media configuration used by the Insert menu.
- **Opening a dialog from a dropdown can create focus conflicts** → Close the Insert dropdown before opening the media dialog, preserving the existing Insert-to-Image transition pattern.
- **Media actions become one click deeper** → Keep all four actions together in the existing, labeled Media section so their location remains predictable.

## Migration Plan

No data migration is required. Deploy the toolbar composition change with its dead-code cleanup; rollback restores the standalone buttons because serialized media content is unchanged.

## Open Questions

None.
