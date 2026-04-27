## Context

`docs/api_mapping.json` hiện vẫn expose 3 endpoint lịch kinh tế: list, detail và sync. Thay đổi mới nằm ở schema response: backend đã bỏ các field nguồn/thô và metadata provider cũ để giảm nhiễu, đồng thời đưa vào các field vận hành gọn hơn như `currencyCode`, `impact`, `contentAvailable`, `status`, `syncedAt` và `content`.

Frontend economic calendar hiện được triển khai theo contract cũ từ change `add-economic-calendar-ui`. Vì vậy list/detail đang render nhiều field không còn tồn tại, search còn filter theo `description` và `countryCode`, sort còn dùng `importance_desc`, và copy tiếng Việt trong feature đang có dấu hiệu mojibake.

## Goals / Non-Goals

**Goals:**

- Align toàn bộ data layer và UI lịch kinh tế với schema mới trong `docs/api_mapping.json`.
- Giữ nguyên route `/economic-calendar`, `/economic-calendar/{id}` và action sync hiện có.
- Tinh gọn UI để người dùng thấy thông tin có giá trị nhất: sự kiện, tiền tệ, tác động, trạng thái, thời gian, nội dung và các giá trị actual/forecast/previous.
- Loại bỏ phụ thuộc frontend vào các field đã bị backend bỏ.
- Chuẩn hóa lại tiếng Việt có dấu cho các màn hình lịch kinh tế.
- Cập nhật `docs/APIMAPPING.md` để phản ánh field mới và drift đã được xử lý.

**Non-Goals:**

- Không thêm endpoint, permission hoặc workflow mới.
- Không làm calendar grid/month view.
- Không suy diễn tác động thị trường ngoài field `impact` backend trả về.
- Không thay đổi các feature khác ngoài phạm vi economic calendar và tài liệu mapping liên quan.

## Decisions

### Contract-first type update

Cập nhật `app/lib/economic-calendar/definitions.ts` theo schema mới trước khi chỉnh UI. Type mới nên loại bỏ field cũ thay vì giữ optional compatibility, để TypeScript giúp phát hiện mọi điểm UI còn đọc contract sai.

Alternatives considered:

- Giữ field cũ optional để tránh sửa nhiều UI: không chọn vì sẽ che drift contract và tiếp tục tạo UI trống/khó hiểu.
- Tạo adapter map field cũ sang field mới: không chọn vì field cũ không còn dữ liệu tương đương trực tiếp.

### List UI uses only stable simplified fields

List nên hiển thị các cột:

- Sự kiện
- Tiền tệ
- Tác động
- Trạng thái
- Thời gian
- Giá trị
- Thao tác

`impact` thay thế vai trò `importance`, nhưng UI không nên giả định enum cố định trừ khi backend contract có enum. Badge label nên dùng giá trị backend trả về, chỉ chuẩn hóa fallback tiếng Việt khi trống. `status` có enum `PENDING | AVAILABLE`, nên có thể map sang `Đang chờ` và `Có dữ liệu`.

Alternatives considered:

- Giữ cột quốc gia/nhà cung cấp: không chọn vì `countryCode` và `provider` đã bị loại khỏi schema.
- Ẩn `status` khỏi list: không chọn vì `contentAvailable/status` là tín hiệu mới quan trọng để operator biết mục nào có nội dung chi tiết.

### Search and sort avoid removed fields

Search v1 nên chuyển sang field còn tồn tại, mặc định là `title[containsIgnoreCase]`. Có thể thêm `currencyCode[containsIgnoreCase]` nếu backend runtime filter hỗ trợ multi-field với field này. Không dùng `description` hoặc `countryCode`.

Sort nên giữ các lựa chọn có field ổn định:

- `scheduledAt_desc`
- `scheduledAt_asc`
- `syncedAt_desc`
- `createdDate_desc`

Không dùng `importance_desc` vì `importance` đã bị bỏ. Nếu muốn sort theo `impact`, chỉ thêm khi backend xác nhận `impact` có thứ tự nghiệp vụ ổn định.

### Detail UI becomes content-centered

Detail page nên bỏ link nguồn gốc, external key, raw metadata và raw content cũ. Primary layout nên gồm:

- Header: title, `currencyCode`, `impact`, `status`, `scheduledAt`
- Metric cards: actual, forecast, previous, syncedAt
- Content section: render `content` khi `contentAvailable` true và `content` có text; nếu chưa có, hiển thị empty/info state nhẹ
- Technical section tối thiểu: `id`, `createdDate`, `lastModifiedDate`

Điều này giữ trang chi tiết đúng mục tiêu giản lược của backend và tránh đẩy thông tin kỹ thuật không còn hữu ích lên UI.

### Documentation follows backend snapshot, not old UI assumptions

`docs/APIMAPPING.md` cần cập nhật phần economic calendar để liệt kê field mới, bỏ field cũ và giữ trạng thái frontend là đã triển khai sau khi code align xong.

## Risks / Trade-offs

- [Risk] Backend filter runtime có thể không hỗ trợ `currencyCode[containsIgnoreCase]` dù schema có field này. → Mitigation: dùng `title[containsIgnoreCase]` là mặc định an toàn; chỉ thêm `currencyCode` nếu đã test hoặc pattern backend xác nhận.
- [Risk] `impact` là string tự do nên sort/badge màu có thể không ổn định. → Mitigation: hiển thị như text/badge trung tính; không hard-code thứ tự sort theo impact trong v1.
- [Risk] Bỏ field cũ khỏi type sẽ tạo nhiều lỗi compile trong UI. → Mitigation: đây là tín hiệu mong muốn để sửa hết điểm lệch contract trong cùng change.
- [Risk] Có thể còn mojibake ở file economic calendar không liên quan trực tiếp contract. → Mitigation: chuẩn hóa toàn bộ copy trong feature cùng lúc vì đang chạm đúng các file đó.

## Migration Plan

1. Cập nhật definitions theo schema mới.
2. Sửa list/search/sort để không dùng field đã bị bỏ.
3. Sửa detail page theo layout content-centered.
4. Cập nhật `docs/APIMAPPING.md`.
5. Chạy targeted lint/typecheck; nếu typecheck vẫn fail vì graph-view dependency cũ, tách rõ là lỗi ngoài scope.

Rollback đơn giản bằng cách revert change frontend/docs nếu backend quay lại contract cũ, vì không có migration dữ liệu phía frontend.

## Open Questions

- Backend runtime có hỗ trợ filter multi-field với `currencyCode[containsIgnoreCase]` không, hay search nên chỉ giữ `title[containsIgnoreCase]`?
- `impact` có tập giá trị ổn định nào không, hay cần render thuần theo string backend trả về?
