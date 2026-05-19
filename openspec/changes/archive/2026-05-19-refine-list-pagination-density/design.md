## Context

Shared list pagination is rendered through `components/app-pagination-controls.tsx`. It currently uses the shared pagination surface with `rounded-xl`, summary text, and page navigation buttons composed from the app Button primitive.

The behavior is correct, but the footer reads visually too close to primary toolbar controls because the numbered page buttons use the default icon button size and the summary text uses `text-sm`. Pagination is a secondary list-navigation surface, so it should be quieter than search, create, sort, and page-size controls in the toolbar.

## Goals / Non-Goals

**Goals:**

- Make the shared pagination footer feel secondary while keeping it readable and accessible.
- Set the results summary to `text-xs text-muted-foreground`.
- Use existing compact button sizing for page, previous, and next controls.
- Align ellipsis visual size with compact pagination buttons.
- Preserve URL-driven pagination behavior, disabled pending behavior, and responsive wrapping.

**Non-Goals:**

- Do not change toolbar controls, page-size selector options, or page-size selector height.
- Do not change global Button font sizing or global theme tokens.
- Do not redesign list table spacing, table surfaces, or page-specific list layouts.
- Do not introduce new dependencies or new pagination primitives.

## Decisions

### Treat pagination as secondary footer navigation

Use compact icon buttons for page navigation because the pagination footer is not a primary action area. This keeps it usable while reducing its visual weight relative to toolbar actions and search controls.

Alternative considered: reduce global Button typography. This is rejected because primary toolbar controls still need the default shadcn height and typography defined by the current repo rules.

### Keep implementation in app-level shared pagination composition

Prefer changing `components/app-pagination-controls.tsx` by passing `size="icon-sm"` to the page, previous, and next buttons. If the ellipsis can be aligned through `PaginationEllipsis` `className`, do it from this app-level component.

Alternative considered: editing `components/ui/pagination.tsx`. This should be avoided because `components/ui` is treated as shadcn core source in this repo. It is only acceptable if app-level composition cannot produce a consistent ellipsis size.

### Keep copy muted and compact

Set the summary copy to `text-xs text-muted-foreground`. The text remains visible, but it no longer competes with table row content or toolbar controls.

## Risks / Trade-offs

- [Risk] Compact buttons may feel slightly smaller on touch devices. -> Mitigation: use the existing `icon-sm` size, which remains a supported app Button size and preserves accessible labels.
- [Risk] Ellipsis may look misaligned if only button sizes change. -> Mitigation: align ellipsis to the same visual box size during implementation.
- [Risk] Reducing footer typography could make summary less prominent. -> Mitigation: keep semantic muted text and preserve placement inside the footer surface.
