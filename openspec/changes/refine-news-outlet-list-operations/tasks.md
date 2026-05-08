## 1. Sort And Table Structure

- [x] 1.1 Update the sort control path so `/news-outlets` displays the effective `id_desc` default as `Moi tao` when no `sort` query parameter is present.
- [x] 1.2 Remove the `Slug` header and slug value cells from `app/(main)/news-outlets/news-outlet-list.tsx`.
- [x] 1.3 Update the primary source cell so homepage/RSS render as concise scan signals while full URLs remain accessible through secondary affordances.
- [x] 1.4 Update the `/news-outlets` loading skeleton in `app/(main)/news-outlets/page.tsx` to match the final table columns after slug removal and primary-cell compaction.

## 2. Row State And Actions

- [x] 2.1 Add a compact Vietnamese active-state label beside or near the active switch for each news outlet row.
- [x] 2.2 Add an accessible switch label that identifies the target news outlet and active-state control.
- [x] 2.3 Add Vietnamese tooltips to icon-only edit and delete row actions while preserving existing `sr-only` labels.
- [x] 2.4 Ensure edit and delete button icons use the local shadcn `data-icon` convention.
- [x] 2.5 Preserve `AlertDialog` confirmation for destructive delete behavior.

## 3. Copy And Verification

- [x] 3.1 Replace the `/news-outlets` empty-state description with concise Vietnamese product copy that does not mention backend contracts or implementation details.
- [x] 3.2 Verify create/edit still keeps the slug field available and unchanged.
- [x] 3.3 Run a targeted lint check for touched news-outlet and shared component files.
- [ ] 3.4 Smoke-check the `/news-outlets` list visually for toolbar state, table columns, compact homepage/RSS signals, active-state labels, tooltips, empty state, and skeleton alignment.
