## Context

Page-level back buttons are used above create/detail content to provide an explicit route back to the parent list. The current implementation uses ghost small buttons with negative left margin, which was a reasonable lightweight treatment before the preset cleanup but now feels inconsistent with default shadcn control sizing.

The desired treatment is a visible but secondary navigation control: outline variant, default size, no manual bleed/offset, and icon composition handled by the button.

## Goals / Non-Goals

**Goals:**

- Standardize page-level back buttons to `variant="outline"` and default `Button` size.
- Remove `size="sm"` from page-level back buttons.
- Remove negative margin alignment like `className="-ml-2"`.
- Remove manual `gap-*` and manual `ArrowLeft` icon sizing when only used to restyle the back button chrome.
- Preserve route targets, text labels, `asChild` composition, and page layout placement.

**Non-Goals:**

- Do not change pagination previous/next controls.
- Do not change drawer close/back behavior or `router.back()` lifecycle.
- Do not add a shared back button component in this change.
- Do not change breadcrumb, route structure, page copy, or form submit/cancel actions.
- Do not edit `components/ui/button.tsx`.

## Decisions

- **Use `variant="outline"` instead of `ghost`.** Outline communicates navigation affordance more clearly while staying secondary to primary page actions.
- **Use default button size.** The current preset baseline uses default control height consistently; `size="sm"` makes page-level navigation feel visually underweighted.
- **Remove negative left margin.** Outline buttons have visible borders, so bleeding them left with `-ml-2` looks misaligned against the page content grid.
- **Keep implementation local.** The repo already has a small, repeated page-level pattern. A shared component would be premature unless this pattern gains behavior beyond simple link composition.

## Risks / Trade-offs

- **Risk: Back buttons become more visually present.** -> Mitigation: outline remains secondary and does not compete with default/primary actions.
- **Risk: Removing `-ml-2` changes visual alignment.** -> Mitigation: this is intentional; outlined controls should align with the page content edge.
- **Risk: A non-page back-like control is changed accidentally.** -> Mitigation: implementation must target only `ArrowLeft` page-level `Button asChild` instances with “Quay lại...” labels.
