## Context

The shared fixed toolbar currently renders standalone Link, To-do, and Toggle buttons. The same content types already have deliberate access paths: Insert creates them, Turn Into converts selected blocks to To-do or Toggle, and the floating toolbar keeps Link editing contextual to selected text or an existing link.

The fixed toolbar is shared by Personal Notes and the standalone editor, so the cleanup must apply consistently without changing Plate schemas or existing document rendering.

## Goals / Non-Goals

**Goals:**

- Remove the three redundant controls from the fixed toolbar.
- Preserve all Insert, Turn Into, and floating-toolbar access paths.
- Delete component code that becomes unreachable after the composition change.
- Keep Link, List, and Toggle plugins active for editing and rendering existing content.

**Non-Goals:**

- Removing Link, To-do, or Toggle as editor capabilities.
- Changing menu contents, block transforms, floating-toolbar behavior, or toolbar styling.
- Reorganizing any other fixed-toolbar groups or controls.
- Removing Plate packages or plugin kits.

## Decisions

### Remove controls only from the fixed composition

Delete the Link, To-do, and Toggle imports and JSX entries from `FixedToolbarButtons`. This is the single composition point used by both editor hosts and avoids adding host-specific configuration.

### Preserve contextual and menu-based access

Keep `LinkToolbarButton` because `FloatingToolbarButtons` still uses it for contextual link interaction. Keep Link in Insert. Keep To-do and Toggle in both Insert and Turn Into so users can create new blocks or convert the current selection.

### Remove only code proven unreachable

Remove `TodoListToolbarButton` and its now-unused hook/icon imports from the shared list toolbar module because it has no caller after the fixed-toolbar edit. Delete `toggle-toolbar-button.tsx` because its component has no remaining caller. Retain list and toggle element implementations, transforms, kits, and dependencies.

## Risks / Trade-offs

- [A direct one-click conversion shortcut is removed] → Turn Into remains beside Insert in the fixed toolbar and provides the same To-do/Toggle conversion capability.
- [Link is no longer permanently visible in the fixed toolbar] → Insert remains available for link creation and the floating toolbar retains contextual link interaction.
- [Cleanup could accidentally remove content support] → Limit deletion to the two unreachable toolbar exports and statically verify LinkKit, ListKit, ToggleKit, Insert items, and Turn Into items remain.
