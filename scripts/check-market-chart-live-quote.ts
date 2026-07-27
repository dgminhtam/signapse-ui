import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"

const { deriveLiveCandleItemFromQuote } = await import(
  "../app/[lang]/(main)/market-charts/market-chart-candle-helpers" + ".ts"
)

const latestCandle = {
  open: 100,
  high: 110,
  low: 95,
  close: 105,
  time: "2026-06-25T10:00:00.000Z",
  volume: 1000,
}

assert.deepEqual(
  deriveLiveCandleItemFromQuote({
    current: [latestCandle],
    quote: {
      price: 112,
      providerTime: "2026-06-25T10:30:00.000Z",
      receivedAt: "2026-06-25T10:30:01.000Z",
    },
    timeframe: "1h",
  }),
  {
    open: 100,
    high: 112,
    low: 95,
    close: 112,
    time: "2026-06-25T10:00:00.000Z",
    volume: 1000,
  }
)

assert.deepEqual(
  deriveLiveCandleItemFromQuote({
    current: [{ ...latestCandle, high: 112, close: 112 }],
    quote: {
      price: 108,
      providerTime: "2026-06-25T10:45:00.000Z",
      receivedAt: "2026-06-25T10:45:01.000Z",
    },
    timeframe: "1h",
  }),
  {
    open: 100,
    high: 112,
    low: 95,
    close: 108,
    time: "2026-06-25T10:00:00.000Z",
    volume: 1000,
  }
)

assert.deepEqual(
  deriveLiveCandleItemFromQuote({
    current: [latestCandle],
    quote: {
      price: 90,
      providerTime: "2026-06-25T10:30:00.000Z",
      receivedAt: "2026-06-25T10:30:01.000Z",
    },
    timeframe: "1h",
  }),
  {
    open: 100,
    high: 110,
    low: 90,
    close: 90,
    time: "2026-06-25T10:00:00.000Z",
    volume: 1000,
  }
)

assert.equal(
  deriveLiveCandleItemFromQuote({
    current: [latestCandle],
    quote: {
      price: 90,
      providerTime: "2026-06-25T09:59:59.000Z",
      receivedAt: "2026-06-25T10:00:00.000Z",
    },
    timeframe: "1h",
  }),
  null
)

assert.deepEqual(
  deriveLiveCandleItemFromQuote({
    current: [latestCandle],
    quote: {
      price: 120,
      providerTime: "2026-06-25T11:00:00.000Z",
      receivedAt: "2026-06-25T11:00:01.000Z",
    },
    timeframe: "1h",
  }),
  {
    open: 120,
    high: 120,
    low: 120,
    close: 120,
    time: "2026-06-25T11:00:00.000Z",
  }
)

const workbenchSource = await readFile(
  new URL(
    "../app/[lang]/(main)/market-charts/market-chart-workbench.tsx",
    import.meta.url
  ),
  "utf8"
)

assert.match(
  workbenchSource,
  /status: null,\s+transportState: value\.stale \? "STALE" : "CONNECTED"/
)
assert.match(workbenchSource, /status: quoteConfirmsLive \? null : value\.status/)
assert.match(workbenchSource, /onCandle\(value\)[\s\S]*?candle: value,/)

console.log("Market chart live quote checks passed")
