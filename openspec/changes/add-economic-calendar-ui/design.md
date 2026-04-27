## Context

`docs/api_mapping.json` hiện có 3 endpoint cho `economic-calendar`: danh sách phân trang, chi tiết theo `id`, và đồng bộ dữ liệu. Frontend đang có thư mục rỗng cho `app/(main)/economic-calendar`, `app/api/economic-calendar`, và `app/lib/economic-calendar`, nhưng chưa có action, definitions, permission, navigation hoặc UI.

Feature này cần bám convention hiện tại của repo: route trong `app/(main)`, server actions qua `fetchAuthenticated()`, list state nằm trên URL, table dùng shared list surface, UI text tiếng Việt, và mutation có `ActionResult`, spinner, toast, refresh.

## Goals / Non-Goals

**Goals:**

- Cung cấp trang danh sách lịch kinh tế có search, sort, page size và phân trang.
- Cung cấp trang chi tiết để operator đọc nội dung sự kiện kinh tế và metadata kỹ thuật.
- Cho phép người dùng có quyền đồng bộ dữ liệu lịch kinh tế từ backend.
- Đồng bộ navigation và `docs/APIMAPPING.md` sau khi feature được triển khai.
- Giữ UI tiếng Việt chuyên nghiệp, rõ ràng và thống nhất với các feature list/detail hiện có.

**Non-Goals:**

- Không thêm create, update, delete vì backend snapshot không có endpoint tương ứng.
- Không thêm calendar grid/month view ở v1; list table phù hợp hơn với workflow audit dữ liệu.
- Không tự suy diễn market impact trong UI; feature chỉ hiển thị dữ liệu backend trả về.
- Không thay đổi backend API hoặc permission catalog.

## Decisions

### Data Layer

Tạo `app/lib/economic-calendar/definitions.ts` với các type bám schema OpenAPI:

- `EconomicCalendarListResponse`
- `EconomicCalendarResponse`
- `EconomicCalendarSyncResponse`

Tạo `app/api/economic-calendar/action.ts` với:

- `getEconomicCalendarEntries(searchParams)`
- `getEconomicCalendarEntryById(id)`
- `syncEconomicCalendarEntries()`

Mutation sync trả về `ActionResult<EconomicCalendarSyncResponse>`, gọi `revalidatePath("/economic-calendar")`, và dùng fallback error tiếng Việt.

### Permissions

Tạo `app/lib/economic-calendar/permissions.ts`:

- `ECONOMIC_CALENDAR_READ_PERMISSIONS = ["economic-calendar:read"]`
- `ECONOMIC_CALENDAR_SYNC_PERMISSIONS = ["economic-calendar:sync"]`
- `ECONOMIC_CALENDAR_NAV_PERMISSIONS = ECONOMIC_CALENDAR_READ_PERMISSIONS`

Nếu backend permission catalog dùng key khác, lỗi sẽ bộc lộ ở bước tích hợp quyền. V1 không tự thêm legacy fallback vì chưa có bằng chứng repo đang dùng key cũ nào cho domain này.

### List UX

Route `/economic-calendar` dùng Card shell chuẩn. Toolbar:

- Bên trái: nút `Đồng bộ lịch kinh tế` và search.
- Bên phải: sort và page size.

Search v1 dùng `title[containsIgnoreCase],description[containsIgnoreCase],countryCode[containsIgnoreCase]` để hỗ trợ tìm nhanh theo nội dung và quốc gia. Sort v1:

- `scheduledAt_desc`: Sắp diễn ra / mới nhất theo thời gian công bố.
- `scheduledAt_asc`: Cũ nhất.
- `importance_desc`: Mức độ quan trọng cao.
- `createdDate_desc`: Ngày tạo mới nhất.

Table columns:

- Sự kiện
- Quốc gia / Nhà cung cấp
- Mức độ quan trọng
- Thời gian công bố
- Actual / Forecast / Previous
- Thao tác

### Detail UX

Route `/economic-calendar/{id}` là read-only detail page. Primary reading path:

1. Tiêu đề, quốc gia, provider, importance, scheduled time.
2. Giá trị `actualValue`, `forecastValue`, `previousValue`.
3. Mô tả và `rawContent`.
4. Link nguồn gốc nếu có.
5. Thông tin kỹ thuật ở section phụ: `id`, `externalKey`, `url`, `ingestedAt`, `createdDate`, `lastModifiedDate`, `rawMetadata`.

### Sync UX

Nút sync chỉ hiển thị khi người dùng có quyền sync. Khi chạy:

- Disable control và hiển thị `Spinner`.
- Gọi `syncEconomicCalendarEntries()`.
- Toast success tóm tắt `fetchedCount`, `createdCount`, `updatedCount`, `skippedCount`, `syncedAt`.
- `router.refresh()` để cập nhật list.

## Risks / Trade-offs

- [Risk] Permission key backend khác với dự đoán `economic-calendar:*` → Mitigation: cô lập trong `permissions.ts`, dễ đổi một chỗ khi backend catalog xác nhận.
- [Risk] Sort theo `importance_desc` có thể không phản ánh thứ tự nghiệp vụ nếu backend lưu `importance` là string không ordinal → Mitigation: vẫn giữ sort này như best-effort; có thể thay bằng filter/static order trong change sau nếu backend cung cấp enum/rank.
- [Risk] `rawMetadata` hoặc `rawContent` quá dài → Mitigation: đặt trong detail, không đưa vào list; dùng section kỹ thuật/secondary để tránh làm rối màn hình chính.
- [Risk] Endpoint sync có thể chạy lâu → Mitigation: dùng pending state, toast sau khi hoàn tất, không optimistic update.

## Open Questions

- Backend permission catalog chính thức có đúng `economic-calendar:read` và `economic-calendar:sync` không?
- `importance` có enum ổn định không, hay chỉ là string provider-specific?
