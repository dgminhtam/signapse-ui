# Tai lieu anh xa API

Tai lieu nay anh xa snapshot OpenAPI backend trong `docs/api_mapping.json` toi cac diem tich hop frontend hien tai cua repo.

Xac minh lan cuoi: ngay 19 thang 4 nam 2026

## Cau hinh co so

| Muc | Gia tri |
| --- | --- |
| URL goc API | `http://localhost:8484` |
| Nguon chuan | `docs/api_mapping.json` |
| Ham auth chinh | `fetchAuthenticated()` trong `app/api/auth/action.ts` |
| Ham public | `fetchPublic()` trong `app/api/auth/action.ts` |
| Kieu mutation result | `ActionResult<T>` trong `app/lib/definitions.ts` |

## Quy uoc dung chung

- Cac request duoc bao ve di qua `fetchAuthenticated()`.
- `apiFetch()` doc `response.text()` truoc khi parse JSON.
- Frontend runtime list/search dang serialize query thanh `$filter`, `page`, `size`, `sort` thong qua `queryParamsToString()`.
- OpenAPI van mo ta list query bang `specification` va `pageable`, nen can tach biet giua spec contract va effective runtime contract ma frontend dang goi.

## Tong quan thay doi lon tu snapshot hien tai

- Backend da chot domain noi dung chinh la `source-documents`.
- Backend da bo sung surface `events` cho list/detail va enrich assets/themes, va frontend nay da co module doc/van hanh rieng de tich hop.
- Frontend da co module `source-documents` canon va da loai bo cac route legacy `/articles` va `/economic-calendar`.
- Frontend da loai bo toan bo surface `wiki`; content surfaces hien tai gom `sources`, `source-documents`, va `events`.
- `sources` da duoc thu gon DTO va form theo contract backend hien tai, dong thoi UI da map `systemManaged` de khoa thao tac thu cong khi can.
- `roles` va `permissions` hien da co action va UI frontend, khong con o trang thai "chua trien khai".

## Pham vi endpoint

### 1. API system prompts

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/system-prompts` | `getSystemPrompts` | `-` | Chua trien khai | Chua co `app/api/system-prompts/action.ts`. |
| POST | `/system-prompts` | `createSystemPrompt` | `-` | Chua trien khai | Backend da co create schema. |
| GET | `/system-prompts/{promptType}` | `getSystemPrompt` | `-` | Chua trien khai | Frontend chua tich hop. |
| PUT | `/system-prompts/{promptType}` | `updateSystemPrompt` | `-` | Chua trien khai | Frontend chua tich hop. |
| DELETE | `/system-prompts/{promptType}` | `deleteSystemPrompt` | `-` | Chua trien khai | Frontend chua tich hop. |

Ghi chu:
- Enum `promptType` trong snapshot hien tai da dung `FIRECRAWL_SOURCE_DOCUMENT_FILTER`, `NEWS_PRIMARY_EVENT_DERIVATION`, va `EVENT_ASSET_THEME_ENRICHMENT`.

### 2. API sources

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/sources` | `getSources` | `getSources(searchParams)` | Da trien khai | Frontend list map `type`, ingest metadata, va `systemManaged`; UI khoa edit/delete/toggle cho nguon he thong. |
| POST | `/sources` | `createSource` | `createSource(request)` | Da trien khai | Frontend request chi gui `name`, `type`, `description`, `url`, `rssUrl`, va `active`. |
| GET | `/sources/{id}` | `getSource` | `getSourceById(id)` | Da trien khai | Frontend detail map ingest metadata va `systemManaged`; man hinh chinh sua chuyen sang read-only mem cho nguon he thong. |
| PUT | `/sources/{id}` | `updateSource` | `updateSource(id, request)` | Da trien khai | Form edit chi submit bo field co ban cua contract hien tai. |
| DELETE | `/sources/{id}` | `deleteSource` | `deleteSource(id)` | Da trien khai | Duoc boc trong `ActionResult`; UI khoa nut xoa khi `systemManaged = true`. |
| PATCH | `/sources/{id}/toggle-active` | `toggleActive` | `toggleSourceActive(id)` | Da trien khai | Toggle inline trong source list va bi vo hieu hoa cho nguon he thong. |
| GET | `/sources/active` | `getActiveSources` | `getActiveSources()` | Da trien khai nhung can xac nhan runtime | Frontend helper van ky vong `SourceListResponse[]`; neu runtime tra ve `systemManaged` thi type hien tai da san sang nhan. |

Frontend lien quan:
- `app/api/sources/action.ts`
- `app/lib/sources/definitions.ts`
- `app/(main)/sources/*`

### 3. API source documents

Day la domain noi dung canon cua snapshot backend hien tai.

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/source-documents` | `getSourceDocuments` | `getSourceDocuments(searchParams)` | Da trien khai | Route canon la `/source-documents`; frontend list co search, sort, filter theo `documentType`. |
| GET | `/source-documents/{id}` | `getSourceDocument` | `getSourceDocumentById(id)` | Da trien khai | Trang chi tiet render metadata chung, metadata rieng cho `ECONOMIC_CALENDAR`, va section `linkedEvents` de trace nguoc sang event. |
| DELETE | `/source-documents/{id}` | `deleteSourceDocument` | `deleteSourceDocument(id)` | Da trien khai | Co confirm destructive trong UI. |
| POST | `/source-documents/{id}/crawl-full-content` | `crawlFullContent` | `crawlSourceDocumentFullContent(id)` | Da trien khai | Co button trong detail page. |
| POST | `/source-documents/{id}/analyze` | `analyzeContent` | `analyzeSourceDocument(id)` | Da trien khai | Co action o list va detail. |
| POST | `/source-documents/{id}/derive-primary-event` | `derivePrimaryEvent` | `derivePrimaryEventFromSourceDocument(id)` | Da trien khai | Co action tren detail cho `NEWS`; frontend refresh list/detail va hien toast summary theo `outcome`, `changeType`, `message`. |
| POST | `/source-documents/derive-pending-news-events` | `derivePendingNewsEvents` | `derivePendingNewsEvents(batchSize?)` | Da trien khai | Co action batch trong toolbar list; frontend hien tong hop so luong tao moi/cap nhat/khong co su kien/bo qua/loi. |
| PATCH | `/source-documents/{id}/feature-image` | `updateFeatureImage` | `updateSourceDocumentFeatureImage(id, request)` | Da trien khai mot phan | Da co server action nhung chua co UI chon media de patch feature image. |

Frontend lien quan:
- `app/api/source-documents/action.ts`
- `app/lib/source-documents/definitions.ts`
- `app/lib/source-documents/permissions.ts`
- `app/(main)/source-documents/*`

Ghi chu:
- Frontend da bo compatibility fallback `article:*` va `event:*` khoi source-document permission helper; domain nay nay dung `source-document:read`, `source-document:analyze`, `source-document:update`, va `source-document:delete`.
- Section `linkedEvents` tren source-document detail van hien summary traceability ngay ca khi user khong co `event:read`, nhung chi bat link sang `/events/{id}` khi user co quyen do.

### 4. API events

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/events` | `getEvents` | `getEvents(searchParams)` | Da trien khai | Frontend co route `/events`, toolbar batch-enrich + search, sort, phan trang, va render core metadata `title`, `status`, `enrichmentStatus`, `occurredAt`, `confidence`. |
| GET | `/events/{id}` | `getEvent` | `getEventById(id)` | Da trien khai | Route chi tiet render block core, enrichment, assets, themes, va evidence voi traceability sang source-documents. |
| POST | `/events/{id}/enrich-assets-and-themes` | `enrichAssetsAndThemes` | `enrichEventAssetsAndThemes(id)` | Da trien khai | Co nut operator tren event detail; toast summary dua tren `EventEnrichmentResult`. |
| POST | `/events/enrich-pending-assets-and-themes` | `enrichPendingAssetsAndThemes` | `enrichPendingEventAssetsAndThemes(batchSize?)` | Da trien khai | Co nut batch tren event list; v1 dung backend default batch size neu FE khong truyen override. |

Frontend lien quan:
- `app/api/events/action.ts`
- `app/lib/events/definitions.ts`
- `app/lib/events/permissions.ts`
- `app/(main)/events/*`

Ghi chu:
- `event:read` dung de gate navigation, `/events`, `/events/{id}`, va cac link sang event detail.
- Event enrich operators hien duoc gate bang `source-document:analyze` theo quyet dinh backend hien tai; frontend khong su dung `event:crawl` cho flow nay.

### 5. API blogs

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/blogs` | `getBlogPosts` | `getBlogs(searchParams)` | Da trien khai | Tra ve `Page<BlogPostListResponse>`. |
| POST | `/blogs` | `createBlogPost` | `createBlog(request)` | Da trien khai nhung con lech contract | Backend create schema dung `visible`. |
| GET | `/blogs/{id}` | `getBlogPost` | `getBlogById(id)` | Da trien khai nhung con lech contract | Response backend dung `visible`. |
| PUT | `/blogs/{id}` | `updateBlogPost` | `updateBlog(id, request)` | Da trien khai | Backend update schema dung `isVisible`. |
| DELETE | `/blogs/{id}` | `deleteBlogPost` | `deleteBlog(id)` | Da trien khai | Duoc boc trong `ActionResult`. |

### 6. API cronjobs

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/cronjobs` | `list` | `getCronjobs(searchParams)` | Da trien khai | Tra ve `Page<CronjobListResponse>`. |
| POST | `/cronjobs` | `create` | `createCronjob(request)` | Da trien khai | Dung `CronjobRequest`. |
| GET | `/cronjobs/{id}` | `get` | `getCronjobById(id)` | Da trien khai | Tra ve `CronjobResponse`. |
| PATCH | `/cronjobs/{id}` | `update` | `updateCronjob(id, request)` | Da trien khai | Frontend va backend deu dung `PATCH`. |
| DELETE | `/cronjobs/{id}` | `delete` | `deleteCronjob(id)` | Da trien khai | Duoc boc trong `ActionResult`. |
| POST | `/cronjobs/{id}/start` | `start` | `startCronjob(id)` | Da trien khai | Co UX. |
| POST | `/cronjobs/{id}/pause` | `pause` | `pauseCronjob(id)` | Da trien khai | Co UX. |
| POST | `/cronjobs/{id}/resume` | `resume` | `resumeCronjob(id)` | Da trien khai | Co UX. |
| POST | `/cronjobs/{id}/stop` | `stop` | `-` | Chua trien khai | Frontend chua co `stopCronjob()`. |

### 7. API AI provider configs

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/ai-provider-configs` | `getAiProviderConfigs` | `getAiProviderConfigs(searchParams)` | Da trien khai nhung co lech runtime/spec | Runtime frontend dung `$filter/page/size/sort`; response raw duoc sanitize truoc khi dua xuong client. |
| POST | `/ai-provider-configs` | `createAiProviderConfig` | `createAiProviderConfig(request)` | Da trien khai | Dung DTO tao rieng. |
| GET | `/ai-provider-configs/{id}` | `getAiProviderConfig` | `getAiProviderConfigById(id)` | Da trien khai | Frontend sanitize `apiKey`. |
| PUT | `/ai-provider-configs/{id}` | `updateAiProviderConfig` | `updateAiProviderConfig(id, request)` | Da trien khai | `apiKey` chi gui khi user thay doi. |
| DELETE | `/ai-provider-configs/{id}` | `deleteAiProviderConfig` | `deleteAiProviderConfig(id)` | Da trien khai | Duoc boc trong `ActionResult`. |
| PATCH | `/ai-provider-configs/{id}/set-default` | `setDefault` | `setAiProviderConfigDefault(id)` | Da trien khai | Da tich hop. |
| POST | `/ai-provider-configs/model-catalog` | `getModelCatalog` | `getAiProviderModelCatalog(request)` | Da trien khai | Tai model catalog theo credentials. |

### 8. API assets

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/assets` | `getAssets` | `getAssets(searchParams)` | Da trien khai | Asset catalog read-only. |
| GET | `/assets/{id}` | `getAsset` | `getAssetById(id)` | Da trien khai | Co helper hydrate detail. |

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
| GET | `/me/workspaces` | `getMyWorkspaces` | `getMyWorkspaces(searchParams)` | Da trien khai | Nap workspace cho switcher va watchlist editor. |
| POST | `/me/workspaces` | `createWorkspace` | `createWorkspace(request)` | Da trien khai | Chi xu ly metadata workspace. |
| PUT | `/me/workspaces/{id}` | `updateWorkspace` | `updateWorkspace(id, request)` | Da trien khai | Rename workspace. |
| PATCH | `/me/workspaces/{id}/set-default` | `setDefaultWorkspace` | `setDefaultWorkspace(id)` | Da trien khai | Doi workspace mac dinh. |

### 11. API user

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/me` | `me` | `getMe()` | Da trien khai | Dung de lay `permissions[]` va workspace thong qua backend profile. |

### 12. API wiki

Khong con tich hop frontend.

Ghi chu:
- Toan bo route, action, definition, va UI surface `wiki` da duoc go khoi frontend.
- Neu backend tai xuat wiki trong tuong lai, nen de xuat mot change moi thay vi tai su dung module cu.

### 13. API roles

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/roles` | `getRoles` | `getRoles()` | Da trien khai | Trang roles da load danh sach vai tro. |
| PUT | `/roles/{roleKey}/permissions` | `updateRolePermissions` | `updateRolePermissions(roleKey, request)` | Da trien khai | Dialog frontend cho phep cap nhat permission keys. |

### 14. API permissions

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/permissions` | `getPermissions` | `getPermissions()` | Da trien khai | Duoc dung cung role editor de build permission catalog. |

### 15. API watchlists

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/watchlists` | `getWatchlist` | `getWorkspaceWatchlistAssets(searchParams)` | Da trien khai | Frontend da doi naming sang workspace watchlist assets. |
| POST | `/watchlists` | `createWatchlist` | `addAssetToWorkspaceWatchlist({ assetId })` | Da trien khai | Sync add theo diff trong workspace editor. |
| DELETE | `/watchlists/assets/{assetId}` | `deleteByAssetId` | `removeAssetFromWorkspaceWatchlist(assetId)` | Da trien khai | Sync remove theo diff. |

### 16. Webhook

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| POST | `/webhooks/clerk` | `handleClerkWebhook` | `-` | Chi backend | Khong ky vong co frontend caller. |

### 17. Health check

| Phuong thuc | Endpoint backend | operationId | Tich hop frontend | Trang thai | Ghi chu |
| --- | --- | --- | --- | --- | --- |
| GET | `/health` | `healthCheck` | `-` | Chua trien khai | Chua co helper rieng. |

## Nhom frontend khong nam trong snapshot API hien tai

Nhung nhom duoi day van ton tai tren frontend, nhung khong xuat hien trong `docs/api_mapping.json` hien tai.

| Nhom | Tinh trang frontend | Ghi chu |
| --- | --- | --- |
| Topics | `app/api/topics/action.ts`, `app/lib/topics/definitions.ts`, `app/(main)/topics/*` | Frontend van co module topics, nhung snapshot API hien tai khong co `/topics*`. |

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
| Sources | `app/api/sources/action.ts`, `app/lib/sources/definitions.ts`, `app/(main)/sources/*` |
| Source documents | `app/api/source-documents/action.ts`, `app/lib/source-documents/definitions.ts`, `app/lib/source-documents/permissions.ts`, `app/(main)/source-documents/*` |
| Events | `-` |
| Blogs | `app/api/blogs/action.ts`, `app/lib/blogs/definitions.ts` |
| Cronjobs | `app/api/cronjobs/action.ts`, `app/lib/cronjobs/definitions.ts` |
| AI provider configs | `app/api/ai-provider-configs/action.ts`, `app/lib/ai-provider-configs/definitions.ts` |
| Assets | `app/api/assets/action.ts`, `app/lib/assets/definitions.ts` |
| User profile | `app/api/user/action.ts`, `app/lib/users/definitions.ts` |
| Workspace | `app/api/workspaces/action.ts`, `app/lib/workspaces/definitions.ts` |
| Watchlists | `app/api/watchlists/action.ts`, `app/lib/watchlists/definitions.ts`, `components/workspace-watchlist-editor.tsx`, `components/asset-multi-select-combobox.tsx` |
| Roles va permissions | `app/api/roles/action.ts`, `app/lib/roles/definitions.ts`, `app/(main)/roles/*` |
| Route user cuc bo | `app/api/user/route.ts` |
| Media | `-` |
| System prompts | `-` |
| Topics (ngoai spec hien tai) | `app/api/topics/action.ts`, `app/lib/topics/definitions.ts`, `app/(main)/topics/*` |

## Cac diem lech contract da biet

- List/search runtime cua frontend dang dung `$filter/page/size/sort`, trong khi OpenAPI tiep tuc mo ta `specification/pageable` o nhieu list endpoint.
- `/sources/active`: helper frontend van ky vong mang thuan; can tiep tuc xac nhan runtime backend neu BE doi shape.
- `source-documents/{id}/feature-image`: da co server action nhung chua co UX thao tac media.
- `events`: spec hien co list/detail va enrich assets/themes, nhung frontend chua co `app/api/events/action.ts`, route `app/(main)/events/*`, hoac DTO mapping cho event domain.
- `blogs`: create va response dung `visible`, update dung `isVisible`; frontend van can tiep tuc xu ly ky de tranh drift.
- `ai-provider-configs`: frontend sanitize `apiKey` khoi response truoc khi dua xuong client.
- `media` va `system-prompts`: da co trong spec nhung frontend chua co module; `system-prompts` hien tai con them enum `NEWS_PRIMARY_EVENT_DERIVATION` va `EVENT_ASSET_THEME_ENRICHMENT`.
- `topics`: van ton tai tren frontend, nhung khong con nam trong snapshot API hien tai.
