# Tài liệu ánh xạ API

Tài liệu này ánh xạ snapshot OpenAPI backend trong `docs/api_mapping.json` tới các điểm tích hợp frontend hiện tại của repo.

Xác minh lần cuối: ngày 25 tháng 5 năm 2026

## Cấu hình cơ sở

| Mục                  | Giá trị                                               |
| -------------------- | ----------------------------------------------------- |
| URL gốc API          | `http://localhost:8484`                               |
| Nguồn chuẩn          | `docs/api_mapping.json`                               |
| Hàm auth chính       | `fetchAuthenticated()` trong `app/api/auth/action.ts` |
| Hàm public           | `fetchPublic()` trong `app/api/auth/action.ts`        |
| Kiểu mutation result | `ActionResult<T>` trong `app/lib/definitions.ts`      |
| Locale frontend      | URL prefix `/{lang}` (`vi` / `en`, fallback `vi`)          |

## Quy ước dùng chung

- Các request được bảo vệ đi qua `fetchAuthenticated()`.
- `apiFetch()` đọc `response.text()` trước khi parse JSON.
- `apiFetch()` resolve app locale from the active route locale (`x-signapse-locale` set by `proxy.ts` for page/action requests, with referer route fallback) and sends the same value as `Accept-Language` for both `fetchAuthenticated()` and `fetchPublic()`.
- `apiFetch()` gửi `Accept: application/json` mặc định, nhưng chỉ gửi `Content-Type: application/json` khi request có JSON body và không phải `FormData`.
- Frontend runtime list/search đang serialize query thành `$filter`, `page`, `size`, `sort` thông qua `queryParamsToString()`.
- OpenAPI vẫn mô tả list query bằng `specification` và `pageable`, nên cần tách biệt giữa spec contract và effective runtime contract mà frontend đang gọi.
- Snapshot backend hiện có `securitySchemes.bearerAuth` và metadata `x-signapse-auth` trên từng operation.
- `x-signapse-auth.type` hiện gồm `permission`, `active-user`, và `public`; frontend vẫn gate UI bằng permission list lấy từ `/me`.

## Contract ngôn ngữ frontend/backend

- Frontend uses the URL prefix `/{lang}` as the product language source of truth. Valid values are `vi` and `en`; unprefixed page requests are redirected by `proxy.ts` using `Accept-Language`, with `/vi` fallback.
- Backend-generated human-facing message được yêu cầu bằng HTTP header chuẩn `Accept-Language`, ví dụ `Accept-Language: vi` hoặc `Accept-Language: en`. Frontend không gửi custom header như `Language`.
- Localized backend error giữ nguyên response shape hiện tại: frontend đọc và render trường `message` như backend trả về, không suy luận hoặc mutate thêm field `language`.
- Backend có thể trả `Content-Language` và `Vary: Accept-Language` cho response localized. Frontend không cần header này để render UI thường ngày; smoke check có thể dùng để debug contract.
- Frontend không dịch canonical API identifiers hoặc domain content ở lớp API mapping, gồm enum values, permission keys, provider ids, endpoint paths, request field names, `$filter` fields, upstream provider content, persisted content, và AI-generated records.

## Tổng quan thay đổi lớn từ snapshot hiện tại

- Snapshot backend hiện tại gồm `104` operation.
- Backend đã chuyển domain nội dung canon từ `sources` / `source-documents` sang `news-outlets` / `news-articles`.
- Backend vẫn giữ các surface `events`, `query`, và `graph-view`, nhưng nhiều payload đã đổi naming từ `sourceDocument*` sang `artifact*` hoặc `news-article`.
- Surface `events` có thêm workflow derive market reactions cho từng event và batch pending events.
- Surface `market-charts` tiep tuc cung cap du lieu nen OHLCV qua endpoint `GET /market-charts/candles`; snapshot moi doi request tu `symbol` sang `assetId` va them annotation payload.
- Snapshot moi tiep tuc toi gian slug: `events`, `news-outlets`, `workspaces`, va `assets` khong con expose `slug`; `NewsOutletListResponse` cung khong con `description`.
- Snapshot backend hiện publish metadata permission chính thức qua `x-signapse-auth`, trong đó một số gate frontend cũ cần được rà lại theo permission mới.
- Frontend hiện đã có route và workbench cho `market-query` và `graph-view`, nhưng vẫn còn lệch contract với snapshot backend mới.
- Frontend đã có surface canon `news-outlets` và `news-articles`; các route legacy `/sources*`, `/news-sources*`, và `/source-documents*` hiện chỉ còn redirect compatibility.
- Legacy source implementation files for `/sources` have been removed; only redirect pages remain so old bookmarks continue to land on `/news-outlets`.
- Surface workspace dùng chuẩn `set-current`, đồng thời `WorkspaceResponse` dùng field có nghĩa `currentWorkspace`.
- `roles` và `permissions` hiện đã có action và UI frontend, không còn ở trạng thái "chưa triển khai".
- Snapshot mới thêm surface `telegram` gồm bot connections, destinations, feature settings, market analysis schedules, và webhook Telegram.
- Snapshot mới thêm credential sub-resource cho `ai-provider-configs` để quản lý nhiều API key theo từng provider config mà không expose full key.
- Snapshot mới tiếp tục giản lược `ai-provider-configs`: config request/response không còn `name` và top-level `model`; credential dùng field `model` thay cho `label`.
- Snapshot mới giản lược `cronjobs`: không còn endpoint create/delete cronjob; update schedule chỉ nhận `expression`.
- Snapshot mới thêm personal notes dưới `/me/notes` cho ghi chú HTML cá nhân của user hiện tại.
- Snapshot mới thêm API `languages`, persisted preferred language trên `/me/preferred-language`, và field `preferredLanguage` trong `UserResponse`.
- Snapshot mới thêm domain `narratives`, đồng thời mở rộng `market-query` với `keyNarratives[]` và `graph-view` với node/edge narrative.
- Snapshot mới bỏ endpoint `POST /news-articles/{id}/crawl-full-content`, mở rộng `system-prompts` với `responseSchema`/`localizedNames`, và thêm `evidenceNote` cho market query evidence.

## Phạm vi endpoint

### 1. API system prompts

| Phương thức | Endpoint backend               | operationId          | Tích hợp frontend                | Trạng thái    | Ghi chú                                                                  |
| ----------- | ------------------------------ | -------------------- | -------------------------------- | ------------- | ------------------------------------------------------------------------ |
| GET         | `/system-prompts`              | `getSystemPrompts`   | `getSystemPrompts(searchParams)` | Đã triển khai | List route `/system-prompts` dùng `Page<SystemPromptResponse>` và ưu tiên tên localized/backend khi hiển thị. |
| POST        | `/system-prompts`              | `createSystemPrompt` | `createSystemPrompt(request)`    | Đã triển khai | Form tạo mới gửi `promptType`, `content`, `responseSchema`, và `localizedNames` khi user nhập tên hiển thị. |
| GET         | `/system-prompts/{promptType}` | `getSystemPrompt`    | `getSystemPromptByType(type)`    | Đã triển khai | Trang chỉnh sửa dùng `promptType` đã URL-encode, load nội dung prompt, tên localized, và schema đầu ra. |
| PUT         | `/system-prompts/{promptType}` | `updateSystemPrompt` | `updateSystemPrompt(type, data)` | Đã triển khai | Form cập nhật gửi `content`, `responseSchema`, và `localizedNames` khi tên hiển thị được chỉnh sửa. |
| DELETE      | `/system-prompts/{promptType}` | `deleteSystemPrompt` | `deleteSystemPrompt(type)`       | Đã triển khai | Action xóa có `AlertDialog` và gate bằng `system-prompt:delete`.         |

Frontend liên quan:

- `app/api/system-prompts/action.ts`
- `app/lib/system-prompts/definitions.ts`
- `app/lib/system-prompts/permissions.ts`
- `app/(main)/system-prompts/*`

Ghi chú:

- Enum `promptType` trong snapshot hiện tại gồm `FIRECRAWL_SOURCE_DOCUMENT_FILTER`, `NEWS_ARTICLE_CONTENT_LOCALIZATION`, `NEWS_PRIMARY_EVENT_DERIVATION`, `EVENT_ASSET_THEME_ENRICHMENT`, `EVENT_MARKET_REACTION_DERIVATION`, `EVENT_NARRATIVE_REFRESH`, `EVENT_GROUNDED_MARKET_QUERY_SYNTHESIS`, `TELEGRAM_CALENDAR_ALERT_ASSESSMENT`, `TELEGRAM_NEWS_ALERT_ASSESSMENT`, và `TELEGRAM_MARKET_ANALYSIS`; nhóm legacy `NEWS_FILTER`, `NEWS_ANALYSIS`, `SIGNAL_GENERATION`, `DECISION_MAKING`, `CONTENT_EXTRACTION`, `SENTIMENT_ANALYSIS`, `TITLE_GENERATION`, `SUMMARY_GENERATION`, `CONTENT_CLEANING` không còn trong snapshot.
- `CreateSystemPromptRequest` hiện yêu cầu `promptType`, `content`, `responseSchema`; `UpdateSystemPromptRequest` có thêm optional `responseSchema` và `localizedNames`.
- `SystemPromptResponse` hiện có thêm `name`, `responseSchema`, `localizedNames`; `responseSchema` dùng schema `JsonNode`, frontend model bằng JSON value và cung cấp schema editor dạng builder + JSON.
- Frontend validate `content` không được rỗng sau khi `trim()` và không vượt quá `10000` ký tự; `responseSchema` phải là JSON parse được trước khi submit.

### 2. API news outlets

| Phuong thuc | Endpoint backend                   | operationId            | Tich hop frontend                    | Trang thai    | Ghi chu                                                                                                                                        |
| ----------- | ---------------------------------- | ---------------------- | ------------------------------------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| GET         | `/news-outlets`                    | `getNewsOutlets`       | `getNewsOutlets(searchParams)`       | Da trien khai | List route canon `/news-outlets` da dung `Page<NewsOutletListResponse>` va search/sort theo contract moi.                                      |
| POST        | `/news-outlets`                    | `createNewsOutlet`     | `createNewsOutlet(request)`          | Da trien khai | Form tao moi chi gui cac field snapshot moi ho tro: `name`, `description`, `homepageUrl`, `rssUrl`, `active`; khong con gui `slug`.            |
| GET         | `/news-outlets/{id}`               | `getNewsOutlet`        | `getNewsOutletById(id)`              | Da trien khai | Detail-edit route canon `/news-outlets/{id}` hydrate theo `NewsOutletResponse` khong con `slug`.                                               |
| PUT         | `/news-outlets/{id}`               | `updateNewsOutlet`     | `updateNewsOutlet(id, request)`      | Da trien khai | Form cap nhat chi gui cac field snapshot moi ho tro va khong con gui `slug` hay cac field legacy nhu `type`, `url`, `systemManaged`.           |
| DELETE      | `/news-outlets/{id}`               | `deleteNewsOutlet`     | `deleteNewsOutlet(id)`               | Da trien khai | Action xoa da duoc gate bang permission `news-outlet:delete`.                                                                                  |
| PATCH       | `/news-outlets/{id}/toggle-active` | `toggleActive`         | `toggleNewsOutletActive(id)`         | Da trien khai | Toggle active da duoc gate bang permission `news-outlet:update` va refresh lai list/detail sau mutation.                                       |
| GET         | `/news-outlets/active`             | `getActiveNewsOutlets` | `getActiveNewsOutlets(searchParams)` | Da trien khai | Helper moi da map dung response paginated `Page<NewsOutletListResponse>`; neu dung cho combobox thi FE can doc `content[]` de flatten khi can. |

Frontend lien quan:

- `app/api/news-outlets/action.ts`
- `app/lib/news-outlets/definitions.ts`
- `app/lib/news-outlets/permissions.ts`
- `app/(main)/news-outlets/*`
- `app/(main)/sources/*` (redirect compatibility)
- `app/(main)/news-sources/*` (redirect compatibility)

Ghi chu:

- `NewsOutletListResponse` hien chi con `id`, `name`, `homepageUrl`, `rssUrl`, `active`, `createdDate`; khong con `slug` hoac `description` tren list item.
- `NewsOutletResponse` hien dung `id`, `name`, `description`, `homepageUrl`, `rssUrl`, `active`, `createdDate`, `lastModifiedDate`; khong con `slug`.
- FE `app/lib/news-outlets/definitions.ts`, `app/(main)/news-outlets/news-outlet-create-form.tsx`, va `app/(main)/news-outlets/news-outlet-update-form.tsx` da bo `slug` khoi DTO, form, va payload de khop snapshot moi.
- Frontend da dung route canon `/news-outlets`; navigation "Nguon tin" trong `config/site.ts` da tro ve surface nay va duoc gate bang `news-outlet:read`.
- Cac route legacy `/sources*` va `/news-sources*` chi con redirect ve `/news-outlets*` de giu deeplink va bookmark cu; data layer va list/form/search legacy cua `/sources` da duoc xoa.
- Snapshot backend khong con field `type`, `systemManaged`, ingest metadata, hoac endpoint `/sources*`.

### 3. API news articles

Day la domain noi dung canon cua snapshot backend hien tai.

| Phuong thuc | Endpoint backend                            | operationId               | Tich hop frontend                            | Trang thai                            | Ghi chu                                                                                                                                                                                |
| ----------- | ------------------------------------------- | ------------------------- | -------------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET         | `/news-articles`                            | `getNewsArticles`         | `getNewsArticles(searchParams)`              | Da trien khai                         | FE list canon nay bo filter `documentType` va cac badge status legacy, dong bo voi schema `NewsArticleListResponse`.                                                                   |
| GET         | `/news-articles/{id}`                       | `getNewsArticle`          | `getNewsArticleById(id)`                     | Da trien khai nhung con lech contract | Detail/operator workbench dung `newsOutletId`, `newsOutletName`, `status`, `linkedEvents`, nhung schema `linkedEvents[]` da doi theo BE va `externalKey` khong con trong snapshot moi. |
| DELETE      | `/news-articles/{id}`                       | `deleteNewsArticle`       | `deleteNewsArticle(id)`                      | Da trien khai                         | Route canon va nut operator da doi naming sang `news-article`.                                                                                                                         |
| POST        | `/news-articles/{id}/derive-primary-event`  | `derivePrimaryEvent`      | `derivePrimaryEventFromNewsArticle(id)`      | Da trien khai                         | `NewsPrimaryEventDerivationResult` dung `newsArticleId`, `newsArticleTitle`, `status`, `changeType`, `eventId`, `eventCanonicalKey`.                                                   |
| POST        | `/news-articles/derive-pending-news-events` | `derivePendingNewsEvents` | `derivePendingNewsArticleEvents(batchSize?)` | Da trien khai                         | Batch result dung `PendingNewsEventDerivationBatchResult` va summary helper moi theo naming `news-article`.                                                                            |
| PATCH       | `/news-articles/{id}/feature-image`         | `updateFeatureImage`      | `updateNewsArticleFeatureImage(id, request)` | Da trien khai                         | Data layer canon nam trong `app/api/news-articles/action.ts`.                                                                                                                          |

Frontend lien quan:

- `app/api/news-articles/action.ts`
- `app/lib/news-articles/definitions.ts`
- `app/lib/news-articles/permissions.ts`
- `app/(main)/news-articles/*`
- `app/(main)/source-documents/page.tsx`
- `app/(main)/source-documents/[id]/page.tsx` (redirect compatibility)

Ghi chu:

- `NewsArticleListResponse` hien gom `title`, `description`, `url`, `featureImage`, `newsOutletId`, `newsOutletName`, `publishedAt`, `status`, `createdDate`.
- `NewsArticleResponse` hien gom `title`, `description`, `content`, `url`, `featureImage`, `newsOutletId`, `newsOutletName`, `publishedAt`, `status`, `createdDate`, `lastModifiedDate`, `linkedEvents`; `externalKey` khong con trong snapshot moi.
- Enum `status` hien tai la `INGESTED`, `DERIVATION_PENDING`, `EVENT_RESOLVED`, `NO_PRIMARY_EVENT`, `CONTENT_FAILED`, `DERIVATION_FAILED`.
- `LinkedEventSummaryResponse` hien chi con `eventStatus`, `evidenceRole`, `evidenceConfidence`, `evidenceNote`; `eventStatus` da dung enum `ENRICHMENT_PENDING`, `ENRICHED`, `ENRICHMENT_NO_MATCH`, `ENRICHMENT_FAILED`, `ARCHIVED`, va khong con `eventEnrichmentStatus`.
- FE `app/lib/news-articles/definitions.ts`, detail, va quick detail da map `linkedEvents[]` theo `eventStatus` moi va khong con render badge `eventEnrichmentStatus`.
- Navigation "Noi dung" da tro ve `/news-articles`; route `/source-documents*` chi con redirect sang surface canon moi.
- Snapshot backend khong con `lifecycleStatus`, `readinessStatus`, `eventDerivationStatus`, `documentType`, hoac endpoint canon `/source-documents*`.
- Endpoint `POST /news-articles/{id}/analyze` va `POST /news-articles/{id}/crawl-full-content` khong con nam trong snapshot OpenAPI hien tai; FE da go manual analyze, nhung `crawlNewsArticleFullContent()` va menu crawl tren detail hien con go endpoint da bi bo.

### 4. API events

| Phuong thuc | Endpoint backend                           | operationId                    | Tich hop frontend                               | Trang thai    | Ghi chu                                                                                                                                                                                               |
| ----------- | ------------------------------------------ | ------------------------------ | ----------------------------------------------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET         | `/events`                                  | `getEvents`                    | `getEvents(searchParams)`                       | Da trien khai | Frontend co route `/events`, toolbar batch-enrich + batch derive market reactions + search, sort, phan trang, va render schema moi voi `description`, mot badge `status`, `occurredAt`, `confidence`. |
| GET         | `/events/{id}`                             | `getEvent`                     | `getEventById(id)`                              | Da trien khai | Detail da uu tien status, confidence, thoi diem, description, evidence-first, action cluster ben phai title, va render section `marketReactions[]`.                                                   |
| POST        | `/events/{id}/enrich-assets-and-themes`    | `enrichAssetsAndThemes`        | `enrichEventAssetsAndThemes(id)`                | Da trien khai | Co nut operator tren event detail; toast summary da dung `EventEnrichmentResult.outcome` enum `ENRICHMENT_*` + `ARCHIVED`.                                                                            |
| POST        | `/events/{id}/derive-market-reactions`     | `deriveMarketReactions`        | `deriveEventMarketReactions(id)`                | Da trien khai | Co nut operator tren event detail; toast summary dung `reactionCount`, `neutralCount`, va `message`.                                                                                                  |
| POST        | `/events/enrich-pending-assets-and-themes` | `enrichPendingAssetsAndThemes` | `enrichPendingEventAssetsAndThemes(batchSize?)` | Da trien khai | Co nut batch tren event list; batch summary da tinh ca `deferredCount`.                                                                                                                               |
| POST        | `/events/derive-pending-market-reactions`  | `derivePendingMarketReactions` | `derivePendingEventMarketReactions(batchSize?)` | Da trien khai | Co nut batch tren event list; toast summary dung `selectedCount`, `processedCount`, `skippedCount`, `derivedCount`, `neutralCount`, `failedCount`.                                                    |

Frontend lien quan:

- `app/api/events/action.ts`
- `app/lib/events/definitions.ts`
- `app/lib/events/permissions.ts`
- `app/(main)/events/*`

Ghi chu:

- `event:read` dung de gate navigation, `/events`, `/events/{id}`, va cac link sang event detail.
- Snapshot backend hien gate event enrich operators va market reaction derivation bang `news-article:analyze`; FE events da gate bang permission canon nay truoc va chi giu `source-document:analyze` nhu alias compatibility tam thoi.
- `EventListResponse` va `EventResponse` hien dung `description` thay `summary`, `status` enum `ENRICHMENT_PENDING`, `ENRICHED`, `ENRICHMENT_NO_MATCH`, `ENRICHMENT_FAILED`, `ARCHIVED`, va khong con `slug`, `confirmedAt`, `active`, `enrichmentStatus`, `enrichmentAttemptedAt`, `enrichmentCompletedAt`, `enrichmentError`.
- `EventEvidenceSummaryResponse` hien dung `newsArticleId`, `newsArticleTitle`, `newsArticleUrl`, `newsOutletName`, `publishedAt`, `evidenceRole`, `confidence`, `evidenceNote`; FE event detail va quick detail da dung cac field `newsArticle*`.
- `EventEnrichmentResult.outcome` cung dung enum `ENRICHMENT_PENDING`, `ENRICHED`, `ENRICHMENT_NO_MATCH`, `ENRICHMENT_FAILED`, `ARCHIVED`.
- Batch enrichment result cua `/events/enrich-pending-assets-and-themes` da co them field `deferredCount`; frontend da surface trong toast summary.
- `EventResponse` co them `marketReactions[]` gom `id`, `assetId`, `assetName`, `assetSymbol`, `assetType`, `direction`, `timeHorizon`, `confidence`, `reasoning`, `observedAt`; FE da map DTO va render trong section `Tac dong thi truong` tren detail event.
- Market reaction enums moi: `direction` gom `BULLISH`, `BEARISH`, `MIXED`, `NEUTRAL`; `timeHorizon` gom `INTRADAY`, `SHORT_TERM`, `MEDIUM_TERM`, `LONG_TERM`.
- `EventMarketReactionDerivationResult` gom `eventId`, `eventTitle`, `eventCanonicalKey`, `reactionCount`, `neutralCount`, `message`; batch result gom `requestedBatchSize`, `selectedCount`, `processedCount`, `skippedCount`, `derivedCount`, `neutralCount`, `failedCount`, `results[]`.
- Detail event hien sap xep `evidence` truoc `marketReactions`, `assets`, va `themes`; vung thong tin ky thuat chi giu cac field snapshot hien tai nhu `canonicalKey`, `createdDate`, `lastModifiedDate`.

### 5. API market charts

| Phuong thuc | Endpoint backend         | operationId  | Tich hop frontend                | Trang thai                                | Ghi chu                                                                                                                                                                                                                                              |
| ----------- | ------------------------ | ------------ | -------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET         | `/market-charts/candles` | `getCandles` | `getMarketChartCandles(request)` | Da dong bo contract assetId va annotation | Endpoint duoc gate backend bang `market-chart:read`; FE gui `assetId`, `timeframe`, `from`, `to`, va `includeAnnotations` theo layer su kien; parse `provider`, optional `symbol`, `asset`, `timeframe`, `from`, `to`, `candles[]`, `annotations[]`. |

Frontend lien quan:

- `app/api/market-charts/action.ts`
- `app/lib/market-charts/definitions.ts`
- `app/lib/market-charts/permissions.ts`
- `app/(main)/market-charts/page.tsx`
- `app/(main)/market-charts/market-chart-workbench.tsx`
- `app/(main)/market-charts/market-chart-canvas.tsx`
- `app/api/watchlists/action.ts`
- `app/lib/watchlists/definitions.ts`
- Surface nay nhieu kha nang se anh huong toi `market-query` neu can hien thi chart context ben canh ket qua phan tich.

Ghi chu:

- Query contract hien duoc khai bao qua object `request` trong query string, tham chieu schema `MarketChartCandleRequest`.
- `MarketChartCandleRequest` gom `assetId`, `timeframe`, `from`, `to`, va optional `includeAnnotations`; snapshot hien tai khong mo ta enum hay danh sach gia tri hop le cho `timeframe`, trong khi FE data layer hien gioi han `timeframe` theo union `1m`, `5m`, `15m`, `30m`, `1h`, `1d`, `1w`, `1mo`.
- `MarketChartCandleItemResponse` gom `time`, `open`, `high`, `low`, `close`, `volume`.
- `MarketChartCandleResponse` co them `asset: MarketChartAssetResponse` va `annotations[]`; annotation gom `eventId`, `assetId`, `time`, `severity`, `direction`, `title`, `summary`, `confidence`, `reaction`, `evidence[]`, va `links.eventDetail`; evidence dung `newsArticleId`.
- UI khong expose `from` hoac `to` nhu form input. Route state chi gom `assetId` va `timeframe`; FE resolve asset tu `GET /watchlists`, gui `assetId` cho chart action, va de backend so huu provider-symbol resolution.
- FE mac dinh giu layer su kien tat va gui `includeAnnotations=false`; khi user bat layer su kien tren bieu do, FE gui `includeAnnotations=true`.
- UI dung KLineChart de render nen OHLCV, render marker notification tu `annotations[]`, group cac annotation cung moc thoi gian, va mo popup detail/evidence/link su kien khi user chon marker hoac moc su kien accessible ben ngoai canvas. Lazy historical loading da duoc trien khai cho huong tai nen cu hon bang chinh endpoint `/market-charts/candles`; trade recommendation van chua trien khai ve UI.

### 6. API market query

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend      | Trang thai                            | Ghi chu                                                                                                                                                                                                                                          |
| ----------- | ---------------- | ----------- | ---------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| POST        | `/query`         | `query`     | `queryMarket(request)` | Da trien khai nhung con lech contract | Route `/market-query` render workbench briefing gom `answer`, `reasoningChain`, `keyEvents`, `assetsConsidered`, `confidence`, `limitations`, va `evidence`; FE chua map `keyNarratives[]`. |

Frontend lien quan:

- `app/api/query/action.ts`
- `app/lib/market-query/definitions.ts`
- `app/lib/market-query/permissions.ts`
- `app/(main)/market-query/page.tsx`
- `app/(main)/market-query/market-query-workbench.tsx`

Ghi chu:

- Spec request cua `POST /query` van cho phep field optional `asOfTime`, nhung workbench frontend v1 chu dong khong gui field nay de backend tu lay thoi diem hien tai.
- Snapshot OpenAPI hien tai mo ta `evidence[].publishedAt` va `keyEvents[].occurredAt` la `date-time` string; frontend market-query definitions dang cho phep them `null` de tuong thich voi payload runtime da quan sat.
- `MarketQueryKeyEventResponse` da doi `summary` thanh `description`; `app/lib/market-query/definitions.ts` va `app/(main)/market-query/market-query-key-events.tsx` hien van doc field cu.
- `MarketQueryResponse` co them `keyNarratives[]`; `MarketQueryKeyNarrativeResponse` gom `id`, `title`, `thesis`, `status`, `confidence`, `primaryAssetSymbol`, `primaryThemeSlug`, `supportingEventIds`. FE chua co type/schema/UI cho field nay.
- `MarketQueryEvidenceResponse` hien dung `eventId`, `eventTitle`, `newsArticleId`, `newsArticleTitle`, `newsArticleUrl`, `newsOutletName`, `publishedAt`, `evidenceRole`, `evidenceConfidence`, `evidenceNote`; FE market-query definitions/list hien van doc `artifact*` va chua render `evidenceNote`.

### 7. API graph view

| Phuong thuc | Endpoint backend | operationId    | Tich hop frontend | Trang thai                            | Ghi chu                                                                                                                                                                              |
| ----------- | ---------------- | -------------- | ----------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GET         | `/graph-view`    | `getGraphView` | `getGraphView()`  | Da trien khai | Frontend co route `/graph-view`, page shell duoc gate bang `graph-view:read`, va workbench G6 browse graph theo payload `nodes[]` + `edges[]`, gom narrative node/edge runtime. |

Ghi chu:

- Response snapshot hien tai la `GraphViewResponse` gom `nodes[]` va `edges[]`.
- `nodes[].kind` hien tai gom `event`, `asset`, `theme`, `news-article`, `narrative`; `edges[].kind` gom `event-asset`, `event-theme`, `news-article-event`, `narrative-event`, `narrative-asset`.
- `GraphNodeMetadata` hien da dung `newsOutletName` thay vi `sourceName`, dong thoi doi `active` thanh `status` va them `narrativeStatus`, `thesis`.
- Frontend `app/lib/graph-view/definitions.ts` va `app/[lang]/(main)/graph-view/*` da model/render `news-article`, `news-article-event`, `narrative`, `narrative-event`, `narrative-asset`, `newsOutletName`, `narrativeStatus`, va `thesis`.
- `docs/api_mapping.json` hien van stale neu chua duoc refresh tu backend OpenAPI moi; runtime BE source da co narrative graph kinds.
- Drill-down cho node bai viet da chuyen sang `/news-articles/{id}`.

### 8. API narratives

| Phuong thuc | Endpoint backend                      | operationId                 | Tich hop frontend | Trang thai      | Ghi chu                                                        |
| ----------- | ------------------------------------- | --------------------------- | ----------------- | --------------- | -------------------------------------------------------------- |
| GET         | `/narratives`                         | `getNarratives`             | `-`               | Chua trien khai | Tra ve `PageNarrativeSummaryResponse`; permission `narrative:read`. |
| GET         | `/narratives/{id}`                    | `getNarrative`              | `-`               | Chua trien khai | Detail gom core narrative, `assets[]`, va `events[]`; permission `narrative:read`. |
| PUT         | `/narratives/{id}/status`             | `updateStatus`              | `-`               | Chua trien khai | Cap nhat status qua `UpdateNarrativeStatusRequest`; permission `narrative:manage`. |
| POST        | `/narratives/{id}/archive`            | `archiveNarrative`          | `-`               | Chua trien khai | Archive narrative; permission `narrative:manage`.             |
| POST        | `/narratives/{id}/refresh`            | `refreshNarrative`          | `-`               | Chua trien khai | Refresh mot narrative; permission `narrative:manage`.         |
| POST        | `/narratives/refresh-event/{eventId}` | `refreshNarrativesForEvent` | `-`               | Chua trien khai | Refresh narratives theo event; permission `narrative:manage`. |
| POST        | `/narratives/refresh-pending`         | `refreshPendingNarratives`  | `-`               | Chua trien khai | Batch refresh pending narratives; permission `narrative:manage`. |

Ghi chu:

- `NarrativeSummaryResponse` gom `title`, `slug`, `thesis`, `summary`, `status`, `confidence`, `firstObservedAt`, `lastUpdatedAt`, primary asset/theme fields.
- `NarrativeResponse` them `assets[]` va `events[]`; asset relation enum gom `PRIMARY`, `AFFECTED`, event relation enum gom `DRIVER`, `SUPPORTING`, `CONTRADICTING`.
- `status` gom `EMERGING`, `ACTIVE`, `WEAKENING`, `INVALIDATED`, `ARCHIVED`.
- Frontend hien chua co route, action, definitions, permissions, navigation, list/detail, hay operator UI cho narratives.

### 9. API blogs

| Phuong thuc | Endpoint backend | operationId      | Tich hop frontend         | Trang thai                            | Ghi chu                                 |
| ----------- | ---------------- | ---------------- | ------------------------- | ------------------------------------- | --------------------------------------- |
| GET         | `/blogs`         | `getBlogPosts`   | `getBlogs(searchParams)`  | Da trien khai                         | Tra ve `Page<BlogPostListResponse>`.    |
| POST        | `/blogs`         | `createBlogPost` | `createBlog(request)`     | Da trien khai nhung con lech contract | Backend create schema dung `visible`.   |
| GET         | `/blogs/{id}`    | `getBlogPost`    | `getBlogById(id)`         | Da trien khai nhung con lech contract | Response backend dung `visible`.        |
| PUT         | `/blogs/{id}`    | `updateBlogPost` | `updateBlog(id, request)` | Da trien khai                         | Backend update schema dung `isVisible`. |
| DELETE      | `/blogs/{id}`    | `deleteBlogPost` | `deleteBlog(id)`          | Da trien khai                         | Duoc boc trong `ActionResult`.          |

Ghi chu:

- Snapshot hien tai tiep tuc dung `visible` cho create request va cho ca list/detail response, trong khi update request van dung `isVisible`.
- Frontend blogs hien van standardize theo `isVisible` trong definitions va form, nen create payload va mapping list/detail response van la diem drift can xu ly khi dong bo code.

### 10. API cronjobs

| Phuong thuc | Endpoint backend        | operationId | Tich hop frontend            | Trang thai                 | Ghi chu                                                                       |
| ----------- | ----------------------- | ----------- | ---------------------------- | -------------------------- | ----------------------------------------------------------------------------- |
| GET         | `/cronjobs`             | `list`      | `getCronjobs(searchParams)`  | Da trien khai              | Tra ve `Page<CronjobListResponse>`.                                           |
| GET         | `/cronjobs/{id}`        | `get`       | `getCronjobById(id)`         | Da trien khai              | Co action typed, khong con route detail/update frontend.                      |
| PATCH       | `/cronjobs/{id}`        | `update`    | `updateCronjob(id, request)` | Da trien khai              | FE cap nhat inline tren list va chi gui `{ expression }`.                     |
| POST        | `/cronjobs/{id}/start`  | `start`     | `startCronjob(id)`           | Da trien khai              | Co UX.                                                                        |
| POST        | `/cronjobs/{id}/pause`  | `pause`     | `pauseCronjob(id)`           | Da trien khai              | Co UX.                                                                        |
| POST        | `/cronjobs/{id}/resume` | `resume`    | `resumeCronjob(id)`          | Da trien khai              | Co UX.                                                                        |
| POST        | `/cronjobs/{id}/stop`   | `stop`      | `-`                          | Khong tich hop co chu dich | Backend co endpoint nhung frontend khong expose stop trong scope UI hien tai. |

Ghi chu:

- Snapshot moi khong con `POST /cronjobs` va `DELETE /cronjobs/{id}`; FE da go create/delete flow va khong con gate `cronjob:create`/`cronjob:delete` tren UI cronjobs.
- `CronjobRequest` trong snapshot moi chi con `expression`; FE da dong bo request type va update inline tren list theo contract nay.

### 11. API AI provider configs

| Phuong thuc | Endpoint backend                                       | operationId              | Tich hop frontend                                       | Trang thai                            | Ghi chu                                                                                                                                                      |
| ----------- | ------------------------------------------------------ | ------------------------ | ------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GET         | `/ai-provider-configs`                                 | `getAiProviderConfigs`   | `getAiProviderConfigs(searchParams)`                    | Da trien khai nhung con lech runtime | Runtime frontend van dung `page/size/sort` va gui `filter` rong theo helper hien tai; FE da bo search/sort theo `name` vi `SpecificationAiProviderConfig` dang rong. |
| POST        | `/ai-provider-configs`                                 | `createAiProviderConfig` | `createAiProviderConfig(request)`                       | Da trien khai                         | Gui `providerType`, `description`, `baseUrl`, `defaultProvider`, va `credentials[]`; moi credential gui `apiKey` + `model`.                                  |
| GET         | `/ai-provider-configs/{id}`                            | `getAiProviderConfig`    | `getAiProviderConfigById(id)`                           | Da trien khai                         | Detail doc metadata config va `credentials[]` voi `model`, `keyPreview`, timestamps; khong con doc `name`, top-level `model`, hoac `label`.                  |
| PUT         | `/ai-provider-configs/{id}`                            | `updateAiProviderConfig` | `updateAiProviderConfig(id, request)`                   | Da trien khai                         | Update metadata config: `providerType`, `description`, `baseUrl`, `defaultProvider`; model duoc cap nhat tren tung credential.                              |
| DELETE      | `/ai-provider-configs/{id}`                            | `deleteAiProviderConfig` | `deleteAiProviderConfig(id)`                            | Da trien khai                         | Duoc boc trong `ActionResult`.                                                                                                                               |
| PATCH       | `/ai-provider-configs/{id}/set-default`                | `setDefault`             | `setAiProviderConfigDefault(id)`                        | Da trien khai                         | Da tich hop.                                                                                                                                                 |
| POST        | `/ai-provider-configs/model-catalog`                   | `getModelCatalog`        | `getAiProviderModelCatalog(request)`                    | Da trien khai                         | Tai model catalog bang `providerType`, `apiKey`, `baseUrl`; UI goi theo tung credential truoc khi cho chon model.                                           |
| GET         | `/ai-provider-configs/{id}/credentials`                | `getCredentials`         | `getAiProviderCredentials(id)`                          | Da trien khai                         | Doc danh sach credential, response `AiProviderCredentialResponse[]`; permission `ai-provider-config:read`.                                                   |
| POST        | `/ai-provider-configs/{id}/credentials`                | `createCredential`       | `createAiProviderCredential(id, request)`               | Da trien khai                         | Tao credential bang `apiKey` va `model`; UI yeu cau validate API key va chon model truoc khi submit.                                                        |
| PUT         | `/ai-provider-configs/{id}/credentials/{credentialId}` | `updateCredential`       | `updateAiProviderCredential(id, credentialId, request)` | Da trien khai                         | Cap nhat credential bang optional `apiKey`, `model`; UI update yeu cau API key moi duoc validate va chon model moi.                                        |
| DELETE      | `/ai-provider-configs/{id}/credentials/{credentialId}` | `deleteCredential`       | `deleteAiProviderCredential(id, credentialId)`          | Da trien khai                         | Xoa credential qua `AlertDialog`; permission `ai-provider-config:delete`.                                                                                    |

Ghi chu:

- `AiProviderCredentialResponse` gom `id`, `model`, `keyPreview`, `lastUsedDate`, `rateLimitedUntil`, `createdDate`, `lastModifiedDate`; khong expose full `apiKey` va khong con `label`.
- `CreateAiProviderConfigRequest` bat buoc `credentials[]`; moi credential bat buoc `apiKey` va `model`. Config create khong con `name` hay top-level `model`.
- `UpdateAiProviderConfigRequest` chi con `providerType`, `description`, `baseUrl`, `defaultProvider`; credential add/update/delete nam trong sub-resource rieng.
- `SpecificationAiProviderConfig` trong snapshot hien la `{}`, nen UI tam thoi khong render search/filter theo `name` va chi giu sort `id_asc/id_desc` cho den khi BE xac nhan runtime filter moi.
- Enum provider hien gom `GEMINI`, `GROQ`, `OPENAI`, `ZAI`; FE da dong bo type, validation, select option, va model catalog request.

### 12. API assets

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend         | Trang thai    | Ghi chu                   |
| ----------- | ---------------- | ----------- | ------------------------- | ------------- | ------------------------- |
| GET         | `/assets`        | `getAssets` | `getAssets(searchParams)` | Da trien khai | Asset catalog read-only.  |
| GET         | `/assets/{id}`   | `getAsset`  | `getAssetById(id)`        | Da trien khai | Co helper hydrate detail. |

Ghi chu:

- Snapshot moi cua `AssetListResponse` va `AssetResponse` chi gom `id`, `name`, `symbol`, `type` tren list va them `createdDate`, `lastModifiedDate` tren detail; khong co `slug`. FE assets definitions hien khop shape nay.

### 13. API media

| Phuong thuc | Endpoint backend | operationId   | Tich hop frontend | Trang thai      | Ghi chu                             |
| ----------- | ---------------- | ------------- | ----------------- | --------------- | ----------------------------------- |
| GET         | `/medias`        | `getMedias`   | `-`               | Chua trien khai | Chua co `app/api/medias/action.ts`. |
| GET         | `/medias/{id}`   | `getMedia`    | `-`               | Chua trien khai | Chua co tich hop.                   |
| DELETE      | `/medias/{id}`   | `deleteMedia` | `-`               | Chua trien khai | Chua co tich hop.                   |
| POST        | `/medias/upload` | `upload`      | `-`               | Chua trien khai | Chua co tich hop.                   |

### 14. API economic calendar

| Phương thức | Endpoint backend          | operationId                   | Tích hợp frontend                          | Trạng thái    | Ghi chú                                                                                                                                  |
| ----------- | ------------------------- | ----------------------------- | ------------------------------------------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| GET         | `/economic-calendar`      | `getEconomicCalendarEntries`  | `getEconomicCalendarEntries(searchParams)` | Đã triển khai | Trả về `Page<EconomicCalendarListResponse>` với schema đã giản lược; frontend dùng `$filter/page/size/sort` qua `queryParamsToString()`. |
| GET         | `/economic-calendar/{id}` | `getEconomicCalendarEntry`    | `getEconomicCalendarEntryById(id)`         | Đã triển khai | Trả về `EconomicCalendarResponse` cho trang chi tiết read-only, có `content` khi nội dung đã sẵn sàng.                                   |
| POST        | `/economic-calendar/sync` | `syncEconomicCalendarEntries` | `syncEconomicCalendarEntries()`            | Đã triển khai | Trả về `EconomicCalendarSyncResponse` với `fetchedCount`, `createdCount`, `updatedCount`, `skippedCount`.                                |

Ghi chú:

- Frontend đã có `app/api/economic-calendar/action.ts`, definitions, permissions, navigation và route UI `/economic-calendar`.
- List/detail response hiện dùng các trường chính: `title`, `currencyCode`, `impact`, `forecastValue`, `previousValue`, `actualValue`, `contentAvailable`, `status`, `scheduledAt`, `syncedAt`, `createdDate`, `lastModifiedDate`.
- Detail response có thêm `content`; UI chỉ hiển thị nội dung khi `contentAvailable` là true và `content` có dữ liệu.
- Frontend không còn phụ thuộc vào các field cũ đã bị backend loại bỏ như `description`, `url`, `externalKey`, `provider`, `countryCode`, `importance`, `ingestedAt`, `rawContent`, hoặc `rawMetadata`.

### 15. API workspace

| Phuong thuc | Endpoint backend                  | operationId           | Tich hop frontend               | Trang thai  | Ghi chu                                                                                      |
| ----------- | --------------------------------- | --------------------- | ------------------------------- | ----------- | -------------------------------------------------------------------------------------------- |
| GET         | `/me/workspaces`                  | `getMyWorkspaces`     | `getMyWorkspaces(searchParams)` | Da tich hop | `WorkspaceResponse` frontend dung `currentWorkspace` va khong con doc/hien thi `slug`.       |
| POST        | `/me/workspaces`                  | `createWorkspace`     | `createWorkspace(request)`      | Da tich hop | Snapshot moi chi nhan `name`; workspace switcher chi gui payload `name`.                     |
| PUT         | `/me/workspaces/{id}`             | `updateWorkspace`     | `updateWorkspace(id, request)`  | Da tich hop | Snapshot moi chi cap nhat `name`; workspace switcher chi gui payload `name`.                 |
| PATCH       | `/me/workspaces/{id}/set-current` | `setCurrentWorkspace` | `setCurrentWorkspace(id)`       | Da tich hop | Frontend goi dung `/set-current` va gate bang permission chinh thuc `workspace:set-current`. |

### 16. API user

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai  | Ghi chu                                                                                                                          |
| ----------- | ---------------- | ----------- | ----------------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| GET         | `/me`            | `me`        | `getMe()`         | Da tich hop nhung con lech contract | `UserResponse` co them `preferredLanguage`; `BackendMeResponse` hien chua map field nay, permission loader tiep tuc chi doc `permissions[]`. |

### 17. API languages

| Phuong thuc | Endpoint backend          | operationId               | Tich hop frontend | Trang thai      | Ghi chu                                                                    |
| ----------- | ------------------------- | ------------------------- | ----------------- | --------------- | -------------------------------------------------------------------------- |
| GET         | `/languages`              | `getLanguages`            | `-`               | Chua trien khai | Tra ve `LanguageCatalogResponse`; auth type `active-user`.                 |
| PATCH       | `/me/preferred-language`  | `updatePreferredLanguage` | `-`               | Chua trien khai | Luu preferred language bang `{ isoCode }` va tra ve `UserResponse`.        |

Ghi chu:

- `LanguageCatalogResponse` gom `currentLanguage`, `preferredLanguage`, `languages[]`; `LanguageResponse` gom `id`, `isoCode`, `name`.
- Frontend hien da co URL locale prefix, `Accept-Language`, va language selector theo route local state, nhung chua goi `/languages` hay persist `/me/preferred-language`.

### 18. API personal notes

| Phuong thuc | Endpoint backend | operationId          | Tich hop frontend | Trang thai      | Ghi chu                                                            |
| ----------- | ---------------- | -------------------- | ----------------- | --------------- | ------------------------------------------------------------------ |
| GET         | `/me/notes`      | `getPersonalNotes`   | `getPersonalNotes(searchParams)`   | Da tich hop | Route `/notes` va quick Sheet header dung `Page<PersonalNoteResponse>`; permission `personal-note:read`. |
| POST        | `/me/notes`      | `createPersonalNote` | `createPersonalNote(request)`      | Da tich hop | Tao note bang `contentHtml`; permission `personal-note:create`.                              |
| GET         | `/me/notes/{id}` | `getPersonalNote`    | `getPersonalNote(id)`              | Da tich hop | Doc detail note de nap vao editor/viewer; permission `personal-note:read`.                  |
| PUT         | `/me/notes/{id}` | `updatePersonalNote` | `updatePersonalNote(id, request)`  | Da tich hop | Cap nhat duy nhat `contentHtml`; permission `personal-note:update`.                         |
| DELETE      | `/me/notes/{id}` | `deletePersonalNote` | `deletePersonalNote(id)`           | Da tich hop | Xoa note qua AlertDialog; permission `personal-note:delete`.                                |

Ghi chu:

- `CreatePersonalNoteRequest` va `UpdatePersonalNoteRequest` chi co `contentHtml`.
- `PersonalNoteResponse` gom `id`, `contentHtml`, `createdDate`, `lastModifiedDate`.
- Frontend co route `/notes`, quick Sheet trong header, action/definitions/permission helper, editor HTML app-level, va presentation mode cho screen share.

### 19. API wiki

Khong con tich hop frontend.

Ghi chu:

- Toan bo route, action, definition, va UI surface `wiki` da duoc go khoi frontend.
- Neu backend tai xuat wiki trong tuong lai, nen de xuat mot change moi thay vi tai su dung module cu.

### 20. API roles

| Phuong thuc | Endpoint backend               | operationId             | Tich hop frontend                         | Trang thai    | Ghi chu                                            |
| ----------- | ------------------------------ | ----------------------- | ----------------------------------------- | ------------- | -------------------------------------------------- |
| GET         | `/roles`                       | `getRoles`              | `getRoles()`                              | Da trien khai | Trang roles da load danh sach vai tro.             |
| PUT         | `/roles/{roleKey}/permissions` | `updateRolePermissions` | `updateRolePermissions(roleKey, request)` | Da trien khai | Dialog frontend cho phep cap nhat permission keys. |

### 21. API permissions

| Phuong thuc | Endpoint backend | operationId      | Tich hop frontend  | Trang thai    | Ghi chu                                                 |
| ----------- | ---------------- | ---------------- | ------------------ | ------------- | ------------------------------------------------------- |
| GET         | `/permissions`   | `getPermissions` | `getPermissions()` | Da trien khai | Duoc dung cung role editor de build permission catalog. |

### 22. API watchlists

| Phuong thuc | Endpoint backend               | operationId       | Tich hop frontend                            | Trang thai    | Ghi chu                                                 |
| ----------- | ------------------------------ | ----------------- | -------------------------------------------- | ------------- | ------------------------------------------------------- |
| GET         | `/watchlists`                  | `getWatchlist`    | `getWorkspaceWatchlistAssets(searchParams)`  | Da trien khai | Frontend da doi naming sang workspace watchlist assets. |
| POST        | `/watchlists`                  | `createWatchlist` | `addAssetToWorkspaceWatchlist({ assetId })`  | Da trien khai | Sync add theo diff trong workspace editor.              |
| DELETE      | `/watchlists/assets/{assetId}` | `deleteByAssetId` | `removeAssetFromWorkspaceWatchlist(assetId)` | Da trien khai | Sync remove theo diff.                                  |

### 23. API telegram

| Phuong thuc | Endpoint backend                                   | operationId            | Tich hop frontend                                  | Trang thai                            | Ghi chu                                                                                                                                            |
| ----------- | -------------------------------------------------- | ---------------------- | -------------------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET         | `/telegram/bot-connections`                        | `getConnections`       | `getTelegramBotConnections()`                      | Da tich hop                           | Doc danh sach bot connection; permission `telegram-bot-connection:read`.                                                                           |
| POST        | `/telegram/bot-connections`                        | `createConnection`     | `createTelegramBotConnection(request)`             | Da tich hop                           | Tao bot connection tu `botToken`, `displayLabel`; permission `telegram-bot-connection:manage`.                                                     |
| PATCH       | `/telegram/bot-connections/{id}`                   | `updateConnection`     | `updateTelegramBotConnection(id, request)`         | Da tich hop                           | Cap nhat `displayLabel`; permission `telegram-bot-connection:manage`.                                                                              |
| PATCH       | `/telegram/bot-connections/{id}/disable`           | `disableConnection`    | `disableTelegramBotConnection(id)`                 | Da tich hop                           | Disable bot connection va tra ve `TelegramBotConnectionResponse`; permission `telegram-bot-connection:manage`.                                     |
| DELETE      | `/telegram/bot-connections/{id}`                   | `removeConnection`     | `deleteTelegramBotConnection(id)`                  | Da tich hop                           | Xoa bot connection qua `AlertDialog`; permission `telegram-bot-connection:manage`.                                                                |
| GET         | `/telegram/destinations`                           | `getDestinations`      | `getTelegramDestinations()`                        | Da tich hop                           | Doc chat/channel da link; permission `telegram-destination:read`.                                                                                  |
| POST        | `/telegram/destinations/link-token`                | `createLinkToken`      | `createTelegramLinkToken(request)`                 | Da tich hop                           | Tao link token tu `botConnectionId` de user link destination qua Telegram; permission `telegram-destination:manage`.                               |
| PATCH       | `/telegram/destinations/{id}`                      | `updateDestination`    | `updateTelegramDestination(id, request)`           | Da tich hop                           | Cap nhat `displayLabel`; permission `telegram-destination:manage`.                                                                                 |
| PATCH       | `/telegram/destinations/{id}/disable`              | `disableDestination`   | `disableTelegramDestination(id)`                   | Da tich hop                           | Disable destination va tra ve `TelegramDestinationResponse`; permission `telegram-destination:manage`.                                             |
| DELETE      | `/telegram/destinations/{id}`                      | `removeDestination`    | `deleteTelegramDestination(id)`                    | Da tich hop                           | Xoa destination qua `AlertDialog`; permission `telegram-destination:manage`.                                                                       |
| GET         | `/telegram/feature-settings`                       | `getFeatureSettings`   | `getTelegramFeatureSettings()`                     | Da tich hop nhung con lech contract | Response them `outputLanguage`; FE definitions/UI chua map field nay.                                                                              |
| PUT         | `/telegram/feature-settings`                       | `updateFeatureSetting` | `updateTelegramFeatureSetting(request)`            | Da tich hop nhung con lech contract | Request them optional `outputLanguageIsoCode`; FE hien chua gui field nay.                                                                         |
| GET         | `/telegram/market-analysis-schedules`              | `getSchedules`         | `getTelegramMarketAnalysisSchedules()`             | Da tich hop nhung con lech contract | Response them `outputLanguage`; FE definitions/UI chua map field nay.                                                                              |
| POST        | `/telegram/market-analysis-schedules`              | `createSchedule`       | `createTelegramMarketAnalysisSchedule(request)`    | Da tich hop nhung con lech contract | Request them optional `outputLanguageIsoCode`; FE hien chua gui field nay.                                                                         |
| PUT         | `/telegram/market-analysis-schedules/{id}`         | `updateSchedule`       | `updateTelegramMarketAnalysisSchedule(id, request)` | Da tich hop nhung con lech contract | Request them optional `outputLanguageIsoCode`; FE hien chua gui field nay.                                                                         |
| PATCH       | `/telegram/market-analysis-schedules/{id}/disable` | `disableSchedule`      | `disableTelegramMarketAnalysisSchedule(id)`        | Da tich hop                           | Disable schedule va tra ve `TelegramMarketAnalysisScheduleResponse`; permission `telegram-market-analysis-schedule:manage`.                        |
| DELETE      | `/telegram/market-analysis-schedules/{id}`         | `removeSchedule`       | `deleteTelegramMarketAnalysisSchedule(id)`         | Da tich hop                           | Xoa schedule qua `AlertDialog`; permission `telegram-market-analysis-schedule:manage`.                                                            |

Ghi chu:

- Frontend hien co route `/telegram`, action, definitions, permission helper, navigation, va UI quan tri bot/destination/routing/schedule.
- DTO chinh moi gom `TelegramBotConnectionResponse`, `TelegramDestinationResponse`, `TelegramFeatureSettingResponse`, `TelegramMarketAnalysisScheduleResponse`, `TelegramLinkTokenResponse`, va `ScheduledAssetResponse`.
- Enum feature key cua Telegram gom `ECONOMIC_CALENDAR_ALERT`, `MARKET_NEWS_ALERT`, `SCHEDULED_MARKET_ANALYSIS`; day la enum cua feature setting, khong phai system prompt type.
- Snapshot moi them `outputLanguageIsoCode` trong request feature setting/schedule va `outputLanguage` trong response; FE Telegram chua expose cau hinh output language.
- Snapshot import nhieu schema Telegram Bot API cho webhook `Update`; FE admin khong nen model toan bo nhom schema nay neu chi tich hop man hinh cau hinh.

### 24. Webhook

| Phuong thuc | Endpoint backend                    | operationId            | Tich hop frontend | Trang thai  | Ghi chu                                                     |
| ----------- | ----------------------------------- | ---------------------- | ----------------- | ----------- | ----------------------------------------------------------- |
| POST        | `/webhooks/clerk`                   | `handleClerkWebhook`   | `-`               | Chi backend | Khong ky vong co frontend caller.                           |
| POST        | `/webhooks/telegram/{connectionId}` | `handleTelegramUpdate` | `-`               | Chi backend | Webhook nhan `Update` tu Telegram, khong ky vong FE caller. |

### 25. Health check

| Phuong thuc | Endpoint backend | operationId   | Tich hop frontend | Trang thai      | Ghi chu               |
| ----------- | ---------------- | ------------- | ----------------- | --------------- | --------------------- |
| GET         | `/health`        | `healthCheck` | `-`               | Chua trien khai | Chua co helper rieng. |

## Nhom frontend khong nam trong snapshot API hien tai

Nhung nhom duoi day van ton tai tren frontend, nhung khong xuat hien trong `docs/api_mapping.json` hien tai.

| Nhom             | Tinh trang frontend                                                                                     | Ghi chu                                                                                       |
| ---------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Sources          | `app/(main)/sources/page.tsx`, `app/(main)/sources/create/page.tsx`, `app/(main)/sources/[id]/page.tsx` | Chi con route redirect compatibility; data layer va UI legacy cua `/sources` da duoc xoa.     |
| Source documents | `app/(main)/source-documents/page.tsx`, `app/(main)/source-documents/[id]/page.tsx`                     | Chi con route redirect compatibility cho deeplink cu; data layer canon da la `news-articles`. |
| Topics           | `app/api/topics/action.ts`, `app/lib/topics/definitions.ts`, `app/(main)/topics/*`                      | Frontend van co module topics, nhung snapshot API hien tai khong co `/topics*`.               |

## Cac kieu dung chung o frontend

### SearchParams

```ts
interface SearchParams {
  filter: string
  page: number
  size: number
  sort: {
    field: string
    direction: "asc" | "desc"
  }[]
}
```

Duoc `queryParamsToString()` serialize thanh:

- `$filter`
- `page`
- `size`
- `sort=field,direction`

### Page<T>

```ts
interface Page<T> {
  content: T[]
  pageable: {
    pageNumber: number
    pageSize: number
    offset: number
    paged: boolean
    unpaged: boolean
  }
  last: boolean
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  numberOfElements: number
  empty: boolean
}
```

### ActionResult<T>

```ts
type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }
```

## Cac file type/action phia frontend

| Khu vuc                                   | File frontend                                                                                                                                                   |
| ----------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Helper dung chung                         | `app/lib/definitions.ts`, `app/lib/utils.ts`                                                                                                                    |
| Tang van chuyen auth                      | `app/api/auth/action.ts`                                                                                                                                        |
| News outlets                              | `app/api/news-outlets/action.ts`, `app/lib/news-outlets/definitions.ts`, `app/lib/news-outlets/permissions.ts`, `app/(main)/news-outlets/*`                     |
| News articles                             | `app/api/news-articles/action.ts`, `app/lib/news-articles/definitions.ts`, `app/lib/news-articles/permissions.ts`, `app/(main)/news-articles/*`                 |
| Sources (legacy, ngoai snapshot)          | `app/(main)/sources/page.tsx`, `app/(main)/sources/create/page.tsx`, `app/(main)/sources/[id]/page.tsx` (redirect compatibility)                                |
| Source documents (legacy, ngoai snapshot) | `app/(main)/source-documents/page.tsx`, `app/(main)/source-documents/[id]/page.tsx` (redirect compatibility)                                                    |
| Events                                    | `app/api/events/action.ts`, `app/lib/events/definitions.ts`, `app/lib/events/permissions.ts`, `app/(main)/events/*`                                             |
| Market charts                             | `app/api/market-charts/action.ts`, `app/lib/market-charts/definitions.ts`, `app/lib/market-charts/permissions.ts`, `app/(main)/market-charts/*`                 |
| Market query                              | `app/api/query/action.ts`, `app/lib/market-query/definitions.ts`, `app/lib/market-query/permissions.ts`, `app/(main)/market-query/*`                            |
| Graph view                                | `app/api/graph-view/action.ts`, `app/lib/graph-view/definitions.ts`, `app/lib/graph-view/permissions.ts`, `app/(main)/graph-view/*`                             |
| Narratives                                | `-`                                                                                                                                                             |
| Blogs                                     | `app/api/blogs/action.ts`, `app/lib/blogs/definitions.ts`                                                                                                       |
| Cronjobs                                  | `app/api/cronjobs/action.ts`, `app/lib/cronjobs/definitions.ts`                                                                                                 |
| AI provider configs                       | `app/api/ai-provider-configs/action.ts`, `app/lib/ai-provider-configs/definitions.ts`                                                                           |
| Assets                                    | `app/api/assets/action.ts`, `app/lib/assets/definitions.ts`                                                                                                     |
| Economic calendar                         | `app/api/economic-calendar/action.ts`, `app/lib/economic-calendar/definitions.ts`, `app/lib/economic-calendar/permissions.ts`, `app/(main)/economic-calendar/*` |
| User profile                              | `app/api/user/action.ts`, `app/lib/users/definitions.ts`                                                                                                        |
| Languages                                 | `components/language-selector.tsx`, `app/lib/i18n/*` (route-locale only; no backend language action yet)                                                        |
| Personal notes                            | `app/api/personal-notes/action.ts`, `app/lib/personal-notes/definitions.ts`, `app/lib/personal-notes/permissions.ts`, `app/(main)/notes/*`, `components/personal-notes-quick-sheet.tsx` |
| Workspace                                 | `app/api/workspaces/action.ts`, `app/lib/workspaces/definitions.ts`                                                                                             |
| Watchlists                                | `app/api/watchlists/action.ts`, `app/lib/watchlists/definitions.ts`, `components/workspace-watchlist-editor.tsx`, `components/asset-multi-select-combobox.tsx`  |
| Telegram                                  | `app/api/telegram/action.ts`, `app/lib/telegram/definitions.ts`, `app/lib/telegram/permissions.ts`, `app/[lang]/(main)/telegram/*`                              |
| Roles va permissions                      | `app/api/roles/action.ts`, `app/lib/roles/definitions.ts`, `app/(main)/roles/*`                                                                                 |
| Route user cuc bo                         | `app/api/user/route.ts`                                                                                                                                         |
| Media                                     | `-`                                                                                                                                                             |
| System prompts                            | `app/api/system-prompts/action.ts`, `app/lib/system-prompts/definitions.ts`, `app/lib/system-prompts/permissions.ts`, `app/(main)/system-prompts/*`             |
| Topics (ngoai spec hien tai)              | `app/api/topics/action.ts`, `app/lib/topics/definitions.ts`, `app/(main)/topics/*`                                                                              |

## Cac diem lech contract da biet

- List/search runtime cua frontend dang dung `$filter/page/size/sort`, trong khi OpenAPI tiep tuc mo ta `specification/pageable` o nhieu list endpoint.
- Frontend da migrate route canon sang `/news-outlets*` va `/news-articles*`; `/sources*`, `/news-sources*`, va `/source-documents*` chi con redirect compatibility.
- `news articles`: `linkedEvents[]` da co `eventStatus` enum moi theo enrichment lifecycle va khong con `eventEnrichmentStatus`; FE detail va quick detail da map theo contract moi.
- `events`: backend gate enrich/market reaction operators bang `news-article:analyze`; FE events da gate bang permission canon nay truoc va chi giu `source-document:analyze` nhu alias compatibility tam thoi.
- `permission scan`: cac literal FE-only `source-document:*` con lai deu la alias compatibility sau permission canon `news-article:*`; cac permission BE chua co FE literal gom `cronjob:stop`, `media:*`, va `narrative:*` vi cac surface/action nay chua duoc tich hop.
- `system prompts`: frontend đã đồng bộ enum prompt type hiện tại, DTO `name`/`responseSchema`/`localizedNames`, create request bắt buộc `responseSchema`, và form schema editor dạng builder + JSON.
- `market charts`: frontend da dong bo action/DTO theo request `assetId`, `includeAnnotations` theo layer su kien, response `asset`, optional `symbol`, va `annotations[]`; UI dung KLineChart cho nen OHLCV va render marker notification/popup detail khi layer su kien duoc bat.
- `news outlets`: snapshot moi da bo `slug` khoi create/update/list/detail va bo `description` khoi list item; FE form/DTO da dong bo, list khong render cac field nay, con detail/edit van giu `description` theo response.
- `workspace`: frontend da bo `slug` khoi create/update/response definitions, workspace switcher payload/UI, va trang tong quan workspace de khop snapshot moi.
- `news articles`: snapshot moi da bo `externalKey`; `app/lib/news-articles/definitions.ts` da duoc don de khong con giu field nay. Snapshot ngay 25/5 tiep tuc bo endpoint crawl full content, nhung FE van con action `crawlNewsArticleFullContent()` va menu crawl tren detail.
- `events`: snapshot moi da bo `slug` va `confirmedAt`, va doi evidence sang `newsArticle*`; FE events da dong bo DTO, detail, quick detail, va action layout theo contract hien tai.
- `telegram`: frontend da co route/action/type/permission/navigation cho surface Telegram, nhung snapshot moi them `outputLanguageIsoCode` request va `outputLanguage` response cho feature setting/schedule ma FE chua expose.
- `ai-provider credentials`: snapshot moi doi credential `label` thanh `model` va bo top-level config `name`/`model`; FE hien van giu `name`, top-level `model`, va credential `label` trong definitions, form, list, detail, va credential panel.
- `cronjobs`: FE da bo create/delete flow va doi update schedule sang inline list chi gui `expression`; endpoint `stop` duoc ghi nhan nhung khong tich hop co chu dich.
- `personal notes`: frontend da map `/me/notes*` vao action, DTO, permission helper, quick Sheet header, route `/notes`, editor HTML, explicit save, presentation mode, va delete confirmation. Contract hien van chi co `contentHtml`, nen UI derive label tu HTML da sanitize thay vi luu title rieng.
- `languages`: frontend da co URL locale va `Accept-Language`, nhung chua co backend action cho `GET /languages` va `PATCH /me/preferred-language`; `LanguageSelector` hien chi doi route locale.
- `narratives`: snapshot moi them `/narratives*`, graph narrative node/edge, va market query `keyNarratives[]`; FE chua co module narratives rieng hoac market-query narrative panel, nhung Graph View da model/render narrative node/edge.
- `market query`: spec van mo ta `asOfTime` la optional `date-time`; frontend v1 chu dong omit field nay de backend tu lay thoi diem hien tai va harden parse cho payload runtime co the tra `null` o `publishedAt` va `occurredAt`. Ngoai ra, `keyEvents[]` da doi `summary` thanh `description`, evidence da doi sang `newsArticle*` va them `evidenceNote`, FE van doc `summary`/`artifact*` va chua doc `keyNarratives[]`/`evidenceNote`.
- `graph view`: `GraphNodeMetadata` da doi `active` thanh `status` va them `narrativeStatus`/`thesis`; FE Graph View da model/render node kind `narrative` va edge kind `narrative-event`/`narrative-asset`.
- `user profile`: `GET /me` da dong bo `currentWorkspace`, `mainImage` media object, va `permissions[]`, nhung snapshot moi them `preferredLanguage`; runtime hien van chi dung permission loader.
- `blogs`: create va response dung `visible`, update dung `isVisible`; frontend van can tiep tuc xu ly ky de tranh drift.
- `ai-provider-configs`: snapshot khong con expose full `apiKey` tren config response; frontend da doc `credentials[]` preview va ho tro provider enum `GROQ`, nhung can doi tiep UI/DTO theo contract khong con `name`/top-level `model`.
- `media`: da co trong spec nhung frontend chua co module.
- `topics`: van ton tai tren frontend, nhung khong con nam trong snapshot API hien tai.
