# API Mapping Document

Document này map các API endpoints từ Backend (http://localhost:8484/v3/api-docs) sang Frontend actions.

---

## Base Configuration

| Env Variable | Value                   |
| ------------ | ----------------------- |
| API_BASE_URL | `http://localhost:8484` |

---

## 1. System Prompts API

| Method | Backend Endpoint               | Frontend Action                     | Description                    |
| ------ | ------------------------------ | ----------------------------------- | ------------------------------ |
| GET    | `/system-prompts`              | `getPrompts(searchParams)`          | Lấy tất cả prompts (paginated) |
| GET    | `/system-prompts/{promptType}` | `getPromptByType(promptType)`       | Lấy prompt theo loại           |
| POST   | `/system-prompts`              | `createPrompt(request)`             | Tạo prompt mới                 |
| PUT    | `/system-prompts/{promptType}` | `updatePrompt(promptType, request)` | Cập nhật prompt                |
| DELETE | `/system-prompts/{promptType}` | `deletePrompt(promptType)`          | Xóa prompt                     |

**Prompt Types:**

```
NEWS_FILTER, NEWS_ANALYSIS, SIGNAL_GENERATION, DECISION_MAKING,
CONTENT_EXTRACTION, SENTIMENT_ANALYSIS, TITLE_GENERATION, SUMMARY_GENERATION
```

---

## 2. News Sources API

| Method | Backend Endpoint                   | Frontend Action                      | Description                  |
| ------ | ---------------------------------- | ------------------------------------ | ---------------------------- |
| GET    | `/news-sources`                    | `getNewsSources(searchParams)`       | Lấy tất cả nguồn tin         |
| GET    | `/news-sources/active`             | `getActiveNewsSources(searchParams)` | Lấy nguồn tin đang hoạt động |
| GET    | `/news-sources/{id}`               | `getNewsSourceById(id)`              | Lấy nguồn tin theo ID        |
| POST   | `/news-sources`                    | `createNewsSource(request)`          | Tạo nguồn tin mới            |
| PUT    | `/news-sources/{id}`               | `updateNewsSource(id, request)`      | Cập nhật nguồn tin           |
| PATCH  | `/news-sources/{id}/toggle-active` | `toggleNewsSourceActive(id)`         | Bật/tắt trạng thái           |
| DELETE | `/news-sources/{id}`               | `deleteNewsSource(id)`               | Xóa nguồn tin                |

---

## 3. Articles API

| Method | Backend Endpoint | Frontend Action             | Description          |
| ------ | ---------------- | --------------------------- | -------------------- |
| GET    | `/articles`      | `getArticles(searchParams)` | Lấy tất cả bài viết  |
| GET    | `/articles/{id}` | `getArticleById(id)`        | Lấy bài viết theo ID |
| DELETE | `/articles/{id}` | `deleteArticle(id)`         | Xóa bài viết         |

---

## 4. Blogs API

| Method | Backend Endpoint | Frontend Action           | Description              |
| ------ | ---------------- | ------------------------- | ------------------------ |
| GET    | `/blogs`         | `getBlogs(searchParams)`  | Lấy tất cả bài viết blog |
| GET    | `/blogs/{id}`    | `getBlogById(id)`         | Lấy blog theo ID         |
| POST   | `/blogs`         | `createBlog(request)`     | Tạo bài viết blog mới    |
| PUT    | `/blogs/{id}`    | `updateBlog(id, request)` | Cập nhật bài viết blog   |
| DELETE | `/blogs/{id}`    | `deleteBlog(id)`          | Xóa bài viết blog        |

---

## 5. Cronjobs API

| Method | Backend Endpoint        | Frontend Action              | Description         |
| ------ | ----------------------- | ---------------------------- | ------------------- |
| GET    | `/cronjobs`             | `getCronjobs(searchParams)`  | Lấy tất cả cronjobs |
| GET    | `/cronjobs/{id}`        | `getCronjobById(id)`         | Lấy cronjob theo ID |
| POST   | `/cronjobs`             | `createCronjob(request)`     | Tạo cronjob mới     |
| PATCH  | `/cronjobs/{id}`        | `updateCronjob(id, request)` | Cập nhật cronjob    |
| DELETE | `/cronjobs/{id}`        | `deleteCronjob(id)`          | Xóa cronjob         |
| POST   | `/cronjobs/{id}/start`  | `startCronjob(id)`           | Bắt đầu cronjob     |
| POST   | `/cronjobs/{id}/stop`   | `stopCronjob(id)`            | Dừng cronjob        |
| POST   | `/cronjobs/{id}/pause`  | `pauseCronjob(id)`           | Tạm dừng cronjob    |
| POST   | `/cronjobs/{id}/resume` | `resumeCronjob(id)`          | Tiếp tục cronjob    |

---

## 6. Economic Calendar API ⭐ NEW

| Method | Backend Endpoint                          | Frontend Action                           | Description                       |
| ------ | ----------------------------------------- | ----------------------------------------- | --------------------------------- |
| GET    | `/economic-calendar`                      | `getEconomicEvents(searchParams)`         | Lấy tất cả sự kiện kinh tế        |
| GET    | `/economic-calendar/{id}`                 | `getEconomicEventById(id)`                | Lấy sự kiện theo ID               |
| GET    | `/economic-calendar/impact/{impact}`      | `getEconomicEventsByImpact(impact, searchParams)` | Lọc sự kiện theo mức độ tác động |
| GET    | `/economic-calendar/country/{country}`    | `getEconomicEventsByCountry(country, searchParams)` | Lọc sự kiện theo quốc gia       |
| POST   | `/economic-calendar/crawl`                | `crawlEconomicCalendar()`                 | Crawl dữ liệu lịch kinh tế        |
| DELETE | `/economic-calendar/{id}`                 | `deleteEconomicEvent(id)`                 | Xóa sự kiện kinh tế               |

---

## 7. User API

| Method | Backend Endpoint            | Frontend Action    | Description                |
| ------ | --------------------------- | ------------------ | -------------------------- |
| GET    | `/storefront/users/profile` | `getUserProfile()` | Lấy thông tin user profile |

---

## 8. Webhooks

| Method | Backend Endpoint  | Description                |
| ------ | ----------------- | -------------------------- |
| POST   | `/webhooks/clerk` | Xử lý Clerk webhook events |

---

## 9. Health Check

| Method | Backend Endpoint | Frontend Action | Description                  |
| ------ | ---------------- | --------------- | ---------------------------- |
| GET    | `/health`        | `healthCheck()` | Kiểm tra trạng thái hệ thống |

---

## Type Definitions

### Search Parameters

```typescript
interface SearchParams {
  page: number // Page number (0-indexed)
  size: number // Page size
  sort?: string[] // Sort criteria e.g. ["createdDate,desc"]
  filter?: string // Filter expression
}
```

### Paginated Response

```typescript
interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
  empty: boolean
  pageable: {
    pageNumber: number
    pageSize: number
    offset: number
  }
}
```

---

## Request/Response Types

### NewsSource

```typescript
// Request
interface CreateNewsSourceRequest {
  name: string
  description?: string
  url: string
  active?: boolean
}

interface UpdateNewsSourceRequest {
  name?: string
  description?: string
  url?: string
  active?: boolean
}

// Response
interface NewsSourceResponse {
  id: number
  name: string
  description: string
  url: string
  active: boolean
  createdDate: string
  lastModifiedDate: string
}

interface NewsSourceListResponse {
  id: number
  name: string
  description: string
  url: string
  active: boolean
  createdDate: string
  // Note: no lastModifiedDate in list response
}
```

### Article

```typescript
// Response
interface ArticleResponse {
  id: number
  title: string
  description: string
  content?: string
  url: string
  imageUrl?: string
  author?: string
  sourceName: string
  publishedAt: string
  createdDate: string
  lastModifiedDate?: string
}

interface ArticleListResponse {
  id: number
  title: string
  description: string
  url: string
  imageUrl?: string
  sourceName: string
  publishedAt: string
  createdDate: string
}
```

### BlogPost

```typescript
// Request
interface CreateBlogPostRequest {
  title: string
  slug: string
  content?: string
  shortDescription?: string
  visible?: boolean  // ⚠️ field name is "visible" (not "isVisible")
}

interface UpdateBlogPostRequest {
  title?: string
  slug?: string
  content?: string
  shortDescription?: string
  isVisible?: boolean
}

// Response
interface BlogPostResponse {
  id: number
  title: string
  slug: string
  content: string
  shortDescription: string
  visible: boolean  // ⚠️ field name is "visible" (not "isVisible")
  publishedAt: string
  createdDate: string
  lastModifiedDate: string
}

interface BlogPostListResponse {
  id: number
  title: string
  slug: string
  shortDescription: string
  visible: boolean  // ⚠️ field name is "visible" (not "isVisible")
  publishedAt: string
  createdDate: string
}
```

### Cronjob

```typescript
// Request
interface CronjobRequest {
  jobName: string
  jobGroup: string
  jobClass: string
  expression: string // Cron expression
  description?: string
}

// Response
interface CronjobResponse {
  id: number
  jobName: string
  jobGroup: string
  jobStatus: string
  cronExpression: string
  description: string
  expressionDescription: string
  nextTriggeredTime?: string
}
```

### EconomicEvent ⭐ NEW

```typescript
// Response (detail)
interface EconomicEventResponse {
  id: number
  title: string
  country: string
  eventDate: string
  impact: string       // e.g. "HIGH", "MEDIUM", "LOW"
  forecast?: string
  previous?: string
  actual?: string
  externalKey?: string
  description?: string
  createdDate: string
  lastModifiedDate: string
}

// Response (list)
interface EconomicEventListResponse {
  id: number
  title: string
  country: string
  eventDate: string
  impact: string
  forecast?: string
  previous?: string
  actual?: string
  description?: string
  createdDate: string
}
```

### SystemPrompt

```typescript
// Request
interface CreateSystemPromptRequest {
  promptType: PromptType
  content: string
}

interface UpdateSystemPromptRequest {
  content: string
}

// Response
interface SystemPromptResponse {
  id: number
  promptType: PromptType
  content: string
  createdDate: string
  lastModifiedDate: string
}
```

### User

```typescript
interface UserResponse {
  id: number
  email: string
  firstName: string
  lastName: string
}
```

---

## Authentication

- Sử dụng Clerk JWT token
- Token được lấy qua `getClerkToken()` từ `@/app/api/auth/action`
- Header: `Authorization: Bearer {token}`

---

## File Structure Convention

```
app/
├── api/
│   ├── auth/
│   │   └── action.ts          # Auth utilities (fetchAuthenticated, getClerkToken)
│   ├── news-sources/
│   │   └── action.ts          # News Sources API
│   ├── articles/
│   │   └── action.ts           # Articles API
│   ├── blogs/
│   │   └── action.ts           # Blogs API
│   ├── cronjobs/
│   │   └── action.ts           # Cronjobs API
│   ├── prompts/
│   │   └── action.ts           # System Prompts API
│   └── economic-calendar/
│       └── action.ts           # Economic Calendar API ⭐ NEW
│
└── lib/
    ├── definitions.ts          # Base types (SearchParams, Page, etc.)
    ├── news-sources/
    │   └── definitions.ts      # News Source types
    ├── articles/
    │   └── definitions.ts      # Article types
    ├── blogs/
    │   └── definitions.ts      # Blog types
    ├── cronjobs/
    │   └── definitions.ts      # Cronjob types
    ├── prompts/
    │   └── definitions.ts      # Prompt types
    └── economic-calendar/
        └── definitions.ts      # Economic Event types ⭐ NEW
```
