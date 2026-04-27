## Why

Pagination currently looks like buttons but is implemented as link controls with `href="#"` and `preventDefault()`. This creates mixed semantics, weaker disabled behavior, and inconsistent visual state treatment across list navigation.

## What Changes

- Standardize shared pagination navigation to use real button controls for page numbers, previous, and next.
- Remove visible text from previous and next controls; keep icon-only controls with accessible labels.
- Define consistent visual states:
  - current page uses a primary/active button treatment
  - inactive pages use neutral outline buttons
  - previous/next use neutral outline icon buttons
  - disabled controls use real `disabled`
  - pending transitions disable navigation and keep the existing pending feedback
- Simplify pagination footer information by removing redundant page/result-count badges:
  - do not show `Trang 2/51` because the active page and last page are already visible in the control
  - for `totalPages <= 1`, show only the summary text instead of extra `7 kết quả` or `0 kết quả` badges
  - keep pending feedback visible when a route transition is in progress
- Keep page navigation URL-driven through `router.push()` and preserve existing query parameters.
- Keep the implementation outside `components/ui`; do not edit shadcn pagination primitives.
- Align list pages so page-size controls are consistently available through the shared toolbar or shared pagination surface where missing.

## Capabilities

### New Capabilities

### Modified Capabilities
- `shared-pagination-controls`: Refine the shared pagination contract to require button-only navigation semantics, icon-only previous/next controls, and consistent active/inactive/disabled/pending presentation.

## Impact

- Affects shared pagination wrappers in:
  - `components/app-pagination-controls.tsx`
  - `components/app-pagination.tsx` if needed by composition
  - `components/use-app-pagination-query.ts` only if button handling needs small API support
- May affect list pages missing page-size controls, especially:
  - `app/(main)/sources/source-list.tsx`
  - `app/(main)/topics/topic-list.tsx`
- Does not change backend APIs, pagination query names, or 1-indexed URL behavior.
- Does not modify `components/ui/pagination.tsx` or other shadcn primitives.
