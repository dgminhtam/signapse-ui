## Why

The news outlet list is close to the intended cardless admin surface, but several list-level signals still make routine operations less clear than they should be. The screen should expose the current sort, active state, safe row actions, and empty-state guidance without leaking implementation details or carrying detail-only metadata into the list.

## What Changes

- Show the effective default sort state in the list toolbar so the sort select reflects `id_desc` as `Moi tao` when the URL has no explicit `sort`.
- Reduce raw URL weight in the primary source cell by showing concise source/RSS signals and keeping full URLs available through secondary affordances such as tooltip, detail/edit, or copy/open actions.
- Improve the active-state column so each row exposes a readable Vietnamese status label and an accessible switch label for the specific news outlet.
- Replace the empty-state copy with product-facing Vietnamese guidance, without backend contract language.
- Add tooltips for icon-only edit and delete actions.
- Ensure edit/delete button icons follow the local shadcn convention by using `data-icon`.
- Remove the `Slug` column from the list; slug remains available in create/edit and detail/edit flows.

## Capabilities

### New Capabilities
- `news-outlet-list-operations`: Covers list-level scanability, state visibility, row action affordances, and metadata priority for the `/news-outlets` admin list.

### Modified Capabilities

## Impact

- Affected UI code:
  - `app/(main)/news-outlets/news-outlet-list.tsx`
  - `app/(main)/news-outlets/page.tsx`
  - potentially `components/sort-select.tsx` if the default sort behavior is made reusable
- No backend API, permission, dependency, or route contract changes are required.
- Existing create/edit behavior keeps the slug field unchanged.
