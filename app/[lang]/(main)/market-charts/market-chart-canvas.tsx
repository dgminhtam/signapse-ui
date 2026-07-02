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
  init,
  type Chart,
  type DataLoaderGetBarsParams,
  type DataLoaderSubscribeBarParams,
  type DeepPartial,
  type KLineData,
  type Overlay,
  type OverlayCreate,
  type Point,
  type Styles,
} from "klinecharts"
import { useTheme } from "next-themes"

import type { ActionResult } from "@/app/lib/definitions"
import { useLocalization } from "@/app/lib/i18n/provider"
import type {
  MarketChartAnnotationResponse,
  MarketChartCandleItemResponse,
  MarketChartCandleRequest,
  MarketChartTimeframe,
} from "@/app/lib/market-charts/definitions"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

import {
  getMarketChartAnnotationColorClassNames,
  mergeMarketChartAnnotations,
  type MarketChartAnnotationGroup,
  type MarketChartAnnotationMarkerPoint,
} from "./market-chart-annotations"
import {
  createMarketChartDrawingGroupId,
  createMarketChartDrawingMode,
  createMarketChartDrawingOverlay,
  getMarketChartDrawingMetadataStyle,
  getMarketChartDrawingMetadataTool,
  getMarketChartDrawingToolFromOverlayName,
  mergeMarketChartDrawingMetadata,
  registerMarketChartDrawingOverlays,
  type MarketChartDrawingMetadata,
  type MarketChartDrawingTool,
} from "./market-chart-drawing"
import {
  DEFAULT_MARKET_CHART_DRAWING_STYLE,
  mergeMarketChartDrawingStyle,
  type MarketChartDrawingStyle,
} from "./market-chart-drawing-style"
import {
  createChartStyles,
  createDrawingOverlayStyles,
  getMarketChartThemePalette,
  resolveChartThemeMode,
  type ChartThemeMode,
  type MarketChartThemePalette,
} from "./market-chart-theme"
import {
  createKLinePeriod,
  ensureKLineChartLocales,
  resolveKLineChartLocale,
  KLINE_CHART_VI_LOCALE,
} from "./market-chart-period"
import {
  createKLineData,
  getCandleTimestamp,
  getFiniteVolume,
  hasUsableVolume,
  hasUsableVolumeData,
  isValidMarketChartCandle,
  mergeCandleItems,
  mergeLiveCandleItem,
  normalizeCandleItems,
} from "./market-chart-candle-helpers"
import {
  createOlderHistoryRequest,
  getNewOlderCandles,
  getOldestLoadedTimestamp,
} from "./market-chart-history-helpers"

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
  updateSelectedDrawingStyle: (
    patch: Partial<MarketChartDrawingStyle>
  ) => boolean
}

export interface MarketChartDrawingSelection {
  anchor: MarketChartAnnotationMarkerPoint | null
  id: string
  style: MarketChartDrawingStyle
}

export interface MarketChartOutcomeHoverRange {
  anchorTime: string
  evaluationTime: string
}

interface MarketChartCanvasProps {
  assetId: number
  candles: MarketChartCandleItemResponse[]
  dataVersion: number
  timeframe: MarketChartTimeframe
  symbol?: string
  annotations?: MarketChartAnnotationResponse[]
  annotationGroups?: MarketChartAnnotationGroup[]
  annotationLayerEnabled: boolean
  liveCandle?: MarketChartCandleItemResponse | null
  selectedAnnotationGroupId?: string | null
  activeOutcomeHoverRange?: MarketChartOutcomeHoverRange | null
  showVolumePane: boolean
  activeIndicators?: MarketChartIndicatorName[]
  className?: string
  drawingToolActive?: boolean
  onAnnotationSelect?: (groupId: string) => void
  onAnnotationClose?: () => void
  renderAnnotationPopup?: (group: MarketChartAnnotationGroup) => React.ReactNode
  onDrawingSelectionChange?: (selection: MarketChartDrawingSelection | null) => void
  onDrawingToolComplete?: () => void
  onLoadedDataChange?: (data: MarketChartLoadedData) => void
  onLoadOlderCandles: (
    request: MarketChartCandleRequest
  ) => Promise<ActionResult<MarketChartLoadedData>>
}

interface MarkerPosition {
  group: MarketChartAnnotationGroup
  x: number
  y: number
}

interface OutcomeHoverBand {
  height: number
  left: number
  top: number
  width: number
}

type LazyHistoryState = "idle" | "loading" | "error"

interface LazyHistoryFeedback {
  error: string | null
  loadId: number
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
const MARKER_DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
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

function isFiniteCoordinate(
  coordinate: Partial<MarketChartAnnotationMarkerPoint>
): coordinate is MarketChartAnnotationMarkerPoint {
  return (
    typeof coordinate.x === "number" &&
    Number.isFinite(coordinate.x) &&
    typeof coordinate.y === "number" &&
    Number.isFinite(coordinate.y)
  )
}

function getFiniteXCoordinate(coordinate: unknown): number | null {
  if (!coordinate || Array.isArray(coordinate) || typeof coordinate !== "object") {
    return null
  }

  const x = (coordinate as { x?: unknown }).x

  return typeof x === "number" && Number.isFinite(x) ? x : null
}

function getOutcomeHoverBand({
  chart,
  container,
  range,
}: {
  chart: Chart
  container: HTMLElement
  range: MarketChartOutcomeHoverRange | null
}): OutcomeHoverBand | null {
  if (!range) {
    return null
  }

  const anchorTimestamp = Date.parse(range.anchorTime)
  const evaluationTimestamp = Date.parse(range.evaluationTime)

  if (!Number.isFinite(anchorTimestamp) || !Number.isFinite(evaluationTimestamp)) {
    return null
  }

  const anchorCoordinate = chart.convertToPixel(
    { timestamp: anchorTimestamp },
    { absolute: true, paneId: CANDLE_PANE_ID }
  )
  const evaluationCoordinate = chart.convertToPixel(
    { timestamp: evaluationTimestamp },
    { absolute: true, paneId: CANDLE_PANE_ID }
  )
  const anchorX = getFiniteXCoordinate(anchorCoordinate)
  const evaluationX = getFiniteXCoordinate(evaluationCoordinate)

  if (anchorX === null || evaluationX === null) {
    return null
  }

  const pane = chart.getDom(CANDLE_PANE_ID, "main")

  if (!(pane instanceof HTMLElement)) {
    return null
  }

  const paneRect = pane.getBoundingClientRect()
  const containerRect = container.getBoundingClientRect()
  const paneLeft = paneRect.left - containerRect.left
  const paneRight = paneLeft + paneRect.width
  const left = Math.max(paneLeft, Math.min(anchorX, evaluationX))
  const right = Math.min(paneRight, Math.max(anchorX, evaluationX))

  if (
    !Number.isFinite(left) ||
    !Number.isFinite(right) ||
    right <= left ||
    paneRect.height <= 0
  ) {
    return null
  }

  return {
    height: paneRect.height,
    left,
    top: paneRect.top - containerRect.top,
    width: right - left,
  }
}

function hasDrawingPointCoordinate(
  point: Partial<Point>
): point is Pick<Point, "timestamp" | "value"> {
  return (
    typeof point.timestamp === "number" &&
    Number.isFinite(point.timestamp) &&
    typeof point.value === "number" &&
    Number.isFinite(point.value)
  )
}

function getDrawingToolForOverlay(
  overlay: Overlay<MarketChartDrawingMetadata>
): MarketChartDrawingTool | null {
  return getMarketChartDrawingMetadataTool(
    overlay.extendData,
    getMarketChartDrawingToolFromOverlayName(overlay.name)
  )
}

function getDrawingSelectionAnchor({
  chart,
  container,
  overlay,
}: {
  chart: Chart
  container: HTMLElement
  overlay: Overlay<MarketChartDrawingMetadata>
}): MarketChartAnnotationMarkerPoint | null {
  const overlayPoints = overlay.points.filter(hasDrawingPointCoordinate)

  if (overlayPoints.length === 0) {
    return null
  }

  const coordinates = chart.convertToPixel(overlayPoints, {
    absolute: true,
    paneId: overlay.paneId || CANDLE_PANE_ID,
  })
  const coordinateList = Array.isArray(coordinates) ? coordinates : [coordinates]
  const finiteCoordinates = coordinateList.filter(isFiniteCoordinate)

  if (finiteCoordinates.length === 0) {
    return null
  }

  const xs = finiteCoordinates.map((coordinate) => coordinate.x)
  const ys = finiteCoordinates.map((coordinate) => coordinate.y)
  const centerX = (Math.min(...xs) + Math.max(...xs)) / 2
  const topY = Math.min(...ys)

  return {
    x: Math.max(96, Math.min(container.clientWidth - 96, centerX)),
    y: Math.max(44, Math.min(container.clientHeight - 72, topY - 12)),
  }
}

function createDrawingSelection({
  chart,
  container,
  overlay,
}: {
  chart: Chart
  container: HTMLElement
  overlay: Overlay<MarketChartDrawingMetadata>
}): MarketChartDrawingSelection {
  return {
    anchor: getDrawingSelectionAnchor({ chart, container, overlay }),
    id: overlay.id,
    style: getMarketChartDrawingMetadataStyle(overlay.extendData),
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
    annotationLayerEnabled,
    assetId,
    activeOutcomeHoverRange = null,
    activeIndicators = [],
    candles,
    dataVersion = 0,
    className,
    drawingToolActive = false,
    liveCandle = null,
    onAnnotationClose,
    onAnnotationSelect,
    onDrawingSelectionChange,
    onDrawingToolComplete,
    onLoadedDataChange,
    onLoadOlderCandles,
    renderAnnotationPopup,
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
  const [chartLoadId, setChartLoadId] = useState(0)
  const chartLoadIdRef = useRef(0)
  const activeDrawingDraftIdRef = useRef<string | null>(null)
  const activeDrawingToolRef = useRef<MarketChartDrawingTool | null>(null)
  const annotationLayerEnabledRef = useRef(annotationLayerEnabled)
  const annotationsRef = useRef(annotations)
  const annotationGroupsRef = useRef(annotationGroups)
  const activeOutcomeHoverRangeRef = useRef<MarketChartOutcomeHoverRange | null>(
    activeOutcomeHoverRange
  )
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
  const liveCandleSubscriberRef = useRef<
    DataLoaderSubscribeBarParams["callback"] | null
  >(null)
  const liveCandleSubscriberLoadIdRef = useRef<number | null>(null)
  const historyExhaustedRef = useRef(false)
  const onDrawingSelectionChangeRef = useRef(onDrawingSelectionChange)
  const onDrawingToolCompleteRef = useRef(onDrawingToolComplete)
  const onLoadedDataChangeRef = useRef(onLoadedDataChange)
  const onLoadOlderCandlesRef = useRef(onLoadOlderCandles)
  const drawingCacheRef = useRef<Map<string, OverlayCreate[]>>(new Map())
  const scheduleMarkerPositionUpdateRef = useRef<() => void>(() => {})
  const selectedDrawingIdRef = useRef<string | null>(null)
  const [historyFeedback, setHistoryFeedback] = useState<LazyHistoryFeedback>({
    error: null,
    loadId: 0,
    state: "idle",
  })
  const [markerPositions, setMarkerPositions] = useState<MarkerPosition[]>([])
  const [outcomeHoverBand, setOutcomeHoverBand] =
    useState<OutcomeHoverBand | null>(null)
  const { resolvedTheme } = useTheme()
  const chartThemeMode = resolveChartThemeMode(resolvedTheme)
  const chartThemePalette = getMarketChartThemePalette(chartThemeMode)
  const historyState =
    historyFeedback.loadId === chartLoadId ? historyFeedback.state : "idle"
  const historyError =
    historyFeedback.loadId === chartLoadId ? historyFeedback.error : null

  useEffect(() => {
    annotationLayerEnabledRef.current = annotationLayerEnabled
    annotationsRef.current = annotations
    loadedAnnotationsRef.current = annotationLayerEnabled ? annotations : []
  }, [annotations, annotationLayerEnabled])

  useEffect(() => {
    candlesRef.current = candles
  }, [candles])

  useEffect(() => {
    loadedCandlesRef.current = normalizeCandleItems(candlesRef.current)

    const chart = chartRef.current
    if (chart && dataVersion > 0) {
      chart.resetData()
    }
  }, [dataVersion])

  useEffect(() => {
    annotationGroupsRef.current = annotationGroups
    scheduleMarkerPositionUpdateRef.current()
  }, [annotationGroups])

  useEffect(() => {
    activeOutcomeHoverRangeRef.current = activeOutcomeHoverRange
    scheduleMarkerPositionUpdateRef.current()
  }, [activeOutcomeHoverRange])

  useEffect(() => {
    liveCandleRef.current = liveCandle
    if (
      liveCandle &&
      liveCandleSubscriberLoadIdRef.current === chartLoadIdRef.current &&
      liveCandleSubscriberRef.current
    ) {
      const [liveData] = createKLineData([liveCandle])

      if (liveData) {
        liveCandleSubscriberRef.current(liveData)
      }
    }
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



  function getOverlayById(
    id: string
  ): Overlay<MarketChartDrawingMetadata> | null {
    const chart = chartRef.current

    if (!chart) {
      return null
    }

    return (
      (chart.getOverlays({ id })[0] as
        | Overlay<MarketChartDrawingMetadata>
        | undefined) ?? null
    )
  }

  function emitDrawingSelection(id: string | null) {
    const chart = chartRef.current
    const container = containerRef.current

    if (!id || !chart || !container) {
      selectedDrawingIdRef.current = null
      onDrawingSelectionChangeRef.current?.(null)
      return
    }

    const overlay = getOverlayById(id)

    if (!overlay) {
      selectedDrawingIdRef.current = null
      onDrawingSelectionChangeRef.current?.(null)
      return
    }

    selectedDrawingIdRef.current = overlay.id
    onDrawingSelectionChangeRef.current?.(
      createDrawingSelection({ chart, container, overlay })
    )
  }

  function clearDrawingSelection() {
    emitDrawingSelection(null)
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
          if (drawingLockedRef.current) {
            event.chart.overrideOverlay({
              id: event.overlay.id,
              lock: true,
            })
          }
          emitDrawingSelection(event.overlay.id)
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
          emitDrawingSelection(event.overlay.id)
        },
        paneId: CANDLE_PANE_ID,
        style: DEFAULT_MARKET_CHART_DRAWING_STYLE,
        styles: createDrawingOverlayStyles(
          chartThemePalette,
          DEFAULT_MARKET_CHART_DRAWING_STYLE
        ),
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

  function updateSelectedDrawingStyle(patch: Partial<MarketChartDrawingStyle>) {
    const chart = chartRef.current
    const selectedDrawingId = selectedDrawingIdRef.current

    if (!chart || !selectedDrawingId) {
      return false
    }

    const overlay = getOverlayById(selectedDrawingId)
    const tool = overlay ? getDrawingToolForOverlay(overlay) : null

    if (!overlay || !tool) {
      return false
    }

    const style = mergeMarketChartDrawingStyle(overlay.extendData?.style, patch)
    const updated = chart.overrideOverlay({
      extendData: mergeMarketChartDrawingMetadata(overlay.extendData, {
        style,
        tool,
      }),
      id: overlay.id,
      styles: createDrawingOverlayStyles(chartThemePalette, style),
    })

    if (updated) {
      emitDrawingSelection(overlay.id)
    }

    return updated
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
      updateSelectedDrawingStyle,
    })
  )

  // ── Mount effect: init chart once, plus stable subscriptions ──
  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    registerMarketChartDrawingOverlays()

    const chart = init(container, {
      layout: [
        {
          type: "candle",
          options: {
            axis: { gap: { bottom: 0.22, top: 0.08 } },
            id: CANDLE_PANE_ID,
          },
        },
        { type: "xAxis" },
      ],
      locale: resolveKLineChartLocale(intlLocale),
      styles: createChartStyles(chartThemePalette),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      zoomAnchor: "cursor",
    })

    if (!chart) {
      return
    }

    chartRef.current = chart
    chart.setOffsetRightDistance(24)
    chart.setLeftMinVisibleBarCount(8)
    chart.setRightMinVisibleBarCount(8)

    const updateMarkerPositions = () => {
      const currentChart = chartRef.current
      const currentContainer = containerRef.current

      if (!currentChart || !currentContainer) {
        return
      }

      const nextPositions = annotationGroupsRef.current.flatMap((group) => {
        const point = getMarkerCoordinate(currentChart, group)
        return point
          ? [
              {
                group,
                x: Math.max(18, Math.min(currentContainer.clientWidth - 18, point.x)),
                y: Math.max(24, Math.min(currentContainer.clientHeight - 92, point.y - 18)),
              },
            ]
          : []
      })

      setMarkerPositions(nextPositions)
      setOutcomeHoverBand(
        getOutcomeHoverBand({
          chart: currentChart,
          container: currentContainer,
          range: activeOutcomeHoverRangeRef.current,
        })
      )

      if (selectedDrawingIdRef.current) {
        emitDrawingSelection(selectedDrawingIdRef.current)
      }
    }

    const scheduleMarkerPositionUpdate = () => {
      window.requestAnimationFrame(updateMarkerPositions)
    }

    scheduleMarkerPositionUpdateRef.current = scheduleMarkerPositionUpdate

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
      scheduleMarkerPositionUpdateRef.current = () => {}
      liveCandleSubscriberRef.current = null
      liveCandleSubscriberLoadIdRef.current = null
      activeDrawingDraftIdRef.current = null
      activeDrawingToolRef.current = null
      selectedDrawingIdRef.current = null
      chartRef.current = null
      onDrawingSelectionChangeRef.current?.(null)
      setMarkerPositions([])
      setOutcomeHoverBand(null)
      dispose(chart)
    }
  }, [])

  // ── Sync: theme styles — klinecharts native ──
  useEffect(() => {
    const chart = chartRef.current

    if (!chart) {
      return
    }

    chart.setStyles(createChartStyles(chartThemePalette))

    chart
      .getOverlays({ groupId: drawingGroupIdRef.current })
      .forEach((overlay) => {
        const drawingOverlay = overlay as Overlay<MarketChartDrawingMetadata>
        const tool = getDrawingToolForOverlay(drawingOverlay)

        if (!tool) {
          return
        }

        const style = getMarketChartDrawingMetadataStyle(
          drawingOverlay.extendData
        )

        chart.overrideOverlay({
          extendData: mergeMarketChartDrawingMetadata(
            drawingOverlay.extendData,
            { style, tool }
          ),
          id: drawingOverlay.id,
          styles: createDrawingOverlayStyles(chartThemePalette, style),
        })
      })

    scheduleMarkerPositionUpdateRef.current()
  }, [chartThemePalette])

  // ── Sync: locale ──
  useEffect(() => {
    chartRef.current?.setLocale(resolveKLineChartLocale(intlLocale))
  }, [intlLocale])

  // ── Sync: symbol ──
  useEffect(() => {
    chartRef.current?.setSymbol({ ticker: symbol, pricePrecision: 4, volumePrecision: 2 })
  }, [symbol])

  // ── Sync: timeframe ──
  useEffect(() => {
    chartRef.current?.setPeriod(createKLinePeriod(timeframe))
  }, [timeframe])

  // ── Sync: volume pane ──
  useEffect(() => {
    const chart = chartRef.current
    if (!chart) return

    if (showVolumePane) {
      chart.createIndicator("VOL", false, { id: VOLUME_PANE_ID, height: 92, minHeight: 64, dragEnabled: false })
    } else {
      chart.removeIndicator({ paneId: VOLUME_PANE_ID })
    }
  }, [showVolumePane])

  // ── Sync effect 2: data source change — reset DataLoader ──
  useEffect(() => {
    const chart = chartRef.current

    if (!chart) {
      return
    }

    // Save & clear overlays from previous data source
    const oldKey = drawingGroupIdRef.current
    const oldOverlays = chart.getOverlays({ groupId: oldKey })
    if (oldOverlays.length > 0) {
      drawingCacheRef.current.set(
        oldKey,
        oldOverlays.map(
          ({
            extendData,
            lock,
            mode,
            modeSensitivity,
            name,
            paneId,
            points,
            styles,
            visible,
            zLevel,
          }) => ({
            extendData,
            lock,
            mode,
            modeSensitivity,
            name,
            paneId,
            points,
            styles,
            visible,
            zLevel,
          })
        )
      )
      chart.removeOverlay({ groupId: oldKey })
    }

    // Sync data refs and increment load ID (invalidates stale history requests)
    const loadId = chartLoadIdRef.current + 1
    chartLoadIdRef.current = loadId
    setChartLoadId(loadId)
    historyExhaustedRef.current = false
    clearDrawingSelection()
    loadedAnnotationsRef.current = annotationLayerEnabledRef.current ? annotationsRef.current : []
    loadedCandlesRef.current = normalizeCandleItems(candlesRef.current)

    // Update drawing group ID for new data source
    const newKey = createMarketChartDrawingGroupId({ assetId, timeframe })
    drawingGroupIdRef.current = newKey

    // Restore overlays for new data source from cache
    const savedOverlays = drawingCacheRef.current.get(newKey)
    if (savedOverlays) {
      savedOverlays.forEach((overlay) => {
        const tool = getMarketChartDrawingMetadataTool(
          overlay.extendData,
          getMarketChartDrawingToolFromOverlayName(overlay.name ?? "")
        )
        const style = getMarketChartDrawingMetadataStyle(overlay.extendData)

        chart.createOverlay({
          ...overlay,
          extendData: tool
            ? mergeMarketChartDrawingMetadata(overlay.extendData, {
                style,
                tool,
              })
            : overlay.extendData,
          groupId: newKey,
          styles: createDrawingOverlayStyles(chartThemePalette, style),
        })
      })
      drawingCacheRef.current.delete(newKey)
    }

    async function loadBars({ callback, timestamp, type }: DataLoaderGetBarsParams) {
      if (type === "init") {
        const displayed = mergeLiveCandleItem(loadedCandlesRef.current, liveCandleRef.current)
        callback(createKLineData(displayed), { backward: false, forward: displayed.length > 0 })
        scheduleMarkerPositionUpdateRef.current()
        return
      }

      if (type !== "forward") {
        callback([], { backward: false, forward: !historyExhaustedRef.current })
        return
      }

      if (historyExhaustedRef.current) {
        callback([], { backward: false, forward: false })
        return
      }

      const oldestTimestamp = timestamp ?? getOldestLoadedTimestamp(loadedCandlesRef.current)
      const request = oldestTimestamp !== null
        ? createOlderHistoryRequest({ assetId, oldestTimestamp, timeframe })
        : null

      if (oldestTimestamp === null || !request) {
        historyExhaustedRef.current = true
        callback([], { backward: false, forward: false })
        return
      }

      setHistoryFeedback({ error: null, loadId, state: "loading" })
      const result = await onLoadOlderCandlesRef.current(request)

      if (chartLoadIdRef.current !== loadId) return

      if (!result.success) {
        setHistoryFeedback({ error: result.error, loadId, state: "error" })
        callback([], { backward: false, forward: true })
        return
      }

      const olderCandles = getNewOlderCandles(loadedCandlesRef.current, result.data.candles, oldestTimestamp)
      const olderData = createKLineData(olderCandles)

      if (!olderData.length) {
        historyExhaustedRef.current = true
        setHistoryFeedback({ error: null, loadId, state: "idle" })
        callback([], { backward: false, forward: false })
        return
      }

      loadedCandlesRef.current = mergeCandleItems(loadedCandlesRef.current, olderCandles)

      if (annotationLayerEnabledRef.current) {
        loadedAnnotationsRef.current = mergeMarketChartAnnotations(loadedAnnotationsRef.current, result.data.annotations)
      }

      onLoadedDataChangeRef.current?.({
        annotations: loadedAnnotationsRef.current,
        candles: loadedCandlesRef.current,
        from: loadedCandlesRef.current[0]?.time ?? result.data.from,
      })
      setHistoryFeedback({ error: null, loadId, state: "idle" })
      callback(olderData, { backward: false, forward: true })
      scheduleMarkerPositionUpdateRef.current()
    }

    chart.setDataLoader({
      getBars(params) { void loadBars(params) },
      subscribeBar(params) {
        liveCandleSubscriberRef.current = params.callback
        liveCandleSubscriberLoadIdRef.current = loadId
        const [liveData] = createKLineData(liveCandleRef.current ? [liveCandleRef.current] : [])
        if (liveData) params.callback(liveData)
      },
      unsubscribeBar() {
        liveCandleSubscriberRef.current = null
        liveCandleSubscriberLoadIdRef.current = null
      },
    })

  }, [assetId, timeframe])

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
    <div className={cn("relative h-full min-h-0 w-full", className)}>
      <div ref={containerRef} className="absolute inset-0" />
      {outcomeHoverBand ? (
        <div
          className="pointer-events-none absolute bg-primary/15 ring-1 ring-primary/30"
          style={{
            height: outcomeHoverBand.height,
            left: outcomeHoverBand.left,
            top: outcomeHoverBand.top,
            width: outcomeHoverBand.width,
          }}
        />
      ) : null}
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
        const colorClassNames = getMarketChartAnnotationColorClassNames(
          group.direction
        )

        return (
          <Popover
            key={group.id}
            open={selectedAnnotationGroupId === group.id}
            onOpenChange={(open) => {
              if (open) {
                onAnnotationSelect?.(group.id)
              } else {
                onAnnotationClose?.()
              }
            }}
          >
            <PopoverTrigger asChild>
              <button
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
                      : "relative block size-4 rounded-full border-2 border-background shadow-lg ring-2 group-data-[state=open]:ring-4",
                    colorClassNames.dot,
                    colorClassNames.ring,
                    count > 1 ? colorClassNames.foreground : null
                  )}
                >
                  {count > 1 ? formatNumber(count) : null}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              side="right"
              className="w-[min(22rem,calc(100vw_-_1.5rem))] sm:block"
            >
              {renderAnnotationPopup?.(group)}
            </PopoverContent>
          </Popover>
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
