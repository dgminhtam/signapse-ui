# Hydration Mismatch trên Overlay Radix/shadcn

## Scope

Áp dụng khi gặp hydration mismatch trên các overlay Radix/shadcn: `Dialog`, `Sheet`, `AlertDialog`, `Popover` hoặc trigger/content tương ứng.

## Quy trình điều tra

Phải điều tra root cause **trước khi sửa**. Kiểm tra lần lượt:

1. Branch render dùng `typeof window`
2. `Date.now()` / `Math.random()` trong render
3. Format locale trong render
4. Conditional render theo permission/client state
5. Nesting HTML không hợp lệ
6. Khả năng browser extension can thiệp DOM

## Cách xử lý

- Nếu mismatch chỉ là id accessibility do Radix sinh (như `aria-controls`), **ưu tiên cấp deterministic id** tại usage app-level cho trigger/content đang bị ảnh hưởng
- Singleton overlay có thể dùng constant id
- Overlay lặp theo row/list phải derive id từ stable entity key hoặc nguồn deterministic không collision

## Không được làm

- Không dùng `dynamic(..., { ssr: false })`, mount-only wrapper hoặc `suppressHydrationWarning` để che lỗi
- Giữ SSR mặc định
- Không patch `components/ui/*` chỉ để sửa issue cục bộ
- Nếu pattern lặp nhiều nơi thì tạo proposal cho helper hoặc wrapper app-level riêng
