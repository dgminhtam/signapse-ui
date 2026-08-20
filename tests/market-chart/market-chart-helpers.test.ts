import { describe, expect, it, vi } from "vitest"

vi.mock("klinecharts", () => ({
  registerOverlay: vi.fn(),
}))

import type {
  MarketChartAnnotationResponse,
  MarketChartCandleItemResponse,
  MarketChartCandleResponse,
  MarketChartEconomicCalendarEventResponse,
} from "@/app/lib/market-charts/definitions"
import {
  getMarketChartCandleEndBoundary,
  isMarketChartCandleBoundary,
} from "@/app/lib/market-charts/candle-boundaries"
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
  INITIAL_COUNT_BACK,
  OLDER_COUNT_BACK,
  classifyMarketChartCandlePage,
  createLatestHistoryRequest,
  createOlderHistoryRequest,
  deriveMarketChartDisplayedCandleInterval,
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
      to: "2026-07-29T12:00:00.000Z",
      countBack: OLDER_COUNT_BACK["1h"],
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

  it("maps every timeframe to bounded initial and older pages", () => {
    expect(INITIAL_COUNT_BACK).toEqual({
      "1m": 1000,
      "5m": 288,
      "15m": 192,
      "30m": 192,
      "1h": 720,
      "4h": 180,
      "1d": 150,
      "1w": 110,
      "1mo": 120,
    })
    expect(OLDER_COUNT_BACK).toEqual({
      "1m": 1000,
      "5m": 288,
      "15m": 96,
      "30m": 96,
      "1h": 336,
      "4h": 84,
      "1d": 75,
      "1w": 55,
      "1mo": 60,
    })

    for (const [timeframe, countBack] of Object.entries(INITIAL_COUNT_BACK)) {
      expect(
        createLatestHistoryRequest({
          assetId: 7,
          currentTimestamp: Date.parse("2026-08-19T10:32:15.000Z"),
          timeframe: timeframe as keyof typeof INITIAL_COUNT_BACK,
        })?.countBack
      ).toBe(countBack)
    }
  })

  it("creates UTC end boundaries including ISO Monday weeks", () => {
    const current = Date.parse("2026-08-19T10:32:15.000Z")

    expect(getMarketChartCandleEndBoundary("1h", current)).toBe(
      "2026-08-19T11:00:00.000Z"
    )
    expect(
      getMarketChartCandleEndBoundary("1h", Date.parse("2026-08-19T11:00:00Z"))
    ).toBe("2026-08-19T12:00:00.000Z")
    expect(getMarketChartCandleEndBoundary("4h", current)).toBe(
      "2026-08-19T12:00:00.000Z"
    )
    expect(getMarketChartCandleEndBoundary("1w", current)).toBe(
      "2026-08-24T00:00:00.000Z"
    )
    expect(getMarketChartCandleEndBoundary("1mo", current)).toBe(
      "2026-09-01T00:00:00.000Z"
    )
    expect(getMarketChartCandleEndBoundary("1m", current)).toBe(
      "2026-08-19T10:33:00.000Z"
    )
    expect(getMarketChartCandleEndBoundary("5m", current)).toBe(
      "2026-08-19T10:35:00.000Z"
    )
    expect(getMarketChartCandleEndBoundary("15m", current)).toBe(
      "2026-08-19T10:45:00.000Z"
    )
    expect(getMarketChartCandleEndBoundary("30m", current)).toBe(
      "2026-08-19T11:00:00.000Z"
    )
    expect(getMarketChartCandleEndBoundary("1d", current)).toBe(
      "2026-08-20T00:00:00.000Z"
    )
    expect(isMarketChartCandleBoundary("1h", "2026-08-19T11:00:00Z")).toBe(true)
    expect(isMarketChartCandleBoundary("1h", "2026-08-19T11:15:00Z")).toBe(
      false
    )
  })

  it("derives displayed intervals from actual sparse candles and preserves partial", () => {
    const partial = {
      ...candle("2026-08-19T10:00:00.000Z", 105),
      partial: true,
    }

    expect(normalizeCandleItems([partial])[0]).toEqual(partial)
    expect(
      deriveMarketChartDisplayedCandleInterval(
        [candle("2026-08-19T08:00:00.000Z", 100), partial],
        "1h",
        "2026-08-19T11:00:00Z"
      )
    ).toEqual({
      from: "2026-08-19T08:00:00.000Z",
      to: "2026-08-19T11:00:00.000Z",
    })
  })

  it("distinguishes terminal empty pages, short pages, duplicates, and retryable pages", () => {
    const current = [candle("2026-08-19T10:00:00.000Z", 100)]
    const baseResponse = (
      candles: MarketChartCandleItemResponse[]
    ): MarketChartCandleResponse => ({
      asset: {
        id: 7,
        name: "Gold",
        symbol: "XAUUSD",
        type: "COMMODITY",
      },
      timeframe: "1h",
      from: "2026-08-19T09:00:00.000Z",
      to: "2026-08-19T11:00:00.000Z",
      candles,
    })

    expect(
      classifyMarketChartCandlePage({
        current,
        requestedAnchor: "2026-08-19T09:00:00Z",
        response: {
          ...baseResponse([]),
          from: "2026-08-19T09:00:00Z",
          to: "2026-08-19T09:00:00Z",
        },
      })
    ).toBe("exhausted")
    expect(
      classifyMarketChartCandlePage({
        current,
        requestedAnchor: "2026-08-19T09:00:00Z",
        response: baseResponse([]),
      })
    ).toBe("retryable")
    expect(
      classifyMarketChartCandlePage({
        current,
        requestedAnchor: "2026-08-19T09:00:00Z",
        response: baseResponse([candle("2026-08-19T08:00:00.000Z", 99)]),
      })
    ).toBe("loaded")
    expect(
      classifyMarketChartCandlePage({
        current,
        requestedAnchor: "2026-08-19T09:00:00Z",
        response: baseResponse([current[0]!]),
      })
    ).toBe("retryable")
    expect(
      classifyMarketChartCandlePage({
        current,
        requestedAnchor: "2026-08-19T09:00:00Z",
        response: null,
      })
    ).toBe("retryable")
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
