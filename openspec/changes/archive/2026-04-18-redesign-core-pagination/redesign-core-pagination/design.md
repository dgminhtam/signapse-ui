## Context

The current pagination experience is split across `components/app-pagination.tsx`, `components/app-select-page-size.tsx`, and ad-hoc summary text in each list page. This pattern is used widely across protected admin routes such as articles, blogs, sources, and AI provider configurations. Each screen manually composes the footer, which creates drift in spacing, copy, loading feedback, and responsive behavior.

The existing implementation already follows key constraints that must remain intact:

- Pagination state is URL-driven through `page` and `size` query parameters.
- URLs are 1-indexed even though backend paging is 0-indexed.
- Navigation is handled in client components using Next.js App Router hooks and `useTransition`.
- Shared UI must be built from existing shadcn primitives and theme tokens, without editing files under `@/components/ui/` or any other core shadcn component source.
- User-facing copy for shared controls should align with the repository rule of professional Vietnamese UI text.

The `Page<T>` shape already exposes everything the shared control surface needs: `number`, `size`, `totalPages`, `totalElements`, `numberOfElements`, `first`, and `last`.

## Goals / Non-Goals

**Goals:**

- Create a single shared pagination surface that combines summary, page-size selection, and page navigation.
- Improve visual hierarchy so pagination feels like a deliberate admin control bar rather than three unrelated fragments.
- Preserve current URL/query semantics and Next.js App Router navigation behavior.
- Reduce duplicated pagination markup and copy in list pages.
- Improve responsiveness and accessibility for narrow viewports and keyboard navigation.

**Non-Goals:**

- Changing backend pagination contracts, DTOs, or server actions.
- Replacing page-based pagination with cursor pagination or infinite scroll.
- Redesigning entire list pages, table shells, or search/sort controls.
- Modifying shadcn primitive source files under `components/ui`.

## Decisions

### 1. Introduce a shared `AppPaginationControls` composition component

Create a new shared component that accepts normalized page metadata and renders:

- page-size selection
- summary and visible range
- page navigation links

The component becomes the composition root for pagination UX, while the current low-level range logic can stay internal or be extracted into a helper. This removes repeated footer markup from list pages and creates one place to standardize copy, layout, and loading states.

**Alternatives considered:**

- Keep `AppPagination` and `AppSelectPageSize` separate and document a preferred layout.
  Rejected because existing pages already drift, and documentation alone will not remove duplication or inconsistent copy.

### 2. Keep shadcn primitives untouched and redesign through composition

The redesign will compose around existing primitives such as `Pagination`, `Button`, `Select`, and theme tokens like `card`, `muted`, `border`, `accent`, and `primary`. The shared component will own the layout shell and state styling, but it will not modify `components/ui/pagination.tsx`.

This is a hard constraint for the change, not only an implementation preference: pagination redesign work must happen in app-level shared components and feature-level composition layers.

This aligns with repository rules and keeps the design upgrade reversible and low-risk.

**Alternatives considered:**

- Edit the shadcn pagination primitive directly.
  Rejected because the repository explicitly discourages editing shared UI primitives.

### 3. Replace the page-size dropdown menu with a proper select control

The current page-size control uses a `DropdownMenu` with a compact icon-sized trigger. The redesign will move this interaction to a `Select`-based control within the shared surface. Page size is a single-choice setting, so a select provides stronger semantics, clearer affordance, and better alignment with the rest of the dashboard controls.

**Alternatives considered:**

- Keep the dropdown menu and only restyle the trigger.
  Rejected because it still behaves like an action menu instead of a data-view setting.

### 4. Move summary generation into the shared component

The new component will compute summary content from the provided page metadata, including the visible range for the current page. A default Vietnamese summary pattern will be used so screens do not need to hand-roll strings such as `Page X of Y (Z total)`.

This centralization makes the visual language and copy consistent while reducing page-level code.

**Alternatives considered:**

- Leave summary rendering to callers and only redesign navigation controls.
  Rejected because most inconsistency today comes from the summary and layout being repeated outside the shared component.

### 5. Preserve URL-driven navigation with a single internal update strategy

The new shared component will continue to use `usePathname`, `useRouter`, `useSearchParams`, and `startTransition` in a client component. Page changes will update `page`, size changes will update `size` and reset `page` to `1`, and unrelated query parameters such as search and sort will be preserved.

This follows current Next.js App Router patterns in the codebase and avoids backend coupling.

**Alternatives considered:**

- Split navigation logic between separate page-size and page-link components.
  Rejected because it keeps transition behavior fragmented and makes consistency harder to enforce.

### 6. Use a staged migration path

Implementation will introduce the new shared component first, then migrate representative list pages, then roll out to the remaining usages. Existing `AppPagination` and `AppSelectPageSize` exports can remain temporarily as wrappers or adapters while migration is in progress, then be removed after all callers are updated.

This reduces rollout risk because pagination is used broadly across the admin UI.

**Alternatives considered:**

- Big-bang replace all usages in one pass and delete the old components immediately.
  Rejected because the visual blast radius is large and would make regression isolation harder.

## Risks / Trade-offs

- [Shared component API becomes too rigid] -> Keep the API small but allow narrow configuration points such as page-size options and optional class names.
- [Global visual changes affect many list pages at once] -> Migrate representative screens first and verify desktop and narrow viewport behavior before rolling out everywhere.
- [Query parameter regressions break search or sort flows] -> Centralize route updates in one helper path and verify that unrelated params remain intact during page and size changes.
- [Design pressure tempts direct shadcn primitive edits] -> Treat `components/ui` as immutable for this change and solve layout or styling needs in wrapper components.
- [Single-page views feel over-designed] -> Hide page links when navigation is unnecessary while keeping summary and page-size controls available.

## Migration Plan

1. Add the new shared pagination composition component and supporting helpers.
2. Switch the page-size interaction to a select-based control inside the shared surface.
3. Migrate representative list pages that already use `AppPagination` and `AppSelectPageSize`.
4. Roll out the shared component to the remaining list pages and remove duplicated pagination summary markup.
5. Remove deprecated wrappers after all callers have moved to the new API.
6. Run typecheck and perform responsive smoke testing across single-page and multi-page scenarios.

## Open Questions

None blocking implementation. If some features later need noun-specific summary copy instead of a shared generic phrase, that can be added as an optional override without changing the navigation contract.
