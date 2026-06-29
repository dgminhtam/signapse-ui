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

export const OLDER_WINDOW_DAYS: Record<MarketChartTimeframe, number> = {
  "1m": 1,
  "5m": 1,
  "15m": 1,
  "30m": 2,
  "1h": 4,
  "1d": 75,
  "1w": 385,
  "1mo": 1825,
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
  const toMs = oldestTimestamp - TIMEFRAME_INTERVAL_MS[timeframe]
  const from = new Date(toMs)
  from.setDate(from.getDate() - OLDER_WINDOW_DAYS[timeframe])
  const fromMs = from.getTime()

  if (!Number.isFinite(fromMs) || !Number.isFinite(toMs) || fromMs >= toMs) {
    return null
  }

  return {
    assetId,
    timeframe,
    from: new Date(fromMs).toISOString(),
    to: new Date(toMs).toISOString(),
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
