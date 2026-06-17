## Context

Hiện tại desktop annotation popup render như một `div.absolute.z-20` sibling của `MarketChartCanvas` bên trong `div.relative.min-h-0.min-w-0.flex-1` ở `ChartSurface`. Vị trí được tính thủ công qua `getAnnotationPopupStyle()` dựa trên pixel coordinates của marker so với container. Khi marker ở gần rìa hoặc popup có nội dung dài (nhiều sự kiện), popup bị clip bởi `overflow` của container cha.

Các spec hiện tại (`market-chart-annotation-popup-surface`, `market-chart-annotation-popup-interaction`) yêu cầu popup không bị clip, collision-aware, và concise preview. Implementation hiện tại không đáp ứng hoàn toàn requirement "không bị clip".

## Goals / Non-Goals

**Goals:**
- Loại bỏ clipping bằng cách render popup ra ngoài chart container qua React Portal
- Giữ nguyên UX hiện tại (popup gần marker, collision-aware placement)
- Tận dụng component `Popover` shadcn đã installed sẵn
- Giảm hoặc loại bỏ state management thủ công (`selectedAnnotationGroup`, `selectedAnnotationPoint`)
- Giữ nguyên mobile variant (below-chart)

**Non-Goals:**
- Không thay đổi nội dung `MarketChartAnnotationPopup` (concise preview, direction dot, metadata row)
- Không thay đổi mobile annotation detail (below-chart `<div>`)
- Không thay đổi `LocalEntityQuickDetailDrawer` flow
- Không thêm dependency mới
- Không ảnh hưởng đến annotation markers rendering (màu sắc, pulse, grouping)

## Decisions

### Decision 1: Dùng shadcn `Popover` thay vì `createPortal` thủ công

| Option | Kết luận |
|---|---|
| **shadcn Popover** ✅ | Đã installed, portal built-in qua `<PopoverPrimitive.Portal>`, collision detection (flip/side/align), animation sẵn (fade-in + zoom-in), shadcn best practice |
| `createPortal` thủ công | Phải tự handle collision detection, animation, scroll/resize — tái tạo công việc Radix đã làm |
| `Dialog` | Quá nặng cho popup nhỏ gần marker, cần `DialogTitle` |
| `Sheet` (side panel) | Phá vỡ UX "popup gần marker" |

**Rationale:** Popover là mapping chính xác nhất giữa UI pattern và component. Radix xử lý portal + collision detection + focus management + dismiss on outside click — tất cả đều đúng với requirement.

### Decision 2: Popover self-managed state, không controlled từ workbench

Hiện tại workbench có `selectedAnnotationGroup` và `selectedAnnotationPoint` state, dùng để:
1. Quyết định popup có visible không
2. Truyền `point` vào `getAnnotationPopupStyle()`

Khi dùng Popover, `Popover.Root` tự quản `open` state nội bộ. Marker click → Popover tự mở → `PopoverContent` render.

Tuy nhiên, workbench vẫn cần biết **group nào được selected** để:
- Highlight marker tương ứng
- Mở `LocalEntityQuickDetailDrawer` khi user click event

→ **Giải pháp:** Dùng Popover **uncontrolled** (`defaultOpen`, không `open`/`onOpenChange`), kết hợp `onClick` trên marker để set `selectedGroupId` cho highlight/drawer flow.

### Decision 3: `PopoverAnchor` để neo popup đúng vị trí marker

Marker buttons được render bên trong `MarketChartCanvas` (một component riêng). Popover trigger cần được đặt ở vị trí marker cụ thể.

**Cách làm:** Mỗi marker `<button>` trong canvas được bọc bằng `<PopoverTrigger asChild>`. PopoverContent sẽ anchor vào button đó. Vì Popover trigger là `asChild`, nó không thêm DOM node nào — button vẫn giữ nguyên vị trí và style.

### Decision 4: Giữ `onAnnotationSelect` callback cho non-Popover flows

Annotation controls ngoài canvas (annotation list / keyboard controls) không phải là Popover trigger — chúng vẫn cần gọi `onAnnotationSelect` để mở popup hoặc fallback.

**Cách làm:** Workbench vẫn giữ `selectedAnnotationGroup` state, nhưng với mục đích hẹp hơn:
- Popover tự quản lý visibility cho marker-triggered interactions
- `selectedAnnotationGroup` chỉ dùng cho keyboard/non-canvas access paths và marker highlight

Có thể chuyển thành `React.Context` để canvas đọc mà không cần prop drilling.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| **Multiple open popovers** — nếu có nhiều marker cùng lúc, Radix Popover tự động đóng popover cũ khi mở popover mới (mặc định) | Hành vi này đúng với spec "Dismiss popup when selecting another marker" |
| **Popover z-index conflict** — portal render ở `document.body` với `z-50` có thể bị overlay khác đè | Popover mặc định `z-50` — ngang hàng với Dialog/Sheet. Kiểm tra trong fullscreen mode |
| **Performance trên nhiều marker** — mỗi marker là một Popover với state riêng | Popover là lightweight — không re-render khi không open. Hàng chục marker không vấn đề |
| **Scroll/resize repositioning** — portal không tự reposition khi container scroll | Radix Popover tự tính lại vị trí. Tuy nhiên `PopoverContent` cần `updatePositionStrategy="always"` nếu container scroll độc lập |
| **`selectedAnnotationGroup` dual state** — vừa trong Popover, vừa ở workbench, dễ desync | `selectedAnnotationGroup` chỉ set khi user click marker (qua `onClick`), Popover tự quản visibility. Không có dual source of truth — workbench chỉ biết "group nào đang active", Popover quyết định "có show popup không" |
