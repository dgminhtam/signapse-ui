# dropdown-menu

2026-08-18 — official Base Nova `@base-ui/react/menu` wrapper plus external portal-container extension; verdict: migrated and typechecked.

## Changed

- Replaced `components/ui/dropdown-menu.tsx` with the current shadcn Base Nova Menu `Root`, `Portal`, `Trigger`, `Positioner`, `Popup`, group, item, submenu, checkbox, radio, separator, label, and shortcut parts.
- Replaced every DropdownMenu trigger/item `asChild` or Radix event contract with Base UI `render`, `onClick`, `closeOnClick`, and `finalFocus` composition in the migrated consumers.
- Added `components/ui/dropdown-menu-content-in-overlay.tsx` with `DropdownMenuContentInOverlay` and `DropdownMenuSubContentInOverlay`; consumers use it so the existing `OverlayPortalContainerProvider` behavior remains available without adding app logic to the default wrapper.
- Replaced Radix positioning variables with Base UI `--available-height`, `--anchor-width`, and `--transform-origin` variables.
- Removed the explicit nested menu portal around the table border menu because the Base UI content extension owns its portal.
- Leftover scan is clean for the migrated menu surface:
  `rg -n 'DropdownMenu(Trigger|Item|SubTrigger|CheckboxItem|RadioItem|SubContent|Content)\\s+asChild|radix-dropdown-menu|onCloseAutoFocus|onOpenAutoFocus|onEscapeKeyDown' app components -g '*.tsx'`

## Left alone

- Existing menu labels, disabled states, controlled open state, checkbox/radio values, submenu structure, editor focus behavior, and business/API handlers.
- `components/ui/toolbar.tsx` and its `@radix-ui/react-toolbar` dependency; Toolbar is explicitly out of scope.
- The official default Base UI portal behavior; only the external `*InOverlay` composition opts into the local fullscreen/Sheet portal container.

## Behavior changes

- Menu actions now use Base UI `onClick`; items that previously prevented Radix selection closing use `closeOnClick={false}` explicitly.
- Base UI's native menu keyboard navigation, typeahead, submenu, checkbox/radio, Escape, and focus behavior are used without Radix compatibility aliases.
- The wrapper no longer owns `useOverlayPortalContainer`; the app-specific extension owns that composition and falls back to the document body when no local container exists.

## Verify by hand

- Open representative menus in the sidebar, workspace switcher, language/theme controls, Telegram cards, news actions, asset multi-select, and editor toolbars.
- Confirm arrow-key navigation, typeahead, Enter/Space activation, Escape, outside click, disabled items, checkbox/radio state, and submenu placement.
- Confirm workspace create/rename/watchlist dialogs remain usable while their menu action is activated.
- Confirm table/editor menus and personal-notes menus mount inside the Sheet/fullscreen surface, while normal menus still mount through the default body portal.
