## 1. Theme effect — defer scroll restore

- [x] 1.1 Wrap `chart.scrollToTimestamp()` bằng `requestAnimationFrame` — defer sau klinecharts re-render
- [x] 1.2 Giữ guard `prevThemeRef` để tránh duplicate

## 2. Thêm dataVersion guard cho candles effect

- [x] 2.1 Thêm prop `dataVersion: number` vào `MarketChartCanvasProps`
- [x] 2.2 Thêm state `const [dataVersion, setDataVersion] = useState(0)` trong `MarketChartWorkbench`
- [x] 2.3 Thêm `setDataVersion((v) => v + 1)` trong `loadCandles` success handler
- [x] 2.4 Pass `dataVersion={dataVersion}` qua ChartSurface → MarketChartCanvas
- [x] 2.5 Destructure `dataVersion` trong canvas; `candles` effect dep = `[dataVersion]`; tách `candlesRef` sync riêng
- [x] 2.6 Guard `if (dataVersion > 0) chart.resetData()` — không reset lúc mount

## 3. Cleanup — bỏ includeAnnotations khỏi data source effect

- [x] 3.1 Deps `[assetId, includeAnnotations, timeframe]` → `[assetId, timeframe]`
- [ ] 3.2 Verify annotation toggle vẫn hoạt động (user-owned)

## 4. Verification

- [x] 4.1 `pnpm typecheck` — không lỗi TypeScript
- [x] 4.2 `pnpm lint` — 0 errors, 28 warnings (pre-existing)
- [ ] 4.3 Test theme toggle không kéo scroll về đầu
- [ ] 4.4 Test timeframe change vẫn reset data + scroll về cuối
- [ ] 4.5 Test asset change vẫn reset data + scroll về cuối
- [ ] 4.6 Test annotation toggle vẫn load data mới

> **User-owned manual QA:** 3.2 & 4.3–4.6 cần smoke test browser để verify.
