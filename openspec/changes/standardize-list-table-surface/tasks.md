## 1. Shared table-surface foundations

- [ ] 1.1 Introduce shared app-level composition components outside `components/ui` for list-table shell, header treatment, and in-table empty-state structure.
- [ ] 1.2 Define the shared styling contract for adopted table surfaces so border, radius, clipping, and header presentation no longer vary by page.
- [ ] 1.3 Update `AGENTS.md` so list-page table rules explicitly cover shared shell usage, header consistency, in-table empty states, and skeleton parity.
- [ ] 1.4 Update review guidance in `AGENTS.md` so table-surface drift, mismatched skeletons, and non-Vietnamese list copy are called out as findings.

## 2. Active list-page adoption

- [ ] 2.1 Migrate `app/(main)/events/event-list.tsx` to the shared table surface.
- [ ] 2.2 Migrate `app/(main)/source-documents/source-document-list.tsx` and `app/(main)/news-outlets/news-outlet-list.tsx` to the shared table surface.
- [ ] 2.3 Migrate `app/(main)/ai-provider-configs/ai-provider-config-list.tsx`, `app/(main)/blogs/blog-list.tsx`, and `app/(main)/cronjobs/cronjob-list.tsx` to the shared table surface.
- [ ] 2.4 Migrate `app/(main)/roles/role-list.tsx` to the shared table surface while preserving the permissions dialog workflow.
- [ ] 2.5 Leave hidden or redirected legacy list pages such as `topics` and `sources` out of the first rollout unless they are reactivated by separate work.

## 3. Loading-state alignment and verification

- [ ] 3.1 Update affected list-page skeletons so adopted pages mirror the final table shell, header, and footer structure.
- [ ] 3.2 Verify adopted pages present a consistent table shell, header treatment, and in-table empty state across desktop and mobile breakpoints.
- [ ] 3.3 Verify adopted pages keep professional Vietnamese user-facing copy for list-table headers, empty states, and row-level actions where this change touches the screen.
