## Why

Backend hien tai da chuyen domain noi dung canon tu `source-documents` sang `news-articles`, nhung frontend van duy tri route, DTO, action, va copy theo naming `source-document`. Sau khi da migrate `sources` sang `news-outlets`, day la diem lech contract lon tiep theo can duoc xu ly ngay de codebase khong tiep tuc xay them tren tu vung cu.

## What Changes

- Migrate feature quan ly noi dung canon tu `source-documents` sang `news-articles` voi naming sach theo backend o route, action, type, component, va user-facing copy.
- Tao surface canon moi cho frontend tai:
  - `/news-articles`
  - `/news-articles/[id]`
- Giu `/source-documents` va `/source-documents/[id]` lam redirect compatibility trong giai doan chuyen doi, thay vi tiep tuc coi day la domain canon.
- Doi data layer frontend sang `app/api/news-articles` va `app/lib/news-articles`, map dung schema backend `NewsArticleListResponse`, `NewsArticleResponse`, `NewsPrimaryEventDerivationResult`, va `PendingNewsEventDerivationBatchResult`.
- Don gian hoa list/detail UX de phan anh contract `news-articles` thuc te:
  - bo `documentType`
  - bo `lifecycleStatus`
  - bo `readinessStatus`
  - bo `eventDerivationStatus`
  - bo metadata economic-calendar
  - bo cac moc crawl/derive chi tiet khong con trong contract moi
- Giu va migrate cac operator action con hop le o domain moi:
  - analyze
  - crawl full content
  - derive primary event
  - derive pending news events
  - delete
  - update feature image
- Cap nhat cac be mat ripple de frontend khong con hard-code `sourceDocument*` trong `events`, `market-query`, va `graph-view`, thay bang naming `artifact*` va `news-article` theo backend.
- Cap nhat navigation va `docs/APIMAPPING.md` de `news-articles` duoc ghi ro la surface frontend canon moi.
- **BREAKING** Route canon cua feature doi tu `/source-documents` sang `/news-articles`, du van giu redirect compatibility cho route cu.
- **BREAKING** Naming canon trong codebase doi tu `SourceDocument*` sang `NewsArticle*`; cac ten cu chi duoc phep ton tai o lop compatibility tam thoi neu thuc su can thiet.

## Capabilities

### New Capabilities
- `news-article-management`: Quan ly danh sach va chi tiet news article theo contract backend `news-articles`, bao gom route canon moi, operator actions, va legacy redirect compatibility.
- `artifact-traceability-alignment`: Dong bo evidence, graph entity naming, va drilldown link trong cac be mat lien quan sang `artifact*` va `news-article` thay vi `source-document`.

### Modified Capabilities
- None.

## Impact

- Anh huong toi module legacy `app/api/source-documents`, `app/lib/source-documents`, va `app/(main)/source-documents`.
- Tao module canon moi du kien tai `app/api/news-articles`, `app/lib/news-articles`, va `app/(main)/news-articles`.
- Anh huong toi `config/site.ts` va cac entry point dieu huong noi dung hien dang tro ve `/source-documents`.
- Anh huong toi `app/lib/events/definitions.ts`, `app/lib/market-query/definitions.ts`, `app/lib/graph-view/definitions.ts`, cung cac workbench va detail page dang hard-code `sourceDocument*` hoac `/source-documents/{id}`.
- Anh huong toi `docs/APIMAPPING.md` va cac ghi chu ownership/frontend impact lien quan den `news-articles`.
- Co kha nang supersede huong di cua cac change cu `refactor-article-to-source-document` va `add-source-document-event-derivation`, vi hai change nay duoc viet theo canon naming da loi thoi.
