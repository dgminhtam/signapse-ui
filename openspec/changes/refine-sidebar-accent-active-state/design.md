## Context

`AppSidebar` currently overrides shadcn sidebar defaults so active leaf and subitem links use `sidebar-primary` with `sidebar-primary-foreground`. This produces a high-contrast selected state that reads more like a primary button than a navigation selection. The desired direction is closer to the shadcn reference: hover is light, active is a slightly stronger surface, and expanded parents are communicated by the chevron only.

The project already requires shadcn neutral tokens to remain the baseline, so this change should avoid global token changes and keep the existing sidebar height/density work intact.

## Goals / Non-Goals

**Goals:**
- Make the current sidebar item feel selected without using the strong primary color treatment.
- Keep hover as `sidebar-accent`.
- Make active/current page visually stronger than hover through local composition, such as font emphasis and a subtle indicator.
- Remove background styling from parent expanded state; expanded state should only rotate the chevron.
- Update repo guidance so future sidebar work follows the softer accent-based active treatment.

**Non-Goals:**
- Do not add a new `--sidebar-active` token or alter global theme tokens.
- Do not change sidebar density, row height, child indentation, or spacing unless required by the active-state treatment.
- Do not modify `components/ui/sidebar.tsx` shadcn wrapper for an app-specific navigation treatment.
- Do not redesign nav structure, route matching, icons, labels, or workspace header.

## Decisions

1. Keep the change in `components/app-sidebar.tsx`.

   `components/ui/sidebar.tsx` is the shadcn wrapper baseline. The softer active treatment is product-specific composition, so it belongs in `AppSidebar` rather than mutating the primitive wrapper.

2. Use accent-based active styling instead of primary active styling.

   Active leaf and active subitem links should use `bg-sidebar-accent` and foreground-compatible text, with local emphasis such as `font-medium` or `font-semibold`. This preserves the neutral shadcn visual language and avoids a primary-button effect.

3. Do not add a dedicated sidebar active token.

   A new token would be clean in a larger design-system pass, but it is unnecessary here and would broaden the scope. The active state can be represented with existing `sidebar-accent` plus local composition.

4. Parent expanded state should not have a background.

   Expanded state is a disclosure state, not current-page state. The chevron rotation is enough to show openness. Parent items may retain subtle text/chevron emphasis only when they contain the active child, but they should not compete visually with the child item.

5. Optional subtle active indicator is acceptable.

   A small left rail or similar local indicator can help active feel stronger than hover without using primary color. It must remain local to `AppSidebar` and not require a new global token.

## Risks / Trade-offs

- Active may become too subtle compared with hover → Mitigate by adding font emphasis and, if needed, a subtle left indicator.
- Parent with active child may feel less highlighted → Mitigate by preserving chevron rotation/open state and optional mild text emphasis without a background.
- Extra local classes can conflict with the “prefer shadcn defaults” rule → Mitigate by keeping classes scoped to navigation state composition, not generic primitive chrome.
