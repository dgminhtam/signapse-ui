## Context

The repository has 132 files under `components/ui`, including 28 shadcn wrappers backed by the unified `radix-ui` package. `toolbar.tsx` uses `@radix-ui/react-toolbar` directly and is outside this change. App code has 117 `asChild` occurrences outside `components/ui`, so changing wrapper contracts requires a deliberate consumer sweep.

The project currently declares `radix-nova` in `components.json`. Dialog, Sheet, menu, Select, and other wrappers also contain repository-specific portal or composition behavior. The migration must adopt the official Base UI shadcn implementations without turning those wrappers into a second custom primitive library.

## Goals / Non-Goals

**Goals:**

- Upgrade the shadcn CLI/package and lock the implementation baseline used for the migration.
- Add `@base-ui/react` explicitly and migrate only shadcn wrappers to the latest official Base UI registry output available at that baseline.
- Preserve the existing Nova visual contract and feature/business behavior.
- Move consumers to the native Base UI shadcn contracts rather than preserving Radix-specific props.
- Keep app-required extensions outside the default Base UI wrapper implementation.
- Provide incremental verification and a rollback boundary for every wrapper dependency group.
- Remove `radix-ui` after the last in-scope wrapper is migrated while retaining the out-of-scope Toolbar dependency.

**Non-Goals:**

- Migrating `@radix-ui/react-toolbar`, Plate/editor toolbar behavior, `cmdk`, `vaul`, `react-day-picker`, charts, or other non-shadcn primitives.
- Redesigning Nova colors, spacing, typography, radius, layout, or overlay chrome.
- Preserving Radix-only semantics when the official Base UI shadcn wrapper intentionally has different behavior.
- Adding a runtime feature flag or a permanent Radix compatibility layer.
- Changing APIs, permissions, form validation, persistence, or other product logic.

## Decisions

### Use a fixed latest baseline

At implementation start, upgrade shadcn to the latest available version, add `@base-ui/react`, and record the resolved versions in `pnpm-lock.yaml`. The baseline remains fixed for the duration of this change. A later dependency upgrade is a separate change.

Alternatives considered:

- **Upgrade only after migration:** rejected because the wrapper registry output could change during implementation.
- **Continuously track latest:** rejected because it makes diffs and regressions non-reproducible.

### Treat the official Base UI registry wrapper as canonical

For each in-scope wrapper, obtain the latest Base UI variant through the shadcn CLI workflow and inspect `--dry-run`/`--diff` output. In progressive mode, keep `components.json` on the transitional Radix preset, fetch the Base variant directly, and write it to a temporary `<component>-base.tsx` file. Never use `--overwrite` while the original wrapper still has consumers. The official wrapper is the source of truth for primitive structure, state behavior, and default chrome.

Alternatives considered:

- **Hand-convert every Radix wrapper:** rejected because it would preserve accidental Radix assumptions and create unnecessary custom code.
- **Keep the existing wrapper API through adapters:** rejected because it would make Base UI emulate Radix and leave the old contract in place.

### Migrate progressively by dependency group

Radix and Base UI coexist while migration is in progress. Use a temporary Base wrapper name when necessary, repoint a small consumer set, verify, and then make the canonical wrapper name Base-backed. Migrate in this order:

1. Native/CSS mappings and low-level controls: Label, Separator, Avatar, Checkbox, Switch, RadioGroup, Toggle.
2. Button and its high-volume `render` consumer sweep.
3. ToggleGroup, Collapsible, Tabs, and ScrollArea.
4. Dialog, AlertDialog, Popover, Tooltip, HoverCard, DropdownMenu, and ContextMenu.
5. Select and Sheet.
6. Sidebar after Button, Sheet, and Tooltip.

Dependencies that do not belong to this list remain unchanged.

### Keep custom behavior as composition, not wrapper mutation

When the app requires behavior absent from the default Base wrapper, compose it outside the default implementation or in a narrowly named extension. Examples include the repository portal container, a workflow-specific close action, or a product-specific size option. The default Base wrapper must remain recognizable and updateable from the shadcn registry.

When no Base UI primitive exists, use the official native/CSS mapping. Do not create a replacement primitive or reimplement Radix internals.

### Record migration state per wrapper

Every migrated wrapper gets a self-contained `.migration/<component>.md` report with the changed files, intentionally untouched files, behavior changes, and a focused manual QA checklist. The report also confirms the leftover Radix import scan for that component. A whole-project `.migration/project.md` report records the dependency swap, consumer sweep, final verification, and derived count of wrappers that remain on Radix. Migration state is derived from these files and the UI directory, not from a hand-maintained index.

### Update consumers to Base UI contracts

Consumer changes are part of each wrapper migration. Use `render` instead of `asChild`, Base Select `items`, `multiple` toggle groups, and Base focus/dismissal callback signatures. Remove obsolete Radix-only props rather than hiding them behind an alias.

### Preserve the Nova visual contract

The final shadcn configuration moves to the Base-backed Nova preset (`base-nova`/`base: base`) only after the last in-scope wrapper is migrated. Existing Nova colors, spacing, typography, radius, and overlay chrome remain the target throughout. Layout-only feature classes remain allowed; local classes must not recreate wrapper chrome.

### Define verification and rollback boundaries

Each wrapper or dependency group must pass typecheck before dependent groups begin. Lint and production build run at milestone boundaries. Browser/manual QA covers Dialog, AlertDialog, Menu, Select, forms, keyboard/focus, responsive states, light/dark modes, and fullscreen overlays. A failed verification blocks dependent groups; the previous wrapper state remains the rollback point.

## Risks / Trade-offs

- **Consumer blast radius from `asChild` and Button:** migrate one consumer slice at a time and typecheck after each slice.
- **Changed Base UI semantics:** use the official Base behavior, document meaningful differences, and stop if required app capability cannot be represented.
- **Portal or focus regression:** preserve the existing portal-container composition as an app extension and manually verify SSR, focus restoration, Escape, and outside-click behavior.
- **AlertDialog action mismatch:** model destructive workflows with the official Base composition and keep pending/error/delete state in the feature owner; do not force a Radix `Action` equivalent into the wrapper.
- **Select and ToggleGroup type changes:** update consumers at the same time as the wrapper and run the full TypeScript check before moving to dependent controls.
- **Registry drift:** capture the exact CLI/package/registry baseline at the start and use reviewed diffs rather than an unbounded latest overwrite.
- **Temporary mixed primitives:** keep the coexistence period short, record the remaining Radix wrapper list, and remove `radix-ui` only after the list is empty.

## Migration Plan

1. Start from a clean branch and record the existing typecheck, lint, and build baseline.
2. Upgrade shadcn and add `@base-ui/react`; verify the lockfile and project context without changing application behavior.
3. Inventory the 28 in-scope shadcn wrappers, compare each with the Base UI registry variant, and record custom extensions and consumer counts. Keep the original wrapper untouched while a temporary Base wrapper is being validated, and create its per-component migration report.
4. Migrate the wrapper groups in dependency order. For every group, update consumers to Base contracts and run the group verification before continuing.
5. Run the targeted browser/manual QA matrix at overlay, form, and responsive milestones.
6. Confirm no in-scope wrapper imports `radix-ui`, switch the shadcn configuration to the Base-backed Nova preset, remove `radix-ui` from the manifest and lockfile, and write `.migration/project.md`.
7. Run the final typecheck, lint, build, static import sweep, and manual QA. If a group fails, restore that group to its prior wrapper state and resolve it before proceeding.

## Open Questions

No product decisions remain open from the requirements grill. During implementation, any component-specific capability that lacks an official Base UI mapping must be reported in the migration record before choosing an extension or exclusion.
