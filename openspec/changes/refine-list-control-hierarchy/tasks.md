## 1. Shared control foundations

- [x] 1.1 Introduce shared list-toolbar composition component(s) outside `components/ui` that provide leading and trailing control groups for admin list pages.
- [x] 1.2 Refactor `components/app-pagination-controls.tsx` so the shared footer owns results summary and page navigation only, while page-size selection remains available as a toolbar-level control.
- [x] 1.3 Extend `components/sort-select.tsx` and any toolbar-level page-size control API so they can align consistently inside the shared trailing control cluster without changing existing query semantics.
- [x] 1.4 Update repo guidance in `AGENTS.md` so list-page toolbar rules explicitly place page-size selection with sort and filters in the trailing controls group.

## 2. Representative list-page adoption

- [x] 2.1 Migrate `app/(main)/events/event-list.tsx` to the shared toolbar and refined pagination footer hierarchy.
- [x] 2.2 Migrate `app/(main)/source-documents/source-document-list.tsx` to the shared toolbar and refined pagination footer hierarchy while keeping the type filter in the trailing controls group.
- [x] 2.3 Migrate `app/(main)/news-outlets/news-outlet-list.tsx` to the shared toolbar and refined pagination footer hierarchy.
- [x] 2.4 Migrate `app/(main)/ai-provider-configs/ai-provider-config-list.tsx` to the shared toolbar and refined pagination footer hierarchy.
- [x] 2.5 Update any affected loading or skeleton states so they mirror the new toolbar and footer structure on migrated pages.

## 3. Verification

- [x] 3.1 Verify migrated pages preserve unrelated query parameters for search, sort, and filters during page navigation and reset `page=1` when page size changes.
- [x] 3.2 Verify desktop, tablet, and mobile layouts keep primary task controls ahead of trailing view controls and keep the pagination footer readable for both single-page and multi-page result sets.
- [x] 3.3 Verify accessible labels, disabled states, and pending feedback remain correct for sort, page-size, previous, and next controls across the migrated pages.
