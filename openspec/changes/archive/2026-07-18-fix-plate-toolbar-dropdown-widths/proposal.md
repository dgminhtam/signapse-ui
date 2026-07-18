## Why

Plate toolbar menus that combine a narrow trigger, `DropdownMenuContent` with `min-w-0`, and wider menu items are constrained to the trigger width by the current radix-nova dropdown wrapper. This clips labels in Insert, Line height, and Turn into menus even though the shared shadcn component is current and should remain registry-aligned.

## What Changes

- Give the Insert, Line height, and Turn into dropdown content a consumer-owned minimum width so labels remain readable.
- Remove redundant per-item minimum-width classes after width ownership moves to each menu content surface.
- Preserve the compact icon-only Align menu and the explicitly sized Table menu because they do not share the broken layout behavior.
- Keep `components/ui/dropdown-menu.tsx` unchanged and aligned with the shadcn radix-nova registry.
- Add static and build verification for the affected toolbar dropdowns without introducing a shared sizing abstraction.

## Capabilities

### New Capabilities

- `plate-toolbar-dropdown-sizing`: Defines readable, consumer-owned sizing for Plate toolbar dropdowns triggered by narrow controls while preserving intentionally compact menus and the shared shadcn wrapper.

### Modified Capabilities

None.

## Impact

- Plate toolbar consumers: `insert-toolbar-button.tsx`, `line-height-toolbar-button.tsx`, and `turn-into-toolbar-button.tsx`.
- No changes to shadcn registry components, dependencies, editor document data, routes, or APIs.
