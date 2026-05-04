# Tài liệu ánh xạ API

Tài liệu này ánh xạ snapshot OpenAPI backend trong `docs/api_mapping.json` tới các điểm tích hợp frontend hiện tại của repo.

Xác minh lần cuối: ngày 4 tháng 5 năm 2026

## Cấu hình cơ sở

| Mục                  | Giá trị                                               |
| -------------------- | ----------------------------------------------------- |
| URL gốc API          | `http://localhost:8484`                               |
| Nguồn chuẩn          | `docs/api_mapping.json`                               |
| Hàm auth chính       | `fetchAuthenticated()` trong `app/api/auth/action.ts` |
| Hàm public           | `fetchPublic()` trong `app/api/auth/action.ts`        |
| Kiểu mutation result | `ActionResult<T>` trong `app/lib/definitions.ts`      |

## Quy ước dùng chung

- Các request được bảo vệ đi qua `fetchAuthenticated()`.
- `apiFetch()` đọc `response.text()` trước khi parse JSON.
- Frontend runtime list/search đang serialize query thành `$filter`, `page`, `size`, `sort` thông qua `queryParamsToString()`.
- OpenAPI vẫn mô tả list query bằng `specification` và `pageable`, nên cần tách biệt giữa spec contract và effective runtime contract mà frontend đang gọi.
- Snapshot backend hiện có `securitySchemes.bearerAuth` và metadata `x-signapse-auth` trên từng operation.
- `x-signapse-auth.type` hiện gồm `permission`, `active-user`, và `public`; frontend vẫn gate UI bằng permission list lấy từ `/me`.

## Tổng quan thay đổi lớn từ snapshot hiện tại

- Snapshot backend hiện tại gồm `71` operation.
- Backend đã chuyển domain nội dung canon từ `sources` / `source-documents` sang `news-outlets` / `news-articles`.
- Backend vẫn giữ các surface `events`, `query`, và `graph-view`, nhưng nhiều payload đã đổi naming từ `sourceDocument*` sang `artifact*` hoặc `news-article`.
- Surface `events` có thêm workflow derive market reactions cho từng event và batch pending events.
- Surface `market-charts` mới cung cấp dữ liệu nến OHLCV qua endpoint `GET /market-charts/candles`.
- Snapshot backend hiện publish metadata permission chính thức qua `x-signapse-auth`, trong đó một số gate frontend cũ cần được rà lại theo permission mới.
- Frontend hiện đã có route và workbench cho `market-query` và `graph-view`, nhưng vẫn còn lệch contract với snapshot backend mới.
- Frontend đã có surface canon `news-outlets` và `news-articles`; các route legacy `/sources*`, `/news-sources*`, và `/source-documents*` hiện chỉ còn redirect compatibility.
- Legacy source implementation files for `/sources` have been removed; only redirect pages remain so old bookmarks continue to land on `/news-outlets`.
- Surface workspace dùng chuẩn `set-current`, đồng thời `WorkspaceResponse` dùng field có nghĩa `currentWorkspace`.
- `roles` và `permissions` hiện đã có action và UI frontend, không còn ở trạng thái "chưa triển khai".

## Phạm vi endpoint

### 1. API system prompts

| Phương thức | Endpoint backend               | operationId          | Tích hợp frontend                | Trạng thái    | Ghi chú                                                                 |
| ----------- | ------------------------------ | -------------------- | -------------------------------- | ------------- | ----------------------------------------------------------------------- |
| GET         | `/system-prompts`              | `getSystemPrompts`   | `getSystemPrompts(searchParams)` | Đã triển khai | List route `/system-prompts` dùng `Page<SystemPromptResponse>`.         |
| POST        | `/system-prompts`              | `createSystemPrompt` | `createSystemPrompt(request)`    | Đã triển khai | Form tạo mới gửi `promptType` và `content`, validate tối đa 10000 ký tự. |
| GET         | `/system-prompts/{promptType}` | `getSystemPrompt`    | `getSystemPromptByType(type)`    | Đã triển khai | Trang chi tiết/chỉnh sửa dùng `promptType` đã URL-encode.               |
| PUT         | `/system-prompts/{promptType}` | `updateSystemPrompt` | `updateSystemPrompt(type, data)` | Đã triển khai | Form cập nhật chỉ sửa `content`, giữ `promptType` readonly.             |
| DELETE      | `/system-prompts/{promptType}` | `deleteSystemPrompt` | `deleteSystemPrompt(type)`       | Đã triển khai | Action xóa có `AlertDialog` và gate bằng `system-prompt:delete`.        |

Frontend liên quan:

- `app/api/system-prompts/action.ts`
- `app/lib/system-prompts/definitions.ts`
- `app/lib/system-prompts/permissions.ts`
- `app/(main)/system-prompts/*`

Ghi chú:

- Enum `promptType` trong snapshot hiện tại vẫn giữ nhóm legacy `NEWS_FILTER`, `NEWS_ANALYSIS`, `SIGNAL_GENERATION`, `DECISION_MAKING`, `CONTENT_EXTRACTION`, `SENTIMENT_ANALYSIS`, `TITLE_GENERATION`, `SUMMARY_GENERATION`, `CONTENT_CLEANING`, đồng thời mở rộng thêm `FIRECRAWL_SOURCE_DOCUMENT_FILTER`, `NEWS_PRIMARY_EVENT_DERIVATION`, `EVENT_ASSET_THEME_ENRICHMENT`, `EVENT_MARKET_REACTION_DERIVATION`, và `EVENT_GROUNDED_MARKET_QUERY_SYNTHESIS`.
- Frontend v1 validate `content` không được rỗng sau khi `trim()` và không vượt quá `10000` ký tự, khớp giới hạn tối đa trong schema backend.

### 2. API news outlets

| Phuong thuc | Endpoint backend                   | operationId             | Tich hop frontend                      | Trang thai    | Ghi chu                                                                                                                                          |
| ----------- | ---------------------------------- | ----------------------- | -------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| GET         | `/news-outlets`                    | `getNewsOutlets`        | `getNewsOutlets(searchParams)`         | Da trien khai | List route canon `/news-outlets` da dung `Page<NewsOutletListResponse>` va search/sort theo contract moi.                                     |
| POST        | `/news-outlets`                    | `createNewsOutlet`      | `createNewsOutlet(request)`            | Da trien khai | Form tao moi gui dung cac field `name`, `slug`, `description`, `homepageUrl`, `rssUrl`, `active`.                                             |
| GET         | `/news-outlets/{id}`               | `getNewsOutlet`         | `getNewsOutletById(id)`                | Da trien khai | Detail-edit route canon `/news-outlets/{id}` da hydrate theo `NewsOutletResponse`.                                                             |
| PUT         | `/news-outlets/{id}`               | `updateNewsOutlet`      | `updateNewsOutlet(id, request)`        | Da trien khai | Frontend da doi `url` thanh `homepageUrl` va khong con gui field legacy nhu `type` hay `systemManaged`.                                        |
| DELETE      | `/news-outlets/{id}`               | `deleteNewsOutlet`      | `deleteNewsOutlet(id)`                 | Da trien khai | Action xoa da duoc gate bang permission `news-outlet:delete`.                                                                                   |
| PATCH       | `/news-outlets/{id}/toggle-active` | `toggleActive`          | `toggleNewsOutletActive(id)`           | Da trien khai | Toggle active da duoc gate bang permission `news-outlet:update` va refresh lai list/detail sau mutation.                                        |
| GET         | `/news-outlets/active`             | `getActiveNewsOutlets`  | `getActiveNewsOutlets(searchParams)`   | Da trien khai | Helper moi da map dung response paginated `Page<NewsOutletListResponse>`; neu dung cho combobox thi FE can doc `content[]` de flatten khi can. |

Frontend lien quan:

- `app/api/news-outlets/action.ts`
- `app/lib/news-outlets/definitions.ts`
- `app/lib/news-outlets/permissions.ts`
- `app/(main)/news-outlets/*`
- `app/(main)/sources/*` (redirect compatibility)
- `app/(main)/news-sources/*` (redirect compatibility)

Ghi chu:

- `NewsOutletListResponse` va `NewsOutletResponse` hien dung `homepageUrl`, `rssUrl`, `active`, `createdDate`, `lastModifiedDate`.
- Frontend da dung route canon `/news-outlets`; navigation "Nguon tin" trong `config/site.ts` da tro ve surface nay va duoc gate bang `news-outlet:read`.
- Cac route legacy `/sources*` va `/news-sources*` chi con redirect ve `/news-outlets*` de giu deeplink va bookmark cu; data layer va list/form/search legacy cua `/sources` da duoc xoa.
- Snapshot backend khong con field `type`, `systemManaged`, ingest metadata, hoac endpoint `/sources*`.

### 3. API news articles

Day la domain noi dung canon cua snapshot backend hien tai.

| Phuong thuc | Endpoint backend                            | operationId               | Tich hop frontend                                        | Trang thai                        | Ghi chu                                                                                                                                       |
| ----------- | ------------------------------------------- | ------------------------- | -------------------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| GET         | `/news-articles`                            | `getNewsArticles`         | `getNewsArticles(searchParams)`                          | Da trien khai                      | FE list canon nay bo filter `documentType` va cac badge status legacy, dong bo voi schema `NewsArticleListResponse`.                        |
| GET         | `/news-articles/{id}`                       | `getNewsArticle`          | `getNewsArticleById(id)`                                 | Da trien khai nhung con lech contract | Detail/operator workbench dung `newsOutletId`, `newsOutletName`, `status`, `externalKey`, `linkedEvents`, nhung schema `linkedEvents[]` da doi theo BE. |
| DELETE      | `/news-articles/{id}`                       | `deleteNewsArticle`       | `deleteNewsArticle(id)`                                  | Da trien khai                      | Route canon va nut operator da doi naming sang `news-article`.                                                                              |
| POST        | `/news-articles/{id}/crawl-full-content`    | `crawlFullContent`        | `crawlNewsArticleFullContent(id)`                        | Da trien khai                      | Contract moi tra ve `NewsArticleResponse`.                                                                                                   |
| POST        | `/news-articles/{id}/derive-primary-event`  | `derivePrimaryEvent`      | `derivePrimaryEventFromNewsArticle(id)`                  | Da trien khai                      | `NewsPrimaryEventDerivationResult` dung `newsArticleId`, `newsArticleTitle`, `status`, `changeType`, `eventId`, `eventCanonicalKey`.      |
| POST        | `/news-articles/derive-pending-news-events` | `derivePendingNewsEvents` | `derivePendingNewsArticleEvents(batchSize?)`             | Da trien khai                      | Batch result dung `PendingNewsEventDerivationBatchResult` va summary helper moi theo naming `news-article`.                                |
| PATCH       | `/news-articles/{id}/feature-image`         | `updateFeatureImage`      | `updateNewsArticleFeatureImage(id, request)`             | Da trien khai                      | Data layer canon nam trong `app/api/news-articles/action.ts`.                                                                               |

Frontend lien quan:

- `app/api/news-articles/action.ts`
- `app/lib/news-articles/definitions.ts`
- `app/lib/news-articles/permissions.ts`
- `app/(main)/news-articles/*`
- `app/(main)/source-documents/page.tsx`
- `app/(main)/source-documents/[id]/page.tsx` (redirect compatibility)

Ghi chu:

- `NewsArticleListResponse` va `NewsArticleResponse` hien gom `title`, `description`, `content`, `url`, `featureImage`, `newsOutletId`, `newsOutletName`, `publishedAt`, `status`, `externalKey`, `linkedEvents`.
- Enum `status` hien tai la `INGESTED`, `DERIVATION_PENDING`, `EVENT_RESOLVED`, `NO_PRIMARY_EVENT`, `CONTENT_FAILED`, `DERIVATION_FAILED`.
- `LinkedEventSummaryResponse` hien chi con `eventStatus`, `evidenceRole`, `evidenceConfidence`, `evidenceNote`; `eventStatus` da dung enum `ENRICHMENT_PENDING`, `ENRICHED`, `ENRICHMENT_NO_MATCH`, `ENRICHMENT_FAILED`, `ARCHIVED`, va khong con `eventEnrichmentStatus`.
- `app/lib/news-articles/definitions.ts` va `app/(main)/news-articles/[id]/page.tsx` hien van map linked event theo lifecycle cu cua `events`, nen can doi naming va badge logic neu FE integrate tiep theo snapshot moi.
- Navigation "Noi dung" da tro ve `/news-articles`; route `/source-documents*` chi con redirect sang surface canon moi.
- Snapshot backend khong con `lifecycleStatus`, `readinessStatus`, `eventDerivationStatus`, `documentType`, hoac endpoint canon `/source-documents*`.
- Endpoint `POST /news-articles/{id}/analyze` khong con nam trong snapshot OpenAPI hien tai; UI da go manual analyze va workflow phan tich bai viet chuyen sang cronjob.

### 4. API events

| Phuong thuc | Endpoint backend                           | operationId                    | Tich hop frontend                               | Trang thai                         | Ghi chu                                                                                                                                                                    |
| ----------- | ------------------------------------------ | ------------------------------ | ----------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET         | `/events`                                  | `getEvents`                    | `getEvents(searchParams)`                       | Da trien khai                      | Frontend co route `/events`, toolbar batch-enrich + batch derive market reactions + search, sort, phan trang, va render schema moi voi `description`, mot badge `status`, `occurredAt`, `confidence`. |
| GET         | `/events/{id}`                             | `getEvent`                     | `getEventById(id)`                              | Da trien khai                      | Detail da uu tien status, confidence, thoi diem, description, evidence-first, va render section `marketReactions[]` sau bang chung. |
| POST        | `/events/{id}/enrich-assets-and-themes`    | `enrichAssetsAndThemes`        | `enrichEventAssetsAndThemes(id)`                | Da trien khai                      | Co nut operator tren event detail; toast summary da dung `EventEnrichmentResult.outcome` enum `ENRICHMENT_*` + `ARCHIVED`. |
| POST        | `/events/{id}/derive-market-reactions`     | `deriveMarketReactions`        | `deriveEventMarketReactions(id)`                | Da trien khai                      | Co nut operator tren event detail; toast summary dung `reactionCount`, `neutralCount`, va `message`. |
| POST        | `/events/enrich-pending-assets-and-themes` | `enrichPendingAssetsAndThemes` | `enrichPendingEventAssetsAndThemes(batchSize?)` | Da trien khai                      | Co nut batch tren event list; batch summary da tinh ca `deferredCount`. |
| POST        | `/events/derive-pending-market-reactions`  | `derivePendingMarketReactions` | `derivePendingEventMarketReactions(batchSize?)` | Da trien khai                      | Co nut batch tren event list; toast summary dung `selectedCount`, `processedCount`, `skippedCount`, `derivedCount`, `neutralCount`, `failedCount`. |

Frontend lien quan:

- `app/api/events/action.ts`
- `app/lib/events/definitions.ts`
- `app/lib/events/permissions.ts`
- `app/(main)/events/*`

Ghi chu:

- `event:read` dung de gate navigation, `/events`, `/events/{id}`, va cac link sang event detail.
- Snapshot backend hien gate event enrich operators va market reaction derivation bang `news-article:analyze`; FE events da gate bang permission canon nay truoc va chi giu `source-document:analyze` nhu alias compatibility tam thoi.
- `EventListResponse` va `EventResponse` hien dung `description` thay `summary`, `status` enum `ENRICHMENT_PENDING`, `ENRICHED`, `ENRICHMENT_NO_MATCH`, `ENRICHMENT_FAILED`, `ARCHIVED`, va khong con `active`, `enrichmentStatus`, `enrichmentAttemptedAt`, `enrichmentCompletedAt`, `enrichmentError`.
- `EventEnrichmentResult.outcome` cung dung enum `ENRICHMENT_PENDING`, `ENRICHED`, `ENRICHMENT_NO_MATCH`, `ENRICHMENT_FAILED`, `ARCHIVED`.
- Batch enrichment result cua `/events/enrich-pending-assets-and-themes` da co them field `deferredCount`; frontend da surface trong toast summary.
- `EventResponse` co them `marketReactions[]` gom `id`, `assetId`, `assetName`, `assetSymbol`, `assetType`, `direction`, `timeHorizon`, `confidence`, `reasoning`, `observedAt`; FE da map DTO va render trong section `Tac dong thi truong` tren detail event.
- Market reaction enums moi: `direction` gom `BULLISH`, `BEARISH`, `MIXED`, `NEUTRAL`; `timeHorizon` gom `INTRADAY`, `SHORT_TERM`, `MEDIUM_TERM`, `LONG_TERM`.
- `EventMarketReactionDerivationResult` gom `eventId`, `eventTitle`, `eventCanonicalKey`, `reactionCount`, `neutralCount`, `message`; batch result gom `requestedBatchSize`, `selectedCount`, `processedCount`, `skippedCount`, `derivedCount`, `neutralCount`, `failedCount`, `results[]`.
- Detail event hien sap xep `evidence` truoc `assets` va `themes`, con `id`, `slug`, `canonicalKey`, `createdDate`, `lastModifiedDate` nam trong vung thong tin ky thuat cap thap.

### 5. API market charts

| Phuong thuc | Endpoint backend          | operationId   | Tich hop frontend | Trang thai      | Ghi chu                                                                                                                                      |
| ----------- | ------------------------- | ------------- | ----------------- | --------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| GET         | `/market-charts/candles`  | `getCandles`  | `getMarketChartCandles(request)` | Da trien khai candle workbench | Endpoint moi duoc gate bang `market-chart:read`, tra ve `MarketChartCandleResponse` voi `provider`, `symbol`, `timeframe`, `from`, `to`, va `candles[]` du lieu OHLCV theo moc thoi gian; route `/market-charts` render bang Lightweight Charts + shadcn shell. |

Frontend lien quan:

- `app/api/market-charts/action.ts`
- `app/lib/market-charts/definitions.ts`
- `app/lib/market-charts/permissions.ts`
- `app/(main)/market-charts/page.tsx`
- `app/(main)/market-charts/market-chart-workbench.tsx`
- `app/(main)/market-charts/market-chart-canvas.tsx`
- Surface nay nhieu kha nang se anh huong toi `market-query` neu can hien thi chart context ben canh ket qua phan tich.

Ghi chu:

- Query contract hien duoc khai bao qua object `request` trong query string, tham chieu schema `MarketChartCandleRequest`.
- `MarketChartCandleRequest` gom `symbol`, `timeframe`, `from`, `to`; snapshot hien tai khong mo ta enum hay danh sach gia tri hop le, trong khi FE data layer hien gioi han `timeframe` theo union `1m`, `5m`, `15m`, `30m`, `1h`, `1d`, `1w`, `1mo`.
- `MarketChartCandleItemResponse` gom `time`, `open`, `high`, `low`, `close`, `volume`.
- Frontend da co chart workbench dau tien cho candle bridge; event marker, asset-level chart endpoint, workspace watchlist chart selection va annotation popup van chua trien khai.

### 6. API market query

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend      | Trang thai                         | Ghi chu                                                                                                                                                                                                                                                 |
| ----------- | ---------------- | ----------- | ---------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST        | `/query`         | `query`     | `queryMarket(request)` | Da trien khai nhung con lech contract | Route `/market-query` render workbench briefing gom `answer`, `reasoningChain`, `keyEvents`, `assetsConsidered`, `confidence`, `limitations`, va `evidence`; FE evidence da doi sang naming `artifact*`, nhung `keyEvents[]` da co rename field. |

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
- `MarketQueryEvidenceResponse` hien dung `artifactType`, `artifactId`, `artifactTitle`, `artifactUrl`, `newsOutletName`, `publishedAt`, `evidenceRole`, `evidenceConfidence`; FE da doi bo link canon sang `/news-articles/{artifactId}` cho artifact `NEWS_ARTICLE`.

### 7. API graph view

| Phuong thuc | Endpoint backend | operationId    | Tich hop frontend | Trang thai                         | Ghi chu                                                                                                                                                    |
| ----------- | ---------------- | -------------- | ----------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET         | `/graph-view`    | `getGraphView` | `getGraphView()`  | Da trien khai nhung con lech contract | Frontend co route `/graph-view`, page shell duoc gate bang `graph-view:read`, va workbench Sigma browse graph theo payload `nodes[]` + `edges[]`, nhung metadata node da doi schema. |

Ghi chu:

- Response snapshot hien tai la `GraphViewResponse` gom `nodes[]` va `edges[]`.
- `nodes[].kind` hien tai gom `event`, `asset`, `theme`, `news-article`; `edges[].kind` gom `event-asset`, `event-theme`, `source-artifact-event`.
- `GraphNodeMetadata` hien da dung `newsOutletName` thay vi `sourceName`, dong thoi doi `active` thanh `status`.
- Frontend `app/lib/graph-view/definitions.ts` va `app/(main)/graph-view/*` da doi sang naming `news-article`, `source-artifact-event`, va `newsOutletName`, nhung hien van doc `metadata.active`.
- Drill-down cho node bai viet da chuyen sang `/news-articles/{id}`.

### 8. API blogs

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

### 9. API cronjobs

| Phuong thuc | Endpoint backend        | operationId | Tich hop frontend            | Trang thai      | Ghi chu                               |
| ----------- | ----------------------- | ----------- | ---------------------------- | --------------- | ------------------------------------- |
| GET         | `/cronjobs`             | `list`      | `getCronjobs(searchParams)`  | Da trien khai   | Tra ve `Page<CronjobListResponse>`.   |
| POST        | `/cronjobs`             | `create`    | `createCronjob(request)`     | Da trien khai   | Dung `CronjobRequest`.                |
| GET         | `/cronjobs/{id}`        | `get`       | `getCronjobById(id)`         | Da trien khai   | Tra ve `CronjobResponse`.             |
| PATCH       | `/cronjobs/{id}`        | `update`    | `updateCronjob(id, request)` | Da trien khai   | Frontend va backend deu dung `PATCH`. |
| DELETE      | `/cronjobs/{id}`        | `delete`    | `deleteCronjob(id)`          | Da trien khai   | Duoc boc trong `ActionResult`.        |
| POST        | `/cronjobs/{id}/start`  | `start`     | `startCronjob(id)`           | Da trien khai   | Co UX.                                |
| POST        | `/cronjobs/{id}/pause`  | `pause`     | `pauseCronjob(id)`           | Da trien khai   | Co UX.                                |
| POST        | `/cronjobs/{id}/resume` | `resume`    | `resumeCronjob(id)`          | Da trien khai   | Co UX.                                |
| POST        | `/cronjobs/{id}/stop`   | `stop`      | `-`                          | Chua trien khai | Frontend chua co `stopCronjob()`.     |

### 10. API AI provider configs

| Phuong thuc | Endpoint backend                        | operationId              | Tich hop frontend                     | Trang thai                               | Ghi chu                                                                                                |
| ----------- | --------------------------------------- | ------------------------ | ------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| GET         | `/ai-provider-configs`                  | `getAiProviderConfigs`   | `getAiProviderConfigs(searchParams)`  | Da trien khai nhung co lech runtime/spec | Runtime frontend dung `$filter/page/size/sort`; response raw duoc sanitize truoc khi dua xuong client. |
| POST        | `/ai-provider-configs`                  | `createAiProviderConfig` | `createAiProviderConfig(request)`     | Da trien khai                            | Dung DTO tao rieng.                                                                                    |
| GET         | `/ai-provider-configs/{id}`             | `getAiProviderConfig`    | `getAiProviderConfigById(id)`         | Da trien khai                            | Frontend sanitize `apiKey`.                                                                            |
| PUT         | `/ai-provider-configs/{id}`             | `updateAiProviderConfig` | `updateAiProviderConfig(id, request)` | Da trien khai                            | `apiKey` chi gui khi user thay doi.                                                                    |
| DELETE      | `/ai-provider-configs/{id}`             | `deleteAiProviderConfig` | `deleteAiProviderConfig(id)`          | Da trien khai                            | Duoc boc trong `ActionResult`.                                                                         |
| PATCH       | `/ai-provider-configs/{id}/set-default` | `setDefault`             | `setAiProviderConfigDefault(id)`      | Da trien khai                            | Da tich hop.                                                                                           |
| POST        | `/ai-provider-configs/model-catalog`    | `getModelCatalog`        | `getAiProviderModelCatalog(request)`  | Da trien khai                            | Tai model catalog theo credentials.                                                                    |

### 11. API assets

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend         | Trang thai    | Ghi chu                   |
| ----------- | ---------------- | ----------- | ------------------------- | ------------- | ------------------------- |
| GET         | `/assets`        | `getAssets` | `getAssets(searchParams)` | Da trien khai | Asset catalog read-only.  |
| GET         | `/assets/{id}`   | `getAsset`  | `getAssetById(id)`        | Da trien khai | Co helper hydrate detail. |

### 12. API media

| Phuong thuc | Endpoint backend | operationId   | Tich hop frontend | Trang thai      | Ghi chu                             |
| ----------- | ---------------- | ------------- | ----------------- | --------------- | ----------------------------------- |
| GET         | `/medias`        | `getMedias`   | `-`               | Chua trien khai | Chua co `app/api/medias/action.ts`. |
| GET         | `/medias/{id}`   | `getMedia`    | `-`               | Chua trien khai | Chua co tich hop.                   |
| DELETE      | `/medias/{id}`   | `deleteMedia` | `-`               | Chua trien khai | Chua co tich hop.                   |
| POST        | `/medias/upload` | `upload`      | `-`               | Chua trien khai | Chua co tich hop.                   |

### 13. API economic calendar

| Phương thức | Endpoint backend          | operationId                 | Tích hợp frontend | Trạng thái      | Ghi chú                                                                                                  |
| ----------- | ------------------------- | --------------------------- | ----------------- | --------------- | -------------------------------------------------------------------------------------------------------- |
| GET         | `/economic-calendar`      | `getEconomicCalendarEntries` | `getEconomicCalendarEntries(searchParams)` | Đã triển khai | Trả về `Page<EconomicCalendarListResponse>` với schema đã giản lược; frontend dùng `$filter/page/size/sort` qua `queryParamsToString()`. |
| GET         | `/economic-calendar/{id}` | `getEconomicCalendarEntry`   | `getEconomicCalendarEntryById(id)`         | Đã triển khai | Trả về `EconomicCalendarResponse` cho trang chi tiết read-only, có `content` khi nội dung đã sẵn sàng. |
| POST        | `/economic-calendar/sync` | `syncEconomicCalendarEntries` | `syncEconomicCalendarEntries()`            | Đã triển khai | Trả về `EconomicCalendarSyncResponse` với `fetchedCount`, `createdCount`, `updatedCount`, `skippedCount`.      |

Ghi chú:

- Frontend đã có `app/api/economic-calendar/action.ts`, definitions, permissions, navigation và route UI `/economic-calendar`.
- List/detail response hiện dùng các trường chính: `title`, `currencyCode`, `impact`, `forecastValue`, `previousValue`, `actualValue`, `contentAvailable`, `status`, `scheduledAt`, `syncedAt`, `createdDate`, `lastModifiedDate`.
- Detail response có thêm `content`; UI chỉ hiển thị nội dung khi `contentAvailable` là true và `content` có dữ liệu.
- Frontend không còn phụ thuộc vào các field cũ đã bị backend loại bỏ như `description`, `url`, `externalKey`, `provider`, `countryCode`, `importance`, `ingestedAt`, `rawContent`, hoặc `rawMetadata`.

### 14. API workspace

| Phuong thuc | Endpoint backend                  | operationId           | Tich hop frontend               | Trang thai                         | Ghi chu                                                                 |
| ----------- | --------------------------------- | --------------------- | ------------------------------- | ---------------------------------- | ----------------------------------------------------------------------- |
| GET         | `/me/workspaces`                  | `getMyWorkspaces`     | `getMyWorkspaces(searchParams)` | Da tich hop | `WorkspaceResponse` frontend dung `currentWorkspace` de xac dinh workspace hien tai. |
| POST        | `/me/workspaces`                  | `createWorkspace`     | `createWorkspace(request)`      | Da trien khai                      | Chi xu ly metadata workspace.                                           |
| PUT         | `/me/workspaces/{id}`             | `updateWorkspace`     | `updateWorkspace(id, request)`  | Da trien khai                      | Rename workspace.                                                       |
| PATCH       | `/me/workspaces/{id}/set-current` | `setCurrentWorkspace` | `setCurrentWorkspace(id)`       | Da tich hop | Frontend goi dung `/set-current` va gate bang permission chinh thuc `workspace:set-current`. |

### 15. API user

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai                         | Ghi chu                                                                                                                                  |
| ----------- | ---------------- | ----------- | ----------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| GET         | `/me`            | `me`        | `getMe()`         | Da trien khai nhung con lech contract | Snapshot hien tai dung `currentWorkspace` thay vi `workspace`, va `mainImage` la `MediaResponse`; FE `BackendMeResponse` van map `workspace` va `mainImage` thanh `string`. |

### 16. API wiki

Khong con tich hop frontend.

Ghi chu:

- Toan bo route, action, definition, va UI surface `wiki` da duoc go khoi frontend.
- Neu backend tai xuat wiki trong tuong lai, nen de xuat mot change moi thay vi tai su dung module cu.

### 17. API roles

| Phuong thuc | Endpoint backend               | operationId             | Tich hop frontend                         | Trang thai    | Ghi chu                                            |
| ----------- | ------------------------------ | ----------------------- | ----------------------------------------- | ------------- | -------------------------------------------------- |
| GET         | `/roles`                       | `getRoles`              | `getRoles()`                              | Da trien khai | Trang roles da load danh sach vai tro.             |
| PUT         | `/roles/{roleKey}/permissions` | `updateRolePermissions` | `updateRolePermissions(roleKey, request)` | Da trien khai | Dialog frontend cho phep cap nhat permission keys. |

### 18. API permissions

| Phuong thuc | Endpoint backend | operationId      | Tich hop frontend  | Trang thai    | Ghi chu                                                 |
| ----------- | ---------------- | ---------------- | ------------------ | ------------- | ------------------------------------------------------- |
| GET         | `/permissions`   | `getPermissions` | `getPermissions()` | Da trien khai | Duoc dung cung role editor de build permission catalog. |

### 19. API watchlists

| Phuong thuc | Endpoint backend               | operationId       | Tich hop frontend                            | Trang thai    | Ghi chu                                                 |
| ----------- | ------------------------------ | ----------------- | -------------------------------------------- | ------------- | ------------------------------------------------------- |
| GET         | `/watchlists`                  | `getWatchlist`    | `getWorkspaceWatchlistAssets(searchParams)`  | Da trien khai | Frontend da doi naming sang workspace watchlist assets. |
| POST        | `/watchlists`                  | `createWatchlist` | `addAssetToWorkspaceWatchlist({ assetId })`  | Da trien khai | Sync add theo diff trong workspace editor.              |
| DELETE      | `/watchlists/assets/{assetId}` | `deleteByAssetId` | `removeAssetFromWorkspaceWatchlist(assetId)` | Da trien khai | Sync remove theo diff.                                  |

### 20. Webhook

| Phuong thuc | Endpoint backend  | operationId          | Tich hop frontend | Trang thai  | Ghi chu                           |
| ----------- | ----------------- | -------------------- | ----------------- | ----------- | --------------------------------- |
| POST        | `/webhooks/clerk` | `handleClerkWebhook` | `-`               | Chi backend | Khong ky vong co frontend caller. |

### 21. Health check

| Phuong thuc | Endpoint backend | operationId   | Tich hop frontend | Trang thai      | Ghi chu               |
| ----------- | ---------------- | ------------- | ----------------- | --------------- | --------------------- |
| GET         | `/health`        | `healthCheck` | `-`               | Chua trien khai | Chua co helper rieng. |

## Nhom frontend khong nam trong snapshot API hien tai

Nhung nhom duoi day van ton tai tren frontend, nhung khong xuat hien trong `docs/api_mapping.json` hien tai.

| Nhom             | Tinh trang frontend                                                                                                   | Ghi chu                                                                                               |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Sources          | `app/(main)/sources/page.tsx`, `app/(main)/sources/create/page.tsx`, `app/(main)/sources/[id]/page.tsx`             | Chi con route redirect compatibility; data layer va UI legacy cua `/sources` da duoc xoa.            |
| Source documents | `app/(main)/source-documents/page.tsx`, `app/(main)/source-documents/[id]/page.tsx`                                 | Chi con route redirect compatibility cho deeplink cu; data layer canon da la `news-articles`.             |
| Topics           | `app/api/topics/action.ts`, `app/lib/topics/definitions.ts`, `app/(main)/topics/*`                                  | Frontend van co module topics, nhung snapshot API hien tai khong co `/topics*`.                     |

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

| Khu vuc                                   | File frontend                                                                                                                                                       |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Helper dung chung                         | `app/lib/definitions.ts`, `app/lib/utils.ts`                                                                                                                        |
| Tang van chuyen auth                      | `app/api/auth/action.ts`                                                                                                                                            |
| News outlets                              | `app/api/news-outlets/action.ts`, `app/lib/news-outlets/definitions.ts`, `app/lib/news-outlets/permissions.ts`, `app/(main)/news-outlets/*`                      |
| News articles                             | `app/api/news-articles/action.ts`, `app/lib/news-articles/definitions.ts`, `app/lib/news-articles/permissions.ts`, `app/(main)/news-articles/*`                  |
| Sources (legacy, ngoai snapshot)          | `app/(main)/sources/page.tsx`, `app/(main)/sources/create/page.tsx`, `app/(main)/sources/[id]/page.tsx` (redirect compatibility)                                  |
| Source documents (legacy, ngoai snapshot) | `app/(main)/source-documents/page.tsx`, `app/(main)/source-documents/[id]/page.tsx` (redirect compatibility)                                                     |
| Events                                    | `app/api/events/action.ts`, `app/lib/events/definitions.ts`, `app/lib/events/permissions.ts`, `app/(main)/events/*`                                               |
| Market charts                             | `app/api/market-charts/action.ts`, `app/lib/market-charts/definitions.ts`, `app/lib/market-charts/permissions.ts`, `app/(main)/market-charts/*`                    |
| Market query                              | `app/api/query/action.ts`, `app/lib/market-query/definitions.ts`, `app/lib/market-query/permissions.ts`, `app/(main)/market-query/*`                              |
| Graph view                                | `app/api/graph-view/action.ts`, `app/lib/graph-view/definitions.ts`, `app/lib/graph-view/permissions.ts`, `app/(main)/graph-view/*`                               |
| Blogs                                     | `app/api/blogs/action.ts`, `app/lib/blogs/definitions.ts`                                                                                                           |
| Cronjobs                                  | `app/api/cronjobs/action.ts`, `app/lib/cronjobs/definitions.ts`                                                                                                     |
| AI provider configs                       | `app/api/ai-provider-configs/action.ts`, `app/lib/ai-provider-configs/definitions.ts`                                                                               |
| Assets                                    | `app/api/assets/action.ts`, `app/lib/assets/definitions.ts`                                                                                                         |
| Economic calendar                         | `app/api/economic-calendar/action.ts`, `app/lib/economic-calendar/definitions.ts`, `app/lib/economic-calendar/permissions.ts`, `app/(main)/economic-calendar/*`     |
| User profile                              | `app/api/user/action.ts`, `app/lib/users/definitions.ts`                                                                                                            |
| Workspace                                 | `app/api/workspaces/action.ts`, `app/lib/workspaces/definitions.ts`                                                                                                 |
| Watchlists                                | `app/api/watchlists/action.ts`, `app/lib/watchlists/definitions.ts`, `components/workspace-watchlist-editor.tsx`, `components/asset-multi-select-combobox.tsx`     |
| Roles va permissions                      | `app/api/roles/action.ts`, `app/lib/roles/definitions.ts`, `app/(main)/roles/*`                                                                                     |
| Route user cuc bo                         | `app/api/user/route.ts`                                                                                                                                             |
| Media                                     | `-`                                                                                                                                                                 |
| System prompts                            | `app/api/system-prompts/action.ts`, `app/lib/system-prompts/definitions.ts`, `app/lib/system-prompts/permissions.ts`, `app/(main)/system-prompts/*`                 |
| Topics (ngoai spec hien tai)              | `app/api/topics/action.ts`, `app/lib/topics/definitions.ts`, `app/(main)/topics/*`                                                                                  |

## Cac diem lech contract da biet

- List/search runtime cua frontend dang dung `$filter/page/size/sort`, trong khi OpenAPI tiep tuc mo ta `specification/pageable` o nhieu list endpoint.
- Frontend da migrate route canon sang `/news-outlets*` va `/news-articles*`; `/sources*`, `/news-sources*`, va `/source-documents*` chi con redirect compatibility.
- `news articles`: `linkedEvents[]` da co `eventStatus` enum moi theo enrichment lifecycle va khong con `eventEnrichmentStatus`; FE detail article hien van map theo contract cu cua `events`.
- `events`: backend gate enrich/market reaction operators bang `news-article:analyze`; FE events da gate bang permission canon nay truoc va chi giu `source-document:analyze` nhu alias compatibility tam thoi.
- `permission scan`: cac literal FE-only `source-document:*` con lai deu la alias compatibility sau permission canon `news-article:*`; cac permission BE chua co FE literal gom `cronjob:stop` va `media:*` vi cac surface/action nay chua duoc tich hop.
- `market charts`: backend them `GET /market-charts/candles` va cac schema candle OHLCV; FE da co data layer va workbench `/market-charts` dung Lightweight Charts, nhung `timeframe` dang bi FE constrain thanh enum cuc bo trong khi OpenAPI chi khai bao string.
- `market query`: spec van mo ta `asOfTime` la optional `date-time`; frontend v1 chu dong omit field nay de backend tu lay thoi diem hien tai va harden parse cho payload runtime co the tra `null` o `publishedAt` va `occurredAt`. Ngoai ra, `keyEvents[]` da doi `summary` thanh `description`, nhung FE van doc field cu.
- `graph view`: `GraphNodeMetadata` da doi `active` thanh `status`; FE workbench hien van doc `metadata.active`.
- `user profile`: `GET /me` da doi `workspace` thanh `currentWorkspace`, va `mainImage` la object media; FE `app/lib/users/definitions.ts` hien van map theo contract cu. Hien tac dong runtime thap vi permissions server chi doc `permissions[]`.
- `blogs`: create va response dung `visible`, update dung `isVisible`; frontend van can tiep tuc xu ly ky de tranh drift.
- `ai-provider-configs`: frontend sanitize `apiKey` khoi response truoc khi dua xuong client.
- `media`: da co trong spec nhung frontend chua co module.
- `topics`: van ton tai tren frontend, nhung khong con nam trong snapshot API hien tai.
