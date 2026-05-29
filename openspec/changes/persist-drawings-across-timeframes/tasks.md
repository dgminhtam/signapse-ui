## 1. Thêm drawing cache ref + save logic

- [x] 1.1 Import `type OverlayCreate` + thêm `drawingCacheRef`
- [x] 1.2 Trong data source effect: `chart.getOverlays({ groupId: oldKey })` → map → cache.set → `chart.removeOverlay`

## 2. Restore logic

- [x] 2.1 Sau khi set `drawingGroupIdRef.current = newKey`: `cache.get(newKey)` → `chart.createOverlay(saved)` → `cache.delete(newKey)`

## 3. Verification

- [x] 3.1 `pnpm typecheck` — không lỗi TypeScript
- [ ] 3.2 `pnpm lint` — không lỗi ESLint
- [ ] 3.3 Test vẽ draw trên 1H, switch sang 4H — draw 1H biến mất
- [ ] 3.4 Test switch về 1H — draw 1H hiện lại
- [ ] 3.5 Test switch asset — draw cũ không hiện (cache key khác)
- [ ] 3.6 Test vẽ draw mới trên 4H, switch sang 1H rồi về 4H — draw 4H hiện lại, draw 1H cũ vẫn còn

> **User-owned manual QA:** 3.3–3.6 cần smoke test browser.
