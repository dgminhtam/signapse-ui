# Personal Notes Title Behavior

- Loại tài liệu: Frontend behavior reference
- Phạm vi: Personal Notes editor và summary rail
- Trạng thái: Frontend freeform đã triển khai; cần xác nhận backend title snapshot và OpenAPI required/nullable cho `title`

## Quyết định

Plate document là freeform: frontend không dành path `[0]` cho title và không ép block đầu tiên thành H1.

Khi tạo note, backend suy ra title snapshot từ nội dung text có ý nghĩa đầu tiên mà không phụ thuộc block type hoặc path, rồi trả `title: string | null` trong `PersonalNoteSummaryResponse` và `PersonalNoteResponse`. Các lần update content giữ nguyên title snapshot. Frontend không gửi một field `title` riêng trong create/update request.

## Contract FE mong đợi

```ts
interface PersonalNoteSummaryResponse {
  id: number
  title: string | null
  contentSchemaVersion: number
  createdDate: string
  lastModifiedDate: string
}

interface PersonalNoteResponse extends PersonalNoteSummaryResponse {
  content: Value
}
```

Backend trả `null` khi content tại thời điểm create không có text có ý nghĩa sau khi trim và chuẩn hóa khoảng trắng. Backend không trả chuỗi rỗng và không lưu fallback trình bày như `Untitled`, `New page` hoặc `Ghi chú chưa có tiêu đề`.

## Behavior hiển thị

| Trạng thái | Editor | Summary rail |
| --- | --- | --- |
| Draft chưa lưu | Hiển thị document freeform và body hint khi paragraph rỗng đang active | Hiển thị nhãn draft hiện có |
| `title` có giá trị | Hiển thị document freeform | Hiển thị `title` từ response |
| `title` là `null` | Hiển thị document freeform | Hiển thị fallback đã localize |
| Response legacy trả `""` | Xử lý như không có title | Hiển thị fallback đã localize |

Fallback đề xuất:

- Tiếng Việt: `Ghi chú chưa có tiêu đề`
- Tiếng Anh: `Untitled note`

Body hint trong editor và fallback trong danh sách là presentation state, không phải dữ liệu người dùng. Frontend không gửi, không persist và không dùng các chuỗi này làm giá trị search.

```ts
const displayTitle = note.title?.trim() || personalNotes.untitled
```

Create response thiết lập title snapshot trong summary rail; update response trả lại title đã lưu cùng timestamp mới. Frontend không tự parse Plate content để tạo hoặc thay title trong lúc đang gõ.

## Save behavior

- Thay đổi editor chỉ đánh dấu note là dirty; không tự gửi request sau một khoảng debounce.
- Action row phía trên toolbar hiển thị trạng thái lưu và nút Save; nút chỉ bật khi dirty hoặc lần lưu trước thất bại.
- `Ctrl+S` và `Cmd+S` trong Sheet dùng cùng luồng với nút Save.
- Khi chọn note khác, tạo note mới hoặc đóng Sheet, frontend vẫn flush một lần nếu có thay đổi chưa lưu.
- Nếu safety flush thất bại, thao tác chuyển note, tạo note mới hoặc đóng Sheet bị hủy để người dùng có thể thử Save lại.
- Note read-only hoặc có schema chưa được hỗ trợ không hiển thị action row.

## Editor behavior

- Khởi tạo note mới với một paragraph rỗng tại path `[0]`.
- Không dành path nào cho title, không normalize block đầu thành H1 và không yêu cầu block tại path `[1]`.
- Existing H1 vẫn là content hợp lệ và không bị tự động chuyển đổi; người dùng có thể đổi hoặc chèn block đầu tự do.
- Paragraph root rỗng đang active hiển thị hint đã localize để nhập nội dung hoặc gõ `/` dùng command.
- H2, quote, list và các block type khác không hiển thị body hint này.
- Hint và fallback không được chèn vào Plate value; người dùng vẫn có thể lưu một note không có title.

## Presentation rules

- Title trong summary rail dùng một dòng và truncate hoặc line-clamp.
- Timestamp tiếp tục dùng secondary metadata treatment hiện có.
- Fallback phải là text thật trong accessibility tree, không chỉ là placeholder trực quan.
- Nếu sau này có sort theo title, các note có `title: null` được xếp cuối.

## Ngoài phạm vi hiện tại

- Search theo title.
- Sort theo title.
- Giới hạn độ dài title.
- Chỉnh sửa title trực tiếp từ summary rail.
- Suy title trong frontend hoặc tự thay title khi update content.
- Mutation đổi title thủ công.
