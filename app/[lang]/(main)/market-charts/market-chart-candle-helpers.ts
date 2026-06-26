import type {
  MarketChartCandleItemResponse,
  MarketChartLiveQuoteResponse,
  MarketChartTimeframe,
} from "@/app/lib/market-charts/definitions"

const MINUTE_MS = 60 * 1000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS
const QUOTE_BUCKET_INTERVAL_MS: Record<MarketChartTimeframe, number> = {
  "1m": MINUTE_MS,
  "5m": 5 * MINUTE_MS,
  "15m": 15 * MINUTE_MS,
  "30m": 30 * MINUTE_MS,
  "1h": HOUR_MS,
  "1d": DAY_MS,
  "1w": 7 * DAY_MS,
  "1mo": 30 * DAY_MS,
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function toMarketChartEpochMillis(value: unknown) {
  if (typeof value !== "string") {
    return null
  }

  const timestamp = Date.parse(value)

  return Number.isFinite(timestamp) ? timestamp : null
}

export function isValidMarketChartCandle(
  candle: unknown
): candle is MarketChartCandleItemResponse {
  return (
    isRecord(candle) &&
    toMarketChartEpochMillis(candle.time) !== null &&
    typeof candle.open === "number" &&
    Number.isFinite(candle.open) &&
    typeof candle.high === "number" &&
    Number.isFinite(candle.high) &&
    typeof candle.low === "number" &&
    Number.isFinite(candle.low) &&
    typeof candle.close === "number" &&
    Number.isFinite(candle.close)
  )
}

export function getCandleTimestamp(candle: unknown) {
  if (!isValidMarketChartCandle(candle)) {
    return null
  }

  return toMarketChartEpochMillis(candle.time)
}

export function normalizeCandleItems(
  candles: MarketChartCandleItemResponse[]
): MarketChartCandleItemResponse[] {
  const candlesByTime = new Map<number, MarketChartCandleItemResponse>()

  for (const candle of candles.filter(isValidMarketChartCandle)) {
    const timestamp = getCandleTimestamp(candle)

    if (timestamp !== null) {
      candlesByTime.set(timestamp, candle)
    }
  }

  return [...candlesByTime.entries()]
    .sort(([left], [right]) => left - right)
    .map(([, candle]) => candle)
}

export function mergeCandleItems(
  current: MarketChartCandleItemResponse[],
  incoming: MarketChartCandleItemResponse[]
) {
  return normalizeCandleItems([...current, ...incoming])
}

export function getFiniteVolume(candle: MarketChartCandleItemResponse) {
  return typeof candle.volume === "number" && Number.isFinite(candle.volume)
    ? candle.volume
    : null
}

export function mergeLiveCandleItem(
  current: MarketChartCandleItemResponse[],
  liveCandle: MarketChartCandleItemResponse | null
) {
  if (!liveCandle) {
    return normalizeCandleItems(current)
  }

  const liveTimestamp = getCandleTimestamp(liveCandle)
  const newestTimestamp = Math.max(
    ...current
      .map((candle) => getCandleTimestamp(candle))
      .filter((timestamp): timestamp is number => timestamp !== null)
  )

  if (
    liveTimestamp === null ||
    (Number.isFinite(newestTimestamp) && liveTimestamp < newestTimestamp)
  ) {
    return normalizeCandleItems(current)
  }

  return mergeCandleItems(current, [liveCandle])
}

export function deriveLiveCandleItemFromQuote({
  current,
  quote,
  timeframe,
}: {
  current: MarketChartCandleItemResponse[] | null | undefined
  quote: MarketChartLiveQuoteResponse | null | undefined
  timeframe: MarketChartTimeframe
}): MarketChartCandleItemResponse | null {
  if (!quote || !Number.isFinite(quote.price)) {
    return null
  }

  const quoteTime = Date.parse(quote.providerTime || quote.receivedAt)
  const intervalMs = QUOTE_BUCKET_INTERVAL_MS[timeframe]

  if (!Number.isFinite(quoteTime) || !Number.isFinite(intervalMs)) {
    return null
  }

  const quoteBucketTimestamp = Math.floor(quoteTime / intervalMs) * intervalMs
  const normalizedCurrent = normalizeCandleItems(current ?? [])
  const latestCandle = normalizedCurrent.at(-1) ?? null
  const latestTimestamp = latestCandle ? getCandleTimestamp(latestCandle) : null

  if (!latestCandle || latestTimestamp !== quoteBucketTimestamp) {
    return null
  }

  return {
    ...latestCandle,
    close: quote.price,
  }
}

export function hasUsableVolume(
  candle: Pick<MarketChartCandleItemResponse, "volume"> | null | undefined
) {
  return typeof candle?.volume === "number" && Number.isFinite(candle.volume)
}

export function hasUsableVolumeData(
  candles: Pick<MarketChartCandleItemResponse, "volume">[] | null | undefined,
  liveCandle: Pick<MarketChartCandleItemResponse, "volume"> | null | undefined
) {
  return Boolean(candles?.some(hasUsableVolume) || hasUsableVolume(liveCandle))
}

export interface CreateKLineDataItem {
  [key: string]: unknown
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume?: number
}

export function createKLineData(
  candles: MarketChartCandleItemResponse[]
): CreateKLineDataItem[] {
  return normalizeCandleItems(candles).flatMap((candle) => {
    const timestamp = getCandleTimestamp(candle)
    const volume = getFiniteVolume(candle)

    if (timestamp === null) {
      return []
    }

    return [
      {
        timestamp,
        open: candle.open,
        high: candle.high,
        low: candle.low,
        close: candle.close,
        ...(volume !== null ? { volume } : {}),
      },
    ]
  })
}
