"use client"

import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import {
  ChartCandlestick,
  DatabaseZap,
  RefreshCw,
  TriangleAlert,
  X,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { getMarketChartCandles } from "@/app/api/market-charts/action"
import {
  DEFAULT_MARKET_CHART_TIMEFRAME,
  MARKET_CHART_TIMEFRAME_LABELS,
  MARKET_CHART_TIMEFRAMES,
  type MarketChartAnnotationResponse,
  MarketChartCandleRequest,
  MarketChartCandleResponse,
  MarketChartTimeframe,
  isMarketChartTimeframe,
} from "@/app/lib/market-charts/definitions"
import { WorkspaceWatchlistAssetListItemResponse } from "@/app/lib/watchlists/definitions"
import {
  AppListToolbar,
  AppListToolbarLeading,
  AppListToolbarTrailing,
} from "@/components/app-list-toolbar"
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
  selectedAsset: WorkspaceWatchlistAssetListItemResponse | null
) {
  return data?.asset.symbol || selectedAsset?.assetSymbol || data?.symbol || "Chưa chọn"
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return "Chưa có"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Chưa có"
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function formatChartContextTime(value?: string | null) {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  const parts = new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(date)
  const getPart = (type: Intl.DateTimeFormatPartTypes) => {
    return parts.find((part) => part.type === type)?.value
  }
  const day = getPart("day")
  const hour = getPart("hour")
  const minute = getPart("minute")
  const month = getPart("month")
  const year = getPart("year")

  if (!day || !hour || !minute || !month || !year) {
    return null
  }

  return `${hour === "24" ? "00" : hour}:${minute} ${day}/${month}/${year}`
}

function getDirectionLabel(direction?: string | null) {
  if (direction === "BULLISH") {
    return "Tích cực"
  }

  if (direction === "BEARISH") {
    return "Tiêu cực"
  }

  if (direction === "MIXED") {
    return "Trái chiều"
  }

  return "Trung tính"
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

function formatConfidence(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null
  }

  const percent = value <= 1 ? value * 100 : value

  return `${Math.round(percent)}%`
}

function formatAnnotationTime(group: MarketChartAnnotationGroup) {
  return formatDateTime(group.annotations[0]?.time)
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
  phase: WorkbenchPhase
) {
  if (phase !== "success" || !data?.to) {
    return null
  }

  const updatedAt = formatChartContextTime(data.to)

  if (!updatedAt) {
    return null
  }

  return `Cập nhật ${updatedAt}`
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
              <EmptyTitle>Không thể tải watchlist workspace</EmptyTitle>
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
              <EmptyTitle>Chưa có tài sản trong watchlist</EmptyTitle>
              <EmptyDescription>
                Hãy thêm tài sản vào watchlist trước khi xem biểu đồ giá.
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
              <EmptyTitle>Chọn tài sản để xem biểu đồ</EmptyTitle>
              <EmptyDescription>
                Chọn tài sản và khung thời gian để tải dữ liệu mới nhất.
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
              <EmptyTitle>Không thể tải dữ liệu biểu đồ</EmptyTitle>
              <EmptyDescription>
                {error ||
                  "Chưa thể tải dữ liệu cho tài sản đã chọn. Hãy thử lại sau."}
              </EmptyDescription>
            </EmptyHeader>
            {selectedAsset ? (
              <Button type="button" variant="outline" onClick={onRetry}>
                <RefreshCw data-icon="inline-start" />
                Tải lại dữ liệu mới nhất
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
              <EmptyTitle>Không có dữ liệu nến cho tài sản đã chọn</EmptyTitle>
              <EmptyDescription>
                Chưa có nến cho {getDisplayAssetSymbol(data, selectedAsset)} trong
                khoảng {formatDateTime(data.from)} đến {formatDateTime(data.to)}.
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
            symbol={getDisplayAssetSymbol(data, selectedAsset)}
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
  const firstAnnotation = group.annotations[0]
  const confidence = formatConfidence(
    firstAnnotation?.confidence ?? firstAnnotation?.reaction?.confidence
  )

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={getDirectionBadgeVariant(group.direction)}>
          {getDirectionLabel(group.direction)}
        </Badge>
        {confidence ? <Badge variant="outline">Tin cậy {confidence}</Badge> : null}
        <Badge variant="outline">{formatAnnotationTime(group)}</Badge>
        {group.annotations.length > 1 ? (
          <Badge variant="secondary">{group.annotations.length} sự kiện</Badge>
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
  return (
    <div className="max-h-[min(28rem,calc(100vh-8rem))] overflow-y-auto rounded-2xl border bg-popover p-3 text-popover-foreground shadow-xl">
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="relative flex size-3 rounded-full bg-destructive">
            <span className="market-chart-annotation-popup-pulse absolute inset-0 rounded-full bg-destructive/30" />
          </span>
          <span className="text-sm font-semibold">Sự kiện</span>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onClose}
          aria-label="Đóng chi tiết sự kiện"
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
  const label = annotationLayerEnabled
    ? isLoading
      ? "Đang tải sự kiện"
      : groups.length > 0
        ? `${groups.length} mốc sự kiện`
        : "Chưa có sự kiện trong khoảng hiện tại."
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
          <div className="sm:text-right">{freshnessLabel}</div>
        ) : null}
      </div>
    </div>
  )
}

export function MarketChartWorkbench({
  watchlistAssets,
  watchlistError,
}: MarketChartWorkbenchProps) {
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
  const freshnessLabel = getFreshnessLabel(data, phase)
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
          timeframe: "Khung thời gian trên URL không được hỗ trợ.",
        })
        setLoadError("Tham số khung thời gian trên URL chưa hợp lệ.")
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
          assetId: "Tài sản trên URL không nằm trong watchlist của workspace.",
        })
        setLoadError("Tài sản đã chọn không còn nằm trong watchlist workspace.")
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
        timeframe: "Khung thời gian không được hỗ trợ.",
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
        assetId: "Hãy chọn một tài sản trong watchlist trước khi tải lại.",
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
                Tài sản watchlist
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
                  <SelectValue placeholder="Chọn tài sản" />
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
                Khung thời gian
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
                        {MARKET_CHART_TIMEFRAME_LABELS[timeframe]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FieldError>{errors.timeframe}</FieldError>
            </Field>

            <Field className="w-full gap-1 sm:w-auto">
              <div className="flex h-9 w-full items-center justify-between gap-3 rounded-lg border border-input bg-transparent px-2.5 text-sm shadow-xs sm:w-auto dark:bg-input/30">
                <FieldLabel
                  htmlFor="market-chart-annotations"
                  className="text-sm"
                >
                  Sự kiện
                </FieldLabel>
                <Switch
                  id="market-chart-annotations"
                  checked={annotationLayerEnabled}
                  onCheckedChange={handleAnnotationLayerChange}
                  disabled={isBusy || !!watchlistError || !selectedAsset}
                  aria-label="Hiển thị sự kiện trên biểu đồ"
                />
              </div>
            </Field>

            <Field className="w-full gap-1 sm:w-auto">
              <FieldLabel className="sr-only">Tải lại biểu đồ</FieldLabel>
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
                {isBusy ? "Đang tải..." : "Tải lại"}
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
          ? "Đang tải dữ liệu biểu đồ giá."
          : phase === "success"
            ? "Đã tải xong dữ liệu biểu đồ giá."
            : phase === "error"
              ? loadError || "Không thể tải dữ liệu biểu đồ giá."
              : ""}
      </div>
    </div>
  )
}
