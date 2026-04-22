# Tai lieu anh xa API

Tai lieu nay anh xa snapshot OpenAPI backend trong `docs/api_mapping.json` toi cac diem tich hop frontend hien tai cua repo.

Xac minh lan cuoi: ngay 22 thang 4 nam 2026

## Cau hinh co so

| Muc                  | Gia tri                                               |
| -------------------- | ----------------------------------------------------- |
| URL goc API          | `http://localhost:8484`                               |
| Nguon chuan          | `docs/api_mapping.json`                               |
| Ham auth chinh       | `fetchAuthenticated()` trong `app/api/auth/action.ts` |
| Ham public           | `fetchPublic()` trong `app/api/auth/action.ts`        |
| Kieu mutation result | `ActionResult<T>` trong `app/lib/definitions.ts`      |

## Quy uoc dung chung

- Cac request duoc bao ve di qua `fetchAuthenticated()`.
- `apiFetch()` doc `response.text()` truoc khi parse JSON.
- Frontend runtime list/search dang serialize query thanh `$filter`, `page`, `size`, `sort` thong qua `queryParamsToString()`.
- OpenAPI van mo ta list query bang `specification` va `pageable`, nen can tach biet giua spec contract va effective runtime contract ma frontend dang goi.

## Tong quan thay doi lon tu snapshot hien tai

- Snapshot backend hien tai gom `66` operation.
- Backend da chuyen domain noi dung canon tu `sources` / `source-documents` sang `news-outlets` / `news-articles`.
- Backend van giu cac surface `events`, `query`, va `graph-view`, nhung nhieu payload da doi naming tu `sourceDocument*` sang `artifact*` hoac `news-article`.
- Frontend hien da co route va workbench cho `market-query` va `graph-view`, nhung van con lech contract voi snapshot backend moi.
- Frontend da co surface canon `news-outlets` va `news-articles`; cac route legacy `/sources*`, `/news-sources*`, va `/source-documents*` hien chi con redirect compatibility.
- Surface workspace da doi tu `set-default` sang `set-current`, dong thoi `WorkspaceResponse` da doi field co nghia tu `defaultWorkspace` sang `currentWorkspace`.
- `roles` va `permissions` hien da co action va UI frontend, khong con o trang thai "chua trien khai".

## Pham vi endpoint

### 1. API system prompts

| Phuong thuc | Endpoint backend               | operationId          | Tich hop frontend | Trang thai      | Ghi chu                                     |
| ----------- | ------------------------------ | -------------------- | ----------------- | --------------- | ------------------------------------------- |
| GET         | `/system-prompts`              | `getSystemPrompts`   | `-`               | Chua trien khai | Chua co `app/api/system-prompts/action.ts`. |
| POST        | `/system-prompts`              | `createSystemPrompt` | `-`               | Chua trien khai | Backend da co create schema.                |
| GET         | `/system-prompts/{promptType}` | `getSystemPrompt`    | `-`               | Chua trien khai | Frontend chua tich hop.                     |
| PUT         | `/system-prompts/{promptType}` | `updateSystemPrompt` | `-`               | Chua trien khai | Frontend chua tich hop.                     |
| DELETE      | `/system-prompts/{promptType}` | `deleteSystemPrompt` | `-`               | Chua trien khai | Frontend chua tich hop.                     |

Ghi chu:

- Enum `promptType` trong snapshot hien tai van giu nhom legacy `NEWS_FILTER`, `NEWS_ANALYSIS`, `SIGNAL_GENERATION`, `DECISION_MAKING`, `CONTENT_EXTRACTION`, `SENTIMENT_ANALYSIS`, `TITLE_GENERATION`, `SUMMARY_GENERATION`, `CONTENT_CLEANING`, dong thoi mo rong them `FIRECRAWL_SOURCE_DOCUMENT_FILTER`, `NEWS_PRIMARY_EVENT_DERIVATION`, `EVENT_ASSET_THEME_ENRICHMENT`, va `EVENT_GROUNDED_MARKET_QUERY_SYNTHESIS`.

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
- Cac route legacy `/sources*` va `/news-sources*` chi con redirect ve `/news-outlets*` de giu deeplink va bookmark cu.
- Snapshot backend khong con field `type`, `systemManaged`, ingest metadata, hoac endpoint `/sources*`.

### 3. API news articles

Day la domain noi dung canon cua snapshot backend hien tai.

| Phuong thuc | Endpoint backend                            | operationId               | Tich hop frontend                                        | Trang thai                        | Ghi chu                                                                                                                                       |
| ----------- | ------------------------------------------- | ------------------------- | -------------------------------------------------------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| GET         | `/news-articles`                            | `getNewsArticles`         | `getNewsArticles(searchParams)`                          | Da trien khai                      | FE list canon nay bo filter `documentType` va cac badge status legacy, dong bo voi schema `NewsArticleListResponse`.                        |
| GET         | `/news-articles/{id}`                       | `getNewsArticle`          | `getNewsArticleById(id)`                                 | Da trien khai                      | Detail/operator workbench dung `newsOutletId`, `newsOutletName`, `status`, `externalKey`, `linkedEvents`.                                  |
| DELETE      | `/news-articles/{id}`                       | `deleteNewsArticle`       | `deleteNewsArticle(id)`                                  | Da trien khai                      | Route canon va nut operator da doi naming sang `news-article`.                                                                              |
| POST        | `/news-articles/{id}/crawl-full-content`    | `crawlFullContent`        | `crawlNewsArticleFullContent(id)`                        | Da trien khai                      | Contract moi tra ve `NewsArticleResponse`.                                                                                                   |
| POST        | `/news-articles/{id}/analyze`               | `analyzeContent`          | `analyzeNewsArticle(id)`                                 | Da trien khai                      | FE dung DTO `NewsArticleResponse` cho action analyze.                                                                                        |
| POST        | `/news-articles/{id}/derive-primary-event`  | `derivePrimaryEvent`      | `derivePrimaryEventFromNewsArticle(id)`                  | Da trien khai                      | `NewsPrimaryEventDerivationResult` dung `newsArticleId`, `newsArticleTitle`, `status`, `changeType`, `eventId`, `eventCanonicalKey`.      |
| POST        | `/news-articles/derive-pending-news-events` | `derivePendingNewsEvents` | `derivePendingNewsArticleEvents(batchSize?)`             | Da trien khai                      | Batch result dung `PendingNewsEventDerivationBatchResult` va summary helper moi theo naming `news-article`.                                |
| PATCH       | `/news-articles/{id}/feature-image`         | `updateFeatureImage`      | `updateNewsArticleFeatureImage(id, request)`             | Da trien khai                      | Data layer canon nam trong `app/api/news-articles/action.ts`.                                                                               |

Frontend lien quan:

- `app/api/news-articles/action.ts`
- `app/lib/news-articles/definitions.ts`
- `app/lib/news-articles/permissions.ts`
- `app/(main)/news-articles/*`
- `app/(main)/source-documents/*` (redirect compatibility)

Ghi chu:

- `NewsArticleListResponse` va `NewsArticleResponse` hien gom `title`, `description`, `content`, `url`, `featureImage`, `newsOutletId`, `newsOutletName`, `publishedAt`, `status`, `externalKey`, `linkedEvents`.
- Enum `status` hien tai la `INGESTED`, `DERIVATION_PENDING`, `EVENT_RESOLVED`, `NO_PRIMARY_EVENT`, `CONTENT_FAILED`, `DERIVATION_FAILED`.
- Navigation "Noi dung" da tro ve `/news-articles`; route `/source-documents*` chi con redirect sang surface canon moi.
- Snapshot backend khong con `lifecycleStatus`, `readinessStatus`, `eventDerivationStatus`, `documentType`, hoac endpoint canon `/source-documents*`.

### 4. API events

| Phuong thuc | Endpoint backend                           | operationId                    | Tich hop frontend                               | Trang thai                         | Ghi chu                                                                                                                                                                    |
| ----------- | ------------------------------------------ | ------------------------------ | ----------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET         | `/events`                                  | `getEvents`                    | `getEvents(searchParams)`                       | Da trien khai                      | Frontend co route `/events`, toolbar batch-enrich + search, sort, phan trang, va render core metadata `title`, `status`, `enrichmentStatus`, `occurredAt`, `confidence`. |
| GET         | `/events/{id}`                             | `getEvent`                     | `getEventById(id)`                              | Da trien khai                      | `evidence[]` tren event detail da parse theo `artifactType`, `artifactId`, `artifactTitle`, `artifactUrl`, `newsOutletName`, `publishedAt`, `evidenceRole`, `confidence`, `evidenceNote`. |
| POST        | `/events/{id}/enrich-assets-and-themes`    | `enrichAssetsAndThemes`        | `enrichEventAssetsAndThemes(id)`                | Da trien khai                      | Co nut operator tren event detail; toast summary dua tren `EventEnrichmentResult`.                                                                                         |
| POST        | `/events/enrich-pending-assets-and-themes` | `enrichPendingAssetsAndThemes` | `enrichPendingEventAssetsAndThemes(batchSize?)` | Da trien khai                      | Co nut batch tren event list; v1 dung backend default batch size neu FE khong truyen override.                                                                             |

Frontend lien quan:

- `app/api/events/action.ts`
- `app/lib/events/definitions.ts`
- `app/lib/events/permissions.ts`
- `app/(main)/events/*`

Ghi chu:

- `event:read` dung de gate navigation, `/events`, `/events/{id}`, va cac link sang event detail.
- Event enrich operators hien duoc gate bang `source-document:analyze` theo quyet dinh frontend hien tai; neu backend doi permission key trong tuong lai, can kiem tra lai.
- Batch enrichment result cua `/events/enrich-pending-assets-and-themes` da co them field `deferredCount` trong snapshot backend hien tai.

### 5. API market query

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend      | Trang thai                         | Ghi chu                                                                                                                                                                                                                                                 |
| ----------- | ---------------- | ----------- | ---------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| POST        | `/query`         | `query`     | `queryMarket(request)` | Da trien khai                      | Route `/market-query` render workbench briefing gom `answer`, `reasoningChain`, `keyEvents`, `assetsConsidered`, `confidence`, `limitations`, va `evidence`; FE evidence da doi sang naming `artifact*`. |

Frontend lien quan:

- `app/api/query/action.ts`
- `app/lib/market-query/definitions.ts`
- `app/lib/market-query/permissions.ts`
- `app/(main)/market-query/page.tsx`
- `app/(main)/market-query/market-query-workbench.tsx`

Ghi chu:

- Spec request cua `POST /query` van cho phep field optional `asOfTime`, nhung workbench frontend v1 chu dong khong gui field nay de backend tu lay thoi diem hien tai.
- Snapshot OpenAPI hien tai mo ta `evidence[].publishedAt` va `keyEvents[].occurredAt` la `date-time` string; frontend market-query definitions dang cho phep them `null` de tuong thich voi payload runtime da quan sat.
- `MarketQueryEvidenceResponse` hien dung `artifactType`, `artifactId`, `artifactTitle`, `artifactUrl`, `newsOutletName`, `publishedAt`, `evidenceRole`, `evidenceConfidence`; FE da doi bo link canon sang `/news-articles/{artifactId}` cho artifact `NEWS_ARTICLE`.

### 6. API graph view

| Phuong thuc | Endpoint backend | operationId    | Tich hop frontend | Trang thai                         | Ghi chu                                                                                                                                                    |
| ----------- | ---------------- | -------------- | ----------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GET         | `/graph-view`    | `getGraphView` | `getGraphView()`  | Da trien khai                      | Frontend co route `/graph-view`, page shell duoc gate bang `graph-view:read`, va workbench Sigma browse graph theo payload `nodes[]` + `edges[]`. |

Ghi chu:

- Response snapshot hien tai la `GraphViewResponse` gom `nodes[]` va `edges[]`.
- `nodes[].kind` hien tai gom `event`, `asset`, `theme`, `news-article`; `edges[].kind` gom `event-asset`, `event-theme`, `source-artifact-event`.
- `GraphNodeMetadata` hien da dung `newsOutletName` thay vi `sourceName`.
- Frontend `app/lib/graph-view/definitions.ts` va `app/(main)/graph-view/*` da doi sang naming `news-article`, `source-artifact-event`, va `newsOutletName`.
- Drill-down cho node bai viet da chuyen sang `/news-articles/{id}`.

### 7. API blogs

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

### 8. API cronjobs

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

### 9. API AI provider configs

| Phuong thuc | Endpoint backend                        | operationId              | Tich hop frontend                     | Trang thai                               | Ghi chu                                                                                                |
| ----------- | --------------------------------------- | ------------------------ | ------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| GET         | `/ai-provider-configs`                  | `getAiProviderConfigs`   | `getAiProviderConfigs(searchParams)`  | Da trien khai nhung co lech runtime/spec | Runtime frontend dung `$filter/page/size/sort`; response raw duoc sanitize truoc khi dua xuong client. |
| POST        | `/ai-provider-configs`                  | `createAiProviderConfig` | `createAiProviderConfig(request)`     | Da trien khai                            | Dung DTO tao rieng.                                                                                    |
| GET         | `/ai-provider-configs/{id}`             | `getAiProviderConfig`    | `getAiProviderConfigById(id)`         | Da trien khai                            | Frontend sanitize `apiKey`.                                                                            |
| PUT         | `/ai-provider-configs/{id}`             | `updateAiProviderConfig` | `updateAiProviderConfig(id, request)` | Da trien khai                            | `apiKey` chi gui khi user thay doi.                                                                    |
| DELETE      | `/ai-provider-configs/{id}`             | `deleteAiProviderConfig` | `deleteAiProviderConfig(id)`          | Da trien khai                            | Duoc boc trong `ActionResult`.                                                                         |
| PATCH       | `/ai-provider-configs/{id}/set-default` | `setDefault`             | `setAiProviderConfigDefault(id)`      | Da trien khai                            | Da tich hop.                                                                                           |
| POST        | `/ai-provider-configs/model-catalog`    | `getModelCatalog`        | `getAiProviderModelCatalog(request)`  | Da trien khai                            | Tai model catalog theo credentials.                                                                    |

### 10. API assets

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend         | Trang thai    | Ghi chu                   |
| ----------- | ---------------- | ----------- | ------------------------- | ------------- | ------------------------- |
| GET         | `/assets`        | `getAssets` | `getAssets(searchParams)` | Da trien khai | Asset catalog read-only.  |
| GET         | `/assets/{id}`   | `getAsset`  | `getAssetById(id)`        | Da trien khai | Co helper hydrate detail. |

### 11. API media

| Phuong thuc | Endpoint backend | operationId   | Tich hop frontend | Trang thai      | Ghi chu                             |
| ----------- | ---------------- | ------------- | ----------------- | --------------- | ----------------------------------- |
| GET         | `/medias`        | `getMedias`   | `-`               | Chua trien khai | Chua co `app/api/medias/action.ts`. |
| GET         | `/medias/{id}`   | `getMedia`    | `-`               | Chua trien khai | Chua co tich hop.                   |
| DELETE      | `/medias/{id}`   | `deleteMedia` | `-`               | Chua trien khai | Chua co tich hop.                   |
| POST        | `/medias/upload` | `upload`      | `-`               | Chua trien khai | Chua co tich hop.                   |

### 12. API workspace

| Phuong thuc | Endpoint backend                  | operationId           | Tich hop frontend               | Trang thai                         | Ghi chu                                                                 |
| ----------- | --------------------------------- | --------------------- | ------------------------------- | ---------------------------------- | ----------------------------------------------------------------------- |
| GET         | `/me/workspaces`                  | `getMyWorkspaces`     | `getMyWorkspaces(searchParams)` | Da trien khai nhung con lech contract | `WorkspaceResponse` hien dung `currentWorkspace`; FE definitions va workspace switcher van ky vong `defaultWorkspace`, `personal`, va `active`. |
| POST        | `/me/workspaces`                  | `createWorkspace`     | `createWorkspace(request)`      | Da trien khai                      | Chi xu ly metadata workspace.                                           |
| PUT         | `/me/workspaces/{id}`             | `updateWorkspace`     | `updateWorkspace(id, request)`  | Da trien khai                      | Rename workspace.                                                       |
| PATCH       | `/me/workspaces/{id}/set-current` | `setCurrentWorkspace` | `setDefaultWorkspace(id)`       | Da trien khai nhung con lech contract | Frontend action hien van goi `/set-default`; can doi sang `/set-current`. |

### 13. API user

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai                         | Ghi chu                                                                                                                                  |
| ----------- | ---------------- | ----------- | ----------------- | ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| GET         | `/me`            | `me`        | `getMe()`         | Da trien khai nhung con lech contract | Snapshot hien tai dung `currentWorkspace` thay vi `workspace`, va `mainImage` la `MediaResponse`; FE `BackendMeResponse` van map `workspace` va `mainImage` thanh `string`. |

### 14. API wiki

Khong con tich hop frontend.

Ghi chu:

- Toan bo route, action, definition, va UI surface `wiki` da duoc go khoi frontend.
- Neu backend tai xuat wiki trong tuong lai, nen de xuat mot change moi thay vi tai su dung module cu.

### 15. API roles

| Phuong thuc | Endpoint backend               | operationId             | Tich hop frontend                         | Trang thai    | Ghi chu                                            |
| ----------- | ------------------------------ | ----------------------- | ----------------------------------------- | ------------- | -------------------------------------------------- |
| GET         | `/roles`                       | `getRoles`              | `getRoles()`                              | Da trien khai | Trang roles da load danh sach vai tro.             |
| PUT         | `/roles/{roleKey}/permissions` | `updateRolePermissions` | `updateRolePermissions(roleKey, request)` | Da trien khai | Dialog frontend cho phep cap nhat permission keys. |

### 16. API permissions

| Phuong thuc | Endpoint backend | operationId      | Tich hop frontend  | Trang thai    | Ghi chu                                                 |
| ----------- | ---------------- | ---------------- | ------------------ | ------------- | ------------------------------------------------------- |
| GET         | `/permissions`   | `getPermissions` | `getPermissions()` | Da trien khai | Duoc dung cung role editor de build permission catalog. |

### 17. API watchlists

| Phuong thuc | Endpoint backend               | operationId       | Tich hop frontend                            | Trang thai    | Ghi chu                                                 |
| ----------- | ------------------------------ | ----------------- | -------------------------------------------- | ------------- | ------------------------------------------------------- |
| GET         | `/watchlists`                  | `getWatchlist`    | `getWorkspaceWatchlistAssets(searchParams)`  | Da trien khai | Frontend da doi naming sang workspace watchlist assets. |
| POST        | `/watchlists`                  | `createWatchlist` | `addAssetToWorkspaceWatchlist({ assetId })`  | Da trien khai | Sync add theo diff trong workspace editor.              |
| DELETE      | `/watchlists/assets/{assetId}` | `deleteByAssetId` | `removeAssetFromWorkspaceWatchlist(assetId)` | Da trien khai | Sync remove theo diff.                                  |

### 18. Webhook

| Phuong thuc | Endpoint backend  | operationId          | Tich hop frontend | Trang thai  | Ghi chu                           |
| ----------- | ----------------- | -------------------- | ----------------- | ----------- | --------------------------------- |
| POST        | `/webhooks/clerk` | `handleClerkWebhook` | `-`               | Chi backend | Khong ky vong co frontend caller. |

### 19. Health check

| Phuong thuc | Endpoint backend | operationId   | Tich hop frontend | Trang thai      | Ghi chu               |
| ----------- | ---------------- | ------------- | ----------------- | --------------- | --------------------- |
| GET         | `/health`        | `healthCheck` | `-`               | Chua trien khai | Chua co helper rieng. |

## Nhom frontend khong nam trong snapshot API hien tai

Nhung nhom duoi day van ton tai tren frontend, nhung khong xuat hien trong `docs/api_mapping.json` hien tai.

| Nhom             | Tinh trang frontend                                                                                                   | Ghi chu                                                                                               |
| ---------------- | --------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| Sources          | `app/api/sources/action.ts`, `app/lib/sources/definitions.ts`, `app/(main)/sources/*`                               | Chi con data layer legacy va route redirect compatibility; surface canon da la `/news-outlets`.      |
| Source documents | `app/api/source-documents/action.ts`, `app/lib/source-documents/definitions.ts`, `app/(main)/source-documents/*`    | Chi con data layer va route redirect compatibility cho deeplink cu; surface canon da la `/news-articles`. |
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
| Sources (legacy, ngoai snapshot)          | `app/api/sources/action.ts`, `app/lib/sources/definitions.ts`, `app/(main)/sources/*` (redirect compatibility)                                                    |
| Source documents (legacy, ngoai snapshot) | `app/api/source-documents/action.ts`, `app/lib/source-documents/definitions.ts`, `app/lib/source-documents/permissions.ts`, `app/(main)/source-documents/*` (redirect compatibility) |
| Events                                    | `app/api/events/action.ts`, `app/lib/events/definitions.ts`, `app/lib/events/permissions.ts`, `app/(main)/events/*`                                               |
| Market query                              | `app/api/query/action.ts`, `app/lib/market-query/definitions.ts`, `app/lib/market-query/permissions.ts`, `app/(main)/market-query/*`                              |
| Graph view                                | `app/api/graph-view/action.ts`, `app/lib/graph-view/definitions.ts`, `app/lib/graph-view/permissions.ts`, `app/(main)/graph-view/*`                               |
| Blogs                                     | `app/api/blogs/action.ts`, `app/lib/blogs/definitions.ts`                                                                                                           |
| Cronjobs                                  | `app/api/cronjobs/action.ts`, `app/lib/cronjobs/definitions.ts`                                                                                                     |
| AI provider configs                       | `app/api/ai-provider-configs/action.ts`, `app/lib/ai-provider-configs/definitions.ts`                                                                               |
| Assets                                    | `app/api/assets/action.ts`, `app/lib/assets/definitions.ts`                                                                                                         |
| User profile                              | `app/api/user/action.ts`, `app/lib/users/definitions.ts`                                                                                                            |
| Workspace                                 | `app/api/workspaces/action.ts`, `app/lib/workspaces/definitions.ts`                                                                                                 |
| Watchlists                                | `app/api/watchlists/action.ts`, `app/lib/watchlists/definitions.ts`, `components/workspace-watchlist-editor.tsx`, `components/asset-multi-select-combobox.tsx`     |
| Roles va permissions                      | `app/api/roles/action.ts`, `app/lib/roles/definitions.ts`, `app/(main)/roles/*`                                                                                     |
| Route user cuc bo                         | `app/api/user/route.ts`                                                                                                                                             |
| Media                                     | `-`                                                                                                                                                                 |
| System prompts                            | `-`                                                                                                                                                                 |
| Topics (ngoai spec hien tai)              | `app/api/topics/action.ts`, `app/lib/topics/definitions.ts`, `app/(main)/topics/*`                                                                                  |

## Cac diem lech contract da biet

- List/search runtime cua frontend dang dung `$filter/page/size/sort`, trong khi OpenAPI tiep tuc mo ta `specification/pageable` o nhieu list endpoint.
- Frontend da migrate route canon sang `/news-outlets*` va `/news-articles*`; `/sources*`, `/news-sources*`, va `/source-documents*` chi con redirect compatibility.
- `market query`: spec van mo ta `asOfTime` la optional `date-time`; frontend v1 chu dong omit field nay de backend tu lay thoi diem hien tai va harden parse cho payload runtime co the tra `null` o `publishedAt` va `occurredAt`.
- `workspace`: endpoint da doi thanh `/me/workspaces/{id}/set-current` va response dung `currentWorkspace`; FE van goi `/set-default` va doc `defaultWorkspace`.
- `user profile`: `GET /me` da doi `workspace` thanh `currentWorkspace`, va `mainImage` la object media; FE `app/lib/users/definitions.ts` hien van map theo contract cu. Hien tac dong runtime thap vi permissions server chi doc `permissions[]`.
- `blogs`: create va response dung `visible`, update dung `isVisible`; frontend van can tiep tuc xu ly ky de tranh drift.
- `ai-provider-configs`: frontend sanitize `apiKey` khoi response truoc khi dua xuong client.
- `media` va `system-prompts`: da co trong spec nhung frontend chua co module; `system-prompts` hien tai giu ca nhom legacy prompt types va nhom prompt moi cho news article, events, va market query.
- `topics`: van ton tai tren frontend, nhung khong con nam trong snapshot API hien tai.
