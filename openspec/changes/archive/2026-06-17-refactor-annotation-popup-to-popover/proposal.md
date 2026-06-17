## Why

Desktop annotation popup hiện tại render dưới dạng `div.absolute.z-20` bên trong container `div.relative.min-h-0.min-w-0.flex-1` — là sibling của chart canvas. Khi marker ở gần rìa container hoặc popup có nhiều sự kiện, nội dung bị clip bởi `overflow` của container cha, khiến người dùng không đọc được đầy đủ thông tin annotation. Đây là bug thực tế ảnh hưởng đến khả năng sử dụng ở những annotation có nhiều sự kiện (>3).

## What Changes

- **Thay thế** `div.absolute.z-20` + state management hiện tại bằng **shadcn Popover** cho desktop annotation popup
- **Mỗi marker button** bên trong `MarketChartCanvas` trở thành `PopoverTrigger` (qua `asChild`)
- **`PopoverContent`** tự render ra DOM portal (`document.body`) nhờ `<PopoverPrimitive.Portal>` built-in, thoát khỏi clipping của container cha
- **Bỏ** state `selectedAnnotationGroup` và `selectedAnnotationPoint` khỏi `MarketChartWorkbench` — Popover tự quản lý open/close state nội bộ
- **Giữ nguyên** `MarketChartAnnotationPopup` component — chỉ thay đổi container wrapping
- **Giữ nguyên** mobile variant (below-chart `<div className="border-t bg-muted/10 p-3 sm:hidden">`)
- **Giữ nguyên** `LocalEntityQuickDetailDrawer` flow cho event detail

## Capabilities

### New Capabilities
*Không có* — đây là thay đổi implementation, không giới thiệu capability mới. Spec-level behavior được giữ nguyên.

### Modified Capabilities
*Không có* — popup surface, popup interaction, và annotation markers specs đều không thay đổi requirement. Hành vi (collision-aware, không clip, concise preview, keyboard accessible) vẫn giữ nguyên.

## Impact

- **`app/[lang]/(main)/market-charts/market-chart-canvas.tsx`** — Mỗi `<button>` marker được bọc `<PopoverTrigger asChild>`; xử lý `onAnnotationSelect` được thay bằng `onOpenChange` của Popover
- **`app/[lang]/(main)/market-charts/market-chart-workbench.tsx`** — Xoá `selectedAnnotationGroup`/`selectedAnnotationPoint` state; xoá `div.absolute.z-20`; `ChartSurface` nhận `onAnnotationSelect` → chuyển thành Popover controlled nếu cần
- **`components/ui/popover.tsx`** — Không cần thay đổi (đã installed, đã có Portal)
- **Không ảnh hưởng** API endpoints, dependencies, i18n, hay mobile UX
