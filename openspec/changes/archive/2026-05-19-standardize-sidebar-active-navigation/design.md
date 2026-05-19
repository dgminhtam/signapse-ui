## Context

The current shadcn sidebar primitive uses `--sidebar-accent` for hover, press, open, and active navigation states. Signapse briefly introduced `--sidebar-active` to make selected navigation stronger, but the result felt visually heavy. The user wants to revert sidebar active colors to the original shadcn/sidebar-accent behavior while keeping the improved row height, child width, and parent-child spacing.

The implementation should respect the repository rule that `components/ui/` shadcn primitives are not edited unless necessary. Sidebar density and spacing can remain controlled from `components/app-sidebar.tsx`; custom active color tokens should be removed from `app/globals.css`.

## Goals / Non-Goals

**Goals:**
- Remove dedicated `--sidebar-active` and `--sidebar-active-foreground` tokens and their `@theme inline` mappings.
- Return active, hover, and open sidebar color behavior to `sidebar-accent` / `sidebar-accent-foreground`.
- Fix sidebar navigation height/density so parent and child rows no longer feel undersized.
- Increase parent and child item presence without making the sidebar feel bulky.
- Keep icons visually aligned inside the taller row treatment.
- Add breathing room between an expanded parent item and its child list while preserving same-level item rhythm.

**Non-Goals:**
- Do not change routes, permission filtering, active route matching, or collapsed-sidebar behavior.
- Do not redesign the sidebar brand, user menu, workspace header, breadcrumbs, or page content.
- Do not change global `--accent`, `--sidebar-accent`, or non-sidebar component active/hover treatments.
- Do not introduce new dependencies or registry components.

## Decisions

1. Revert custom sidebar active tokens and use the shadcn/sidebar-accent color model.

The custom active token made the selected item too visually dominant. Reusing the primitive's `sidebar-accent` behavior keeps the sidebar calmer and closer to the original shadcn treatment, while still allowing height and spacing to carry the hierarchy.

2. Prefer application-level composition over modifying `components/ui/sidebar.tsx`.

The shadcn primitive currently provides a useful color default. This change needs Signapse-specific density and child-list width, not a generic upstream primitive change. `AppSidebar` can pass `className` to `SidebarMenuButton`, `SidebarMenuSub`, and `SidebarMenuSubButton` for height and spacing while leaving colors to the primitive where possible.

3. Keep parent and child hierarchy distinct through density and spacing instead of stronger color.

When a child is active, the parent represents the active section and the child represents the current page. The hierarchy should remain readable through row height, indentation, width, and font weight without introducing a heavy custom active color.

4. Fix row height/density as a first-class part of the change, not a side effect of color work.

The issue is not only color. Parent items at `h-8` and child items at `h-7` feel small in a 16rem admin sidebar. The implementation should explicitly set a more comfortable row density from `AppSidebar`: parent/top-level rows should use a taller treatment such as `h-9` or `h-10`, child rows should use a taller treatment such as `h-8`, and icons should stay centered in the row. A small top gap before the child list should improve hierarchy without disturbing same-level spacing.

## Risks / Trade-offs

- [Reverted active color feels too subtle] -> Prefer small typography or spacing adjustments before adding new color tokens again.
- [Parent and child both look selected] -> Keep parent context visually quieter than child current-page state through font weight and structure rather than stronger color.
- [Collapsed sidebar regresses] -> Keep existing tooltip and icon-only behavior; active classes must not rely on hidden text.
- [Primitive drift] -> Avoid editing `components/ui/sidebar.tsx` unless app-level composition cannot express the desired state cleanly.

## Migration Plan

1. Remove sidebar active tokens from `app/globals.css` and `@theme inline`.
2. Remove custom `sidebar-active` classes, rings, and shadows from `components/app-sidebar.tsx`.
3. Preserve parent/top-level item height, child item height, child-list width, icon alignment, and `SidebarMenuSub` spacing from `AppSidebar`.
4. Update `AGENTS.md` guidance so sidebar active color follows shadcn/sidebar-accent behavior and density stays in `AppSidebar`.
5. Verify with `pnpm typecheck` and visual smoke inspection of expanded/collapsed sidebar states when available.
