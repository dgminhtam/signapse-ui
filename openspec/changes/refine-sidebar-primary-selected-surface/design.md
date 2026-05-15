## Context

The sidebar currently has three visual pressures:

- Using `sidebar-accent` for active makes current-page state too close to hover.
- Using the default `sidebar-primary` as a high-contrast inverse color makes active feel too strong.
- Adding `font-semibold` to active items and parent labels creates an extra emphasis channel the user does not want.

The refined direction is to make `sidebar-primary` the neutral selected surface for sidebar navigation. This keeps state semantics clear: `sidebar-accent` is hover, `sidebar-primary` is selected/current, focus remains `sidebar-ring`, and expanded parent state is shown by chevron rotation only.

## Goals / Non-Goals

**Goals:**
- Make active sidebar items visibly stronger than hover through background color only.
- Keep active item text weight the same as normal sidebar items.
- Keep parent items visually quiet when expanded or when they contain the active child.
- Use `sidebar-primary` as a neutral selected surface, not a CTA/inverse primary surface.
- Preserve existing sidebar row height, spacing, indentation, and shadcn wrapper boundaries.

**Non-Goals:**
- Do not add `--sidebar-active` or any new global token.
- Do not change global `--primary` or `--accent`.
- Do not redesign the sidebar logo; the current logo tile can remain temporary sample usage until replaced by an image/SVG.
- Do not patch `components/ui/sidebar.tsx` for this app-specific state treatment.
- Do not change route matching, navigation structure, permissions, or labels.

## Decisions

1. Reinterpret `sidebar-primary` as selected navigation surface.

   `sidebar-primary` should sit one step stronger than `sidebar-accent`, using neutral gray values. It should not use high-contrast black/white CTA styling for active navigation.

2. Keep active styling in `AppSidebar`.

   Active leaf and active child items should explicitly use `bg-sidebar-primary` and `text-sidebar-primary-foreground`. Because shadcn sidebar defaults add `data-active:font-medium`, `AppSidebar` should override active font weight back to normal where necessary.

3. Remove font emphasis from active and contextual parent states.

   Active/current should be communicated by selected background. Parent expanded and parent-with-active-child states should not use `font-semibold` or a background. The chevron rotation is enough to communicate expanded state.

4. Update theme tokens narrowly.

   Only `--sidebar-primary` and `--sidebar-primary-foreground` should change in `app/globals.css`. Suggested neutral values:

   - Light: `--sidebar-primary: oklch(0.922 0 0)`, `--sidebar-primary-foreground: oklch(0.145 0 0)`
   - Dark: `--sidebar-primary: oklch(0.34 0 0)`, `--sidebar-primary-foreground: oklch(0.985 0 0)`

   These values make active stronger than hover without becoming a button-like inverse state.

5. Supersede the previous accent-active guidance.

   `AGENTS.md` should no longer forbid `sidebar-primary` for selected navigation. It should instead define `sidebar-primary` as a neutral selected surface and keep hover on `sidebar-accent`.

## Risks / Trade-offs

- Logo tile becomes softer while it still uses `sidebar-primary` → Acceptable because the current logo treatment is temporary/sample usage and will later move to image/SVG branding.
- Active may still feel too close to hover on some displays → Mitigate by tuning only `--sidebar-primary` neutral lightness, not by adding font weight.
- Token semantics differ from generic primary button semantics → Mitigate by documenting that `sidebar-primary` is scoped to the sidebar namespace and represents selected navigation.
- Multiple active sidebar changes exist at once → Mitigate by documenting this change as superseding `refine-sidebar-accent-active-state` and applying it after that completed implementation.
