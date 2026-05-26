"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react"
import {
  CalendarClock,
  Camera,
  ChartCandlestick,
  DatabaseZap,
  Expand,
  Minimize2,
  RefreshCw,
  SlidersHorizontal,
  TriangleAlert,
  X,
} from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

import { getMarketChartCandles } from "@/app/api/market-charts/action"
import { useLocalization } from "@/app/lib/i18n/provider"
import {
  DEFAULT_MARKET_CHART_TIMEFRAME,
  MARKET_CHART_TIMEFRAMES,
  type MarketChartAnnotationResponse,
  MarketChartCandleRequest,
  MarketChartCandleResponse,
  MarketChartTimeframe,
  getMarketChartTimeframeLabels,
  isMarketChartTimeframe,
} from "@/app/lib/market-charts/definitions"
import { WorkspaceWatchlistAssetListItemResponse } from "@/app/lib/watchlists/definitions"
import { AppTimeMetadata } from "@/components/app-time-metadata"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

import {
  createMarketChartAnnotationGroups,
  type MarketChartAnnotationGroup,
  type MarketChartAnnotationMarkerPoint,
} from "./market-chart-annotations"
import {
  LocalEntityQuickDetailDrawer,
  type LocalQuickDetailEntity,
} from "../local-entity-quick-detail-drawer"
import {
  MarketChartCanvas,
  type MarketChartCanvasHandle,
  type MarketChartIndicatorName,
  type MarketChartLoadedData,
} from "./market-chart-canvas"
import {
  MarketChartDrawingToolbar,
} from "./market-chart-drawing-toolbar"
import type {
  MarketChartDrawingState,
  MarketChartDrawingTool,
} from "./market-chart-drawing"
import { MarketChartSurfaceSkeleton } from "./market-chart-skeleton"

type WorkbenchPhase = "idle" | "loading" | "success" | "error"

type MarketChartSelectionState = {
  assetId: string
  timeframe: MarketChartTimeframe
}

type FormErrors = Partial<Record<keyof MarketChartSelectionState, string>> & {
  form?: string
}

interface MarketChartWorkbenchProps {
  watchlistAssets: WorkspaceWatchlistAssetListItemResponse[]
  watchlistError: string | null
}

const LATEST_WINDOW_DAYS = 7
const MARKET_CHART_DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
}
const MARKET_CHART_TIMEFRAME_SHORT_LABELS: Record<
  MarketChartTimeframe,
  string
> = {
  "1m": "1m",
  "5m": "5m",
  "15m": "15m",
  "30m": "30m",
  "1h": "1H",
  "1d": "1D",
  "1w": "1W",
  "1mo": "1M",
}
const MARKET_CHART_INDICATOR_OPTIONS: MarketChartIndicatorName[] = [
  "MA",
  "EMA",
  "BOLL",
  "MACD",
  "RSI",
  "KDJ",
]
const DEFAULT_MARKET_CHART_DRAWING_STATE: MarketChartDrawingState = {
  activeTool: null,
  hasSelectedDrawing: false,
  isCollapsed: false,
  isLocked: false,
  isMagnetEnabled: false,
  isVisible: true,
}

type LocalizationContext = ReturnType<typeof useLocalization>

function getSingleParam(
  searchParams: URLSearchParams,
  key: string
): string | null {
  const value = searchParams.get(key)
  return value?.trim() || null
}

function getTimeframeFromSearchParams(searchParams: URLSearchParams) {
  const value = getSingleParam(searchParams, "timeframe")
  return value && isMarketChartTimeframe(value)
    ? value
    : DEFAULT_MARKET_CHART_TIMEFRAME
}

function createDefaultSelection(
  assets: WorkspaceWatchlistAssetListItemResponse[]
): MarketChartSelectionState {
  return {
    assetId: assets[0]?.assetId ? String(assets[0].assetId) : "",
    timeframe: DEFAULT_MARKET_CHART_TIMEFRAME,
  }
}

function createQueryString(selection: MarketChartSelectionState) {
  const query = new URLSearchParams()

  query.set("assetId", selection.assetId)
  query.set("timeframe", selection.timeframe)

  return query.toString()
}

function createLatestCandleRequest(
  asset: WorkspaceWatchlistAssetListItemResponse,
  timeframe: MarketChartTimeframe,
  includeAnnotations: boolean
): MarketChartCandleRequest {
  const to = new Date()
  const from = new Date(to)
  from.setDate(to.getDate() - LATEST_WINDOW_DAYS)

  return {
    assetId: asset.assetId,
    timeframe,
    from: from.toISOString(),
    to: to.toISOString(),
    includeAnnotations,
  }
}

function findWatchlistAsset(
  assets: WorkspaceWatchlistAssetListItemResponse[],
  assetId: string
) {
  return assets.find((asset) => String(asset.assetId) === assetId) ?? null
}

function getDisplayAssetSymbol(
  data: MarketChartCandleResponse | null,
  selectedAsset: WorkspaceWatchlistAssetListItemResponse | null,
  dictionary: LocalizationContext["dictionary"]
) {
  return (
    data?.asset.symbol ||
    selectedAsset?.assetSymbol ||
    data?.symbol ||
    dictionary.marketCharts.format.selectedFallback
  )
}

function formatMarketChartDateTime(
  value: string | null | undefined,
  localization: LocalizationContext
) {
  return localization.formatDateTime(
    value,
    MARKET_CHART_DATE_TIME_OPTIONS,
    localization.dictionary.marketCharts.format.notAvailable
  )
}

function getDirectionLabel(
  direction: string | null | undefined,
  dictionary: LocalizationContext["dictionary"]
) {
  if (direction === "BULLISH") {
    return dictionary.marketCharts.directions.BULLISH
  }

  if (direction === "BEARISH") {
    return dictionary.marketCharts.directions.BEARISH
  }

  if (direction === "MIXED") {
    return dictionary.marketCharts.directions.MIXED
  }

  return dictionary.marketCharts.directions.NEUTRAL
}

function getDirectionBadgeVariant(
  direction?: string | null
): "default" | "destructive" | "secondary" | "outline" {
  if (direction === "BEARISH") {
    return "destructive"
  }

  if (direction === "BULLISH") {
    return "default"
  }

  if (direction === "MIXED") {
    return "secondary"
  }

  return "outline"
}

function formatConfidence(
  value: number | null | undefined,
  localization: LocalizationContext
) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null
  }

  const normalizedValue = value <= 1 ? value : value / 100

  return localization.formatPercent(normalizedValue, {
    maximumFractionDigits: 0,
  })
}

function formatAnnotationTime(
  group: MarketChartAnnotationGroup,
  localization: LocalizationContext
) {
  return formatMarketChartDateTime(group.annotations[0]?.time, localization)
}

function getAnnotationEventId(annotation: MarketChartAnnotationResponse) {
  const eventId = annotation.eventId

  if (typeof eventId === "number" && Number.isInteger(eventId) && eventId > 0) {
    return eventId
  }

  const eventDetail = annotation.links?.eventDetail?.trim()
  const match = eventDetail?.match(/^\/events\/([1-9]\d*)\/?(?:[?#].*)?$/)

  return match ? Number(match[1]) : null
}

function getFreshnessLabel(
  data: MarketChartCandleResponse | null,
  phase: WorkbenchPhase,
  localization: LocalizationContext
) {
  if (phase !== "success" || !data?.to) {
    return null
  }

  const updatedAt = formatMarketChartDateTime(data.to, localization)

  if (!updatedAt) {
    return null
  }

  return localization.formatMessage(
    localization.dictionary.marketCharts.format.updatedAt,
    {
      time: updatedAt,
    }
  )
}

function createScreenshotFileName(
  symbol: string,
  timeframe: MarketChartTimeframe
) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const safeSymbol = symbol.replace(/[^a-z0-9-]+/gi, "-").replace(/^-|-$/g, "")

  return `${safeSymbol || "market-chart"}-${timeframe}-${timestamp}.png`
}

function downloadDataUrl(url: string, fileName: string) {
  const link = document.createElement("a")

  link.href = url
  link.download = fileName
  link.rel = "noopener"
  document.body.appendChild(link)
  link.click()
  link.remove()
}

function getAnnotationPopupStyle(
  point: MarketChartAnnotationMarkerPoint | null
) {
  if (!point) {
    return {
      right: "1rem",
      top: "1rem",
      transformOrigin: "right top",
    }
  }

  const openRight = point.x < 420
  const openBelow = point.y < 320
  const x = Math.round(point.x + (openRight ? 20 : -20))
  const y = Math.round(point.y + (openBelow ? -24 : 24))

  return {
    left: `${x}px`,
    ...(openBelow
      ? { top: `clamp(0.75rem, ${y}px, calc(100% - 4rem))` }
      : { bottom: `clamp(0.75rem, calc(100% - ${y}px), calc(100% - 4rem))` }),
    transform: openRight ? undefined : "translateX(-100%)",
    transformOrigin: `${openRight ? "left" : "right"} ${openBelow ? "top" : "bottom"}`,
  }
}

function MarketChartTopToolbar({
  activeIndicators,
  annotationLayerEnabled,
  errors,
  hasCandles,
  hasWatchlistAssets,
  isBusy,
  isFullscreen,
  phase,
  selection,
  selectedAsset,
  timeframeLabels,
  watchlistAssets,
  watchlistError,
  onAnnotationLayerChange,
  onAssetChange,
  onFullscreenToggle,
  onIndicatorChange,
  onScreenshot,
  onTimeframeChange,
}: {
  activeIndicators: MarketChartIndicatorName[]
  annotationLayerEnabled: boolean
  errors: FormErrors
  hasCandles: boolean
  hasWatchlistAssets: boolean
  isBusy: boolean
  isFullscreen: boolean
  phase: WorkbenchPhase
  selection: MarketChartSelectionState
  selectedAsset: WorkspaceWatchlistAssetListItemResponse | null
  timeframeLabels: Record<MarketChartTimeframe, string>
  watchlistAssets: WorkspaceWatchlistAssetListItemResponse[]
  watchlistError: string | null
  onAnnotationLayerChange: (checked: boolean) => void
  onAssetChange: (value: string) => void
  onFullscreenToggle: () => void
  onIndicatorChange: (indicators: MarketChartIndicatorName[]) => void
  onScreenshot: () => void
  onTimeframeChange: (value: MarketChartTimeframe) => void
}) {
  const { dictionary } = useLocalization()
  const hasChartData = phase === "success" && hasCandles
  const controlsDisabled = isBusy || !!watchlistError || !hasWatchlistAssets
  const chartCommandsDisabled = isBusy || !!watchlistError || !hasChartData

  return (
    <div className="border-b bg-card p-2">
      <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center">
          <Field
            className="w-full shrink-0 gap-1 sm:w-80 lg:w-96"
            data-invalid={!!errors.assetId}
          >
            <FieldLabel htmlFor="market-chart-asset" className="sr-only">
              {dictionary.marketCharts.controls.assetLabel}
            </FieldLabel>
            <Select
              value={selection.assetId}
              onValueChange={onAssetChange}
              disabled={controlsDisabled}
            >
              <SelectTrigger
                id="market-chart-asset"
                aria-invalid={errors.assetId ? true : undefined}
                className="w-full"
                size="sm"
              >
                <SelectValue
                  placeholder={
                    dictionary.marketCharts.controls.assetPlaceholder
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {watchlistAssets.map((asset) => (
                    <SelectItem
                      key={asset.assetId}
                      value={String(asset.assetId)}
                    >
                      {asset.assetSymbol} - {asset.assetName}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <FieldError>{errors.assetId}</FieldError>
          </Field>

          <Field className="min-w-0 gap-1" data-invalid={!!errors.timeframe}>
            <FieldLabel id="market-chart-timeframe-label" className="sr-only">
              {dictionary.marketCharts.controls.timeframeLabel}
            </FieldLabel>
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={selection.timeframe}
              aria-labelledby="market-chart-timeframe-label"
              onValueChange={(value) => {
                if (isMarketChartTimeframe(value)) {
                  onTimeframeChange(value)
                }
              }}
            >
              {MARKET_CHART_TIMEFRAMES.map((timeframe) => (
                <ToggleGroupItem
                  key={timeframe}
                  value={timeframe}
                  disabled={controlsDisabled}
                  aria-label={timeframeLabels[timeframe]}
                >
                  {MARKET_CHART_TIMEFRAME_SHORT_LABELS[timeframe]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <FieldError>{errors.timeframe}</FieldError>
          </Field>
        </div>

        <div className="flex flex-wrap items-center gap-1 lg:justify-end">
          <Toggle
            variant="outline"
            size="sm"
            pressed={annotationLayerEnabled}
            onPressedChange={onAnnotationLayerChange}
            disabled={isBusy || !!watchlistError || !selectedAsset}
            aria-label={dictionary.marketCharts.controls.annotationsAria}
          >
            <CalendarClock data-icon="inline-start" />
            {dictionary.marketCharts.controls.annotationsLabel}
          </Toggle>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={chartCommandsDisabled}
              >
                {activeIndicators.length > 0 ? (
                  <span
                    data-icon="inline-start"
                    className="inline-flex size-3.5 items-center justify-center tabular-nums"
                  >
                    {activeIndicators.length > 9
                      ? "9+"
                      : activeIndicators.length}
                  </span>
                ) : (
                  <SlidersHorizontal data-icon="inline-start" />
                )}
                {dictionary.marketCharts.controls.indicatorLabel}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end">
              <PopoverHeader>
                <PopoverTitle>
                  {dictionary.marketCharts.indicators.title}
                </PopoverTitle>
              </PopoverHeader>
              <ToggleGroup
                type="multiple"
                variant="outline"
                spacing={1}
                value={activeIndicators}
                orientation="vertical"
                className="w-full items-stretch"
                onValueChange={(value) => {
                  onIndicatorChange(value as MarketChartIndicatorName[])
                }}
              >
                {MARKET_CHART_INDICATOR_OPTIONS.map((indicator) => (
                  <ToggleGroupItem
                    key={indicator}
                    value={indicator}
                    className="justify-start"
                  >
                    {dictionary.marketCharts.indicators.options[indicator]}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="sm"
            disabled={chartCommandsDisabled}
            onClick={onScreenshot}
            aria-label={dictionary.marketCharts.controls.screenshotAria}
          >
            <Camera data-icon="inline-start" />
            {dictionary.marketCharts.controls.screenshotLabel}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onFullscreenToggle}
            disabled={!!watchlistError}
            aria-label={
              isFullscreen
                ? dictionary.marketCharts.controls.exitFullscreenAria
                : dictionary.marketCharts.controls.fullscreenAria
            }
          >
            {isFullscreen ? (
              <Minimize2 data-icon="inline-start" />
            ) : (
              <Expand data-icon="inline-start" />
            )}
            {isFullscreen
              ? dictionary.marketCharts.controls.exitFullscreenLabel
              : dictionary.marketCharts.controls.fullscreenLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}

function ChartSurface({
  annotationLayerEnabled,
  annotationGroups,
  chartResetKey,
  data,
  error,
  errors,
  freshnessLabel,
  isBusy,
  phase,
  selection,
  selectedAsset,
  selectedAnnotationGroup,
  selectedAnnotationPoint,
  timeframeLabels,
  watchlistAssets,
  watchlistError,
  hasWatchlistAssets,
  onAnnotationClose,
  onAnnotationLayerChange,
  onAnnotationSelect,
  onAssetChange,
  onLoadedDataChange,
  onRetry,
  onTimeframeChange,
  onAnnotationEventOpen,
}: {
  annotationLayerEnabled: boolean
  annotationGroups: MarketChartAnnotationGroup[]
  chartResetKey: string
  data: MarketChartCandleResponse | null
  error: string | null
  errors: FormErrors
  freshnessLabel: string | null
  isBusy: boolean
  phase: WorkbenchPhase
  selection: MarketChartSelectionState
  selectedAsset: WorkspaceWatchlistAssetListItemResponse | null
  selectedAnnotationGroup: MarketChartAnnotationGroup | null
  selectedAnnotationPoint: MarketChartAnnotationMarkerPoint | null
  timeframeLabels: Record<MarketChartTimeframe, string>
  watchlistAssets: WorkspaceWatchlistAssetListItemResponse[]
  watchlistError: string | null
  hasWatchlistAssets: boolean
  onAnnotationClose: () => void
  onAnnotationLayerChange: (checked: boolean) => void
  onAnnotationSelect: (
    groupId: string,
    point?: MarketChartAnnotationMarkerPoint | null
  ) => void
  onAssetChange: (value: string) => void
  onLoadedDataChange: (data: MarketChartLoadedData) => void
  onRetry: () => void
  onTimeframeChange: (value: MarketChartTimeframe) => void
  onAnnotationEventOpen: (eventId: number) => void
}) {
  const localization = useLocalization()
  const { dictionary, formatMessage } = localization
  const chartCanvasRef = useRef<MarketChartCanvasHandle | null>(null)
  const surfaceRef = useRef<HTMLElement | null>(null)
  const [activeIndicators, setActiveIndicators] = useState<
    MarketChartIndicatorName[]
  >([])
  const [drawingState, setDrawingState] = useState<MarketChartDrawingState>(
    DEFAULT_MARKET_CHART_DRAWING_STATE
  )
  const [isFullscreen, setIsFullscreen] = useState(false)
  const hasCandles = (data?.candles.length ?? 0) > 0
  const displaySymbol = getDisplayAssetSymbol(data, selectedAsset, dictionary)

  useEffect(() => {
    function handleFullscreenChange() {
      const fullscreen = document.fullscreenElement === surfaceRef.current

      setIsFullscreen(fullscreen)
      window.requestAnimationFrame(() => {
        chartCanvasRef.current?.resize()
      })
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  function resetDrawingStateForChartChange() {
    setDrawingState((current) => ({
      ...DEFAULT_MARKET_CHART_DRAWING_STATE,
      isCollapsed: current.isCollapsed,
      isMagnetEnabled: current.isMagnetEnabled,
    }))
    chartCanvasRef.current?.setDrawingTool(null)
    chartCanvasRef.current?.setDrawingsLocked(false)
    chartCanvasRef.current?.setDrawingsVisible(true)
  }

  useEffect(() => {
    const frameId = window.requestAnimationFrame(resetDrawingStateForChartChange)

    return () => {
      window.cancelAnimationFrame(frameId)
    }
  }, [chartResetKey])

  function handleIndicatorChange(indicators: MarketChartIndicatorName[]) {
    setActiveIndicators(indicators)

    if (!chartCanvasRef.current?.setIndicators(indicators) && hasCandles) {
      toast.error(dictionary.marketCharts.controls.indicatorUnavailable)
    }
  }

  function handleDrawingToolChange(tool: MarketChartDrawingTool | null) {
    setDrawingState((current) => ({
      ...current,
      activeTool: tool,
    }))

    if (!chartCanvasRef.current?.setDrawingTool(tool) && tool && hasCandles) {
      setDrawingState((current) => ({
        ...current,
        activeTool: null,
      }))
      toast.error(dictionary.marketCharts.drawings.unavailable)
    }
  }

  function handleDrawingStateChange(
    patch: Partial<MarketChartDrawingState>
  ) {
    setDrawingState((current) => ({
      ...current,
      ...patch,
    }))

    if (
      typeof patch.isMagnetEnabled === "boolean" &&
      !chartCanvasRef.current?.setDrawingMagnet(patch.isMagnetEnabled) &&
      hasCandles
    ) {
      toast.error(dictionary.marketCharts.drawings.unavailable)
    }

    if (
      typeof patch.isLocked === "boolean" &&
      !chartCanvasRef.current?.setDrawingsLocked(patch.isLocked) &&
      hasCandles
    ) {
      toast.error(dictionary.marketCharts.drawings.unavailable)
    }

    if (
      typeof patch.isVisible === "boolean" &&
      !chartCanvasRef.current?.setDrawingsVisible(patch.isVisible) &&
      hasCandles
    ) {
      toast.error(dictionary.marketCharts.drawings.unavailable)
    }
  }

  function handleDeleteSelectedDrawing() {
    if (!chartCanvasRef.current?.deleteSelectedDrawing()) {
      toast.error(dictionary.marketCharts.drawings.deleteUnavailable)
    }
  }

  function handleClearDrawings() {
    if (!chartCanvasRef.current?.clearDrawings()) {
      toast.error(dictionary.marketCharts.drawings.clearUnavailable)
    }
  }

  function handleScreenshot() {
    const screenshotUrl = chartCanvasRef.current?.captureScreenshot()

    if (!screenshotUrl) {
      toast.error(dictionary.marketCharts.controls.screenshotUnavailable)
      return
    }

    downloadDataUrl(
      screenshotUrl,
      createScreenshotFileName(
        displaySymbol,
        data?.timeframe ?? selection.timeframe
      )
    )
    toast.success(dictionary.marketCharts.controls.screenshotSuccess)
  }

  async function handleFullscreenToggle() {
    const surface = surfaceRef.current

    if (!surface || !document.fullscreenEnabled) {
      toast.error(dictionary.marketCharts.controls.fullscreenUnavailable)
      return
    }

    try {
      if (document.fullscreenElement === surface) {
        await document.exitFullscreen()
      } else {
        await surface.requestFullscreen()
      }
    } catch {
      toast.error(dictionary.marketCharts.controls.fullscreenFailed)
    }
  }

  return (
    <section
      ref={surfaceRef}
      data-fullscreen={isFullscreen}
      className="overflow-hidden rounded-xl border border-border bg-card data-[fullscreen=true]:mt-0 data-[fullscreen=true]:flex data-[fullscreen=true]:h-screen data-[fullscreen=true]:flex-col data-[fullscreen=true]:rounded-none data-[fullscreen=true]:border-0"
    >
      <MarketChartTopToolbar
        activeIndicators={activeIndicators}
        annotationLayerEnabled={annotationLayerEnabled}
        errors={errors}
        hasCandles={hasCandles}
        hasWatchlistAssets={hasWatchlistAssets}
        isBusy={isBusy}
        isFullscreen={isFullscreen}
        phase={phase}
        selection={selection}
        selectedAsset={selectedAsset}
        timeframeLabels={timeframeLabels}
        watchlistAssets={watchlistAssets}
        watchlistError={watchlistError}
        onAnnotationLayerChange={onAnnotationLayerChange}
        onAssetChange={onAssetChange}
        onFullscreenToggle={handleFullscreenToggle}
        onIndicatorChange={handleIndicatorChange}
        onScreenshot={handleScreenshot}
        onTimeframeChange={onTimeframeChange}
      />
      <div
        data-fullscreen={isFullscreen}
        className="relative min-h-[520px] overflow-hidden bg-card data-[fullscreen=true]:min-h-0 data-[fullscreen=true]:flex-1"
        onClick={selectedAnnotationGroup ? onAnnotationClose : undefined}
      >
        {watchlistError ? (
          <Empty className="min-h-[520px] border-0 bg-transparent">
            <EmptyHeader>
              <EmptyMedia
                variant="icon"
                className="bg-destructive/10 text-destructive"
              >
                <TriangleAlert />
              </EmptyMedia>
              <EmptyTitle>
                {dictionary.marketCharts.empty.watchlistErrorTitle}
              </EmptyTitle>
              <EmptyDescription>{watchlistError}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}

        {!watchlistError && !hasWatchlistAssets ? (
          <Empty className="min-h-[520px] border-0 bg-transparent">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ChartCandlestick />
              </EmptyMedia>
              <EmptyTitle>
                {dictionary.marketCharts.empty.noWatchlistAssetsTitle}
              </EmptyTitle>
              <EmptyDescription>
                {dictionary.marketCharts.empty.noWatchlistAssetsDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}

        {!watchlistError && hasWatchlistAssets && phase === "idle" ? (
          <Empty className="min-h-[520px] border-0 bg-transparent">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ChartCandlestick />
              </EmptyMedia>
              <EmptyTitle>{dictionary.marketCharts.empty.idleTitle}</EmptyTitle>
              <EmptyDescription>
                {dictionary.marketCharts.empty.idleDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}

        {phase === "loading" ? <MarketChartSurfaceSkeleton embedded /> : null}

        {phase === "error" ? (
          <Empty className="min-h-[520px] border-0 bg-transparent">
            <EmptyHeader>
              <EmptyMedia
                variant="icon"
                className="bg-destructive/10 text-destructive"
              >
                <TriangleAlert />
              </EmptyMedia>
              <EmptyTitle>
                {dictionary.marketCharts.empty.loadErrorTitle}
              </EmptyTitle>
              <EmptyDescription>
                {error || dictionary.marketCharts.empty.loadErrorDescription}
              </EmptyDescription>
            </EmptyHeader>
            {selectedAsset ? (
              <Button type="button" variant="outline" onClick={onRetry}>
                <RefreshCw data-icon="inline-start" />
                {dictionary.marketCharts.controls.refreshLatestData}
              </Button>
            ) : null}
          </Empty>
        ) : null}

        {phase === "success" && data && !hasCandles ? (
          <Empty className="min-h-[520px] border-0 bg-transparent">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <DatabaseZap />
              </EmptyMedia>
              <EmptyTitle>
                {dictionary.marketCharts.empty.noCandlesTitle}
              </EmptyTitle>
              <EmptyDescription>
                {formatMessage(
                  dictionary.marketCharts.empty.noCandlesDescription,
                  {
                    symbol: getDisplayAssetSymbol(
                      data,
                      selectedAsset,
                      dictionary
                    ),
                  }
                )}
                <span className="mt-1 flex flex-wrap justify-center gap-3">
                  <AppTimeMetadata icon={CalendarClock}>
                    {formatMessage(dictionary.marketCharts.format.from, {
                      time: formatMarketChartDateTime(data.from, localization),
                    })}
                  </AppTimeMetadata>
                  <AppTimeMetadata icon={CalendarClock}>
                    {formatMessage(dictionary.marketCharts.format.to, {
                      time: formatMarketChartDateTime(data.to, localization),
                    })}
                  </AppTimeMetadata>
                </span>
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}

        {phase === "success" && data && hasCandles ? (
          <div
            data-fullscreen={isFullscreen}
            className="flex min-h-[520px] min-w-0 data-[fullscreen=true]:h-full data-[fullscreen=true]:min-h-0"
          >
            <MarketChartDrawingToolbar
              disabled={isBusy}
              state={drawingState}
              onClearAll={handleClearDrawings}
              onDeleteSelected={handleDeleteSelectedDrawing}
              onStateChange={handleDrawingStateChange}
              onToolChange={handleDrawingToolChange}
            />
            <div className="relative min-w-0 flex-1">
              <MarketChartCanvas
                ref={chartCanvasRef}
                activeIndicators={activeIndicators}
                annotations={data.annotations}
                assetId={data.asset.id}
                candles={data.candles}
                className={isFullscreen ? "h-full min-h-0" : undefined}
                drawingToolActive={!!drawingState.activeTool}
                includeAnnotations={annotationLayerEnabled}
                resetKey={chartResetKey}
                timeframe={data.timeframe}
                symbol={displaySymbol}
                annotationGroups={annotationGroups}
                selectedAnnotationGroupId={selectedAnnotationGroup?.id}
                onAnnotationSelect={onAnnotationSelect}
                onDrawingSelectionChange={(hasSelectedDrawing) =>
                  setDrawingState((current) => ({
                    ...current,
                    hasSelectedDrawing,
                  }))
                }
                onDrawingToolComplete={() =>
                  setDrawingState((current) => ({
                    ...current,
                    activeTool: null,
                  }))
                }
                onLoadedDataChange={onLoadedDataChange}
                onLoadOlderCandles={getMarketChartCandles}
              />

              {selectedAnnotationGroup ? (
                <div
                  className="absolute z-20 hidden w-[min(22rem,calc(100%-1.5rem))] max-w-[calc(100%-1.5rem)] sm:block"
                  style={getAnnotationPopupStyle(selectedAnnotationPoint)}
                  onClick={(event) => event.stopPropagation()}
                >
                  <MarketChartAnnotationPopup
                    group={selectedAnnotationGroup}
                    onClose={onAnnotationClose}
                    onEventOpen={onAnnotationEventOpen}
                  />
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <MarketChartAnnotationControls
        annotationLayerEnabled={annotationLayerEnabled}
        freshnessLabel={freshnessLabel}
        groups={annotationGroups}
        isLoading={phase === "loading"}
      />

      {selectedAnnotationGroup ? (
        <div className="border-t bg-muted/10 p-3 sm:hidden">
          <MarketChartAnnotationPopup
            group={selectedAnnotationGroup}
            onClose={onAnnotationClose}
            onEventOpen={onAnnotationEventOpen}
          />
        </div>
      ) : null}
    </section>
  )
}

function MarketChartAnnotationDetail({
  group,
  onEventOpen,
}: {
  group: MarketChartAnnotationGroup
  onEventOpen: (eventId: number) => void
}) {
  const localization = useLocalization()
  const { dictionary, formatMessage, formatNumber } = localization
  const firstAnnotation = group.annotations[0]
  const confidence = formatConfidence(
    firstAnnotation?.confidence ?? firstAnnotation?.reaction?.confidence,
    localization
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={getDirectionBadgeVariant(group.direction)}>
          {getDirectionLabel(group.direction, dictionary)}
        </Badge>
        {confidence ? (
          <Badge variant="outline">
            {formatMessage(
              dictionary.marketCharts.annotations.confidenceBadge,
              {
                value: confidence,
              }
            )}
          </Badge>
        ) : null}
        <AppTimeMetadata icon={CalendarClock}>
          {formatAnnotationTime(group, localization)}
        </AppTimeMetadata>
        {group.annotations.length > 1 ? (
          <Badge variant="secondary">
            {formatMessage(dictionary.marketCharts.annotations.eventCount, {
              count: formatNumber(group.annotations.length),
            })}
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        {group.annotations.map((annotation) => {
          const eventId = getAnnotationEventId(annotation)

          return (
            <article key={annotation.id} className="flex flex-col gap-1.5">
              <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
                {eventId ? (
                  <button
                    type="button"
                    className="text-left rounded-sm underline-offset-4 transition-colors outline-none hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring/50"
                    onClick={() => onEventOpen(eventId)}
                  >
                    {annotation.title}
                  </button>
                ) : (
                  annotation.title
                )}
              </h3>
              {annotation.summary ? (
                <p className="line-clamp-4 text-sm text-muted-foreground">
                  {annotation.summary}
                </p>
              ) : null}
            </article>
          )
        })}
      </div>
    </div>
  )
}

function MarketChartAnnotationPopup({
  group,
  onClose,
  onEventOpen,
}: {
  group: MarketChartAnnotationGroup
  onClose: () => void
  onEventOpen: (eventId: number) => void
}) {
  const { dictionary } = useLocalization()

  return (
    <div className="max-h-[min(28rem,calc(100vh-8rem))] overflow-y-auto rounded-2xl border bg-popover p-3 text-popover-foreground shadow-xl">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex size-3 rounded-full bg-destructive">
            <span className="market-chart-annotation-popup-pulse absolute inset-0 rounded-full bg-destructive/30" />
          </span>
          <span className="text-sm font-semibold">
            {dictionary.marketCharts.annotations.eventLabel}
          </span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label={dictionary.marketCharts.annotations.closeEventDetails}
        >
          <X />
        </Button>
      </div>
      <MarketChartAnnotationDetail group={group} onEventOpen={onEventOpen} />
      <style>
        {`
          @media (prefers-reduced-motion: no-preference) {
            .market-chart-annotation-popup-pulse {
              animation: market-chart-annotation-popup-pulse 1.8s ease-out infinite;
            }
          }

          @keyframes market-chart-annotation-popup-pulse {
            0% {
              opacity: 0.7;
              transform: scale(0.7);
            }
            70% {
              opacity: 0;
              transform: scale(2.4);
            }
            100% {
              opacity: 0;
              transform: scale(2.4);
            }
          }
        `}
      </style>
    </div>
  )
}

function MarketChartAnnotationControls({
  annotationLayerEnabled,
  freshnessLabel,
  groups,
  isLoading,
}: {
  annotationLayerEnabled: boolean
  freshnessLabel: string | null
  groups: MarketChartAnnotationGroup[]
  isLoading: boolean
}) {
  const { dictionary, formatMessage, formatNumber } = useLocalization()
  const label = annotationLayerEnabled
    ? isLoading
      ? dictionary.marketCharts.annotations.loadingEvents
      : groups.length > 0
        ? formatMessage(dictionary.marketCharts.annotations.eventMarkers, {
            count: formatNumber(groups.length),
          })
        : dictionary.marketCharts.annotations.noEvents
    : null
  const hasEvents = groups.length > 0

  return (
    <div className="border-t bg-muted/10 p-3">
      <div className="flex min-h-4 flex-col gap-2 text-xs font-medium text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        {label ? (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "size-2 rounded-full",
                hasEvents ? "bg-destructive" : "bg-muted-foreground/40"
              )}
            />
            {label}
          </div>
        ) : (
          <span aria-hidden="true" />
        )}
        {freshnessLabel ? (
          <div className="sm:text-right">
            <AppTimeMetadata icon={RefreshCw}>{freshnessLabel}</AppTimeMetadata>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function MarketChartWorkbench({
  watchlistAssets,
  watchlistError,
}: MarketChartWorkbenchProps) {
  const localization = useLocalization()
  const { dictionary } = localization
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [selection, setSelection] = useState<MarketChartSelectionState>(() =>
    createDefaultSelection(watchlistAssets)
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [phase, setPhase] = useState<WorkbenchPhase>("idle")
  const [data, setData] = useState<MarketChartCandleResponse | null>(null)
  const [loadedData, setLoadedData] =
    useState<MarketChartCandleResponse | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [lastAssetId, setLastAssetId] = useState<string | null>(null)
  const [chartResetNonce, setChartResetNonce] = useState(0)
  const [annotationLayerEnabled, setAnnotationLayerEnabled] = useState(false)
  const [selectedAnnotationGroupId, setSelectedAnnotationGroupId] = useState<
    string | null
  >(null)
  const [selectedAnnotationPoint, setSelectedAnnotationPoint] =
    useState<MarketChartAnnotationMarkerPoint | null>(null)
  const [quickDetailEntity, setQuickDetailEntity] =
    useState<LocalQuickDetailEntity | null>(null)
  const [isPending, startTransition] = useTransition()
  const hasWatchlistAssets = watchlistAssets.length > 0
  const selectedAsset = findWatchlistAsset(watchlistAssets, selection.assetId)
  const isBusy = phase === "loading" || isPending
  const timeframeLabels = getMarketChartTimeframeLabels(dictionary)
  const freshnessLabel = getFreshnessLabel(data, phase, localization)
  const chartData = loadedData ?? data
  const chartResetKey = [
    data?.asset.id ?? selectedAsset?.assetId ?? selection.assetId,
    data?.timeframe ?? selection.timeframe,
    annotationLayerEnabled ? "annotations" : "price",
    chartResetNonce,
  ].join(":")
  const annotationGroups = useMemo(() => {
    if (!annotationLayerEnabled || !chartData) {
      return []
    }

    return createMarketChartAnnotationGroups(
      chartData.annotations,
      chartData.candles
    )
  }, [annotationLayerEnabled, chartData])
  const selectedAnnotationGroup =
    annotationGroups.find((group) => group.id === selectedAnnotationGroupId) ??
    null

  const loadCandles = useCallback(
    async function loadCandles(
      asset: WorkspaceWatchlistAssetListItemResponse,
      timeframe: MarketChartTimeframe,
      includeAnnotations = annotationLayerEnabled
    ) {
      const request = createLatestCandleRequest(
        asset,
        timeframe,
        includeAnnotations
      )

      setPhase("loading")
      setLoadError(null)
      setLoadedData(null)
      setLastAssetId(String(asset.assetId))
      setSelectedAnnotationGroupId(null)
      setSelectedAnnotationPoint(null)

      const result = await getMarketChartCandles(request)

      if (!result.success) {
        setData(null)
        setLoadedData(null)
        setPhase("error")
        setLoadError(result.error)
        return
      }

      setData(result.data)
      setLoadedData(result.data)
      setChartResetNonce((current) => current + 1)
      setPhase("success")
    },
    [annotationLayerEnabled]
  )

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (watchlistError) {
        setData(null)
        setLoadedData(null)
        setErrors({ form: watchlistError })
        setLoadError(watchlistError)
        setPhase("idle")
        setLastAssetId(null)
        setSelectedAnnotationGroupId(null)
        setSelectedAnnotationPoint(null)
        return
      }

      if (!hasWatchlistAssets) {
        setSelection(createDefaultSelection(watchlistAssets))
        setData(null)
        setLoadedData(null)
        setErrors({})
        setLoadError(null)
        setPhase("idle")
        setLastAssetId(null)
        setSelectedAnnotationGroupId(null)
        setSelectedAnnotationPoint(null)
        return
      }

      const assetId = getSingleParam(searchParams, "assetId")
      const timeframeParam = getSingleParam(searchParams, "timeframe")
      const timeframe = getTimeframeFromSearchParams(searchParams)

      if (timeframeParam && !isMarketChartTimeframe(timeframeParam)) {
        setSelection({
          assetId: assetId || String(watchlistAssets[0].assetId),
          timeframe: DEFAULT_MARKET_CHART_TIMEFRAME,
        })
        setData(null)
        setLoadedData(null)
        setErrors({
          timeframe: dictionary.marketCharts.state.unsupportedTimeframeUrl,
        })
        setLoadError(dictionary.marketCharts.state.unsupportedTimeframeUrlError)
        setPhase("error")
        setLastAssetId(null)
        setSelectedAnnotationGroupId(null)
        setSelectedAnnotationPoint(null)
        return
      }

      if (!assetId) {
        const nextSelection = {
          assetId: String(watchlistAssets[0].assetId),
          timeframe,
        }
        setSelection(nextSelection)
        setPhase("loading")
        startTransition(() => {
          router.replace(`${pathname}?${createQueryString(nextSelection)}`, {
            scroll: false,
          })
        })
        return
      }

      const asset = findWatchlistAsset(watchlistAssets, assetId)
      const nextSelection = { assetId, timeframe }
      setSelection(nextSelection)

      if (!asset) {
        setData(null)
        setLoadedData(null)
        setErrors({
          assetId: dictionary.marketCharts.state.assetMissingUrl,
        })
        setLoadError(dictionary.marketCharts.state.assetMissingUrlError)
        setPhase("error")
        setLastAssetId(null)
        setSelectedAnnotationGroupId(null)
        setSelectedAnnotationPoint(null)
        return
      }

      setErrors({})
      void loadCandles(asset, timeframe, annotationLayerEnabled)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [
    annotationLayerEnabled,
    dictionary,
    hasWatchlistAssets,
    loadCandles,
    pathname,
    router,
    searchParams,
    watchlistAssets,
    watchlistError,
  ])

  function updateRoute(nextSelection: MarketChartSelectionState) {
    setSelection(nextSelection)
    setErrors({})

    if (!nextSelection.assetId) {
      setData(null)
      setLoadedData(null)
      setPhase("idle")
      setSelectedAnnotationGroupId(null)
      setSelectedAnnotationPoint(null)
      return
    }

    setPhase("loading")
    setLoadedData(null)
    setSelectedAnnotationGroupId(null)
    setSelectedAnnotationPoint(null)
    startTransition(() => {
      router.replace(`${pathname}?${createQueryString(nextSelection)}`, {
        scroll: false,
      })
    })
  }

  function handleAssetChange(assetId: string) {
    updateRoute({ ...selection, assetId })
  }

  function handleTimeframeChange(value: string) {
    if (!isMarketChartTimeframe(value)) {
      setErrors((current) => ({
        ...current,
        timeframe: dictionary.marketCharts.unsupportedTimeframe,
      }))
      return
    }

    updateRoute({ ...selection, timeframe: value })
  }

  function handleAnnotationLayerChange(checked: boolean) {
    setAnnotationLayerEnabled(checked)
    setLoadedData(null)
    setSelectedAnnotationGroupId(null)
    setSelectedAnnotationPoint(null)

    if (selectedAsset) {
      setPhase("loading")
    }
  }

  function handleAnnotationSelect(
    groupId: string,
    point?: MarketChartAnnotationMarkerPoint | null
  ) {
    setSelectedAnnotationGroupId(groupId)
    setSelectedAnnotationPoint(point ?? null)
  }

  function handleAnnotationClose() {
    setSelectedAnnotationGroupId(null)
    setSelectedAnnotationPoint(null)
  }

  function handleAnnotationEventOpen(eventId: number) {
    setQuickDetailEntity({ id: eventId, kind: "event" })
    handleAnnotationClose()
  }

  function handleLoadedDataChange(nextData: MarketChartLoadedData) {
    setLoadedData((current) => {
      const baseData = current ?? data

      if (!baseData) {
        return current
      }

      return {
        ...baseData,
        annotations: nextData.annotations,
        candles: nextData.candles,
        from: nextData.from ?? baseData.from,
      }
    })
  }

  function handleRefresh() {
    const asset =
      selectedAsset || findWatchlistAsset(watchlistAssets, lastAssetId || "")

    if (!asset) {
      setErrors({
        assetId: dictionary.marketCharts.state.selectAssetBeforeRefresh,
      })
      return
    }

    void loadCandles(asset, selection.timeframe, annotationLayerEnabled)
  }

  return (
    <div className="w-full" aria-busy={isBusy}>
      {errors.form ? (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
          {errors.form}
        </div>
      ) : null}

      <ChartSurface
        annotationLayerEnabled={annotationLayerEnabled}
        annotationGroups={annotationGroups}
        chartResetKey={chartResetKey}
        data={data}
        error={loadError}
        errors={errors}
        freshnessLabel={freshnessLabel}
        isBusy={isBusy}
        phase={phase}
        selection={selection}
        selectedAsset={selectedAsset}
        selectedAnnotationGroup={selectedAnnotationGroup}
        selectedAnnotationPoint={selectedAnnotationPoint}
        timeframeLabels={timeframeLabels}
        watchlistAssets={watchlistAssets}
        watchlistError={watchlistError}
        hasWatchlistAssets={hasWatchlistAssets}
        onAnnotationClose={handleAnnotationClose}
        onAnnotationLayerChange={handleAnnotationLayerChange}
        onAnnotationSelect={handleAnnotationSelect}
        onAssetChange={handleAssetChange}
        onLoadedDataChange={handleLoadedDataChange}
        onRetry={handleRefresh}
        onTimeframeChange={handleTimeframeChange}
        onAnnotationEventOpen={handleAnnotationEventOpen}
      />

      <LocalEntityQuickDetailDrawer
        entity={quickDetailEntity}
        onClose={() => setQuickDetailEntity(null)}
      />

      <div
        className={cn(
          "sr-only",
          phase === "error" ? "aria-live-assertive" : "aria-live-polite"
        )}
        aria-live={phase === "error" ? "assertive" : "polite"}
      >
        {phase === "loading"
          ? dictionary.marketCharts.state.loadingAnnouncement
          : phase === "success"
            ? dictionary.marketCharts.state.successAnnouncement
            : phase === "error"
              ? loadError || dictionary.marketCharts.state.errorAnnouncement
              : ""}
      </div>
    </div>
  )
}
