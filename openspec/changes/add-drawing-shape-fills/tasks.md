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
- [ ] 3.2 `pnpm lint` — tạm thời skip timeout
- [ ] 3.3 Test circle fill hiển thị đúng
- [ ] 3.4 Test rectangle fill hiển thị đúng
- [ ] 3.5 Test Gann Box fill hiển thị đúng
- [ ] 3.6 Test parallelogram + triangle fill hiển thị đúng
- [ ] 3.7 Test line tools không bị ảnh hưởng
- [ ] 3.8 Toggle theme: fill colors theo palette drawing color

> **User-owned manual QA:** 3.3–3.8 cần smoke test browser.
