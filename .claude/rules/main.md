---
trigger: always_on
---

# 📜 Signapse UI: Bộ Quy Tắc Triển Khai Feature (Standard Blueprint)

Dựa trên quá trình refactor phân hệ Blog và tối ưu bộ Core, đây là các quy tắc "bất di bất bì" cần tuân thủ để đảm bảo tính đồng nhất, hiệu suất và trải nghiệm người dùng cao cấp (Premium) cho các tính năng tiếp theo.

---

## 0. Bảo Tồn Thành Phần Cốt Lõi (Core Components)
- **Nguyên tắc:** Các thành phần UI nền tảng nằm trong `@/components/ui/` (đặc biệt là các component phức tạp như `sidebar.tsx`) phải được giữ nguyên bản từ shadcn/ui.
- **Tại sao:** Để dễ dàng cập nhật bản vá từ shadcn, giữ cho mã nguồn sạch và tránh các side-effect không mong muốn trong hệ thống UI.
- **Ngoại lệ:** Chỉ thực hiện thay đổi nếu có yêu cầu nghiệp vụ đặc thù mà không thể xử lý thông qua Props hoặc Wrapper component. Nếu gặp lỗi kỹ thuật (như Hydration Mismatch), hãy tìm cách xử lý tại nơi sử dụng component (ví dụ: `app-sidebar.tsx`) thay vì sửa file gốc trong `ui/`.

---

## 1. Cấu Trúc Thư Mục & Co-location
- **Nguyên tắc:** Các thành phần chỉ dùng riêng cho một Feature phải nằm "trong" thư mục của Feature đó.
- **Cấu trúc mẫu:**
  ```text
  app/(main)/[feature]/
  ├── page.tsx               # Server Component: Shell bọc Card + Suspense boundaries
  ├── [id]/page.tsx          # Trang chi tiết: Bọc Card + Back button chuẩn
  ├── error.tsx              # Bắt lỗi cục bộ cho riêng feature
  ├── [feature]-list.tsx     # Client Component: Table + Search/Filter Bar
  ├── [feature]-form.tsx     # Client Component: Form tạo/sửa
  └── [feature]-search.tsx   # Client Component: Thanh tìm kiếm debounce
  ```
- **Import:** Tuyệt đối không dùng `@workspace/ui`. Luôn dùng alias `@/components/ui/` cho shadcn primitives và `./[file]` cho các component nội bộ cùng cấp.

---

## 2. Quản Lý Trạng Thái Qua URL (URL-as-State)
Để tối ưu SEO, hỗ trợ nút Back/Forward và Share link, toàn bộ trạng thái Filter phải nằm trên URL.
- **Pagination:** Sử dụng query `page` và `size`. Lưu ý: URL dùng 1-indexed, Backend dùng 0-indexed.
- **Search:** Sử dụng debounce (300ms) qua thư viện `use-debounce`.
- **Logic:** Sử dụng `useTransition` kết hợp `router.push/replace` để chuyển đổi URL mà không làm mất trạng thái UI.

---

## 3. Tiêu Chuẩn Giao Diện (Shadcn/ui & Premium UX)
- **Composition Rules:** Luôn tuân thủ quy tắc lồng ghép của Radix/Shadcn (Ví dụ: `SelectItem` phải nằm trong `SelectGroup`, `DropdownMenuItem` phải nằm trong `DropdownMenuGroup`).
- **Icons:** Sử dụng thuộc tính `data-icon="inline-start"` cho icon trong Button để có khoảng cách chuẩn.
- **Spacing:** Sử dụng `gap-*` trong flex/grid, tránh dùng `space-y-*` vốn dễ gây lỗi layout khi có phần tử ẩn/hiện.
- **Empty State:** Khi không có dữ liệu, luôn dùng component `<Empty>` thay vì chỉ hiện text lẻ loi.

### 3.1. Standard Page Layout (Card Shell)
- **Danh sách chính:** PHẢI được bọc trong component `<Card>`.
- **Header:** Phải có `<CardHeader>` chứa `<CardTitle>` (Tên feature) và `<CardDescription>` (Mô tả ngắn gọn).
- **Phân tách:** Dùng `<Separator />` ngay sau header trước khi vào nội dung danh sách.

### 3.2. Synchronized Controls (Toolbar Layout)
Để đảm bảo tính nhất quán, thanh điều khiển trên đầu bảng phải tuân thủ:
- **Bên trái (Left Group):** Nút hành động chính (Crawl, Create) + Thanh Search (Input).
- **Bên phải (Right Group):** Nút Sort (Sắp xếp) hoặc các Select lọc dữ liệu tĩnh.
- **Responsive:** Sử dụng `flex-col sm:flex-row sm:justify-between`.

### 3.3. Detail Page Standard
- Luôn có nút **"Quay lại"** (Back button) nằm phía trên thẻ Card.
- Nội dung chi tiết phải bọc trong `<Card>` kèm `<Separator />` tương tự trang danh sách.

---

## 4. Quy Tắc UX & Tương Tác (Bắt buộc)

### 4.1. Loading State & Spinner
- Mọi button **Submit/Save** PHẢI có spinner (dùng component `Spinner` của shadcn) khi đang loading.
- Button PHẢI có `disabled={isPending}` khi đang xử lý để chặn spam click.

### 4.2. Thông báo (Toast Notification)
- LUÔN dùng `toast.success()` / `toast.error()` từ thư viện `sonner`.
- **TUYỆT ĐỐI KHÔNG** dùng `alert()` hoặc chỉ để lỗi ở `console.log`.

### 4.3. Hành động Xoá (Destructive Actions)
- Mọi hành động xoá PHẢI có `AlertDialog` xác nhận.
- `AlertDialog` phải nêu rõ hậu quả (ví dụ: "Hành động này không thể hoàn tác").

### 4.4. Cơ chế Huỷ/Reset
- Mọi form chỉnh sửa PHẢI có nút **"Hủy"** (`variant="ghost"`) bên cạnh nút Lưu.
- Nút Hủy có nhiệm vụ reset dữ liệu về trạng thái gốc.

---

## 5. Ngôn ngữ Giao diện (Thuần Anh)
- LUÔN sử dụng **Tiếng Anh chuyên nghiệp** cho tất cả nội dung hiển thị (Label, Placeholder, Toast, Metadata).
- Tuyệt đối không để xảy ra tình trạng "nửa Việt nửa Anh".

---

## 6. Hiệu Ứng Phản Hồi (Feedback Loops)
- **Skeleton Alignment:** Khung xương (Skeleton) phải khớp 100% về số cột, kích thước và layout so với giao diện thật để tránh hiện tượng "nháy" trang (Layout Shift).
- **Redirection:** Sau khi Submit Form thành công, luôn thực hiện `router.push()` về trang danh sách và `router.refresh()` để cập nhật dữ liệu mới nhất.
- **Topbar:** Thanh tiến trình ở trên cùng (Topbar) tự động chạy khi chuyển trang để báo hiệu hệ thống đang xử lý.

---

## 7. Quy Tắc Gọi API (Core API)
- **Server Actions:** Đặt tại `app/api/[feature]/action.ts`.
- **fetchAuthenticated:** Luôn sử dụng wrapper `fetchAuthenticated` để tự động đính kèm Clerk JWT Token.
- **Safe Parsing:** Luôn sử dụng logic kiểm tra `response.text()` trước khi `JSON.parse` để tránh lỗi "Unexpected end of JSON input" khi Backend lỗi.

---

## 8. Validation & Typescript
- **Zod:** Sử dụng Zod v4 (hoặc bản mới nhất) cho cả Frontend Validation và Backend DTO Mapping.
- **Type mismatch:** Nếu gặp lỗi `_zod.version` tại `zodResolver`, sử dụng `as any` để bypass type definition lỗi thời của resolver, nhưng vẫn giữ Schema chặt chẽ.

---

> [!TIP]
> **Checklist trước khi Done một Feature:**
> - [ ] Trang Page chính có cấu trúc **Card/CardHeader/Separator** chưa?
> - [ ] Trang Page chính có `Suspense` và `Skeleton` khớp layout chưa?
> - [ ] Có `error.tsx` để handle lỗi server chưa?
> - [ ] Thanh tìm kiếm có `debounce` chưa?
> - [ ] Ngôn ngữ đã được dịch sang **Tiếng Anh chuyên nghiệp** chưa?
> - [ ] Các Button Submit đã có **Spinner** và **Disabled state** chưa?
> - [ ] Hành động Xoá đã có **AlertDialog** chưa?
> - [ ] Sau khi tạo/sửa đã có `router.refresh()` và Redirect chưa?