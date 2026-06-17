## Why

Khi toggle theme (light/dark), chart bị kéo về đầu (latest data), mất scroll position hiện tại. Nguyên nhân là `chart.setStyles(newPalette)` trong effect theme gây reset viewport. Ngoài ra, `candles` effect có thể fire sai do reference thay đổi khi parent re-render, gọi `chart.resetData()` không cần thiết.

## What Changes

- **Theme effect** hiện tại: save range → `setStyles` → `scrollToTimestamp(range.to, 0)` chưa đủ vì `setStyles` reset viewport async
- **Fix:** Defer scroll restore sau `setStyles` bằng `requestAnimationFrame` để đảm bảo klinecharts đã re-render xong mới restore
- **Stabilize `candles` effect:** Chỉ gọi `chart.resetData()` khi `candles` thực sự thay đổi (deep compare hoặc dùng `dataVersion` counter) — tránh fire do reference thay đổi
- **Thêm `dataVersion` prop** hoặc counter để kiểm soát khi nào cần reset data

## Capabilities

### New Capabilities
- `chart-theme-scroll-preservation`: Chart scroll position được bảo toàn khi toggle theme

### Modified Capabilities
*Không có* — `market-chart-klinechart-engine` spec không thay đổi requirement

## Impact

- **`app/[lang]/(main)/market-charts/market-chart-canvas.tsx`** — Theme effect: defer scroll restore; candle effect: deep compare guard hoặc dataVersion; thêm `dataVersion` prop
- **`app/[lang]/(main)/market-charts/market-chart-workbench.tsx`** — Có thể cần pass `dataVersion` xuống canvas
