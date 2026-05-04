"use client"

import { useEffect, useRef } from "react"
import {
  CandlestickSeries,
  ColorType,
  createChart,
  CrosshairMode,
  HistogramSeries,
  type CandlestickData,
  type HistogramData,
  type UTCTimestamp,
} from "lightweight-charts"
import { useTheme } from "next-themes"

import { MarketChartCandleItemResponse } from "@/app/lib/market-charts/definitions"

interface MarketChartCanvasProps {
  candles: MarketChartCandleItemResponse[]
}

function toUtcTimestamp(value: string): UTCTimestamp | null {
  const timestamp = Math.floor(Date.parse(value) / 1000)

  if (!Number.isFinite(timestamp)) {
    return null
  }

  return timestamp as UTCTimestamp
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
  } catch (err) {
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

function createCandlestickData(
  candles: MarketChartCandleItemResponse[]
): CandlestickData[] {
  const dataByTime = new Map<number, CandlestickData>()

  for (const candle of candles) {
    const time = toUtcTimestamp(candle.time)

    if (!time) {
      continue
    }

    dataByTime.set(time, {
      time,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
    })
  }

  return [...dataByTime.values()].sort((left, right) => {
    return Number(left.time) - Number(right.time)
  })
}

function createVolumeData(candles: MarketChartCandleItemResponse[]): HistogramData[] {
  return candles.flatMap((candle) => {
    const time = toUtcTimestamp(candle.time)

    if (!time || typeof candle.volume !== "number") {
      return []
    }

    return [
      {
        time,
        value: candle.volume,
        color:
          candle.close >= candle.open
            ? "rgba(20, 148, 126, 0.35)"
            : "rgba(220, 38, 38, 0.32)",
      },
    ]
  })
}

export function MarketChartCanvas({ candles }: MarketChartCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const backgroundColor = getCssVariable("--card", "#ffffff")
    const textColor = getCssVariable("--muted-foreground", "#737373")
    const borderColor = getCssVariable("--border", "#e5e5e5")
    const upColor = getCssVariable("--chart-2", "#14947e")
    const downColor = getCssVariable("--destructive", "#dc2626")
    const chart = createChart(container, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      grid: {
        vertLines: { color: borderColor },
        horzLines: { color: borderColor },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
      },
      rightPriceScale: {
        borderColor,
        scaleMargins: {
          top: 0.08,
          bottom: 0.24,
        },
      },
      timeScale: {
        borderColor,
        timeVisible: true,
        secondsVisible: false,
      },
    })
    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor,
      downColor,
      borderUpColor: upColor,
      borderDownColor: downColor,
      wickUpColor: upColor,
      wickDownColor: downColor,
    })
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: {
        type: "volume",
      },
      priceScaleId: "volume",
    })
    const candleData = createCandlestickData(candles)
    const volumeData = createVolumeData(candles)

    candleSeries.setData(candleData)
    volumeSeries.setData(volumeData)
    chart.priceScale("volume").applyOptions({
      scaleMargins: {
        top: 0.78,
        bottom: 0,
      },
    })
    chart.timeScale().fitContent()

    return () => {
      chart.remove()
    }
  }, [candles, resolvedTheme])

  return <div ref={containerRef} className="h-[520px] min-h-[420px] w-full" />
}
