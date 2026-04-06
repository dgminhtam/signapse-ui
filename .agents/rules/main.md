---
trigger: always_on
---

Luôn tham khảo bộ skills để quyết định coding

## UX Button & Interaction Rules (Bắt buộc)

Tất cả các component có tương tác với user PHẢI tuân thủ các pattern sau. Tham khảo trang News Sources (`news-sources/`) làm gold standard.

### 1. Loading State
- Mọi button submit/save PHẢI có `Loader2` spinner (`lucide-react`) khi đang loading
- Text button PHẢI thay đổi khi loading: `"Lưu"` → `"Đang lưu..."`, `"Tạo"` → `"Đang tạo..."`
- Button PHẢI có `disabled={isPending}` khi đang xử lý
- Button PHẢI có `min-w-[value]` phù hợp để tránh nhảy kích thước khi text thay đổi

### 2. Toast Notification (sonner)
- LUÔN dùng `toast.success()` cho hành động thành công
- LUÔN dùng `toast.error()` cho hành động thất bại
- **TUYỆT ĐỐI KHÔNG** dùng `alert()`, `console.error()` đơn thuần cho user-facing feedback
- Không dùng logic `isSuccess` state để đổi text button → dùng toast thay thế

### 3. Destructive Actions
- Mọi hành động xoá PHẢI có `AlertDialog` xác nhận trước khi thực hiện
- AlertDialog xoá PHẢI có: tiêu đề rõ ràng, mô tả hậu quả, nút Cancel, nút xoá màu đỏ
- Nút xoá trong dialog: `bg-red-500 hover:bg-red-600 text-white rounded-xl`
- Nút Cancel trong dialog: `className="rounded-xl"` + `disabled={isDeleting}`

### 4. Dialog Pattern
- Cancel button: `variant="ghost"` + `disabled={loading}`
- Submit button: `className="rounded-xl px-6 shadow-sm"` + loading state đầy đủ
- DialogFooter: `className="mt-6"` hoặc `className="mt-8"`

### 5. Form & Input Pattern
- Label: `className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"`
- Input: `className="h-11 rounded-xl bg-background shadow-sm"`
- Switch active color: `className="data-[state=checked]:bg-emerald-500"`

### 6. Unsaved Changes
- Nếu form/editor có thay đổi chưa lưu mà user chuyển đi, PHẢI hiển thị `AlertDialog` cảnh báo
- Track dirty state bằng so sánh `editContent !== originalContent`
- Dialog phải có 2 lựa chọn: "Ở lại chỉnh sửa" và "Bỏ thay đổi"

### 7. Cancel/Reset
- Mọi form chỉnh sửa PHẢI có nút "Hủy thay đổi" (`variant="ghost"`) bên cạnh nút Save
- Nút hủy reset content về giá trị gốc, `disabled` khi không có thay đổi hoặc đang pending

## 8. Ngôn ngữ Giao diện (Thuần Việt)
- LUÔN sử dụng tiếng Việt (Thuần Việt) cho tất cả text hiển thị cho người dùng (Label, Button, Placeholder, Toast, Message, Title).
- Với các thuật ngữ kỹ thuật, ưu tiên dịch thoát ý (Ví dụ: "Crawler" -> "Bộ thu thập", "Trade" -> "Giao dịch", "Prompt" -> "Mẫu AI") nhưng vẫn đảm bảo tính chính xác và chuyên nghiệp.
- Tuyệt đối không để xảy ra tình trạng "nửa Việt nửa Anh" trên cùng một giao diện.

## 9. Giao diện Midnight Precision (Bắt buộc)
TẤT CẢ các component mới/nâng cấp PHẢI tuân thủ phong cách thiết kế tối giản cao cấp sau:

### Tông màu & Nền
- **Dark Mode**: Sử dụng Midnight Slate `oklch(0.12 0.015 260)` làm nền, không dùng đen thuần.
- **Accent Color**: LUÔN dùng **Emerald (Xanh lục bảo)**: `oklch(0.65 0.18 160)` cho các thành phần nhấn, trạng thái Active, và Primary Button.
- **Borders**: Sử dụng `border-border/50` và độ trong suốt cao để tạo sự nhẹ nhàng.

### Hình dáng & Khoảng cách
- **Border Radius**: Đồng bộ `rounded-2xl` (0.75rem) cho Card, Button lớn, và Sidebar items.
- **Minimalist Layout**: Ưu tiên khoảng trắng, loại bỏ các gradient nền rườm rà. Sử dụng `bg-card/50 backdrop-blur` cho các bề mặt cần chiều sâu.

### Biểu đồ (Charts)
- Luôn sử dụng dải màu Emerald-Teal làm chủ đạo. Tránh dùng các màu mặc định của thư viện biểu đồ.