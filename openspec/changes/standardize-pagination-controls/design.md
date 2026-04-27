## Context

Shared list pagination is centralized in `components/app-pagination-controls.tsx`, but it composes shadcn pagination links using `href="#"` and `preventDefault()` while routing through `router.push()`. The control visually behaves like a button group, but semantically behaves like fake links. This also makes disabled states rely on pointer-event classes instead of real button disabling.

## Goals / Non-Goals

**Goals:**
- Use real button controls for previous, next, and numbered page navigation.
- Make previous and next icon-only while preserving accessible labels.
- Standardize pagination state colors through existing `Button` variants.
- Reduce redundant pagination footer chrome so the summary carries result-range information and the navigation carries page-position information.
- Keep URL-driven pagination behavior unchanged: 1-indexed `page`, existing `size`, and unrelated query params preserved.
- Keep all changes outside shadcn primitives under `components/ui`.
- Ensure list pages that use shared pagination get the same navigation treatment.

**Non-Goals:**
- Do not redesign table surfaces, toolbar layout, or list page headers.
- Do not change backend pagination contracts.
- Do not replace shadcn pagination primitives globally.
- Do not introduce a new router or data-fetching pattern.

## Decisions

- Implement button-only navigation in `components/app-pagination-controls.tsx`.
  - Rationale: pagination here triggers client route transitions through local handlers, so a real `button` is semantically closer than an anchor with `href="#"`.
  - Alternative considered: keep `PaginationLink` and improve hrefs; rejected because these controls do not have stable href precomputed locally and already use `router.push()`.

- Keep `Pagination`, `PaginationContent`, `PaginationItem`, and `PaginationEllipsis` as structural primitives.
  - Rationale: those components provide layout and navigation semantics without forcing link behavior.
  - Alternative considered: bypass all pagination primitives with a custom div; rejected because it would lose existing list structure and shadcn composition consistency.

- Use the existing `Button` variants for visual states.
  - Current page: `variant="default"`, `size="icon"`, `aria-current="page"`.
  - Inactive pages: `variant="outline"`, `size="icon"`.
  - Previous/next: `variant="outline"`, `size="icon"`, icon-only.
  - Disabled or pending: real `disabled`.
  - Rationale: this uses semantic theme tokens and avoids custom color classes.

- Use chevron icons instead of raw characters for previous/next unless implementation constraints require text characters.
  - Rationale: icons align with the existing shadcn/lucide visual language. The user-facing requirement is no visible text, not necessarily raw glyphs.

- Remove static page/result-count badges from `AppPaginationControls`.
  - Rationale: `Trang 2/51` duplicates information already visible through the active page and last page in the pagination control. Single-page badges like `7 kết quả` or `0 kết quả` also duplicate the summary text, table contents, and empty state.
  - Keep: the visible item range summary, for example `Hiển thị 13-24 trên 612 kết quả`.
  - Keep: pending feedback, for example `Đang cập nhật`, because it communicates transient route state not otherwise visible.
  - Alternative considered: keep badges only on mobile; rejected for v1 because it creates responsive behavior divergence without a clear need.

- Add missing page-size controls to `sources` and `topics` only if they are still absent when this change is applied.
  - Rationale: most list pages already expose page-size control in the toolbar; these outliers keep pagination behavior visually inconsistent.

## Risks / Trade-offs

- [Risk] Icon-only previous/next can be less explicit for first-time users -> Mitigation: keep clear Vietnamese `aria-label` and rely on standard chevron pagination convention.
- [Risk] Active `default` page is visually stronger than the outline inactive treatment -> Mitigation: pagination is compact and active state benefits from a stronger anchor; inactive controls remain clearly clickable without competing with the active page.
- [Risk] Removing `Trang x/y` may reduce quick page-position scanning in very long lists -> Mitigation: the active page, last page, and ellipsis remain visible; the summary still communicates item range and total count.
- [Risk] Converting from anchor props to button props can break exported component typing -> Mitigation: keep the button-only implementation inside app-level wrappers and avoid changing `components/ui/pagination.tsx`.
