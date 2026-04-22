## Why

Pattern search cho cac trang danh sach hien dang bi drift ro rang giua cac feature: co noi dung `defaultValue`, co noi dung controlled state, co noi dung tu quan pending state, va copy search chua dong nhat voi quy uoc UI tieng Viet trong repo. Can chot mot behavioral contract ro rang ngay bay gio de cac lan refactor tiep theo khong tiep tuc tao them bien the search moi.

## What Changes

- Bo sung quy uoc repo-wide trong `AGENTS.md` cho search tren cac trang danh sach:
  - search mac dinh la live search dung `use-debounce` `300ms`
  - cap nhat URL bang `startTransition()` va `router.replace()`
  - reset `page=1` khi doi tu khoa
  - input phai la controlled state dong bo voi query param, khong dung `defaultValue`
  - gia tri search phai `trim()` truoc khi ghi len URL va xoa query param neu rong
  - phai co `type="search"`, `id`, `sr-only` label, va `<Spinner>` inline khi pending
  - UI copy lien quan den search phai la tieng Viet chuyen nghiep, nhat quan
- Chuan hoa cac search component canon trong scope cua change nay de tuan thu quy uoc moi.
- Giu moi feature tiep tuc so huu component search rieng; change nay khong tao shared `ListSearch` component hoac shared hook moi.
- Tuyen bo ro cac phan ngoai scope:
  - `topics` duoc giu nguyen cho mot de xuat khac
  - legacy `sources` / `news-outlets` khong nam trong scope cua change nay
  - `source-documents` duoc de lai cho dot refactor sap toi

## Capabilities

### New Capabilities
- `list-search-behavior`: Chuan hoa hanh vi, accessibility, va UX feedback cho search tren cac trang danh sach canon trong frontend.

### Modified Capabilities

## Impact

- Anh huong toi huong dan repo-wide trong `AGENTS.md`.
- Anh huong toi cac component search canon trong:
  - `app/(main)/ai-provider-configs/*`
  - `app/(main)/blogs/*`
  - `app/(main)/cronjobs/*`
  - `app/(main)/events/*`
- Khong thay doi API backend, query contract, hoac routing canon hien tai.
- Khong dong bo hoac xoa code legacy `topics`, `sources`, hoac `source-documents` trong change nay.
