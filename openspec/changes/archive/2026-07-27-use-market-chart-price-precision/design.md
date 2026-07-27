## Context

The backend stores `Asset.pricePrecision` as a nullable `Integer` and exposes it through asset list/detail responses, historical candle `asset` metadata, and the live SSE snapshot `asset`. The frontend market-chart schema currently drops this field, while `MarketChartCanvas` always configures KLineChart with `pricePrecision: 4`.

The chart opens its live stream only after the historical candle request succeeds. Historical candle metadata can therefore remain the single rendering source without duplicating live snapshot asset state.

## Goals / Non-Goals

**Goals:**

- Reflect the nullable backend precision contract in frontend asset and market-chart types.
- Validate market-chart precision at the existing Zod response boundary.
- Configure KLineChart with the loaded asset's precision and refresh the symbol configuration when it changes.
- Preserve current rendering when precision metadata is absent.

**Non-Goals:**

- Add or infer `assetPricePrecision` on watchlist responses.
- Derive precision from JSON number text, candle values, asset type, or symbol naming.
- Add tick-size support, new chart configuration abstractions, or new dependencies.
- Store duplicate asset metadata in live runtime state.

## Decisions

### Use candle asset metadata as the rendering source

`MarketChartCandleResponse.asset.pricePrecision` will flow through the workbench to the canvas. This request already gates successful chart rendering and is authoritative for the selected asset.

Alternative considered: use watchlist metadata before candles load. The current backend and OpenAPI watchlist contracts do not expose that field, and the canvas is hidden until candle data succeeds, so the extra contract is unnecessary.

### Reuse the shared market-chart asset schema

`MarketChartAssetResponse` and `marketChartAssetResponseSchema` will accept a non-negative integer or `null`/absence. Because both historical candles and SSE snapshots compose this schema, one contract edit covers both paths without a second live-only parser.

Alternative considered: add precision to each candle, quote, or live event. That repeats immutable asset metadata and is not part of the backend contract.

### Keep the existing value as the nullable fallback

The canvas will use `pricePrecision ?? 4`. Four preserves current behavior for legacy or incomplete asset records while configured assets such as XAU/USD use the backend value of two.

Alternative considered: infer decimal places from candle values. JSON numbers do not preserve trailing-zero scale, so inference cannot distinguish values such as `2350.1` from `2350.10`.

### Update KLineChart in the existing symbol effect

The canvas will receive `pricePrecision` as a prop and include it with `symbol` in the existing `setSymbol()` effect dependencies. No new resolver, context, or chart lifecycle abstraction is needed.

## Risks / Trade-offs

- [Backend returns `null` for an asset] → Use the existing four-decimal fallback without blocking chart rendering.
- [Backend returns a negative or fractional precision] → Reject the market-chart response at the existing Zod trust boundary.
- [Precision arrives after the canvas initially mounts] → Depend on `pricePrecision` in the symbol effect so KLineChart is reconfigured when candle data becomes available.
- [SSE snapshot precision differs from candle metadata] → Continue using candle metadata for the current live-after-history flow; investigate backend inconsistency rather than adding competing client state.
