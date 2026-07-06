## 1. Contract Mapping

- [x] 1.1 Extend market chart annotation TypeScript types with `annotationType`, warm identifiers, `periodStart`, `periodEnd`, and top-level `outcome`.
- [x] 1.2 Extend the annotation Zod schema so the new backend fields are preserved instead of stripped.

## 2. Warm Band Data

- [x] 2.1 Derive warm annotation bands from `WARM_EVENT` and `WARM_EPISODE` annotations with valid `periodStart` and `periodEnd`.
- [x] 2.2 Keep `HOT_EVENT` and unknown/missing annotation types on the existing point marker grouping path.
- [x] 2.3 Omit invalid or unmappable warm periods without affecting valid markers and bands.

## 3. Chart Rendering And Selection

- [x] 3.1 Render warm bands as low-opacity HTML overlays clamped to the candle pane and hidden when the annotation layer is disabled.
- [x] 3.2 Keep warm bands aligned when the chart scrolls, zooms, resizes, loads older candles, or changes visible range.
- [x] 3.3 Let users select a warm band and open the existing annotation popup or responsive fallback.
- [x] 3.4 Ensure warm bands are not treated as persisted drawing overlays or drawing selections.

## 4. Popup Outcome

- [x] 4.1 Use `topMarketReaction.outcome` first and top-level `annotation.outcome` as the fallback for annotation popup outcome preview.
- [x] 4.2 Omit outcome preview placeholders when neither outcome source exists.

## 5. Verification

- [x] 5.1 Run `openspec.cmd validate show-market-chart-warm-annotation-layer --strict`.
- [x] 5.2 Run `pnpm.cmd typecheck`.
