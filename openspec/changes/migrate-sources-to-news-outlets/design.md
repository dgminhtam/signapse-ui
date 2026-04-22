## Context

Feature quan ly nguon hien tai dang duoc implement duoi ten `sources`, voi route canon `/sources`, action `app/api/sources/action.ts`, type `app/lib/sources/definitions.ts`, va bo UI trong `app/(main)/sources/*`. Snapshot backend moi nhat khong con su dung surface nay nua ma da chuyen sang `news-outlets`.

Su thay doi nay khong chi la doi endpoint:
- request/response da doi naming tu `url` sang `homepageUrl`
- bo sung `slug`
- giu `rssUrl` va `active`
- loai bo `type`
- loai bo ingest metadata
- loai bo `systemManaged`

Repo hien da co mot nhanh route `app/(main)/news-sources/*`, nhung thuc te chi dung de redirect ve `/sources`, nen chua co implementation canon moi. Navigation hien tai van expose `Nguon du lieu` tai `/sources`, va frontend can duoc doi sang bo permission moi `news-outlet:*` de khop backend.

Day la mot thay doi cat ngang data layer, route tree, UI copy, navigation, va docs. Dong thoi, feature nay la diem dau cua mot migration lon hon sang naming content moi cua backend, nen can mot design ro rang truoc khi implement.

## Goals / Non-Goals

**Goals:**
- Dat route canon cua feature la `/news-outlets`.
- Dong bo naming frontend theo backend cho feature quan ly news outlet.
- Dong bo request/response typing va payload builder theo contract backend `news-outlets`.
- Doi list/detail/form UI sang model `news outlet`, loai bo cac field va affordance legacy khong con trong contract.
- Giu tuong thich nguoc cho route cu `/sources` va `/news-sources` bang redirect.
- Dong bo permission gating cua frontend sang bo key backend moi `news-outlet:*`.
- Cap nhat `docs/APIMAPPING.md` de ownership va drift moi duoc ghi ro.

**Non-Goals:**
- Migrate dong thoi feature `source-documents` sang `news-articles`.
- Giu lai permission key `source:*` cho feature nay.
- Tao song song hai bo implementation day du cho ca `sources` va `news-outlets`.
- Redesign lon ve mat giao dien vuot qua nhung gi contract moi yeu cau.
- Thay doi backend API, field names, hoac schema OpenAPI.

## Decisions

### 1. Chon `/news-outlets` lam route canon moi
Frontend se expose feature quan ly news outlet tai:
- `/news-outlets`
- `/news-outlets/create`
- `/news-outlets/[id]`

Why:
- Day la naming dung voi BE.
- Tron ven hon so voi viec giu `/sources` va chi doi endpoint an ben duoi.
- Giup codebase dung tu vung nhat quan voi `news-articles` va cac payload moi co `newsOutletId`, `newsOutletName`.

Alternatives considered:
- Giu route `/sources` va chi doi action/definitions.
- Rejected vi se de lai mismatch dai han giua route, component, va contract backend.
- Dung `/news-sources`.
- Rejected vi van khong khop naming thuc te cua backend la `news-outlets`.

### 2. Migrate feature theo huong rename canon, nhung giu redirect compatibility
Implementation moi se song tai module `news-outlets`, con cac route legacy:
- `/sources`
- `/sources/create`
- `/sources/[id]`
- `/news-sources`
- `/news-sources/create`
- `/news-sources/[id]`

se redirect ve route canon tuong ung.

Why:
- Bao toan bookmark, deeplink, va link noi bo chua kip doi.
- Tranh dual maintenance trong khi van cho phep migrate dan.

Alternatives considered:
- Xoa han route cu ngay lap tuc.
- Rejected vi nguy co gay link noi bo va lam review kho hon.
- Giu ca hai route tree cung render cung mot implementation.
- Rejected vi tang be mat bao tri va de phat sinh duplicate state/UI bugs.

### 3. Doi module naming va permission gating theo backend
Frontend se tao helper permission theo naming moi, vi du:
- `NEWS_OUTLET_READ_PERMISSIONS`
- `NEWS_OUTLET_CREATE_PERMISSIONS`

voi gia tri runtime khop backend:
- `news-outlet:read`
- `news-outlet:create`
- `news-outlet:update`
- `news-outlet:delete`

Why:
- User muon naming theo BE.
- Backend da xac nhan permission keys moi da ton tai, nen FE khong can them lop mapping tam thoi.
- Dieu nay giup route gating, navigation, va action affordance dong bo hoan toan voi contract backend.

Alternatives considered:
- Giu nguyen permission checks string-inline `source:*` khap module.
- Rejected vi da sai voi permission naming moi cua backend va se tiep tuc de lai drift o route gate va navigation.
- Dung wrapper map `news-outlet:*` ve `source:*`.
- Rejected vi khong con can thiet sau khi backend da doi key that.

### 4. UI se duoc don gian hoa theo contract moi thay vi co gang mimic UI `sources` cu
List va form cua feature moi se chi xoay quanh:
- `name`
- `slug`
- `description`
- `homepageUrl`
- `rssUrl`
- `active`
- `createdDate` / `lastModifiedDate` khi can hien thi

UI se bo:
- cột `Loai`
- ingest status va ingest timestamp
- badge `Nguon he thong`
- logic read-only dua tren `systemManaged`

Why:
- Day la nhung field/affordance khong con trong contract moi.
- Co gang giu UI cu se buoc FE phai suy dien metadata ngoai contract.

Alternatives considered:
- Giu mot phan UI cu voi du lieu fallback rong.
- Rejected vi tao trang thai “co khung nhung khong co du lieu”, de gay nham lan cho nguoi dung.

### 5. Data layer moi se dung module `app/api/news-outlets` va `app/lib/news-outlets`
Thay vi tiep tuc goi `app/api/sources/action.ts`, feature moi se co module rieng:
- `app/api/news-outlets/action.ts`
- `app/lib/news-outlets/definitions.ts`
- `app/lib/news-outlets/permissions.ts`

Why:
- Dung naming moi xuyen suot.
- Cho phep legacy route redirect ma khong phai nhung module canon tiep tuc mang ten cu.
- Lam cho `APIMAPPING.md` va code ownership ro rang hon.

Alternatives considered:
- Tai su dung `app/api/sources/action.ts` va doi endpoint ben trong.
- Rejected vi ten module se tro thanh “noi dung sai nhung van dung”, rat de keo dai drift.

### 6. Search va sort se duoc dieu chinh ve metadata thuc su ton tai
Search van uu tien theo `name[containsIgnoreCase]`. Sort options se can duoc doi bo cac lua chon dua tren field da bien mat nhu `lastIngestedAt`, thay bang cac truong nhu:
- `id`
- `name`
- `createdDate`

Why:
- Contract moi khong con ingest metadata cho list.
- Giu sort cu se dan den query params khong co y nghia hoac sai contract.

Alternatives considered:
- Tam thoi giu sort cu va cho backend bo qua.
- Rejected vi se tiep tuc nuoi mot integration “chay duoc nhung sai nghia”.

## Risks / Trade-offs

- [Mot so cho trong frontend co the van hard-code `source:*`] -> Tap trung migrate navigation, route gate, va action affordance sang `news-outlet:*`, sau do ra soat string permission con sot bang search toan repo.
- [Route canon doi co the anh huong deeplink cu] -> Giu redirect cho `/sources` va `/news-sources` o list/create/detail.
- [Refactor rename co the de sot import/label cu] -> Chon migration theo module canon ro rang va co task rao soat navigation, button text, empty state, va toast.
- [Team co the ky vong `source-documents` cung doi ten cung luc] -> Ghi ro non-goal, chi coi `news-articles` la buoc tiep theo.
- [Route `/news-outlets/[id]` vua xem vua sua co the khong con metadata cu] -> Dung layout detail/edit nhe hon, chi hien thi nhung field thuc su ton tai trong contract moi.

## Migration Plan

1. Tao capability va route canon moi `news-outlets`.
2. Tao definitions, permission helpers, va action moi theo contract backend `news-outlets`.
3. Migrate list, create, va detail/edit UI tu `sources` sang `news-outlets`.
4. Cap nhat navigation de tro den `/news-outlets`.
5. Chuyen cac route `/sources*` va `/news-sources*` thanh redirect ve route canon moi.
6. Cap nhat `docs/APIMAPPING.md`.
7. Chay verify cho list, create, update, toggle, delete, search, sort, va redirects.

Rollback:
- Neu can rollback, co the tro navigation ve `/sources` va phuc hoi module cu vi thay doi nay khong co migration du lieu.
- Redirect compatibility giup rollback route an toan hon so voi xoa route cu ngay tu dau.

## Open Questions

- Team co muon doi user-facing copy tu `Nguon du lieu` sang `Nguon tin` tren toan bo nav va page title ngay trong chang nay khong? Ve mat contract, minh nghi `Nguon tin` la hop ly nhat.
