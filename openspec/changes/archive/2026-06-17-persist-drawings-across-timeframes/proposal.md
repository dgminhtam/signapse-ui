## Why

Khi switch timeframe, các drawing của timeframe cũ vẫn hiển thị trên chart nhưng toạ độ không match data mới. Cần save drawings vào cache trước khi đổi timeframe và restore khi quay lại.

## What Changes

- **Save:** Trong data source effect, trước khi đổi `drawingGroupIdRef.current`:
  - `chart.getOverlays({ groupId: oldKey })` → lấy danh sách drawing hiện tại
  - Map qua các overlay, extract `name`, `points`, `styles`, `lock`, `visible`, `zLevel`, `paneId`, `mode`
  - Lưu vào `drawingCacheRef` — `Map<string, OverlayCreate[]>`
  - `chart.removeOverlay({ groupId: oldKey })` — xoá khỏi chart

- **Restore:** Sau khi set data mới + `drawingGroupIdRef.current` đã update:
  - `cache.get(newKey)` → nếu có drawings
  - `chart.createOverlay(saved)` với `{ ...props, groupId: newKey }`

## Capabilities

### New Capabilities
- `drawing-persist-across-timeframes`: Drawings được cache in-memory, restore khi quay lại timeframe cũ

## Impact

- **`app/[lang]/(main)/market-charts/market-chart-canvas.tsx`** — Data source effect: save/restore overlays; thêm `drawingCacheRef`
- **Không ảnh hưởng** API, dependencies, drawing toolbar, i18n
