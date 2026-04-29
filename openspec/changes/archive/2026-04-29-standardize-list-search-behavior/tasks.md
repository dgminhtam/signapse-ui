## 1. Repo-wide guidance

- [x] 1.1 Cap nhat `AGENTS.md` de them quy uoc ro rang cho list search: debounce `300ms`, `router.replace()` trong `startTransition()`, reset `page=1`, controlled input dong bo voi URL, `trim()` + xoa query param khi rong, `type="search"`, `id`, `sr-only` label, inline `<Spinner>`, va khong them nut `Tim kiem` mac dinh.

## 2. In-scope canon search refactors

- [x] 2.1 Refactor `app/(main)/ai-provider-configs/ai-provider-config-search.tsx` de bo `defaultValue`, dong bo input voi query state hien tai, va dat du search semantics / pending feedback theo quy uoc moi.
- [x] 2.2 Refactor `app/(main)/blogs/blog-search.tsx` de thay local pending timer bang transition-based pending feedback, trim gia tri search, va giu input dong bo voi URL.
- [x] 2.3 Refactor `app/(main)/cronjobs/cronjob-search.tsx` de thay local pending timer bang transition-based pending feedback, trim gia tri search, dong bo input voi URL, va Viet hoa copy search.
- [x] 2.4 Refactor `app/(main)/events/event-search.tsx` de bo sung search semantics con thieu, dong bo input voi query state hien tai, va giu nguyen query key da co cho multi-field search.

## 3. Verification

- [x] 3.1 Verify cac search trong scope (`ai-provider-configs`, `blogs`, `cronjobs`, `events`) deu debounce `300ms`, reset `page=1`, xoa query param khi gia tri rong sau khi trim, va khong yeu cau nut submit rieng.
- [x] 3.2 Verify cac search trong scope deu hien dung gia tri tu URL, cap nhat theo query state moi, co `type="search"` + `sr-only` label, va hien inline spinner khi route transition pending.
- [x] 3.3 Verify copy trong cac search duoc cham toi la tieng Viet nhat quan, dong thoi khong mo rong refactor sang `topics`, `sources` / `news-outlets`, hoac `source-documents`.
