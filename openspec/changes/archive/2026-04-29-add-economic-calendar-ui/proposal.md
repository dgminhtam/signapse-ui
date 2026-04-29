## Why

Backend snapshot hiện đã có API `economic-calendar`, nhưng frontend chưa có bề mặt quản trị để xem, kiểm tra hoặc đồng bộ dữ liệu lịch kinh tế. Đây là mảnh dữ liệu quan trọng cho hệ thống tín hiệu giao dịch vì các sự kiện kinh tế có thể trở thành evidence trong market query và event context.

## What Changes

- Thêm feature UI `/economic-calendar` cho danh sách lịch kinh tế với Card shell, search, sort, phân trang và empty state theo convention repo.
- Thêm trang chi tiết `/economic-calendar/{id}` để xem thông tin sự kiện kinh tế, giá trị `actual/forecast/previous`, nội dung raw và metadata kỹ thuật.
- Thêm action đồng bộ dữ liệu từ endpoint `POST /economic-calendar/sync`, có pending state, toast summary và refresh lại danh sách.
- Thêm data layer Codex-native cho `economic-calendar`: definitions, permissions và server actions dùng `fetchAuthenticated()`.
- Thêm navigation item tiếng Việt `Lịch kinh tế` vào menu trái dưới nhóm `Nội dung`.
- Cập nhật `docs/APIMAPPING.md` từ trạng thái chưa triển khai sang đã triển khai sau khi hoàn tất.
- Không thêm create/update/delete vì snapshot API hiện tại chỉ hỗ trợ read và sync.

## Capabilities

### New Capabilities

- `economic-calendar-management`: Cung cấp bề mặt frontend để đọc danh sách, xem chi tiết và đồng bộ dữ liệu lịch kinh tế từ backend API.

### Modified Capabilities

- None.

## Impact

- Thêm module frontend mới trong `app/(main)/economic-calendar/*`.
- Thêm data layer trong `app/api/economic-calendar/action.ts` và `app/lib/economic-calendar/*`.
- Cập nhật navigation tại `config/site.ts`.
- Cập nhật tài liệu mapping tại `docs/APIMAPPING.md`.
- Dùng lại shared list conventions hiện có: `AppListToolbar`, `AppListTable`, `AppPaginationControls`, `SortSelect`, `AppSelectPageSize`, `Empty`, `Skeleton`, `sonner`.
- Không yêu cầu thay đổi backend API.
