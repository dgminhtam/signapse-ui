## Context

Hiện tại theme toggle trigger effect gọi `chart.setStyles()`. klinecharts xử lý style change async — viewport bị reset trước khi `scrollToTimestamp` kịp restore. Thêm vào đó, `candles` effect gọi `chart.resetData()` trên mọi re-render nếu `candles` array reference thay đổi (do `data?.candles ?? []` tạo array mới mỗi lần render dù nội dung giống nhau).

## Goals / Non-Goals

**Goals:**
- Theme light/dark toggle giữ nguyên scroll position
- `candles` effect không fire resetData khi `candles` data không thay đổi nội dung
- Timeframe change vẫn reset data và scroll về cuối (expected behavior)
- Asset change vẫn reset data (expected behavior)

**Non-Goals:**
- Không thay đổi klinecharts lifecycle (mount/sync effects đã ổn)
- Không ảnh hưởng lazy-history loading

## Decisions

### Decision 1: Defer scroll restore sau setStyles bằng requestAnimationFrame

```tsx
const range = chart.getVisibleRange()
chart.setStyles(createChartStyles(chartThemePalette))
requestAnimationFrame(() => {
  if (chartRef.current && range) {
    chartRef.current.scrollToTimestamp(range.to, 100)
  }
})
```

`requestAnimationFrame` đảm bảo klinecharts đã hoàn tất async re-render sau `setStyles` trước khi scroll restore. Thêm `100ms` animation để mượt hơn.

### Decision 2: Dùng dataVersion (+ counter) thay vì candles reference để kiểm soát resetData

Hiện tại `candles` effect:
```tsx
useEffect(() => {
    candlesRef.current = candles
    loadedCandlesRef.current = normalizeCandleItems(candles)
    if (chart) chart.resetData()
}, [candles])
```

`data?.candles ?? []` tạo array mới mỗi render → effect fire liên tục. Fix: dùng `dataVersion` prop (number, workbench increment khi load data mới) làm dep thay vì `candles`:

```tsx
useEffect(() => {
    candlesRef.current = candles
    loadedCandlesRef.current = normalizeCandleItems(candles)
    if (chart && dataVersion > 0) chart.resetData()
}, [dataVersion]) // dataVersion chỉ thay đổi khi workbench load data mới
```

Workbench pass `dataVersion` xuống canvas — increment trong `loadCandles` success handler (thay chỗ `setChartResetNonce` cũ).

### Decision 3: Bỏ `includeAnnotations` khỏi data source effect deps

`includeAnnotations` thay đổi không cần reset DataLoader — chỉ cần re-fetch data với flag khác (workbench đã handle qua `loadCandles`). Việc reset DataLoader gây mất scroll không cần thiết. Bỏ dep này, data source effect chỉ còn `[assetId, timeframe]`.

## Risks / Trade-offs

| Risk | Mitigation |
|---|---|
| `requestAnimationFrame` có thể không chạy nếu tab bị inactive | `scrollToTimestamp` với `range` cũ vẫn correct — khi tab active lại, scroll đúng vị trí |
| `dataVersion` không khớp với `candles` thực tế (race) | `dataVersion` increment trong cùng callback với `setData` + `setPhase` — React batch, render 1 lần |
| Bỏ `includeAnnotations` khỏi data source effect có thể làm annotation data không sync | `loadedAnnotationsRef` được update trong `candles` effect (đã sửa), annotation sync vẫn hoạt động |
