## 1. Live Candle Derivation

- [x] 1.1 Update the live candle derivation helper so an eligible quote can update an existing live candle bucket without regressing older candles.
- [x] 1.2 Add a focused deterministic check for quote updates after a real candle event, stale quote ignore behavior, and newer quote bucket creation.

## 2. Workbench Wiring

- [x] 2.1 Update market chart workbench live candle selection to derive the displayed live candle from historical candles, the latest live candle event, and the latest quote.
- [x] 2.2 Confirm the canvas still receives a single `liveCandle` prop and no backend SSE contract changes are required.

## 3. Verification

- [x] 3.1 Run `openspec.cmd validate fix-market-chart-live-candle-gap`.
- [ ] 3.2 Run `pnpm.cmd typecheck`.
- [x] 3.3 Run `pnpm.cmd lint`.
- [x] 3.4 Review the final diff for unrelated UI, API, or dependency changes.
