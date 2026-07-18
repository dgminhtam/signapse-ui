## 1. Chuyển media editor sang chỉ dùng liên kết

- [x] 1.1 Đơn giản hóa `MediaToolbarButton` để thao tác ảnh, video, âm thanh và tệp mở thẳng hộp thoại nhập URL; xóa file picker/split menu dành cho media và đưa các nhãn, lỗi, hành động bị chạm tới vào dictionary i18n.
- [x] 1.2 Cấu hình các plugin ảnh, video, âm thanh và tệp với `disableUploadInsert: true`; loại bỏ `PlaceholderPlugin`/`BasePlaceholderPlugin` nhưng giữ nguyên chèn, hiển thị và chỉnh sửa media bằng URL.
- [x] 1.3 Bỏ xử lý thả tệp khỏi `DndKit` nhưng giữ kéo-thả sắp xếp block; xóa các placeholder transform không còn dùng cho âm thanh, tệp và video trong khi giữ transform ảnh và rich embed dựa trên URL.

## 2. Xóa hạ tầng upload không còn cần thiết

- [x] 2.1 Xóa component placeholder/progress upload media và hook upload phía client.
- [x] 2.2 Xóa route `/api/uploadthing` cùng cấu hình UploadThing, không giữ endpoint tương thích.
- [x] 2.3 Gỡ `@uploadthing/react` và `uploadthing`, cập nhật `pnpm-lock.yaml`, đồng thời giữ `use-file-picker` cho chức năng import tài liệu.

## 3. Kiểm tra hoàn tất

- [x] 3.1 Chạy static search để xác nhận không còn tham chiếu UploadThing, hook upload editor, upload placeholder hoặc media file picker; đồng thời xác nhận document import vẫn dùng `use-file-picker`.
- [x] 3.2 Chạy `pnpm lint` và `pnpm typecheck`.
- [x] 3.3 Chạy `pnpm build` và validate change bằng OpenSpec CLI.
