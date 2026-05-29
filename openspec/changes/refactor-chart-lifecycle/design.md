## Context

Hiện tại `MarketChartCanvas` dùng 1 `useEffect` lớn với dependencies: `[assetId, chartThemePalette, includeAnnotations, resetKey, showVolumePane, symbol, timeframe, intlLocale]`. Effect này gọi `init()` ở body và `dispose()` ở cleanup — nghĩa là bất kỳ prop nào thay đổi cũng destroy + recreate chart instance, xoá sạch drawings.

klinecharts `Chart` interface kế thừa `Store`, cung cấp đầy đủ instance methods để cập nhật từng thuộc tính riêng lẻ mà không cần dispose:

| Method | Thay thế cho prop change |
|---|---|
| `chart.setStyles(theme)` | `chartThemePalette` |
| `chart.setLocale(locale)` | `intlLocale` |
| `chart.setSymbol({ pricePrecision, volumePrecision })` | `symbol` / `assetId` |
| `chart.setPeriod(period)` | `timeframe` |
| `chart.setPaneOptions({ layout })` | `showVolumePane` |
| `chart.setDataLoader(loader)` | `resetKey` / data refresh |
| `chart.resetData()` | Trigger data reload |

## Goals / Non-Goals

**Goals:**
- Chart instance chỉ init 1 lần khi mount, dispose khi unmount
- Props change → gọi instance method tương ứng, không dispose
- Drawings sống sót qua mọi prop change (timeframe, asset, theme, v.v.)
- Xoá `chartResetNonce` / `resetKey` — không còn cơ chế force re-init
- Xoá code chết (`clearDrawings`, `chartResetNonce` flow)

**Non-Goals:**
- Không thay đổi data fetching flow (`loadCandles`, DataLoader pattern)
- Không thay đổi drawing toolbar UX hay API
- Không thay đổi annotation rendering
- Không thêm dependency mới

## Decisions

### Decision 1: Tách lifecycle effect thành 2

```
Before:
  useEffect(() => {
    const chart = init(container, { layout, locale, ... })
    chart.setDataLoader(...)
    chart.setPeriod(...)
    chart.setStyles(...)
    ...
    return () => { dispose(chart) }
  }, [assetId, timeframe, ...7+ deps])

After:
  useEffect(() => {               ← mount/unmount
    const chart = init(container, { layout, locale, ... })
    return () => { dispose(chart) }
  }, [])                           ← empty deps, 1 lần

  useEffect(() => {               ← sync props → chart
    const chart = chartRef.current
    if (!chart) return
    chart.setLocale(intlLocale)
    chart.setStyles(chartThemePalette)
    chart.setSymbol(...)
    chart.setPeriod(timeframe)
    chart.setPaneOptions(...)
    chart.setDataLoader(...)
  }, [assetId, timeframe, symbol, intlLocale, chartThemePalette, showVolumePane, includeAnnotations])
```

**Rationale:** Empty deps effect đảm bảo `init`/`dispose` chỉ chạy đúng 1 lần. Sync effect gọi instance methods — không dispose, không mất drawings.

### Decision 2: DataLoader được re-create mỗi khi asset/timeframe/includeAnnotations thay đổi

DataLoader cần đóng (closure) `loadedCandlesRef.current` để `getBars("init")` trả đúng data. Khi `assetId` hoặc `timeframe` thay đổi:
1. `loadCandles()` fetch data mới → `setLoadedData(result)`
2. React re-render → `loadedCandlesRef.current` sync
3. Sync effect chạy → `chart.setDataLoader(newLoader)` → klinecharts gọi `getBars("init")` với data mới

### Decision 3: Data refresh không cần `resetKey` / `chartResetNonce`

Trước đây `resetKey` thay đổi để force effect re-run. Với lifecycle mới, data refresh xảy ra qua:
1. `loadCandles()` fetch data
2. `setLoadedData(data)` → ref sync
3. (không cần set nonce — chart instance tồn tại, DataLoader trả data mới)

`resetKey` và `chartResetNonce` bị xoá hoàn toàn.

### Decision 4: `clearDrawings()` không còn cần thiết trên handle

Trước đây `clearDrawings()` gọi `chart.removeOverlay({ groupId })` — nhưng method này không được dùng ở đâu (không có UI button "clear all drawings"). Giữ lại nhưng không cần thiết cho lifecycle mới. *Không xoá để tránh breaking change trên handle interface.*

### Decision 5: `showVolumePane` dùng `setPaneOptions`

klinecharts `Chart.setPaneOptions` cho phép thay đổi layout child (thêm/xoá pane volume) mà không cần init lại. Volume pane options được tính từ `showVolumePane` và truyền vào `setPaneOptions`.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| **`init()` với layout tĩnh (empty deps)** — `showVolumePane` ảnh hưởng layout lúc init, nếu init với volume=false sau đó set true thì `setPaneOptions` có handle được không? | Test kỹ: gọi `setPaneOptions({ children: [ { id: CANDLE_PANE_ID }, { id: VOLUME_PANE_ID } ] })` để thêm volume pane sau init |
| **Timing: sync effect chạy trước khi data load xong** — `setPeriod` + `setDataLoader` gọi `getBars("init")` nhưng `loadedCandlesRef` chưa kịp update | `setDataLoader` chỉ set loader, không gọi getBars ngay. `getBars` chỉ được gọi khi chart cần data. Đảm bảo `loadedCandlesRef.current` sync xong trước khi chart request |
| **`chartThemePalette` mapping** — hiện tại theme palette được tính trong init callback `() => useMarketChartPalette(timeframe)`. Với sync effect, cần convert palette → `DeepPartial<Styles>` | Hàm `themePaletteToStyles()` mapping palette object → klinecharts styles |
| **Chart không reset được nếu có lỗi** — trước đây force re-init bằng cách increment nonce | `chart.resetData()` + `setDataLoader()` vẫn handle được. Nếu cần force, set `key={resetKey}` trên div container để React unmount/mount lại component |
