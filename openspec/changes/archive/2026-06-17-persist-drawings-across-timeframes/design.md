## Context

Data source effect chạy khi `[assetId, timeframe]` thay đổi. Trong effect này cần:
1. Save overlays hiện tại (với `drawingGroupIdRef.current` cũ) vào cache
2. Xoá overlays cũ khỏi chart
3. Set data mới
4. Restore overlays từ cache nếu có (với `drawingGroupIdRef.current` mới)

Cache là `Map<string, Array<{ name, points, styles, lock, visible, zLevel, paneId, mode, modeSensitivity }>>` — keyed by `assetId:timeframe`.

## Goals / Non-Goals

**Goals:**
- Khi switch timeframe, drawings cũ không còn hiển thị trên chart
- Khi switch về timeframe cũ, drawings được restore đúng
- Asset change cũng xoá drawings (cache key = `assetId:timeframe`)

**Non-Goals:**
- Không persist ra localStorage (mất khi refresh page — đúng requirement)
- Không ảnh hưởng drawing toolbar UX

## Decisions

### Decision 1: Cache bằng Map, key = drawingGroupId

```tsx
const drawingCacheRef = useRef<Map<string, OverlayCreate[]>>(new Map())
```

Key = `createMarketChartDrawingGroupId({ assetId, timeframe })` — trùng với `drawingGroupIdRef.current`. Cache trong ref, không trigger re-render.

### Decision 2: Save + Remove trước, Restore sau

Thứ tự trong data source effect:
```
oldKey = drawingGroupIdRef.current
overlays = chart.getOverlays({ groupId: oldKey })
drawingCacheRef.current.set(oldKey, serialize(overlays))
chart.removeOverlay({ groupId: oldKey })
chart.setDataLoader(newLoader)  ← data mới
drawingGroupIdRef.current = newKey
saved = drawingCacheRef.current.get(newKey)
if (saved) saved.forEach(o => chart.createOverlay({ ...o, groupId: newKey, points: o.points }))
```

### Decision 3: Chỉ save các serializable fields

Từ `Overlay` interface, save: `name`, `points`, `styles`, `lock`, `visible`, `zLevel`, `paneId`, `mode`, `modeSensitivity`. Bỏ qua `id`, `currentStep`, `totalStep` (runtime state), event callbacks (`onDrawEnd`, `onSelected`, ...).

`points` là `Array<Partial<Point>>` với `{ timestamp, dataIndex, value }` — serializable.

## Risks

| Risk | Mitigation |
|---|---|
| `styles` field có thể chứa function/callback không serializable | `styles` là `DeepPartial<OverlayStyle>` — plain objects, JSON-safe |
| Overlay events (`onDrawEnd`) bị mất sau restore | Các callbacks được set trong `createMarketChartDrawingOverlay` — không save/restore được, nhưng drawing vẫn hiển thị đúng. User có thể tương tác (select, drag) bình thường |
