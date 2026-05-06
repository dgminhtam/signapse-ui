import type {
  MarketChartAnnotationDirection,
  MarketChartAnnotationResponse,
  MarketChartCandleItemResponse,
} from "@/app/lib/market-charts/definitions"

export type MarketChartEpochMillis = number

export interface MarketChartAnnotationGroup {
  id: string
  time: MarketChartEpochMillis
  anchorPrice: number
  direction: MarketChartAnnotationDirection | null
  annotations: MarketChartAnnotationResponse[]
  priority: "normal" | "high"
}

export interface MarketChartAnnotationMarkerPoint {
  x: number
  y: number
}

export function toMarketChartEpochMillis(value: string): MarketChartEpochMillis | null {
  const timestamp = Date.parse(value)

  if (!Number.isFinite(timestamp)) {
    return null
  }

  return timestamp
}

function getDominantDirection(
  annotations: MarketChartAnnotationResponse[]
): MarketChartAnnotationDirection | null {
  const directions = annotations
    .map((annotation) => annotation.direction)
    .filter((direction): direction is MarketChartAnnotationDirection => !!direction)

  if (!directions.length) {
    return null
  }

  const firstDirection = directions[0]

  return directions.every((direction) => direction === firstDirection)
    ? firstDirection
    : "MIXED"
}

function hasHighPriorityAnnotation(annotations: MarketChartAnnotationResponse[]) {
  return annotations.some((annotation) => {
    const severity = annotation.severity?.toUpperCase()

    return severity
      ? ["HIGH", "CRITICAL", "IMPORTANT", "SEVERE"].some((keyword) =>
          severity.includes(keyword)
        )
      : false
  })
}

function resolveNearestCandleTime(
  annotationTime: MarketChartEpochMillis,
  candleTimes: MarketChartEpochMillis[]
) {
  if (!candleTimes.length) {
    return null
  }

  const annotationTimestamp = Number(annotationTime)
  const firstTime = Number(candleTimes[0])
  const lastTime = Number(candleTimes[candleTimes.length - 1])

  if (annotationTimestamp < firstTime || annotationTimestamp > lastTime) {
    return null
  }

  let left = 0
  let right = candleTimes.length - 1

  while (left < right) {
    const middle = Math.floor((left + right) / 2)

    if (Number(candleTimes[middle]) < annotationTimestamp) {
      left = middle + 1
    } else {
      right = middle
    }
  }

  const current = candleTimes[left]
  const previous = left > 0 ? candleTimes[left - 1] : current

  return Math.abs(Number(previous) - annotationTimestamp) <=
    Math.abs(Number(current) - annotationTimestamp)
    ? previous
    : current
}

export function createMarketChartAnnotationGroups(
  annotations: MarketChartAnnotationResponse[],
  candles: MarketChartCandleItemResponse[]
): MarketChartAnnotationGroup[] {
  const candleTimes = candles
    .map((candle) => toMarketChartEpochMillis(candle.time))
    .filter((time): time is MarketChartEpochMillis => time !== null)
    .sort((left, right) => Number(left) - Number(right))
  const candlesByTime = new Map<number, MarketChartCandleItemResponse>()
  const groupsByTime = new Map<number, MarketChartAnnotationResponse[]>()

  for (const candle of candles) {
    const time = toMarketChartEpochMillis(candle.time)

    if (time) {
      candlesByTime.set(Number(time), candle)
    }
  }

  for (const annotation of annotations) {
    const annotationTime = toMarketChartEpochMillis(annotation.time)

    if (!annotationTime) {
      continue
    }

    const candleTime = resolveNearestCandleTime(annotationTime, candleTimes)

    if (!candleTime) {
      continue
    }

    const key = Number(candleTime)
    const group = groupsByTime.get(key) ?? []

    group.push(annotation)
    groupsByTime.set(key, group)
  }

  return [...groupsByTime.entries()]
    .sort(([left], [right]) => left - right)
    .map(([time, groupedAnnotations]) => {
      const direction = getDominantDirection(groupedAnnotations)
      const candle = candlesByTime.get(time)
      const id = `annotation-${time}`

      return {
        id,
        time,
        anchorPrice: candle?.high ?? candle?.close ?? 0,
        direction,
        annotations: groupedAnnotations,
        priority:
          groupedAnnotations.length > 1 || hasHighPriorityAnnotation(groupedAnnotations)
            ? "high"
            : "normal",
      }
    })
}
