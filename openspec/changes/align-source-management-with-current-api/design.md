## Context

Feature `sources` của frontend hiện đã được mở rộng theo một ảnh chụp API cũ hơn thực tế. Cụ thể:
- `app/lib/sources/definitions.ts` vẫn khai báo nhiều field nâng cao không còn xuất hiện trong `CreateSourceRequest` và `UpdateSourceRequest` của `docs/api_mapping.json`.
- `app/(main)/sources/source-form.tsx` vẫn render một khối cấu hình provider/crawl riêng và submit các field không còn thuộc contract hiện tại.
- `SourceResponse` và `SourceListResponse` ở frontend chưa nhận `systemManaged`, nên UI không có cơ sở để phân biệt nguồn do hệ thống quản lý với nguồn do người dùng quản lý.
- List và detail đang cho phép thao tác chỉnh sửa, xóa, và bật/tắt trạng thái theo permission chung, chưa xét tới rule nghiệp vụ mới từ backend.

Đây là thay đổi cắt ngang data layer, form UI, action row, detail route, và tài liệu mapping nội bộ, nhưng không yêu cầu thay đổi backend.

## Goals / Non-Goals

**Goals:**
- Đồng bộ type và payload `sources` ở frontend với spec backend hiện tại.
- Loại bỏ các input nâng cao đã không còn được backend hỗ trợ trong create/update flow.
- Hiển thị rõ trạng thái `systemManaged` ở các bề mặt quản lý nguồn.
- Dùng `systemManaged` để chặn các thao tác chỉnh sửa, xóa, và bật/tắt khi record thuộc nhóm nguồn do hệ thống quản lý.
- Giữ nguyên các endpoint hiện có và chuẩn hóa lại tài liệu mapping nội bộ.

**Non-Goals:**
- Thay đổi backend API, permission key, hoặc bổ sung endpoint riêng cho nguồn hệ thống.
- Thiết kế lại toàn bộ UX của feature `sources`.
- Bổ sung lại các trường provider/crawl nâng cao dưới dạng section ẩn hay JSON editor khác.
- Suy diễn thêm logic nghiệp vụ ngoài tín hiệu đã được backend trả về qua `systemManaged`.

## Decisions

### 1. Thu gọn contract `SourceRequest` tại một điểm dùng chung
`SourceRequest` sẽ chỉ còn các field đang tồn tại trong spec hiện tại: `name`, `type`, `description`, `url`, `rssUrl`, và `active`. `createSource()` và `updateSource()` tiếp tục dùng cùng một kiểu request để tránh drift giữa create và edit flow.

Why:
- Cả form tạo mới và chỉnh sửa đều đang submit qua cùng một data contract.
- Giữ một request type duy nhất giúp việc map payload, validate, và refactor các mutation ổn định hơn.

Alternatives considered:
- Tách riêng `CreateSourceRequest` và `UpdateSourceRequest` ở frontend.
- Rejected vì sự khác biệt hiện tại của backend chủ yếu nằm ở optionality chứ không phải tập field, nên tách type lúc này làm tăng chi phí bảo trì mà chưa mang lại lợi ích rõ rệt.

### 2. Bỏ hoàn toàn section input nâng cao khỏi `source-form.tsx`
Form sẽ chỉ còn nhóm thông tin cơ bản và trạng thái kích hoạt. Các field provider/crawl/configuration bị loại khỏi schema validation, default values, render tree, và payload builder.

Why:
- Giữ lại các input này sẽ khiến người dùng nghĩ rằng hệ thống vẫn hỗ trợ cấu hình nâng cao từ màn hình này.
- Việc ẩn tạm thay vì bỏ hẳn vẫn để lại logic validate và mapping sai ở tầng submit.

Alternatives considered:
- Giữ section nâng cao ở trạng thái collapsed hoặc read-only.
- Rejected vì vẫn duy trì contract sai trong code và không giải quyết được nguy cơ gửi field thừa lên backend.

### 3. `systemManaged` được xem là tín hiệu UI chuẩn để khóa thao tác mutation
`SourceResponse` và `SourceListResponse` sẽ bổ sung `systemManaged?: boolean`. Khi giá trị này là `true`, UI sẽ:
- hiển thị badge nhận diện nguồn hệ thống ở list và detail;
- vô hiệu hóa action edit, delete, và toggle active;
- giữ nguyên xử lý lỗi backend bằng toast nếu người dùng vẫn chạm được vào mutation qua đường khác hoặc backend có rule chặt hơn UI.

Why:
- `systemManaged` là tín hiệu rõ ràng duy nhất mà backend hiện trả về để phân biệt loại nguồn.
- Guard ở UI giảm thao tác thất bại, đồng thời không thay thế nguồn chân lý từ backend.

Alternatives considered:
- Chỉ hiển thị badge mà không khóa thao tác.
- Rejected vì không đáp ứng mục tiêu giảm mismatch giữa rule backend và affordance trên UI.

### 4. Màn hình detail sẽ chuyển sang chế độ read-only mềm khi nguồn là `systemManaged`
Route `/sources/[id]` vẫn tồn tại để người dùng xem metadata ingest hiện có, nhưng form field và nút lưu/hủy sẽ bị disable khi `initialData.systemManaged === true`. Một mô tả ngắn sẽ giải thích rằng nguồn này do hệ thống quản lý.

Why:
- Hiện tại detail page của `sources` chính là edit page, nên việc bỏ quyền truy cập hoàn toàn sẽ làm mất khả năng xem metadata.
- Cách này giúp giữ layout nhất quán, đồng thời phản ánh đúng việc nguồn không nên được chỉnh sửa thủ công.

Alternatives considered:
- Redirect nguồn hệ thống sang một trang detail chỉ đọc riêng.
- Rejected vì vượt quá phạm vi change và tạo thêm route/component không cần thiết cho phiên bản hiện tại.

### 5. Tài liệu mapping sẽ được cập nhật song song với refactor code
`docs/APIMAPPING.md` sẽ được sửa để phản ánh bộ field `sources` mới và vai trò của `systemManaged`, nhằm tránh lặp lại drift giữa proposal, implementation, và tài liệu nội bộ.

Why:
- `docs/api_mapping.json` đã thay đổi và người dùng đang dùng `APIMAPPING.md` như tài liệu tham chiếu nhanh.
- Không cập nhật tài liệu sẽ làm change mới thiếu tính khép kín.

Alternatives considered:
- Chỉ sửa code, để tài liệu cập nhật ở change khác.
- Rejected vì phần drift hiện tại bắt nguồn trực tiếp từ việc contract được mô tả khác nhau giữa code và tài liệu.

## Risks / Trade-offs

- [Backend chỉ dùng `systemManaged` cho một phần mutation thay vì tất cả] -> UI guard sẽ được triển khai tập trung theo flag này, nhưng xử lý lỗi backend vẫn được giữ nguyên để không che khuất rule thực tế.
- [Một số nguồn cũ không trả về `systemManaged`] -> FE sẽ coi giá trị thiếu là không khóa thao tác, giúp tương thích ngược với payload chưa đầy đủ.
- [Người dùng mất khả năng chỉnh các field nâng cao từng thấy trước đây] -> Proposal ghi rõ đây là thay đổi chủ ý để đồng bộ với contract hiện tại, thay vì hồi quy ngẫu nhiên.
- [Detail page vừa xem vừa sửa nay bị disable theo record] -> Thêm badge và mô tả ngắn để người dùng hiểu đây là giới hạn nghiệp vụ, không phải lỗi UI.

## Migration Plan

1. Cập nhật `app/lib/sources/definitions.ts` để thu gọn request type và bổ sung `systemManaged`.
2. Refactor `app/(main)/sources/source-form.tsx` để bỏ schema/input nâng cao và hỗ trợ trạng thái read-only mềm cho nguồn hệ thống.
3. Cập nhật list/detail actions để badge hóa và khóa thao tác edit/delete/toggle theo `systemManaged`.
4. Rà lại `app/api/sources/action.ts` để bảo đảm các mutation không còn phụ thuộc vào field cũ và vẫn giữ error handling hiện tại.
5. Cập nhật `docs/APIMAPPING.md`, sau đó chạy lint/typecheck cho phạm vi đã chạm.

Rollback:
- Không có migration dữ liệu; rollback chỉ cần khôi phục frontend typing/UI nếu backend contract thay đổi lại.

## Open Questions

- Backend có mong muốn khóa cả route chỉnh sửa trên server khi `systemManaged = true`, hay chỉ cần khóa affordance phía client ở giai đoạn này?
- Badge hiển thị cho nguồn hệ thống sẽ dùng copy tiếng Việt hoàn toàn hay giữ nguyên token kỹ thuật `system-managed` để bám sát field API?
