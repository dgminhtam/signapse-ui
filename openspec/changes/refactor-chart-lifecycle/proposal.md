## Why

Khi switch timeframe, đổi asset, toggle volume pane, hoặc theme change, `MarketChartCanvas` hiện tại `dispose()` + `init()` lại toàn bộ klinecharts instance — xoá sạch drawings trong memory. klinecharts có đầy đủ instance methods (`setPeriod`, `setPaneOptions`, `setStyles`, `setLocale`, `setSymbol`, `setDataLoader`) để cập nhật từng thuộc tính mà không cần destroy chart. Giữ drawings nguyên vẹn qua các lần switch, giảm re-render và tái tính toán không cần thiết.

## What Changes

- **Tách** `useEffect` lifecycle hiện tại thành 2 effects riêng biệt:
  1. **Mount/unmount effect** — `init()` 1 lần, `dispose()` khi unmount
  2. **Sync effect** — đồng bộ props → chart instance methods (`setPeriod`, `setPaneOptions`, `setStyles`, `setLocale`, `setSymbol`, `setDataLoader`)
- **Xoá** `resetKey` và `chartResetNonce` — không còn cơ chế force re-init chart
- **Xoá** `clearDrawings()` trên handle — klinecharts instance không còn bị dispose nên không cần clear drawings thủ công. Nếu vẫn cần clear, `chart.removeOverlay({ groupId })` đã có sẵn
- **Không thay đổi** API endpoints, backend contract, domain types, annotation rendering, drawing toolbar UX

## Capabilities

### New Capabilities
*Không có* — đây là thay đổi implementation, không giới thiệu capability mới.

### Modified Capabilities
*Không có* — `market-chart-klinechart-engine` spec vẫn giữ nguyên requirement (chart vẫn render data, states vẫn available).

## Impact

- **`app/[lang]/(main)/market-charts/market-chart-canvas.tsx`** — Refactor chính: lifecycle, xoá `resetKey`, `chartResetNonce`, clearDrawings
- **`app/[lang]/(main)/market-charts/market-chart-workbench.tsx`** — Xoá `chartResetNonce`, xoá `chartResetKey`, đơn giản hoá `loadCandles` flow (không cần set nonce)
- **Không ảnh hưởng** API, backend, dependencies, i18n
