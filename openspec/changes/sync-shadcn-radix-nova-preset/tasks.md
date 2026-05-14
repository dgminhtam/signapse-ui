## 1. Baseline Confirmation

- [x] 1.1 Check `git status --short` and identify unrelated dirty files so wrapper sync does not revert user or parallel OpenSpec work.
- [x] 1.2 Run `pnpm dlx shadcn@latest info --json` and confirm `style=radix-nova`, `base=radix`, neutral theme, lucide icons, and preset resolution.
- [x] 1.3 Run `pnpm dlx shadcn@latest add <installed-components> --dry-run` for the full installed `components/ui` inventory and record which files still report `overwrite`.
- [x] 1.4 Review `--diff` for each overwrite candidate before applying changes, prioritizing wrapper visual drift over import-order-only or documented non-visual differences.

## 2. Sync Shadcn Wrapper Files

- [x] 2.1 Sync overlay wrappers to `radix-nova`: `alert-dialog`, `dialog`, `sheet`, and `drawer`, preserving only documented non-visual exceptions if required.
- [x] 2.2 Sync menu and selection wrappers to `radix-nova`: `dropdown-menu` and `select`.
- [x] 2.3 Sync form/data entry wrappers to `radix-nova`: `field`, `input-group`, `switch`, and `textarea`.
- [x] 2.4 Sync surface/navigation wrappers to `radix-nova`: `card`, `empty`, `pagination`, `breadcrumb`, and `sidebar`.
- [x] 2.5 Re-run shadcn dry-run for the full installed inventory and ensure all wrappers are either `skip (identical)` or have a documented intentional non-visual exception.

## 3. Update Repo Guidance

- [x] 3.1 Update `AGENTS.md` to state that `components.json` and `components/ui/*` use `radix-nova` as the authoritative shadcn baseline.
- [x] 3.2 Revise core component guidance so wrapper internals are not manually edited for app bugs; wrapper changes happen through shadcn preset sync or explicit wrapper proposals.
- [x] 3.3 Revise UI and toolbar guidance so feature/app code does not hard-code `h-*`, `min-h-*`, `rounded-*`, padding, color, border, ring, shadow, or typography classes on shadcn primitives only to alter default chrome.
- [x] 3.4 Keep layout-only classes explicitly allowed for width, max-width, flex/grid placement, gap, alignment, max-height, overflow, truncation, and responsive constraints.
- [x] 3.5 Update review guidance to flag shadcn primitive visual override drift while allowing built-in shadcn variants/sizes for intentional compact contexts.

## 4. Usage Audit

- [x] 4.1 Search feature/shared app code outside `components/ui/*` for direct primitive imports, shadcn primitive visual overrides, and old wrapper assumptions exposed by the preset sync.
- [x] 4.2 Remove directly related visual overrides from touched surfaces where Nova defaults now provide the intended height, radius, footer/header chrome, color, border, or shadow.
- [x] 4.3 Preserve necessary layout constraints on dialogs, sheets, drawers, forms, toolbar controls, table cells, sidebar rows, and pagination where the class affects containment or placement rather than component chrome.
- [x] 4.4 Confirm user-facing feature copy remains Vietnamese and business behavior remains unchanged.

## 5. Verification

- [x] 5.1 Run `pnpm typecheck`.
- [x] 5.2 Run lint for all touched files, including synced wrappers, `AGENTS.md` if applicable through documentation checks, and affected feature/shared app files.
- [ ] 5.3 Run a browser smoke check on the AI provider model picker dialog to confirm the dialog is crisp, the surrounding page is dimmed, and the footer/header match Nova.
- [ ] 5.4 Smoke representative shadcn surfaces affected by wrapper sync: select/dropdown, form input group/field, sheet/drawer, sidebar, card/empty, and pagination.
- [x] 5.5 Capture any remaining intentional wrapper deviations or skipped smoke checks in the final implementation summary.
