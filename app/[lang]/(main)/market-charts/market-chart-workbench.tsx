"use client"

import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import {
  CalendarClock,
  ChartCandlestick,
  DatabaseZap,
  RefreshCw,
  TriangleAlert,
  X,
} from "lucide-react"
import { LocalizedLink as Link } from "@/components/localized-link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

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
import {
  AppListToolbar,
  AppListToolbarLeading,
  AppListToolbarTrailing,
} from "@/components/app-list-toolbar"
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
import {
  Field,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

import {
  createMarketChartAnnotationGroups,
  type MarketChartAnnotationGroup,
  type MarketChartAnnotationMarkerPoint,
} from "./market-chart-annotations"
import {
  MarketChartCanvas,
  type MarketChartLoadedData,
} from "./market-chart-canvas"
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

function formatConfidence(value: number | null | undefined, localization: LocalizationContext) {
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

function getAnnotationEventHref(annotation: MarketChartAnnotationResponse) {
  const eventId = annotation.eventId

  if (typeof eventId === "number" && Number.isInteger(eventId) && eventId > 0) {
    return `/events/${eventId}`
  }

  const eventDetail = annotation.links?.eventDetail?.trim()
  const match = eventDetail?.match(/^\/events\/([1-9]\d*)\/?(?:[?#].*)?$/)

  return match ? `/events/${match[1]}` : null
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

  return localization.formatMessage(localization.dictionary.marketCharts.format.updatedAt, {
    time: updatedAt,
  })
}

function getAnnotationPopupStyle(point: MarketChartAnnotationMarkerPoint | null) {
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

function ChartSurface({
  annotationLayerEnabled,
  annotationGroups,
  chartResetKey,
  data,
  error,
  freshnessLabel,
  phase,
  selectedAsset,
  selectedAnnotationGroup,
  selectedAnnotationPoint,
  watchlistError,
  hasWatchlistAssets,
  onAnnotationClose,
  onAnnotationSelect,
  onLoadedDataChange,
  onRetry,
}: {
  annotationLayerEnabled: boolean
  annotationGroups: MarketChartAnnotationGroup[]
  chartResetKey: string
  data: MarketChartCandleResponse | null
  error: string | null
  freshnessLabel: string | null
  phase: WorkbenchPhase
  selectedAsset: WorkspaceWatchlistAssetListItemResponse | null
  selectedAnnotationGroup: MarketChartAnnotationGroup | null
  selectedAnnotationPoint: MarketChartAnnotationMarkerPoint | null
  watchlistError: string | null
  hasWatchlistAssets: boolean
  onAnnotationClose: () => void
  onAnnotationSelect: (
    groupId: string,
    point?: MarketChartAnnotationMarkerPoint | null
  ) => void
  onLoadedDataChange: (data: MarketChartLoadedData) => void
  onRetry: () => void
}) {
  const localization = useLocalization()
  const { dictionary, formatMessage } = localization
  const hasCandles = (data?.candles.length ?? 0) > 0

  return (
    <section className="relative mt-4 rounded-xl border border-border bg-card">
      <div
        className="relative min-h-[520px] overflow-hidden rounded-t-xl bg-card p-2"
        onClick={selectedAnnotationGroup ? onAnnotationClose : undefined}
      >
        {watchlistError ? (
          <Empty className="min-h-[520px] border-0 bg-transparent">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="bg-destructive/10 text-destructive">
                <TriangleAlert />
              </EmptyMedia>
              <EmptyTitle>{dictionary.marketCharts.empty.watchlistErrorTitle}</EmptyTitle>
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
              <EmptyTitle>{dictionary.marketCharts.empty.noWatchlistAssetsTitle}</EmptyTitle>
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

        {phase === "loading" ? (
          <MarketChartSurfaceSkeleton embedded />
        ) : null}

        {phase === "error" ? (
          <Empty className="min-h-[520px] border-0 bg-transparent">
            <EmptyHeader>
              <EmptyMedia variant="icon" className="bg-destructive/10 text-destructive">
                <TriangleAlert />
              </EmptyMedia>
              <EmptyTitle>{dictionary.marketCharts.empty.loadErrorTitle}</EmptyTitle>
              <EmptyDescription>
                {error ||
                  dictionary.marketCharts.empty.loadErrorDescription}
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

        {phase === "success" && data && hasCandles ? (
          <MarketChartCanvas
            annotations={data.annotations}
            assetId={data.asset.id}
            candles={data.candles}
            includeAnnotations={annotationLayerEnabled}
            resetKey={chartResetKey}
            timeframe={data.timeframe}
            symbol={getDisplayAssetSymbol(data, selectedAsset, dictionary)}
            annotationGroups={annotationGroups}
            selectedAnnotationGroupId={selectedAnnotationGroup?.id}
            onAnnotationSelect={onAnnotationSelect}
            onLoadedDataChange={onLoadedDataChange}
            onLoadOlderCandles={getMarketChartCandles}
          />
        ) : null}

      </div>

      {selectedAnnotationGroup ? (
        <div
          className="absolute z-20 hidden w-[min(22rem,calc(100%-1.5rem))] max-w-[calc(100%-1.5rem)] sm:block"
          style={getAnnotationPopupStyle(selectedAnnotationPoint)}
          onClick={(event) => event.stopPropagation()}
        >
          <MarketChartAnnotationPopup
            group={selectedAnnotationGroup}
            onClose={onAnnotationClose}
          />
        </div>
      ) : null}

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
          />
        </div>
      ) : null}

    </section>
  )
}

function MarketChartAnnotationDetail({
  group,
  onEventNavigate,
}: {
  group: MarketChartAnnotationGroup
  onEventNavigate: () => void
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
            {formatMessage(dictionary.marketCharts.annotations.confidenceBadge, {
              value: confidence,
            })}
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
          const eventHref = getAnnotationEventHref(annotation)

          return (
            <article key={annotation.id} className="flex flex-col gap-1.5">
              <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
                {eventHref ? (
                  <Link
                    href={eventHref}
                    className="rounded-sm underline-offset-4 outline-none transition-colors hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-ring/50"
                    onClick={onEventNavigate}
                  >
                    {annotation.title}
                  </Link>
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
}: {
  group: MarketChartAnnotationGroup
  onClose: () => void
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
      <MarketChartAnnotationDetail group={group} onEventNavigate={onClose} />
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

    return createMarketChartAnnotationGroups(chartData.annotations, chartData.candles)
  }, [annotationLayerEnabled, chartData])
  const selectedAnnotationGroup =
    annotationGroups.find((group) => group.id === selectedAnnotationGroupId) ??
    null

  const loadCandles = useCallback(async function loadCandles(
    asset: WorkspaceWatchlistAssetListItemResponse,
    timeframe: MarketChartTimeframe,
    includeAnnotations = annotationLayerEnabled
  ) {
    const request = createLatestCandleRequest(asset, timeframe, includeAnnotations)

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
  }, [annotationLayerEnabled])

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
    const asset = selectedAsset || findWatchlistAsset(watchlistAssets, lastAssetId || "")

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
      <div className="flex flex-col gap-3">
        <AppListToolbar>
          <AppListToolbarLeading>
            <Field
              className="w-full gap-1 sm:w-80 lg:w-96"
              data-invalid={!!errors.assetId}
            >
              <FieldLabel htmlFor="market-chart-asset" className="sr-only">
                {dictionary.marketCharts.controls.assetLabel}
              </FieldLabel>
              <Select
                value={selection.assetId}
                onValueChange={handleAssetChange}
                disabled={isBusy || !!watchlistError || !hasWatchlistAssets}
              >
                <SelectTrigger
                  id="market-chart-asset"
                  aria-invalid={errors.assetId ? true : undefined}
                  className="w-full"
                >
                  <SelectValue placeholder={dictionary.marketCharts.controls.assetPlaceholder} />
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
          </AppListToolbarLeading>
          <AppListToolbarTrailing>
            <Field
              className="w-full gap-1 sm:w-auto"
              data-invalid={!!errors.timeframe}
            >
              <FieldLabel htmlFor="market-chart-timeframe" className="sr-only">
                {dictionary.marketCharts.controls.timeframeLabel}
              </FieldLabel>
              <Select
                value={selection.timeframe}
                onValueChange={handleTimeframeChange}
                disabled={isBusy || !!watchlistError || !hasWatchlistAssets}
              >
                <SelectTrigger
                  id="market-chart-timeframe"
                  aria-invalid={errors.timeframe ? true : undefined}
                  className="w-full sm:w-[180px]"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {MARKET_CHART_TIMEFRAMES.map((timeframe) => (
                      <SelectItem key={timeframe} value={timeframe}>
                        {timeframeLabels[timeframe]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldError>{errors.timeframe}</FieldError>
            </Field>

            <Field className="w-full gap-1 sm:w-auto">
              <div className="flex h-8 w-full items-center justify-between gap-3 rounded-lg border border-input bg-transparent px-2.5 text-sm shadow-xs sm:w-auto dark:bg-input/30">
                <FieldLabel
                  htmlFor="market-chart-annotations"
                  className="text-sm"
                >
                  {dictionary.marketCharts.controls.annotationsLabel}
                </FieldLabel>
                <Switch
                  id="market-chart-annotations"
                  checked={annotationLayerEnabled}
                  onCheckedChange={handleAnnotationLayerChange}
                  disabled={isBusy || !!watchlistError || !selectedAsset}
                  aria-label={dictionary.marketCharts.controls.annotationsAria}
                />
              </div>
            </Field>

            <Field className="w-full gap-1 sm:w-auto">
              <FieldLabel className="sr-only">
                {dictionary.marketCharts.controls.refreshLabel}
              </FieldLabel>
              <Button
                type="button"
                disabled={isBusy || !!watchlistError || !selectedAsset}
                className="w-full sm:w-auto"
                onClick={handleRefresh}
              >
                {isBusy ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <RefreshCw data-icon="inline-start" />
                )}
                {isBusy
                  ? dictionary.marketCharts.controls.refreshing
                  : dictionary.marketCharts.controls.refresh}
              </Button>
            </Field>

          </AppListToolbarTrailing>
        </AppListToolbar>

        {errors.form ? (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
            {errors.form}
          </div>
        ) : null}
      </div>

      <ChartSurface
        annotationLayerEnabled={annotationLayerEnabled}
        annotationGroups={annotationGroups}
        chartResetKey={chartResetKey}
        data={data}
        error={loadError}
        freshnessLabel={freshnessLabel}
        phase={phase}
        selectedAsset={selectedAsset}
        selectedAnnotationGroup={selectedAnnotationGroup}
        selectedAnnotationPoint={selectedAnnotationPoint}
        watchlistError={watchlistError}
        hasWatchlistAssets={hasWatchlistAssets}
        onAnnotationClose={handleAnnotationClose}
        onAnnotationSelect={handleAnnotationSelect}
        onLoadedDataChange={handleLoadedDataChange}
        onRetry={handleRefresh}
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
