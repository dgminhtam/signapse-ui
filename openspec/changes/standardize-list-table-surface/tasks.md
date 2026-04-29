## 1. Shared table-surface foundations

- [x] 1.1 Introduce shared app-level composition components outside `components/ui` for list-table shell, header treatment, and in-table empty-state structure.
- [x] 1.2 Define the shared styling contract for adopted table surfaces so border, radius, clipping, and header presentation no longer vary by page.
- [x] 1.3 Update `AGENTS.md` so list-page table rules explicitly cover shared shell usage, header consistency, in-table empty states, and skeleton parity.
- [x] 1.4 Update review guidance in `AGENTS.md` so table-surface drift, mismatched skeletons, and non-Vietnamese list copy are called out as findings.
- [x] 1.5 Extend `AGENTS.md` table rules so every list table must define a column overflow strategy for long backend-provided content.
- [x] 1.6 Extend `AGENTS.md` review guidance so long content expanding a desktop list table, missing primary/metadata width strategy, or skeleton width drift is called out as a finding.

## 2. Active list-page adoption

- [x] 2.1 Migrate `app/(main)/events/event-list.tsx` to the shared table surface.
- [x] 2.2 Migrate `app/(main)/news-articles/news-article-list.tsx` and `app/(main)/news-outlets/news-outlet-list.tsx` to the shared table surface.
- [x] 2.3 Migrate `app/(main)/ai-provider-configs/ai-provider-config-list.tsx`, `app/(main)/blogs/blog-list.tsx`, and `app/(main)/cronjobs/cronjob-list.tsx` to the shared table surface.
- [x] 2.4 Migrate `app/(main)/roles/role-list.tsx` to the shared table surface while preserving the permissions dialog workflow.
- [x] 2.5 Migrate `app/(main)/economic-calendar/economic-calendar-list.tsx` and `app/(main)/system-prompts/system-prompt-list.tsx` into the same active list-page adoption review for table surface and column overflow behavior.
- [x] 2.6 Leave hidden or redirected legacy list pages such as `topics`, `sources`, and `source-documents` out of the first rollout unless they are reactivated by separate work.

## 3. Column overflow alignment

- [x] 3.1 Audit adopted active list pages for long text sources such as titles, descriptions, URLs, slugs, model IDs, prompt names, cron expressions, provider names, and source names.
- [x] 3.2 Apply explicit column width strategies so primary content columns are fluid and safe to wrap, clamp, truncate, or break while metadata, status, timestamp, and action columns keep stable widths.
- [x] 3.3 Override `TableCell` default `whitespace-nowrap` only in cells that intentionally contain multiline or long-form content; keep compact metadata cells nowrap where scanability benefits.
- [x] 3.4 Verify horizontal table scrolling remains a fallback for narrow viewports or genuinely dense data, not the primary desktop layout behavior.

## 4. Loading-state alignment and verification

- [x] 4.1 Update affected list-page skeletons so adopted pages mirror the final table shell, header, footer structure, and column width strategy.
- [x] 4.2 Verify adopted pages present a consistent table shell, header treatment, in-table empty state, and stable column behavior across desktop and mobile breakpoints.
- [x] 4.3 Verify adopted pages keep professional Vietnamese user-facing copy for list-table headers, empty states, and row-level actions where this change touches the screen.
