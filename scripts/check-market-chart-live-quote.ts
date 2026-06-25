import assert from "node:assert/strict"

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
    liveCandle: {
      open: 105,
      high: 108,
      low: 101,
      close: 104,
      time: "2026-06-25T11:00:00.000Z",
    },
    quote: {
      price: 112,
      providerTime: "2026-06-25T11:30:00.000Z",
      receivedAt: "2026-06-25T11:30:01.000Z",
    },
    timeframe: "1h",
  }),
  {
    open: 105,
    high: 112,
    low: 101,
    close: 112,
    time: "2026-06-25T11:00:00.000Z",
  }
)

assert.equal(
  deriveLiveCandleItemFromQuote({
    current: [latestCandle],
    liveCandle: {
      open: 105,
      high: 108,
      low: 101,
      close: 104,
      time: "2026-06-25T11:00:00.000Z",
    },
    quote: {
      price: 99,
      providerTime: "2026-06-25T10:30:00.000Z",
      receivedAt: "2026-06-25T10:30:01.000Z",
    },
    timeframe: "1h",
  }),
  null
)

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
      volume: 25,
    },
    timeframe: "1h",
  }),
  {
    open: 120,
    high: 120,
    low: 120,
    close: 120,
    time: "2026-06-25T11:00:00.000Z",
    volume: 25,
  }
)

console.log("Market chart live quote checks passed")
