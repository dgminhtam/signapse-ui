# Tài liệu ánh xạ API

Tài liệu này ánh xạ đặc tả OpenAPI backend đang chạy tại `http://localhost:8484/v3/api-docs` tới các điểm tích hợp frontend trong repository này.

Xác minh lần cuối: ngày 14 tháng 4 năm 2026

## Cấu hình cơ sở

| Mục | Giá trị |
| --- | --- |
| URL gốc API | `http://localhost:8484` |
| Nguồn chuẩn | OpenAPI live tại `http://localhost:8484/v3/api-docs` |
| Hàm hỗ trợ xác thực | `fetchAuthenticated()` trong `app/api/auth/action.ts` |
| Hàm hỗ trợ public | `fetchPublic()` trong `app/api/auth/action.ts` |
| Kiểu bọc kết quả mutation | `ActionResult<T>` từ `app/lib/definitions.ts` |

## Quy ước dùng chung

- Các lời gọi backend được bảo vệ dự kiến đi qua `fetchAuthenticated()`.
- `apiFetch()` đọc `response.text()` trước khi `JSON.parse()`, phù hợp với quy tắc của repo khi backend trả về body rỗng hoặc không hợp lệ.
- Các truy vấn danh sách ở frontend được serialize bằng `queryParamsToString()` thành `$filter`, `page`, `size` và `sort`.
- Đặc tả OpenAPI mô tả phân trang dưới dạng đối tượng query `Pageable`, trong khi frontend hiện đang gửi các query param phẳng.

## Phạm vi endpoint

### 1. API lời nhắc hệ thống

| Phương thức | Endpoint backend | OpenAPI operationId | Tích hợp frontend | Trạng thái | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| GET | `/system-prompts` | `getSystemPrompts` | `-` | Chưa triển khai | Repo này chưa có `app/api/system-prompts/action.ts`. |
| POST | `/system-prompts` | `createSystemPrompt` | `-` | Chưa triển khai | Schema request của backend: `CreateSystemPromptRequest`. |
| GET | `/system-prompts/{promptType}` | `getSystemPrompt` | `-` | Chưa triển khai | Enum của path param đã được mở rộng ở backend. |
| PUT | `/system-prompts/{promptType}` | `updateSystemPrompt` | `-` | Chưa triển khai | Schema request của backend: `UpdateSystemPromptRequest`. |
| DELETE | `/system-prompts/{promptType}` | `deleteSystemPrompt` | `-` | Chưa triển khai | Backend có endpoint này nhưng frontend chưa có action tương ứng. |

Các giá trị `promptType` được hỗ trợ theo live spec:

`NEWS_FILTER`, `NEWS_ANALYSIS`, `SIGNAL_GENERATION`, `DECISION_MAKING`, `CONTENT_EXTRACTION`, `SENTIMENT_ANALYSIS`, `TITLE_GENERATION`, `SUMMARY_GENERATION`, `CONTENT_CLEANING`, `FIRECRAWL_ARTICLE_FILTER`, `WIKI_SOURCE_SUMMARY`, `WIKI_PAGE_UPDATE`, `WIKI_INDEX_REBUILD`, `WIKI_QUERY_ANSWER`

### 2. API nguồn tin

| Phương thức | Endpoint backend | OpenAPI operationId | Tích hợp frontend | Trạng thái | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| GET | `/news-sources` | `getNewsSources` | `getNewsSources(searchParams)` | Đã triển khai nhưng có lệch contract | Frontend list hiện hiển thị cả `url` và `rssUrl`; live spec của `NewsSourceListResponse` hiện mới mô tả `url`. |
| POST | `/news-sources` | `createNewsSource` | `createNewsSource(request)` | Đã triển khai | Sử dụng `NewsSourceRequest`, bao gồm cả `url` và `rssUrl`. |
| GET | `/news-sources/{id}` | `getNewsSource` | `getNewsSourceById(id)` | Đã triển khai | Trả về `NewsSourceResponse`; form edit hiện hydrate cả `url` và `rssUrl`. |
| PUT | `/news-sources/{id}` | `updateNewsSource` | `updateNewsSource(id, request)` | Đã triển khai | Sử dụng `NewsSourceRequest` cho cập nhật, bao gồm cả `rssUrl`. |
| DELETE | `/news-sources/{id}` | `deleteNewsSource` | `deleteNewsSource(id)` | Đã triển khai | Được bọc trong `ActionResult`. |
| PATCH | `/news-sources/{id}/toggle-active` | `toggleActive` | `toggleNewsSourceActive(id)` | Đã triển khai | Trả về `NewsSourceResponse` sau khi cập nhật. |
| GET | `/news-sources/active` | `getActiveNewsSources` | `getActiveNewsSources()` | Lệch một phần | Backend hiện trả về `PageNewsSourceListResponse`, nhưng frontend đang kỳ vọng `NewsSourceListResponse[]` và không gửi tham số phân trang. |

### 3. API bài viết

| Phương thức | Endpoint backend | OpenAPI operationId | Tích hợp frontend | Trạng thái | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| GET | `/articles` | `getArticles` | `getArticles(searchParams)` | Đã triển khai | Trả về `Page<ArticleListResponse>`. |
| GET | `/articles/{id}` | `getArticle` | `getArticleById(id)` | Đã triển khai | Trả về `ArticleResponse`. |
| DELETE | `/articles/{id}` | `deleteArticle` | `deleteArticle(id)` | Đã triển khai | Được bọc trong `ActionResult`. |
| POST | `/articles/{id}/analyze` | `analyzeContent` | `analyzeArticle(id)` | Đã triển khai | Trả về `ArticleResponse` sau khi cập nhật. |

### 4. API blog

| Phương thức | Endpoint backend | OpenAPI operationId | Tích hợp frontend | Trạng thái | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| GET | `/blogs` | `getBlogPosts` | `getBlogs(searchParams)` | Đã triển khai | Trả về `Page<BlogPostListResponse>`. |
| POST | `/blogs` | `createBlogPost` | `createBlog(request)` | Đã triển khai nhưng có rủi ro lệch contract | Kiểu request ở frontend dùng `isVisible`, nhưng schema tạo mới trong live spec lại dùng `visible`. |
| GET | `/blogs/{id}` | `getBlogPost` | `getBlogById(id)` | Đã triển khai nhưng có rủi ro lệch contract | Schema response của backend dùng `visible`, trong khi frontend hiện dùng `isVisible`. |
| PUT | `/blogs/{id}` | `updateBlogPost` | `updateBlog(id, request)` | Đã triển khai | Schema cập nhật trong live spec dùng `isVisible`. |
| DELETE | `/blogs/{id}` | `deleteBlogPost` | `deleteBlog(id)` | Đã triển khai | Được bọc trong `ActionResult`. |

### 5. API cronjob

| Phương thức | Endpoint backend | OpenAPI operationId | Tích hợp frontend | Trạng thái | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| GET | `/cronjobs` | `list` | `getCronjobs(searchParams)` | Đã triển khai | Trả về `Page<CronjobListResponse>`. |
| POST | `/cronjobs` | `create` | `createCronjob(request)` | Đã triển khai | Sử dụng `CronjobRequest`. |
| GET | `/cronjobs/{id}` | `get` | `getCronjobById(id)` | Đã triển khai | Trả về `CronjobResponse`. |
| PATCH | `/cronjobs/{id}` | `update` | `updateCronjob(id, request)` | Đã triển khai | Cả backend và frontend đều dùng `PATCH`. |
| DELETE | `/cronjobs/{id}` | `delete` | `deleteCronjob(id)` | Đã triển khai | Được bọc trong `ActionResult`. |
| POST | `/cronjobs/{id}/start` | `start` | `startCronjob(id)` | Đã triển khai | Trả về `CronjobResponse` sau khi cập nhật. |
| POST | `/cronjobs/{id}/pause` | `pause` | `pauseCronjob(id)` | Đã triển khai | Trả về `CronjobResponse` sau khi cập nhật. |
| POST | `/cronjobs/{id}/resume` | `resume` | `resumeCronjob(id)` | Đã triển khai | Trả về `CronjobResponse` sau khi cập nhật. |
| POST | `/cronjobs/{id}/stop` | `stop` | `-` | Chưa triển khai | Backend có endpoint này nhưng frontend chưa có `stopCronjob()`. |

### 6. API lịch kinh tế

| Phương thức | Endpoint backend | OpenAPI operationId | Tích hợp frontend | Trạng thái | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| GET | `/economic-calendar` | `getEvents` | `getEconomicEvents(searchParams)` | Đã triển khai | Trả về `Page<EconomicEventListResponse>`. |
| GET | `/economic-calendar/{id}` | `getEvent` | `getEconomicEventById(id)` | Đã triển khai | Trả về `EconomicEventResponse`. |
| DELETE | `/economic-calendar/{id}` | `deleteEvent` | `deleteEconomicEvent(id)` | Đã triển khai | Được bọc trong `ActionResult`. |
| POST | `/economic-calendar/crawl` | `crawl` | `crawlEconomicEvents()` | Đã triển khai | Trả về số bản ghi đã crawl dưới dạng `number`. |
| GET | `/economic-calendar/impact/{impact}` | `getEventsByImpact` | `-` | Chưa triển khai | Backend có endpoint lọc này nhưng frontend chưa có action tương ứng. |
| GET | `/economic-calendar/country/{country}` | `getEventsByCountry` | `-` | Chưa triển khai | Backend có endpoint lọc này nhưng frontend chưa có action tương ứng. |

### 7. API cấu hình AI provider

| Phương thức | Endpoint backend | OpenAPI operationId | Tích hợp frontend | Trạng thái | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| GET | `/ai-provider-configs` | `getAiProviderConfigs` | `getAiProviderConfigs(searchParams)` | Đã triển khai nhưng có lệch contract | Frontend/runtime đang gửi query phẳng `$filter`, `page`, `size`, `sort`; live spec vẫn mô tả `specification` và `pageable`. Response raw từ backend được sanitize trước khi truyền xuống client để loại `apiKey`. |
| POST | `/ai-provider-configs` | `createAiProviderConfig` | `createAiProviderConfig(request)` | Đã triển khai | Frontend dùng `AiProviderConfigCreateRequest`; response raw được sanitize để không hydrate `apiKey` xuống browser. |
| GET | `/ai-provider-configs/{id}` | `getAiProviderConfig` | `getAiProviderConfigById(id)` | Đã triển khai nhưng có lệch contract | Frontend trả về `AiProviderConfigResponse` đã sanitize, không chứa `apiKey` dù live spec hiện vẫn expose field này. |
| PUT | `/ai-provider-configs/{id}` | `updateAiProviderConfig` | `updateAiProviderConfig(id, request)` | Đã triển khai | Frontend dùng `AiProviderConfigUpdateRequest`; `apiKey` chỉ được gửi khi người dùng nhập giá trị mới. |
| POST | `/ai-provider-configs/model-catalog` | `getModelCatalog` | `getAiProviderModelCatalog(request)` | Đã triển khai | Dùng để tải danh sách model động từ `providerType + apiKey + baseUrl`. Response trả về `models[]` với `id` và `label`. |
| DELETE | `/ai-provider-configs/{id}` | `deleteAiProviderConfig` | `deleteAiProviderConfig(id)` | Đã triển khai | Được bọc trong `ActionResult`. |
| PATCH | `/ai-provider-configs/{id}/set-default` | `setDefault` | `setAiProviderConfigDefault(id)` | Đã triển khai | Trả về response đã sanitize sau khi cập nhật. |

Các giá trị `providerType` được hỗ trợ theo live spec:

`GEMINI`, `OPENAI`, `ZAI`

Effective contract frontend hiện tại cho danh sách AI providers:

- Query danh sách dùng `$filter`, `page`, `size`, `sort`.
- Search UI hiện map vào `name[containsIgnoreCase]`.
- Sort UI hiện expose `id` và `name`.
- Backend đã bỏ field `active`; frontend không còn render trạng thái bật/tắt cho AI providers.
- Model được chọn động qua endpoint `model-catalog`, nhưng người dùng vẫn có thể nhập tay nếu cần.

### 8. API chủ đề

| Phương thức | Endpoint backend | OpenAPI operationId | Tích hợp frontend | Trạng thái | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| GET | `/topics` | `getTopics` | `getTopics(searchParams)` | Đã triển khai | Được dùng cho route `/topics` với search, sort, pagination theo core của repo. |
| POST | `/topics` | `createTopic` | `createTopic(request)` | Đã triển khai | Schema request của frontend map từ form `TopicForm`, bao gồm keywords/entities dạng `string[]`. |
| GET | `/topics/{id}` | `getTopic` | `getTopicById(id)` | Đã triển khai | Trả về `TopicResponse` cho màn edit `/topics/{id}`. |
| PUT | `/topics/{id}` | `updateTopic` | `updateTopic(id, request)` | Đã triển khai | Schema request của frontend map từ `TopicForm`. |
| DELETE | `/topics/{id}` | `deleteTopic` | `deleteTopic(id)` | Đã triển khai | Được bọc trong `ActionResult`. |
| PATCH | `/topics/{id}/toggle-active` | `toggleActive` | `toggleTopicActive(id)` | Đã triển khai | Dùng cho toggle active inline ở bảng danh sách. |

### 9. API media

| Phương thức | Endpoint backend | OpenAPI operationId | Tích hợp frontend | Trạng thái | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| GET | `/medias` | `getMedias` | `-` | Chưa triển khai | Backend đã có endpoint danh sách media, frontend hiện chưa có `app/api/medias/action.ts`. |
| GET | `/medias/{id}` | `getMedia` | `-` | Chưa triển khai | Trả về `MediaResponse`. |
| DELETE | `/medias/{id}` | `deleteMedia` | `-` | Chưa triển khai | Backend đã có endpoint xóa media nhưng frontend chưa tích hợp. |
| POST | `/medias/upload` | `upload` | `-` | Chưa triển khai | Backend đã có endpoint upload media nhưng frontend chưa có action/page tương ứng. |

### 10. API workspace

| Phương thức | Endpoint backend | OpenAPI operationId | Tích hợp frontend | Trạng thái | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| GET | `/me/workspaces` | `getMyWorkspaces` | `getMyWorkspaces(searchParams)` | Đã triển khai | Dữ liệu được nạp ở `app/(main)/layout.tsx` để render Workspace Switcher trên sidebar (không có list page riêng). |
| POST | `/me/workspaces` | `createWorkspace` | `createWorkspace(request)` | Đã triển khai | Được gọi từ dialog inline trong Workspace Switcher ở sidebar. |
| PUT | `/me/workspaces/{id}` | `updateWorkspace` | `updateWorkspace(id, request)` | Đã triển khai | Dùng cho flow đổi tên workspace active (không áp dụng cho personal workspace). |
| DELETE | `/me/workspaces/{id}` | `softDeleteWorkspace` | `-` | Chưa triển khai | V1 chưa hỗ trợ delete workspace trong UI sidebar. |
| PATCH | `/me/workspaces/{id}/set-default` | `setDefaultWorkspace` | `setDefaultWorkspace(id)` | Đã triển khai | Chọn workspace sẽ gọi API này và `router.refresh()` để đồng bộ toàn app. |

### 11. API người dùng

| Phương thức | Endpoint backend | OpenAPI operationId | Tích hợp frontend | Trạng thái | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| GET | `/storefront/users/profile` | `getProfile` | `-` | Chưa triển khai | Repo hiện expose `app/api/user/route.ts`, route này trả về `currentUser()` từ Clerk trực tiếp thay vì gọi endpoint backend này. |

### 12. API wiki

| Phương thức | Endpoint backend | OpenAPI operationId | Tích hợp frontend | Trạng thái | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| POST | `/wiki/ingest/articles/{articleId}` | `ingestArticle` | `ingestArticleToWiki(articleId)` | Đã triển khai | Trả về `WikiPageResponse` và được dùng từ các màn bài viết. |
| GET | `/wiki/pages/{slug}` | `getPageBySlug` | `getWikiPageBySlug(slug)` | Đã triển khai | Dùng cho route `/wiki/[slug]`. |
| GET | `/wiki/pages/{id}/sources` | `getPageSources` | `getWikiPageSources(id)` | Đã triển khai | Dùng để hiển thị source references trên trang wiki. |

Các giá trị `pageType` được hỗ trợ theo live spec:

`INDEX`, `SOURCE_SUMMARY`, `TOPIC`, `ENTITY`, `LINT_REPORT`, `QUERY_RESULT`

### 13. Webhook

| Phương thức | Endpoint backend | OpenAPI operationId | Tích hợp frontend | Trạng thái | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| POST | `/webhooks/clerk` | `handleClerkWebhook` | `-` | Chỉ backend | Đây là endpoint backend nhận request đi vào nên không kỳ vọng có frontend caller tương ứng. |

### 14. Kiểm tra sức khỏe hệ thống

| Phương thức | Endpoint backend | OpenAPI operationId | Tích hợp frontend | Trạng thái | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| GET | `/health` | `healthCheck` | `-` | Chưa triển khai | Repo hiện chưa có action riêng cho health check. |

## Các kiểu dùng chung ở frontend

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

Được `queryParamsToString()` serialize thành:

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

## Các file type/action phía frontend

| Khu vực | File frontend |
| --- | --- |
| Helper dùng chung | `app/lib/definitions.ts`, `app/lib/utils.ts` |
| Tầng vận chuyển auth | `app/api/auth/action.ts` |
| Nguồn tin | `app/api/news-sources/action.ts`, `app/lib/news-sources/definitions.ts` |
| Bài viết | `app/api/articles/action.ts`, `app/lib/articles/definitions.ts` |
| Blog | `app/api/blogs/action.ts`, `app/lib/blogs/definitions.ts` |
| Cronjob | `app/api/cronjobs/action.ts`, `app/lib/cronjobs/definitions.ts` |
| Lịch kinh tế | `app/api/economic-calendar/action.ts`, `app/lib/economic-calendar/definitions.ts` |
| Cấu hình AI provider | `app/api/ai-provider-configs/action.ts`, `app/lib/ai-provider-configs/definitions.ts` |
| Topics | `app/api/topics/action.ts`, `app/lib/topics/definitions.ts` |
| Media | `-` |
| Workspace | `-` |
| Wiki | `app/api/wiki/action.ts`, `app/lib/wiki/definitions.ts` |
| Route người dùng cục bộ | `app/api/user/route.ts` |

## Các điểm lệch contract đã biết

- `/news-sources/active` được phân trang trong live spec của backend, nhưng helper hiện tại ở frontend vẫn đang kỳ vọng một mảng thuần.
- `news-sources` create/update/detail đã tích hợp `rssUrl`, nhưng live spec của `NewsSourceListResponse` hiện chưa mô tả field này cho endpoint danh sách.
- Backend hỗ trợ `topicIds` ở create/update và `topics` ở response của `news-sources`, nhưng frontend hiện vẫn chưa có UI để gán topic trực tiếp cho news source.
- Trường hiển thị của blog đang không nhất quán giữa các lớp:
  - Schema tạo mới trong OpenAPI dùng `visible`
  - Schema cập nhật trong OpenAPI dùng `isVisible`
  - Schema response trong OpenAPI dùng `visible`
  - Definitions blog ở frontend hiện dùng `isVisible`
- `ai-provider-configs` trong live spec hiện vẫn expose `apiKey` ở response list/detail/mutation; frontend đã sanitize để tránh hydrate secret xuống browser.
- `ai-provider-configs` trong live spec mô tả truy vấn theo `specification` và `pageable`, nhưng contract hiệu lực của frontend/runtime đang dùng `$filter`, `page`, `size`, `sort`.
- Các endpoint `medias` đã có ở backend, nhưng frontend vẫn chưa có action/page tương ứng.
- Frontend đã tích hợp workspace theo mô hình sidebar switcher (switch/create/rename), chưa có route list CRUD riêng và chưa tích hợp delete workspace.
- Các endpoint system prompt đã có ở backend, nhưng frontend vẫn chưa có action file tương ứng.
- `/cronjobs/{id}/stop` đã có ở backend, nhưng frontend chưa có `stopCronjob()` tương ứng.
- `/storefront/users/profile` đã có ở backend, nhưng repo hiện đang đọc người dùng Clerk trực tiếp qua `app/api/user/route.ts`.
