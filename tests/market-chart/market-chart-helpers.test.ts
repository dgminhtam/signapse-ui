import { describe, expect, it, vi } from "vitest"

vi.mock("klinecharts", () => ({
  registerOverlay: vi.fn(),
}))

import type {
  MarketChartAnnotationResponse,
  MarketChartCandleItemResponse,
  MarketChartEconomicCalendarEventResponse,
} from "@/app/lib/market-charts/definitions"
import {
  createMarketChartAnnotationGroups,
  createMarketChartEconomicCalendarEventGroups,
  toMarketChartEpochMillis,
} from "@/app/[lang]/(main)/market-charts/market-chart-annotations"
import {
  createKLineData,
  deriveLiveCandleItemFromQuote,
  mergeCandleItems,
  normalizeCandleItems,
} from "@/app/[lang]/(main)/market-charts/market-chart-candle-helpers"
import {
  createOlderHistoryRequest,
  getNewOlderCandles,
} from "@/app/[lang]/(main)/market-charts/market-chart-history-helpers"
import {
  DEFAULT_MARKET_CHART_DRAWING_PALETTE_TOOLS,
  MARKET_CHART_DRAWING_TOOL_OVERLAYS,
  getMarketChartDrawingToolPalette,
  isMarketChartDrawingTool,
} from "@/app/[lang]/(main)/market-charts/market-chart-drawing"

const candle = (
  time: string,
  close: number,
  volume?: number
): MarketChartCandleItemResponse => ({
  time,
  open: close - 1,
  high: close + 2,
  low: close - 2,
  close,
  ...(volume === undefined ? {} : { volume }),
})

const hotAnnotation = (
  id: string,
  time: string,
  direction: "BULLISH" | "BEARISH",
  severity = "HIGH"
): MarketChartAnnotationResponse => ({
  id,
  annotationType: "HOT_EVENT",
  assetId: 1,
  time,
  hotEvent: {
    direction,
    severity,
    evidence: [],
  },
})

describe("market-chart candle and history helpers", () => {
  it("normalizes and merges valid candles by timestamp", () => {
    const first = candle("2026-07-29T00:00:00.000Z", 100)
    const replacement = candle("2026-07-29T01:00:00.000Z", 102, 20)

    expect(
      normalizeCandleItems([
        replacement,
        { ...first, open: Number.NaN },
        first,
        { ...replacement, close: 103 },
      ])
    ).toEqual([first, { ...replacement, close: 103 }])
    expect(
      mergeCandleItems([first], [replacement]).map(({ time }) => time)
    ).toEqual([first.time, replacement.time])
    expect(createKLineData([replacement])[0]).toMatchObject({
      timestamp: Date.parse(replacement.time),
      volume: 20,
    })
  })

  it("updates the active candle or creates the next quote bucket", () => {
    const current = [candle("2026-07-29T01:00:00.000Z", 100)]
    const updated = deriveLiveCandleItemFromQuote({
      current,
      quote: {
        assetId: 1,
        symbol: "GOLD",
        price: 105,
        providerTime: "2026-07-29T01:30:00.000Z",
        receivedAt: "2026-07-29T01:30:01.000Z",
        stale: false,
      },
      timeframe: "1h",
    })
    const next = deriveLiveCandleItemFromQuote({
      current,
      quote: {
        assetId: 1,
        symbol: "GOLD",
        price: 110,
        providerTime: "2026-07-29T02:00:00.000Z",
        receivedAt: "2026-07-29T02:00:01.000Z",
        stale: false,
      },
      timeframe: "1h",
    })

    expect(updated).toMatchObject({
      time: current[0]?.time,
      high: 105,
      close: 105,
    })
    expect(next).toMatchObject({
      time: "2026-07-29T02:00:00.000Z",
      open: 110,
      high: 110,
      low: 110,
      close: 110,
    })
  })

  it("creates bounded older-history requests and filters already loaded candles", () => {
    const oldestTimestamp = Date.parse("2026-07-29T12:00:00.000Z")
    const request = createOlderHistoryRequest({
      assetId: 7,
      oldestTimestamp,
      timeframe: "1h",
    })

    expect(request).toEqual({
      assetId: 7,
      timeframe: "1h",
      from: "2026-07-15T11:00:00.000Z",
      to: "2026-07-29T11:00:00.000Z",
    })
    expect(
      getNewOlderCandles(
        [candle("2026-07-29T10:00:00.000Z", 1)],
        [
          candle("2026-07-29T09:00:00.000Z", 2),
          candle("2026-07-29T10:00:00.000Z", 3),
          candle("2026-07-29T11:00:00.000Z", 4),
        ],
        Date.parse("2026-07-29T10:00:00.000Z")
      ).map(({ time }) => time)
    ).toEqual(["2026-07-29T09:00:00.000Z"])
  })
})

describe("market-chart annotation and drawing mappings", () => {
  it("groups nearby annotations by candle and preserves dominant priority", () => {
    const candles = [
      candle("2026-07-29T00:00:00.000Z", 100),
      candle("2026-07-29T01:00:00.000Z", 110),
    ]
    const groups = createMarketChartAnnotationGroups(
      [
        hotAnnotation("a", "2026-07-29T00:10:00.000Z", "BULLISH"),
        hotAnnotation("b", "2026-07-29T00:20:00.000Z", "BEARISH", "LOW"),
        hotAnnotation("outside", "2026-07-29T02:00:00.000Z", "BULLISH"),
      ],
      candles
    )

    expect(groups).toHaveLength(1)
    expect(groups[0]).toMatchObject({
      id: `annotation-${Date.parse(candles[0].time)}`,
      time: Date.parse(candles[0].time),
      anchorPrice: 102,
      direction: "MIXED",
      priority: "high",
    })
    expect(groups[0]?.annotations.map(({ id }) => id)).toEqual(["a", "b"])
    expect(toMarketChartEpochMillis("invalid")).toBeNull()
  })

  it("groups high-impact calendar events against the nearest candle", () => {
    const event = (
      id: number,
      impact: string
    ): MarketChartEconomicCalendarEventResponse => ({
      id,
      assetId: 1,
      time: "2026-07-29T00:30:00.000Z",
      impact,
      status: "AVAILABLE",
    })
    const groups = createMarketChartEconomicCalendarEventGroups(
      [event(1, "HIGH"), event(2, "LOW")],
      [
        candle("2026-07-29T00:00:00.000Z", 100),
        candle("2026-07-29T01:00:00.000Z", 110),
      ]
    )

    expect(groups).toHaveLength(1)
    expect(groups[0]).toMatchObject({ priority: "high", anchorPrice: 102 })
  })

  it("keeps drawing tool mappings vendor-independent", () => {
    expect(MARKET_CHART_DRAWING_TOOL_OVERLAYS["horizontal-line"]).toBe(
      "horizontalStraightLine"
    )
    expect(isMarketChartDrawingTool("triangle")).toBe(true)
    expect(isMarketChartDrawingTool("not-a-tool")).toBe(false)
    expect(getMarketChartDrawingToolPalette("fibonacci-line")).toBe("fibonacci")
    expect(DEFAULT_MARKET_CHART_DRAWING_PALETTE_TOOLS.pattern).toBe(
      "xabcd-pattern"
    )
  })
})
