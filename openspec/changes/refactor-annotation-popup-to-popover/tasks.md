## 1. Wrap marker buttons with PopoverTrigger

- [x] 1.1 Import `Popover`, `PopoverTrigger`, `PopoverContent` from `@/components/ui/popover` in `market-chart-canvas.tsx`
- [x] 1.2 Wrap each marker `<button>` with `<PopoverTrigger asChild>` — button tự mở Popover khi click, không cần state thủ công
- [x] 1.3 Add `<PopoverContent>` right after `</PopoverTrigger>` với `align="start"` và `side="right"` — Radix tự flip khi cần
- [x] 1.4 Giữ `onAnnotationSelect` callback — gọi từ `onClick` của marker (đã bỏ tham số `point`)
- [x] 1.5 Giữ `selectedAnnotationGroupId` prop cho visual highlight (ring + aria-pressed) — workbench set qua `onAnnotationSelect`

## 2. Simplify workbench state

- [x] 2.1 Xoá `selectedAnnotationPoint` state và tất cả `setSelectedAnnotationPoint(null)` (13 occurrences)
- [x] 2.2 Xoá `getAnnotationPopupStyle()` function — Radix Popover tự xử lý positioning
- [x] 2.3 Xoá `div.absolute.z-20` block trong `ChartSurface` (desktop popup)
- [x] 2.4 Xoá `onClick={selectedAnnotationGroup ? onAnnotationClose : undefined}` trên container
- [x] 2.5 Giữ `handleAnnotationClose()` — cần cho mobile variant; xoá `selectedAnnotationPoint` setter khỏi nó

## 3. Keep highlight + drawer flow working

- [x] 3.1 `selectedAnnotationGroupId` vẫn được set trong `handleAnnotationSelect` (giữ nguyên)
- [x] 3.2 `handleAnnotationEventOpen` vẫn mở `LocalEntityQuickDetailDrawer`; không còn gọi `handleAnnotationClose()` (Popover tự quản lý)
- [x] 3.3 Mobile variant (below-chart) vẫn dùng `selectedAnnotationGroup` với `onClose={onAnnotationClose}`

## 4. Verification

- [x] 4.1 `pnpm typecheck` — không lỗi TypeScript
- [x] 4.2 `pnpm lint` — không lỗi ESLint
- [ ] 4.3 Kiểm tra Popover hiển thị đúng vị trí gần marker, không bị clip ở mọi rìa canvas
- [ ] 4.4 Kiểm tra marker highlight (selected ring) vẫn hoạt động khi Popover mở
- [ ] 4.5 Kiểm tra mobile fallback (below-chart) vẫn hiển thị khi click marker
- [ ] 4.6 Kiểm tra `LocalEntityQuickDetailDrawer` vẫn mở khi click event trong Popover
- [ ] 4.7 Kiểm tra Popover đóng khi click outside hoặc chọn marker khác

> **User-owned manual QA:** Tasks 4.3–4.7 cần smoke test bằng browser để verify positioning, clipping, interaction flows.
