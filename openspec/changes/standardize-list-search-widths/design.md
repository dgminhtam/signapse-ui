## Context

List pages use feature-local search components, but their outer wrappers have drifted. Some search boxes use `max-w-sm`, some use unconstrained `flex-1 shrink-0`, and some legacy pages still use hand-built toolbar containers instead of the shared `AppListToolbar` family. The existing repo guidance already defines search behavior, but it does not define visual width or toolbar placement.

## Goals / Non-Goals

**Goals:**
- Make list search width visually consistent across desktop list screens.
- Keep search full width on mobile for comfortable touch and small-screen usage.
- Align legacy list toolbars with the existing shared toolbar structure where practical.
- Preserve feature-local search components and their existing query parameter contracts.
- Add the search width rule to `AGENTS.md` so future list pages follow the same pattern.

**Non-Goals:**
- Do not create a shared `ListSearch` component or new shared hook.
- Do not change backend filtering, sorting, pagination, or endpoint contracts.
- Do not redesign table surfaces, pagination, or page headers outside the search/toolbar scope.
- Do not migrate routes or rename domain models.

## Decisions

- Use `w-full sm:w-80 lg:w-96` as the standard list search wrapper sizing.
  - Rationale: mobile gets full-width search, while desktop gets a predictable 320px to 384px visual rhythm that works beside primary actions and right-side controls.
  - Alternative considered: keep `max-w-sm flex-1`; rejected because it still lets parent layout decide too much and produced inconsistent widths across pages.

- Keep each `[feature]-search.tsx` component local.
  - Rationale: `AGENTS.md` already prefers local search components, and the only shared concern here is a small width class plus existing behavior rules.
  - Alternative considered: introduce a shared `ListSearch`; rejected as unnecessary abstraction for this scope.

- Prefer `AppListToolbar`, `AppListToolbarLeading`, and `AppListToolbarTrailing` for list pages.
  - Rationale: the shared toolbar already encodes the desired left-action/search and right-controls split. Moving outliers onto it reduces layout drift without touching shadcn primitives.
  - Alternative considered: duplicate equivalent classes in outlier pages; rejected because it would preserve the drift source.

- Treat legacy copy and missing search semantics as opportunistic fixes inside touched files.
  - Rationale: `topics` and some source/news screens still have English, non-accented, or missing semantic search attributes. If the file is touched for width, it should not leave obvious AGENTS violations behind.

## Risks / Trade-offs

- Some pages with long primary action buttons may wrap earlier on tablet widths -> Mitigation: keep mobile/tablet fallback as column/full-width before `sm`/`lg` sizing creates fixed desktop rhythm.
- Updating legacy pages such as `sources` and `topics` may expose unrelated stale copy -> Mitigation: only fix search/toolbar-related copy and avoid broader cleanup.
- Width consistency may slightly reduce available room for very long placeholders -> Mitigation: keep placeholders concise and professional Vietnamese.
