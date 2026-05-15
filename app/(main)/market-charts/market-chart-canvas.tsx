"use client"

import { useEffect, useRef, useState } from "react"
import {
  dispose,
  init,
  type Chart,
  type DataLoaderGetBarsParams,
  type DeepPartial,
  type KLineData,
  type Period,
  type Styles,
} from "klinecharts"
import { useTheme } from "next-themes"

import type { ActionResult } from "@/app/lib/definitions"
import type {
  MarketChartAnnotationResponse,
  MarketChartCandleItemResponse,
  MarketChartCandleRequest,
  MarketChartCandleResponse,
  MarketChartTimeframe,
} from "@/app/lib/market-charts/definitions"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

import {
  mergeMarketChartAnnotations,
  type MarketChartAnnotationGroup,
  type MarketChartAnnotationMarkerPoint,
  toMarketChartEpochMillis,
} from "./market-chart-annotations"

export interface MarketChartLoadedData {
  annotations: MarketChartAnnotationResponse[]
  candles: MarketChartCandleItemResponse[]
  from: string | null
}

interface MarketChartCanvasProps {
  assetId: number
  candles: MarketChartCandleItemResponse[]
  timeframe: MarketChartTimeframe
  symbol?: string
  annotations?: MarketChartAnnotationResponse[]
  annotationGroups?: MarketChartAnnotationGroup[]
  includeAnnotations: boolean
  resetKey: string
  selectedAnnotationGroupId?: string | null
  onAnnotationSelect?: (
    groupId: string,
    point: MarketChartAnnotationMarkerPoint
  ) => void
  onLoadedDataChange?: (data: MarketChartLoadedData) => void
  onLoadOlderCandles: (
    request: MarketChartCandleRequest
  ) => Promise<ActionResult<MarketChartCandleResponse>>
}

interface MarkerPosition {
  group: MarketChartAnnotationGroup
  x: number
  y: number
}

type LazyHistoryState = "idle" | "loading" | "error"

interface LazyHistoryFeedback {
  error: string | null
  resetKey: string
  state: LazyHistoryState
}

const CANDLE_PANE_ID = "candle_pane"
const VOLUME_PANE_ID = "market-chart-volume"
const MINUTE_MS = 60 * 1000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

const TIMEFRAME_INTERVAL_MS: Record<MarketChartTimeframe, number> = {
  "1m": MINUTE_MS,
  "5m": 5 * MINUTE_MS,
  "15m": 15 * MINUTE_MS,
  "30m": 30 * MINUTE_MS,
  "1h": HOUR_MS,
  "1d": DAY_MS,
  "1w": 7 * DAY_MS,
  "1mo": 30 * DAY_MS,
}

const LAZY_HISTORY_BAR_TARGET: Record<MarketChartTimeframe, number> = {
  "1m": 360,
  "5m": 288,
  "15m": 288,
  "30m": 240,
  "1h": 240,
  "1d": 180,
  "1w": 104,
  "1mo": 60,
}

const colorCache = new Map<string, string>()

function resolveColor(color: string): string {
  if (typeof window === "undefined" || !color) return color
  if (colorCache.has(color)) return colorCache.get(color)!

  try {
    const canvas = document.createElement("canvas")
    canvas.width = 1
    canvas.height = 1
    const ctx = canvas.getContext("2d", { willReadFrequently: true })
    if (!ctx) return color

    ctx.fillStyle = color
    ctx.fillRect(0, 0, 1, 1)

    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data
    const result =
      a === 255
        ? `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
        : `rgba(${r}, ${g}, ${b}, ${a / 255})`

    colorCache.set(color, result)
    return result
  } catch {
    return color
  }
}

function getCssVariable(name: string, fallback: string) {
  if (typeof window === "undefined") {
    return fallback
  }

  const value =
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fallback

  return resolveColor(value)
}

function getCssTextVariable(name: string, fallback: string) {
  if (typeof window === "undefined") {
    return fallback
  }

  return (
    getComputedStyle(document.documentElement).getPropertyValue(name).trim() ||
    fallback
  )
}

function getCandleTimestamp(candle: MarketChartCandleItemResponse) {
  return toMarketChartEpochMillis(candle.time)
}

function normalizeCandleItems(
  candles: MarketChartCandleItemResponse[]
): MarketChartCandleItemResponse[] {
  const candlesByTime = new Map<number, MarketChartCandleItemResponse>()

  for (const candle of candles) {
    const timestamp = getCandleTimestamp(candle)

    if (timestamp !== null) {
      candlesByTime.set(timestamp, candle)
    }
  }

  return [...candlesByTime.entries()]
    .sort(([left], [right]) => left - right)
    .map(([, candle]) => candle)
}

function mergeCandleItems(
  current: MarketChartCandleItemResponse[],
  incoming: MarketChartCandleItemResponse[]
) {
  return normalizeCandleItems([...current, ...incoming])
}

function createKLineData(candles: MarketChartCandleItemResponse[]): KLineData[] {
  return normalizeCandleItems(candles).flatMap((candle) => {
    const timestamp = getCandleTimestamp(candle)

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
        ...(typeof candle.volume === "number" ? { volume: candle.volume } : {}),
      },
    ]
  })
}

function createKLinePeriod(timeframe: MarketChartTimeframe): Period {
  switch (timeframe) {
    case "1m":
      return { type: "minute", span: 1 }
    case "5m":
      return { type: "minute", span: 5 }
    case "15m":
      return { type: "minute", span: 15 }
    case "30m":
      return { type: "minute", span: 30 }
    case "1h":
      return { type: "hour", span: 1 }
    case "1d":
      return { type: "day", span: 1 }
    case "1w":
      return { type: "week", span: 1 }
    case "1mo":
      return { type: "month", span: 1 }
    default:
      return { type: "hour", span: 1 }
  }
}

function createOlderHistoryRequest({
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

function getOldestLoadedTimestamp(candles: MarketChartCandleItemResponse[]) {
  const [oldestCandle] = normalizeCandleItems(candles)

  return oldestCandle ? getCandleTimestamp(oldestCandle) : null
}

function getNewOlderCandles(
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

function createChartStyles(): DeepPartial<Styles> {
  const textColor = getCssVariable("--muted-foreground", "#737373")
  const borderColor = getCssVariable("--muted-foreground", "#737373")
  const upColor = getCssVariable("--chart-2", "#14947e")
  const downColor = getCssVariable("--destructive", "#dc2626")
  const fontFamily = getCssTextVariable(
    "--font-sans",
    "Geist, sans-serif"
  )

  return {
    grid: {
      horizontal: {
        color: borderColor,
        dashedValue: [4, 4],
        show: true,
        size: 0.25,
        style: "dashed",
      },
      vertical: {
        color: borderColor,
        dashedValue: [4, 4],
        show: true,
        size: 0.25,
        style: "dashed",
      },
    },
    candle: {
      bar: {
        compareRule: "current_open",
        downBorderColor: downColor,
        downColor,
        downWickColor: downColor,
        noChangeBorderColor: textColor,
        noChangeColor: textColor,
        noChangeWickColor: textColor,
        upBorderColor: upColor,
        upColor,
        upWickColor: upColor,
      },
      priceMark: {
        high: {
          show: false,
        },
        low: {
          show: false,
        },
        last: {
          line: {
            size: 1
          },
          text: {
            family: fontFamily,
            size: 10,
          },
        },
      },
      tooltip: {
        legend: {
          family: fontFamily,
        },
        title: {
          family: fontFamily,
          show: false,
        },
      },
    },
    indicator: {
      ohlc: {
        compareRule: "current_open",
        downColor: "rgba(220, 38, 38, 0.32)",
        noChangeColor: "rgba(115, 115, 115, 0.28)",
        upColor: "rgba(20, 148, 126, 0.35)",
      },
      tooltip: {
        legend: {
          family: fontFamily,
        },
        title: {
          family: fontFamily,
        },
      },
    },
    xAxis: {
      axisLine: {
        color: borderColor,
        size: 1,
      },
      tickText: {
        color: textColor,
        family: fontFamily,
      },
    },
    yAxis: {
      axisLine: {
        color: borderColor,
        size: 1,
      },
      tickText: {
        color: textColor,
        family: fontFamily,
      },
    },
    crosshair: {
      horizontal: {
        line: {
          color: textColor,
        },
        text: {
          backgroundColor: getCssVariable("--foreground", "#171717"),
          color: getCssVariable("--background", "#ffffff"),
          family: fontFamily,
        },
      },
      vertical: {
        line: {
          color: textColor,
        },
        text: {
          backgroundColor: getCssVariable("--foreground", "#171717"),
          color: getCssVariable("--background", "#ffffff"),
          family: fontFamily,
        },
      },
    },
  }
}

function getMarkerCoordinate(
  chart: Chart,
  group: MarketChartAnnotationGroup
): MarketChartAnnotationMarkerPoint | null {
  const coordinate = chart.convertToPixel(
    {
      timestamp: group.time,
      value: group.anchorPrice,
    },
    {
      absolute: true,
      paneId: CANDLE_PANE_ID,
    }
  )

  if (Array.isArray(coordinate)) {
    return null
  }

  if (typeof coordinate.x !== "number" || typeof coordinate.y !== "number") {
    return null
  }

  return {
    x: coordinate.x,
    y: coordinate.y,
  }
}

export function MarketChartCanvas({
  annotations = [],
  annotationGroups = [],
  assetId,
  candles,
  includeAnnotations,
  onAnnotationSelect,
  onLoadedDataChange,
  onLoadOlderCandles,
  resetKey,
  selectedAnnotationGroupId,
  symbol = "MARKET",
  timeframe,
}: MarketChartCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<Chart | null>(null)
  const activeResetKeyRef = useRef(resetKey)
  const annotationGroupsRef = useRef(annotationGroups)
  const loadedAnnotationsRef = useRef<MarketChartAnnotationResponse[]>([])
  const loadedCandlesRef = useRef<MarketChartCandleItemResponse[]>([])
  const historyExhaustedRef = useRef(false)
  const onLoadedDataChangeRef = useRef(onLoadedDataChange)
  const onLoadOlderCandlesRef = useRef(onLoadOlderCandles)
  const scheduleMarkerPositionUpdateRef = useRef<() => void>(() => { })
  const [historyFeedback, setHistoryFeedback] = useState<LazyHistoryFeedback>({
    error: null,
    resetKey,
    state: "idle",
  })
  const [markerPositions, setMarkerPositions] = useState<MarkerPosition[]>([])
  const { resolvedTheme } = useTheme()
  const historyState =
    historyFeedback.resetKey === resetKey ? historyFeedback.state : "idle"
  const historyError =
    historyFeedback.resetKey === resetKey ? historyFeedback.error : null

  useEffect(() => {
    annotationGroupsRef.current = annotationGroups
    scheduleMarkerPositionUpdateRef.current()
  }, [annotationGroups])

  useEffect(() => {
    onLoadedDataChangeRef.current = onLoadedDataChange
  }, [onLoadedDataChange])

  useEffect(() => {
    onLoadOlderCandlesRef.current = onLoadOlderCandles
  }, [onLoadOlderCandles])

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    let disposed = false
    activeResetKeyRef.current = resetKey
    historyExhaustedRef.current = false
    loadedAnnotationsRef.current = includeAnnotations ? annotations : []
    loadedCandlesRef.current = normalizeCandleItems(candles)

    const chart = init(container, {
      layout: [
        {
          type: "candle",
          options: {
            axis: {
              gap: {
                bottom: 0.22,
                top: 0.08,
              },
            },
            id: CANDLE_PANE_ID,
          },
        },
        {
          content: ["VOL"],
          options: {
            dragEnabled: false,
            height: 92,
            id: VOLUME_PANE_ID,
            minHeight: 64,
          },
          type: "indicator",
        },
        {
          type: "xAxis",
        },
      ],
      locale: "en-US",
      styles: createChartStyles(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      zoomAnchor: "cursor",
    })

    if (!chart) {
      return
    }

    chartRef.current = chart

    const period = createKLinePeriod(timeframe)

    const updateMarkerPositions = () => {
      const currentChart = chartRef.current
      const currentContainer = containerRef.current

      if (!currentChart || !currentContainer) {
        return
      }

      const nextPositions = annotationGroupsRef.current.flatMap((group) => {
        const point = getMarkerCoordinate(currentChart, group)

        if (!point) {
          return []
        }

        return [
          {
            group,
            x: Math.max(18, Math.min(currentContainer.clientWidth - 18, point.x)),
            y: Math.max(
              24,
              Math.min(currentContainer.clientHeight - 92, point.y - 18)
            ),
          },
        ]
      })

      setMarkerPositions(nextPositions)
    }

    const scheduleMarkerPositionUpdate = () => {
      window.requestAnimationFrame(updateMarkerPositions)
    }

    async function loadBars({
      callback,
      timestamp,
      type,
    }: DataLoaderGetBarsParams) {
      if (type === "init") {
        callback(createKLineData(loadedCandlesRef.current), {
          // KLineChart v10 uses `forward` for the left-edge prepend path.
          backward: false,
          forward: loadedCandlesRef.current.length > 0,
        })
        scheduleMarkerPositionUpdate()
        return
      }

      if (type !== "forward") {
        callback([], {
          backward: false,
          forward: !historyExhaustedRef.current,
        })
        return
      }

      if (historyExhaustedRef.current) {
        callback([], {
          backward: false,
          forward: false,
        })
        return
      }

      const oldestTimestamp =
        timestamp ?? getOldestLoadedTimestamp(loadedCandlesRef.current)
      const request = oldestTimestamp !== null
        ? createOlderHistoryRequest({
          assetId,
          includeAnnotations,
          oldestTimestamp,
          timeframe,
        })
        : null

      if (oldestTimestamp === null || !request) {
        historyExhaustedRef.current = true
        callback([], {
          backward: false,
          forward: false,
        })
        return
      }

      const requestResetKey = activeResetKeyRef.current
      setHistoryFeedback({
        error: null,
        resetKey: requestResetKey,
        state: "loading",
      })

      const result = await onLoadOlderCandlesRef.current(request)

      if (disposed || activeResetKeyRef.current !== requestResetKey) {
        return
      }

      if (!result.success) {
        setHistoryFeedback({
          error: result.error,
          resetKey: requestResetKey,
          state: "error",
        })
        callback([], {
          backward: false,
          forward: true,
        })
        return
      }

      const olderCandles = getNewOlderCandles(
        loadedCandlesRef.current,
        result.data.candles,
        oldestTimestamp
      )
      const olderData = createKLineData(olderCandles)

      if (!olderData.length) {
        historyExhaustedRef.current = true
        setHistoryFeedback({
          error: null,
          resetKey: requestResetKey,
          state: "idle",
        })
        callback([], {
          backward: false,
          forward: false,
        })
        return
      }

      loadedCandlesRef.current = mergeCandleItems(
        loadedCandlesRef.current,
        olderCandles
      )

      if (includeAnnotations) {
        loadedAnnotationsRef.current = mergeMarketChartAnnotations(
          loadedAnnotationsRef.current,
          result.data.annotations
        )
      }

      onLoadedDataChangeRef.current?.({
        annotations: loadedAnnotationsRef.current,
        candles: loadedCandlesRef.current,
        from: loadedCandlesRef.current[0]?.time ?? result.data.from,
      })
      setHistoryFeedback({
        error: null,
        resetKey: requestResetKey,
        state: "idle",
      })
      callback(olderData, {
        backward: false,
        forward: true,
      })
      scheduleMarkerPositionUpdate()
    }

    scheduleMarkerPositionUpdateRef.current = scheduleMarkerPositionUpdate

    chart.setDataLoader({
      getBars(params) {
        void loadBars(params)
      },
    })
    chart.setSymbol({
      ticker: symbol,
      pricePrecision: 4,
      volumePrecision: 2,
    })
    chart.setPeriod(period)
    chart.setOffsetRightDistance(24)
    chart.setLeftMinVisibleBarCount(8)
    chart.setRightMinVisibleBarCount(8)
    chart.subscribeAction("onVisibleRangeChange", scheduleMarkerPositionUpdate)
    chart.subscribeAction("onScroll", scheduleMarkerPositionUpdate)
    chart.subscribeAction("onZoom", scheduleMarkerPositionUpdate)

    const frameId = window.requestAnimationFrame(updateMarkerPositions)
    const resizeObserver = new ResizeObserver(() => {
      chart.resize()
      scheduleMarkerPositionUpdate()
    })

    resizeObserver.observe(container)

    return () => {
      disposed = true
      window.cancelAnimationFrame(frameId)
      chart.unsubscribeAction("onVisibleRangeChange", scheduleMarkerPositionUpdate)
      chart.unsubscribeAction("onScroll", scheduleMarkerPositionUpdate)
      chart.unsubscribeAction("onZoom", scheduleMarkerPositionUpdate)
      resizeObserver.disconnect()
      scheduleMarkerPositionUpdateRef.current = () => { }
      chartRef.current = null
      setMarkerPositions([])
      dispose(chart)
    }
  }, [
    annotations,
    assetId,
    candles,
    includeAnnotations,
    resetKey,
    resolvedTheme,
    symbol,
    timeframe,
  ])

  return (
    <div className="relative h-[520px] min-h-[420px] w-full">
      <div ref={containerRef} className="absolute inset-0" />
      {historyState !== "idle" ? (
        <div
          className={cn(
            "pointer-events-none absolute bottom-3 left-3 z-20 flex max-w-[calc(100%-1.5rem)] items-center gap-2 rounded-full border bg-background/95 px-3 py-1.5 text-xs font-medium shadow-sm backdrop-blur",
            historyState === "error"
              ? "border-destructive/30 text-destructive"
              : "text-muted-foreground"
          )}
        >
          {historyState === "loading" ? (
            <>
              <Spinner className="size-3" />
              <span>Đang tải lịch sử...</span>
            </>
          ) : (
            <span>
              {historyError || "Chưa tải được lịch sử. Kéo lại để thử."}
            </span>
          )}
        </div>
      ) : null}
      {markerPositions.map(({ group, x, y }) => {
        const selected = selectedAnnotationGroupId === group.id
        const emphasized = selected || group.priority === "high"
        const count = group.annotations.length

        return (
          <button
            key={group.id}
            type="button"
            aria-label={
              count > 1
                ? `Mở ${count} sự kiện tại ${group.annotations[0]?.time}`
                : `Mở sự kiện ${group.annotations[0]?.title || ""}`
            }
            aria-pressed={selected}
            className="group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            style={{ left: x, top: y }}
            onClick={(event) => {
              event.stopPropagation()
              onAnnotationSelect?.(group.id, { x, y })
            }}
          >
            <span
              className={
                emphasized
                  ? "market-chart-annotation-pulse absolute size-9 rounded-full bg-destructive/25"
                  : "market-chart-annotation-pulse absolute size-7 rounded-full bg-destructive/20"
              }
            />
            <span
              className={
                count > 1
                  ? "relative flex size-6 items-center justify-center rounded-full border-2 border-background bg-destructive text-[11px] font-semibold text-destructive-foreground shadow-lg ring-2 ring-destructive/30"
                  : "relative block size-4 rounded-full border-2 border-background bg-destructive shadow-lg ring-2 ring-destructive/30 group-aria-pressed:ring-4"
              }
            >
              {count > 1 ? count : null}
            </span>
          </button>
        )
      })}
      <style>
        {`
          @media (prefers-reduced-motion: no-preference) {
            .market-chart-annotation-pulse {
              animation: market-chart-annotation-pulse 2s ease-out infinite;
            }
          }

          @keyframes market-chart-annotation-pulse {
            0% {
              opacity: 0.75;
              transform: scale(0.55);
            }
            70% {
              opacity: 0;
              transform: scale(1.35);
            }
            100% {
              opacity: 0;
              transform: scale(1.35);
            }
          }
        `}
      </style>
    </div>
  )
}
