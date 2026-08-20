import type {
  MarketChartCandleItemResponse,
  MarketChartCandleRequest,
  MarketChartCandleResponse,
  MarketChartTimeframe,
} from "@/app/lib/market-charts/definitions"
import { getMarketChartCandleEndBoundary } from "@/app/lib/market-charts/candle-boundaries"
import {
  DAY_MS,
  HOUR_MS,
  MINUTE_MS,
  getCandleTimestamp,
  normalizeCandleItems,
} from "./market-chart-candle-helpers"

export const TIMEFRAME_INTERVAL_MS: Record<MarketChartTimeframe, number> = {
  "1m": MINUTE_MS,
  "5m": 5 * MINUTE_MS,
  "15m": 15 * MINUTE_MS,
  "30m": 30 * MINUTE_MS,
  "1h": HOUR_MS,
  "4h": 4 * HOUR_MS,
  "1d": DAY_MS,
  "1w": 7 * DAY_MS,
  "1mo": 30 * DAY_MS,
}

export const MARKET_CHART_CANDLE_COUNT_MIN = 1
export const MARKET_CHART_CANDLE_COUNT_MAX = 1000

export const INITIAL_COUNT_BACK: Record<MarketChartTimeframe, number> = {
  "1m": 1000,
  "5m": 288,
  "15m": 192,
  "30m": 192,
  "1h": 720,
  "4h": 180,
  "1d": 150,
  "1w": 110,
  "1mo": 120,
}

export const OLDER_COUNT_BACK: Record<MarketChartTimeframe, number> = {
  "1m": 1000,
  "5m": 288,
  "15m": 96,
  "30m": 96,
  "1h": 336,
  "4h": 84,
  "1d": 75,
  "1w": 55,
  "1mo": 60,
}

export type MarketChartCandleInterval = {
  from: string
  to: string
}

export type MarketChartCandlePageOutcome = "loaded" | "exhausted" | "retryable"

export function createLatestHistoryRequest({
  assetId,
  currentTimestamp,
  timeframe,
}: {
  assetId: number
  currentTimestamp: number
  timeframe: MarketChartTimeframe
}): MarketChartCandleRequest | null {
  const to = getMarketChartCandleEndBoundary(timeframe, currentTimestamp)

  if (!to) {
    return null
  }

  return {
    assetId,
    timeframe,
    to,
    countBack: INITIAL_COUNT_BACK[timeframe],
  }
}

export function createOlderHistoryRequest({
  assetId,
  oldestTimestamp,
  timeframe,
}: {
  assetId: number
  oldestTimestamp: number
  timeframe: MarketChartTimeframe
}): MarketChartCandleRequest | null {
  if (!Number.isFinite(oldestTimestamp)) {
    return null
  }

  return {
    assetId,
    timeframe,
    to: new Date(oldestTimestamp).toISOString(),
    countBack: OLDER_COUNT_BACK[timeframe],
  }
}

export function getOldestLoadedTimestamp(
  candles: MarketChartCandleItemResponse[]
) {
  const [oldestCandle] = normalizeCandleItems(candles)

  return oldestCandle ? getCandleTimestamp(oldestCandle) : null
}

export function getNewOlderCandles(
  current: MarketChartCandleItemResponse[],
  incoming: MarketChartCandleItemResponse[],
  oldestTimestamp: number
) {
  const currentTimes = new Set(
    current
      .map((candle) => getCandleTimestamp(candle))
      .filter((timestamp): timestamp is number => timestamp !== null)
  )

  return normalizeCandleItems(incoming).filter((candle) => {
    const timestamp = getCandleTimestamp(candle)

    return (
      timestamp !== null &&
      timestamp < oldestTimestamp &&
      !currentTimes.has(timestamp)
    )
  })
}

export function deriveMarketChartDisplayedCandleInterval(
  candles: MarketChartCandleItemResponse[],
  timeframe: MarketChartTimeframe,
  anchor: string
): MarketChartCandleInterval | null {
  const normalizedCandles = normalizeCandleItems(candles)
  const firstCandle = normalizedCandles[0]
  const lastCandle = normalizedCandles.at(-1)
  const anchorTimestamp = Date.parse(anchor)

  if (!firstCandle || !lastCandle || !Number.isFinite(anchorTimestamp)) {
    return null
  }

  const firstTimestamp = getCandleTimestamp(firstCandle)
  const lastTimestamp = getCandleTimestamp(lastCandle)
  const lastCandleEnd =
    lastTimestamp === null
      ? null
      : getMarketChartCandleEndBoundary(timeframe, lastTimestamp)
  const lastEndTimestamp = lastCandleEnd ? Date.parse(lastCandleEnd) : NaN
  const displayedToTimestamp = Math.min(anchorTimestamp, lastEndTimestamp)

  if (
    firstTimestamp === null ||
    !Number.isFinite(lastEndTimestamp) ||
    !Number.isFinite(displayedToTimestamp) ||
    firstTimestamp >= displayedToTimestamp
  ) {
    return null
  }

  return {
    from: firstCandle.time,
    to: new Date(displayedToTimestamp).toISOString(),
  }
}

export function classifyMarketChartCandlePage({
  current,
  requestedAnchor,
  response,
}: {
  current: MarketChartCandleItemResponse[]
  requestedAnchor: string
  response: MarketChartCandleResponse | null | undefined
}): MarketChartCandlePageOutcome {
  if (!response) {
    return "retryable"
  }

  if (response.candles.length === 0) {
    const anchorTimestamp = Date.parse(requestedAnchor)

    return Date.parse(response.from) === anchorTimestamp &&
      Date.parse(response.to) === anchorTimestamp
      ? "exhausted"
      : "retryable"
  }

  const oldestTimestamp = getOldestLoadedTimestamp(current)

  if (
    oldestTimestamp !== null &&
    getNewOlderCandles(current, response.candles, oldestTimestamp).length === 0
  ) {
    return "retryable"
  }

  return "loaded"
}
