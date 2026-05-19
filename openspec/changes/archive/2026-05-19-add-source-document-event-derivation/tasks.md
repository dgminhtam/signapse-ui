## 1. Contract và server actions

- [x] 1.1 Mở rộng `app/lib/source-documents/definitions.ts` với `SourceDocumentEventDerivationStatus`, các field derivation trong list/detail response, và DTO cho `NewsPrimaryEventDerivationResult` cùng `PendingNewsEventDerivationBatchResult`.
- [x] 1.2 Thêm server actions `derivePrimaryEventFromSourceDocument(id)` và `derivePendingNewsEvents(batchSize?)` trong `app/api/source-documents/action.ts` bằng `fetchAuthenticated()` và `ActionResult<T>`.
- [x] 1.3 Đảm bảo các mutation derive event revalidate `/source-documents` và `/source-documents/[id]` sau khi thành công.

## 2. UX danh sách source-documents

- [x] 2.1 Bổ sung badge trạng thái derive event cho từng dòng trong `app/(main)/source-documents/source-document-list.tsx`.
- [x] 2.2 Thêm nút batch ở toolbar list để gọi `derive-pending-news-events`, có spinner, disabled state, và toast summary theo kết quả batch.
- [x] 2.3 Giữ gating của derive event theo permission compatibility layer hiện tại dùng cho source-document analyze actions.

## 3. UX chi tiết source-document

- [x] 3.1 Bổ sung metadata “Suy diễn sự kiện” trên trang `app/(main)/source-documents/[id]/page.tsx`, gồm trạng thái, thời gian attempted/completed, và lỗi gần nhất nếu có.
- [x] 3.2 Thêm nút “Suy diễn sự kiện chính” cho document `NEWS`, có pending feedback và refresh dữ liệu tại chỗ sau khi chạy.
- [x] 3.3 Ẩn hoặc không render action derive event cho các document không phải `NEWS`, nhưng vẫn hiển thị metadata derivation nếu backend trả về.

## 4. Tài liệu và kiểm chứng

- [x] 4.1 Cập nhật `docs/APIMAPPING.md` để thêm `POST /source-documents/{id}/derive-primary-event` và `POST /source-documents/derive-pending-news-events`.
- [x] 4.2 Kiểm tra list/detail render đúng badge và metadata derivation với dữ liệu trả về từ backend local.
- [x] 4.3 Kiểm tra nút derive đơn và batch hiển thị spinner, disable đúng lúc, giữ người dùng trong flow hiện tại, và hiện toast/result summary phù hợp.
- [ ] 4.4 Chạy `pnpm lint` và `pnpm typecheck` cho phạm vi thay đổi trước khi đóng change.
