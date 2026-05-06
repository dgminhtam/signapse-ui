"use client"

import { useCallback, useEffect, useMemo, useState, useTransition } from "react"
import {
  ChartCandlestick,
  DatabaseZap,
  ExternalLink,
  RefreshCw,
  TriangleAlert,
  X,
} from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { getMarketChartCandles } from "@/app/api/market-charts/action"
import {
  DEFAULT_MARKET_CHART_TIMEFRAME,
  MARKET_CHART_TIMEFRAME_LABELS,
  MARKET_CHART_TIMEFRAMES,
  MarketChartCandleRequest,
  MarketChartCandleResponse,
  MarketChartTimeframe,
  isMarketChartTimeframe,
} from "@/app/lib/market-charts/definitions"
import { WorkspaceWatchlistAssetListItemResponse } from "@/app/lib/watchlists/definitions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
  FieldGroup,
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
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

import {
  createMarketChartAnnotationGroups,
  type MarketChartAnnotationGroup,
  type MarketChartAnnotationMarkerPoint,
} from "./market-chart-annotations"
import { MarketChartCanvas } from "./market-chart-canvas"

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

const NUMBER_FORMATTER = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 6,
})

const COMPACT_NUMBER_FORMATTER = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 2,
  notation: "compact",
})

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

function getDisplayAssetName(
  data: MarketChartCandleResponse | null,
  selectedAsset: WorkspaceWatchlistAssetListItemResponse | null
) {
  return data?.asset.name || selectedAsset?.assetName
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

function formatNumber(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "Chưa có"
  }

  return NUMBER_FORMATTER.format(value)
}

function getChartSummary(response: MarketChartCandleResponse | null) {
  const candles = response?.candles ?? []
  const first = candles[0]
  const last = candles.at(-1)
  const high = candles.length
    ? Math.max(...candles.map((candle) => candle.high))
    : null
  const low = candles.length
    ? Math.min(...candles.map((candle) => candle.low))
    : null
  const totalVolume = candles.reduce((total, candle) => {
    return total + (typeof candle.volume === "number" ? candle.volume : 0)
  }, 0)
  const change =
    first && last && first.open !== 0
      ? ((last.close - first.open) / first.open) * 100
      : null

  return {
    change,
    candleCount: candles.length,
    first,
    high,
    last,
    low,
    totalVolume: totalVolume > 0 ? totalVolume : null,
  }
}

function SummaryMetric({
  label,
  value,
  description,
}: {
  label: string
  value: string
  description?: string
}) {
  return (
    <div className="rounded-xl border bg-muted/20 p-3">
      <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </div>
      <div className="mt-1 truncate text-lg font-semibold text-foreground">
        {value}
      </div>
      {description ? (
        <div className="mt-1 text-xs text-muted-foreground">{description}</div>
      ) : null}
    </div>
  )
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

function getFreshnessLabel(
  data: MarketChartCandleResponse | null,
  phase: WorkbenchPhase
) {
  if (phase === "loading") {
    return "Đang tải dữ liệu mới nhất"
  }

  if (data?.to) {
    return `Cập nhật ${formatDateTime(data.to)}`
  }

  return "7 ngày gần nhất"
}

function getAnnotationPopupStyle(point: MarketChartAnnotationMarkerPoint | null) {
  if (!point) {
    return {
      right: "1rem",
      top: "1rem",
    }
  }

  return {
    left: `clamp(0.75rem, ${Math.round(point.x + 18)}px, calc(100% - 23rem))`,
    top: `clamp(0.75rem, ${Math.round(point.y - 24)}px, calc(100% - 22rem))`,
  }
}

function ChartSurface({
  annotationLayerEnabled,
  annotationGroups,
  data,
  error,
  phase,
  selectedAsset,
  selectedAnnotationGroup,
  selectedAnnotationPoint,
  watchlistError,
  hasWatchlistAssets,
  onAnnotationClose,
  onAnnotationSelect,
  onRetry,
}: {
  annotationLayerEnabled: boolean
  annotationGroups: MarketChartAnnotationGroup[]
  data: MarketChartCandleResponse | null
  error: string | null
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
  onRetry: () => void
}) {
  const hasCandles = (data?.candles.length ?? 0) > 0

  return (
    <section className="overflow-hidden rounded-[28px] border bg-card shadow-sm">
      <div
        className="relative min-h-[520px] bg-card p-2"
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
          <div className="flex min-h-[520px] flex-col gap-4 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Skeleton className="h-7 w-40 rounded-full" />
              <Skeleton className="h-7 w-64 rounded-full" />
            </div>
            <Skeleton className="h-[440px] w-full rounded-2xl" />
          </div>
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
            candles={data.candles}
            timeframe={data.timeframe}
            symbol={getDisplayAssetSymbol(data, selectedAsset)}
            annotationGroups={annotationGroups}
            selectedAnnotationGroupId={selectedAnnotationGroup?.id}
            onAnnotationSelect={onAnnotationSelect}
          />
        ) : null}

        {selectedAnnotationGroup ? (
          <div
            className="absolute z-20 hidden w-[min(22rem,calc(100%-1.5rem))] sm:block"
            style={getAnnotationPopupStyle(selectedAnnotationPoint)}
            onClick={(event) => event.stopPropagation()}
          >
            <MarketChartAnnotationPopup
              group={selectedAnnotationGroup}
              onClose={onAnnotationClose}
            />
          </div>
        ) : null}
      </div>

      {annotationLayerEnabled ? (
        <MarketChartAnnotationControls
          groups={annotationGroups}
          isLoading={phase === "loading"}
          selectedGroup={selectedAnnotationGroup}
          onSelectGroup={onAnnotationSelect}
        />
      ) : null}

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

function MarketChartSummaryPanel({
  data,
  selectedAsset,
}: {
  data: MarketChartCandleResponse | null
  selectedAsset: WorkspaceWatchlistAssetListItemResponse | null
}) {
  const summary = getChartSummary(data)
  const changeLabel =
    typeof summary.change === "number"
      ? `${summary.change >= 0 ? "+" : ""}${summary.change.toFixed(2)}%`
      : "Chưa có"
  const changeVariant =
    typeof summary.change !== "number"
      ? "outline"
      : summary.change >= 0
        ? "default"
        : "destructive"

  return (
    <Card>
      <CardHeader className="gap-3">
        <CardTitle>{getDisplayAssetSymbol(data, selectedAsset)}</CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={changeVariant}>{changeLabel}</Badge>
          <Badge variant="outline">{summary.candleCount} nến</Badge>
          {data?.provider ? <Badge variant="outline">{data.provider}</Badge> : null}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
          <SummaryMetric
            label="Tài sản"
            value={getDisplayAssetSymbol(data, selectedAsset)}
            description={getDisplayAssetName(data, selectedAsset)}
          />
          <SummaryMetric
            label="Giá đóng gần nhất"
            value={formatNumber(summary.last?.close)}
            description={summary.last ? formatDateTime(summary.last.time) : undefined}
          />
          <SummaryMetric
            label="Biên cao / thấp"
            value={`${formatNumber(summary.high)} / ${formatNumber(summary.low)}`}
          />
          <SummaryMetric
            label="Tổng volume"
            value={
              typeof summary.totalVolume === "number"
                ? COMPACT_NUMBER_FORMATTER.format(summary.totalVolume)
                : "Chưa có"
            }
          />
          <SummaryMetric
            label="Khoảng dữ liệu"
            value={
              data
                ? `${formatDateTime(data.from)} - ${formatDateTime(data.to)}`
                : "7 ngày gần nhất"
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}

function MarketChartAnnotationDetail({
  group,
}: {
  group: MarketChartAnnotationGroup
}) {
  return (
    <div className="rounded-xl border bg-background p-3">
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Badge variant={getDirectionBadgeVariant(group.direction)}>
          {getDirectionLabel(group.direction)}
        </Badge>
        <Badge variant="outline">{formatAnnotationTime(group)}</Badge>
        {group.annotations.length > 1 ? (
          <Badge variant="secondary">{group.annotations.length} sự kiện</Badge>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        {group.annotations.map((annotation) => {
          const confidence = formatConfidence(
            annotation.confidence ?? annotation.reaction?.confidence
          )
          const eventDetail = annotation.links?.eventDetail
          const opensInNewTab = eventDetail?.startsWith("http")

          return (
            <article key={annotation.id} className="flex flex-col gap-2">
              <div>
                <h3 className="line-clamp-2 text-sm font-semibold text-foreground">
                  {annotation.title}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {annotation.severity ? (
                    <Badge variant="outline">{annotation.severity}</Badge>
                  ) : null}
                  {confidence ? (
                    <Badge variant="outline">Tin cậy {confidence}</Badge>
                  ) : null}
                </div>
              </div>

              {annotation.summary ? (
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {annotation.summary}
                </p>
              ) : null}

              {annotation.reaction?.reasoning ? (
                <p className="line-clamp-3 rounded-lg bg-muted/40 p-2 text-xs text-muted-foreground">
                  {annotation.reaction.reasoning}
                </p>
              ) : null}

              {annotation.evidence.length ? (
                <div className="flex flex-col gap-2">
                  {annotation.evidence.slice(0, 3).map((evidence, index) => (
                    <div
                      key={`${annotation.id}-evidence-${index}`}
                      className="rounded-lg border bg-muted/20 p-2"
                    >
                      <div className="line-clamp-2 text-xs font-medium text-foreground">
                        {evidence.title || evidence.publisher || "Bằng chứng"}
                      </div>
                      <div className="mt-1 text-[11px] text-muted-foreground">
                        {[
                          evidence.publisher,
                          evidence.publishedAt ? formatDateTime(evidence.publishedAt) : null,
                        ]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {eventDetail ? (
                <Button asChild variant="outline" size="sm" className="w-fit">
                  <a
                    href={eventDetail}
                    target={opensInNewTab ? "_blank" : undefined}
                    rel={opensInNewTab ? "noreferrer" : undefined}
                  >
                    Xem sự kiện
                    <ExternalLink data-icon="inline-end" />
                  </a>
                </Button>
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
    <div className="rounded-2xl border bg-popover p-3 text-popover-foreground shadow-xl">
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
      <MarketChartAnnotationDetail group={group} />
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
  groups,
  isLoading,
  selectedGroup,
  onSelectGroup,
}: {
  groups: MarketChartAnnotationGroup[]
  isLoading: boolean
  selectedGroup: MarketChartAnnotationGroup | null
  onSelectGroup: (
    groupId: string,
    point?: MarketChartAnnotationMarkerPoint | null
  ) => void
}) {
  return (
    <div className="border-t bg-muted/10 p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span className="size-2 rounded-full bg-destructive" />
          {isLoading ? "Đang tải sự kiện" : `${groups.length} mốc sự kiện`}
        </div>
        {isLoading ? (
          <Skeleton className="h-8 w-full rounded-xl sm:w-64" />
        ) : groups.length ? (
          <div className="flex min-w-0 flex-1 gap-2 overflow-x-auto pb-1 sm:justify-end sm:pb-0">
            {groups.map((group) => {
              const selected = selectedGroup?.id === group.id

              return (
                <button
                  key={group.id}
                  type="button"
                  aria-pressed={selected}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs transition-colors outline-none hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                    selected && "border-primary bg-primary/5"
                  )}
                  onClick={() => onSelectGroup(group.id, null)}
                >
                  <span className="relative flex size-2 rounded-full bg-destructive" />
                  <span>{formatAnnotationTime(group)}</span>
                  {group.annotations.length > 1 ? (
                    <Badge variant="secondary">{group.annotations.length}</Badge>
                  ) : null}
                </button>
              )
            })}
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">
            Chưa có sự kiện trong khoảng hiện tại.
          </div>
        )}
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
  const [loadError, setLoadError] = useState<string | null>(null)
  const [lastAssetId, setLastAssetId] = useState<string | null>(null)
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
  const annotationGroups = useMemo(() => {
    if (!annotationLayerEnabled || !data) {
      return []
    }

    return createMarketChartAnnotationGroups(data.annotations, data.candles)
  }, [annotationLayerEnabled, data])
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
    setLastAssetId(String(asset.assetId))
    setSelectedAnnotationGroupId(null)
    setSelectedAnnotationPoint(null)

    const result = await getMarketChartCandles(request)

    if (!result.success) {
      setData(null)
      setPhase("error")
      setLoadError(result.error)
      return
    }

    setData(result.data)
    setPhase("success")
  }, [annotationLayerEnabled])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (watchlistError) {
        setData(null)
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
      setPhase("idle")
      setSelectedAnnotationGroupId(null)
      setSelectedAnnotationPoint(null)
      return
    }

    setPhase("loading")
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
    <div className="flex flex-col gap-6" aria-busy={isBusy}>
      <section className="rounded-2xl border bg-muted/15 p-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <FieldGroup className="grid flex-1 gap-3 lg:grid-cols-[minmax(260px,1fr)_180px_160px_auto] lg:items-start">
              <Field data-invalid={!!errors.assetId}>
                <FieldLabel htmlFor="market-chart-asset">
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

              <Field data-invalid={!!errors.timeframe}>
                <FieldLabel htmlFor="market-chart-timeframe">Khung</FieldLabel>
                <Select
                  value={selection.timeframe}
                  onValueChange={handleTimeframeChange}
                  disabled={isBusy || !!watchlistError || !hasWatchlistAssets}
                >
                  <SelectTrigger
                    id="market-chart-timeframe"
                    aria-invalid={errors.timeframe ? true : undefined}
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

              <Field className="lg:pt-6">
                <div className="flex items-center justify-between gap-3 rounded-lg border bg-background px-3 py-2">
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

              <Field className="lg:pt-6">
                <FieldLabel className="sr-only">Tải lại biểu đồ</FieldLabel>
                <Button
                  type="button"
                  disabled={isBusy || !!watchlistError || !selectedAsset}
                  className="w-full"
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
            </FieldGroup>

            <div className="text-xs text-muted-foreground lg:pb-2 lg:text-right">
              {getFreshnessLabel(data, phase)}
            </div>
          </div>

          {errors.form ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
              {errors.form}
            </div>
          ) : null}
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <ChartSurface
          annotationLayerEnabled={annotationLayerEnabled}
          annotationGroups={annotationGroups}
          data={data}
          error={loadError}
          phase={phase}
          selectedAsset={selectedAsset}
          selectedAnnotationGroup={selectedAnnotationGroup}
          selectedAnnotationPoint={selectedAnnotationPoint}
          watchlistError={watchlistError}
          hasWatchlistAssets={hasWatchlistAssets}
          onAnnotationClose={handleAnnotationClose}
          onAnnotationSelect={handleAnnotationSelect}
          onRetry={handleRefresh}
        />
        <aside className="flex min-w-0 flex-col gap-5">
          <MarketChartSummaryPanel data={data} selectedAsset={selectedAsset} />
        </aside>
      </div>

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
