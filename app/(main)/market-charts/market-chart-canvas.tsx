"use client"

import { useEffect, useRef, useState } from "react"
import {
  dispose,
  init,
  type Chart,
  type DeepPartial,
  type KLineData,
  type Period,
  type Styles,
} from "klinecharts"
import { useTheme } from "next-themes"

import {
  MarketChartCandleItemResponse,
  MarketChartTimeframe,
} from "@/app/lib/market-charts/definitions"

import {
  type MarketChartAnnotationGroup,
  type MarketChartAnnotationMarkerPoint,
  toMarketChartEpochMillis,
} from "./market-chart-annotations"

interface MarketChartCanvasProps {
  candles: MarketChartCandleItemResponse[]
  timeframe: MarketChartTimeframe
  symbol?: string
  annotationGroups?: MarketChartAnnotationGroup[]
  selectedAnnotationGroupId?: string | null
  onAnnotationSelect?: (
    groupId: string,
    point: MarketChartAnnotationMarkerPoint
  ) => void
}

interface MarkerPosition {
  group: MarketChartAnnotationGroup
  x: number
  y: number
}

const CANDLE_PANE_ID = "candle_pane"
const VOLUME_PANE_ID = "market-chart-volume"

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

function createKLineData(candles: MarketChartCandleItemResponse[]): KLineData[] {
  const dataByTime = new Map<number, KLineData>()

  for (const candle of candles) {
    const timestamp = toMarketChartEpochMillis(candle.time)

    if (!timestamp) {
      continue
    }

    dataByTime.set(timestamp, {
      timestamp,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      ...(typeof candle.volume === "number" ? { volume: candle.volume } : {}),
    })
  }

  return [...dataByTime.values()].sort((left, right) => {
    return left.timestamp - right.timestamp
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

function createChartStyles(): DeepPartial<Styles> {
  const textColor = getCssVariable("--muted-foreground", "#737373")
  const borderColor = getCssVariable("--border", "#e5e5e5")
  const upColor = getCssVariable("--chart-2", "#14947e")
  const downColor = getCssVariable("--destructive", "#dc2626")

  return {
    grid: {
      horizontal: {
        color: borderColor,
        show: true,
        size: 1,
        style: "solid",
      },
      vertical: {
        color: borderColor,
        show: true,
        size: 1,
        style: "solid",
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
    },
    indicator: {
      ohlc: {
        compareRule: "current_open",
        downColor: "rgba(220, 38, 38, 0.32)",
        noChangeColor: "rgba(115, 115, 115, 0.28)",
        upColor: "rgba(20, 148, 126, 0.35)",
      },
    },
    xAxis: {
      axisLine: {
        color: borderColor,
        size: 1,
      },
      tickText: {
        color: textColor,
      },
    },
    yAxis: {
      axisLine: {
        color: borderColor,
        size: 1,
      },
      tickText: {
        color: textColor,
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
        },
      },
      vertical: {
        line: {
          color: textColor,
        },
        text: {
          backgroundColor: getCssVariable("--foreground", "#171717"),
          color: getCssVariable("--background", "#ffffff"),
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
  candles,
  timeframe,
  symbol = "MARKET",
  annotationGroups = [],
  selectedAnnotationGroupId,
  onAnnotationSelect,
}: MarketChartCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [markerPositions, setMarkerPositions] = useState<MarkerPosition[]>([])
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

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

    const data = createKLineData(candles)
    const period = createKLinePeriod(timeframe)

    const updateMarkerPositions = () => {
      const nextPositions = annotationGroups.flatMap((group) => {
        const point = getMarkerCoordinate(chart, group)

        if (!point) {
          return []
        }

        return [
          {
            group,
            x: Math.max(18, Math.min(container.clientWidth - 18, point.x)),
            y: Math.max(24, Math.min(container.clientHeight - 92, point.y - 18)),
          },
        ]
      })

      setMarkerPositions(nextPositions)
    }

    const scheduleMarkerPositionUpdate = () => {
      window.requestAnimationFrame(updateMarkerPositions)
    }

    chart.setDataLoader({
      getBars({ type, callback }) {
        callback(type === "init" ? data : [], {
          backward: false,
          forward: false,
        })
        scheduleMarkerPositionUpdate()
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
      window.cancelAnimationFrame(frameId)
      chart.unsubscribeAction("onVisibleRangeChange", scheduleMarkerPositionUpdate)
      chart.unsubscribeAction("onScroll", scheduleMarkerPositionUpdate)
      chart.unsubscribeAction("onZoom", scheduleMarkerPositionUpdate)
      resizeObserver.disconnect()
      setMarkerPositions([])
      dispose(chart)
    }
  }, [annotationGroups, candles, resolvedTheme, symbol, timeframe])

  return (
    <div className="relative h-[520px] min-h-[420px] w-full">
      <div ref={containerRef} className="absolute inset-0" />
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
