## 1. Repo Guidance

- [x] 1.1 Verify `AGENTS.md` documents the standard list search width `w-full sm:w-80 lg:w-96`, mobile full-width behavior, and shared toolbar placement.

## 2. Search Width Standardization

- [x] 2.1 Update `ai-provider-configs`, `blogs`, `cronjobs`, `news-outlets`, `sources`, and `topics` search wrappers that currently use `max-w-sm` to the standard responsive width.
- [x] 2.2 Update `economic-calendar`, `events`, `news-articles`, and `system-prompts` search wrappers that currently use unconstrained `flex-1 shrink-0` to the standard responsive width.
- [x] 2.3 Keep each feature's existing search query key and debounce behavior while changing layout classes.

## 3. Toolbar Alignment

- [x] 3.1 Migrate `sources` list toolbar to `AppListToolbar`, `AppListToolbarLeading`, and `AppListToolbarTrailing`.
- [x] 3.2 Migrate `topics` list toolbar to `AppListToolbar`, `AppListToolbarLeading`, and `AppListToolbarTrailing`.
- [x] 3.3 Ensure primary actions stay in the leading toolbar area and sort/page-size controls stay in the trailing toolbar area.

## 4. Outlier Cleanup In Touched Files

- [x] 4.1 Fix `topics` search semantics to use controlled input, `id`, `label` with `sr-only`, trimmed URL updates, and Vietnamese copy.
- [x] 4.2 Fix `news-articles` search semantics to include `type="search"` and Vietnamese accented copy if still missing.
- [x] 4.3 Avoid broad copy or layout cleanup outside search and toolbar scope.

## 5. Verification

- [x] 5.1 Run lint for touched search/list files.
- [x] 5.2 Run `pnpm typecheck`.
- [ ] 5.3 Smoke check representative list pages at mobile and desktop widths: one action-heavy page, one no-create-action page, and one legacy toolbar page.
