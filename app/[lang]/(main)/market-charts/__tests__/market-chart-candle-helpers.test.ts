import { describe, it, expect } from "vitest"
import {
  createKLineData,
  getCandleTimestamp,
  getFiniteVolume,
  hasUsableVolume,
  hasUsableVolumeData,
  isValidMarketChartCandle,
  mergeCandleItems,
  mergeLiveCandleItem,
  normalizeCandleItems,
} from "../market-chart-candle-helpers"

function makeCandle(overrides: Record<string, unknown> = {}) {
  return {
    time: "2026-01-15T10:00:00Z",
    open: 100,
    high: 110,
    low: 95,
    close: 105,
    volume: 1000,
    ...overrides,
  }
}

describe("normalizeCandleItems", () => {
  it("sorts candles ascending by time", () => {
    const candles = [
      makeCandle({ time: "2026-01-15T12:00:00Z" }),
      makeCandle({ time: "2026-01-15T10:00:00Z" }),
      makeCandle({ time: "2026-01-15T11:00:00Z" }),
    ]

    const result = normalizeCandleItems(candles)

    expect(result).toHaveLength(3)
    expect(result[0].time).toBe("2026-01-15T10:00:00Z")
    expect(result[1].time).toBe("2026-01-15T11:00:00Z")
    expect(result[2].time).toBe("2026-01-15T12:00:00Z")
  })

  it("deduplicates by timestamp keeping last occurrence", () => {
    const candles = [
      makeCandle({ time: "2026-01-15T10:00:00Z", close: 99 }),
      makeCandle({ time: "2026-01-15T10:00:00Z", close: 105 }),
    ]

    const result = normalizeCandleItems(candles)

    expect(result).toHaveLength(1)
    expect(result[0].close).toBe(105)
  })

  it("filters out candles with invalid time", () => {
    const candles = [
      makeCandle({ time: "invalid-date" }),
      makeCandle({ time: "2026-01-15T10:00:00Z" }),
    ]

    const result = normalizeCandleItems(candles)

    expect(result).toHaveLength(1)
    expect(result[0].time).toBe("2026-01-15T10:00:00Z")
  })

  it("filters out candles with non-finite open/high/low/close", () => {
    const candles = [
      makeCandle({ time: "2026-01-15T10:00:00Z", open: NaN }),
      makeCandle({ time: "2026-01-15T11:00:00Z", high: Infinity }),
      makeCandle({ time: "2026-01-15T12:00:00Z" }),
    ]

    const result = normalizeCandleItems(candles)

    expect(result).toHaveLength(1)
    expect(result[0].time).toBe("2026-01-15T12:00:00Z")
  })

  it("returns empty array for empty input", () => {
    expect(normalizeCandleItems([])).toEqual([])
  })

  it("returns empty array when all candles are invalid", () => {
    const candles = [
      makeCandle({ time: "bad", open: NaN }),
      makeCandle({ time: "also-bad", high: NaN }),
    ]

    expect(normalizeCandleItems(candles)).toEqual([])
  })
})

describe("mergeCandleItems", () => {
  it("combines two arrays and deduplicates", () => {
    const current = [
      makeCandle({ time: "2026-01-15T10:00:00Z", close: 100 }),
      makeCandle({ time: "2026-01-15T11:00:00Z", close: 101 }),
    ]
    const incoming = [
      makeCandle({ time: "2026-01-15T11:00:00Z", close: 999 }),
      makeCandle({ time: "2026-01-15T12:00:00Z", close: 102 }),
    ]

    const result = mergeCandleItems(current, incoming)

    expect(result).toHaveLength(3)
    expect(result[1].close).toBe(999)
    expect(result[2].time).toBe("2026-01-15T12:00:00Z")
  })
})

describe("mergeLiveCandleItem", () => {
  it("appends live candle with newer timestamp", () => {
    const current = [
      makeCandle({ time: "2026-01-15T10:00:00Z", close: 100 }),
      makeCandle({ time: "2026-01-15T11:00:00Z", close: 101 }),
    ]
    const live = makeCandle({ time: "2026-01-15T12:00:00Z", close: 102 })

    const result = mergeLiveCandleItem(current, live)

    expect(result).toHaveLength(3)
    expect(result[2].close).toBe(102)
  })

  it("replaces candle with same timestamp", () => {
    const current = [
      makeCandle({ time: "2026-01-15T10:00:00Z", close: 100 }),
      makeCandle({ time: "2026-01-15T11:00:00Z", close: 101 }),
    ]
    const live = makeCandle({ time: "2026-01-15T11:00:00Z", close: 999 })

    const result = mergeLiveCandleItem(current, live)

    expect(result).toHaveLength(2)
    expect(result[1].close).toBe(999)
  })

  it("ignores live candle with older timestamp", () => {
    const current = [
      makeCandle({ time: "2026-01-15T11:00:00Z", close: 101 }),
      makeCandle({ time: "2026-01-15T12:00:00Z", close: 102 }),
    ]
    const live = makeCandle({ time: "2026-01-15T10:00:00Z", close: 100 })

    const result = mergeLiveCandleItem(current, live)

    expect(result).toHaveLength(2)
    expect(result[0].close).toBe(101)
    expect(result[1].close).toBe(102)
  })

  it("returns normalized current when live is null", () => {
    const current = [
      makeCandle({ time: "2026-01-15T10:00:00Z", close: 100 }),
    ]

    const result = mergeLiveCandleItem(current, null)

    expect(result).toHaveLength(1)
  })

  it("returns empty when current is empty and live is null", () => {
    expect(mergeLiveCandleItem([], null)).toEqual([])
  })

  it("returns just the live candle when current is empty", () => {
    const live = makeCandle({ time: "2026-01-15T10:00:00Z", close: 100 })

    const result = mergeLiveCandleItem([], live)

    expect(result).toHaveLength(1)
    expect(result[0].close).toBe(100)
  })
})

describe("createKLineData", () => {
  it("converts valid candles to KLineData format", () => {
    const candles = [
      makeCandle({ time: "2026-01-15T10:00:00Z", close: 105, volume: 1000 }),
    ]

    const result = createKLineData(candles)

    expect(result).toHaveLength(1)
    expect(result[0].timestamp).toBe(new Date("2026-01-15T10:00:00Z").getTime())
    expect(result[0].open).toBe(100)
    expect(result[0].high).toBe(110)
    expect(result[0].low).toBe(95)
    expect(result[0].close).toBe(105)
    expect(result[0].volume).toBe(1000)
  })

  it("omits volume when null", () => {
    const candles = [makeCandle({ volume: null })]

    const result = createKLineData(candles)

    expect(Object.prototype.hasOwnProperty.call(result[0], "volume")).toBe(false)
  })

  it("omits volume when non-finite", () => {
    const candles = [makeCandle({ volume: NaN })]

    const result = createKLineData(candles)

    expect(Object.prototype.hasOwnProperty.call(result[0], "volume")).toBe(false)
  })

  it("skips candles with invalid time", () => {
    const candles = [
      makeCandle({ time: "invalid" }),
      makeCandle({ time: "2026-01-15T10:00:00Z" }),
    ]

    const result = createKLineData(candles)

    expect(result).toHaveLength(1)
  })

  it("returns empty array for empty input", () => {
    expect(createKLineData([])).toEqual([])
  })
})

describe("isValidMarketChartCandle", () => {
  it("returns true for valid candle", () => {
    expect(isValidMarketChartCandle(makeCandle())).toBe(true)
  })

  it("returns false for invalid time", () => {
    expect(isValidMarketChartCandle(makeCandle({ time: "bad" }))).toBe(false)
  })

  it("returns false for non-finite open", () => {
    expect(isValidMarketChartCandle(makeCandle({ open: NaN }))).toBe(false)
  })

  it("returns false for missing fields", () => {
    expect(isValidMarketChartCandle({ time: "2026-01-15T10:00:00Z" })).toBe(false)
  })

  it("returns false for non-object", () => {
    expect(isValidMarketChartCandle(null)).toBe(false)
    expect(isValidMarketChartCandle(undefined)).toBe(false)
    expect(isValidMarketChartCandle("string")).toBe(false)
  })
})

describe("getCandleTimestamp", () => {
  it("returns millisecond timestamp for valid candle", () => {
    const result = getCandleTimestamp(makeCandle({ time: "2026-01-15T10:00:00Z" }))
    expect(result).toBe(new Date("2026-01-15T10:00:00Z").getTime())
  })

  it("returns null for invalid candle", () => {
    expect(getCandleTimestamp(null)).toBeNull()
  })
})

describe("getFiniteVolume", () => {
  it("returns volume when finite", () => {
    expect(getFiniteVolume(makeCandle({ volume: 1000 }))).toBe(1000)
  })

  it("returns null when volume is null", () => {
    expect(getFiniteVolume(makeCandle({ volume: null }))).toBeNull()
  })

  it("returns null when volume is NaN", () => {
    expect(getFiniteVolume(makeCandle({ volume: NaN }))).toBeNull()
  })
})

describe("hasUsableVolume", () => {
  it("returns true when volume is finite number", () => {
    expect(hasUsableVolume(makeCandle({ volume: 1000 }))).toBe(true)
  })

  it("returns false when volume is null", () => {
    expect(hasUsableVolume(makeCandle({ volume: null }))).toBe(false)
  })

  it("returns false for null candle", () => {
    expect(hasUsableVolume(null)).toBe(false)
  })
})

describe("hasUsableVolumeData", () => {
  it("returns true when candles have usable volume", () => {
    expect(hasUsableVolumeData([makeCandle({ volume: 1000 })], null)).toBe(true)
  })

  it("returns true when live candle has usable volume", () => {
    expect(hasUsableVolumeData([], makeCandle({ volume: 1000 }))).toBe(true)
  })

  it("returns false when no usable volume", () => {
    expect(hasUsableVolumeData([makeCandle({ volume: null })], null)).toBe(false)
  })

  it("returns false for null inputs", () => {
    expect(hasUsableVolumeData(null, null)).toBe(false)
  })
})
