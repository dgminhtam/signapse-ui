## Context

The radix-nova `DropdownMenuContent` wrapper intentionally sets its width from the trigger and supplies a default minimum width. Plate's Insert, Line height, and Turn into consumers override that minimum with `min-w-0` while placing `min-w-[180px]` on their children. Because the content also hides horizontal overflow, narrow triggers constrain the surface and clip those wider items. Shadcn CLI confirms the shared wrapper matches the current registry, while the current Plate registry still contains the incompatible consumer pattern.

## Goals / Non-Goals

**Goals:**

- Make the Insert, Line height, and Turn into labels readable.
- Keep width ownership on each text-bearing dropdown content surface.
- Reuse the existing `min-w-[180px]` toolbar menu convention.
- Preserve shared shadcn registry alignment and existing menu behavior.

**Non-Goals:**

- Modifying or forking `components/ui/dropdown-menu.tsx`.
- Adding a shared toolbar width component, variant, token, or dependency.
- Changing the intentionally compact Align menu or explicitly sized Table menu.
- Redesigning toolbar contents, labels, actions, or editor focus behavior.

## Decisions

### Apply the minimum width at each affected content surface

Replace `min-w-0` with `min-w-[180px]` on the three affected `DropdownMenuContent` instances, then remove the same minimum-width class from their menu items. This fixes the sizing boundary once per menu and follows the working More and Mode toolbar patterns already in the repository.

Alternative considered: use `w-[180px]`. A fixed width is unnecessary because the requirement only needs a readable lower bound.

### Keep the shadcn wrapper unchanged

The radix-nova wrapper is shared by application and editor menus and matches the current shadcn registry. Changing its trigger-width behavior would broaden the blast radius and create registry drift for a consumer-specific incompatibility.

Alternative considered: change the wrapper to content-driven width. This could alter every dropdown in the application and is rejected.

### Classify similar-looking consumers before changing them

Only menus combining `min-w-0`, text-bearing items, and wider child constraints are included. Align uses icon-only items and intentionally stays compact; Table already overrides the content width and remains unchanged.

Alternative considered: replace every `min-w-0` occurrence. That would erase intentional sizing and change unaffected menus.

## Risks / Trade-offs

- A future Plate registry sync may reintroduce the incompatible classes → Review the local diff when refreshing Plate toolbar components.
- Labels longer than the minimum width may wrap → Keep the minimum rather than a fixed maximum; revisit only if localized labels prove unreadable.
- Similar patterns may be added later → Retain a static search in verification instead of adding a premature abstraction.

## Migration Plan

Apply the three local class changes, verify the unaffected exclusions, then run static checks, lint, typecheck, and production build. Rollback is a direct revert; no data or dependency migration is involved.

## Open Questions

None.
