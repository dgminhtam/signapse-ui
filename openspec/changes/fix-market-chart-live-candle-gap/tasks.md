## 1. Quote Close Derivation

- [x] 1.1 Update the live candle derivation helper so an eligible same-bucket quote copies the latest REST candle and changes only `close`.
- [x] 1.2 Ensure older-bucket and newer-bucket quotes return no rendered candle update.
- [x] 1.3 Add a focused deterministic check for close-only updates, high/low preservation, stale quote ignore behavior, and newer bucket ignore behavior.

## 2. Workbench Wiring

- [x] 2.1 Update market chart workbench live candle selection to derive the displayed candle from REST-loaded candles and the latest quote only.
- [x] 2.2 Stop using `candle` events and `snapshot.candle` payloads for rendered candle state while preserving SSE status, quote, and error handling.
- [x] 2.3 Confirm the canvas still receives a single `liveCandle` prop and no backend SSE contract changes are required.

## 3. Verification

- [x] 3.1 Run `openspec.cmd validate fix-market-chart-live-candle-gap`.
- [x] 3.2 Run `pnpm.cmd typecheck`.
- [x] 3.3 Run `pnpm.cmd lint`.
- [x] 3.4 Review the final diff for unrelated UI, API, or dependency changes.
