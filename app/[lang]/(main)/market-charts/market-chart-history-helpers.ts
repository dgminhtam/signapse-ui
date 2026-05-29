import type {
  MarketChartCandleItemResponse,
  MarketChartCandleRequest,
  MarketChartTimeframe,
} from "@/app/lib/market-charts/definitions"
import { MINUTE_MS, HOUR_MS, DAY_MS } from "./market-chart-period"
import { getCandleTimestamp, normalizeCandleItems } from "./market-chart-candle-helpers"

export const TIMEFRAME_INTERVAL_MS: Record<MarketChartTimeframe, number> = {
  "1m": MINUTE_MS,
  "5m": 5 * MINUTE_MS,
  "15m": 15 * MINUTE_MS,
  "30m": 30 * MINUTE_MS,
  "1h": HOUR_MS,
  "1d": DAY_MS,
  "1w": 7 * DAY_MS,
  "1mo": 30 * DAY_MS,
}

export const LAZY_HISTORY_BAR_TARGET: Record<MarketChartTimeframe, number> = {
  "1m": 360,
  "5m": 288,
  "15m": 288,
  "30m": 240,
  "1h": 240,
  "1d": 180,
  "1w": 104,
  "1mo": 60,
}

export function createOlderHistoryRequest({
  assetId,
  includeAnnotations,
  oldestTimestamp,
  timeframe,
}: {
  assetId: number
  includeAnnotations: boolean
  oldestTimestamp: number
  timeframe: MarketChartTimeframe
}): MarketChartCandleRequest | null {
  const intervalMs = TIMEFRAME_INTERVAL_MS[timeframe]
  const barTarget = LAZY_HISTORY_BAR_TARGET[timeframe]
  const toMs = oldestTimestamp - intervalMs
  const fromMs = toMs - intervalMs * barTarget

  if (!Number.isFinite(fromMs) || !Number.isFinite(toMs) || fromMs >= toMs) {
    return null
  }

  return {
    assetId,
    timeframe,
    from: new Date(fromMs).toISOString(),
    to: new Date(toMs).toISOString(),
    includeAnnotations,
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
