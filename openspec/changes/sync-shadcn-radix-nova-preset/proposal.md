## Why

The project has moved visually toward shadcn's `radix-nova` preset, but the installed `components/ui/*` wrappers and repo guidance still contain a mix of old Vega/New York/custom sizing choices. This leaves future UI work vulnerable to drifting away from the shadcn baseline even when feature code imports the correct wrappers.

## What Changes

- Establish `radix-nova` as the authoritative shadcn preset baseline for this repo, with `base=radix`, neutral theme, lucide icons, and the generated `components/ui/*` wrapper code as the source of component chrome.
- Sync the installed shadcn wrapper files that still differ from `radix-nova`, using `pnpm dlx shadcn@latest add ... --dry-run` and `--diff` before applying or smart-merging changes.
- Treat `components/ui/*` as shadcn-managed wrapper code: app bugs are fixed at usage sites, while wrapper style changes happen through preset sync or an explicit shadcn wrapper update.
- Update `AGENTS.md` so feature and app code use shadcn default Nova sizes, radius, colors, and footer/header chrome instead of adding `h-*`, `min-h-*`, `rounded-*`, padding, text, border, background, or shadow classes to mimic another style.
- Keep app-level layout constraints allowed where they are genuinely layout-only, such as responsive width, flex/grid placement, overflow, max-height, and dense row/icon contexts.
- Preserve business behavior, Vietnamese user-facing copy, accessibility requirements, and existing shadcn-only component usage rules.

## Capabilities

### New Capabilities
- `shadcn-radix-nova-conformance`: Governs how shadcn wrapper files and app usage stay aligned to the `radix-nova` preset without local style drift.

### Modified Capabilities
- None.

## Impact

- Affected configuration: `components.json`
- Affected wrapper inventory: `components/ui/breadcrumb.tsx`, `components/ui/card.tsx`, `components/ui/drawer.tsx`, `components/ui/dropdown-menu.tsx`, `components/ui/empty.tsx`, `components/ui/select.tsx`, `components/ui/switch.tsx`, `components/ui/textarea.tsx`, `components/ui/alert-dialog.tsx`, `components/ui/dialog.tsx`, `components/ui/pagination.tsx`, `components/ui/sheet.tsx`, `components/ui/field.tsx`, `components/ui/input-group.tsx`, and `components/ui/sidebar.tsx`
- Affected guidance: `AGENTS.md`
- Affected app code: any feature/shared usage that relies on old wrapper dimensions or overrides shadcn primitive chrome with visual classes
- Verification: shadcn dry-run/diff review, TypeScript check, lint for touched files, and browser smoke checks on AI provider model picker, dialog/footer surfaces, forms, toolbar controls, sidebar, select/dropdown, sheet/drawer, and pagination
