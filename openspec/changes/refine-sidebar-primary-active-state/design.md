## Context

Signapse uses shadcn/ui with CSS variables, Tailwind CSS v4, `components.json` set to `tailwind.baseColor: neutral`, and repo guidance that global theme tokens should stay on the shadcn neutral baseline unless a proposal explicitly changes them.

The current sidebar is already app-composed in `components/app-sidebar.tsx` and uses `components/ui/sidebar.tsx` primitives. Density and parent/child spacing have been tuned in `AppSidebar`; shadcn primitives should remain untouched. The open issue is color hierarchy: active navigation needs to be stronger, but the dark `--sidebar-primary` token currently uses the shadcn sidebar default blue/purple value `oklch(0.488 0.243 264.376)`, which conflicts with the neutral Signapse direction when used as selected navigation chrome.

## Goals / Non-Goals

**Goals:**
- Make `sidebar-primary` neutral-consistent in light and dark themes before using it for active navigation.
- Use `sidebar-primary` only for the actual current-page item.
- Keep hover, open parent, and parent-with-active-child states on `sidebar-accent`.
- Preserve `sidebar-ring` for focus-visible keyboard accessibility.
- Preserve current row height, radius, child indentation, right-side child width expansion, and `py-1` child-list breathing room.
- Update `AGENTS.md` so future sidebar work follows the finalized state hierarchy.

**Non-Goals:**
- Do not introduce a new brand color palette.
- Do not change global `primary`, `accent`, chart tokens, page layout, routes, permissions, or active route matching.
- Do not edit `components/ui/sidebar.tsx` or any other shadcn primitive.
- Do not redesign the sidebar brand, user menu, workspace switcher, app header, or breadcrumbs.

## Decisions

1. Normalize `sidebar-primary` instead of using the shadcn blue/purple dark default.

The blue/purple value is documented in shadcn sidebar examples, but it does not match Signapse's current neutral baseline. If `sidebar-primary` becomes the active navigation background, the token itself must be neutral-consistent. The dark value should align with the app's neutral primary/foreground relationship rather than chart/preset color.

2. Use state ownership instead of one color for every interaction.

Sidebar states should have a clear hierarchy:

| State | Token treatment | Rationale |
| --- | --- | --- |
| Hover | `sidebar-accent` | Lightweight feedback, does not compete with active. |
| Focus-visible | `sidebar-ring` | Accessibility state, distinct from active/current page. |
| Parent open | `sidebar-accent` | Expanded group context, not current page. |
| Parent has active child | `sidebar-accent` + font/chevron emphasis | Parent is context, child is current page. |
| Active item | `sidebar-primary` + `sidebar-primary-foreground` | Strongest navigation signal within sidebar namespace. |

3. Keep parent contextual emphasis weaker than child active state.

When a child route is active, the parent should help users understand the section but should not look like the selected page. Parent contextual styling should stay on `sidebar-accent`, use readable font weight and chevron emphasis, and avoid `sidebar-primary`.

4. Implement styling at `AppSidebar` composition level.

The shadcn sidebar primitive exposes `isActive`, `data-active`, `data-state=open`, and className composition. This change can be implemented by class overrides in `components/app-sidebar.tsx` and token values in `app/globals.css`, without changing `components/ui/sidebar.tsx`.

5. Keep focus-visible unchanged.

Focus-visible must continue to use `sidebar-ring` so keyboard users can distinguish "currently focused" from "currently selected". Changing focus to primary would blur that distinction.

## Risks / Trade-offs

- [Active becomes too strong in dark mode] -> Keep `sidebar-primary` neutral and avoid shadows/rings; active should be a filled row, not an alert state.
- [Parent and child both look selected] -> Parent stays accent-only while child active uses primary.
- [Hover on active item becomes visually noisy] -> Ensure active item remains primary on hover or only uses a subtle primary hover variant if needed.
- [Theme baseline drift returns] -> Update `AGENTS.md` to require proposal-backed changes for sidebar token deviations.
- [Collapsed sidebar behavior regresses] -> Preserve existing `tooltip`, icon-only collapse, and route matching behavior while only changing color classes.

## Migration Plan

1. Update `app/globals.css` dark `--sidebar-primary` to a neutral-consistent value and ensure foreground contrast remains readable.
2. Update `components/app-sidebar.tsx` active classes so top-level active items and active child items use `bg-sidebar-primary text-sidebar-primary-foreground`.
3. Keep expandable parent open/context states on `bg-sidebar-accent text-sidebar-accent-foreground`, including parents with an active child.
4. Keep `focus-visible:ring-*` behavior untouched through existing sidebar primitive classes.
5. Update `AGENTS.md` sidebar guidance to replace the old "do not force selected row to sidebar-primary" rule with the new explicit hierarchy.
6. Verify with typecheck, targeted lint, grep checks for token/class usage, and a visual smoke check in light/dark expanded and collapsed sidebar states.

## Open Questions

- None. The state hierarchy and token ownership are decided by this proposal.
