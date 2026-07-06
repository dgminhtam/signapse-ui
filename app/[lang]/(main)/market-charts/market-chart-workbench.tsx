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
  ArrowDown,
  ArrowUp,
  CalendarClock,
  Camera,
  ChartCandlestick,
  DatabaseZap,
  Expand,
  Minimize2,
  RefreshCw,
  SlidersHorizontal,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

import {
  getMarketChartAnnotations,
  getMarketChartCandles,
} from "@/app/api/market-charts/action"
import type { ActionResult } from "@/app/lib/definitions"
import { useLocalization } from "@/app/lib/i18n/provider"
import {
  DEFAULT_MARKET_CHART_TIMEFRAME,
  MARKET_CHART_TIMEFRAMES,
  type MarketChartAnnotationDirection,
  type MarketChartAnnotationReactionResponse,
  type MarketChartAnnotationResponse,
  MarketChartCandleRequest,
  MarketChartCandleResponse,
  MarketChartCandleItemResponse,
  type MarketChartLiveQuoteResponse,
  type MarketChartLiveStatusResponse,
  type MarketChartLiveStreamState,
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
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
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
  createMarketChartWarmAnnotationGroups,
  getMarketChartAnnotationColorClassNames,
  type MarketChartAnnotationGroup,
} from "./market-chart-annotations"
import {
  LocalEntityQuickDetailDrawer,
  type LocalQuickDetailEntity,
} from "../local-entity-quick-detail-drawer"
import {
  MarketChartCanvas,
  type MarketChartCanvasHandle,
  type MarketChartDrawingSelection,
  type MarketChartIndicatorName,
  type MarketChartLoadedData,
  type MarketChartOutcomeHoverRange,
} from "./market-chart-canvas"
import { MarketChartDrawingToolbar } from "./market-chart-drawing-toolbar"
import {
  DEFAULT_MARKET_CHART_DRAWING_PALETTE_TOOLS,
  getMarketChartDrawingToolPalette,
  type MarketChartDrawingPaletteSelection,
  type MarketChartDrawingState,
  type MarketChartDrawingTool,
} from "./market-chart-drawing"
import {
  MARKET_CHART_DRAWING_COLOR_PRESETS,
  MARKET_CHART_DRAWING_SIZES,
  type MarketChartDrawingColor,
  type MarketChartDrawingSize,
  resolveMarketChartDrawingColor,
  type MarketChartDrawingStyle,
} from "./market-chart-drawing-style"
import {
  deriveLiveCandleItemFromQuote,
  hasUsableVolumeData,
} from "./market-chart-candle-helpers"
import { openMarketChartLiveStream } from "./market-chart-live-stream"
import { MarketChartSurfaceSkeleton } from "./market-chart-skeleton"

type WorkbenchPhase = "idle" | "loading" | "success" | "error"

type MarketChartSelectionState = {
  assetId: string
  timeframe: MarketChartTimeframe
}

type FormErrors = Partial<Record<keyof MarketChartSelectionState, string>> & {
  form?: string
}

type MarketChartLiveRuntimeState = {
  error: string | null
  quote: MarketChartLiveQuoteResponse | null
  status: MarketChartLiveStatusResponse | null
  transportState: MarketChartLiveStreamState | null
}

type MarketChartDisplayData = MarketChartCandleResponse & {
  annotations: MarketChartAnnotationResponse[]
}

const MARKET_CHART_ANNOTATION_LEGEND_DIRECTIONS = [
  "BULLISH",
  "BEARISH",
  "NEUTRAL",
  "MIXED",
] as const satisfies readonly MarketChartAnnotationDirection[]

interface MarketChartWorkbenchProps {
  watchlistAssets: WorkspaceWatchlistAssetListItemResponse[]
  watchlistError: string | null
}

const INITIAL_WINDOW_DAYS: Record<MarketChartTimeframe, number> = {
  "1m": 1,
  "5m": 1,
  "15m": 2,
  "30m": 4,
  "1h": 30,
  "1d": 150,
  "1w": 770,
  "1mo": 3650,
}
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
  isLocked: false,
  isMagnetEnabled: false,
  isVisible: true,
  selectedTools: DEFAULT_MARKET_CHART_DRAWING_PALETTE_TOOLS,
}
const DEFAULT_MARKET_CHART_LIVE_STATE: MarketChartLiveRuntimeState = {
  error: null,
  quote: null,
  status: null,
  transportState: null,
}
const MARKET_CHART_ANNOTATION_BADGE_TONE_CLASS_NAMES = {
  blue: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  green: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
  purple: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  red: "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  sky: "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
}

const MARKET_CHART_MOVEMENT_CLASS_NAMES = {
  down: "text-red-600 dark:text-red-400",
  up: "text-green-600 dark:text-green-400",
}

type MarketChartMovementDirection = keyof typeof MARKET_CHART_MOVEMENT_CLASS_NAMES

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
  timeframe: MarketChartTimeframe
): MarketChartCandleRequest {
  const to = new Date()
  const from = new Date(to)
  from.setDate(to.getDate() - INITIAL_WINDOW_DAYS[timeframe])

  return {
    assetId: asset.assetId,
    timeframe,
    from: from.toISOString(),
    to: to.toISOString(),
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

function createMarketChartDisplayData(
  data: MarketChartCandleResponse,
  annotations: MarketChartAnnotationResponse[] = []
): MarketChartDisplayData {
  return {
    ...data,
    annotations,
  }
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

function getPredictionBadgeClassName(direction: string | null | undefined) {
  switch (direction) {
    case "BULLISH":
      return MARKET_CHART_ANNOTATION_BADGE_TONE_CLASS_NAMES.green
    case "BEARISH":
      return MARKET_CHART_ANNOTATION_BADGE_TONE_CLASS_NAMES.red
    case "MIXED":
      return MARKET_CHART_ANNOTATION_BADGE_TONE_CLASS_NAMES.purple
    case "NEUTRAL":
      return MARKET_CHART_ANNOTATION_BADGE_TONE_CLASS_NAMES.sky
    default:
      return MARKET_CHART_ANNOTATION_BADGE_TONE_CLASS_NAMES.blue
  }
}

function formatOutcomeReturn(
  value: number | null | undefined,
  localization: LocalizationContext
) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null
  }

  const normalizedValue = Math.abs(value) <= 1 ? value : value / 100

  return localization.formatPercent(normalizedValue, {
    maximumFractionDigits: 2,
  })
}

function formatOutcomePrice(
  value: number | null | undefined,
  localization: LocalizationContext
) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null
  }

  return localization.formatNumber(value, {
    maximumFractionDigits: 4,
  })
}

function formatOptionalMarketChartDateTime(
  value: string | null | undefined,
  localization: LocalizationContext
) {
  if (!value) {
    return null
  }

  const fallback = localization.dictionary.marketCharts.format.notAvailable
  const formatted = localization.formatDateTime(
    value,
    MARKET_CHART_DATE_TIME_OPTIONS,
    fallback
  )

  return formatted === fallback ? null : formatted
}

function formatMarketChartValueRange(
  start: string | null,
  end: string | null
) {
  return start && end ? `${start} -> ${end}` : start ?? end
}

function getMarketChartPriceMovementDirection(
  anchorPrice: number | null | undefined,
  evaluationPrice: number | null | undefined
) {
  if (
    typeof anchorPrice !== "number" ||
    typeof evaluationPrice !== "number" ||
    !Number.isFinite(anchorPrice) ||
    !Number.isFinite(evaluationPrice) ||
    anchorPrice === evaluationPrice
  ) {
    return null
  }

  return evaluationPrice > anchorPrice ? "up" : "down"
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
  liveState: MarketChartLiveRuntimeState,
  localization: LocalizationContext
) {
  const timestamp =
    liveState.quote?.receivedAt ||
    liveState.quote?.providerTime ||
    data?.to

  if (phase !== "success" || !timestamp) {
    return null
  }

  const updatedAt = formatMarketChartDateTime(timestamp, localization)

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

function getLiveStatusLabel(
  liveState: MarketChartLiveRuntimeState,
  localization: LocalizationContext
) {
  const live = localization.dictionary.marketCharts.live

  if (liveState.error) {
    return live.error
  }

  const state = liveState.status?.state ?? liveState.transportState

  switch (state) {
    case "CONNECTING":
      return live.connecting
    case "CONNECTED":
    case "SUBSCRIBED":
      return live.live
    case "RECONNECTING":
      return live.reconnecting
    case "STALE":
    case "MARKET_CLOSED":
      return live.stale
    case "DISCONNECTED":
    case "UNSUBSCRIBED":
      return live.disconnected
    case "ERROR":
      return live.error
    default:
      return null
  }
}

function getLiveStatusTone(liveState: MarketChartLiveRuntimeState) {
  if (liveState.error) {
    return "error" as const
  }

  const state = liveState.status?.state ?? liveState.transportState

  if (state === "CONNECTED" || state === "SUBSCRIBED") {
    return "live" as const
  }

  if (
    state === "STALE" ||
    state === "RECONNECTING" ||
    state === "MARKET_CLOSED"
  ) {
    return "stale" as const
  }

  if (state === "ERROR" || state === "DISCONNECTED" || state === "UNSUBSCRIBED") {
    return "error" as const
  }

  return "pending" as const
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

function createMarketChartDrawingState(
  selectedTools: MarketChartDrawingPaletteSelection =
    DEFAULT_MARKET_CHART_DRAWING_PALETTE_TOOLS
): MarketChartDrawingState {
  return {
    ...DEFAULT_MARKET_CHART_DRAWING_STATE,
    selectedTools: { ...selectedTools },
  }
}

function getAnnotationGroupsSummaryDirection(
  groups: MarketChartAnnotationGroup[]
): MarketChartAnnotationDirection | null {
  const directions = groups
    .map((group) => group.direction)
    .filter((direction): direction is MarketChartAnnotationDirection => !!direction)
  const [firstDirection] = directions

  if (!firstDirection) {
    return null
  }

  return directions.every((direction) => direction === firstDirection)
    ? firstDirection
    : "MIXED"
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
  warmAnnotationGroups,
  data,
  error,
  errors,
  freshnessLabel,
  isBusy,
  liveCandle,
  liveStatusLabel,
  liveStatusTone,
  phase,
  dataVersion,
  selection,
  selectedAsset,
  onAnnotationEventOpen,
  selectedAnnotationGroup,
  showVolumePane,
  timeframeLabels,
  watchlistAssets,
  watchlistError,
  hasWatchlistAssets,
  onAnnotationClose,
  onAnnotationLayerChange,
  onAnnotationSelect,
  onAssetChange,
  onLoadedDataChange,
  onLoadOlderCandles,
  onRetry,
  onTimeframeChange,
}: {
  annotationLayerEnabled: boolean
  annotationGroups: MarketChartAnnotationGroup[]
  warmAnnotationGroups: MarketChartAnnotationGroup[]
  dataVersion: number
  data: MarketChartDisplayData | null
  error: string | null
  errors: FormErrors
  freshnessLabel: string | null
  isBusy: boolean
  liveCandle: MarketChartCandleItemResponse | null
  liveStatusLabel: string | null
  liveStatusTone: "error" | "live" | "pending" | "stale"
  phase: WorkbenchPhase
  selection: MarketChartSelectionState
  selectedAsset: WorkspaceWatchlistAssetListItemResponse | null
  onAnnotationEventOpen: (eventId: number) => void
  selectedAnnotationGroup: MarketChartAnnotationGroup | null
  showVolumePane: boolean
  timeframeLabels: Record<MarketChartTimeframe, string>
  watchlistAssets: WorkspaceWatchlistAssetListItemResponse[]
  watchlistError: string | null
  hasWatchlistAssets: boolean
  onAnnotationClose: () => void
  onAnnotationLayerChange: (checked: boolean) => void
  onAnnotationSelect: (groupId: string) => void
  onAssetChange: (value: string) => void
  onLoadedDataChange: (data: MarketChartLoadedData) => void
  onLoadOlderCandles: (
    request: MarketChartCandleRequest
  ) => Promise<ActionResult<MarketChartLoadedData>>
  onRetry: () => void
  onTimeframeChange: (value: MarketChartTimeframe) => void
}) {
  const localization = useLocalization()
  const { dictionary, formatMessage } = localization
  const chartCanvasRef = useRef<MarketChartCanvasHandle | null>(null)
  const [activeOutcomeHoverRange, setActiveOutcomeHoverRange] =
    useState<MarketChartOutcomeHoverRange | null>(null)

  function handleAnnotationClose() {
    setActiveOutcomeHoverRange(null)
    onAnnotationClose()
  }

  function handleOutcomeRangeHover(range: MarketChartOutcomeHoverRange) {
    setActiveOutcomeHoverRange(range)
  }

  function handleOutcomeRangeLeave() {
    setActiveOutcomeHoverRange(null)
  }

  function renderAnnotationPopup(group: MarketChartAnnotationGroup) {
    const colorClassNames = getMarketChartAnnotationColorClassNames(
      group.direction
    )
    const eventCountLabel = formatMessage(
      dictionary.marketCharts.annotations.eventCount,
      {
        count: localization.formatNumber(group.annotations.length),
      }
    )

    return (
      <>
        <PopoverHeader className="flex-row items-center justify-between gap-3">
          <PopoverTitle className="min-w-0">
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-semibold",
                colorClassNames.dot,
                colorClassNames.foreground
              )}
            >
              {eventCountLabel}
            </span>
          </PopoverTitle>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={handleAnnotationClose}
            aria-label={dictionary.marketCharts.annotations.closeEventDetails}
          >
            <X />
          </Button>
        </PopoverHeader>
        <Separator className="my-1" />
        <ScrollArea className="max-h-[min(24rem,calc(100vh-11rem))] [&>[data-slot=scroll-area-viewport]]:max-h-[min(24rem,calc(100vh-11rem))]">
          <MarketChartAnnotationDetail
            group={group}
            onEventOpen={onAnnotationEventOpen}
            onOutcomeRangeHover={handleOutcomeRangeHover}
            onOutcomeRangeLeave={handleOutcomeRangeLeave}
          />
        </ScrollArea>
      </>
    )
  }
  const surfaceRef = useRef<HTMLElement | null>(null)
  const [activeIndicators, setActiveIndicators] = useState<
    MarketChartIndicatorName[]
  >([])
  const [drawingState, setDrawingState] = useState<MarketChartDrawingState>(
    () => createMarketChartDrawingState()
  )
  const [selectedDrawing, setSelectedDrawing] =
    useState<MarketChartDrawingSelection | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)



  const hasCandles = (data?.candles.length ?? 0) > 0 || !!liveCandle
  const displaySymbol = getDisplayAssetSymbol(data, selectedAsset, dictionary)

  useEffect(() => {
    setActiveOutcomeHoverRange(null)
  }, [selectedAnnotationGroup?.id])

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
      selectedTools: tool
        ? {
            ...current.selectedTools,
            [getMarketChartDrawingToolPalette(tool)]: tool,
          }
        : current.selectedTools,
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

  function handleSelectedDrawingStyleChange(
    patch: Partial<MarketChartDrawingStyle>
  ) {
    if (!chartCanvasRef.current?.updateSelectedDrawingStyle(patch)) {
      toast.error(dictionary.marketCharts.drawings.styleUnavailable)
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
      className="flex h-[calc(100svh-8.5rem)] max-h-[58rem] min-h-[36rem] flex-col overflow-hidden rounded-xl border border-border bg-card data-[fullscreen=true]:mt-0 data-[fullscreen=true]:h-screen data-[fullscreen=true]:max-h-none data-[fullscreen=true]:min-h-0 data-[fullscreen=true]:rounded-none data-[fullscreen=true]:border-0"
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
        className="relative min-h-0 flex-1 overflow-hidden bg-card"
      >


        {/* Canvas: always mounted when there's a selected asset */}
        {selectedAsset ? (
          <div className="absolute inset-0" style={{ zIndex: 0 }}>
            <div className="flex h-full min-h-0 min-w-0">
              {data && hasCandles ? (
                <MarketChartDrawingToolbar
                  disabled={isBusy}
                  state={drawingState}
                  onClearAll={handleClearDrawings}
                  onDeleteSelected={handleDeleteSelectedDrawing}
                  onStateChange={handleDrawingStateChange}
                  onToolChange={handleDrawingToolChange}
                />
              ) : null}
              <div className={cn("relative min-h-0", phase === "success" && hasCandles ? "flex-1" : "flex-1 invisible")}>
                <MarketChartCanvas
                  ref={chartCanvasRef}
                  activeIndicators={activeIndicators}
                  annotations={data?.annotations ?? []}
                  assetId={selectedAsset.assetId}
                  candles={data?.candles ?? []}
                  dataVersion={dataVersion}
                  className="h-full min-h-0"
                  drawingToolActive={!!drawingState.activeTool}
                  annotationLayerEnabled={annotationLayerEnabled}
                  activeOutcomeHoverRange={activeOutcomeHoverRange}
                  liveCandle={liveCandle}
                  showVolumePane={showVolumePane}
                  timeframe={selection.timeframe}
                  symbol={displaySymbol}
                  annotationGroups={annotationGroups}
                  warmAnnotationGroups={warmAnnotationGroups}
                  renderAnnotationPopup={renderAnnotationPopup}
                  selectedAnnotationGroupId={selectedAnnotationGroup?.id}
                  onAnnotationSelect={onAnnotationSelect}
                  onAnnotationClose={handleAnnotationClose}
                  onDrawingSelectionChange={(selection) => {
                    setSelectedDrawing(selection)
                    setDrawingState((current) => ({
                      ...current,
                      hasSelectedDrawing: !!selection,
                    }))
                  }}
                  onDrawingToolComplete={() =>
                    setDrawingState((current) => ({
                      ...current,
                      activeTool: null,
                    }))
                  }
                  onLoadedDataChange={onLoadedDataChange}
                  onLoadOlderCandles={onLoadOlderCandles}
                />
                {selectedDrawing && !drawingState.activeTool ? (
                  <MarketChartSelectedDrawingToolbar
                    selection={selectedDrawing}
                    onDelete={handleDeleteSelectedDrawing}
                    onStyleChange={handleSelectedDrawingStyleChange}
                  />
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

        {/* Overlay states on top of canvas (only when non-success) */}
        {selectedAsset && !(phase === "success" && hasCandles) ? (
          <div className="absolute inset-0 z-10 bg-card">
            {watchlistError ? (
              <Empty className="h-full min-h-[32rem] border-0 bg-transparent">
                <EmptyHeader>
                  <EmptyMedia variant="icon" className="bg-destructive/10 text-destructive">
                    <TriangleAlert />
                  </EmptyMedia>
                  <EmptyTitle>{dictionary.marketCharts.empty.watchlistErrorTitle}</EmptyTitle>
                  <EmptyDescription>{watchlistError}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : !hasWatchlistAssets ? (
              <Empty className="h-full min-h-[32rem] border-0 bg-transparent">
                <EmptyHeader>
                  <EmptyMedia variant="icon"><ChartCandlestick /></EmptyMedia>
                  <EmptyTitle>{dictionary.marketCharts.empty.noWatchlistAssetsTitle}</EmptyTitle>
                  <EmptyDescription>{dictionary.marketCharts.empty.noWatchlistAssetsDescription}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : phase === "idle" ? (
              <Empty className="h-full min-h-[32rem] border-0 bg-transparent">
                <EmptyHeader>
                  <EmptyMedia variant="icon"><ChartCandlestick /></EmptyMedia>
                  <EmptyTitle>{dictionary.marketCharts.empty.idleTitle}</EmptyTitle>
                  <EmptyDescription>{dictionary.marketCharts.empty.idleDescription}</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : phase === "loading" ? (
              <MarketChartSurfaceSkeleton embedded />
            ) : phase === "error" ? (
              <Empty className="h-full min-h-[32rem] border-0 bg-transparent">
                <EmptyHeader>
                  <EmptyMedia variant="icon" className="bg-destructive/10 text-destructive">
                    <TriangleAlert />
                  </EmptyMedia>
                  <EmptyTitle>{dictionary.marketCharts.empty.loadErrorTitle}</EmptyTitle>
                  <EmptyDescription>{error || dictionary.marketCharts.empty.loadErrorDescription}</EmptyDescription>
                </EmptyHeader>
                {selectedAsset ? (
                  <Button type="button" variant="outline" onClick={onRetry}>
                    <RefreshCw data-icon="inline-start" />
                    {dictionary.marketCharts.controls.refreshLatestData}
                  </Button>
                ) : null}
              </Empty>
            ) : phase === "success" && data && !hasCandles ? (
              <Empty className="h-full min-h-[32rem] border-0 bg-transparent">
                <EmptyHeader>
                  <EmptyMedia variant="icon"><DatabaseZap /></EmptyMedia>
                  <EmptyTitle>{dictionary.marketCharts.empty.noCandlesTitle}</EmptyTitle>
                  <EmptyDescription>
                    {formatMessage(dictionary.marketCharts.empty.noCandlesDescription, {
                      symbol: getDisplayAssetSymbol(data, selectedAsset, dictionary),
                    })}
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
          </div>
        ) : null}
      </div>

      <MarketChartAnnotationLegend
        annotationLayerEnabled={annotationLayerEnabled}
        groups={annotationGroups}
      />

      <MarketChartAnnotationControls
        annotationLayerEnabled={annotationLayerEnabled}
        freshnessLabel={freshnessLabel}
        groups={annotationGroups}
        isLoading={phase === "loading"}
        liveStatusLabel={liveStatusLabel}
        liveStatusTone={liveStatusTone}
      />

      {selectedAnnotationGroup ? (
        <div className="border-t bg-muted/10 p-3 sm:hidden">
          <div className="overflow-hidden rounded-xl border bg-popover">
            <div className="flex items-center justify-between gap-3 border-b px-3 py-2.5">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-semibold",
                    getMarketChartAnnotationColorClassNames(selectedAnnotationGroup.direction).dot,
                    getMarketChartAnnotationColorClassNames(selectedAnnotationGroup.direction).foreground
                  )}
                >
                  {formatMessage(dictionary.marketCharts.annotations.eventCount, {
                    count: localization.formatNumber(
                      selectedAnnotationGroup.annotations.length
                    ),
                  })}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={handleAnnotationClose}
                aria-label={dictionary.marketCharts.annotations.closeEventDetails}
              >
                <X />
              </Button>
            </div>
            <ScrollArea className="h-[min(24rem,calc(100vh-11rem))] p-3">
              <MarketChartAnnotationDetail
                group={selectedAnnotationGroup}
                onEventOpen={onAnnotationEventOpen}
                onOutcomeRangeHover={handleOutcomeRangeHover}
                onOutcomeRangeLeave={handleOutcomeRangeLeave}
              />
            </ScrollArea>
          </div>
        </div>
      ) : null}
    </section>
  )
}

function MarketChartSelectedDrawingToolbar({
  selection,
  onDelete,
  onStyleChange,
}: {
  selection: MarketChartDrawingSelection
  onDelete: () => void
  onStyleChange: (patch: Partial<MarketChartDrawingStyle>) => void
}) {
  const { dictionary, formatMessage } = useLocalization()
  const labels = dictionary.marketCharts.drawings
  const anchor = selection.anchor ?? { x: 120, y: 52 }
  const selectedColor = resolveMarketChartDrawingColor(selection.style.color)
  const [colorPopoverOpen, setColorPopoverOpen] = useState(false)
  const [sizePopoverOpen, setSizePopoverOpen] = useState(false)

  function handleColorChange(color: MarketChartDrawingColor) {
    onStyleChange({ color })
    setColorPopoverOpen(false)
  }

  function handleSizeChange(size: MarketChartDrawingSize) {
    onStyleChange({ size })
    setSizePopoverOpen(false)
  }

  return (
    <div
      className="absolute z-20 flex max-w-[calc(100%-1rem)] -translate-x-1/2 -translate-y-full flex-wrap items-center gap-1 rounded-lg border bg-popover p-1 text-popover-foreground shadow-md"
      style={{ left: anchor.x, top: anchor.y }}
      role="toolbar"
      aria-label={labels.selectedToolbarLabel}
    >
      <Popover open={colorPopoverOpen} onOpenChange={setColorPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={labels.openColorPalette}
          >
            <span
              aria-hidden="true"
              className="size-3 rounded-full ring-1 ring-foreground/20"
              style={{ backgroundColor: selectedColor }}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" side="top" className="w-auto">
          <div
            className="grid grid-cols-4 gap-1"
            role="group"
            aria-label={labels.colorLabel}
          >
            {MARKET_CHART_DRAWING_COLOR_PRESETS.map((preset) => {
              const selected = selection.style.color === preset.value
              const color = resolveMarketChartDrawingColor(preset.value)

              return (
                <Button
                  key={preset.value}
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label={labels.colors[preset.value]}
                  aria-pressed={selected}
                  onClick={() => handleColorChange(preset.value)}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "size-3 rounded-full ring-1 ring-foreground/20",
                      selected ? "ring-2 ring-ring ring-offset-1 ring-offset-popover" : null
                    )}
                    style={{ backgroundColor: color }}
                  />
                </Button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" />

      <Popover open={sizePopoverOpen} onOpenChange={setSizePopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon-xs"
            aria-label={formatMessage(labels.selectedSize, {
              size: `${selection.style.size}px`,
            })}
          >
            <MarketChartDrawingSizePreview
              compact
              color={selectedColor}
              size={selection.style.size}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" side="top" className="w-auto">
          <div
            className="flex flex-col gap-1"
            role="group"
            aria-label={labels.sizeLabel}
          >
            {MARKET_CHART_DRAWING_SIZES.map((size) => {
              const selected = selection.style.size === size

              return (
                <Button
                  key={size}
                  type="button"
                  variant="ghost"
                  size="xs"
                  aria-label={formatMessage(labels.sizeOption, {
                    size: `${size}px`,
                  })}
                  aria-pressed={selected}
                  className="justify-start"
                  onClick={() => handleSizeChange(size)}
                >
                  <MarketChartDrawingSizePreview
                    color={selectedColor}
                    selected={selected}
                    size={size}
                  />
                  <span className="sr-only">{size}px</span>
                </Button>
              )
            })}
          </div>
        </PopoverContent>
      </Popover>

      <Separator orientation="vertical" />

      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={onDelete}
        aria-label={labels.deleteSelected}
      >
        <Trash2 data-icon="inline-start" />
      </Button>
    </div>
  )
}

function MarketChartDrawingSizePreview({
  compact = false,
  color,
  selected = false,
  size,
}: {
  compact?: boolean
  color: string
  selected?: boolean
  size: MarketChartDrawingSize
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "block rounded-full",
        compact ? "w-4" : "w-8",
        selected ? "ring-2 ring-ring ring-offset-2 ring-offset-popover" : null
      )}
      style={{
        borderTopColor: color,
        borderTopStyle: "solid",
        borderTopWidth: size,
      }}
    />
  )
}

function MarketChartAnnotationLegend({
  annotationLayerEnabled,
  groups,
}: {
  annotationLayerEnabled: boolean
  groups: MarketChartAnnotationGroup[]
}) {
  const { dictionary } = useLocalization()

  if (!annotationLayerEnabled || groups.length === 0) {
    return null
  }

  return (
    <div className="border-t bg-muted/5 px-3 py-2">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-medium text-muted-foreground">
        <span className="sr-only">
          {dictionary.marketCharts.annotations.legendLabel}
        </span>
        {MARKET_CHART_ANNOTATION_LEGEND_DIRECTIONS.map((direction) => {
          const colorClassNames =
            getMarketChartAnnotationColorClassNames(direction)

          return (
            <span key={direction} className="inline-flex items-center gap-2">
              <span
                className={cn("size-2 rounded-full", colorClassNames.dot)}
              />
              {dictionary.marketCharts.directions[direction]}
            </span>
          )
        })}
      </div>
    </div>
  )
}

function MarketChartAnnotationDetail({
  group,
  onEventOpen,
  onOutcomeRangeHover,
  onOutcomeRangeLeave,
}: {
  group: MarketChartAnnotationGroup
  onEventOpen: (eventId: number) => void
  onOutcomeRangeHover: (range: MarketChartOutcomeHoverRange) => void
  onOutcomeRangeLeave: () => void
}) {
  const localization = useLocalization()

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        {group.annotations.map((annotation) => {
          const eventId = getAnnotationEventId(annotation)
          const eventTime = formatMarketChartDateTime(
            annotation.time,
            localization
          )
          const title = annotation.title || annotation.summary || ""
          const reaction =
            annotation.topMarketReaction ??
            (annotation.outcome ? { outcome: annotation.outcome } : null)

          return (
            <article key={annotation.id} className="flex flex-col gap-1.5">
              <AppTimeMetadata icon={CalendarClock}>{eventTime}</AppTimeMetadata>
              {title ? (
                <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
                  {eventId ? (
                  <button
                    type="button"
                    className="text-left rounded-sm underline-offset-4 transition-colors outline-none hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring/50"
                    onClick={() => onEventOpen(eventId)}
                  >
                    {title}
                  </button>
                  ) : (
                    title
                  )}
                </h3>
              ) : null}
              {annotation.summary ? (
                <p className="line-clamp-4 text-sm text-muted-foreground">
                  {annotation.summary}
                </p>
              ) : null}
              {reaction ? (
                <MarketChartAnnotationReactionSection
                  localization={localization}
                  onOutcomeRangeHover={onOutcomeRangeHover}
                  onOutcomeRangeLeave={onOutcomeRangeLeave}
                  reaction={reaction}
                />
              ) : null}
            </article>
          )
        })}
      </div>
    </div>
  )
}

function MarketChartMovementIcon({
  direction,
}: {
  direction: MarketChartMovementDirection | null
}) {
  const Icon =
    direction === "up" ? ArrowUp : direction === "down" ? ArrowDown : null

  return Icon ? <Icon aria-hidden="true" className="size-3" /> : null
}

function MarketChartAnnotationReactionSection({
  localization,
  onOutcomeRangeHover,
  onOutcomeRangeLeave,
  reaction,
}: {
  localization: LocalizationContext
  onOutcomeRangeHover: (range: MarketChartOutcomeHoverRange) => void
  onOutcomeRangeLeave: () => void
  reaction: MarketChartAnnotationReactionResponse
}) {
  const { dictionary } = localization
  const labels = dictionary.marketCharts.annotations
  const outcome = reaction.outcome
  const predictedDirection = reaction.direction
    ? getDirectionLabel(reaction.direction, dictionary)
    : null
  const predictedDirectionBadgeClassName = getPredictionBadgeClassName(
    reaction.direction
  )
  const realizedReturn = formatOutcomeReturn(outcome?.realizedReturn, localization)
  const actualDirection = outcome?.actualDirection
    ? getDirectionLabel(outcome.actualDirection, dictionary)
    : null
  const actualDirectionBadgeClassName = getPredictionBadgeClassName(
    outcome?.actualDirection
  )
  const anchorPrice = formatOutcomePrice(outcome?.anchorPrice, localization)
  const evaluationPrice = formatOutcomePrice(
    outcome?.evaluationPrice,
    localization
  )
  const hasPriceChange = !!anchorPrice || !!evaluationPrice
  const priceMovement = getMarketChartPriceMovementDirection(
    outcome?.anchorPrice,
    outcome?.evaluationPrice
  )
  const anchorTime = formatOptionalMarketChartDateTime(
    outcome?.anchorTime,
    localization
  )
  const evaluationTime = formatOptionalMarketChartDateTime(
    outcome?.evaluationTime,
    localization
  )
  const evaluationWindow = formatMarketChartValueRange(
    anchorTime,
    evaluationTime
  )
  const outcomeSummary = outcome?.summary?.trim() || null
  const outcomeRange =
    outcome?.anchorTime && outcome.evaluationTime
      ? {
          anchorTime: outcome.anchorTime,
          evaluationTime: outcome.evaluationTime,
        }
      : null

  function handleOutcomeRangeEnter() {
    if (outcomeRange) {
      onOutcomeRangeHover(outcomeRange)
    }
  }

  if (
    !predictedDirection &&
    !actualDirection &&
    !hasPriceChange &&
    !evaluationWindow &&
    !outcomeSummary
  ) {
    return null
  }

  return (
    <section
      className="mt-1 flex flex-col gap-1.5 rounded-md border bg-muted/20 p-2 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      tabIndex={outcomeRange ? 0 : undefined}
      onBlur={onOutcomeRangeLeave}
      onFocus={handleOutcomeRangeEnter}
      onMouseEnter={handleOutcomeRangeEnter}
      onMouseLeave={onOutcomeRangeLeave}
    >
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {predictedDirection ? (
          <span className="inline-flex items-center gap-2">
            {labels.predictedReactionTitle}
            <Badge className={predictedDirectionBadgeClassName}>
              {predictedDirection}
            </Badge>
          </span>
        ) : null}
        {actualDirection ? (
          <span className="inline-flex items-center gap-2">
            {labels.outcomeTitle}
            <Badge className={actualDirectionBadgeClassName}>
              {actualDirection}
            </Badge>
          </span>
        ) : null}
        {hasPriceChange ? (
          <span>
            {labels.priceChange}:{" "}
            {anchorPrice ? (
              <span className="font-medium text-foreground">{anchorPrice}</span>
            ) : null}
            {anchorPrice && evaluationPrice ? " -> " : null}
            {evaluationPrice ? (
              <span
                className={cn(
                  "inline-flex items-center gap-1 font-medium text-foreground",
                  priceMovement
                    ? MARKET_CHART_MOVEMENT_CLASS_NAMES[priceMovement]
                    : null
                )}
              >
                {evaluationPrice}
                {realizedReturn ? ` (${realizedReturn})` : null}
                <MarketChartMovementIcon direction={priceMovement} />
              </span>
            ) : null}
          </span>
        ) : null}
        {evaluationWindow ? (
          <span>{evaluationWindow}</span>
        ) : null}
      </div>
      {outcomeSummary ? (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {outcomeSummary}
        </p>
      ) : null}
    </section>
  )
}



function MarketChartAnnotationControls({
  annotationLayerEnabled,
  freshnessLabel,
  groups,
  isLoading,
  liveStatusLabel,
  liveStatusTone,
}: {
  annotationLayerEnabled: boolean
  freshnessLabel: string | null
  groups: MarketChartAnnotationGroup[]
  isLoading: boolean
  liveStatusLabel: string | null
  liveStatusTone: "error" | "live" | "pending" | "stale"
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
  const eventColorClassNames = getMarketChartAnnotationColorClassNames(
    getAnnotationGroupsSummaryDirection(groups)
  )

  return (
    <div className="border-t bg-muted/10 p-3">
      <div className="flex min-h-4 flex-col gap-2 text-xs font-medium text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        {label ? (
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "size-2 rounded-full",
                hasEvents
                  ? eventColorClassNames.dot
                  : "bg-muted-foreground/40"
              )}
            />
            {label}
          </div>
        ) : (
          <span aria-hidden="true" />
        )}
        {freshnessLabel || liveStatusLabel ? (
          <div className="flex flex-wrap items-center gap-3 sm:justify-end sm:text-right">
            {liveStatusLabel ? (
              <span className="flex items-center gap-2">
                <span
                  className={cn(
                    "size-2 rounded-full",
                    liveStatusTone === "live"
                      ? "bg-primary"
                      : liveStatusTone === "error"
                        ? "bg-destructive"
                        : liveStatusTone === "stale"
                          ? "bg-muted-foreground"
                          : "bg-muted-foreground/40"
                  )}
                />
                {liveStatusLabel}
              </span>
            ) : null}
            {freshnessLabel ? (
              <AppTimeMetadata icon={RefreshCw}>
                {freshnessLabel}
              </AppTimeMetadata>
            ) : null}
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
  const [data, setData] = useState<MarketChartDisplayData | null>(null)
  const [loadedData, setLoadedData] =
    useState<MarketChartDisplayData | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [liveState, setLiveState] = useState<MarketChartLiveRuntimeState>(
    DEFAULT_MARKET_CHART_LIVE_STATE
  )
  const [lastAssetId, setLastAssetId] = useState<string | null>(null)
  const [dataVersion, setDataVersion] = useState(0)
  const [annotationLayerEnabled, setAnnotationLayerEnabled] = useState(true)
  const annotationLayerEnabledRef = useRef(annotationLayerEnabled)
  const [selectedAnnotationGroupId, setSelectedAnnotationGroupId] = useState<
    string | null
  >(null)
  const [quickDetailEntity, setQuickDetailEntity] =
    useState<LocalQuickDetailEntity | null>(null)
  const [isPending, startTransition] = useTransition()
  const hasWatchlistAssets = watchlistAssets.length > 0
  const selectedAsset = findWatchlistAsset(watchlistAssets, selection.assetId)
  const selectedAssetId = selectedAsset?.assetId ?? null
  const isBusy = phase === "loading" || isPending
  const timeframeLabels = getMarketChartTimeframeLabels(dictionary)
  const freshnessLabel = getFreshnessLabel(data, phase, liveState, localization)
  const chartData = loadedData ?? data
  const liveCandleItem = deriveLiveCandleItemFromQuote({
    current: chartData?.candles,
    quote: liveState.quote,
    timeframe: selection.timeframe,
  })
  const showVolumePane = hasUsableVolumeData(
    chartData?.candles,
    liveCandleItem
  )
  const liveStatusLabel = getLiveStatusLabel(liveState, localization)
  const liveStatusTone = getLiveStatusTone(liveState)
  const annotationGroups = useMemo(() => {
    if (!annotationLayerEnabled || !chartData) {
      return []
    }

    return createMarketChartAnnotationGroups(
      chartData.annotations,
      chartData.candles
    )
  }, [annotationLayerEnabled, chartData])
  const warmAnnotationGroups = useMemo(() => {
    if (!annotationLayerEnabled || !chartData) {
      return []
    }

    return createMarketChartWarmAnnotationGroups(
      chartData.annotations,
      chartData.candles
    )
  }, [annotationLayerEnabled, chartData])
  const selectedAnnotationGroup =
    [...annotationGroups, ...warmAnnotationGroups].find(
      (group) => group.id === selectedAnnotationGroupId
    ) ??
    null

  useEffect(() => {
    annotationLayerEnabledRef.current = annotationLayerEnabled
  }, [annotationLayerEnabled])

  const loadAnnotations = useCallback(async function loadAnnotations(
    request: Pick<MarketChartCandleRequest, "assetId" | "from" | "to">
  ) {
    const result = await getMarketChartAnnotations({
      assetId: request.assetId,
      from: request.from,
      to: request.to,
    })

    if (!result.success) {
      toast.error(result.error)
      return []
    }

    return result.data
  }, [])

  const loadCandles = useCallback(
    async function loadCandles(
      asset: WorkspaceWatchlistAssetListItemResponse,
      timeframe: MarketChartTimeframe,
      loadAnnotationData: boolean
    ) {
      const request = createLatestCandleRequest(asset, timeframe)

      setPhase("loading")
      setLoadError(null)
      setLoadedData(null)
      setLiveState(DEFAULT_MARKET_CHART_LIVE_STATE)
      setLastAssetId(String(asset.assetId))
      setSelectedAnnotationGroupId(null)

      const result = await getMarketChartCandles(request)

      if (!result.success) {
        setData(null)
        setLoadedData(null)
        setPhase("error")
        setLoadError(result.error)
        return
      }

      const annotations = loadAnnotationData ? await loadAnnotations(request) : []
      const nextData = createMarketChartDisplayData(result.data, annotations)

      setData(nextData)
      setLoadedData(nextData)
      setLiveState({
        ...DEFAULT_MARKET_CHART_LIVE_STATE,
        transportState: "CONNECTING",
      })
      setDataVersion((v) => v + 1)
      setPhase("success")
    },
    [loadAnnotations]
  )

  useEffect(() => {
    if (phase !== "success" || selectedAssetId === null) {
      return
    }

    let active = true

    const stream = openMarketChartLiveStream({
      assetId: selectedAssetId,
      timeframe: selection.timeframe,
      onCandle() {
        if (!active) {
          return
        }

        setLiveState((current) => ({
          ...current,
          error: null,
        }))
      },
      onErrorEvent(value) {
        if (!active) {
          return
        }

        setLiveState((current) => ({
          ...current,
          error: value.message,
          transportState: "ERROR",
        }))
      },
      onInvalidEvent() {
        if (!active) {
          return
        }

        setLiveState((current) => ({
          ...current,
          error: dictionary.marketCharts.live.invalidPayload,
          transportState: "ERROR",
        }))
      },
      onOpen() {
        if (!active) {
          return
        }

        setLiveState((current) => ({
          ...current,
          error: null,
          transportState: "CONNECTED",
        }))
      },
      onPrice(value) {
        if (!active) {
          return
        }

        setLiveState((current) => ({
          ...current,
          error: null,
          quote: value,
        }))
      },
      onSnapshot(value) {
        if (!active) {
          return
        }

        setLiveState((current) => ({
          ...current,
          error: null,
          quote: value.quote ?? current.quote,
          status: value.status,
          transportState: value.status.state,
        }))
      },
      onStatus(value) {
        if (!active) {
          return
        }

        setLiveState((current) => ({
          ...current,
          error: value.state === "ERROR" ? value.message ?? current.error : null,
          status: value,
          transportState: value.state,
        }))
      },
      onTransportError() {
        if (!active) {
          return
        }

        setLiveState((current) => ({
          ...current,
          transportState:
            current.transportState === "CONNECTING"
              ? "CONNECTING"
              : "RECONNECTING",
        }))
      },
    })

    return () => {
      active = false
      stream.close()
    }
  }, [
    dictionary.marketCharts.live.invalidPayload,
    phase,
    selectedAssetId,
    selection.timeframe,
  ])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (watchlistError) {
        setData(null)
        setLoadedData(null)
        setErrors({ form: watchlistError })
        setLoadError(watchlistError)
        setLiveState(DEFAULT_MARKET_CHART_LIVE_STATE)
        setPhase("idle")
        setLastAssetId(null)
        setSelectedAnnotationGroupId(null)
        return
      }

      if (!hasWatchlistAssets) {
        setSelection(createDefaultSelection(watchlistAssets))
        setData(null)
        setLoadedData(null)
        setErrors({})
        setLoadError(null)
        setLiveState(DEFAULT_MARKET_CHART_LIVE_STATE)
        setPhase("idle")
        setLastAssetId(null)
        setSelectedAnnotationGroupId(null)
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
        setLiveState(DEFAULT_MARKET_CHART_LIVE_STATE)
        setPhase("error")
        setLastAssetId(null)
        setSelectedAnnotationGroupId(null)
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
        setLiveState(DEFAULT_MARKET_CHART_LIVE_STATE)
        setPhase("error")
        setLastAssetId(null)
        setSelectedAnnotationGroupId(null)
        return
      }

      setErrors({})
      void loadCandles(asset, timeframe, annotationLayerEnabledRef.current)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [
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
      setLiveState(DEFAULT_MARKET_CHART_LIVE_STATE)
      setPhase("idle")
      setSelectedAnnotationGroupId(null)
      return
    }

    setPhase("loading")
    setLoadedData(null)
    setLiveState(DEFAULT_MARKET_CHART_LIVE_STATE)
    setSelectedAnnotationGroupId(null)
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
    setSelectedAnnotationGroupId(null)

    if (checked && chartData && selectedAsset) {
      void loadAnnotations({
        assetId: selectedAsset.assetId,
        from: chartData.from,
        to: chartData.to,
      }).then((annotations) => {
        setLoadedData((current) => {
          const baseData = current ?? data

          return baseData ? { ...baseData, annotations } : current
        })
      })
    }
  }

  function handleAnnotationSelect(groupId: string) {
    setSelectedAnnotationGroupId(groupId)
  }

  function handleAnnotationClose() {
    setSelectedAnnotationGroupId(null)
  }

  function handleAnnotationEventOpen(eventId: number) {
    setSelectedAnnotationGroupId(null)
    setQuickDetailEntity({ id: eventId, kind: "event" })
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

  async function handleLoadOlderCandles(
    request: MarketChartCandleRequest
  ): Promise<ActionResult<MarketChartLoadedData>> {
    const result = await getMarketChartCandles(request)

    if (!result.success) {
      return result
    }

    const annotations = annotationLayerEnabledRef.current
      ? await loadAnnotations(request)
      : []

    return {
      success: true,
      data: {
        annotations,
        candles: result.data.candles,
        from: result.data.from,
      },
    }
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
        warmAnnotationGroups={warmAnnotationGroups}
        dataVersion={dataVersion}
        data={chartData}
        error={loadError}
        errors={errors}
        freshnessLabel={freshnessLabel}
        isBusy={isBusy}
        liveCandle={liveCandleItem}
        liveStatusLabel={liveStatusLabel}
        liveStatusTone={liveStatusTone}
        phase={phase}
        selection={selection}
        selectedAsset={selectedAsset}
        selectedAnnotationGroup={selectedAnnotationGroup}
        showVolumePane={showVolumePane}
        timeframeLabels={timeframeLabels}
        watchlistAssets={watchlistAssets}
        watchlistError={watchlistError}
        hasWatchlistAssets={hasWatchlistAssets}
        onAnnotationClose={handleAnnotationClose}
        onAnnotationEventOpen={handleAnnotationEventOpen}
        onAnnotationLayerChange={handleAnnotationLayerChange}
        onAnnotationSelect={handleAnnotationSelect}
        onAssetChange={handleAssetChange}
        onLoadedDataChange={handleLoadedDataChange}
        onLoadOlderCandles={handleLoadOlderCandles}
        onRetry={handleRefresh}
        onTimeframeChange={handleTimeframeChange}
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
