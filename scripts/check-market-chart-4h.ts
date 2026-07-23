import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

globalThis.window = {
  navigator: { userAgent: "" },
} as typeof globalThis.window

const { isMarketChartTimeframe } = await import(
  "../app/lib/market-charts/definitions" + ".ts"
)
const { deriveLiveCandleItemFromQuote } = await import(
  "../app/[lang]/(main)/market-charts/market-chart-candle-helpers" + ".ts"
)
const { createKLinePeriod } = await import(
  "../app/[lang]/(main)/market-charts/market-chart-period" + ".ts"
)

assert.equal(isMarketChartTimeframe("4h"), true)
assert.deepEqual(createKLinePeriod("4h"), { type: "hour", span: 4 })

const latestCandle = {
  open: 100,
  high: 110,
  low: 95,
  close: 105,
  time: "2026-07-23T08:00:00.000Z",
  volume: 1000,
}

assert.deepEqual(
  deriveLiveCandleItemFromQuote({
    current: [latestCandle],
    quote: {
      price: 108,
      providerTime: "2026-07-23T11:59:59.000Z",
      receivedAt: "2026-07-23T11:59:59.000Z",
    },
    timeframe: "4h",
  }),
  { ...latestCandle, close: 108 }
)

assert.equal(
  deriveLiveCandleItemFromQuote({
    current: [latestCandle],
    quote: {
      price: 108,
      providerTime: "2026-07-23T12:00:00.000Z",
      receivedAt: "2026-07-23T12:00:00.000Z",
    },
    timeframe: "4h",
  }),
  null
)

const historySource = await readFile(
  new URL(
    "../app/[lang]/(main)/market-charts/market-chart-history-helpers.ts",
    import.meta.url
  ),
  "utf8"
)

assert.match(historySource, /"4h": 4 \* HOUR_MS,/)
assert.match(historySource, /"4h": 14,/)

console.log("Market chart 4h checks passed")
