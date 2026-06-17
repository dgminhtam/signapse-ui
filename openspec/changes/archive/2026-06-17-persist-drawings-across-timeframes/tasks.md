## 1. Thêm drawing cache ref + save logic

- [x] 1.1 Import `type OverlayCreate` + thêm `drawingCacheRef`
- [x] 1.2 Trong data source effect: `chart.getOverlays({ groupId: oldKey })` → map → cache.set → `chart.removeOverlay`

## 2. Restore logic

- [x] 2.1 Sau khi set `drawingGroupIdRef.current = newKey`: `cache.get(newKey)` → `chart.createOverlay(saved)` → `cache.delete(newKey)`

## 3. Verification

- [x] 3.1 `pnpm typecheck` — không lỗi TypeScript
- [x] 3.2 Local ESLint direct run — 0 errors, warnings only

> **User-owned manual QA:** Test vẽ draw trên 1H rồi switch sang 4H, switch về 1H, switch asset, và vẽ draw mới trên 4H rồi quay qua lại 1H/4H.
