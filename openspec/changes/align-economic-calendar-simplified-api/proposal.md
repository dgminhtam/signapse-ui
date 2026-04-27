## Why

Backend đã cập nhật API lịch kinh tế để giản lược các field nguồn/thô không còn cần thiết, trong khi frontend hiện vẫn render, search và sort theo contract cũ. Cần align lại data layer, UI và tài liệu để tránh hiển thị dữ liệu trống, gọi filter sai field, hoặc tạo nhiễu cho người dùng khi xem lịch kinh tế.

## What Changes

- **BREAKING** Cập nhật frontend economic calendar từ schema cũ sang schema mới: bỏ phụ thuộc vào `description`, `url`, `externalKey`, `provider`, `countryCode`, `importance`, `ingestedAt`, `rawContent`, và `rawMetadata`.
- Thêm mapping type/UI cho các field mới: `currencyCode`, `impact`, `content`, `contentAvailable`, `status`, `syncedAt`, và `lastModifiedDate`.
- Tinh gọn bảng danh sách để tập trung vào sự kiện, tiền tệ, tác động, trạng thái nội dung, thời gian công bố, thời điểm đồng bộ và các giá trị actual/forecast/previous.
- Tinh gọn trang chi tiết để bỏ các khối nguồn gốc/raw metadata cũ; chỉ hiển thị nội dung `content` khi backend báo có dữ liệu.
- Cập nhật search/sort để không còn dùng các field đã bị backend loại bỏ.
- Chuẩn hóa lại copy tiếng Việt bị mojibake trong toàn bộ feature lịch kinh tế.
- Cập nhật `docs/APIMAPPING.md` để phản ánh contract lịch kinh tế mới.

## Capabilities

### New Capabilities

- `economic-calendar-management`: Cập nhật yêu cầu quản trị lịch kinh tế để bám contract backend đã giản lược và giữ UI list/detail rõ ràng, ít nhiễu.

### Modified Capabilities

- None.

## Impact

- `app/lib/economic-calendar/definitions.ts`
- `app/api/economic-calendar/action.ts`
- `app/(main)/economic-calendar/page.tsx`
- `app/(main)/economic-calendar/economic-calendar-list.tsx`
- `app/(main)/economic-calendar/economic-calendar-search.tsx`
- `app/(main)/economic-calendar/[id]/page.tsx`
- `app/(main)/economic-calendar/error.tsx`
- `docs/APIMAPPING.md`
- Không yêu cầu thay đổi backend API hoặc thêm endpoint mới.
