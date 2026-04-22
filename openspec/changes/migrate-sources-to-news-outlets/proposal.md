## Why

Backend khong con duy tri surface `sources` lam domain canon cho quan ly nguon noi dung. Snapshot hien tai da chuyen sang `news-outlets` voi request/response naming moi, trong khi frontend van giu route, data layer, UI copy, va type `source*`, dan toi drift ro rang giua contract backend va feature quan ly hien co.

Change nay can duoc thuc hien bay gio de frontend co the tich hop dung `news-outlets`, giam nham lan nghiep vu, va dung naming thong nhat voi backend truoc khi tiep tuc migrate cac domain lien quan nhu `news-articles`.

## What Changes

- Migrate feature quan ly `sources` sang contract backend `news-outlets`.
- Doi naming frontend theo backend tren route canon, action, type, component, va UI copy:
  - `sources` -> `news-outlets`
  - `Source*` -> `NewsOutlet*`
- Dung route canon moi `/news-outlets` cho list, create, va detail/edit.
- Giu redirect tuong thich cho cac route cu `/sources` va `/news-sources` de tranh gay link noi bo hoac bookmark dang ton tai.
- Dong bo data contract frontend theo schema backend moi:
  - `name`
  - `slug`
  - `description`
  - `homepageUrl`
  - `rssUrl`
  - `active`
- Loai bo khoi UI va typing cac field legacy khong con trong contract moi, dac biet:
  - `type`
  - ingest metadata
  - `systemManaged`
  - `url` theo ten cu
- Cap nhat list/detail/form UX de phan anh nghiep vu `news-outlet` thay vi `source`.
- Cap nhat navigation va mapping docs de frontend ownership cua `news-outlets` duoc ghi ro.
- **BREAKING** Route canon cua feature se doi tu `/sources` sang `/news-outlets`, du co redirect tuong thich cho route cu.
- **BREAKING** Frontend se dung naming `news-outlet` lam naming canon moi trong codebase thay cho `source` o feature nay.

## Capabilities

### New Capabilities
- `news-outlet-management`: Quan ly danh sach news outlet theo contract backend `news-outlets`, bao gom list, create, edit, toggle active, delete, va route canon moi.

### Modified Capabilities
- None.

## Impact

- Anh huong toi route va UI hien tai trong `app/(main)/sources/*` va `app/(main)/news-sources/*`.
- Anh huong toi data layer trong `app/api/sources/action.ts` va `app/lib/sources/definitions.ts`, du kien doi sang module `news-outlets`.
- Anh huong toi navigation trong `config/site.ts`.
- Anh huong toi permission integration, vi frontend can doi sang bo key moi `news-outlet:*` de khop backend.
- Anh huong toi tai lieu `docs/APIMAPPING.md` va cac ghi chu ownership lien quan den `news-outlets`.
