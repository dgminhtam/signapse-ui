## Why

Một số dialog đã chuyển sang wrapper shadcn nhưng nút đóng/hủy vẫn tự gọi `onOpenChange(false)` hoặc handler đóng thủ công. Điều này làm composition chưa giống mẫu shadcn chính thức, nơi action chỉ đóng dialog nên đi qua `DialogClose asChild`.

## What Changes

- Chuẩn hóa các nút chỉ dùng để đóng dialog sang `DialogClose asChild` với `Button` bên trong.
- Giữ controlled dialog qua `open` và `onOpenChange` ở các flow đang mở dialog từ state cha; không ép dùng `DialogTrigger` khi trigger không nằm trực tiếp trong component dialog.
- Giữ `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, và `DialogFooter` theo wrapper shadcn hiện có.
- Giữ các override layout cần thiết như width, max-height, flex layout, và vùng scroll cho dialog dày dữ liệu.
- Không thay đổi business logic, copy tiếng Việt, validation, pending state, model selection, quyền role, workspace behavior, hoặc API flow.
- Không chỉnh sửa wrapper trong `components/ui/dialog.tsx` nếu không phát hiện lỗi trực tiếp trong wrapper.

## Capabilities

### New Capabilities
- `shadcn-dialog-close-composition`: Quy định các dialog feature/shared phải dùng `DialogClose asChild` cho action chỉ đóng dialog và chỉ dùng handler thủ công khi action có side effect nghiệp vụ rõ ràng.

### Modified Capabilities
- None.

## Impact

- Affected feature/shared UI:
  - `app/(main)/ai-provider-configs/ai-provider-model-picker-dialog.tsx`
  - `components/workspace-switcher.tsx`
  - `components/workspace-watchlist-editor.tsx`
  - `app/(main)/roles/role-permission-dialog.tsx`
- Affected shadcn usage: imports from `@/components/ui/dialog` will include `DialogClose` where close/cancel buttons are pure close actions.
- Dependencies: no new dependency, no shadcn CLI install required.
- Verification: targeted lint/typecheck for touched files; browser smoke if authenticated local session is available.
