"use client"

import { format } from "date-fns"
import {
  ChevronRight,
  ExternalLink,
  FileText,
  GitBranch,
  Layers3,
  SearchCheck,
  Sparkles,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react"
import Link from "next/link"
import { type FormEvent, useEffect, useId, useRef, useState, useTransition } from "react"
import { toast } from "sonner"

import { queryMarket } from "@/app/api/query/action"
import { EVENT_READ_PERMISSIONS } from "@/app/lib/events/permissions"
import {
  MARKET_QUERY_DOCUMENT_TYPE_LABELS,
  MARKET_QUERY_EVIDENCE_ROLE_LABELS,
  MarketQueryEvidenceResponse,
  MarketQueryKeyEventResponse,
  MarketQueryResponse,
} from "@/app/lib/market-query/definitions"
import { SOURCE_DOCUMENT_READ_PERMISSIONS } from "@/app/lib/source-documents/permissions"
import { useHasAnyPermission } from "@/components/permission-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
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
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

const EXAMPLE_PROMPTS = [
  "Những sự kiện nào đang hỗ trợ xu hướng tăng của vàng trong 7 ngày gần đây?",
  "Các tín hiệu hiện tại có đang nghiêng về áp lực giảm đối với dầu Brent không?",
  "Trong tuần này, yếu tố nào đang ảnh hưởng mạnh nhất tới tâm lý thị trường tiền điện tử?",
] as const

interface QueryFormState {
  question: string
}

interface SuccessfulQueryRun {
  question: string
  result: MarketQueryResponse
}

interface FailedQueryRun {
  question: string
  error: string
}

type QueryPhase = "idle" | "running" | "success" | "error"

function getScrollBehavior(): ScrollBehavior {
  if (typeof window === "undefined") {
    return "auto"
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
}

function formatTraceabilityHint(
  hasBlockedEvent: boolean,
  hasBlockedSourceDocument: boolean
) {
  if (hasBlockedEvent && hasBlockedSourceDocument) {
    return "Chi tiết sự kiện và tài liệu chưa mở được với quyền hiện tại."
  }

  if (hasBlockedEvent) {
    return "Chi tiết sự kiện chưa mở được với quyền hiện tại."
  }

  if (hasBlockedSourceDocument) {
    return "Chi tiết tài liệu chưa mở được với quyền hiện tại."
  }

  return null
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return "Chưa có"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Chưa có"
  }

  return format(date, "dd/MM/yyyy HH:mm")
}

function formatConfidence(value?: number) {
  if (typeof value !== "number") {
    return "Chưa có"
  }

  return `${Math.round(value * 100)}%`
}

function getConfidenceVariant(
  value?: number
): "default" | "secondary" | "outline" | "destructive" {
  if (typeof value !== "number") {
    return "outline"
  }

  if (value >= 0.75) {
    return "default"
  }

  if (value >= 0.5) {
    return "secondary"
  }

  if (value < 0.3) {
    return "destructive"
  }

  return "outline"
}

function formatEventFallbackMeta(id?: number) {
  return typeof id === "number" ? `Mã sự kiện #${id}` : null
}

function formatSourceDocumentFallbackMeta(id?: number) {
  return typeof id === "number" ? `Mã tài liệu #${id}` : null
}

function getAnnouncement(
  phase: QueryPhase,
  activeQuestion: string,
  latestSuccessfulRun: SuccessfulQueryRun | null,
  failedRun: FailedQueryRun | null
) {
  if (phase === "running" && activeQuestion) {
    return `Đang phân tích câu hỏi: ${activeQuestion}`
  }

  if (phase === "success" && latestSuccessfulRun) {
    return `Đã hoàn tất truy vấn cho câu hỏi: ${latestSuccessfulRun.question}`
  }

  if (phase === "error" && failedRun) {
    return `Truy vấn thất bại cho câu hỏi: ${failedRun.question}. ${failedRun.error}`
  }

  return ""
}

function SectionHeading({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description?: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-muted/30">
        <Icon className="size-4 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {title}
        </h2>
        {description ? (
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  )
}

export function MarketQueryWorkbench() {
  const canReadEvents = useHasAnyPermission(EVENT_READ_PERMISSIONS)
  const canReadSourceDocuments = useHasAnyPermission(SOURCE_DOCUMENT_READ_PERMISSIONS)
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState<QueryFormState>({ question: "" })
  const [questionError, setQuestionError] = useState<string | null>(null)
  const [phase, setPhase] = useState<QueryPhase>("idle")
  const [activeQuestion, setActiveQuestion] = useState("")
  const [latestSuccessfulRun, setLatestSuccessfulRun] = useState<SuccessfulQueryRun | null>(null)
  const [failedRun, setFailedRun] = useState<FailedQueryRun | null>(null)
  const questionId = useId()
  const resultRegionRef = useRef<HTMLDivElement | null>(null)
  const announcement = getAnnouncement(phase, activeQuestion, latestSuccessfulRun, failedRun)
  const hasPreviousSuccess = phase === "error" && latestSuccessfulRun !== null

  useEffect(() => {
    if (phase === "idle" || !resultRegionRef.current) {
      return
    }

    resultRegionRef.current.focus({ preventScroll: true })
    resultRegionRef.current.scrollIntoView({
      behavior: getScrollBehavior(),
      block: "start",
    })
  }, [activeQuestion, phase])

  const handleExampleClick = (prompt: string) => {
    setForm((current) => ({ ...current, question: prompt }))
    setQuestionError(null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const question = form.question.trim()

    if (!question) {
      setQuestionError("Vui lòng nhập câu hỏi cần phân tích.")
      return
    }

    setQuestionError(null)
    setActiveQuestion(question)
    setFailedRun(null)
    setPhase("running")

    startTransition(async () => {
      const actionResult = await queryMarket({
        question,
      })

      if (!actionResult.success) {
        setFailedRun({
          question,
          error: actionResult.error,
        })
        setPhase("error")
        toast.error(actionResult.error)
        return
      }

      setLatestSuccessfulRun({
        question,
        result: actionResult.data,
      })
      setFailedRun(null)
      setPhase("success")
      toast.success("Đã hoàn tất truy vấn thị trường.")
    })
  }

  return (
    <div className="flex flex-col gap-6" aria-busy={phase === "running"}>
      <div className="sr-only" aria-live={phase === "error" ? "assertive" : "polite"}>
        {announcement}
      </div>

      <section className="rounded-[28px] border border-border bg-gradient-to-br from-primary/8 via-background to-secondary/15 p-6 shadow-sm">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Tập trung vào một câu hỏi</Badge>
              <Badge variant="outline">Dùng thời điểm hiện tại từ backend</Badge>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-foreground">
                Nhận briefing thị trường có dẫn vết trên cùng một màn hình.
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                Nhập một câu hỏi cụ thể để xem kết luận, độ tin cậy, giới hạn và bằng chứng liên
                quan.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FieldGroup>
              <Field data-invalid={!!questionError}>
                <FieldLabel htmlFor={questionId}>Câu hỏi phân tích</FieldLabel>
                <Textarea
                  id={questionId}
                  value={form.question}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, question: event.target.value }))
                    if (questionError) {
                      setQuestionError(null)
                    }
                  }}
                  placeholder="Ví dụ: Những sự kiện nào đang hỗ trợ xu hướng tăng của vàng trong 7 ngày gần đây?"
                  className="min-h-[180px] resize-y bg-background/85"
                  aria-invalid={questionError ? true : undefined}
                  disabled={isPending}
                />
                <FieldDescription>
                  Câu hỏi càng cụ thể, hệ thống càng dễ trả về kết luận và bằng chứng bám sát ngữ
                  cảnh.
                </FieldDescription>
                <FieldError>{questionError}</FieldError>
              </Field>

              <Field className="justify-end">
                <FieldLabel className="sr-only">Thực thi truy vấn</FieldLabel>
                <Button type="submit" size="lg" disabled={isPending} className="w-full md:w-auto">
                  {isPending ? <Spinner data-icon="inline-start" /> : <Sparkles data-icon="inline-start" />}
                  {isPending ? "Đang phân tích..." : "Phân tích"}
                </Button>
                <FieldDescription>
                  Phiên bản hiện tại luôn dùng thời điểm backend nhận truy vấn.
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </div>
      </section>

      {phase === "idle" ? (
        <>
          <section className="rounded-[28px] border border-border bg-muted/20 p-6 shadow-sm">
            <div className="flex flex-col gap-5">
              <SectionHeading
                icon={SearchCheck}
                title="Gợi ý bắt đầu"
                description="Chọn một câu hỏi mẫu rồi chỉnh lại cho sát tài sản, giai đoạn hoặc luận điểm cần kiểm chứng."
              />

              <div className="grid gap-3 lg:grid-cols-3">
                {EXAMPLE_PROMPTS.map((prompt) => (
                  <Button
                    key={prompt}
                    type="button"
                    variant="outline"
                    className="h-auto justify-start py-3 text-left whitespace-normal"
                    onClick={() => handleExampleClick(prompt)}
                  >
                    <ChevronRight data-icon="inline-start" />
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          <Empty className="rounded-[28px] border border-dashed border-border bg-muted/10 py-16">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchCheck className="size-5 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>Chưa có briefing nào được hiển thị</EmptyTitle>
              <EmptyDescription>
                Sau khi chạy truy vấn, phần này sẽ hiển thị kết luận, tín hiệu tin cậy, bằng chứng
                và các sự kiện liên quan.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </>
      ) : (
        <div className="flex flex-col gap-6">
          <div
            ref={resultRegionRef}
            tabIndex={-1}
            role={phase === "error" ? "alert" : "status"}
            className="outline-none"
          >
            <QueryStateCard
              phase={phase}
              question={failedRun?.question || activeQuestion}
              result={phase === "success" ? latestSuccessfulRun?.result : null}
              error={phase === "error" ? failedRun?.error : null}
              hasPreviousSuccess={hasPreviousSuccess}
            />
          </div>

          {phase === "running" ? (
            <Empty className="rounded-[28px] border border-dashed border-border bg-muted/10 py-16">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Spinner className="size-5 text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle>Đang tổng hợp briefing mới</EmptyTitle>
                <EmptyDescription>
                  Kết quả cũ đã được gỡ khỏi trạng thái hoạt động. Bản briefing mới sẽ xuất hiện tại
                  đây ngay khi xử lý xong.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : null}

          {phase === "success" && latestSuccessfulRun ? (
            <BriefingContent
              run={latestSuccessfulRun}
              canReadEvents={canReadEvents}
              canReadSourceDocuments={canReadSourceDocuments}
            />
          ) : null}

          {phase === "error" ? (
            latestSuccessfulRun ? (
              <div className="flex flex-col gap-6">
                <section className="rounded-[28px] border border-border bg-muted/15 p-6 shadow-sm">
                  <div className="flex flex-col gap-4">
                    <SectionHeading
                      icon={Sparkles}
                      title="Bản briefing thành công gần nhất"
                      description="Giữ lại để tham chiếu sau khi truy vấn mới thất bại."
                    />
                    <DetailValue label="Áp dụng cho câu hỏi" value={latestSuccessfulRun.question} />
                  </div>
                </section>

                <BriefingContent
                  run={latestSuccessfulRun}
                  canReadEvents={canReadEvents}
                  canReadSourceDocuments={canReadSourceDocuments}
                />
              </div>
            ) : (
              <Empty className="rounded-[28px] border border-dashed border-border bg-muted/10 py-16">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <TriangleAlert className="size-5 text-muted-foreground" />
                  </EmptyMedia>
                  <EmptyTitle>Chưa có bản briefing thành công để tham chiếu</EmptyTitle>
                  <EmptyDescription>
                    Hãy điều chỉnh câu hỏi hoặc thử lại khi dữ liệu sẵn sàng hơn.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )
          ) : null}
        </div>
      )}
    </div>
  )
}

function SectionEmpty({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <Empty className="min-h-[220px] rounded-2xl border border-dashed border-border bg-muted/10">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Layers3 className="size-5 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

function DetailValue({
  label,
  value,
  meta,
  valueClassName,
}: {
  label: string
  value: string
  meta?: string | null
  valueClassName?: string
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </span>
      <p className={cn("text-sm leading-6 text-foreground", valueClassName)}>{value}</p>
      {meta ? <p className="text-xs leading-5 text-muted-foreground">{meta}</p> : null}
    </div>
  )
}

function KeyEventCard({
  event,
  canReadEvents,
}: {
  event: MarketQueryKeyEventResponse
  canReadEvents: boolean
}) {
  const title = event.title?.trim() || "Sự kiện chưa có tiêu đề"
  const fallbackMeta = !event.title?.trim() ? formatEventFallbackMeta(event.id) : null
  const canOpenEvent = canReadEvents && typeof event.id === "number"

  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-background/70 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={getConfidenceVariant(event.confidence)}>
          Độ tin cậy {formatConfidence(event.confidence)}
        </Badge>
        {event.occurredAt ? <Badge variant="outline">{formatDateTime(event.occurredAt)}</Badge> : null}
      </div>

      <div className="flex flex-col gap-2">
        {canOpenEvent ? (
          <Link href={`/events/${event.id}`} className="font-semibold text-foreground hover:underline">
            {title}
          </Link>
        ) : (
          <p className="font-semibold text-foreground">{title}</p>
        )}
        {fallbackMeta ? <p className="text-xs leading-5 text-muted-foreground">{fallbackMeta}</p> : null}
        <p className="text-sm leading-6 text-muted-foreground">
          {event.summary?.trim() || "Chưa có tóm tắt chi tiết cho sự kiện này."}
        </p>
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Tài sản liên quan
          </span>
          {event.assetSymbols && event.assetSymbols.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {event.assetSymbols.map((assetSymbol) => (
                <Badge key={assetSymbol} variant="secondary">
                  {assetSymbol}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Chưa có tài sản liên quan.</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Mã chủ đề
          </span>
          {event.themeSlugs && event.themeSlugs.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {event.themeSlugs.map((themeSlug) => (
                <Badge key={themeSlug} variant="outline">
                  {themeSlug}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">Chưa có chủ đề liên quan.</span>
          )}
        </div>
      </div>
    </article>
  )
}

function EvidenceCard({
  evidence,
  canReadEvents,
  canReadSourceDocuments,
}: {
  evidence: MarketQueryEvidenceResponse
  canReadEvents: boolean
  canReadSourceDocuments: boolean
}) {
  const eventTitle = evidence.eventTitle?.trim()
  const sourceDocumentTitle = evidence.sourceDocumentTitle?.trim()
  const eventLabel =
    eventTitle ||
    (typeof evidence.eventId === "number" ? "Sự kiện chưa có tiêu đề" : "Chưa gắn sự kiện")
  const sourceDocumentLabel =
    sourceDocumentTitle ||
    (typeof evidence.sourceDocumentId === "number"
      ? "Tài liệu chưa có tiêu đề"
      : "Chưa có tài liệu nguồn")
  const eventMeta = !eventTitle ? formatEventFallbackMeta(evidence.eventId) : null
  const sourceDocumentMeta = !sourceDocumentTitle
    ? formatSourceDocumentFallbackMeta(evidence.sourceDocumentId)
    : null
  const hasBlockedEvent = typeof evidence.eventId === "number" && !canReadEvents
  const hasBlockedSourceDocument =
    typeof evidence.sourceDocumentId === "number" && !canReadSourceDocuments
  const traceabilityHint = formatTraceabilityHint(hasBlockedEvent, hasBlockedSourceDocument)

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-border bg-background/80 p-5">
      <div className="flex flex-wrap items-center gap-2">
        {evidence.documentType ? (
          <Badge variant="outline">
            {MARKET_QUERY_DOCUMENT_TYPE_LABELS[evidence.documentType]}
          </Badge>
        ) : null}
        {evidence.evidenceRole ? (
          <Badge variant="secondary">
            {MARKET_QUERY_EVIDENCE_ROLE_LABELS[evidence.evidenceRole]}
          </Badge>
        ) : null}
        <Badge variant={getConfidenceVariant(evidence.evidenceConfidence)}>
          Độ tin cậy {formatConfidence(evidence.evidenceConfidence)}
        </Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="grid gap-4 md:grid-cols-2">
          <DetailValue label="Sự kiện" value={eventLabel} meta={eventMeta} />
          <DetailValue label="Tài liệu nguồn" value={sourceDocumentLabel} meta={sourceDocumentMeta} />
          <DetailValue
            label="Nguồn"
            value={evidence.sourceName?.trim() || "Chưa có"}
            valueClassName="text-muted-foreground"
          />
          <DetailValue
            label="Thời điểm xuất bản"
            value={formatDateTime(evidence.publishedAt)}
            valueClassName="text-muted-foreground"
          />
        </div>

        <div className="flex flex-col items-start gap-3 lg:items-end">
          <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          {typeof evidence.eventId === "number" ? (
            canReadEvents ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/events/${evidence.eventId}`}>
                  <GitBranch data-icon="inline-start" />
                  Xem sự kiện
                </Link>
              </Button>
            ) : null
          ) : null}

          {typeof evidence.sourceDocumentId === "number" ? (
            canReadSourceDocuments ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/source-documents/${evidence.sourceDocumentId}`}>
                  <FileText data-icon="inline-start" />
                  Xem tài liệu
                </Link>
              </Button>
            ) : null
          ) : null}

          {evidence.sourceDocumentUrl ? (
            <Button variant="outline" size="sm" asChild>
              <a href={evidence.sourceDocumentUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink data-icon="inline-start" />
                Mở liên kết gốc
              </a>
            </Button>
          ) : null}
        </div>
          {traceabilityHint ? (
            <p className="text-sm leading-6 text-muted-foreground">{traceabilityHint}</p>
          ) : null}
        </div>
      </div>
    </article>
  )
}

function QueryStateCard({
  phase,
  question,
  result,
  error,
  hasPreviousSuccess,
}: {
  phase: Exclude<QueryPhase, "idle">
  question: string
  result?: MarketQueryResponse | null
  error?: string | null
  hasPreviousSuccess?: boolean
}) {
  const isRunning = phase === "running"
  const isError = phase === "error"
  const badgeVariant = isError ? "destructive" : isRunning ? "outline" : "default"
  const statusLabel = isRunning
    ? "Đang phân tích"
    : isError
      ? "Không thể hoàn tất"
      : "Kết quả hiện tại"
  const description = isRunning
    ? "Hệ thống đang tổng hợp kết luận, độ tin cậy và bằng chứng cho câu hỏi này."
    : isError
      ? "Truy vấn vừa gửi chưa hoàn tất. Nội dung bên dưới, nếu có, chỉ là kết quả thành công trước đó."
      : "Đây là câu hỏi mà bản briefing hiện tại đang trả lời."
  const evidenceCount = result?.evidence?.length ?? 0
  const keyEventCount = result?.keyEvents?.length ?? 0

  return (
    <section
      className={cn(
        "rounded-[28px] border p-6 shadow-sm",
        isError
          ? "border-destructive/30 bg-destructive/5"
          : isRunning
            ? "border-border bg-primary/5"
            : "border-border bg-muted/15"
      )}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={badgeVariant}>{statusLabel}</Badge>
            {isRunning ? (
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner className="size-4" />
                Hệ thống đang xử lý yêu cầu mới.
              </span>
            ) : null}
          </div>

          <DetailValue label="Câu hỏi đang theo dõi" value={question} />
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>

          {isError && error ? (
            <div className="rounded-2xl border border-destructive/20 bg-background/80 p-4 text-sm leading-6 text-destructive">
              {error}
            </div>
          ) : null}

          {isError && hasPreviousSuccess ? (
            <p className="text-sm leading-6 text-muted-foreground">
              Bản briefing thành công gần nhất được giữ lại bên dưới để tham chiếu, không phải câu trả
              lời cho truy vấn vừa lỗi.
            </p>
          ) : null}
        </div>

        {phase === "success" && result ? (
          <div className="flex flex-wrap gap-2">
            <Badge variant={getConfidenceVariant(result.confidence)}>
              Độ tin cậy {formatConfidence(result.confidence)}
            </Badge>
            <Badge variant="outline">{evidenceCount} bằng chứng</Badge>
            <Badge variant="outline">{keyEventCount} sự kiện</Badge>
          </div>
        ) : null}
      </div>
    </section>
  )
}

function BriefingContent({
  run,
  canReadEvents,
  canReadSourceDocuments,
}: {
  run: SuccessfulQueryRun
  canReadEvents: boolean
  canReadSourceDocuments: boolean
}) {
  const keyEvents = run.result.keyEvents ?? []
  const assetsConsidered = run.result.assetsConsidered ?? []
  const limitations = run.result.limitations ?? []
  const evidence = run.result.evidence ?? []
  const reasoningChain = run.result.reasoningChain ?? []

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]">
        <section className="rounded-[28px] border border-border bg-background p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionHeading
              icon={Sparkles}
              title="Kết luận"
              description="Phần trả lời trực tiếp cho câu hỏi đang được hiển thị."
            />

            <div className="rounded-2xl border border-border bg-muted/20 p-5">
              <p className="whitespace-pre-wrap text-[15px] leading-8 text-foreground">
                {run.result.answer?.trim() || "Backend chưa trả về nội dung kết luận cụ thể."}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-border bg-muted/20 p-6">
          <div className="flex flex-col gap-5">
            <SectionHeading
              icon={Layers3}
              title="Tín hiệu tin cậy"
              description="Độ chắc chắn, giới hạn hiện tại và phạm vi tài sản được xét."
            />

            <div className="grid gap-4">
              <div className="rounded-2xl border border-border bg-background/85 p-5">
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Độ tin cậy
                </span>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Badge variant={getConfidenceVariant(run.result.confidence)}>
                    {formatConfidence(run.result.confidence)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Giá trị này phản ánh mức chắc chắn của kết luận hiện tại.
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background/85 p-5">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  <TriangleAlert className="size-4" />
                  Giới hạn hiện tại
                </div>

                {limitations.length > 0 ? (
                  <ul className="mt-3 flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
                    {limitations.map((limitation, index) => (
                      <li
                        key={`${limitation}-${index}`}
                        className="rounded-xl border border-border bg-muted/30 px-3 py-2"
                      >
                        {limitation}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Chưa có giới hạn nào được backend trả về cho truy vấn này.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-border bg-background/85 p-5">
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Tài sản đã xét
                </span>
                {assetsConsidered.length > 0 ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {assetsConsidered.map((asset) => (
                      <Badge key={asset} variant="secondary">
                        {asset}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Chưa có danh sách tài sản được backend trả về.
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="rounded-[28px] border border-border bg-background p-6 shadow-sm">
        <div className="flex flex-col gap-5">
          <SectionHeading
            icon={FileText}
            title="Bằng chứng"
            description="Đây là phần nên đọc đầu tiên khi cần kiểm chứng kết luận hiện tại."
          />

          {evidence.length > 0 ? (
            <div className="flex flex-col gap-4">
              {evidence.map((item, index) => (
                <EvidenceCard
                  key={`${item.sourceDocumentId ?? item.eventId ?? "evidence"}-${index}`}
                  evidence={item}
                  canReadEvents={canReadEvents}
                  canReadSourceDocuments={canReadSourceDocuments}
                />
              ))}
            </div>
          ) : (
            <SectionEmpty
              title="Chưa có bằng chứng"
              description="Backend chưa trả về bằng chứng chi tiết cho truy vấn này."
            />
          )}
        </div>
      </section>

      <section className="rounded-[28px] border border-border bg-background p-6 shadow-sm">
        <div className="flex flex-col gap-5">
          <SectionHeading
            icon={GitBranch}
            title="Sự kiện trọng yếu"
            description="Những diễn biến nổi bật để đọc sâu hơn khi cần."
          />

          {keyEvents.length > 0 ? (
            <div className="grid gap-4 xl:grid-cols-2">
              {keyEvents.map((event, index) => (
                <KeyEventCard
                  key={`${event.id ?? "event"}-${index}`}
                  event={event}
                  canReadEvents={canReadEvents}
                />
              ))}
            </div>
          ) : (
            <SectionEmpty
              title="Chưa có sự kiện trọng yếu"
              description="Truy vấn này chưa trả về danh sách sự kiện nổi bật để đối chiếu thêm."
            />
          )}
        </div>
      </section>

      <Collapsible className="group/collapsible rounded-[28px] border border-border bg-background p-6 shadow-sm">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <SectionHeading
              icon={Layers3}
              title="Quá trình tổng hợp"
              description="Được thu gọn mặc định để giữ nhịp đọc khi bạn chỉ cần kết luận và bằng chứng."
            />

            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="group/button">
                <ChevronRight
                  className="transition-transform group-data-[state=open]/collapsible:rotate-90"
                  data-icon="inline-start"
                />
                {reasoningChain.length > 0
                  ? `Xem ${reasoningChain.length} bước tổng hợp`
                  : "Xem chi tiết tổng hợp"}
              </Button>
            </CollapsibleTrigger>
          </div>

          <CollapsibleContent className="overflow-hidden">
            {reasoningChain.length > 0 ? (
              <ol className="flex flex-col gap-3">
                {reasoningChain.map((step, index) => (
                  <li
                    key={`${step}-${index}`}
                    className={cn(
                      "grid gap-3 rounded-2xl border border-border bg-muted/20 p-4",
                      "md:grid-cols-[auto_minmax(0,1fr)] md:items-start"
                    )}
                  >
                    <div className="flex size-8 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold text-foreground">
                      {index + 1}
                    </div>
                    <p className="text-sm leading-7 text-foreground/90">{step}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <SectionEmpty
                title="Chưa có chuỗi tổng hợp"
                description="Backend chưa trả về chuỗi tổng hợp cho truy vấn này."
              />
            )}
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  )
}

/*
export function LegacyMarketQueryWorkbench() {
  const canReadEvents = useHasAnyPermission(EVENT_READ_PERMISSIONS)
  const canReadSourceDocuments = useHasAnyPermission(SOURCE_DOCUMENT_READ_PERMISSIONS)
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState<QueryFormState>({ question: "" })
  const [questionError, setQuestionError] = useState<string | null>(null)
  const [phase, setPhase] = useState<QueryPhase>("idle")
  const [activeQuestion, setActiveQuestion] = useState("")
  const [latestSuccessfulRun, setLatestSuccessfulRun] = useState<SuccessfulQueryRun | null>(null)
  const [failedRun, setFailedRun] = useState<FailedQueryRun | null>(null)
  const questionId = useId()
  const resultRegionRef = useRef<HTMLDivElement | null>(null)
  const announcement = getAnnouncement(phase, activeQuestion, latestSuccessfulRun, failedRun)
  const hasPreviousSuccess = phase === "error" && latestSuccessfulRun !== null

  useEffect(() => {
    if (phase === "idle" || !resultRegionRef.current) {
      return
    }

    resultRegionRef.current.focus({ preventScroll: true })
    resultRegionRef.current.scrollIntoView({
      behavior: getScrollBehavior(),
      block: "start",
    })
  }, [activeQuestion, phase])

  const handleExampleClick = (prompt: string) => {
    setForm((current) => ({ ...current, question: prompt }))
    setQuestionError(null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const question = form.question.trim()

    if (!question) {
      setQuestionError("Vui lòng nhập câu hỏi cần phân tích.")
      return
    }

    setQuestionError(null)
    setActiveQuestion(question)
    setFailedRun(null)
    setPhase("running")

    startTransition(async () => {
      const actionResult = await queryMarket({
        question,
      })

      if (!actionResult.success) {
        setFailedRun({
          question,
          error: actionResult.error,
        })
        setPhase("error")
        toast.error(actionResult.error)
        return
      }

      setLatestSuccessfulRun({
        question,
        result: actionResult.data,
      })
      setFailedRun(null)
      setPhase("success")
      toast.success("Đã hoàn tất truy vấn thị trường.")
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]">
        <div className="rounded-[28px] border border-border bg-gradient-to-br from-primary/8 via-background to-secondary/15 p-6 shadow-sm">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">Một lần hỏi, một lần trả lời</Badge>
                <Badge variant="outline">Grounded vào sự kiện và tài liệu nguồn</Badge>
              </div>

              <div className="flex flex-col gap-2">
                <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-foreground">
                  Biến dữ liệu sự kiện thành một bản briefing có thể đọc và đối chiếu nhanh.
                </h1>
                <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                  Tập trung vào một câu hỏi cụ thể rồi xem kết luận, bằng chứng và chuỗi tổng hợp
                  ngay trên cùng một màn hình. V1 dùng thời điểm hiện tại do backend tự xác định cho
                  mỗi lần truy vấn.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <FieldGroup>
                <Field data-invalid={!!questionError}>
                  <FieldLabel htmlFor={questionId}>Câu hỏi phân tích</FieldLabel>
                  <Textarea
                    id={questionId}
                    value={form.question}
                    onChange={(event) => {
                      setForm((current) => ({ ...current, question: event.target.value }))
                      if (questionError) {
                        setQuestionError(null)
                      }
                    }}
                    placeholder="Ví dụ: Những sự kiện nào đang hỗ trợ xu hướng tăng của vàng trong 7 ngày gần đây?"
                    className="min-h-[180px] resize-y bg-background/85"
                    aria-invalid={questionError ? true : undefined}
                    disabled={isPending}
                  />
                  <FieldDescription>
                    Đặt câu hỏi càng cụ thể càng tốt để hệ thống trả về kết luận và bằng chứng
                    bám sát ngữ cảnh.
                  </FieldDescription>
                  <FieldError>{questionError}</FieldError>
                </Field>

                <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px] md:items-end">
                  <Field>
                    <FieldLabel>Thời điểm phân tích</FieldLabel>
                    <FieldDescription>
                      Frontend không gửi mốc thời gian ở v1. Backend sẽ tự lấy thời điểm hiện tại để
                      tổng hợp câu trả lời.
                    </FieldDescription>
                  </Field>

                  <Field className="justify-end">
                    <FieldLabel className="sr-only">Thực thi truy vấn</FieldLabel>
                    <Button type="submit" size="lg" disabled={isPending} className="w-full self-end">
                      {isPending ? <Spinner data-icon="inline-start" /> : <Sparkles data-icon="inline-start" />}
                      {isPending ? "Đang phân tích..." : "Phân tích"}
                    </Button>
                    <FieldDescription>
                      Kết quả chỉ hiển thị cho truy vấn hiện tại và không lưu lịch sử ở v1.
                    </FieldDescription>
                  </Field>
                </div>
              </FieldGroup>
            </form>

            {submitError ? (
              <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                {submitError}
              </div>
            ) : null}
          </div>
        </div>

        <aside className="rounded-[28px] border border-border bg-muted/20 p-6">
          <div className="flex h-full flex-col gap-5">
            <SectionHeading
              icon={SearchCheck}
              title="Nhịp làm việc"
              description="Đây là một workbench phân tích dạng one-shot, phù hợp khi cần câu trả lời có dẫn vết nhanh."
            />

            <Separator />

            {result ? (
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border border-border bg-background/80 p-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      Truy vấn gần nhất
                    </span>
                    <p className="text-sm leading-7 text-foreground">{submittedQuestion}</p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                  <div className="rounded-2xl border border-border bg-background/80 p-4">
                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      <Clock3 className="size-4" />
                      Thời điểm truy vấn
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Backend tự lấy thời điểm hiện tại cho truy vấn này vì frontend không gửi mốc
                      thời gian ở phiên bản hiện tại.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-border bg-background/80 p-4">
                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      <Link2 className="size-4" />
                      Dẫn vết
                    </div>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Liên kết sang sự kiện và tài liệu chỉ mở được khi bạn có quyền đọc tương ứng.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="rounded-2xl border border-border bg-background/80 p-4">
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      Gợi ý cách hỏi
                    </span>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Tập trung vào một tài sản, một giai đoạn hoặc một luận điểm cần kiểm chứng.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  {EXAMPLE_PROMPTS.map((prompt) => (
                    <Button
                      key={prompt}
                      type="button"
                      variant="outline"
                      className="h-auto justify-start py-3 text-left whitespace-normal"
                      onClick={() => handleExampleClick(prompt)}
                    >
                      <ChevronRight data-icon="inline-start" />
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </section>

      {result ? (
        <div className="flex flex-col gap-6">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]">
            <section className="rounded-[28px] border border-border bg-background p-6 shadow-sm">
              <div className="flex flex-col gap-5">
                <SectionHeading
                  icon={Sparkles}
                  title="Kết luận"
                  description="Phần trả lời trực tiếp từ hệ thống cho câu hỏi hiện tại."
                />

                <div className="rounded-2xl border border-border bg-muted/20 p-5">
                  <p className="whitespace-pre-wrap text-[15px] leading-8 text-foreground">
                    {result.answer?.trim() || "Backend chưa trả về nội dung kết luận cụ thể."}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-border bg-muted/20 p-6">
              <div className="flex flex-col gap-5">
                <SectionHeading
                  icon={Layers3}
                  title="Tóm tắt nhanh"
                  description="Những tín hiệu quan trọng để đọc nhanh phạm vi và độ chắc chắn của câu trả lời."
                />

                <div className="grid gap-4">
                  <div className="rounded-2xl border border-border bg-background/85 p-5">
                    <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      Độ tin cậy
                    </span>
                    <div className="mt-3 flex items-center gap-3">
                      <Badge variant={getConfidenceVariant(result.confidence)}>
                        {formatConfidence(result.confidence)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Giá trị này phản ánh mức chắc chắn của kết luận tổng hợp.
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-background/85 p-5">
                    <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      Tài sản đã xét
                    </span>
                    {assetsConsidered.length > 0 ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {assetsConsidered.map((asset) => (
                          <Badge key={asset} variant="secondary">
                            {asset}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-3 text-sm text-muted-foreground">
                        Chưa có danh sách tài sản được backend trả về.
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-border bg-background/85 p-5">
                    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      <TriangleAlert className="size-4" />
                      Giới hạn hiện tại
                    </div>

                    {limitations.length > 0 ? (
                      <ul className="mt-3 flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
                        {limitations.map((limitation, index) => (
                          <li
                            key={`${limitation}-${index}`}
                            className="rounded-xl border border-border bg-muted/30 px-3 py-2"
                          >
                            {limitation}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-sm text-muted-foreground">
                        Chưa có giới hạn nào được backend trả về cho truy vấn này.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </div>

          <section className="rounded-[28px] border border-border bg-background p-6 shadow-sm">
            <div className="flex flex-col gap-5">
              <SectionHeading
                icon={GitBranch}
                title="Sự kiện trọng yếu"
                description="Những sự kiện mà backend coi là tác nhân nổi bật cho câu trả lời hiện tại."
              />

              {keyEvents.length > 0 ? (
                <div className="grid gap-4 xl:grid-cols-2">
                  {keyEvents.map((event, index) => (
                    <KeyEventCard
                      key={`${event.id ?? "event"}-${index}`}
                      event={event}
                      canReadEvents={canReadEvents}
                    />
                  ))}
                </div>
              ) : (
                <SectionEmpty
                  title="Chưa có sự kiện trọng yếu"
                  description="Truy vấn này chưa trả về danh sách sự kiện nổi bật để đối chiếu thêm."
                />
              )}
            </div>
          </section>

          <section className="rounded-[28px] border border-border bg-background p-6 shadow-sm">
            <div className="flex flex-col gap-5">
              <SectionHeading
                icon={FileText}
                title="Bằng chứng"
                description="Chuỗi tài liệu và sự kiện dùng để chống lưng cho kết luận, kèm theo quyền dẫn vết tương ứng."
              />

              {evidence.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {evidence.map((item, index) => (
                    <EvidenceCard
                      key={`${item.sourceDocumentId ?? item.eventId ?? "evidence"}-${index}`}
                      evidence={item}
                      canReadEvents={canReadEvents}
                      canReadSourceDocuments={canReadSourceDocuments}
                    />
                  ))}
                </div>
              ) : (
                <SectionEmpty
                  title="Chưa có bằng chứng"
                  description="Backend chưa trả về bằng chứng chi tiết cho truy vấn này."
                />
              )}
            </div>
          </section>

          <Collapsible className="group/collapsible rounded-[28px] border border-border bg-background p-6 shadow-sm">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <SectionHeading
                  icon={Link2}
                  title="Quá trình tổng hợp"
                  description="Hiển thị cho mọi người dùng có quyền truy vấn, nhưng được thu gọn mặc định để giữ nhịp đọc."
                />

                <CollapsibleTrigger asChild>
                  <Button variant="outline" size="sm" className="group/button">
                    <ChevronRight
                      className="transition-transform group-data-[state=open]/collapsible:rotate-90"
                      data-icon="inline-start"
                    />
                    {reasoningChain.length > 0
                      ? `Xem ${reasoningChain.length} bước tổng hợp`
                      : "Xem chi tiết tổng hợp"}
                  </Button>
                </CollapsibleTrigger>
              </div>

              <CollapsibleContent className="overflow-hidden">
                {reasoningChain.length > 0 ? (
                  <ol className="flex flex-col gap-3">
                    {reasoningChain.map((step, index) => (
                      <li
                        key={`${step}-${index}`}
                        className={cn(
                          "grid gap-3 rounded-2xl border border-border bg-muted/20 p-4",
                          "md:grid-cols-[auto_minmax(0,1fr)] md:items-start"
                        )}
                      >
                        <div className="flex size-8 items-center justify-center rounded-full border border-border bg-background text-sm font-semibold text-foreground">
                          {index + 1}
                        </div>
                        <p className="text-sm leading-7 text-foreground/90">{step}</p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <SectionEmpty
                    title="Chưa có chuỗi tổng hợp"
                    description="Backend chưa trả về reasoning chain cho truy vấn này."
                  />
                )}
              </CollapsibleContent>
            </div>
          </Collapsible>
        </div>
      ) : (
        <Empty className="rounded-[28px] border border-dashed border-border bg-muted/10 py-16">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchCheck className="size-5 text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>Chưa có kết quả phân tích</EmptyTitle>
            <EmptyDescription>
              Điền câu hỏi ở phía trên để tạo một bản briefing thị trường gồm kết luận, sự
              kiện trọng yếu, bằng chứng và chuỗi tổng hợp.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="max-w-3xl">
            <div className="flex flex-wrap justify-center gap-2">
              {EXAMPLE_PROMPTS.map((prompt) => (
                <Button
                  key={prompt}
                  type="button"
                  variant="outline"
                  className="h-auto py-3 text-left whitespace-normal"
                  onClick={() => handleExampleClick(prompt)}
                >
                  <ChevronRight data-icon="inline-start" />
                  {prompt}
                </Button>
              ))}
            </div>
          </EmptyContent>
        </Empty>
      )}
    </div>
  )
}
*/
