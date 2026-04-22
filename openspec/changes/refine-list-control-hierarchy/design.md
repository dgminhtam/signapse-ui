## Context

Current admin list pages in Signapse already share a broad layout pattern, but their control hierarchy is inconsistent. Search and primary actions usually live in the top toolbar, while page-size selection is owned by `AppPaginationControls` in the footer. Sort and static filters are feature-owned, so each list page ends up composing a slightly different mix of wrappers, widths, and responsive breakpoints.

That creates two related problems:

- users have to look in both the toolbar and the footer to understand how the list is configured
- feature pages keep reimplementing toolbar layout details instead of reusing one clear hierarchy

There are also important constraints that must remain intact:

- search behavior is being standardized separately in `standardize-list-search-behavior`; this change must not redefine that contract
- pagination, sort, filter, and search state stay URL-driven through existing query parameters
- URLs remain 1-indexed for pagination
- shared UI must be composed outside `components/ui`
- list page copy must remain professional Vietnamese when surfaced to end users
- repo guidance already expects list toolbars to place primary actions and search on the left, with sort or static filters on the right

## Goals / Non-Goals

**Goals:**

- Establish one reusable hierarchy for admin list controls so primary task controls and view controls are easier to scan.
- Move page-size selection into the same trailing control cluster as sort and filters.
- Simplify the shared pagination footer so it focuses on results summary and page navigation.
- Reduce repeated page-level responsive markup for toolbars and list footers.
- Preserve existing query semantics, feature-specific search components, and feature-specific sort options.

**Non-Goals:**

- Redefine search behavior, debounce rules, or search query keys.
- Change backend paging, sorting, or filtering contracts.
- Redesign table rows, column density, or detail-page layouts.
- Force every existing list page to migrate in one pass.
- Modify shadcn primitive source files under `components/ui`.

## Decisions

### 1. Introduce a shared list-toolbar composition layer

Add a shared app-level toolbar composition that exposes a leading group and a trailing group instead of forcing each feature page to hand-roll the same responsive wrappers. The leading group is for the primary action and search. The trailing group is for view controls such as filters, sort, and page-size.

This keeps feature ownership where it matters: each feature still provides its own search, filters, and sort options, but it stops owning the overall hierarchy and breakpoint behavior.

Alternatives considered:

- Keep page-level toolbar wrappers in each feature and only document preferred layout.
  Rejected because the current drift already exists despite the repo guidance.
- Create one monolithic list-header component that owns every control.
  Rejected because search and filter content still varies enough by feature to benefit from slot-based composition.

### 2. Move page-size selection out of the pagination footer

Page-size selection is a view-configuration control, not a navigation destination. It belongs beside sort and filters, where users already expect to shape the list view. The pagination footer should concentrate on "where am I in the result set?" rather than also carrying "how many rows do I want?".

The shared pagination logic can still live behind one hook or helper path so both toolbar page-size changes and footer page navigation preserve unrelated query parameters and use the same transition model.

Alternatives considered:

- Keep page-size inside the footer and duplicate it in the toolbar on some screens.
  Rejected because it creates two competing sources of truth in the UI.
- Leave page-size in the footer and only restyle the shell.
  Rejected because it does not solve the hierarchy problem that prompted the change.

### 3. Split the shared footer into summary plus navigation

`AppPaginationControls` should evolve from a dense all-in-one block into a lighter footer surface made of two responsibilities:

- summary text that explains the visible range and total result count
- page navigation controls for previous, next, and numbered pages when needed

This keeps the footer readable on both desktop and mobile, lowers visual weight below the table, and makes single-page result sets feel less overdesigned.

Alternatives considered:

- Keep the current card-like footer and only move page-size out.
  Rejected because the footer would still feel heavier than needed after losing one of its controls.

### 4. Keep sort behavior feature-owned but standardize its shared affordance

`SortSelect` should remain responsible for sort query updates, but its public API should become easier to place inside a shared control cluster. That means allowing consistent sizing, labels, and pending affordances so it can sit beside page-size and filters without each feature page adding one-off wrappers.

This preserves feature-specific sort options while reducing layout drift.

Alternatives considered:

- Create a generic list-view-controls component that owns sort semantics too.
  Rejected because sort values and option labels are still feature-specific and do not need to be centralized.

### 5. Roll out through representative list pages first

This is a cross-cutting UI change, so the rollout should start with representative list pages that cover common variations:

- simple action + search + sort pages
- pages that already have an extra static filter
- pages with dense tables and multi-page result sets

That gives confidence in the shared hierarchy before broader adoption and avoids creating unnecessary merge pressure on unrelated list pages.

Alternatives considered:

- Migrate every list page in one pass.
  Rejected because the blast radius is larger than necessary for the first implementation wave.

## Risks / Trade-offs

- [The shared toolbar API becomes too abstract] -> Keep it slot-based and layout-focused rather than trying to encode feature semantics into one generic config object.
- [Some list pages remain visually inconsistent until migrated] -> Accept a staged rollout and target representative pages first so the new pattern is validated before wider adoption.
- [Toolbar and footer updates drift in query-handling behavior] -> Route both page navigation and page-size updates through the same pagination query helper or hook.
- [Responsive wrapping feels cramped on dense pages with extra filters] -> Design the trailing control cluster to wrap cleanly and verify narrow, tablet, and desktop widths during rollout.
- [This change overlaps with the search standardization work] -> Keep search behavior out of scope here and only reuse the existing search component contract inside the new toolbar layout.

## Migration Plan

1. Introduce shared toolbar composition primitives for admin list pages.
2. Refactor shared pagination composition so the footer owns summary and navigation only.
3. Update `SortSelect` and toolbar-level page-size controls to fit the shared trailing control cluster.
4. Migrate representative list pages to the new hierarchy.
5. Verify responsive behavior, pending feedback, and URL-driven state preservation across migrated pages.
6. Defer remaining list pages until the shared pattern is proven stable.

Rollback:

- Revert the shared toolbar and pagination composition changes, then restore migrated pages to their existing wrappers. Because query semantics remain unchanged, rollback is UI-local and does not require backend coordination.

## Open Questions

None blocking this proposal. If a future screen needs a specialized toolbar arrangement, the slot-based composition can absorb that as a narrow override without changing the default hierarchy.
