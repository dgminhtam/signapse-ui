import { describe, it, expect } from "vitest"
import {
  createOlderHistoryRequest,
  getNewOlderCandles,
  getOldestLoadedTimestamp,
  TIMEFRAME_INTERVAL_MS,
  LAZY_HISTORY_BAR_TARGET,
} from "../market-chart-history-helpers"
import type { MarketChartTimeframe } from "@/app/lib/market-charts/definitions"

function makeCandle(time: string, overrides: Record<string, unknown> = {}) {
  return { time, open: 100, high: 110, low: 95, close: 105, volume: 1000, ...overrides }
}

describe("createOlderHistoryRequest", () => {
  const baseTime = new Date("2026-01-15T12:00:00Z").getTime()

  it("computes valid time range for 1h timeframe", () => {
    const result = createOlderHistoryRequest({
      assetId: 1,
      includeAnnotations: true,
      oldestTimestamp: baseTime,
      timeframe: "1h",
    })

    expect(result).not.toBeNull()
    expect(result!.assetId).toBe(1)
    expect(result!.timeframe).toBe("1h")
    expect(result!.includeAnnotations).toBe(true)
    expect(new Date(result!.to).getTime()).toBeLessThan(baseTime)
    expect(new Date(result!.from).getTime()).toBeLessThan(new Date(result!.to).getTime())
  })

  it("works for all supported timeframes", () => {
    const timeframes: MarketChartTimeframe[] = ["1m", "5m", "15m", "30m", "1h", "1d", "1w", "1mo"]

    for (const tf of timeframes) {
      const result = createOlderHistoryRequest({
        assetId: 1,
        includeAnnotations: false,
        oldestTimestamp: baseTime,
        timeframe: tf,
      })
      expect(result).not.toBeNull()
      expect(result!.timeframe).toBe(tf)
    }
  })

  it("returns null when oldestTimestamp is at epoch 0", () => {
    const result = createOlderHistoryRequest({
      assetId: 1,
      includeAnnotations: true,
      oldestTimestamp: 0,
      timeframe: "1h",
    })

    expect(result).toBeNull()
  })
})

describe("getOldestLoadedTimestamp", () => {
  it("returns the oldest candle timestamp", () => {
    const candles = [
      makeCandle("2026-01-15T10:00:00Z"),
      makeCandle("2026-01-14T10:00:00Z"),
      makeCandle("2026-01-16T10:00:00Z"),
    ]

    const result = getOldestLoadedTimestamp(candles)

    expect(result).toBe(new Date("2026-01-14T10:00:00Z").getTime())
  })

  it("returns null for empty array", () => {
    expect(getOldestLoadedTimestamp([])).toBeNull()
  })

  it("returns null when all candles are invalid", () => {
    expect(getOldestLoadedTimestamp([makeCandle("bad-date")])).toBeNull()
  })
})

describe("getNewOlderCandles", () => {
  const oldestTimestamp = new Date("2026-01-15T00:00:00Z").getTime()

  it("returns only incoming candles before oldestTimestamp", () => {
    const current = [makeCandle("2026-01-15T12:00:00Z")]
    const incoming = [
      makeCandle("2026-01-14T10:00:00Z"),
      makeCandle("2026-01-14T12:00:00Z"),
      makeCandle("2026-01-15T14:00:00Z"),
    ]

    const result = getNewOlderCandles(current, incoming, oldestTimestamp)

    expect(result).toHaveLength(2)
    expect(result[0].time).toBe("2026-01-14T10:00:00Z")
    expect(result[1].time).toBe("2026-01-14T12:00:00Z")
  })

  it("excludes candles already present in current", () => {
    const current = [makeCandle("2026-01-14T10:00:00Z")]
    const incoming = [
      makeCandle("2026-01-14T10:00:00Z", { close: 999 }),
      makeCandle("2026-01-13T10:00:00Z"),
    ]

    const result = getNewOlderCandles(current, incoming, oldestTimestamp)

    expect(result).toHaveLength(1)
    expect(result[0].time).toBe("2026-01-13T10:00:00Z")
  })

  it("deduplicates incoming candles", () => {
    const current = [makeCandle("2026-01-15T12:00:00Z")]
    const incoming = [
      makeCandle("2026-01-14T10:00:00Z"),
      makeCandle("2026-01-14T10:00:00Z", { close: 999 }),
    ]

    const result = getNewOlderCandles(current, incoming, oldestTimestamp)

    expect(result).toHaveLength(1)
  })

  it("returns empty array when no incoming candles are older", () => {
    const current = [makeCandle("2026-01-15T12:00:00Z")]
    const incoming = [makeCandle("2026-01-15T14:00:00Z")]

    const result = getNewOlderCandles(current, incoming, oldestTimestamp)

    expect(result).toHaveLength(0)
  })
})

describe("TIMEFRAME_INTERVAL_MS", () => {
  it("has entries for all 8 timeframes", () => {
    const timeframes = Object.keys(TIMEFRAME_INTERVAL_MS)
    expect(timeframes).toHaveLength(8)
  })

  it("1m is 60000ms", () => {
    expect(TIMEFRAME_INTERVAL_MS["1m"]).toBe(60000)
  })

  it("1d is 86400000ms", () => {
    expect(TIMEFRAME_INTERVAL_MS["1d"]).toBe(86400000)
  })
})

describe("LAZY_HISTORY_BAR_TARGET", () => {
  it("has entries for all 8 timeframes", () => {
    const timeframes = Object.keys(LAZY_HISTORY_BAR_TARGET)
    expect(timeframes).toHaveLength(8)
  })

  it("every target is positive", () => {
    for (const value of Object.values(LAZY_HISTORY_BAR_TARGET)) {
      expect(value).toBeGreaterThan(0)
    }
  })
})
