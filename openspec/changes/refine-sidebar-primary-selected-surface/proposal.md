## Why

The accent-based sidebar active treatment is still too close to hover, while the earlier primary treatment was too strong because `sidebar-primary` behaved like an inverse CTA color. Sidebar active state needs a middle ground: a neutral selected surface that is visibly darker than hover, without bolding the item text or parent label.

## What Changes

- Define `sidebar-primary` as the selected navigation surface for sidebar active/current items, not as a high-contrast CTA color.
- Adjust `sidebar-primary` and `sidebar-primary-foreground` to neutral selected-surface values that sit between hover and strong primary button styling.
- Use `sidebar-primary` for active leaf and active child items in `AppSidebar`.
- Remove active item font emphasis; active state should be communicated by background only.
- Remove parent-with-active-child font emphasis; parent context should stay visually quiet.
- Keep parent expanded state background-free; expanded state is communicated only by chevron rotation.
- Keep hover on `sidebar-accent`.
- Treat the current logo tile use of `sidebar-primary` as temporary/sample usage; future real logo may move to an image/SVG and should not block selected navigation token semantics.
- Supersede the active-state direction from `refine-sidebar-accent-active-state`.

## Capabilities

### New Capabilities
- `sidebar-selected-surface-treatment`: Defines sidebar selected, hover, expanded parent, and parent-with-active-child visual states using neutral shadcn sidebar tokens.

### Modified Capabilities

## Impact

- Affected code: `app/globals.css`, `components/app-sidebar.tsx`.
- Affected docs/rules: `AGENTS.md` sidebar guidance must allow `sidebar-primary` for active navigation only when it is a neutral selected surface.
- Affected OpenSpec context: this change intentionally supersedes the completed-but-unarchived `refine-sidebar-accent-active-state` implementation direction.
- No API, dependency, route, or data contract changes.
