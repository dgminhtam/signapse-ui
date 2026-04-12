# AGENTS.md

Tài liệu này cung cấp hướng dẫn cho Codex khi làm việc trong repository này.

## Lệnh

Sử dụng slash command: `/dev`, `/build`, `/lint`, `/format`, `/typecheck`

Để chạy production server: `pnpm start`

## Kiến trúc

Đây là dashboard quản trị dùng **Next.js 16 App Router** cho hệ thống tín hiệu giao dịch có tích hợp AI.

- **Xác thực:** Clerk, đính kèm JWT qua `fetchAuthenticated()`
- **UI:** shadcn/ui từ `@/components/ui/`, Tailwind CSS v4, Lucide icons, Geist font
- **Toast:** chỉ dùng `sonner`, không dùng `alert()`
- **Validation:** Zod v4 cho validation frontend và mapping DTO backend

### Nhóm route

- `app/(main)/`: route được bảo vệ, `layout.tsx` kiểm tra Clerk auth ở server
- `app/(auth)/`: các trang đăng nhập Clerk
- `app/api/[feature]/action.ts`: server actions theo từng feature

### Quy ước cấu trúc thư mục feature

Mỗi feature nên nằm trọn trong thư mục riêng:

```text
app/(main)/[feature]/
├── page.tsx              # Server Component: Card shell + Suspense boundary
├── [id]/page.tsx         # Trang chi tiết: Card shell + nút quay lại chuẩn
├── error.tsx             # Local error boundary
├── [feature]-list.tsx    # Client Component: bảng/danh sách + toolbar
├── [feature]-form.tsx    # Client Component: form tạo mới/chỉnh sửa
└── [feature]-search.tsx  # Client Component: ô tìm kiếm debounce
```

### Quản lý state

- Giữ filter, search, sort và pagination trên URL
- Dùng query params `page` và `size` cho phân trang
- URL là 1-indexed, backend là 0-indexed
- Dùng `useTransition` với `router.push()` hoặc `router.replace()` khi cập nhật URL
- Ô tìm kiếm phải dùng `use-debounce` với `300ms`

## Quy tắc phát triển

`AGENTS.md` là file hướng dẫn repo-wide đang hoạt động duy nhất. Kiến thức tái sử dụng theo tác vụ phải nằm trong `.agents/skills`.

### Core components

- Không chỉnh sửa file trong `@/components/ui/`, đặc biệt là các component shadcn phức tạp như `sidebar.tsx`
- Nếu có lỗi như hydration mismatch, hãy sửa ở nơi sử dụng như `app-sidebar.tsx`, không sửa bên trong `@/components/ui/`

### Gọi API

- Luôn dùng `fetchAuthenticated()` cho endpoint cần Clerk JWT
- Luôn đọc `response.text()` trước khi `JSON.parse()` để tránh crash khi backend trả về rỗng hoặc malformed

### Quy ước UI

- Dùng `@/components/ui/` cho shadcn primitives
- Không dùng `@workspace/ui`
- Dùng relative import như `./component-name` cho component nằm cùng feature
- Ưu tiên `gap-*` trong layout `flex` hoặc `grid`, không dùng `space-y-*`
- Empty state phải dùng component `<Empty>`
- Icon bên trong button phải dùng `data-icon="inline-start"`
- `SelectItem` phải nằm trong `SelectGroup`
- `DropdownMenuItem` phải nằm trong `DropdownMenuGroup`

### Bố cục trang chuẩn

- Trang danh sách phải được bọc trong `<Card>`
- Header của mỗi trang phải có `<CardHeader>`, `<CardTitle>` và `<CardDescription>`
- Thêm `<Separator />` giữa phần header và nội dung chính
- Trang chi tiết phải có nút quay lại phía trên phần nội dung Card

### Bố cục toolbar

- Bên trái: action chính như Tạo mới/Crawl và ô tìm kiếm
- Bên phải: điều khiển sort hoặc filter tĩnh
- Dùng `flex-col sm:flex-row sm:justify-between` để responsive

### Yêu cầu UX

- Nút Submit và Lưu phải hiển thị `<Spinner>` trong lúc pending
- Nút Submit và Lưu phải bị disable trong lúc pending
- Action phá hủy dữ liệu phải dùng `<AlertDialog>` với cảnh báo rõ ràng nếu hành động không thể hoàn tác
- Form chỉnh sửa phải có nút Hủy với `variant="ghost"`
- Hành động hủy phải reset form về dữ liệu ban đầu hoặc dùng một luồng an toàn tương đương
- Sau khi submit thành công, luôn gọi `router.push()` về trang danh sách rồi `router.refresh()`
- Skeleton loader phải bám sát bố cục cuối cùng để tránh layout shift
- Thanh loading phía trên phải luôn được bật cho page transition

### Ngôn ngữ

- Toàn bộ UI text hướng đến người dùng phải là tiếng Việt chuyên nghiệp, rõ ràng và nhất quán
- Không trộn tiếng Anh và tiếng Việt trong label, placeholder, toast, description, metadata hoặc menu
- Chỉ giữ tiếng Anh cho tên riêng, thuật ngữ kỹ thuật, model name hoặc token mã nguồn khi thực sự cần thiết

### Validation và typing

- Dùng Zod v4 trở lên cho schema validation
- Nếu `zodResolver` có lỗi type tạm thời như `_zod.version`, chỉ được dùng `as any` như một workaround hẹp ngay tại ranh giới resolver

### Kỳ vọng khi review

- Review theo các rule trong file này, không dựa trên metadata Claude cũ
- Kiểm tra trang danh sách có Card shell, toolbar đúng bố cục và loading feedback phù hợp
- Kiểm tra trang chi tiết có flow quay lại chuẩn và cấu trúc Card nhất quán
- Kiểm tra mutation có xử lý kiểu `ActionResult`, có pending state, spinner và disable control đúng lúc
- Kiểm tra action xóa có dùng `AlertDialog`
- Đánh dấu `any`, skeleton lệch bố cục và UI copy không phải tiếng Việt là review finding

## Biến môi trường

Cần khai báo trong `.env`:

```text
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL
NEXT_PUBLIC_CLERK_SIGN_UP_URL
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
API_BASE_URL
```

Ví dụ:

```text
API_BASE_URL=http://localhost:8484
```

## Checklist hoàn thành feature

Trước khi đánh dấu một feature là xong:

- [ ] `page.tsx` dùng `Card` shell với `CardHeader` và `Separator`
- [ ] `page.tsx` có `Suspense` với `Skeleton` bám sát bố cục thật
- [ ] Có `error.tsx` để xử lý local server error
- [ ] Search dùng `use-debounce` với `300ms`
- [ ] Toàn bộ UI text là tiếng Việt chuyên nghiệp
- [ ] Nút Submit và Lưu có `Spinner` và trạng thái disabled
- [ ] Action xóa dùng `AlertDialog`
- [ ] Redirect sau khi thành công dùng `router.push()` và `router.refresh()`
