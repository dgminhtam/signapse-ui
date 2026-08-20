## Context

The repository has 132 files under `components/ui`, including the original 28 shadcn wrappers backed by the unified `radix-ui` package plus a live `Drawer` wrapper backed by Vaul. The Telegram schedule feature also requires the registry-backed `Combobox` wrapper for its timezone field. `toolbar.tsx` uses `@radix-ui/react-toolbar` directly and is outside this change. App code has 117 `asChild` occurrences outside `components/ui`, so changing wrapper contracts requires a deliberate consumer sweep.

The project now declares `base-nova` in `components.json`. Dialog, Sheet, menu, Select, Drawer, and other wrappers also contain repository-specific portal or composition behavior. The migration must adopt the official Base UI shadcn implementations without turning those wrappers into a second custom primitive library.

### Expanded wrapper inventory and audit baseline

The expanded registry-backed inventory is 30 wrappers: `alert-dialog`, `avatar`, `badge`, `breadcrumb`, `bubble`, `button`, `button-group`, `checkbox`, `collapsible`, `combobox`, `context-menu`, `dialog`, `drawer`, `dropdown-menu`, `hover-card`, `item`, `label`, `marker`, `popover`, `radio-group`, `scroll-area`, `select`, `separator`, `sheet`, `sidebar`, `switch`, `tabs`, `toggle`, `toggle-group`, and `tooltip`. This is a change-scoped research snapshot, not a hand-maintained runtime migration index; final status remains derived from the wrapper files, reports, and static import scans.

The 2026-08-18 `shadcn 4.18.0` `base-nova` dry-run audit found, across the original 28-wrapper set, 8 wrappers with no diff, 10 with import/formatting-only differences, and 10 with semantic, API, or default-chrome differences. `Drawer` adds a further semantic migration because the local wrapper uses `vaul` while the selected registry output uses `@base-ui/react/drawer`. `Combobox` was then added from the selected registry output for the Telegram timezone field; its reviewed dry-run had only a formatting difference in the Popup `className` expression, which was transcribed exactly without running the repository formatter.

The non-formatting differences that must be resolved before the expanded change is complete are:

| Wrapper | Current drift that is not part of the default registry wrapper |
| --- | --- |
| `alert-dialog.tsx`, `dialog.tsx`, `sheet.tsx` | Extra `cn-font-heading` default title chrome. |
| `breadcrumb.tsx` | Extra `cn-rtl-flip` class on the default separator icon. |
| `button.tsx` | App-specific `icon-xl` variant and `data-variant`/`data-size` attributes. The variant has live consumers and must move to an explicit extension or usage-site composition if exact default parity is required. |
| `context-menu.tsx`, `dropdown-menu.tsx` | Extra `cn-menu-target`/`cn-menu-translucent` chrome and `cn-rtl-flip`; `DropdownMenu` also narrows the registry root prop shape by declaring `children` separately. |
| `select.tsx` | Extra menu-target/translucent popup chrome and non-registry scroll-arrow prop types. |
| `sidebar.tsx` | Default wrapper imports and renders `SheetContentInOverlay` and `TooltipContentInOverlay` instead of the registry `SheetContent` and `TooltipContent`; the portal behavior must be moved behind an explicitly documented extension boundary. |
| `tabs.tsx` | The trigger omits the registry `aria-disabled:pointer-events-none` and `aria-disabled:opacity-50` states. |
| `drawer.tsx` | The complete local Vaul implementation differs from the current Base UI registry structure, including Root context, Backdrop, Viewport, Popup, swipe handle, and content contracts. |

The `cn-*` tokens listed above are not defined elsewhere in the repository's current source search. They must not remain as unexplained default-wrapper chrome. Import/whitespace-only differences may be normalized by the user after implementation; the implementation phase must not run the repository formatter and must not treat formatting-only output as permission to retain semantic drift.

## Goals / Non-Goals

**Goals:**

- Upgrade the shadcn CLI/package and lock the implementation baseline used for the migration.
- Add `@base-ui/react` explicitly and migrate all 30 installed shadcn wrappers, including Drawer and Combobox, to the latest official Base UI registry output available at that baseline.
- Make each default wrapper a direct registry-conformant implementation: primitive structure, state behavior, prop/type contract, exports, data-slot structure, and default Nova chrome must match. Product-specific behavior belongs outside the canonical wrapper.
- Preserve the existing Nova visual contract and feature/business behavior.
- Move consumers to the native Base UI shadcn contracts rather than preserving Radix-specific props.
- Keep app-required extensions outside the default Base UI wrapper implementation.
- Provide incremental verification and a rollback boundary for every wrapper dependency group.
- Remove `radix-ui` after the last in-scope wrapper is migrated while retaining the out-of-scope Toolbar dependency.

**Non-Goals:**

- Migrating `@radix-ui/react-toolbar`, Plate/editor toolbar behavior, `cmdk`, non-Drawer Vaul integrations, `react-day-picker`, charts, or other non-shadcn primitives.
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

For each in-scope wrapper, obtain the latest Base UI variant through the shadcn CLI workflow and inspect `--dry-run`/`--diff` output. In progressive mode, keep `components.json` on the transitional Radix preset, fetch the Base variant directly, and write it to a temporary `<component>-base.tsx` file. Never use `--overwrite` while the original wrapper still has consumers. The official wrapper is the source of truth for primitive structure, state behavior, prop/type contract, exports, data-slot structure, and default chrome. A wrapper is not complete while a semantic, API, primitive, portal, default-class, or export diff remains, unless the difference is moved outside the canonical wrapper and documented as an external extension.

Do not run the repository formatter during this change. The user will run formatting after implementation. A later formatting pass may normalize whitespace or import ordering, but it must not change the registry-conformance decision or conceal a non-formatting diff.

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
6. Drawer after the overlay portal extension boundary is defined; remove Vaul only if no other consumer remains.
7. Sidebar after Button, Sheet, Tooltip, and the overlay extension boundaries are stable.
8. Combobox for the Telegram schedule timezone field after the grouped item data and form contract are verified.

Dependencies that do not belong to this list remain unchanged.

### Keep custom behavior as composition, not wrapper mutation

When the app requires behavior absent from the default Base wrapper, compose it outside the default implementation or in a narrowly named extension. Examples include the repository portal container, a workflow-specific close action, or a product-specific size option. The default Base wrapper must remain recognizable and updateable from the shadcn registry. In particular, Drawer portal behavior and Sidebar overlay content must not be preserved by silently replacing registry primitives inside the canonical wrapper; use a named extension or app-level composition instead.

When no Base UI primitive exists, use the official native/CSS mapping. Do not create a replacement primitive or reimplement Radix internals.

### Record migration state per wrapper

Every migrated wrapper gets a self-contained `.migration/<component>.md` report with the changed files, intentionally untouched files, behavior changes, focused automated verification evidence, and the leftover Radix/Vaul import scan for that component. The Drawer report must include its live quick-detail consumer and the portal-extension decision. A whole-project `.migration/project.md` report records the dependency swap, consumer sweep, final verification, and derived count of wrappers that remain on Radix. Migration state is derived from these files and the UI directory, not from a hand-maintained index.

### Update consumers to Base UI contracts

Consumer changes are part of each wrapper migration. Use `render` instead of `asChild` when the composed element keeps the migrated primitive's semantics, Base Select `items`, `multiple` toggle groups, and Base focus/dismissal callback signatures. Menu group parts are also consumer contracts: every `DropdownMenuLabel` SHALL be nested within a `DropdownMenuGroup` or `DropdownMenuRadioGroup`; the canonical wrapper SHALL not add synthetic context to support an invalid tree. The final menu consumer sweep covers workspace, user, asset, and language menus. For Button consumers whose target is a link or anchor, render the native `Link`/`a` directly with `buttonVariants` instead of routing it through Button; Base UI's native Button contract warns against replacing button semantics with an anchor. Remove obsolete Radix-only props rather than hiding them behind an alias.

### Align the quick-detail Drawer with the official Base UI sample

The local entity quick-detail Drawer is a consumer-level composition, not a reason to change the canonical Drawer wrapper. It SHALL keep `DrawerInOverlay` and `DrawerContentInOverlay` because fullscreen market charts provide an application-owned portal container, but that extension SHALL remain limited to portal placement.

The consumer SHALL use Base UI's default vertical Drawer sizing by removing its inline `height` and `maxHeight` values. The default intrinsic sizing and viewport cap remain responsible for the panel height. The consumer SHALL also enable `showSwipeHandle`, keep only the default `DrawerHeader` and `DrawerTitle` composition, omit `DrawerDescription` and `DrawerFooter`, and use the sample's `flex-1 overflow-y-auto p-4` content region for long detail content. The existing `max-w-5xl`, border, background, alignment, and responsive footer classes are layout/chrome overrides and are removed from the Drawer shell.

The quick-detail header SHALL contain only the localized `DrawerTitle`; the generic `quickDetail.drawerDescription` copy has no decision value and SHALL not be added to the dictionaries. The quick-detail Drawer SHALL render no footer, close button, or full-detail navigation button. Base UI swipe, Escape, and outside-click dismissal remain responsible for closing the Drawer, while the controlled root `onOpenChange` continues notifying the feature owner. No repository formatter is part of this follow-up.

### Use the canonical Combobox for Telegram schedule timezone selection

The Telegram schedule create/update dialog SHALL use `components/ui/combobox.tsx`, copied from the selected Base Nova registry output, rather than maintaining a feature-local Popover/Command composition. The consumer SHALL use the official grouped composition with `ComboboxInput`, the Globe icon input addon, `ComboboxContent`, `ComboboxEmpty`, `ComboboxList`, `ComboboxGroup`, `ComboboxLabel`, `ComboboxCollection`, and `ComboboxItem`.

The consumer SHALL keep the system-generated timezone model from `Intl.supportedValuesOf("timeZone")`, including the existing `Asia/Bangkok` and `UTC` safeguards, localized group labels, localized item labels, and IANA item values. The root value remains the selected `TimezoneItem | null`; selecting an item writes only `item.value` into the existing form field. Validation, disabled state, field label/description/error wiring, request serialization, and create/update behavior remain unchanged. The Combobox wrapper SHALL retain the default Base Nova portal, positioning, input, list, item, and keyboard/focus behavior; no custom wrapper chrome or popup extension is introduced.

### Preserve the Nova visual contract

The final shadcn configuration remains on the Base-backed Nova preset (`base-nova`/`base: base`) only after the last in-scope wrapper is migrated. Existing Nova colors, spacing, typography, radius, and overlay chrome remain the target throughout. Layout-only feature classes remain allowed; local classes must not recreate wrapper chrome.

### Define verification and rollback boundaries

Each wrapper or dependency group must pass typecheck before dependent groups begin. Lint and production build run at milestone boundaries. Registry diffs and static consumer sweeps establish wrapper parity, while the deterministic P0 suite covers the high-risk Base UI consumer contracts selected below. A failed repo-run verification blocks dependent groups; the previous wrapper state remains the rollback point.

### Add deterministic P0 consumer regression coverage

The migration uses the existing Vitest, React Testing Library, user-event, and MSW foundation for deterministic component-level regression coverage. The P0 suite SHALL extend the existing Telegram schedule and configuration tests for nullable Select lifetime and timezone Combobox serialization, add a WorkspaceSwitcher menu-open test for the Base UI menu-group contract, and add an EventTimeline link-semantic test for the Base UI Button composition boundary. Assertions about Base UI warnings are narrow supplemental checks; each test also verifies the user-visible behavior or request payload.

The suite does not establish real-browser geometry, visual rendering, drag gesture, portal placement, or SSR hydration behavior. Those browser-specific effects are intentionally outside this change's acceptance gate; the source contract remains the canonical Base Nova wrapper, documented app extension, and deterministic consumer behavior.

## Risks / Trade-offs

- **Consumer blast radius from `asChild` and Button:** migrate one consumer slice at a time and typecheck after each slice.
- **Changed Base UI semantics:** use the official Base behavior, document meaningful differences, and stop if required app capability cannot be represented.
- **Portal or focus regression:** preserve the existing portal-container composition as an app extension and protect deterministic owner callbacks and consumer structure with the P0 suite; real-browser SSR, focus, and placement effects remain outside this change's acceptance gate.
- **Drawer capability and portal regression:** the registry Drawer changes the primitive model from Vaul to Base UI; keep the quick-detail composition registry-aligned and protect its deterministic state contract, while real-browser swipe, direction, geometry, and portal placement remain outside this change's acceptance gate.
- **AlertDialog action mismatch:** model destructive workflows with the official Base composition and keep pending/error/delete state in the feature owner; do not force a Radix `Action` equivalent into the wrapper.
- **Select and ToggleGroup type changes:** update consumers at the same time as the wrapper and run the full TypeScript check before moving to dependent controls.
- **Registry drift:** capture the exact CLI/package/registry baseline at the start and use reviewed diffs rather than an unbounded latest overwrite.
- **Temporary mixed primitives:** keep the coexistence period short, record the remaining Radix wrapper list, and remove `radix-ui` only after the list is empty.

## Migration Plan

1. Start from a clean branch and record the existing typecheck, lint, and build baseline.
2. Upgrade shadcn and add `@base-ui/react`; verify the lockfile and project context without changing application behavior.
3. Inventory the 30 in-scope shadcn wrappers, including Drawer and Combobox, compare each with the Base UI registry variant, and record custom extensions and consumer counts. Keep the original wrapper untouched while a temporary Base wrapper is being validated, and create its per-component migration report.
4. Migrate the wrapper groups in dependency order. For every group, update consumers to Base contracts and run the group verification before continuing. Resolve every non-formatting registry diff before declaring the wrapper complete.
5. Add and run the deterministic P0 Base UI consumer regression suite at the form, menu, and link-composition milestones.
6. Confirm no in-scope wrapper imports `radix-ui` or the old Drawer Vaul primitive, switch the shadcn configuration to the Base-backed Nova preset, remove `radix-ui` and unused `vaul` dependencies from the manifest and lockfile, and write `.migration/project.md`.
7. Run the final `pnpm test`, typecheck, lint, build, static import sweep, and OpenSpec validation. If a group fails, restore that group to its prior wrapper state and resolve it before proceeding.

## Open Questions

No product decisions remain open from the requirements grill. During implementation, any component-specific capability that lacks an official Base UI mapping must be reported in the migration record before choosing an extension or exclusion.
