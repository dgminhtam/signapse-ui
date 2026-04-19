## 1. Xóa legacy route và UI surface

- [x] 1.1 Xóa toàn bộ route tree và component tree dưới `app/(main)/articles` vì domain này không còn được hỗ trợ.
- [x] 1.2 Xóa toàn bộ route tree và component tree dưới `app/(main)/economic-calendar` vì domain này đã được thay bằng `source-documents`.
- [x] 1.3 Xóa toàn bộ route tree và component tree dưới `app/(main)/wiki`, bao gồm list/detail/error surface.
- [x] 1.4 Gỡ các nút và component thao tác wiki khỏi `app/(main)/source-documents`, bao gồm mọi ingest button hoặc redirect flow sang wiki.

## 2. Dọn data layer và entry point còn sót

- [x] 2.1 Xóa các server action không còn hợp lệ dưới `app/api/articles`, `app/api/economic-calendar`, và `app/api/wiki`.
- [x] 2.2 Xóa các definition/type module không còn hợp lệ dưới `app/lib/articles`, `app/lib/economic-calendar`, và `app/lib/wiki`.
- [x] 2.3 Cập nhật `config/site.ts` và các entry point liên quan để navigation không còn hiển thị `wiki` hoặc bất kỳ bề mặt legacy content nào.
- [x] 2.4 Rà import toàn repo và dọn mọi alias/helper/reference còn trỏ tới `articles`, `economic-calendar`, hoặc `wiki`.

## 3. Tài liệu và kiểm chứng

- [x] 3.1 Cập nhật `docs/APIMAPPING.md` và các tài liệu frontend liên quan để chỉ còn mô tả `sources` và `source-documents` là content surfaces hợp lệ.
- [x] 3.2 Rà các OpenSpec artifact active liên quan để bảo đảm plan đang còn hiệu lực không phụ thuộc vào việc giữ lại `wiki` hoặc legacy routes.
- [x] 3.3 Kiểm tra bằng search toàn repo rằng không còn module hay import sống cho `articles`, `economic-calendar`, hoặc `wiki`.
- [x] 3.4 Chạy `pnpm lint` và `pnpm typecheck` cho phạm vi thay đổi hoặc toàn repo theo điều kiện môi trường hiện có.
