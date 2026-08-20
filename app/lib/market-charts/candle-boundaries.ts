import type { MarketChartTimeframe } from "./definitions"

const MINUTE_MS = 60 * 1000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

function getBucketStartTimestamp(
  timeframe: MarketChartTimeframe,
  timestamp: number
): number | null {
  const date = new Date(timestamp)

  if (!Number.isFinite(timestamp) || Number.isNaN(date.getTime())) {
    return null
  }

  switch (timeframe) {
    case "1m":
      return Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes()
      )
    case "5m":
    case "15m":
    case "30m": {
      const span = Number(timeframe.slice(0, -1))
      return Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours(),
        Math.floor(date.getUTCMinutes() / span) * span
      )
    }
    case "1h":
      return Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        date.getUTCHours()
      )
    case "4h":
      return Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate(),
        Math.floor(date.getUTCHours() / 4) * 4
      )
    case "1d":
      return Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate()
      )
    case "1w": {
      const dayStart = Date.UTC(
        date.getUTCFullYear(),
        date.getUTCMonth(),
        date.getUTCDate()
      )
      const daysSinceMonday = (date.getUTCDay() + 6) % 7
      return dayStart - daysSinceMonday * DAY_MS
    }
    case "1mo":
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)
  }
}

function getNextBucketStartTimestamp(
  timeframe: MarketChartTimeframe,
  bucketStartTimestamp: number
): number {
  const date = new Date(bucketStartTimestamp)

  switch (timeframe) {
    case "1m":
      return bucketStartTimestamp + MINUTE_MS
    case "5m":
    case "15m":
    case "30m":
      return bucketStartTimestamp + Number(timeframe.slice(0, -1)) * MINUTE_MS
    case "1h":
      return bucketStartTimestamp + HOUR_MS
    case "4h":
      return bucketStartTimestamp + 4 * HOUR_MS
    case "1d":
      return bucketStartTimestamp + DAY_MS
    case "1w":
      return bucketStartTimestamp + 7 * DAY_MS
    case "1mo":
      return Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1)
  }
}

export function getMarketChartCandleBucketStartTimestamp(
  timeframe: MarketChartTimeframe,
  timestamp: number
): number | null {
  return getBucketStartTimestamp(timeframe, timestamp)
}

export function getMarketChartCandleEndBoundary(
  timeframe: MarketChartTimeframe,
  timestamp: number | Date
): string | null {
  const timestampValue =
    timestamp instanceof Date ? timestamp.getTime() : timestamp
  const bucketStartTimestamp = getBucketStartTimestamp(
    timeframe,
    timestampValue
  )

  if (bucketStartTimestamp === null) {
    return null
  }

  return new Date(
    getNextBucketStartTimestamp(timeframe, bucketStartTimestamp)
  ).toISOString()
}

export function isMarketChartCandleBoundary(
  timeframe: MarketChartTimeframe,
  value: string
): boolean {
  const timestamp = Date.parse(value)
  const bucketStartTimestamp = getBucketStartTimestamp(timeframe, timestamp)

  return (
    bucketStartTimestamp !== null &&
    (timestamp === bucketStartTimestamp ||
      timestamp ===
        getNextBucketStartTimestamp(timeframe, bucketStartTimestamp))
  )
}
