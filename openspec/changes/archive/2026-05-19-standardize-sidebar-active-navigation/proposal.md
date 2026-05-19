## Why

The sidebar navigation originally felt undersized and parent groups sat too close to their children, weakening the hierarchy between section and current page. After testing a stronger custom active color, the selected-state color treatment felt too heavy, so the color should return to the original shadcn/sidebar-accent behavior while keeping the improved height and spacing.

## What Changes

- Revert the custom `sidebar-active` color treatment and remove dedicated active color tokens.
- Use the original shadcn sidebar active/hover/open color behavior based on `sidebar-accent`.
- Fix sidebar navigation height/density so parent and child items no longer feel undersized.
- Increase parent and child item presence while preserving the existing same-level item rhythm.
- Add clearer separation between expanded parent items and their child list.
- Preserve shadcn sidebar composition and semantic token usage; avoid raw colors in component classes.
- Do not change navigation routes, permissions, collapsed sidebar behavior, or workspace/header controls.

## Capabilities

### New Capabilities
- `sidebar-navigation-hierarchy`: Defines sidebar navigation active color ownership and readable item density for the application sidebar navigation.

### Modified Capabilities

## Impact

- Affected code: `app/globals.css` and `components/app-sidebar.tsx`.
- Affected guidance: `AGENTS.md` should document that sidebar active color uses the shadcn/sidebar-accent behavior while density/spacing is handled in `AppSidebar`.
- APIs/dependencies: none.
