"use client"

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react"
import {
  dispose,
  getSupportedLocales,
  init,
  registerLocale,
  type Chart,
  type DataLoaderGetBarsParams,
  type DeepPartial,
  type KLineData,
  type LayoutChild,
  type Locales,
  type OverlayStyle,
  type Period,
  type Styles,
} from "klinecharts"
import { useTheme } from "next-themes"

import type { ActionResult } from "@/app/lib/definitions"
import { useLocalization } from "@/app/lib/i18n/provider"
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
import {
  createMarketChartDrawingGroupId,
  createMarketChartDrawingMode,
  createMarketChartDrawingOverlay,
  registerMarketChartDrawingOverlays,
  type MarketChartDrawingTool,
} from "./market-chart-drawing"

export interface MarketChartLoadedData {
  annotations: MarketChartAnnotationResponse[]
  candles: MarketChartCandleItemResponse[]
  from: string | null
}

export type MarketChartIndicatorName =
  | "MA"
  | "EMA"
  | "BOLL"
  | "MACD"
  | "RSI"
  | "KDJ"

export interface MarketChartCanvasHandle {
  clearDrawings: () => boolean
  captureScreenshot: () => string | null
  deleteSelectedDrawing: () => boolean
  resize: () => void
  setDrawingMagnet: (enabled: boolean) => boolean
  setDrawingsLocked: (locked: boolean) => boolean
  setDrawingsVisible: (visible: boolean) => boolean
  setDrawingTool: (tool: MarketChartDrawingTool | null) => boolean
  setIndicators: (indicators: MarketChartIndicatorName[]) => boolean
}

interface MarketChartCanvasProps {
  assetId: number
  candles: MarketChartCandleItemResponse[]
  timeframe: MarketChartTimeframe
  symbol?: string
  annotations?: MarketChartAnnotationResponse[]
  annotationGroups?: MarketChartAnnotationGroup[]
  includeAnnotations: boolean
  liveCandle?: MarketChartCandleItemResponse | null
  resetKey: string
  selectedAnnotationGroupId?: string | null
  showVolumePane: boolean
  activeIndicators?: MarketChartIndicatorName[]
  className?: string
  drawingToolActive?: boolean
  onAnnotationSelect?: (
    groupId: string,
    point: MarketChartAnnotationMarkerPoint
  ) => void
  onDrawingSelectionChange?: (hasSelectedDrawing: boolean) => void
  onDrawingToolComplete?: () => void
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

type AnnotationMarkerColorClassNames = {
  dot: string
  foreground: string
  pulse: string
  ring: string
}

type ChartThemeMode = "light" | "dark"

type MarketChartThemePalette = {
  axis: string
  crosshairBackground: string
  crosshairText: string
  down: string
  drawing: string
  drawingMuted: string
  drawingSelected: string
  grid: string
  noChange: string
  up: string
  volumeDown: string
  volumeNoChange: string
  volumeUp: string
}

function getAnnotationMarkerColorClassNames(
  direction: MarketChartAnnotationGroup["direction"]
): AnnotationMarkerColorClassNames {
  switch (direction) {
    case "BULLISH":
      return {
        dot: "bg-emerald-500",
        foreground: "text-white",
        pulse: "bg-emerald-500/20",
        ring: "ring-emerald-500/30",
      }
    case "BEARISH":
      return {
        dot: "bg-destructive",
        foreground: "text-destructive-foreground",
        pulse: "bg-destructive/20",
        ring: "ring-destructive/30",
      }
    case "NEUTRAL":
      return {
        dot: "bg-amber-500",
        foreground: "text-white",
        pulse: "bg-amber-500/20",
        ring: "ring-amber-500/30",
      }
    case "MIXED":
      return {
        dot: "bg-orange-500",
        foreground: "text-white",
        pulse: "bg-orange-500/20",
        ring: "ring-orange-500/30",
      }
    default:
      return {
        dot: "bg-muted-foreground",
        foreground: "text-background",
        pulse: "bg-muted-foreground/20",
        ring: "ring-muted-foreground/30",
      }
  }
}

interface LazyHistoryFeedback {
  error: string | null
  resetKey: string
  state: LazyHistoryState
}

const CANDLE_PANE_ID = "candle_pane"
const VOLUME_PANE_ID = "market-chart-volume"
const MARKET_CHART_INDICATORS: MarketChartIndicatorName[] = [
  "MA",
  "EMA",
  "BOLL",
  "MACD",
  "RSI",
  "KDJ",
]
const MARKET_CHART_MAIN_PANE_INDICATORS = new Set<MarketChartIndicatorName>([
  "MA",
  "EMA",
  "BOLL",
])
const MINUTE_MS = 60 * 1000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS
const MARKER_DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
}

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

const KLINE_CHART_VI_LOCALE: Locales = {
  change: "Thay đổi: ",
  close: "Đóng: ",
  day: "ngày",
  high: "Cao: ",
  hour: "giờ",
  low: "Thấp: ",
  minute: "phút",
  month: "tháng",
  open: "Mở: ",
  second: "giây",
  time: "Thời gian: ",
  turnover: "Giá trị: ",
  volume: "Khối lượng: ",
  week: "tuần",
  year: "năm",
}

let kLineChartLocalesRegistered = false

function ensureKLineChartLocales() {
  if (kLineChartLocalesRegistered) {
    return
  }

  registerLocale("vi-VN", KLINE_CHART_VI_LOCALE)
  registerLocale("vi", KLINE_CHART_VI_LOCALE)
  kLineChartLocalesRegistered = true
}

function resolveKLineChartLocale(locale: string) {
  ensureKLineChartLocales()

  return getSupportedLocales().includes(locale) ? locale : "en-US"
}

function resolveChartThemeMode(theme: string | undefined): ChartThemeMode {
  return theme === "dark" ? "dark" : "light"
}

const MARKET_CHART_THEME_PALETTES: Record<
  ChartThemeMode,
  MarketChartThemePalette
> = {
  light: {
    axis: "#737373",
    crosshairBackground: "#171717",
    crosshairText: "#ffffff",
    down: "#dc2626",
    drawing: "#2563eb",
    drawingMuted: "rgba(37, 99, 235, 0.55)",
    drawingSelected: "#1d4ed8",
    grid: "rgba(115, 115, 115, 0.18)",
    noChange: "#737373",
    up: "#14947e",
    volumeDown: "rgba(220, 38, 38, 0.32)",
    volumeNoChange: "rgba(115, 115, 115, 0.28)",
    volumeUp: "rgba(20, 148, 126, 0.35)",
  },
  dark: {
    axis: "#a1a1aa",
    crosshairBackground: "#fafafa",
    crosshairText: "#171717",
    down: "#ef4444",
    drawing: "#60a5fa",
    drawingMuted: "rgba(96, 165, 250, 0.6)",
    drawingSelected: "#93c5fd",
    grid: "rgba(250, 250, 250, 0.1)",
    noChange: "#a1a1aa",
    up: "#14b8a6",
    volumeDown: "rgba(239, 68, 68, 0.32)",
    volumeNoChange: "rgba(161, 161, 170, 0.24)",
    volumeUp: "rgba(20, 184, 166, 0.34)",
  },
}

function getMarketChartThemePalette(
  mode: ChartThemeMode
): MarketChartThemePalette {
  return MARKET_CHART_THEME_PALETTES[mode]
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isValidMarketChartCandle(
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

function getCandleTimestamp(candle: unknown) {
  if (!isValidMarketChartCandle(candle)) {
    return null
  }

  return toMarketChartEpochMillis(candle.time)
}

function normalizeCandleItems(
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

function mergeCandleItems(
  current: MarketChartCandleItemResponse[],
  incoming: MarketChartCandleItemResponse[]
) {
  return normalizeCandleItems([...current, ...incoming])
}

function getFiniteVolume(candle: MarketChartCandleItemResponse) {
  return typeof candle.volume === "number" && Number.isFinite(candle.volume)
    ? candle.volume
    : null
}

function mergeLiveCandleItem(
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

function createKLineData(
  candles: MarketChartCandleItemResponse[]
): KLineData[] {
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

function createChartStyles(
  palette: MarketChartThemePalette
): DeepPartial<Styles> {
  const fontFamily = getCssTextVariable("--font-sans", "Geist, sans-serif")

  return {
    grid: {
      horizontal: {
        color: palette.grid,
        dashedValue: [4, 4],
        show: true,
        size: 1,
        style: "dashed",
      },
      vertical: {
        color: palette.grid,
        dashedValue: [4, 4],
        show: true,
        size: 1,
        style: "dashed",
      },
    },
    candle: {
      bar: {
        compareRule: "current_open",
        downBorderColor: palette.down,
        downColor: palette.down,
        downWickColor: palette.down,
        noChangeBorderColor: palette.noChange,
        noChangeColor: palette.noChange,
        noChangeWickColor: palette.noChange,
        upBorderColor: palette.up,
        upColor: palette.up,
        upWickColor: palette.up,
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
            size: 1,
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
        downColor: palette.volumeDown,
        noChangeColor: palette.volumeNoChange,
        upColor: palette.volumeUp,
      },
      tooltip: {
        legend: {
          family: fontFamily,
        },
        title: {
          family: fontFamily,
        },
      },
      lastValueMark: {
        text: {
          family: fontFamily,
        },
      },
    },
    xAxis: {
      axisLine: {
        color: palette.grid,
        size: 1,
      },
      tickText: {
        color: palette.axis,
        family: fontFamily,
      },
    },
    yAxis: {
      axisLine: {
        color: palette.grid,
        size: 1,
      },
      tickText: {
        color: palette.axis,
        family: fontFamily,
      },
    },
    crosshair: {
      horizontal: {
        line: {
          color: palette.axis,
        },
        text: {
          backgroundColor: palette.crosshairBackground,
          color: palette.crosshairText,
          family: fontFamily,
        },
      },
      vertical: {
        line: {
          color: palette.axis,
        },
        text: {
          backgroundColor: palette.crosshairBackground,
          color: palette.crosshairText,
          family: fontFamily,
        },
      },
    },
    overlay: {
      text: {
        family: fontFamily,
        size: 12,
      },
    },
  }
}

function createDrawingOverlayStyles(
  palette: MarketChartThemePalette
): DeepPartial<OverlayStyle> {
  return {
    circle: {
      borderColor: palette.drawing,
      borderSize: 1,
      color: "transparent",
      style: "stroke",
    },
    line: {
      color: palette.drawing,
      size: 1,
      style: "solid",
    },
    point: {
      activeBorderColor: palette.drawingSelected,
      activeBorderSize: 2,
      activeColor: palette.drawingSelected,
      activeRadius: 4,
      borderColor: palette.drawingMuted,
      borderSize: 1,
      color: palette.drawing,
      radius: 3,
    },
    rect: {
      borderColor: palette.drawing,
      borderSize: 1,
      color: "transparent",
      style: "stroke",
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

function syncChartIndicators(
  chart: Chart,
  activeIndicators: MarketChartIndicatorName[]
) {
  const enabledIndicators = new Set(activeIndicators)

  for (const indicator of MARKET_CHART_INDICATORS) {
    const existingIndicators = chart.getIndicators({ name: indicator })
    const enabled = enabledIndicators.has(indicator)

    if (enabled && existingIndicators.length === 0) {
      const isMainPaneIndicator =
        MARKET_CHART_MAIN_PANE_INDICATORS.has(indicator)
      const paneOptions = isMainPaneIndicator
        ? { id: CANDLE_PANE_ID }
        : {
            height: 96,
            id: `market-chart-indicator-${indicator.toLowerCase()}`,
            minHeight: 64,
          }

      chart.createIndicator(indicator, isMainPaneIndicator, paneOptions)
      continue
    }

    if (!enabled && existingIndicators.length > 0) {
      chart.removeIndicator({ name: indicator })
    }
  }
}

export const MarketChartCanvas = forwardRef<
  MarketChartCanvasHandle,
  MarketChartCanvasProps
>(function MarketChartCanvas(
  {
    annotations = [],
    annotationGroups = [],
    assetId,
    activeIndicators = [],
    candles,
    className,
    drawingToolActive = false,
    includeAnnotations,
    liveCandle = null,
    onAnnotationSelect,
    onDrawingSelectionChange,
    onDrawingToolComplete,
    onLoadedDataChange,
    onLoadOlderCandles,
    resetKey,
    selectedAnnotationGroupId,
    showVolumePane,
    symbol = "MARKET",
    timeframe,
  },
  ref
) {
  const {
    dictionary,
    formatDateTime,
    formatMessage,
    formatNumber,
    intlLocale,
  } = useLocalization()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<Chart | null>(null)
  const activeResetKeyRef = useRef(resetKey)
  const activeDrawingDraftIdRef = useRef<string | null>(null)
  const activeDrawingToolRef = useRef<MarketChartDrawingTool | null>(null)
  const annotationsRef = useRef(annotations)
  const annotationGroupsRef = useRef(annotationGroups)
  const candlesRef = useRef(candles)
  const drawingGroupIdRef = useRef(
    createMarketChartDrawingGroupId({ assetId, timeframe })
  )
  const drawingLockedRef = useRef(false)
  const drawingMagnetRef = useRef(false)
  const drawingVisibleRef = useRef(true)
  const loadedAnnotationsRef = useRef<MarketChartAnnotationResponse[]>([])
  const loadedCandlesRef = useRef<MarketChartCandleItemResponse[]>([])
  const liveCandleRef = useRef<MarketChartCandleItemResponse | null>(liveCandle)
  const historyExhaustedRef = useRef(false)
  const onDrawingSelectionChangeRef = useRef(onDrawingSelectionChange)
  const onDrawingToolCompleteRef = useRef(onDrawingToolComplete)
  const onLoadedDataChangeRef = useRef(onLoadedDataChange)
  const onLoadOlderCandlesRef = useRef(onLoadOlderCandles)
  const scheduleMarkerPositionUpdateRef = useRef<() => void>(() => {})
  const selectedDrawingIdRef = useRef<string | null>(null)
  const [historyFeedback, setHistoryFeedback] = useState<LazyHistoryFeedback>({
    error: null,
    resetKey,
    state: "idle",
  })
  const [markerPositions, setMarkerPositions] = useState<MarkerPosition[]>([])
  const { resolvedTheme } = useTheme()
  const chartThemeMode = resolveChartThemeMode(resolvedTheme)
  const chartThemePalette = getMarketChartThemePalette(chartThemeMode)
  const historyState =
    historyFeedback.resetKey === resetKey ? historyFeedback.state : "idle"
  const historyError =
    historyFeedback.resetKey === resetKey ? historyFeedback.error : null

  useEffect(() => {
    annotationsRef.current = annotations
  }, [annotations])

  useEffect(() => {
    candlesRef.current = candles
  }, [candles])

  useEffect(() => {
    annotationGroupsRef.current = annotationGroups
    scheduleMarkerPositionUpdateRef.current()
  }, [annotationGroups])

  useEffect(() => {
    liveCandleRef.current = liveCandle
    chartRef.current?.resetData()
    scheduleMarkerPositionUpdateRef.current()
  }, [liveCandle])

  useEffect(() => {
    onLoadedDataChangeRef.current = onLoadedDataChange
  }, [onLoadedDataChange])

  useEffect(() => {
    onDrawingSelectionChangeRef.current = onDrawingSelectionChange
  }, [onDrawingSelectionChange])

  useEffect(() => {
    onDrawingToolCompleteRef.current = onDrawingToolComplete
  }, [onDrawingToolComplete])

  useEffect(() => {
    onLoadOlderCandlesRef.current = onLoadOlderCandles
  }, [onLoadOlderCandles])

  useEffect(() => {
    drawingGroupIdRef.current = createMarketChartDrawingGroupId({
      assetId,
      timeframe,
    })
  }, [assetId, timeframe])

  function clearDrawingSelection() {
    selectedDrawingIdRef.current = null
    onDrawingSelectionChangeRef.current?.(false)
  }

  function cancelActiveDrawingDraft() {
    const chart = chartRef.current
    const draftId = activeDrawingDraftIdRef.current

    if (chart && draftId) {
      chart.removeOverlay({ id: draftId })
    }

    activeDrawingDraftIdRef.current = null
    activeDrawingToolRef.current = null
  }

  function setActiveDrawingTool(tool: MarketChartDrawingTool | null) {
    const chart = chartRef.current

    if (!chart) {
      return false
    }

    cancelActiveDrawingDraft()

    if (!tool) {
      return true
    }

    const overlayId = chart.createOverlay(
      createMarketChartDrawingOverlay({
        groupId: drawingGroupIdRef.current,
        isLocked: false,
        isMagnetEnabled: drawingMagnetRef.current,
        isVisible: drawingVisibleRef.current,
        onDeselected(event) {
          if (selectedDrawingIdRef.current === event.overlay.id) {
            clearDrawingSelection()
          }
        },
        onDrawEnd(event) {
          activeDrawingDraftIdRef.current = null
          activeDrawingToolRef.current = null
          selectedDrawingIdRef.current = event.overlay.id
          if (drawingLockedRef.current) {
            event.chart.overrideOverlay({
              id: event.overlay.id,
              lock: true,
            })
          }
          onDrawingSelectionChangeRef.current?.(true)
          onDrawingToolCompleteRef.current?.()
        },
        onRemoved(event) {
          if (activeDrawingDraftIdRef.current === event.overlay.id) {
            activeDrawingDraftIdRef.current = null
          }

          if (selectedDrawingIdRef.current === event.overlay.id) {
            clearDrawingSelection()
          }
        },
        onSelected(event) {
          selectedDrawingIdRef.current = event.overlay.id
          onDrawingSelectionChangeRef.current?.(true)
        },
        paneId: CANDLE_PANE_ID,
        styles: createDrawingOverlayStyles(chartThemePalette),
        tool,
      })
    )

    if (!overlayId || Array.isArray(overlayId)) {
      return false
    }

    activeDrawingDraftIdRef.current = overlayId
    activeDrawingToolRef.current = tool
    return true
  }

  function setDrawingGroupLock(locked: boolean) {
    const chart = chartRef.current

    drawingLockedRef.current = locked

    if (!chart) {
      return false
    }

    const overlays = chart.getOverlays({ groupId: drawingGroupIdRef.current })

    if (overlays.length > 0) {
      chart.overrideOverlay({ groupId: drawingGroupIdRef.current, lock: locked })
    }

    return true
  }

  function setDrawingGroupVisibility(visible: boolean) {
    const chart = chartRef.current

    drawingVisibleRef.current = visible

    if (!chart) {
      return false
    }

    const overlays = chart.getOverlays({ groupId: drawingGroupIdRef.current })

    if (overlays.length > 0) {
      chart.overrideOverlay({
        groupId: drawingGroupIdRef.current,
        visible,
      })
    }

    return true
  }

  function setDrawingGroupMagnet(enabled: boolean) {
    const chart = chartRef.current

    drawingMagnetRef.current = enabled

    if (!chart) {
      return false
    }

    const overlays = chart.getOverlays({ groupId: drawingGroupIdRef.current })

    if (overlays.length > 0) {
      chart.overrideOverlay({
        groupId: drawingGroupIdRef.current,
        mode: createMarketChartDrawingMode(enabled),
      })
    }

    return true
  }

  function deleteSelectedDrawing() {
    const chart = chartRef.current
    const selectedDrawingId = selectedDrawingIdRef.current

    if (!chart || !selectedDrawingId) {
      return false
    }

    const removed = chart.removeOverlay({ id: selectedDrawingId })

    if (removed) {
      clearDrawingSelection()
    }

    return removed
  }

  function clearDrawings() {
    const chart = chartRef.current

    if (!chart) {
      return false
    }

    cancelActiveDrawingDraft()
    clearDrawingSelection()
    chart.removeOverlay({ groupId: drawingGroupIdRef.current })
    return true
  }

  useImperativeHandle(
    ref,
    () => ({
      clearDrawings,
      captureScreenshot() {
        return chartRef.current?.getConvertPictureUrl(true, "png") ?? null
      },
      deleteSelectedDrawing,
      resize() {
        chartRef.current?.resize()
      },
      setDrawingMagnet: setDrawingGroupMagnet,
      setDrawingsLocked: setDrawingGroupLock,
      setDrawingsVisible: setDrawingGroupVisibility,
      setDrawingTool: setActiveDrawingTool,
      setIndicators(indicators) {
        const chart = chartRef.current

        if (!chart) {
          return false
        }

        syncChartIndicators(chart, indicators)
        return true
      },
    })
  )

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    let disposed = false
    activeResetKeyRef.current = resetKey
    activeDrawingDraftIdRef.current = null
    activeDrawingToolRef.current = null
    clearDrawingSelection()
    historyExhaustedRef.current = false
    loadedAnnotationsRef.current = includeAnnotations
      ? annotationsRef.current
      : []
    loadedCandlesRef.current = normalizeCandleItems(candlesRef.current)
    registerMarketChartDrawingOverlays()
    const chartLocale = resolveKLineChartLocale(intlLocale)

    const layout: LayoutChild[] = [
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
      ...(showVolumePane
        ? [
            {
              content: ["VOL"],
              options: {
                dragEnabled: false,
                height: 92,
                id: VOLUME_PANE_ID,
                minHeight: 64,
              },
              type: "indicator" as const,
            },
          ]
        : []),
      {
        type: "xAxis",
      },
    ]

    const chart = init(container, {
      layout,
      locale: chartLocale,
      styles: createChartStyles(chartThemePalette),
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
            x: Math.max(
              18,
              Math.min(currentContainer.clientWidth - 18, point.x)
            ),
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
        const displayedCandles = mergeLiveCandleItem(
          loadedCandlesRef.current,
          liveCandleRef.current
        )

        callback(createKLineData(displayedCandles), {
          // KLineChart v10 uses `forward` for the left-edge prepend path.
          backward: false,
          forward: displayedCandles.length > 0,
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
      const request =
        oldestTimestamp !== null
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
      chart.unsubscribeAction(
        "onVisibleRangeChange",
        scheduleMarkerPositionUpdate
      )
      chart.unsubscribeAction("onScroll", scheduleMarkerPositionUpdate)
      chart.unsubscribeAction("onZoom", scheduleMarkerPositionUpdate)
      resizeObserver.disconnect()
      scheduleMarkerPositionUpdateRef.current = () => {}
      activeDrawingDraftIdRef.current = null
      activeDrawingToolRef.current = null
      selectedDrawingIdRef.current = null
      chartRef.current = null
      onDrawingSelectionChangeRef.current?.(false)
      setMarkerPositions([])
      dispose(chart)
    }
  }, [
    assetId,
    chartThemePalette,
    includeAnnotations,
    resetKey,
    showVolumePane,
    symbol,
    timeframe,
    intlLocale,
  ])

  useEffect(() => {
    const chart = chartRef.current

    if (!chart) {
      return
    }

    syncChartIndicators(chart, activeIndicators)
  }, [activeIndicators])

  useEffect(() => {
    if (!drawingToolActive) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        cancelActiveDrawingDraft()
        onDrawingToolCompleteRef.current?.()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [drawingToolActive])

  return (
    <div className={cn("relative h-[520px] min-h-[420px] w-full", className)}>
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
              <span>{dictionary.marketCharts.history.loading}</span>
            </>
          ) : (
            <span>
              {historyError || dictionary.marketCharts.history.errorFallback}
            </span>
          )}
        </div>
      ) : null}
      {markerPositions.map(({ group, x, y }) => {
        const selected = selectedAnnotationGroupId === group.id
        const emphasized = selected || group.priority === "high"
        const count = group.annotations.length
        const colorClassNames = getAnnotationMarkerColorClassNames(
          group.direction
        )

        return (
          <button
            key={group.id}
            type="button"
            aria-label={
              count > 1
                ? formatMessage(dictionary.marketCharts.annotations.openMany, {
                    count: formatNumber(count),
                    time: formatDateTime(
                      group.annotations[0]?.time,
                      MARKER_DATE_TIME_OPTIONS,
                      dictionary.marketCharts.format.notAvailable
                    ),
                  })
                : formatMessage(dictionary.marketCharts.annotations.openOne, {
                    title: group.annotations[0]?.title || "",
                  })
            }
            aria-pressed={selected}
            className={cn(
              "group absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              drawingToolActive ? "pointer-events-none" : null
            )}
            style={{ left: x, top: y }}
            onClick={(event) => {
              event.stopPropagation()
              onAnnotationSelect?.(group.id, { x, y })
            }}
          >
            <span
              className={cn(
                "market-chart-annotation-pulse absolute rounded-full",
                emphasized ? "size-9" : "size-7",
                colorClassNames.pulse
              )}
            />
            <span
              className={cn(
                count > 1
                  ? "relative flex size-6 items-center justify-center rounded-full border-2 border-background text-[11px] font-semibold shadow-lg ring-2"
                  : "relative block size-4 rounded-full border-2 border-background shadow-lg ring-2 group-aria-pressed:ring-4",
                colorClassNames.dot,
                colorClassNames.ring,
                count > 1 ? colorClassNames.foreground : null
              )}
            >
              {count > 1 ? formatNumber(count) : null}
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
})
