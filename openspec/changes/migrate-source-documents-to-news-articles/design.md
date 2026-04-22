## Context

Frontend hien dang co mot module noi dung canon duoi ten `source-documents`, voi route `/source-documents`, data layer `app/api/source-documents`, type `app/lib/source-documents`, va hang loat component `SourceDocument*`. Module nay duoc xay theo mot snapshot backend cu hon, khi content domain hop nhat bai viet tin tuc va mot so artifact khac duoi cung mot surface.

Snapshot backend hien tai da chuyen surface canon sang `news-articles`. Hop dong moi khong con `documentType`, bo 3 status cu (`lifecycleStatus`, `readinessStatus`, `eventDerivationStatus`), va khong con metadata economic-calendar hay cac moc crawl/derive chi tiet. Cung luc do, cac be mat lien quan nhu `events`, `market-query`, va `graph-view` cung da doi naming tu `sourceDocument*` sang `artifact*` hoac `news-article`.

Day la mot thay doi cat ngang nhieu module: content routes, navigation, DTO/action layer, event evidence, market-query evidence, va graph drilldown. Neu chi doi endpoint ma giu naming cu, codebase se tiep tuc duy tri mot lop tu vung sai nghia va day them drift vao cac surface moi.

## Goals / Non-Goals

**Goals:**
- Dat `news-articles` lam domain canon moi cho frontend o route, data layer, type, component, va user-facing copy.
- Giu code moi sach ve naming: `NewsArticle*` la naming canon, `source-document` chi con ton tai o lop compatibility tam thoi neu thuc su can.
- Don gian hoa list/detail/operator UX de chi hien thi metadata co trong contract backend `news-articles`.
- Dong bo evidence/drilldown o `events`, `market-query`, va `graph-view` de khong con hard-code `sourceDocument*`.
- Giu tuong thich nguoc cho deeplink cu bang redirect tu `/source-documents*` sang `/news-articles*`.
- Cap nhat docs va huong OpenSpec de migration nay supersede huong `source-document` cu.

**Non-Goals:**
- Tao mot module quan ly rieng cho cac artifact type khac nhu `economic-calendar-entry`, `research-document`, hay `strategy-playbook`.
- Thay doi backend API, schema OpenAPI, hoac contract permission phia backend.
- Redesign lon ve mat visual vuot qua nhu cau can chinh de phan anh contract moi.
- Giai quyet dong thoi cac drift khong lien quan den `news-articles`, vi du workspace, blogs, hay media.

## Decisions

### 1. Chon `/news-articles` lam route canon va `NewsArticle*` lam naming canon
Frontend se expose feature tai:
- `/news-articles`
- `/news-articles/[id]`

Code moi se dung naming:
- `app/api/news-articles`
- `app/lib/news-articles`
- `NewsArticleListResponse`
- `NewsArticleResponse`
- `NewsArticle*` components

Why:
- Day la surface dung voi backend hien tai.
- Giup codebase giu naming sach, khong tiep tuc doi endpoint moi trong mot module ten cu.
- Dong bo voi huong migration da duoc ap dung cho `news-outlets`.

Alternatives considered:
- Giu route `/source-documents` va chi doi endpoint ben duoi.
- Rejected vi van duy tri mot canon naming sai va se tiep tuc lam rot naming `source-document` sang cac feature moi.

### 2. Giu `/source-documents*` lam redirect compatibility, khong con la implementation canon
Route cu:
- `/source-documents`
- `/source-documents/[id]`

se chi redirect ve route `news-articles` tuong ung.

Why:
- Bao toan deeplink va cac surface khac chua kip doi.
- Cho phep migrate cross-feature theo nhieu task ma khong gay breakage dot ngot.

Alternatives considered:
- Xoa route cu ngay lap tuc.
- Rejected vi `events`, `market-query`, va `graph-view` hien van dang deep-link den `/source-documents/{id}`.

### 3. Migrate UI theo contract that su ton tai, khong carry over metadata cu
List/detail `news-articles` se duoc thiet ke quanh cac field:
- `title`
- `description`
- `content`
- `url`
- `featureImage`
- `newsOutletId`
- `newsOutletName`
- `publishedAt`
- `status`
- `externalKey`
- `linkedEvents`
- `createdDate`
- `lastModifiedDate`

UI se loai bo:
- filter `documentType`
- badge `lifecycleStatus`
- badge `readinessStatus`
- badge `eventDerivationStatus`
- section metadata economic-calendar
- metadata crawl/derive chi tiet chi ton tai o contract cu

Why:
- Hop dong moi da bo cac field nay.
- Co gang giu lai UI cu se dan den render placeholder khong co y nghia, tao ky vong sai cho operator.

Alternatives considered:
- Giu nhieu section cu va hien thi "Khong co" cho phan lon metadata.
- Rejected vi day la cach keo dai mot nghiep vu da khong con duoc backend xac nhan.

### 4. Evidence va graph se chuyen sang artifact-aware model thay vi source-document-aware model
`events`, `market-query`, va `graph-view` se duoc doi sang naming:
- `artifactType`
- `artifactId`
- `artifactTitle`
- `artifactUrl`
- `newsOutletName`
- `news-article` node kind
- `source-artifact-event` edge kind

Internal drilldown chi nen mo toi `/news-articles/{id}` khi payload that su tro toi `NEWS_ARTICLE` hoac `news-article`. Cac artifact khac se duoc render o che do generic hon, uu tien label va external URL neu co.

Why:
- Snapshot backend da mo rong evidence ra khoi pham vi `source-document`.
- Doi sang `news-articles` ma van giu `sourceDocument*` o surface khac se tao mot codebase nua cu nua moi.

Alternatives considered:
- Chi migrate feature `news-articles`, de `events/query/graph-view` cho sau.
- Rejected lam canon clean vi van de lai nhieu link, labels, va types sai nghia ngay sau khi route moi duoc ship.

### 5. FE naming permission se doi sang `NEWS_ARTICLE_*`, runtime key duoc co lap tai boundary
Module moi se co `app/lib/news-articles/permissions.ts` voi cac helper theo naming moi. Gia tri runtime co the:
- dung key moi neu backend da doi sang `news-article:*`
- hoac tam thoi map ve `source-document:*` neu backend chua doi key

Why:
- User muon naming code sach va doi hoan toan theo domain moi.
- OpenAPI snapshot khong xac nhan permission keys, nen can tach naming code khoi uncertainty o runtime literal.

Alternatives considered:
- Giu tiep `SOURCE_DOCUMENT_*` trong feature moi.
- Rejected vi naming cu se lan nguyen ven vao domain moi.

### 6. Migration nay se supersede huong `source-document` trong OpenSpec
Change moi se duoc xem la huong canon moi cho content domain. Cac change cu nhu `refactor-article-to-source-document` va `add-source-document-event-derivation` khong nen duoc tiep tuc nhu mot duong implementation chinh nua.

Why:
- Huong di backend da doi.
- Tiep tuc dau tu vao canon `source-document` se tao xung dot giua spec moi va code moi.

## Risks / Trade-offs

- [Scope cat ngang nhieu feature] -> Chia task theo vertical slices: core `news-articles`, legacy redirects, artifact evidence cleanup, graph cleanup, docs/verify.
- [Permission naming backend chua ro] -> Co lap runtime key trong `news-articles/permissions.ts` va de mot open question xac nhan truoc khi implement.
- [Deeplink cu va workbench khac co the bi gay] -> Giu `/source-documents*` lam redirect compatibility trong suot migration.
- [Operator quen voi metadata cu] -> Chot nguyen tac UI contract-driven; nhung metadata da bi backend loai bo se khong duoc tiep tuc hien thi nhu thong tin canon.
- [Cross-feature cleanup lam change lon] -> Giu pham vi artifact-aware o muc toi thieu can thiet: type, labels, va drilldown. Khong mo rong thanh mot framework moi cho moi artifact type.

## Migration Plan

1. Tao module canon `news-articles` cho action, definitions, permissions, list page, detail page, va operator actions.
2. Doi navigation sang `/news-articles`, dong thoi chuyen `/source-documents*` thanh redirect compatibility.
3. Doi naming va DTO ripple o `events`, `market-query`, va `graph-view` de dung `artifact*` / `news-article`.
4. Cap nhat `docs/APIMAPPING.md` va cac ghi chu ownership cho `news-articles`.
5. Xac minh build/typecheck/lint va cac drilldown noi bo.

Rollback:
- Co the tro navigation ve `/source-documents` neu can, vi redirect compatibility duoc giu o giai doan chuyen doi.
- Data khong can migration, nen rollback chu yeu la rollback route/data-layer naming va UI wiring.

## Open Questions

- Backend da doi permission runtime sang `news-article:*` chua, hay van giu `source-document:*`?
- User-facing label canon nen la `Bai viet tin tuc`, `Tin bai`, hay mot ten gon hon khac?
- Action `update feature image` co can duoc expose trong UI migration nay, hay chi can giu data-layer san sang?
