## 1. Circle + Rect style change

- [x] 1.1 Circle: `style: "stroke"` → `"stroke_fill"`, `color: "transparent"` → `palette.drawing + "33"`
- [x] 1.2 Rect: `style: "stroke"` → `"stroke_fill"`, `color: "transparent"` → `palette.drawing + "33"`

## 2. Polygon fill cho Parallelogram + Triangle

- [x] 2.1 Thêm style `polygon: { style: "stroke_fill", color: ... }` vào `createDrawingOverlayStyles()`
- [x] 2.2 Parallelogram: `createLineFigure` → `type: "polygon"` với `coordinates`
- [x] 2.3 Triangle: `createLineFigure` → `type: "polygon"` với `coordinates`
- [x] 2.4 Typecheck pass → polygon figure được klinecharts support ✓

## 3. Verification

- [x] 3.1 `pnpm typecheck` — không lỗi TypeScript
- [x] 3.2 Local ESLint direct run — 0 errors, warnings only

> **User-owned manual QA:** Test circle, rectangle, Gann Box, parallelogram, triangle fill; kiểm tra line tools không bị ảnh hưởng; toggle theme để xác nhận fill colors theo palette drawing color.
