## Why

The annotation API now returns warm-layer annotations with `annotationType`, `periodStart`, `periodEnd`, and optional top-level `outcome`, but the current frontend only renders point markers from `time`. Users cannot see multi-candle warm episodes on the chart even when the backend provides the period contract.

## What Changes

- Extend the frontend annotation contract mapping to preserve warm annotation fields from `GET /market-charts/annotations`.
- Render `WARM_EVENT` and `WARM_EPISODE` annotations as translucent, non-interactive time-range bands on the candle pane when the annotation layer is enabled.
- Keep `HOT_EVENT` annotations as the existing point marker/group behavior.
- Allow selecting a warm band to inspect the same annotation popup/detail preview used by point annotations.
- Show reaction/outcome preview from `topMarketReaction.outcome` when available, with top-level `annotation.outcome` as the warm annotation fallback.
- Omit warm bands with invalid or unmappable period ranges without crashing.

## Capabilities

### New Capabilities

### Modified Capabilities
- `market-chart-annotation-markers`: Annotation layer renders backend warm annotations as chart time-range bands alongside existing point markers.
- `market-chart-annotation-popup-surface`: Annotation popup can show a warm annotation outcome from the top-level annotation outcome when no primary market reaction exists.

## Impact

- Affected code: market chart annotation definitions/schema, annotation grouping/derivation helpers, chart canvas overlay rendering, workbench popup/detail rendering, and market chart i18n copy if warm type labels are surfaced.
- API contract: aligns frontend Zod mapping with `docs/api_mapping.json` for `annotationType`, warm identifiers, `periodStart`, `periodEnd`, and top-level `outcome`.
- Dependencies: none.
