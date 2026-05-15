## 1. Guidance

- [x] 1.1 Update `AGENTS.md` list search guidance so pending search feedback replaces the leading search icon inside the same `InputGroupAddon`.
- [x] 1.2 Document that list search pending feedback must not use trailing spinner addons, external spinners, absolute positioning, custom input padding, or reserved trailing width.
- [x] 1.3 Confirm the guidance remains scoped to list toolbar search and does not create a shared default search component.

## 2. Search Component Migration

- [x] 2.1 Migrate `app/(main)/blogs/blog-search.tsx` so `isPending` renders `<Spinner>` instead of `<Search>` inside the leading `InputGroupAddon`.
- [x] 2.2 Migrate `app/(main)/cronjobs/cronjob-search.tsx` so `isPending` renders `<Spinner>` instead of `<Search>` inside the leading `InputGroupAddon`.
- [x] 2.3 Migrate `app/(main)/economic-calendar/economic-calendar-search.tsx` so `isPending` renders `<Spinner>` instead of `<Search>` inside the leading `InputGroupAddon`.
- [x] 2.4 Migrate `app/(main)/events/event-search.tsx` so `isPending` renders `<Spinner>` instead of `<Search>` inside the leading `InputGroupAddon`.
- [x] 2.5 Migrate `app/(main)/news-articles/news-article-search.tsx` so `isPending` renders `<Spinner>` instead of `<Search>` inside the leading `InputGroupAddon`.
- [x] 2.6 Migrate `app/(main)/news-outlets/news-outlet-search.tsx` so `isPending` renders `<Spinner>` instead of `<Search>` inside the leading `InputGroupAddon`.
- [x] 2.7 Migrate `app/(main)/system-prompts/system-prompt-search.tsx` so `isPending` renders `<Spinner>` instead of `<Search>` inside the leading `InputGroupAddon`.
- [x] 2.8 Remove trailing `InputGroupAddon align="inline-end"` spinner slots and `className="min-w-8"` from migrated list search components.

## 3. Behavior Preservation

- [x] 3.1 Preserve each component's query key, placeholder, debounce timing, controlled value behavior, `router.replace()` flow, trim behavior, and page reset.
- [x] 3.2 Preserve `type="search"`, `id`, matching `sr-only` label, and wrapper width `w-full sm:w-80 lg:w-96`.
- [x] 3.3 Leave non-list search controls such as combobox, dialog, command, role permission, graph/workbench, and form search-like inputs unchanged.

## 4. Verification

- [x] 4.1 Run targeted search to confirm migrated list search files no longer render trailing `InputGroupAddon align="inline-end"` spinner slots or `className="min-w-8"`.
- [x] 4.2 Run targeted search to confirm migrated list search files render both `<Search>` and `<Spinner>` only through the leading `InputGroupAddon`.
- [x] 4.3 Run targeted lint for the migrated search files.
- [x] 4.4 Run `pnpm typecheck`.
- [x] 4.5 Run `openspec validate replace-list-search-icon-with-spinner --strict`.
- [x] 4.6 Visually smoke check representative list toolbars for idle icon, pending spinner replacement, and no trailing empty spinner slot where local auth/data allow it; otherwise document the blocker.

Verification note: Updated `AGENTS.md` to require pending list search feedback to replace the idle search icon in the same leading `InputGroupAddon`, while forbidding trailing spinner addons, external spinners, absolute positioning, custom input padding, or reserved trailing width for this purpose. Migrated all seven list toolbar search components so the leading addon conditionally renders `<Spinner aria-label="Đang tìm kiếm" />` or `<Search aria-hidden="true" />`, and removed the trailing `InputGroupAddon align="inline-end"` plus `className="min-w-8"`. Targeted search confirmed the migrated files no longer contain trailing spinner addons or reserved spinner width, and each file has one leading `InputGroupAddon` containing both idle and pending icons. Query keys, placeholders, debounce timing, controlled state, trim behavior, page reset, `router.replace()` flow, `type="search"`, `id`, `sr-only` label, and `w-full sm:w-80 lg:w-96` wrapper were preserved. Non-list search controls were not changed. `pnpm lint -- "app/(main)/blogs/blog-search.tsx" "app/(main)/cronjobs/cronjob-search.tsx" "app/(main)/economic-calendar/economic-calendar-search.tsx" "app/(main)/events/event-search.tsx" "app/(main)/news-articles/news-article-search.tsx" "app/(main)/news-outlets/news-outlet-search.tsx" "app/(main)/system-prompts/system-prompt-search.tsx"` passed. `pnpm typecheck` passed. `openspec validate replace-list-search-icon-with-spinner --strict` passed. `git diff --check` passed for touched files. Visual smoke test was not run because this session does not have an authenticated local app/browser state for representative list screens.
