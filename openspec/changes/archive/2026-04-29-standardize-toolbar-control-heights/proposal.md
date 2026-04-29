## Why

List toolbars currently mix default shadcn control heights with ad hoc `size="sm"` and `h-*` overrides, so search inputs, primary buttons, sort selects, and page-size selects do not share the same visual baseline. This weakens toolbar rhythm after the main-card cleanup made these controls more exposed.

## What Changes

- Standardize primary list-toolbar controls on the default shadcn primitive height used by `Input`, `Button`, and `SelectTrigger`.
- Remove toolbar-level height overrides such as `h-10`, `h-8`, or `size="sm"` when the control is part of the primary list toolbar row.
- Keep width-only overrides such as `w-full sm:w-[200px]` where they define responsive layout instead of visual height.
- Keep compact button/select sizes for row actions, icon-only controls, dialogs, pagination buttons, and other contexts where compact density is intentional.
- Update `AGENTS.md` so future list-toolbar work checks height consistency against shadcn defaults.

## Capabilities

### New Capabilities
- `shared-toolbar-control-sizing`: Defines how app-level toolbar controls compose shadcn primitives without overriding their default height.

### Modified Capabilities
- None.

## Impact

- Affected code: `components/sort-select.tsx`, `components/app-pagination-controls.tsx`, `components/app-select-page-size.tsx` as needed, `components/app-list-toolbar.tsx`, list pages that pass height-related `triggerClassName` overrides, and `AGENTS.md`.
- Affected UX: list toolbar controls align to a consistent height and baseline with search inputs and primary buttons.
- APIs: no backend API, route, DTO, auth, or query-parameter behavior changes.
