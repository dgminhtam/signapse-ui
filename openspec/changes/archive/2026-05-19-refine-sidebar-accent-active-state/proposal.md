## Why

Sidebar active state currently uses `sidebar-primary`, which makes the selected navigation item feel too strong and button-like for a persistent navigation surface. The desired direction is closer to the shadcn reference: active should be only slightly stronger than hover, while expanded parents should not gain a background treatment.

## What Changes

- Replace primary-colored sidebar active treatment with a local accent-based treatment in `AppSidebar`.
- Keep hover feedback on `sidebar-accent`.
- Make the current page item visually stronger than hover through local emphasis such as font weight and an optional subtle left indicator, without introducing a new theme token.
- Remove background treatment from parent expanded state; expanded parents should only communicate openness through chevron rotation.
- Keep parent-with-active-child as contextual navigation only, not as the strongest selected state.
- Preserve the existing sidebar density/height improvements.
- Do not change `--primary`, `--accent`, `--sidebar-primary`, `--sidebar-accent`, or introduce `--sidebar-active`.

## Capabilities

### New Capabilities
- `sidebar-navigation-state-treatment`: Defines how sidebar hover, active item, expanded parent, and parent-with-active-child states should be visually distinguished.

### Modified Capabilities

## Impact

- Affected code: `components/app-sidebar.tsx`.
- Affected docs/rules: `AGENTS.md` sidebar guidance should be updated if it currently requires active sidebar items to use `sidebar-primary`.
- No API, dependency, route, or data contract changes.
