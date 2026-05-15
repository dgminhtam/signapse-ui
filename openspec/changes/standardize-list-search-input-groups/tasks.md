## 1. Guidance

- [x] 1.1 Add `AGENTS.md` guidance that list search controls must use `InputGroup`, `InputGroupInput`, and `InputGroupAddon`.
- [x] 1.2 Document that list search icons must not use per-page absolute positioning, manual `h-*`/`w-*` icon sizing, or custom input padding to align the search icon.
- [x] 1.3 Clarify that this rule applies to list toolbar search only and does not create a shared default search component.

## 2. Toolbar Spacing

- [x] 2.1 Update `AppListToolbarLeading` spacing from `gap-4` to `gap-2`.
- [x] 2.2 Verify `AppListToolbar` still separates leading and trailing groups with enough responsive space.

## 3. Search Component Migration

- [x] 3.1 Migrate `app/(main)/blogs/blog-search.tsx` to `InputGroup` composition.
- [x] 3.2 Migrate `app/(main)/cronjobs/cronjob-search.tsx` to `InputGroup` composition.
- [x] 3.3 Migrate `app/(main)/economic-calendar/economic-calendar-search.tsx` to `InputGroup` composition.
- [x] 3.4 Migrate `app/(main)/events/event-search.tsx` to `InputGroup` composition.
- [x] 3.5 Migrate `app/(main)/news-articles/news-article-search.tsx` to `InputGroup` composition.
- [x] 3.6 Migrate `app/(main)/news-outlets/news-outlet-search.tsx` to `InputGroup` composition.
- [x] 3.7 Migrate `app/(main)/system-prompts/system-prompt-search.tsx` to `InputGroup` composition.
- [x] 3.8 Preserve each component's query key, placeholder, debounce timing, controlled state behavior, `router.replace()` flow, trim behavior, and page reset.

## 4. Scope And Cleanup

- [x] 4.1 Search for remaining `type="search"` list inputs that still use raw `Input` with absolute search icons and migrate any missed list toolbar cases.
- [x] 4.2 Leave non-list search controls such as combobox, dialog, command, role permission, market query, and workbench search fields unchanged unless they are actually list toolbar search.
- [x] 4.3 Remove imports that become unused after replacing raw `Input` and manual icon positioning.

## 5. Verification

- [x] 5.1 Run targeted search to confirm migrated list search files use `InputGroupInput` and do not render manually positioned `<Search className=...>`.
- [x] 5.2 Run targeted lint for the migrated search files and toolbar component.
- [x] 5.3 Run `pnpm typecheck`.
- [x] 5.4 Run `openspec validate standardize-list-search-input-groups --strict`.
- [x] 5.5 Visually smoke check representative list toolbars for search icon alignment, spinner placement, and `Button + Search` spacing where local auth/data allow it; otherwise document the blocker.

Verification note: Migrated all seven list toolbar search components to `InputGroup`, `InputGroupInput`, and `InputGroupAddon` while preserving query keys, placeholders, debounce timing, controlled state behavior, `router.replace()`, trimming, and page reset. `AppListToolbarLeading` now uses `gap-2`; `AppListToolbar` still keeps `gap-4` between leading and trailing groups. Targeted search confirmed migrated list search files use `InputGroupInput`, no longer import raw `Input`, and no longer render manually positioned `<Search className=...>`; the remaining `<Search className=...>` match is in the role permission dialog and is intentionally outside list-toolbar scope. `pnpm lint -- components/app-list-toolbar.tsx "app/(main)/blogs/blog-search.tsx" "app/(main)/cronjobs/cronjob-search.tsx" "app/(main)/economic-calendar/economic-calendar-search.tsx" "app/(main)/events/event-search.tsx" "app/(main)/news-articles/news-article-search.tsx" "app/(main)/news-outlets/news-outlet-search.tsx" "app/(main)/system-prompts/system-prompt-search.tsx"` passed. `pnpm typecheck` passed. `openspec validate standardize-list-search-input-groups --strict` passed. `git diff --check` passed for touched files. Visual smoke test was not run because this session does not have an authenticated local app/browser state for representative list screens.
