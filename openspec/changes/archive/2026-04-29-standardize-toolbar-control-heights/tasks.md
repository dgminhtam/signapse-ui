## 1. Baseline Audit

- [x] 1.1 Confirm default heights for `Input`, `Button`, and `SelectTrigger` in `components/ui` without editing those primitives.
- [x] 1.2 Audit shared list toolbar controls for primary-toolbar height overrides, including `SortSelect`, page-size selects, and `AppListToolbar` wrappers.
- [x] 1.3 Audit active list pages for toolbar-level `h-*`, `min-h-*`, or `size="sm"` usage on search, primary buttons, sort selects, and page-size selects.
- [x] 1.4 Classify compact controls outside the primary toolbar row, such as row actions, icon-only buttons, dialog controls, and pagination navigation, so they are preserved intentionally.

## 2. Toolbar Control Sizing

- [x] 2.1 Remove `size="sm"` and explicit height classes from shared sort/page-size select triggers used as primary list toolbar controls.
- [x] 2.2 Preserve responsive width-only classes on toolbar controls, such as `w-full`, `sm:w-[120px]`, `sm:w-[200px]`, and search wrapper widths.
- [x] 2.3 Remove any feature-level primary toolbar height overrides found during the list-page audit.
- [x] 2.4 Keep compact sizing in non-toolbar contexts where density is intentional, without broad global rewrites.
- [x] 2.5 Ensure toolbar wrappers only provide layout, alignment, width, gap, and wrapping behavior, not card chrome or forced control height.

## 3. Repo Guidance

- [x] 3.1 Update `AGENTS.md` toolbar guidance so primary list toolbar controls use default shadcn heights.
- [x] 3.2 Update `AGENTS.md` review expectations to flag custom primary-toolbar `h-*`, `min-h-*`, or compact size props unless a product reason is documented.
- [x] 3.3 Document that compact sizes remain allowed for row actions, icon-only controls, dialogs, and pagination navigation.

## 4. Verification

- [x] 4.1 Run grep checks for height-specific classes or `size="sm"` in shared primary toolbar controls and audited list toolbar usages.
- [x] 4.2 Run `pnpm typecheck`.
- [x] 4.3 Smoke inspect representative list toolbar rows if a local authenticated session is available. Local authenticated session was not available in this run, so verification is limited to static checks and typecheck.
