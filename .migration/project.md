# migrate-shadcn-wrappers-to-base-ui

2026-08-17, baseline and dependency setup completed; wrapper migration is in progress.

## Changed

- Upgraded `shadcn` from `4.13.0` to `4.18.0`.
- Added `@base-ui/react` `1.7.0` to the manifest and lockfile.
- Kept `radix-ui` `1.4.3` and `@radix-ui/react-toolbar` `1.1.15` during progressive migration.
- Baseline typecheck passed.
- Baseline lint passed with 0 errors and 26 existing warnings.
- Baseline production build passed with network access for Google Fonts.
- Inventory: 28 in-scope shadcn wrappers, 1 out-of-scope Toolbar wrapper, and 117 `asChild` occurrences outside `components/ui`.
- The leftover scan currently reports 29 direct Radix-backed UI files: 28 in-scope shadcn wrappers plus the Toolbar exception.

## Left alone

- `components/ui/toolbar.tsx` and its Plate/editor consumers remain out of scope because Toolbar is not a shadcn wrapper.
- `cmdk`, `vaul`, `react-day-picker`, charts, and other third-party integrations remain unchanged.
- The `radix-nova` configuration remains in place until the final in-scope wrapper is migrated.

## Behavior changes

None yet. Wrapper migration and consumer behavior review are pending.

## Verify by hand

Pending the wrapper migration. The final pass will cover Dialog, AlertDialog, Menu, Select, Sheet, forms, keyboard/focus behavior, responsive layouts, light/dark mode, and fullscreen overlays.
