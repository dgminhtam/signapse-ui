# context-menu

2026-08-18 — official Base Nova `@base-ui/react/context-menu` wrapper plus external portal-container extension; verdict: migrated and typechecked.

## Changed

- Replaced `components/ui/context-menu.tsx` with the current shadcn Base Nova Context Menu `Root`, `Portal`, `Trigger`, `Positioner`, `Popup`, group, item, submenu, checkbox, radio, separator, label, and shortcut parts.
- Replaced the block context-menu `asChild`, `modal`, `onCloseAutoFocus`, and item contracts with Base UI `render`, `finalFocus`, `onClick`, and `SubmenuRoot` composition in `components/ui/block-context-menu.tsx`.
- Added `components/ui/context-menu-content-in-overlay.tsx` with `ContextMenuContentInOverlay` and `ContextMenuSubContentInOverlay`; the block context menu uses it to preserve the existing local overlay-container behavior.
- Replaced Radix positioning variables with Base UI `--available-height` and `--transform-origin` variables.
- Leftover scan is clean for the migrated context-menu surface:
  `rg -n 'ContextMenu(Trigger|Item|SubTrigger|CheckboxItem|RadioItem|SubContent|Content)\\s+asChild|radix-context-menu|onCloseAutoFocus|onOpenAutoFocus|onEscapeKeyDown' app components -g '*.tsx'`

## Left alone

- Existing block-selection actions, permissions, touch-device bypass, submenu contents, and editor focus side effect.
- `components/ui/toolbar.tsx` and its `@radix-ui/react-toolbar` dependency; Toolbar is explicitly out of scope.
- Base UI's ContextMenu root contract does not expose Radix's `modal` prop, so no Radix-only modal compatibility prop was retained.

## Behavior changes

- Context menu opening, keyboard navigation, typeahead, submenu placement, Escape, and focus management now come from Base UI.
- The external extension preserves the local portal container without modifying the default wrapper's official body-portal behavior.

## Verify by hand

- Right-click a selectable editor block and confirm the menu opens at the pointer, with disabled/read-only targets still blocked.
- Confirm Delete, Duplicate, Indent, Outdent, Turn into, and Align actions preserve the existing editor state changes.
- Confirm submenu navigation, Escape, outside click, and focus return to the block selection after closing.
