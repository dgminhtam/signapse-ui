## Why

Backend đã có đầy đủ API quản lý `system-prompts`, nhưng frontend hiện chưa có bề mặt quản trị để xem, tạo, chỉnh sửa hoặc xóa prompt hệ thống. Đây là cấu hình nhạy cảm ảnh hưởng trực tiếp tới các workflow AI như lọc tin, phân tích sự kiện, enrich tài sản/chủ đề và tổng hợp truy vấn thị trường, nên cần có UI quản trị rõ ràng, được phân quyền và có guardrail thao tác.

## What Changes

- Thêm feature `/system-prompts` để quản lý danh sách System Prompt theo API backend hiện có.
- Thêm data layer `app/lib/system-prompts/*` và server actions `app/api/system-prompts/action.ts` dùng `fetchAuthenticated()`.
- Thêm trang danh sách có search, sort, page size, phân trang, shared table surface và empty state theo convention repo.
- Thêm form tạo mới prompt với `promptType` và `content`, validate `content` tối đa `10000` ký tự.
- Thêm trang chỉnh sửa `/system-prompts/{promptType}`; `promptType` là định danh route và không chỉnh sửa ở mode edit.
- Thêm delete action có `AlertDialog` cảnh báo vì prompt hệ thống ảnh hưởng workflow AI.
- Thêm navigation item `Prompt hệ thống` trong nhóm `Cài đặt`, gate bằng `system-prompt:read`.
- Cập nhật `docs/APIMAPPING.md` để chuyển `system-prompts` từ chưa triển khai sang đã triển khai sau khi code hoàn tất.
- Không thêm test prompt, preview prompt, version history hoặc audit trail trong v1 vì backend chưa có endpoint tương ứng.

## Capabilities

### New Capabilities

- `system-prompt-management`: Cung cấp bề mặt frontend để đọc danh sách, tạo mới, chỉnh sửa và xóa System Prompt theo `promptType`, với phân quyền và UX an toàn.

### Modified Capabilities

- None.

## Impact

- Thêm route frontend mới trong `app/(main)/system-prompts/*`.
- Thêm data/action layer trong `app/lib/system-prompts/*` và `app/api/system-prompts/action.ts`.
- Cập nhật navigation tại `config/site.ts`.
- Cập nhật tài liệu API mapping tại `docs/APIMAPPING.md`.
- Dùng permission keys đã xác nhận: `system-prompt:read`, `system-prompt:create`, `system-prompt:update`, `system-prompt:delete`.
- Không yêu cầu thay đổi backend API hoặc dependency mới.
