## Why

Các drawing shape tools (circle, rectangle, parallelogram, triangle, gann box) hiện chỉ vẽ đường viền (stroke), không có fill bên trong. Khi user muốn đánh dấu vùng giá trên chart, việc thiếu fill khiến khó quan sát và phân biệt vùng đã chọn với nến phía sau. Cần thêm semi-transparent fill để các shape tools hữu ích hơn cho phân tích kỹ thuật.

## What Changes

- **Circle, Rectangle, Gann Box** — đổi từ `style: "stroke"` sang `style: "stroke_fill"`, thêm `color` với alpha channel (vd: `palette.drawing + "33"`)
- **Parallelogram, Triangle** — hiện tại dùng `createLineFigure` (polyline), không support fill. Cần chuyển sang polygon figure để có fill, hoặc giữ stroke-only (khả năng klinecharts không hỗ trợ polygon fill dễ dàng)
- **Công cụ Line** (trend-line, ray, segment, arrow, fibonacci, pattern tools) — không thay đổi, stroke-only là đúng

## Capabilities

### New Capabilities
- `drawing-shape-fills`: Shape drawing tools có semi-transparent fill để đánh dấu vùng giá

### Modified Capabilities
*Không có*

## Impact

- **`app/[lang]/(main)/market-charts/market-chart-canvas.tsx`** — `createDrawingOverlayStyles()`: sửa style cho `circle`, `rect` (thêm `color` + `style: "stroke_fill"`)
- **`app/[lang]/(main)/market-charts/market-chart-drawing.ts`** — `createParallelogramOverlayTemplate()`, `createTriangleOverlayTemplate()`: có thể cần chuyển sang polygon figure
- **Không ảnh hưởng** API, dependencies, i18n, backend
