## Context

Repo hien co nhieu search component cho cac trang danh sach, nhung hanh vi giua cac feature da bat dau lech nhau:
- co noi dung dung controlled state, co noi dung dung `defaultValue`
- co noi dung dung `useTransition()`, co noi dung tu quan `isPending`
- co noi dung `trim()` gia tri search, co noi dung giu nguyen khoang trang
- co noi dung da co `sr-only` label va `type="search"`, co noi dung con thieu
- copy search tren mot so feature van chua dong nhat voi quy uoc UI tieng Viet

Change nay la mot refactor cat ngang o muc nho: no anh huong den `AGENTS.md` va nhieu feature canon, nhung chu y giu moi feature tiep tuc so huu component search rieng. Muc tieu la dong bo behavioral contract, khong ap dat mot abstraction dung chung moi.

## Goals / Non-Goals

**Goals:**
- Chot mot behavioral contract ro rang cho list search trong `AGENTS.md`.
- Chuan hoa hanh vi search tren cac feature canon nam trong scope:
  - `ai-provider-configs`
  - `blogs`
  - `cronjobs`
  - `events`
- Bao dam search trong scope la live search co debounce `300ms`, URL-driven, reset `page=1`, va co pending feedback nhat quan.
- Bao dam search input trong scope dong bo voi query param hien tai thay vi chi doc gia tri khoi tao mot lan.
- Chuan hoa accessibility co ban va copy search trong cac file duoc cham toi.

**Non-Goals:**
- Tao shared `ListSearch` component hoac shared hook moi cho toan repo.
- Xoa hoac refactor legacy `topics`.
- Dong bo feature `sources` / `news-outlets` trong change nay.
- Dong bo feature `source-documents` trong change nay.
- Doi query key, backend API, hoac routing canon cua cac feature.
- Hoan thanh toan bo viec Viet hoa cho moi copy UI ngoai pham vi search cua cac feature duoc cham toi.

## Decisions

### 1. Chuan hoa bang guideline + refactor cuc bo, khong dung shared component
Moi feature trong scope se giu component `[feature]-search.tsx` rieng. `AGENTS.md` se duoc cap nhat de khoa behavioral contract chung cho tuong lai.

Why:
- User da yeu cau khong tao `ListSearch` dung chung.
- Query key, copy, va layout cua tung feature van co khac biet nho.
- Refactor cuc bo giam rui ro dong cham vao feature ngoai scope.

Alternatives considered:
- Tao shared component search dung chung.
- Rejected vi trai voi scope vua chot va de mo rong pham vi refactor khong can thiet.

### 2. Dung controlled input dong bo voi URL state
Search trong scope se doc gia tri tu query param hien tai va giu input state dong bo khi URL thay doi, thay vi chi dung `defaultValue` hoac state khoi tao mot lan.

Why:
- Tranh input bi stale khi nguoi dung vao bang deeplink, dung back/forward, hoac co route update tu nguon khac.
- Dong bo hon voi cach repo dang quan ly filter/search/sort/pagination tren URL.

Alternatives considered:
- Giu `defaultValue` cho cac search don gian.
- Rejected vi de gay lech giua noi dung input va query state hien tai.

### 3. Pending state cua search phai gan voi route transition that
Search trong scope se dung `useTransition()` de bao pending state khi URL dang duoc cap nhat. Khong tiep tuc duyet pattern tu quan `isPending` doc lap voi navigation that.

Why:
- Spinner can phan anh route transition thuc te thay vi chi phan anh luc debounce callback duoc goi.
- Nhat quan voi quy uoc URL-driven state da co trong repo.

Alternatives considered:
- Tiep tuc cho phep feature tu quan `isPending` theo local state.
- Rejected vi de xuat hien spinner sai nhan, tat som, hoac khong an khop voi route transition.

### 4. Chot behavioral contract toi thieu cho list search
Trong scope change nay, list search se duoc xem la hop le neu dap ung day du cac diem sau:
- live search dung `use-debounce` `300ms`
- cap nhat URL bang `router.replace()` trong `startTransition()`
- reset `page=1` khi doi search
- `trim()` gia tri truoc khi ghi URL
- xoa query param khi gia tri rong sau khi trim
- co `type="search"`, `id`, `sr-only` label, va inline `<Spinner>`
- khong them nut `Tim kiem` mac dinh

Why:
- Day la tap quy tac nho, test duoc, va phu hop voi tranh luan da chot trong phan explore.

Alternatives considered:
- Chi chot mot phan nho hon, vi du debounce + URL state.
- Rejected vi van de drift hien tai khong chi nam o debounce ma con o accessibility, trim, pending, va URL sync.

### 5. Scope canon duoc gioi han ro rang de tranh cham vao cac section dang duoc xu ly rieng
Change nay chi cham vao `ai-provider-configs`, `blogs`, `cronjobs`, `events`, va `AGENTS.md`.

Why:
- `topics` dang la legacy code duoc de lai co chu dich.
- `sources` / `news-outlets` dang nam trong section khac.
- `source-documents` sap co mot dot refactor rieng.

Alternatives considered:
- Quet dong bo tat ca search component hien co trong repo.
- Rejected vi de tao merge conflict logic voi cac change dang song song.

## Risks / Trade-offs

- [Khong dung shared component nen van con lap markup giua cac feature] -> Giam thieu bang behavioral contract ro rang trong `AGENTS.md` va review theo rule moi.
- [Scope hep co the de lai mot so search component ngoai scope van chua dong nhat] -> Noi ro trong proposal va design rang do la deferred, khong phai bo sot vo y.
- [Dong bo input voi URL co the can them effect nho trong moi component] -> Giu implementation cuc bo, don gian, va chi dong cham cac file search trong scope.
- [Change nay chi chuan hoa copy search, khong giai quyet toan bo UI copy tieng Anh cua moi feature] -> Gioi han yeu cau localization vao search surface va `AGENTS.md` de tranh scope creep.

## Migration Plan

1. Cap nhat `AGENTS.md` de them quy uoc ro rang cho list search.
2. Refactor search trong `ai-provider-configs`, `blogs`, `cronjobs`, va `events` theo behavioral contract moi.
3. Verify moi search trong scope:
   - khoi tao dung tu URL
   - debounce `300ms`
   - reset `page=1`
   - xoa query param khi rong sau khi trim
   - hien spinner khi transition pending
   - khong can nut submit rieng
4. Defer `topics`, `sources` / `news-outlets`, va `source-documents` cho cac section khac.

Rollback:
- Co the rollback an toan tung file search hoac rollback rieng `AGENTS.md` neu can, vi change nay khong doi API contract hay data model.

## Open Questions

- Khong co open question mang tinh blocking cho proposal nay. Scope, behavioral contract, va cac phan deferred da duoc chot trong pha explore.
