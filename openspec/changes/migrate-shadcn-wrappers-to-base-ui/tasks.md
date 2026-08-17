## 1. Baseline and dependency setup

- [x] 1.1 Record the clean-branch typecheck, lint, production build, in-scope wrapper list, direct Radix imports, and consumer counts.
- [x] 1.2 Upgrade the shadcn CLI/package to the latest version available at implementation start and add `@base-ui/react` explicitly.
- [x] 1.3 Lock the resolved dependency baseline in `pnpm-lock.yaml` and verify the shadcn project context without changing application behavior.
- [x] 1.4 Require a clean branch and one migration commit per wrapper so each dependency group has an independent rollback boundary.
- [x] 1.5 Confirm `@radix-ui/react-toolbar` and its Plate/editor consumers are recorded as out of scope.

## 2. Registry mapping and migration records

- [x] 2.1 Compare every in-scope shadcn wrapper with the latest Base UI Nova registry output using the shadcn dry-run and diff workflow; in progressive mode, never use `--overwrite` while the original wrapper has consumers.
- [ ] 2.2 Create one exact-format `.migration/<component>.md` report per migrated wrapper, including changed files, intentionally untouched files, behavior changes, manual QA, and the leftover Radix import scan.
- [x] 2.3 Identify wrappers with no direct Base UI primitive and record the approved native/CSS mapping or an implementation blocker before changing consumers.
- [x] 2.4 Keep migration status derived from the wrapper files and reports; do not create a manually maintained migration index.

## 3. Native and low-level wrappers

- [x] 3.1 Replace Label and other no-counterpart wrappers with the official native/CSS mappings without introducing new primitives.
- [ ] 3.2 Migrate Separator, Avatar, Checkbox, Switch, RadioGroup, and Toggle to the official Base UI shadcn wrappers.
- [ ] 3.3 Update the affected consumers to Base UI contracts and preserve existing accessibility, form, and visual behavior.
- [ ] 3.4 Run typecheck and the relevant focused verification before starting the Button migration.

## 4. Button and state-control consumers

- [ ] 4.1 Migrate Button to the official Base UI Button implementation and validate one representative consumer before the broad repoint.
- [ ] 4.2 Replace Button and related `asChild` consumers with the Base UI `render` contract, preserving link semantics and keyboard behavior.
- [ ] 4.3 Migrate ToggleGroup, Collapsible, Tabs, and ScrollArea, including `multiple`, activation, and panel/content contract changes.
- [ ] 4.4 Run typecheck after each state-control group and stop dependent work on any regression.

## 5. Select and overlay wrappers

- [ ] 5.1 Migrate Select to the official Base UI wrapper and update dynamic consumers to the `items` and nullable-value contract.
- [ ] 5.2 Migrate Dialog and DialogClose, replacing Radix composition with the official Base UI `render` contract while preserving controlled workflows.
- [ ] 5.3 Preserve required portal-container composition through an external app extension and verify focus restoration, Escape, outside-click, and SSR behavior.
- [ ] 5.4 Migrate AlertDialog and update destructive confirmation consumers without losing pending, error, cancel, or delete state.
- [ ] 5.5 Migrate Popover, Tooltip, and HoverCard using the official Base UI positioning and delay contracts.
- [ ] 5.6 Migrate DropdownMenu and ContextMenu, including menu checkbox/radio behavior and the official Portal/Positioner/Popup structure.
- [ ] 5.7 Migrate Sheet after Dialog and overlay dependencies are stable, preserving side/layout composition through external extensions only.
- [ ] 5.8 Run typecheck and targeted overlay verification after each overlay group.

## 6. Dependent shared UI

- [ ] 6.1 Repoint Sidebar to the migrated Button, Sheet, Tooltip, and menu wrappers without changing its state, cookie, keyboard, or responsive behavior.
- [ ] 6.2 Reconcile remaining app consumers of migrated wrappers and remove obsolete Radix-only props without adding compatibility aliases.
- [ ] 6.3 Run lint and production build at the shared-UI milestone and resolve regressions before cleanup.

## 7. Final cleanup and configuration

- [ ] 7.1 Confirm no in-scope wrapper imports `radix-ui` and that remaining Radix usage is limited to the documented out-of-scope Toolbar.
- [ ] 7.2 Switch `components.json` from the transitional Radix baseline to the Base-backed Nova preset (`base-nova`/`base: base`) after the final wrapper migration.
- [ ] 7.3 Remove `radix-ui` from `package.json` and `pnpm-lock.yaml`; retain `@radix-ui/react-toolbar`.
- [ ] 7.4 Run a final static sweep for `asChild`, obsolete Radix props, direct primitive imports, and accidental third-party scope expansion.

## 8. Verification and handoff

- [ ] 8.1 Run `pnpm typecheck`, `pnpm lint`, `pnpm build`, and OpenSpec validation for the completed change.
- [ ] 8.2 Verify the visual contract in light/dark mode and desktop/tablet/mobile layouts without redesigning Nova chrome.
- [ ] 8.3 Verify Dialog, AlertDialog, Menu, Select, Sheet, forms, keyboard navigation, focus restoration, pending/error states, permissions, and fullscreen overlays in the browser.
- [ ] 8.4 Create `.migration/project.md` with the Toolbar exception, approved Base UI capability differences, exact dependency baseline, final build result, consumer sweep summary, and derived remaining-Radix count.
