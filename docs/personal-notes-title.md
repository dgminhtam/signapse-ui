# Personal Notes Title Behavior

- Loại tài liệu: Frontend behavior reference
- Phạm vi: Personal Notes editor và summary rail
- Trạng thái: Đã tích hợp nullable title mutation, rename/delete và summary rail chỉ hiển thị title

## Quyết định

Plate document là freeform: frontend không dành path `[0]` cho title và không ép block đầu tiên thành H1.

Title là dữ liệu mutation độc lập với Plate content. Frontend luôn gửi `title: string | null` trong POST/PUT, khởi tạo draft với `null`, và dùng title mới nhất backend trả về cho các lần content save tiếp theo. Rename trim khoảng trắng; input rỗng được gửi thành `null`.

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

interface PersonalNoteMutationRequest {
  title: string | null
  content: Value
  contentSchemaVersion: 1
}
```

Snapshot OpenAPI khai báo mutation `title` là string tối đa 255 ký tự nhưng không biểu diễn nullable/required tường minh. Frontend giữ contract đã xác nhận là field luôn có mặt và nhận `string | null`; fallback như `Untitled note` hoặc `Ghi chú chưa có tiêu đề` chỉ là presentation state.

## Behavior hiển thị

| Trạng thái               | Editor                                                                 | Summary rail                  |
| ------------------------ | ---------------------------------------------------------------------- | ----------------------------- |
| Draft chưa lưu           | Hiển thị document freeform và body hint khi paragraph rỗng đang active | Hiển thị nhãn draft hiện có   |
| `title` có giá trị       | Hiển thị document freeform                                             | Hiển thị `title` từ response  |
| `title` là `null`        | Hiển thị document freeform                                             | Hiển thị fallback đã localize |
| Response legacy trả `""` | Xử lý như không có title                                               | Hiển thị fallback đã localize |

Fallback đề xuất:

- Tiếng Việt: `Ghi chú chưa có tiêu đề`
- Tiếng Anh: `Untitled note`

Body hint trong editor và fallback trong danh sách là presentation state, không phải dữ liệu người dùng. Frontend không gửi, không persist và không dùng các chuỗi này làm giá trị search.

```ts
const displayTitle = note.title?.trim() || personalNotes.untitled
```

Mọi create/update response làm mới title đã lưu trong summary rail. Frontend không tự parse Plate content để tạo hoặc thay title trong lúc đang gõ, và content save không được khôi phục title cũ sau rename.

## Save behavior

- Thay đổi editor chỉ đánh dấu note là dirty; không tự gửi request sau một khoảng debounce.
- Action row phía trên toolbar hiển thị trạng thái lưu và nút Save; nút chỉ bật khi dirty hoặc lần lưu trước thất bại.
- `Ctrl+S` và `Cmd+S` trong Sheet dùng cùng luồng với nút Save.
- Khi chọn note khác, tạo note mới hoặc đóng Sheet, frontend vẫn flush một lần nếu có thay đổi chưa lưu.
- Nếu safety flush thất bại, thao tác chuyển note, tạo note mới hoặc đóng Sheet bị hủy để người dùng có thể thử Save lại.
- Note read-only hoặc có schema chưa được hỗ trợ không hiển thị action row.

## Record actions

- Persisted note có một overflow menu; Rename cần `personal-note:update`, Delete cần `personal-note:delete`.
- Rename dùng full PUT với Plate content hiện tại và title đã trim; lỗi mutation giữ dialog mở.
- Delete yêu cầu xác nhận destructive action. Nếu xóa note đang chọn, frontend tải note kề bên; nếu xóa record cuối, creator nhận draft rỗng còn read-only user nhận empty state.
- Draft chưa có backend id không hiển thị record actions.

## Editor behavior

- Khởi tạo note mới với một paragraph rỗng tại path `[0]`.
- Không dành path nào cho title, không normalize block đầu thành H1 và không yêu cầu block tại path `[1]`.
- Existing H1 vẫn là content hợp lệ và không bị tự động chuyển đổi; người dùng có thể đổi hoặc chèn block đầu tự do.
- Paragraph root rỗng đang active hiển thị hint đã localize để nhập nội dung hoặc gõ `/` dùng command.
- H2, quote, list và các block type khác không hiển thị body hint này.
- Hint và fallback không được chèn vào Plate value; người dùng vẫn có thể lưu một note không có title.

## Presentation rules

- Title trong summary rail dùng một dòng và truncate hoặc line-clamp.
- Summary rail không hiển thị created/last-modified timestamp.
- Fallback phải là text thật trong accessibility tree, không chỉ là placeholder trực quan.
- Nếu sau này có sort theo title, các note có `title: null` được xếp cuối.

## Ngoài phạm vi hiện tại

- Search theo title.
- Sort theo title.
- Suy title trong frontend hoặc tự thay title khi update content.
