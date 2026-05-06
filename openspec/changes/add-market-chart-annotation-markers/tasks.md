## 1. Data Flow

- [x] 1.1 Add annotation layer state to the market chart workbench without changing the existing `assetId` and `timeframe` URL model.
- [x] 1.2 Update the chart request builder so it sends `includeAnnotations=true` only when the annotation layer is enabled.
- [x] 1.3 Preserve current rolling latest `from/to` behavior and watchlist-only asset selection.
- [x] 1.4 Keep response parsing tolerant of optional or nullable annotation fields already described by the backend contract.

## 2. Marker Mapping

- [x] 2.1 Create a local annotation marker mapping utility for direction, marker position, marker shape, color, and compact marker text.
- [x] 2.2 Normalize annotation times with the same chart time conversion used for candles.
- [x] 2.3 Omit invalid or out-of-range annotations from marker rendering without failing the chart.
- [x] 2.4 Group annotations that share the same chart time and expose the grouped contents for detail inspection.

## 3. Chart Canvas

- [x] 3.1 Extend the market chart canvas props to accept annotation marker view models and selection callbacks.
- [x] 3.2 Render chart notification markers on the candlestick chart when annotations are enabled.
- [x] 3.3 Clean up marker primitives together with the chart lifecycle to avoid stale markers during asset/timeframe/layer changes.
- [x] 3.4 Keep marker labels compact and avoid long annotation text inside the canvas.

## 4. Annotation UI

- [x] 4.1 Add a compact annotation layer control to the existing chart toolbar.
- [x] 4.2 Add a selected annotation detail surface for desktop that shows useful fields only when available.
- [x] 4.3 Add responsive behavior for narrow screens using an existing suitable primitive such as `Sheet` or a below-chart detail region.
- [x] 4.4 Provide keyboard-accessible annotation rows or controls outside the canvas so marker details are not hover-only.
- [x] 4.5 Add concise Vietnamese loading and empty states for enabled annotations without rendering fake markers or future-feature placeholders.

## 5. Documentation

- [x] 5.1 Update `docs/APIMAPPING.md` to state that annotation rendering is implemented behind the annotation layer control.
- [x] 5.2 Document that `includeAnnotations=false` remains the disabled-layer behavior and `includeAnnotations=true` is used only when the user enables the layer.

## 6. Verification

- [x] 6.1 Run targeted lint for `app/(main)/market-charts`, `app/lib/market-charts`, and `app/api/market-charts/action.ts`.
- [x] 6.2 Run `pnpm typecheck`.
- [x] 6.3 Run `pnpm build`.
- [ ] 6.4 Smoke test `/market-charts` with annotations disabled, annotations enabled with returned markers, enabled with empty `annotations[]`, and at least one invalid/out-of-range annotation case if a fixture or backend response is available.
  - Blocked locally: no authenticated Clerk browser session, backend chart response, or market chart fixture is available in the repo to exercise returned/empty/invalid annotation runtime states.
- [x] 6.5 Verify responsive annotation detail behavior and keyboard access to annotation rows or controls.
  - Verification: annotation detail lives in the existing responsive right rail, which stacks below the chart on narrow screens; annotation rows are native buttons with focus ring and `aria-pressed`.
