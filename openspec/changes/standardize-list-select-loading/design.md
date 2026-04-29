## Context

Shared list controls currently use URL-driven transitions through `useTransition`. The select controls are disabled while pending, but recent UI work also placed a spinner inside the select trigger. That prevents layout shift, but visually it competes with the native select affordance and makes secondary toolbar controls feel busier than necessary.

The record-per-page options are currently `12, 20, 40, 80`. The `12` value fits card/grid layouts, while the rest are table-oriented. Signapse list screens are primarily admin tables, so the shared default should use table-friendly values.

## Goals / Non-Goals

**Goals:**
- Remove spinner indicators from shared sort and page-size select controls.
- Use disabled state and route-level loading feedback as the pending indication for select changes.
- Standardize shared page-size options to `10, 20, 50, 100`.
- Change the shared default page size to `10`.
- Preserve URL behavior: sort/page-size changes reset page when needed and preserve unrelated query params.
- Keep the implementation outside `components/ui`.

**Non-Goals:**
- Do not redesign pagination navigation buttons or the pagination surface.
- Do not change backend pagination contracts.
- Do not add per-page custom page-size sets for individual list screens.
- Do not remove pending spinners from search inputs or submit/save buttons, where pending feedback is primary and useful.

## Decisions

1. Prefer disable-only pending feedback for shared toolbar selects.

Sort and page-size selects are secondary controls. Disabled state plus the existing top loading bar is enough feedback, and it avoids noisy inline micro-spinners. This also keeps shadcn select composition simple because the chevron remains the only trigger affordance.

2. Do not replace the chevron with a spinner.

Replacing the chevron would require either modifying `components/ui/select.tsx` or applying fragile app-level selector overrides. Since the desired UX is calmer, the simpler disable-only state is better.

3. Use `10, 20, 50, 100` as the shared admin table page-size ladder.

These values are conventional for table/list pagination, easy to understand, and scale predictably. `10` is a safer default for admin screens with dense row content and varying viewport sizes.

4. Update defaults in shared helpers, not page-by-page.

The source of truth should remain `DEFAULT_PAGE_SIZE_OPTIONS` and shared default props such as `AppSelectPageSize.defaultSize`. Pages that explicitly pass `size` should be reviewed only if they override the shared default for no product reason.

## Risks / Trade-offs

- [Users may not notice pending state on very fast transitions] -> The select becomes disabled and the app already has route transition loading feedback.
- [Default `10` increases page count compared with `12`] -> This is acceptable for table readability and aligns with common pagination conventions.
- [Some pages may still hardcode `size = "12"`] -> Apply should grep for explicit page defaults and update list pages that are using `12` only as the old shared convention.
- [Spinner removal hides network latency] -> Keep pending spinner patterns in search and mutation controls; this change only targets toolbar select controls.

## Migration Plan

1. Remove spinner rendering from `SortSelect` and `PaginationPageSizeSelect`.
2. Keep `disabled={isPending}` and add or preserve `aria-busy={isPending}` where appropriate.
3. Update `DEFAULT_PAGE_SIZE_OPTIONS` to `10, 20, 50, 100`.
4. Change shared default page size props from `12` to `10`.
5. Grep list pages for explicit old default `size = "12"` or `defaultSize={12}` and update where it represents the shared default.
6. Update `AGENTS.md` guidance for toolbar select pending behavior and page-size options.
7. Verify with typecheck, diff check, and targeted grep.
