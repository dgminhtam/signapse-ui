# Personal Notes Title Behavior

- Loại tài liệu: Frontend behavior reference
- Phạm vi: Personal Notes editor và summary rail
- Trạng thái: Đã chốt thiết kế, chờ backend cập nhật contract

## Quyết định

Block root đầu tiên của Plate document luôn là `h1` và là nguồn nội dung gốc của tiêu đề ghi chú.

Backend trích xuất plain text từ block này và trả `title: string | null` trong `PersonalNoteSummaryResponse` và `PersonalNoteResponse`. Frontend không gửi một field `title` riêng trong create/update request.

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

Backend trả `null` khi H1 đầu tiên không chứa text sau khi trim và chuẩn hóa khoảng trắng. Backend không trả chuỗi rỗng và không lưu fallback trình bày như `Untitled`, `New page` hoặc `Ghi chú chưa có tiêu đề`.

## Behavior hiển thị

| Trạng thái | Editor | Summary rail |
| --- | --- | --- |
| Draft chưa lưu | Hiển thị placeholder tiêu đề | Hiển thị nhãn draft hiện có |
| `title` có giá trị | Hiển thị nội dung H1 | Hiển thị `title` từ response |
| `title` là `null` | Hiển thị placeholder khi H1 rỗng | Hiển thị fallback đã localize |
| Response legacy trả `""` | Xử lý như không có title | Hiển thị fallback đã localize |

Fallback đề xuất:

- Tiếng Việt: `Ghi chú chưa có tiêu đề`
- Tiếng Anh: `Untitled note`

Placeholder trong editor và fallback trong danh sách là presentation state, không phải dữ liệu người dùng. Frontend không gửi, không persist và không dùng các chuỗi này làm giá trị search.

```ts
const displayTitle = note.title?.trim() || personalNotes.untitled
```

Summary rail cập nhật title từ response create/update sau khi autosave thành công. Bản đầu tiên chưa cần tự parse Plate content để cập nhật title lạc quan trong lúc đang gõ.

## Editor behavior

- Khởi tạo note mới với một H1 rỗng và một paragraph rỗng.
- Dùng `NormalizeTypesPlugin` để giữ path `[0]` là H1.
- Placeholder tiêu đề chỉ áp dụng cho H1 tại path `[0]`.
- Nhấn Enter trong title phải chuyển block mới sang paragraph.
- Fallback không được chèn vào H1; người dùng vẫn có thể lưu một note không có tiêu đề.

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
- Tự sinh title từ body khi H1 rỗng.
