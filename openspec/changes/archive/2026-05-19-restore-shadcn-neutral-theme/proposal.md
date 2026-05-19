## Why

The current theme has drifted from a clean shadcn default: `components.json` says `baseColor: "stone"` while `app/globals.css` is mostly shadcn neutral, and recent sidebar active work exposed a leftover dark `sidebar-primary` color that does not match the app's monochrome direction. Restoring the shadcn neutral default gives the UI a predictable baseline before further visual decisions.

## What Changes

- Restore the global theme tokens in `app/globals.css` to the shadcn neutral default scaffold.
- Align `components.json` with the restored theme by setting `tailwind.baseColor` to `neutral`.
- Restore light `--sidebar-accent` to the shadcn neutral default instead of the darker custom value.
- Treat the blue/purple dark `--sidebar-primary` as part of shadcn neutral default rather than an accidental page-level color.
- Revert app-level sidebar selected/current overrides that force active items to `sidebar-primary` if they conflict with the shadcn default sidebar selected treatment.
- Update `AGENTS.md` to document that global theme tokens should remain aligned with shadcn neutral default unless a future proposal intentionally changes the theme baseline.
- Do not edit shadcn primitives in `components/ui/`.
- Do not change business UI flows, routes, permissions, data fetching, forms, or table behavior.

## Capabilities

### New Capabilities

### Modified Capabilities
- `financial-command-surface-design`: Clarifies that Signapse uses shadcn neutral default as the baseline theme token set, with future visual direction layered through semantic tokens and shared surfaces rather than ad hoc token drift.

## Impact

- Affected code/config: `app/globals.css`, `components.json`, `components/app-sidebar.tsx` if needed to remove non-default active color overrides.
- Affected guidance: `AGENTS.md`.
- Affected documentation/specs: `financial-command-surface-design` spec delta for theme baseline expectations.
- APIs/dependencies: none.
