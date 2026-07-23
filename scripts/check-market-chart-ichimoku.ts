import assert from "node:assert/strict"

Object.defineProperty(globalThis, "window", {
  value: { navigator: { userAgent: "" } },
})

const { calculateIchimoku, createIchimokuCloudPolygons } = await import(
  "../app/[lang]/(main)/market-charts/market-chart-ichimoku" + ".ts"
)

assert.deepEqual(calculateIchimoku([]), [])

const flatCandles = Array.from({ length: 78 }, () => ({
  close: 100,
  high: 100,
  low: 100,
}))
const flat = calculateIchimoku(flatCandles)

assert.equal(flat[7]?.tenkan, undefined)
assert.equal(flat[8]?.tenkan, 100)
assert.equal(flat[24]?.kijun, undefined)
assert.equal(flat[25]?.kijun, 100)
assert.equal(flat[50]?.senkouA, undefined)
assert.equal(flat[51]?.senkouA, 100)
assert.equal(flat[76]?.senkouB, undefined)
assert.equal(flat[77]?.senkouB, 100)
assert.equal(flat[0]?.chikou, 100)
assert.equal(flat[77]?.chikou, undefined)

const risingCandles = Array.from({ length: 52 }, (_, index) => ({
  close: index + 5,
  high: index + 10,
  low: index,
}))
const rising = calculateIchimoku(risingCandles)

assert.equal(rising[8]?.tenkan, 9)
assert.equal(rising[25]?.tenkan, 26)
assert.equal(rising[25]?.kijun, 17.5)
assert.equal(rising[51]?.senkouA, 21.75)
assert.equal(rising[77]?.senkouB, 30.5)
assert.equal(rising[0]?.chikou, 31)

const sameOrder = createIchimokuCloudPolygons(
  { dataIndex: 0, spanA: 10, spanB: 5 },
  { dataIndex: 1, spanA: 12, spanB: 6 }
)
assert.equal(sameOrder.length, 1)
assert.equal(sameOrder[0]?.tone, "bullish")
assert.equal(sameOrder[0]?.points.length, 4)

const crossing = createIchimokuCloudPolygons(
  { dataIndex: 0, spanA: 10, spanB: 6 },
  { dataIndex: 1, spanA: 4, spanB: 8 }
)
assert.equal(crossing.length, 2)
assert.equal(crossing[0]?.tone, "bullish")
assert.equal(crossing[1]?.tone, "bearish")
assert.deepEqual(crossing[0]?.points[1], { dataIndex: 0.5, value: 7 })
assert.deepEqual(crossing[1]?.points[0], { dataIndex: 0.5, value: 7 })

console.log("Market chart Ichimoku checks passed")
