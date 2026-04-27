## Why

Search inputs on list screens currently render at noticeably different widths because each feature owns its own wrapper classes. This makes the dashboard feel uneven across screens, especially between pages that use `max-w-sm` and pages where search expands with `flex-1`.

## What Changes

- Add a repo-wide guidance point in `AGENTS.md` for consistent list search width and toolbar placement.
- Standardize list search wrappers so mobile uses full width and desktop uses one shared visual width token.
- Prefer existing `AppListToolbar`, `AppListToolbarLeading`, and `AppListToolbarTrailing` for list toolbar layout instead of hand-rolled toolbar containers.
- Normalize outlier list search components that still use legacy sizing, missing search semantics, or English/non-accented copy when touched in scope.
- Keep feature-local `[feature]-search.tsx` components; this change does not introduce a shared `ListSearch` abstraction.

## Capabilities

### New Capabilities
- `list-search-layout-consistency`: Defines consistent width, placement, and responsive behavior for search inputs on list pages.

### Modified Capabilities

## Impact

- Updates `AGENTS.md` list search guidance.
- Affects list search and toolbar code in:
  - `app/(main)/ai-provider-configs/*`
  - `app/(main)/blogs/*`
  - `app/(main)/cronjobs/*`
  - `app/(main)/economic-calendar/*`
  - `app/(main)/events/*`
  - `app/(main)/news-articles/*`
  - `app/(main)/news-outlets/*`
  - `app/(main)/sources/*`
  - `app/(main)/system-prompts/*`
  - `app/(main)/topics/*`
- No backend API, permission, or query contract changes.
