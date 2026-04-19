## Why

Frontend `sources` hiện đang bám theo một contract backend cũ hơn thực tế: `SourceRequest` vẫn gửi các field nâng cao như `providerKey`, `providerName`, `articleCrawlWaitForMs`, `defaultFetchLimit`, và `configuration`, trong khi spec hiện tại chỉ còn bộ field cơ bản. Đồng thời backend đã bổ sung cờ `systemManaged`, nhưng UI chưa khai báo và chưa phản ánh được trạng thái này trong danh sách hoặc màn hình chỉnh sửa.

Change này cần thực hiện ngay để tránh FE tiếp tục submit payload lệch spec, hiển thị form gây hiểu nhầm cho người dùng, và bỏ lỡ rule tương tác dành cho nguồn do hệ thống quản lý.

## What Changes

- Thu gọn `SourceRequest` ở frontend về đúng schema backend hiện tại: `name`, `type`, `description`, `url`, `rssUrl`, `active`.
- Bỏ toàn bộ input nâng cao không còn trong spec hiện tại khỏi `source-form.tsx`.
- Mở rộng `SourceResponse` và `SourceListResponse` để nhận `systemManaged?: boolean`.
- Hiển thị trạng thái `systemManaged` rõ ràng trên các bề mặt quản lý nguồn, bao gồm badge ở list/detail khi có giá trị.
- Điều chỉnh UX chỉnh sửa, xóa, và bật/tắt trạng thái nguồn để có thể khóa thao tác khi bản ghi là nguồn do hệ thống quản lý hoặc khi backend từ chối thao tác tương ứng.
- Cập nhật tài liệu mapping nội bộ để phản ánh contract `sources` mới nhất từ `docs/api_mapping.json`.
- **BREAKING** Loại bỏ giả định trước đó rằng frontend `sources` phải hỗ trợ bộ field crawl/provider nâng cao trong form tạo và chỉnh sửa.

## Capabilities

### New Capabilities
- `source-management-api-alignment`: Đồng bộ typing, form, hiển thị metadata, và guard tương tác của feature `sources` với contract backend hiện tại.

### Modified Capabilities
- None.

## Impact

- Ảnh hưởng tới frontend `sources` tại `app/lib/sources`, `app/api/sources`, và `app/(main)/sources`.
- Ảnh hưởng tới UX thao tác trên nguồn dữ liệu, đặc biệt là create/edit form, action toggle active, và delete flow.
- Ảnh hưởng tới tài liệu `docs/APIMAPPING.md` và mọi ghi chú nội bộ đang mô tả `Source` theo contract cũ.
- Thu hẹp một phần giả định đã nêu trong change `refactor-article-to-source-document`, cụ thể ở phạm vi source configuration.
