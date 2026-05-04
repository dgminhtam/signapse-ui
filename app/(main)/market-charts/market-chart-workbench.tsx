"use client"

import { FormEvent, useEffect, useMemo, useState, useTransition } from "react"
import {
  Activity,
  ChartCandlestick,
  Clock3,
  DatabaseZap,
  Info,
  Search,
  Server,
  Sparkles,
  TriangleAlert,
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
  marketChartCandleRequestSchema,
} from "@/app/lib/market-charts/definitions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
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
import { cn } from "@/lib/utils"

import { MarketChartCanvas } from "./market-chart-canvas"

type WorkbenchPhase = "idle" | "loading" | "success" | "error"

type MarketChartFormState = {
  symbol: string
  timeframe: MarketChartTimeframe
  from: string
  to: string
}

type FormErrors = Partial<Record<keyof MarketChartFormState, string>> & {
  form?: string
}

const NUMBER_FORMATTER = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 6,
})

const COMPACT_NUMBER_FORMATTER = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 2,
  notation: "compact",
})

function toDateTimeLocalValue(date: Date) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)

  return localDate.toISOString().slice(0, 16)
}

function fromIsoToDateTimeLocal(value: string) {
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return toDateTimeLocalValue(date)
}

function getDefaultFormState(): MarketChartFormState {
  const to = new Date()
  const from = new Date(to)
  from.setDate(to.getDate() - 7)

  return {
    symbol: "",
    timeframe: DEFAULT_MARKET_CHART_TIMEFRAME,
    from: toDateTimeLocalValue(from),
    to: toDateTimeLocalValue(to),
  }
}

function getSingleParam(
  searchParams: URLSearchParams,
  key: string
): string | null {
  const value = searchParams.get(key)
  return value?.trim() || null
}

function createRequestFromSearchParams(
  searchParams: URLSearchParams
): MarketChartCandleRequest | null {
  const symbol = getSingleParam(searchParams, "symbol")
  const timeframe = getSingleParam(searchParams, "timeframe")
  const from = getSingleParam(searchParams, "from")
  const to = getSingleParam(searchParams, "to")

  if (!symbol && !timeframe && !from && !to) {
    return null
  }

  return {
    symbol: symbol || "",
    timeframe: (
      timeframe && isMarketChartTimeframe(timeframe) ? timeframe : timeframe || ""
    ) as MarketChartTimeframe,
    from: from || "",
    to: to || "",
  }
}

function createFormStateFromRequest(
  request: MarketChartCandleRequest
): MarketChartFormState {
  return {
    symbol: request.symbol,
    timeframe: isMarketChartTimeframe(request.timeframe)
      ? request.timeframe
      : DEFAULT_MARKET_CHART_TIMEFRAME,
    from: fromIsoToDateTimeLocal(request.from),
    to: fromIsoToDateTimeLocal(request.to),
  }
}

function createRequestFromForm(
  form: MarketChartFormState
): MarketChartCandleRequest {
  return {
    symbol: form.symbol.trim(),
    timeframe: form.timeframe,
    from: new Date(form.from).toISOString(),
    to: new Date(form.to).toISOString(),
  }
}

function createQueryString(request: MarketChartCandleRequest) {
  const query = new URLSearchParams()

  query.set("symbol", request.symbol)
  query.set("timeframe", request.timeframe)
  query.set("from", request.from)
  query.set("to", request.to)

  return query.toString()
}

function createFormErrors(
  issues: { path: PropertyKey[]; message: string }[]
): FormErrors {
  return issues.reduce<FormErrors>((errors, issue) => {
    const key = issue.path[0]

    if (key === "symbol" || key === "timeframe" || key === "from" || key === "to") {
      errors[key] = issue.message
      return errors
    }

    errors.form = issue.message
    return errors
  }, {})
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
    <div className="rounded-xl border bg-muted/20 p-4">
      <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </div>
      <div className="mt-2 truncate text-lg font-semibold text-foreground">
        {value}
      </div>
      {description ? (
        <div className="mt-1 text-xs text-muted-foreground">{description}</div>
      ) : null}
    </div>
  )
}

function ChartSurface({
  data,
  error,
  phase,
  onRetry,
}: {
  data: MarketChartCandleResponse | null
  error: string | null
  phase: WorkbenchPhase
  onRetry: () => void
}) {
  const hasCandles = (data?.candles.length ?? 0) > 0

  return (
    <section className="overflow-hidden rounded-[28px] border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b bg-muted/20 p-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              {data?.symbol || "Chưa chọn mã"}
            </Badge>
            <Badge variant="secondary">
              {data?.timeframe
                ? MARKET_CHART_TIMEFRAME_LABELS[data.timeframe]
                : "Khung thời gian"}
            </Badge>
            {data?.provider ? <Badge variant="outline">{data.provider}</Badge> : null}
          </div>
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Biểu đồ nến OHLCV
            </h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Dữ liệu lấy từ candle bridge hiện tại của backend. Lớp marker sự kiện sẽ
              được thêm khi contract annotation sẵn sàng.
            </p>
          </div>
        </div>
      </div>

      <div className="relative min-h-[520px] bg-card p-2">
        {phase === "idle" ? (
          <Empty className="min-h-[520px] border-0 bg-transparent">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ChartCandlestick />
              </EmptyMedia>
              <EmptyTitle>Chưa có biểu đồ nào được tải</EmptyTitle>
              <EmptyDescription>
                Nhập provider symbol, chọn khung thời gian và khoảng thời gian rồi bấm
                Tải biểu đồ để kiểm tra dữ liệu nến.
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
                  "Provider chưa trả về dữ liệu hợp lệ. Hãy kiểm tra symbol, thời gian hoặc thử lại."}
              </EmptyDescription>
            </EmptyHeader>
            <Button type="button" variant="outline" onClick={onRetry}>
              <Search data-icon="inline-start" />
              Thử lại
            </Button>
          </Empty>
        ) : null}

        {phase === "success" && data && !hasCandles ? (
          <Empty className="min-h-[520px] border-0 bg-transparent">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <DatabaseZap />
              </EmptyMedia>
              <EmptyTitle>Không có dữ liệu nến trong khoảng đã chọn</EmptyTitle>
              <EmptyDescription>
                Backend trả về thành công nhưng không có candle cho {data.symbol} từ{" "}
                {formatDateTime(data.from)} đến {formatDateTime(data.to)}.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : null}

        {phase === "success" && data && hasCandles ? (
          <MarketChartCanvas candles={data.candles} />
        ) : null}
      </div>

      <div className="border-t bg-muted/15 px-5 py-3 text-xs text-muted-foreground">
        Biểu đồ sử dụng Lightweight Charts của TradingView. Dữ liệu giá đến từ
        provider do backend cấu hình.
      </div>
    </section>
  )
}

function MarketChartSummaryPanel({
  data,
}: {
  data: MarketChartCandleResponse | null
}) {
  const summary = useMemo(() => getChartSummary(data), [data])
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
      <CardHeader>
        <CardTitle>Tóm tắt dữ liệu</CardTitle>
        <CardDescription>
          Snapshot của response candle bridge đang hiển thị.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={changeVariant}>{changeLabel}</Badge>
          <Badge variant="outline">{summary.candleCount} nến</Badge>
          {data?.provider ? <Badge variant="outline">{data.provider}</Badge> : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
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
            value={data ? `${formatDateTime(data.from)} - ${formatDateTime(data.to)}` : "Chưa có"}
          />
        </div>
      </CardContent>
    </Card>
  )
}

function FutureOverlayPanel() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Info className="size-4 text-muted-foreground" />
          <CardTitle>Lớp sự kiện</CardTitle>
        </div>
        <CardDescription>
          Khu vực dành cho marker và giải thích tác động khi backend có annotation.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-xl border border-dashed bg-muted/20 p-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="size-4 text-muted-foreground" />
            Chưa bật event overlay
          </div>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            MVP hiện chỉ hiển thị candle OHLCV. Không có marker giả, popup sự kiện,
            lựa chọn watchlist hoặc khuyến nghị giao dịch trong phase này.
          </p>
        </div>

        <div className="grid gap-3">
          <div className="flex items-start gap-3 text-sm">
            <Activity className="mt-0.5 size-4 text-muted-foreground" />
            <span>Dữ liệu giá mô tả chuyển động thị trường theo thời gian.</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <Server className="mt-0.5 size-4 text-muted-foreground" />
            <span>Annotation sẽ cần contract backend riêng theo asset và event.</span>
          </div>
          <div className="flex items-start gap-3 text-sm">
            <Clock3 className="mt-0.5 size-4 text-muted-foreground" />
            <span>Marker sau này sẽ được neo vào thời điểm event hoặc reaction.</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function MarketChartWorkbench() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [form, setForm] = useState<MarketChartFormState>(() => getDefaultFormState())
  const [errors, setErrors] = useState<FormErrors>({})
  const [phase, setPhase] = useState<WorkbenchPhase>("idle")
  const [data, setData] = useState<MarketChartCandleResponse | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [lastRequest, setLastRequest] = useState<MarketChartCandleRequest | null>(null)
  const [isPending, startTransition] = useTransition()
  const isBusy = phase === "loading" || isPending

  async function loadCandles(request: MarketChartCandleRequest) {
    setPhase("loading")
    setLoadError(null)
    setLastRequest(request)

    const result = await getMarketChartCandles(request)

    if (!result.success) {
      setPhase("error")
      setLoadError(result.error)
      return
    }

    setData(result.data)
    setPhase("success")
  }

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const request = createRequestFromSearchParams(searchParams)

      if (!request) {
        setForm((current) => ({
          ...getDefaultFormState(),
          symbol: current.symbol,
        }))
        setData(null)
        setLoadError(null)
        setErrors({})
        setPhase("idle")
        setLastRequest(null)
        return
      }

      const parsedRequest = marketChartCandleRequestSchema.safeParse(request)
      setForm(createFormStateFromRequest(request))

      if (!parsedRequest.success) {
        setErrors(createFormErrors(parsedRequest.error.issues))
        setData(null)
        setLoadError("Tham số biểu đồ trên URL chưa hợp lệ.")
        setPhase("error")
        setLastRequest(null)
        return
      }

      setErrors({})
      void loadCandles(parsedRequest.data)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [searchParams])

  function updateForm<Key extends keyof MarketChartFormState>(
    key: Key,
    value: MarketChartFormState[Key]
  ) {
    setForm((current) => ({ ...current, [key]: value }))
    setErrors((current) => ({ ...current, [key]: undefined, form: undefined }))
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    let request: MarketChartCandleRequest

    try {
      request = createRequestFromForm(form)
    } catch {
      setErrors({
        from: "Thời điểm bắt đầu không hợp lệ.",
        to: "Thời điểm kết thúc không hợp lệ.",
      })
      return
    }

    const parsedRequest = marketChartCandleRequestSchema.safeParse(request)

    if (!parsedRequest.success) {
      setErrors(createFormErrors(parsedRequest.error.issues))
      return
    }

    setErrors({})
    const nextQuery = createQueryString(parsedRequest.data)

    if (nextQuery === searchParams.toString()) {
      void loadCandles(parsedRequest.data)
      return
    }

    setPhase("loading")
    startTransition(() => {
      router.replace(`${pathname}?${nextQuery}`, { scroll: false })
    })
  }

  function handleRetry() {
    if (lastRequest) {
      void loadCandles(lastRequest)
    }
  }

  return (
    <div className="flex flex-col gap-6" aria-busy={isBusy}>
      <section className="rounded-2xl border bg-muted/15 p-5">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Candle bridge</Badge>
              <Badge variant="outline">OHLCV</Badge>
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                Biểu đồ giá
              </h1>
              <p className="mt-1 max-w-3xl text-sm leading-6 text-muted-foreground">
                Kiểm tra dữ liệu nến từ provider-symbol bridge hiện tại trước khi
                nâng cấp sang biểu đồ theo asset và event marker.
              </p>
            </div>
          </div>

          <FieldGroup className="grid gap-4 lg:grid-cols-[minmax(220px,1fr)_160px_200px_200px_auto] lg:items-start">
            <Field data-invalid={!!errors.symbol}>
              <FieldLabel htmlFor="market-chart-symbol">Provider symbol</FieldLabel>
              <Input
                id="market-chart-symbol"
                value={form.symbol}
                onChange={(event) => updateForm("symbol", event.target.value)}
                placeholder="Ví dụ: AAPL hoặc EUR/USD"
                aria-invalid={errors.symbol ? true : undefined}
                disabled={isBusy}
              />
              <FieldDescription>
                Nhập đúng symbol mà provider candle đang hỗ trợ.
              </FieldDescription>
              <FieldError>{errors.symbol}</FieldError>
            </Field>

            <Field data-invalid={!!errors.timeframe}>
              <FieldLabel htmlFor="market-chart-timeframe">Khung</FieldLabel>
              <Select
                value={form.timeframe}
                onValueChange={(value) => {
                  if (isMarketChartTimeframe(value)) {
                    updateForm("timeframe", value)
                  }
                }}
                disabled={isBusy}
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
              <FieldDescription>Backend hỗ trợ khung cố định.</FieldDescription>
              <FieldError>{errors.timeframe}</FieldError>
            </Field>

            <Field data-invalid={!!errors.from}>
              <FieldLabel htmlFor="market-chart-from">Từ lúc</FieldLabel>
              <Input
                id="market-chart-from"
                type="datetime-local"
                value={form.from}
                onChange={(event) => updateForm("from", event.target.value)}
                aria-invalid={errors.from ? true : undefined}
                disabled={isBusy}
              />
              <FieldDescription>Gửi lên backend dưới dạng ISO UTC.</FieldDescription>
              <FieldError>{errors.from}</FieldError>
            </Field>

            <Field data-invalid={!!errors.to}>
              <FieldLabel htmlFor="market-chart-to">Đến lúc</FieldLabel>
              <Input
                id="market-chart-to"
                type="datetime-local"
                value={form.to}
                onChange={(event) => updateForm("to", event.target.value)}
                aria-invalid={errors.to ? true : undefined}
                disabled={isBusy}
              />
              <FieldDescription>Phải sau thời điểm bắt đầu.</FieldDescription>
              <FieldError>{errors.to}</FieldError>
            </Field>

            <Field className="lg:pt-6">
              <FieldLabel className="sr-only">Tải biểu đồ</FieldLabel>
              <Button type="submit" disabled={isBusy} className="w-full">
                {isBusy ? <Spinner data-icon="inline-start" /> : <Search data-icon="inline-start" />}
                {isBusy ? "Đang tải..." : "Tải biểu đồ"}
              </Button>
              <FieldDescription className="lg:text-right">
                Không tự fetch khi đang nhập.
              </FieldDescription>
            </Field>
          </FieldGroup>

          {errors.form ? (
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
              {errors.form}
            </div>
          ) : null}
        </form>
      </section>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(300px,360px)]">
        <ChartSurface
          data={data}
          error={loadError}
          phase={phase}
          onRetry={handleRetry}
        />
        <aside className="flex min-w-0 flex-col gap-5">
          <MarketChartSummaryPanel data={data} />
          <FutureOverlayPanel />
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
