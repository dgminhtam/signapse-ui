## Context

`docs/api_mapping.json` hiện có 5 endpoint cho `system-prompts`: list phân trang, create, detail theo `promptType`, update theo `promptType`, và delete theo `promptType`. Frontend chưa có module `system-prompts`, trong khi `docs/APIMAPPING.md` vẫn đánh dấu nhóm API này là chưa triển khai.

System Prompt là cấu hình rủi ro cao hơn các cấu hình hiển thị thông thường vì nội dung prompt ảnh hưởng trực tiếp tới workflow AI của hệ thống giao dịch. UI cần đủ nhanh cho quản trị viên vận hành, nhưng vẫn phải tránh thao tác nhầm, nhất là update/delete.

## Goals / Non-Goals

**Goals:**

- Cung cấp trang danh sách `/system-prompts` có search, sort, page size, phân trang và empty state.
- Cung cấp form tạo mới với `promptType` và `content`.
- Cung cấp trang chỉnh sửa `/system-prompts/{promptType}` với `promptType` readonly và chỉ update `content`.
- Cung cấp delete action có xác nhận rõ ràng.
- Gate UI/action bằng permission keys đã xác nhận: `system-prompt:read`, `system-prompt:create`, `system-prompt:update`, `system-prompt:delete`.
- Giữ toàn bộ UI text tiếng Việt chuyên nghiệp, có dấu, không mojibake.
- Cập nhật `docs/APIMAPPING.md` khi feature hoàn tất.

**Non-Goals:**

- Không thêm test prompt, preview output, prompt playground hoặc chạy thử AI.
- Không thêm version history, diff version hoặc rollback prompt vì backend chưa có endpoint.
- Không thêm audit log UI.
- Không chỉnh các prompt workflow backend hoặc seed data.
- Không tự thêm permission fallback legacy khi permission set đã được xác nhận.

## Decisions

### Route identity uses `promptType`

Detail/edit route dùng `/system-prompts/{promptType}` thay vì `/system-prompts/{id}` vì backend detail/update/delete đều định danh bằng enum `promptType`.

Alternatives considered:

- Dùng `[id]`: không chọn vì frontend sẽ phải map thêm từ id sang promptType và dễ gọi sai endpoint.
- Dùng query param `?promptType=`: không chọn vì repo convention detail route là path segment.

### Data layer mirrors backend contract

Tạo `app/lib/system-prompts/definitions.ts` với:

- `SystemPromptType`
- `SYSTEM_PROMPT_TYPES`
- `SystemPromptResponse`
- `CreateSystemPromptRequest`
- `UpdateSystemPromptRequest`
- helper label/group cho prompt type

Tạo `app/api/system-prompts/action.ts` với:

- `getSystemPrompts(searchParams)`
- `getSystemPromptByType(promptType)`
- `createSystemPrompt(request)`
- `updateSystemPrompt(promptType, request)`
- `deleteSystemPrompt(promptType)`

Mutation trả `ActionResult`, gọi `revalidatePath("/system-prompts")`, và revalidate detail route theo `promptType` khi update/delete.

### Form validation is slightly stricter than backend on content

Backend cho `content` minLength `0`, nhưng frontend v1 nên yêu cầu `content.trim().min(1)` để tránh lưu prompt trống do thao tác nhầm. Vẫn giữ `max(10000)` theo backend.

Alternatives considered:

- Cho phép prompt rỗng đúng tuyệt đối theo backend: không chọn vì prompt rỗng là cấu hình nguy hiểm, ít có giá trị vận hành.
- Thêm confirmation riêng khi content rỗng: không chọn ở v1 để giữ form đơn giản.

### List UX emphasizes operational clarity

List columns nên gồm:

- Loại prompt
- Nhóm workflow
- Độ dài nội dung
- Cập nhật lần cuối
- Tạo lúc
- Thao tác

Search v1 dùng `promptType[containsIgnoreCase],content[containsIgnoreCase]` để quản trị viên tìm theo enum hoặc nội dung prompt. Sort v1 dùng `lastModifiedDate_desc`, `createdDate_desc`, `promptType_asc`, `promptType_desc`.

### Prompt type labels are frontend-only helpers

OpenAPI chỉ cung cấp enum kỹ thuật. Frontend nên có label tiếng Việt và nhóm nghiệp vụ để bảng dễ đọc, nhưng payload vẫn gửi enum nguyên bản.

Ví dụ nhóm:

- Tin tức
- Sự kiện
- Giao dịch / quyết định
- Truy vấn thị trường

Nếu enum mới xuất hiện sau này, fallback hiển thị chính enum đó thay vì crash.

### Delete is guarded by AlertDialog

Delete prompt dùng `AlertDialog` với nội dung cảnh báo rõ rằng hành động có thể ảnh hưởng workflow AI và không thể hoàn tác từ UI. Sau delete thành công, route refresh và list cập nhật.

## Risks / Trade-offs

- [Risk] `promptType` có ký tự underscore và được dùng trong URL. → Mitigation: luôn `encodeURIComponent()` khi tạo href/action endpoint và decode từ params ở page.
- [Risk] Backend cho phép content rỗng nhưng frontend chặn. → Mitigation: đây là guardrail có chủ đích; nếu cần hỗ trợ prompt rỗng như trạng thái disable, tạo change riêng.
- [Risk] Search trong `content` có thể nặng nếu prompt dài. → Mitigation: v1 giữ theo pattern list hiện có; nếu backend phản hồi chậm, có thể thu hẹp search còn `promptType` trong change sau.
- [Risk] Không có version history nên update/delete khó phục hồi. → Mitigation: UI cảnh báo rõ, form edit có nút hủy/reset, delete có AlertDialog.
- [Risk] Permission catalog backend có thể thiếu key mới trên môi trường cũ. → Mitigation: permission keys đã được người dùng xác nhận; không thêm fallback ngoài scope.

## Migration Plan

1. Thêm definitions, permissions và server actions.
2. Thêm route list/create/edit/error theo convention repo.
3. Thêm navigation item `Prompt hệ thống` dưới nhóm `Cài đặt`.
4. Cập nhật `docs/APIMAPPING.md`.
5. Chạy targeted lint và typecheck.

Rollback chỉ cần revert các file frontend/docs của change vì không có migration dữ liệu ở frontend.

## Open Questions

- Có cần ẩn một số prompt type legacy khỏi dropdown create nếu backend đã giữ enum để tương thích nhưng không còn dùng thực tế không?
- Có cần cảnh báo khi tạo prompt trùng `promptType`, hay để backend trả lỗi và frontend hiển thị toast lỗi?
