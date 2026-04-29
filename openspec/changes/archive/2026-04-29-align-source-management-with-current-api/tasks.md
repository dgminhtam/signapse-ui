## 1. Đồng bộ data contract `sources`

- [x] 1.1 Thu gọn `SourceRequest` trong `app/lib/sources/definitions.ts` về đúng các field còn tồn tại trong spec backend hiện tại.
- [x] 1.2 Bổ sung `systemManaged?: boolean` vào `SourceResponse` và `SourceListResponse`, đồng thời rà lại các helper hoặc label liên quan nếu cần.
- [x] 1.3 Kiểm tra `app/api/sources/action.ts` để bảo đảm create/update/toggle/delete flow không còn phụ thuộc vào các field nâng cao đã bị loại bỏ.

## 2. Cập nhật form và bề mặt quản lý nguồn

- [x] 2.1 Refactor `app/(main)/sources/source-form.tsx` để bỏ schema, default values, input render, và payload mapping của các field provider/crawl/configuration.
- [x] 2.2 Bổ sung hiển thị trạng thái `systemManaged` trên list và detail, ưu tiên bằng badge hoặc mô tả ngắn dễ nhận biết.
- [x] 2.3 Dùng `systemManaged` để khóa affordance chỉnh sửa, xóa, và bật/tắt trạng thái ở `source-list.tsx`.
- [x] 2.4 Điều chỉnh màn hình `/sources/[id]` và `SourceForm` để nguồn hệ thống vẫn xem được metadata nhưng không thể submit chỉnh sửa thủ công.

## 3. Tài liệu và kiểm chứng

- [x] 3.1 Cập nhật `docs/APIMAPPING.md` để phản ánh chính xác contract `sources` hiện tại và ý nghĩa của `systemManaged`.
- [x] 3.2 Tự kiểm tra các luồng create, edit, list, toggle, và delete với cả nguồn thường lẫn nguồn hệ thống bằng cách rà code và smoke test cục bộ nếu khả dụng.
- [x] 3.3 Chạy `pnpm lint` và `pnpm typecheck` cho phạm vi thay đổi hoặc toàn repo theo điều kiện môi trường hiện có.
