---
trigger: always_on
---

Luôn tham khảo bộ skills để quyết định coding

## UX Button & Interaction Rules (Bắt buộc)

Tất cả các component có tương tác với user PHẢI tuân thủ các pattern sau.

### 1. Loading State
- Mọi button submit/save PHẢI có spinner(dùng của shadcn) khi đang loading
- Button PHẢI có `disabled={isPending}` khi đang xử lý

### 2. Toast Notification (sonner)
- LUÔN dùng `toast.success()` cho hành động thành công
- LUÔN dùng `toast.error()` cho hành động thất bại
- **TUYỆT ĐỐI KHÔNG** dùng `alert()`, `console.error()` đơn thuần cho user-facing feedback

### 3. Destructive Actions
- Mọi hành động xoá PHẢI có `AlertDialog` xác nhận trước khi thực hiện
- AlertDialog xoá PHẢI có: tiêu đề rõ ràng, mô tả hậu quả

### 7. Cancel/Reset
- Mọi form chỉnh sửa PHẢI có nút "Hủy thay đổi" (`variant="ghost"`) bên cạnh nút Save
- Nút hủy reset content về giá trị gốc, `disabled` khi không có thay đổi hoặc đang pending

## 8. Ngôn ngữ Giao diện (Thuần Việt)
- LUÔN sử dụng tiếng Việt (Thuần Việt) cho tất cả text hiển thị cho người dùng (Label, Button, Placeholder, Toast, Message, Title).
- Với các thuật ngữ kỹ thuật, ưu tiên dịch thoát ý (Ví dụ: "Crawler" -> "Bộ thu thập", "Trade" -> "Giao dịch", "Prompt" -> "Mẫu AI") nhưng vẫn đảm bảo tính chính xác và chuyên nghiệp.
- Tuyệt đối không để xảy ra tình trạng "nửa Việt nửa Anh" trên cùng một giao diện.