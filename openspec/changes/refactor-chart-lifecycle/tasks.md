## 1. Mount/unmount effect — init chart once

- [x] 1.1 Tách `useEffect` init/dispose hiện tại thành mount effect riêng với `deps: []`
- [x] 1.2 Move `registerMarketChartDrawingOverlays()` vào mount effect (gọi 1 lần)
- [x] 1.3 `init()` + `setOffsetRightDistance()`, `setLeftMinVisibleBarCount()`, `setRightMinVisibleBarCount()` + subscribeAction + resizeObserver trong mount effect
- [x] 1.4 Giữ nguyên cleanup: `dispose(chart)`, unsubscribe, disconnect observer, clear refs
- [x] 1.5 Xoá `disposed` flag — không cần vì effect chạy 1 lần

## 2. Sync effect — props → chart instance methods

- [x] 2.1 Tạo effect với deps `[assetId, chartThemePalette, includeAnnotations, intlLocale, showVolumePane, symbol, timeframe]` (KHÔNG có `resetKey`)
- [x] 2.2 Trong sync effect: `setLocale()`, `setStyles()`, `setSymbol()`, `setPeriod()`
- [x] 2.3 Re-create DataLoader khi assetId/timeframe/includeAnnotations thay đổi
- [x] 2.4 Sync `drawingGroupIdRef.current` từ `assetId` + `timeframe` mới
- [x] 2.5 Sync refs: `loadedCandlesRef`, `loadedAnnotationsRef`, `candlesRef`
- [x] 2.6 Handle `showVolumePane` qua `createIndicator("VOL")` / `removeIndicator`

## 3. Xoá resetKey/chartResetNonce khỏi workbench

- [x] 3.1 Xoá `const [chartResetNonce, setChartResetNonce]` state trong `MarketChartWorkbench`
- [x] 3.2 Xoá `const chartResetKey = [...]` computed value
- [x] 3.3 Xoá `setChartResetNonce((c) => c + 1)` trong `loadCandles` success handler
- [x] 3.4 Xoá prop `chartResetKey` khỏi `ChartSurface` interface và JSX + effect
- [x] 3.5 Xoá prop `resetKey` khỏi `MarketChartCanvas` interface và JSX

## 4. Xoá resetKey khỏi lazy-history guard

- [x] 4.1 Xoá `activeResetKeyRef` — thay bằng `chartLoadIdRef` + `chartLoadId` state
- [x] 4.2 `historyFeedback.resetKey` → `loadId`, so sánh với `chartLoadId` (state, không ref)
- [x] 4.3 `liveCandleSubscriberResetKeyRef` → `liveCandleSubscriberLoadIdRef` (number)
- [x] 4.4 `LazyHistoryFeedback.resetKey` → `loadId: number`

## 5. Cleanup — xoá code không còn dùng

- [x] 5.1 Xoá `chartResetKey` effect + `resetDrawingStateForChartChange()` function
- [x] 5.2 `clearDrawings()` trên handle giữ nguyên (tương thích ngược)
- [x] 5.3 `dispose` import giữ nguyên (vẫn dùng trong mount cleanup)
- [x] 5.4 Xoá unused import `LayoutChild`

## 6. Verification

- [x] 6.1 `pnpm typecheck` — không lỗi TypeScript
- [x] 6.2 `pnpm lint` — 0 errors, 27 warnings (pre-existing)
- [ ] 6.3 Kiểm tra chart init khi mount (1 lần)
- [ ] 6.4 Kiểm tra prop changes không dispose chart (timeframe, asset, theme, volume pane, locale)
- [ ] 6.5 Kiểm tra drawings sống sót qua timeframe switch
- [ ] 6.6 Kiểm tra drawings sống sót qua theme toggle
- [ ] 6.7 Kiểm tra lazy-history loading vẫn hoạt động (scroll older candles)

> **User-owned manual QA:** 6.3–6.7 cần smoke test browser để verify chart init, drawings persistence, và lazy history flow.
