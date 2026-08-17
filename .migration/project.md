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
- The Base Nova registry provides a counterpart for all 28 in-scope wrappers. `collapsible` matches the current Radix Nova wrapper; the other 27 are treated as custom-or-drift and will be replayed manually rather than overwritten.
- The shadcn Base UI dry-run/diff path was verified against `base-nova` without writing files or using `--overwrite`.

## Left alone

- `components/ui/toolbar.tsx` and its Plate/editor consumers remain out of scope because Toolbar is not a shadcn wrapper.
- `cmdk`, `vaul`, `react-day-picker`, charts, and other third-party integrations remain unchanged.
- The `radix-nova` configuration remains in place until the final in-scope wrapper is migrated.
- `PopoverAnchor` has no direct Base UI counterpart. Its five current editor/node consumers (`code-drawing-node`, `column-node`, `footnote-node`, `media-toolbar`, and `table-node`) are blocked pending an app-level anchor composition using Base UI positioning; the default Base UI popover wrapper will not be extended with Radix-compatible internals.

## Behavior changes

No wrapper behavior has changed yet. The approved capability difference is the `PopoverAnchor` blocker above; it must be resolved through external composition before those consumers are repointed.

## Verify by hand

Pending the wrapper migration. The final pass will cover Dialog, AlertDialog, Menu, Select, Sheet, forms, keyboard/focus behavior, responsive layouts, light/dark mode, and fullscreen overlays.
