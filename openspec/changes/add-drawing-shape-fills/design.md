## Context

Drawing shape tools (circle, rectangle, parallelogram, triangle, gann box) currently render as transparent shapes with only a colored border (`style: "stroke"`, `color: "transparent"`). Users need semi-transparent fills to visually mark price zones.

klinecharts `OverlayStyle` supports three shape rendering modes via `PolygonType`:
- `"stroke"` — outline only (current)
- `"fill"` — fill only
- `"stroke_fill"` — outline + fill

The `color` property controls fill color, `borderColor` controls outline color.

## Goals / Non-Goals

**Goals:**
- Circle: add semi-transparent fill (`stroke_fill`)
- Rectangle: add semi-transparent fill (`stroke_fill`)
- Gann Box: add semi-transparent fill for rect portion (`stroke_fill`)
- Parallelogram và Triangle: investigate polygon fill support (riêng)

**Non-Goals:**
- Không thay đổi line tools (trend-line, ray, segment, arrow, fibonacci, pattern)
- Không thêm dependency mới
- Không thay đổi palette/drawing colors — tận dụng `palette.drawing` với alpha

## Decisions

### Decision 1: Circle + Rect: đơn giản, sửa style

Chỉ cần đổi trong `createDrawingOverlayStyles`:

```diff
 circle: {
   borderColor: palette.drawing,
   borderSize: 1,
-  color: "transparent",
-  style: "stroke",
+  color: palette.drawing + "33",
+  style: "stroke_fill",
 },
 rect: {
   borderColor: palette.drawing,
   borderSize: 1,
-  color: "transparent",
-  style: "stroke",
+  color: palette.drawing + "33",
+  style: "stroke_fill",
 },
```

`"33"` là 20% alpha trong hex (khoảng 51/255). Đủ để thấy fill nhưng không che nến.

### Decision 2: Gann Box: rect fill tự động theo rect style

Gann Box dùng `type: "rect"` cho outer box → style `rect` áp dụng tự động. Các đường grid line bên trong giữ nguyên.

### Decision 3: Parallelogram + Triangle: cần investigate thêm

Hiện tại dùng `createLineFigure` (`type: "line"`) không hỗ trợ fill. Để có fill, cần:
- Thử `type: "polygon"` với `attrs: { coordinates: [...] }`
- Thêm style `polygon: { style: "stroke_fill", color: ..., borderColor: ... }` vào `createDrawingOverlayStyles`

Cần test klinecharts có hỗ trợ polygon figure không.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| `palette.drawing + "33"` có thể không parse được nếu palette.drawing là named color (vd "red") | Palette dùng hex colors (`#ff0000`), hex + alpha hoạt động |
| `style: "stroke_fill"` không được support trong klinecharts version này | Đã verify trong type definitions — `PolygonType` có `"stroke_fill"` |
| Polygon figure type không support bởi klinecharts engine | Parallelogram + Triangle giữ nguyên nếu không support; nếu được, thêm sau |
