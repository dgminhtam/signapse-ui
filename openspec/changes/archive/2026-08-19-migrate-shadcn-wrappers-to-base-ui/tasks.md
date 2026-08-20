## 1. Baseline and dependency setup

- [x] 1.1 Record the clean-branch typecheck, lint, production build, in-scope wrapper list, direct Radix imports, and consumer counts.
- [x] 1.2 Upgrade the shadcn CLI/package to the latest version available at implementation start and add `@base-ui/react` explicitly.
- [x] 1.3 Lock the resolved dependency baseline in `pnpm-lock.yaml` and verify the shadcn project context without changing application behavior.
- [x] 1.4 Require a clean branch and one migration commit per wrapper so each dependency group has an independent rollback boundary.
- [x] 1.5 Confirm `@radix-ui/react-toolbar` and its Plate/editor consumers are recorded as out of scope.

## 2. Registry mapping and migration records

- [x] 2.1 Compare every in-scope shadcn wrapper with the latest Base UI Nova registry output using the shadcn dry-run and diff workflow; in progressive mode, never use `--overwrite` while the original wrapper has consumers.
- [x] 2.2 Create one exact-format `.migration/<component>.md` report per migrated wrapper, including changed files, intentionally untouched files, behavior changes, focused automated verification evidence, and the leftover Radix import scan.
- [x] 2.3 Identify wrappers with no direct Base UI primitive and record the approved native/CSS mapping or an implementation blocker before changing consumers.
- [x] 2.4 Keep migration status derived from the wrapper files and reports; do not create a manually maintained migration index.

## 3. Native and low-level wrappers

- [x] 3.1 Replace Label and other no-counterpart wrappers with the official native/CSS mappings without introducing new primitives.
- [x] 3.2 Migrate Separator, Avatar, Checkbox, Switch, RadioGroup, and Toggle to the official Base UI shadcn wrappers.
- [x] 3.3 Update the affected consumers to Base UI contracts and preserve existing accessibility, form, and visual behavior.
- [x] 3.4 Run typecheck and the relevant focused verification before starting the Button migration.

## 4. Button and state-control consumers

- [x] 4.1 Migrate Button to the official Base UI Button implementation and validate one representative consumer before the broad repoint.
- [x] 4.2 Replace Button and related `asChild` consumers with the Base UI `render` contract where the primitive semantics are preserved; render link-style consumers as direct `Link`/`a` elements with `buttonVariants` so native link semantics and keyboard behavior remain intact.
- [x] 4.3 Migrate ToggleGroup, Collapsible, Tabs, and ScrollArea, including `multiple`, activation, and panel/content contract changes.
- [x] 4.4 Run typecheck after each state-control group and stop dependent work on any regression.

## 5. Select and overlay wrappers

- [x] 5.1 Migrate Select to the official Base UI wrapper and update dynamic consumers to the `items` and nullable-value contract.
- [x] 5.2 Migrate Dialog and DialogClose, replacing Radix composition with the official Base UI `render` contract while preserving controlled workflows.
- [x] 5.3 Preserve required portal-container composition through an external app extension and verify focus restoration, Escape, outside-click, and SSR behavior.
- [x] 5.4 Migrate AlertDialog and update destructive confirmation consumers without losing pending, error, cancel, or delete state.
- [x] 5.5 Migrate Popover, Tooltip, and HoverCard using the official Base UI positioning and delay contracts.
- [x] 5.6 Migrate DropdownMenu and ContextMenu, including menu checkbox/radio behavior and the official Portal/Positioner/Popup structure.
- [x] 5.7 Migrate Sheet after Dialog and overlay dependencies are stable, preserving side/layout composition through external extensions only.
- [x] 5.8 Run typecheck and targeted overlay verification after each overlay group.

## 6. Dependent shared UI

- [x] 6.1 Repoint Sidebar to the migrated Button, Sheet, Tooltip, and menu wrappers without changing its state, cookie, keyboard, or responsive behavior.
- [x] 6.2 Reconcile remaining app consumers of migrated wrappers and remove obsolete Radix-only props without adding compatibility aliases.
- [x] 6.3 Run lint and production build at the shared-UI milestone and resolve regressions before cleanup.

## 7. Final cleanup and configuration

- [x] 7.1 Confirm no in-scope wrapper imports `radix-ui` and that remaining Radix usage is limited to the documented out-of-scope Toolbar.
- [x] 7.2 Switch `components.json` from the transitional Radix baseline to the Base-backed Nova preset (`base-nova`/`base: base`) after the final wrapper migration.
- [x] 7.3 Remove `radix-ui` from `package.json` and `pnpm-lock.yaml`; retain `@radix-ui/react-toolbar`.
- [x] 7.4 Run a final static sweep for `asChild`, obsolete Radix props, direct primitive imports, and accidental third-party scope expansion.

## 8. Verification and handoff

- [x] 8.1 Run the existing `pnpm test` baseline, `pnpm typecheck`, `pnpm lint`, `pnpm build`, and OpenSpec validation for the completed change.
- [x] 8.2 Complete the deterministic P0 Base UI consumer regression coverage defined in section 14 and run `pnpm test`.
- [x] 8.3 Run the final repository-run verification: `pnpm test`, typecheck, applicable lint/build checks, static import/consumer sweeps, and strict OpenSpec validation. Do not run the repository formatter.
- [x] 8.4 Create `.migration/project.md` with the Toolbar exception, approved Base UI capability differences, exact dependency baseline, final build result, consumer sweep summary, and derived remaining-Radix count.

## 9. Expanded exact registry conformance scope

The original tasks covered the first 28-wrapper inventory. The following follow-up tasks are required for the expanded requirement that every installed shadcn wrapper match the selected registry implementation, including Drawer.

- [x] 9.1 Expand the inventory and migration reports from 28 to 29 wrappers by adding `components/ui/drawer.tsx`; record its live `local-entity-quick-detail-drawer.tsx` consumer and the locked `base-nova` registry baseline.
- [x] 9.2 Re-run `shadcn add <component> --dry-run --diff` for all 29 wrappers at the locked CLI/registry baseline and classify every diff as exact, formatting/import-only, or semantic/API/chrome.
- [x] 9.3 Migrate `Drawer` from Vaul to the official `@base-ui/react/drawer` registry structure, update its consumer contract, preserve required portal behavior through an external extension, and remove `vaul` if no other consumer remains.
- [x] 9.4 Reconcile all identified semantic/API/chrome drift: `cn-font-heading`, `cn-rtl-flip`, `cn-menu-target`/`cn-menu-translucent`, Button `icon-xl` and data markers, `DropdownMenu` root typing, Select scroll-arrow types, Sidebar overlay imports, and Tabs `aria-disabled` states.
- [x] 9.5 Move required portal or overlay customizations out of canonical wrapper implementations into named, documented extensions; verify that default wrappers remain registry-conformant and that unexplained `cn-*` classes are removed or explicitly defined.
- [x] 9.6 Refresh the per-wrapper and project migration reports for the 29-wrapper scope, then run the final static import sweep, typecheck, lint, build, and OpenSpec validation. Do not run the repository formatter; formatting is user-owned after implementation.

## 10. Quick-detail Drawer default composition

- [x] 10.1 Record the agreed quick-detail Drawer requirements in the change design and Base UI migration spec: default sizing, default shell chrome, scrollable content, swipe handle, title-only header, no footer actions, and preserved fullscreen portal extension.
- [x] 10.2 Keep the quick-detail header free of the non-value `DrawerDescription` and remove the unused localized `quickDetail.drawerDescription` entries.
- [x] 10.3 Align `local-entity-quick-detail-drawer.tsx` with the official Drawer sample composition: remove custom sizing/chrome, enable `showSwipeHandle`, use the default content region, and omit `DrawerFooter`, `DrawerClose`, and both footer action buttons.
- [x] 10.4 Run typecheck, lint, OpenSpec validation, and targeted static checks without running the repository formatter.

## 11. Telegram schedule timezone Combobox

- [x] 11.1 Expand the registry-backed migration scope from 29 to 30 wrappers by adding the official Base Nova `components/ui/combobox.tsx` wrapper and its self-contained `.migration/combobox.md` report.
- [x] 11.2 Replace the Telegram schedule timezone Popover/Command selector with the official grouped Combobox composition, preserving the system-generated `Intl` timezone data, localized labels/groups, IANA values, field accessibility wiring, validation, disabled state, and create/update request contract.
- [x] 11.3 Reconcile the Combobox registry dry-run as import/icon-only, then run typecheck, focused lint/static checks, and strict OpenSpec validation without running the repository formatter.

## 12. Select controlled-value lifetime correction

- [x] 12.1 Reconcile the remaining Base UI Select consumers that pass `undefined` for an empty string; use `null` for empty controlled values in schedule destination/asset fields and Telegram feature destination routing.
- [x] 12.2 Preserve the existing Select item data, nullable `onValueChange` handling, placeholders, validation, disabled state, and form/API behavior without changing the canonical Select wrapper.
- [x] 12.3 Run the focused controlled-value regression harness, typecheck, focused lint/static checks, and strict OpenSpec validation without running the repository formatter.

## 13. DropdownMenu group context correction

- [x] 13.1 Reconcile every `DropdownMenuLabel` consumer with the Base UI requirement that menu group parts are nested in `DropdownMenuGroup` or `DropdownMenuRadioGroup`, covering workspace, user, asset, and language menus.
- [x] 13.2 Preserve localized labels, separators, menu item behavior, asset scrolling/search state, radio selection, permissions, and keyboard/focus semantics without changing the canonical DropdownMenu wrapper.
- [x] 13.3 Run the ungrouped/grouped Base UI regression harness, static consumer sweep, typecheck, `git diff --check`, and strict OpenSpec validation without running the repository formatter; attempt focused lint and record the sandbox Node profile EPERM/usage-limit blocker when it cannot run.

## 14. Deterministic P0 Base UI consumer regressions

- [x] 14.1 Extend the Telegram schedule component test to select an asset from its empty controlled state and a non-default grouped timezone, then assert the create/update payload and absence of the known Select controlled-value warning.
- [x] 14.2 Extend the Telegram configuration component test with an unassigned feature route, select an active destination, then assert the update request and absence of the known Select controlled-value warning.
- [x] 14.3 Add focused component tests that open WorkspaceSwitcher and assert its grouped menu content, and that render EventTimeline's view-all control as a native link with its expected destination.
- [x] 14.4 Keep tests deterministic and local to the existing P0 foundation; run `pnpm test`, relevant static sweeps, and strict OpenSpec validation without running the repository formatter.
