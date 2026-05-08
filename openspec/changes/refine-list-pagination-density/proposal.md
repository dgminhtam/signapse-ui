## Why

The shared list pagination footer currently carries nearly the same visual weight as primary toolbar controls because page buttons use default icon button density and the summary text uses normal small body text. This makes the footer feel more prominent than its role as secondary navigation.

## What Changes

- Reduce the visual weight of page navigation buttons by using the existing compact icon button size for pagination controls.
- Align pagination ellipsis density with the compact pagination button size.
- Set the pagination summary copy to `text-xs text-muted-foreground`.
- Preserve the existing shared pagination surface, URL-driven behavior, disabled pending behavior, and responsive layout.
- Keep primary toolbar controls unchanged; this change only applies to the list pagination/footer area.
- Do not modify global Button typography, global theme tokens, or shadcn core pagination/button source.

## Capabilities

### New Capabilities

- None.

### Modified Capabilities

- `shared-pagination-controls`: Pagination footer controls should present as secondary list navigation with lighter typography and compact page controls.

## Impact

- Affected component: `components/app-pagination-controls.tsx`.
- Possible affected component by composition only: `components/ui/pagination.tsx` if ellipsis sizing cannot be overridden cleanly from app-level composition; avoid editing core shadcn source unless implementation confirms there is no app-level path.
- No API, dependency, routing, backend, or page-specific list changes.
