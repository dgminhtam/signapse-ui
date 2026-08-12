import assert from "node:assert/strict"

Object.defineProperty(globalThis, "window", {
  value: { navigator: { userAgent: "" } },
})

const { calculateAtr } = await import(
  "../app/[lang]/(main)/market-charts/market-chart-atr" + ".ts"
)

const flatCandles = Array.from({ length: 14 }, () => ({
  close: 100,
  high: 100,
  low: 100,
}))
const flatAtr = calculateAtr(flatCandles)

assert.deepEqual(
  flatAtr.slice(0, 13),
  Array.from({ length: 13 }, () => ({}))
)
assert.equal(flatAtr[13]?.atr, 0)

const gapAtr = calculateAtr(
  [
    { close: 100, high: 101, low: 99 },
    { close: 110, high: 112, low: 109 },
  ],
  1
)

assert.equal(gapAtr[1]?.atr, 12)

const risingCandles = Array.from({ length: 15 }, (_, index) => ({
  close: index + 1,
  high: index + 2,
  low: index,
}))
const risingAtr = calculateAtr(risingCandles)

assert.equal(risingAtr[13]?.atr, 2)
assert.equal(risingAtr[14]?.atr, 2)

console.log("Market chart ATR checks passed")
