# sidebar

2026-08-18 — official Base Nova registry wrapper via shadcn CLI view/dry-run with the existing overlay extension retained; verdict: migrated and typechecked.

## Changed

- `components/ui/sidebar.tsx`: replaced the remaining Radix `Slot`/`asChild` paths in `SidebarGroupLabel`, `SidebarGroupAction`, `SidebarMenuButton`, `SidebarMenuAction`, and `SidebarMenuSubButton` with the official Base UI `useRender`/`mergeProps` contract and state markers.
- Repointed the canonical Sidebar to the official `SheetContent` and `TooltipContent` wrappers; the feature-specific `SheetContentInOverlay` and `TooltipContentInOverlay` extensions remain available only to consumers that opt into a local portal container.
- Preserved sidebar cookie state, keyboard shortcut, mobile/desktop branches, and Nova layout classes.
- `components/app-sidebar.tsx`: changed brand, primary navigation, and nested navigation links to `render={<Link />}` while preserving permissions, active state, localized routes, collapsible state, and responsive behavior.
- Leftover Radix import scan is clean for `components/ui/sidebar.tsx` and `components/app-sidebar.tsx`; the only remaining Radix usage is the documented Toolbar exception.

## Left alone

- Sidebar provider state, cookie persistence, keyboard shortcut, mobile Sheet composition, desktop collapse layout, external tooltip/sheet portal extensions, permissions, and navigation data.
- `components/ui/toolbar.tsx` and `@radix-ui/react-toolbar`, which remain explicitly out of scope.

## Behavior changes

- Sidebar custom elements now use Base UI `render`; the Radix-only `asChild` prop is intentionally removed. Base UI owns the render composition while the existing overlay and focus behavior remains composed by the app.

## Verify by hand

- Confirm expanded, collapsed, and mobile sidebar states preserve active navigation, nested disclosure, cookie persistence, and `Ctrl/Cmd+B` behavior.
- Confirm brand, primary links, nested links, tooltips, focus rings, keyboard navigation, Sheet Escape/outside-click, and responsive layout at desktop/tablet/mobile widths.
