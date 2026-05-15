## Why

List search controls currently hand-compose `Input` with absolutely positioned search icons and padding values. This makes the icon alignment drift between list screens and makes the primary action plus search spacing feel looser than the sort and page-size control group.

## What Changes

- Standardize all list search components to compose `InputGroup`, `InputGroupInput`, and `InputGroupAddon` from `@/components/ui/input-group`.
- Render the search icon through `InputGroupAddon` without per-page icon sizing or absolute positioning classes.
- Keep list search behavior unchanged: controlled value, `type="search"`, local `[feature]-search.tsx`, `use-debounce` `300ms`, URL query update through `startTransition()` and `router.replace()`, trim before writing to URL, reset `page` to `1`, and inline pending spinner.
- Preserve the existing responsive search width rule `w-full sm:w-80 lg:w-96`.
- Tighten `AppListToolbarLeading` spacing from `gap-4` to `gap-2` so primary action plus search uses the same rhythm as sort plus page-size controls.
- Add `AGENTS.md` guidance for list search InputGroup composition.

## Capabilities

### New Capabilities

- `list-search-input-groups`: Covers visual composition, spacing, accessibility, pending feedback, and migration expectations for search controls in list toolbars.

### Modified Capabilities

- None.

## Impact

- Affected guidance: `AGENTS.md`.
- Expected implementation touchpoints: `components/app-list-toolbar.tsx` and list search files under blogs, cronjobs, economic calendar, events, news articles, news outlets, and system prompts.
- No backend API, route contract, dependency, or shadcn primitive changes.
