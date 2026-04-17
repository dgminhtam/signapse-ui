# Tai lieu anh xa API

Tai lieu nay anh xa snapshot OpenAPI backend trong `docs/api_mapping.json` toi cac diem tich hop frontend cua repo.

Xac minh lan cuoi: ngay 17 thang 4 nam 2026

## Cau hinh co so

| Muc | Gia tri |
| --- | --- |
| URL goc API | `http://localhost:8484` |
| Nguon chuan | `docs/api_mapping.json` |
| Ham ho tro xac thuc | `fetchAuthenticated()` trong `app/api/auth/action.ts` |
| Ham ho tro public | `fetchPublic()` trong `app/api/auth/action.ts` |
| Kieu boc ket qua mutation | `ActionResult<T>` tu `app/lib/definitions.ts` |

## Quy uoc dung chung

- Cac request duoc bao ve di qua `fetchAuthenticated()`.
- `apiFetch()` doc `response.text()` truoc khi parse JSON, phu hop voi backend co the tra body rong hoac JSON khong hop le.
- Frontend runtime hien serialize query list thanh `$filter`, `page`, `size`, `sort` thong qua `queryParamsToString()`.
- OpenAPI van mo ta list query bang `specification` va `pageable`, nen can tach biet giua spec contract va effective runtime contract.

## Pham vi endpoint

### 1. API system prompts

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/system-prompts` | `getSystemPrompts` | `-` | Chua trien khai | Chua co `app/api/system-prompts/action.ts`. |
| POST | `/system-prompts` | `createSystemPrompt` | `-` | Chua trien khai | Backend da co schema `CreateSystemPromptRequest`. |
| GET | `/system-prompts/{promptType}` | `getSystemPrompt` | `-` | Chua trien khai | Frontend chua tich hop. |
| PUT | `/system-prompts/{promptType}` | `updateSystemPrompt` | `-` | Chua trien khai | Frontend chua tich hop. |
| DELETE | `/system-prompts/{promptType}` | `deleteSystemPrompt` | `-` | Chua trien khai | Frontend chua tich hop. |

### 2. API sources

Frontend da duoc doi naming sang `sources` de khop backend `/sources`.

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/sources` | `getSources` | `getSources(searchParams)` | Da trien khai | UI route/module da dung `sources`; list hien thi ca `url` va `rssUrl`. |
| POST | `/sources` | `createSource` | `createSource(request)` | Da trien khai | Frontend gui request qua module `sources`. |
| GET | `/sources/{id}` | `getSource` | `getSourceById(id)` | Da trien khai | Frontend hydrate ca `url` va `rssUrl`. |
| PUT | `/sources/{id}` | `updateSource` | `updateSource(id, request)` | Da trien khai | UI va API client dung naming `source`. |
| DELETE | `/sources/{id}` | `deleteSource` | `deleteSource(id)` | Da trien khai | Duoc boc trong `ActionResult`. |
| PATCH | `/sources/{id}/toggle-active` | `toggleActive` | `toggleSourceActive(id)` | Da trien khai | Toggle active inline. |
| GET | `/sources/active` | `getActiveSources` | `getActiveSources()` | Lech mot phan | Frontend helper da rename; can tiep tuc theo doi shape page vs array cua BE runtime. |

### 3. API articles

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/articles` | `getArticles` | `getArticles(searchParams)` | Da trien khai | Tra ve `Page<ArticleListResponse>`. |
| GET | `/articles/{id}` | `getArticle` | `getArticleById(id)` | Da trien khai | Tra ve `ArticleResponse`. |
| DELETE | `/articles/{id}` | `deleteArticle` | `deleteArticle(id)` | Da trien khai | Duoc boc trong `ActionResult`. |
| POST | `/articles/{id}/analyze` | `analyzeContent` | `analyzeArticle(id)` | Da trien khai | Analyze article tu UI. |
| PATCH | `/articles/{id}/feature-image` | `updateFeatureImage` | `-` | Chua trien khai | API moi trong spec, frontend chua co action/page. |

### 4. API blogs

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/blogs` | `getBlogPosts` | `getBlogs(searchParams)` | Da trien khai | Tra ve `Page<BlogPostListResponse>`. |
| POST | `/blogs` | `createBlogPost` | `createBlog(request)` | Da trien khai nhung co lech contract | Backend create schema dung `visible`. |
| GET | `/blogs/{id}` | `getBlogPost` | `getBlogById(id)` | Da trien khai nhung co lech contract | Backend response dung `visible`. |
| PUT | `/blogs/{id}` | `updateBlogPost` | `updateBlog(id, request)` | Da trien khai | Backend update schema dung `isVisible`. |
| DELETE | `/blogs/{id}` | `deleteBlogPost` | `deleteBlog(id)` | Da trien khai | Duoc boc trong `ActionResult`. |

### 5. API cronjobs

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/cronjobs` | `list` | `getCronjobs(searchParams)` | Da trien khai | Tra ve `Page<CronjobListResponse>`. |
| POST | `/cronjobs` | `create` | `createCronjob(request)` | Da trien khai | Dung `CronjobRequest`. |
| GET | `/cronjobs/{id}` | `get` | `getCronjobById(id)` | Da trien khai | Tra ve `CronjobResponse`. |
| PATCH | `/cronjobs/{id}` | `update` | `updateCronjob(id, request)` | Da trien khai | Frontend va backend deu dung `PATCH`. |
| DELETE | `/cronjobs/{id}` | `delete` | `deleteCronjob(id)` | Da trien khai | Duoc boc trong `ActionResult`. |
| POST | `/cronjobs/{id}/start` | `start` | `startCronjob(id)` | Da trien khai | Da tich hop. |
| POST | `/cronjobs/{id}/pause` | `pause` | `pauseCronjob(id)` | Da trien khai | Da tich hop. |
| POST | `/cronjobs/{id}/resume` | `resume` | `resumeCronjob(id)` | Da trien khai | Da tich hop. |
| POST | `/cronjobs/{id}/stop` | `stop` | `-` | Chua trien khai | Backend da co spec, frontend chua co `stopCronjob()`. |

### 6. API economic calendar

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/economic-calendar` | `getEvents` | `getEconomicEvents(searchParams)` | Da trien khai | Tra ve `Page<EconomicEventListResponse>`. |
| GET | `/economic-calendar/{id}` | `getEvent` | `getEconomicEventById(id)` | Da trien khai | Tra ve `EconomicEventResponse`. |
| DELETE | `/economic-calendar/{id}` | `deleteEvent` | `deleteEconomicEvent(id)` | Da trien khai | Duoc boc trong `ActionResult`. |
| POST | `/economic-calendar/crawl` | `crawl` | `crawlEconomicEvents()` | Da trien khai | Tra ve `number`. |
| GET | `/economic-calendar/impact/{impact}` | `getEventsByImpact` | `-` | Chua trien khai | Chua co action frontend. |
| GET | `/economic-calendar/country/{country}` | `getEventsByCountry` | `-` | Chua trien khai | Chua co action frontend. |

### 7. API AI provider configs

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/ai-provider-configs` | `getAiProviderConfigs` | `getAiProviderConfigs(searchParams)` | Da trien khai nhung co lech contract | Runtime dung `$filter/page/size/sort`; response raw duoc sanitize truoc khi truyen xuong client. |
| POST | `/ai-provider-configs` | `createAiProviderConfig` | `createAiProviderConfig(request)` | Da trien khai | Frontend dung `AiProviderConfigCreateRequest`. |
| GET | `/ai-provider-configs/{id}` | `getAiProviderConfig` | `getAiProviderConfigById(id)` | Da trien khai nhung co lech contract | Frontend tra DTO da sanitize, khong hydrate `apiKey`. |
| PUT | `/ai-provider-configs/{id}` | `updateAiProviderConfig` | `updateAiProviderConfig(id, request)` | Da trien khai | `apiKey` chi gui khi user nhap gia tri moi. |
| DELETE | `/ai-provider-configs/{id}` | `deleteAiProviderConfig` | `deleteAiProviderConfig(id)` | Da trien khai | Duoc boc trong `ActionResult`. |
| PATCH | `/ai-provider-configs/{id}/set-default` | `setDefault` | `setAiProviderConfigDefault(id)` | Da trien khai | Da tich hop. |
| POST | `/ai-provider-configs/model-catalog` | `getModelCatalog` | `getAiProviderModelCatalog(request)` | Da trien khai | Tai danh sach model dong theo provider credentials. |

### 8. API assets

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/assets` | `getAssets` | `getAssets(searchParams)` | Da trien khai | Asset catalog chi doc, duoc dung cho multi-select trong workspace watchlist editor. |
| GET | `/assets/{id}` | `getAsset` | `getAssetById(id)` | Da trien khai | Frontend co helper hydrate chi tiet khi can. |

### 9. API media

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/medias` | `getMedias` | `-` | Chua trien khai | Chua co `app/api/medias/action.ts`. |
| GET | `/medias/{id}` | `getMedia` | `-` | Chua trien khai | Chua co tich hop. |
| DELETE | `/medias/{id}` | `deleteMedia` | `-` | Chua trien khai | Chua co tich hop. |
| POST | `/medias/upload` | `upload` | `-` | Chua trien khai | Chua co tich hop. |

### 10. API workspace

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/me/workspaces` | `getMyWorkspaces` | `getMyWorkspaces(searchParams)` | Da trien khai | Du lieu nap o `app/(main)/layout.tsx` de render workspace switcher va watchlist editor theo workspace active. |
| POST | `/me/workspaces` | `createWorkspace` | `createWorkspace(request)` | Da trien khai | Dialog tao workspace chi xu ly metadata `name` va `slug`. |
| PUT | `/me/workspaces/{id}` | `updateWorkspace` | `updateWorkspace(id, request)` | Da trien khai | Dung cho rename workspace active, khong gui watchlist trong body. |
| PATCH | `/me/workspaces/{id}/set-default` | `setDefaultWorkspace` | `setDefaultWorkspace(id)` | Da trien khai | Chon workspace goi API nay va `router.refresh()`; user doi workspace truoc khi mo watchlist editor cho workspace khac. |
| DELETE | `/me/workspaces/{id}` | `-` | `-` | Chua duoc document trong file tich hop | Snapshot path hien tai khong con xuat hien trong `api_mapping.json`. |

Watchlist khong nam trong `CreateWorkspaceRequest` hay `UpdateWorkspaceRequest`. Frontend chinh
asset theo doi bang action rieng trong menu workspace sau khi workspace da duoc chon.

### 11. API user

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/me` | `me` | `getMe()` | Da trien khai | Dung de lay `permissions[]` cho left menu va workspace actions. |

### 12. API wiki

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| POST | `/wiki/ingest/articles/{articleId}` | `ingestArticle` | `ingestArticleToWiki(articleId)` | Da trien khai | Dang duoc dung tu man articles. |
| GET | `/wiki/pages/{slug}` | `getPageBySlug` | `getWikiPageBySlug(slug)` | Da trien khai | Dung cho route `/wiki/[slug]`. |
| GET | `/wiki/pages/{id}/sources` | `getPageSources` | `getWikiPageSources(id)` | Da trien khai | Hien thi source references cho page detail. |
| GET | `/wiki/pages` | `getPages` | `-` | Chua trien khai | Chua co action list wiki pages. |
| POST | `/wiki/rebuild-index` | `rebuildIndex` | `-` | Chua trien khai | Chua co action frontend. |
| POST | `/wiki/query` | `query` | `-` | Chua trien khai | Chua co action frontend. |
| POST | `/wiki/query/save` | `saveQueryResult` | `-` | Chua trien khai | Chua co action frontend. |
| POST | `/wiki/lint` | `lint` | `-` | Chua trien khai | Chua co action frontend. |
| GET | `/wiki/logs` | `getLogs` | `-` | Chua trien khai | Chua co action frontend. |

### 13. API roles

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/roles` | `getRoles` | `-` | Chua trien khai | Chua co module frontend. |
| PUT | `/roles/{roleKey}/permissions` | `updateRolePermissions` | `-` | Chua trien khai | Chua co module frontend. |

### 14. API permissions

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/permissions` | `getPermissions` | `-` | Chua trien khai | Chua co module frontend. |

### 15. API watchlists

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/watchlists` | `getWatchlist` | `getWatchlists(searchParams)` | Da trien khai | Editor load danh sach asset theo doi cua workspace dang active. |
| POST | `/watchlists` | `createWatchlist` | `addAssetToWatchlist({ assetId })` | Da trien khai | Frontend sync multi-select theo diff add. |
| DELETE | `/watchlists/assets/{assetId}` | `deleteByAssetId` | `deleteWatchlistAsset(assetId)` | Da trien khai | Frontend sync multi-select theo diff remove. |

Watchlist backend hien phu thuoc workspace dang duoc selected/current. Frontend khong con menu
hoac route watchlist rieng; user chinh danh sach asset theo doi tu context workspace.

### 16. Webhook

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| POST | `/webhooks/clerk` | `handleClerkWebhook` | `-` | Chi backend | Endpoint backend nhan request di vao, khong ky vong co frontend caller. |

### 17. Health check

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/health` | `healthCheck` | `-` | Chua trien khai | Chua co action rieng. |

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

| Khu vuc | File frontend |
| --- | --- |
| Helper dung chung | `app/lib/definitions.ts`, `app/lib/utils.ts` |
| Tang van chuyen auth | `app/api/auth/action.ts` |
| Sources | `app/api/sources/action.ts`, `app/lib/sources/definitions.ts` |
| Articles | `app/api/articles/action.ts`, `app/lib/articles/definitions.ts` |
| Blogs | `app/api/blogs/action.ts`, `app/lib/blogs/definitions.ts` |
| Cronjobs | `app/api/cronjobs/action.ts`, `app/lib/cronjobs/definitions.ts` |
| Economic calendar | `app/api/economic-calendar/action.ts`, `app/lib/economic-calendar/definitions.ts` |
| AI provider configs | `app/api/ai-provider-configs/action.ts`, `app/lib/ai-provider-configs/definitions.ts` |
| Assets | `app/api/assets/action.ts`, `app/lib/assets/definitions.ts` |
| User profile | `app/api/user/action.ts`, `app/lib/users/definitions.ts` |
| Workspace | `app/api/workspaces/action.ts`, `app/lib/workspaces/definitions.ts` |
| Watchlists | `app/api/watchlists/action.ts`, `app/lib/watchlists/definitions.ts`, `components/workspace-watchlist-editor.tsx`, `components/asset-multi-select-combobox.tsx` |
| Wiki | `app/api/wiki/action.ts`, `app/lib/wiki/definitions.ts` |
| Route user cuc bo | `app/api/user/route.ts` |
| Media | `-` |
| Roles | `-` |
| Permissions | `-` |
| System prompts | `-` |

## Cac diem lech contract da biet

- `/sources/active`: spec tra ve page, frontend helper hien van ky vong mang thuan.
- `blogs`: backend create dung `visible`, update dung `isVisible`, response dung `visible`.
- `ai-provider-configs`: spec van mo ta query theo `specification/pageable`, trong khi runtime frontend dang dung `$filter/page/size/sort`.
- `ai-provider-configs`: spec van expose `apiKey` trong response raw; frontend da sanitize de tranh hydrate secret xuong browser.
- `assets`: frontend da tich hop list/detail cho workspace watchlist editor, nhung hien moi dung nhu read-only catalog.
- `/me`: da duoc tich hop de lay permission/menu state, nhung profile display va auth session van doc tu Clerk trong layout.
- `workspace`: create/update request hien chi chua `name` va `slug`; asset theo doi duoc chinh bang action rieng trong workspace menu.
- `watchlists`: backend resolve theo current selected workspace. Frontend da bo menu/module doc lap va chuyen sang workspace-context editor.
- `wiki query/lint/rebuild-index/logs`: da co trong spec nhung frontend chua co action/page.
- `roles`, `permissions`, `medias`, `articles/{id}/feature-image`, `system-prompts`: da co trong spec nhung frontend chua co action/page tuong ung.
- Workspace da duoc tich hop theo sidebar switcher (switch/create/rename/watchlist editor), nhung chua co route list CRUD rieng.
