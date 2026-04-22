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
import { isNewsArticleArtifact } from "@/app/lib/artifacts/definitions"
import { EVENT_READ_PERMISSIONS } from "@/app/lib/events/permissions"
import {
  MARKET_QUERY_ARTIFACT_TYPE_LABELS,
  MARKET_QUERY_EVIDENCE_ROLE_LABELS,
  MarketQueryEvidenceResponse,
  MarketQueryKeyEventResponse,
  MarketQueryResponse,
} from "@/app/lib/market-query/definitions"
import { NEWS_ARTICLE_READ_PERMISSIONS } from "@/app/lib/news-articles/permissions"
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
  "Nhá»¯ng sá»± kiá»‡n nÃ o Ä‘ang há»— trá»£ xu hÆ°á»›ng tÄƒng cá»§a vÃ ng trong 7 ngÃ y gáº§n Ä‘Ã¢y?",
  "CÃ¡c tÃ­n hiá»‡u hiá»‡n táº¡i cÃ³ Ä‘ang nghiÃªng vá» Ã¡p lá»±c giáº£m Ä‘á»‘i vá»›i dáº§u Brent khÃ´ng?",
  "Trong tuáº§n nÃ y, yáº¿u tá»‘ nÃ o Ä‘ang áº£nh hÆ°á»Ÿng máº¡nh nháº¥t tá»›i tÃ¢m lÃ½ thá»‹ trÆ°á»ng tiá»n Ä‘iá»‡n tá»­?",
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
  hasBlockedArtifact: boolean
) {
  if (hasBlockedEvent && hasBlockedArtifact) {
    return "Chi tiáº¿t sá»± kiá»‡n vÃ  tÃ i liá»‡u chÆ°a má»Ÿ Ä‘Æ°á»£c vá»›i quyá»n hiá»‡n táº¡i."
  }

  if (hasBlockedEvent) {
    return "Chi tiáº¿t sá»± kiá»‡n chÆ°a má»Ÿ Ä‘Æ°á»£c vá»›i quyá»n hiá»‡n táº¡i."
  }

  if (hasBlockedArtifact) {
    return "Chi tiáº¿t tÃ i liá»‡u chÆ°a má»Ÿ Ä‘Æ°á»£c vá»›i quyá»n hiá»‡n táº¡i."
  }

  return null
}

function formatDateTime(value?: string | null) {
  if (!value) {
    return "ChÆ°a cÃ³"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "ChÆ°a cÃ³"
  }

  return format(date, "dd/MM/yyyy HH:mm")
}

function formatConfidence(value?: number) {
  if (typeof value !== "number") {
    return "ChÆ°a cÃ³"
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
  return typeof id === "number" ? `MÃ£ sá»± kiá»‡n #${id}` : null
}

function formatArtifactFallbackMeta(id?: number) {
  return typeof id === "number" ? `MÃ£ tÃ i liá»‡u #${id}` : null
}

function getAnnouncement(
  phase: QueryPhase,
  activeQuestion: string,
  latestSuccessfulRun: SuccessfulQueryRun | null,
  failedRun: FailedQueryRun | null
) {
  if (phase === "running" && activeQuestion) {
    return `Äang phÃ¢n tÃ­ch cÃ¢u há»i: ${activeQuestion}`
  }

  if (phase === "success" && latestSuccessfulRun) {
    return `ÄÃ£ hoÃ n táº¥t truy váº¥n cho cÃ¢u há»i: ${latestSuccessfulRun.question}`
  }

  if (phase === "error" && failedRun) {
    return `Truy váº¥n tháº¥t báº¡i cho cÃ¢u há»i: ${failedRun.question}. ${failedRun.error}`
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
  const canReadNewsArticles = useHasAnyPermission(NEWS_ARTICLE_READ_PERMISSIONS)
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
      setQuestionError("Vui lÃ²ng nháº­p cÃ¢u há»i cáº§n phÃ¢n tÃ­ch.")
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
      toast.success("ÄÃ£ hoÃ n táº¥t truy váº¥n thá»‹ trÆ°á»ng.")
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
              <Badge variant="secondary">Táº­p trung vÃ o má»™t cÃ¢u há»i</Badge>
              <Badge variant="outline">DÃ¹ng thá»i Ä‘iá»ƒm hiá»‡n táº¡i tá»« backend</Badge>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-foreground">
                Nháº­n briefing thá»‹ trÆ°á»ng cÃ³ dáº«n váº¿t trÃªn cÃ¹ng má»™t mÃ n hÃ¬nh.
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                Nháº­p má»™t cÃ¢u há»i cá»¥ thá»ƒ Ä‘á»ƒ xem káº¿t luáº­n, Ä‘á»™ tin cáº­y, giá»›i háº¡n vÃ  báº±ng chá»©ng liÃªn
                quan.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <FieldGroup>
              <Field data-invalid={!!questionError}>
                <FieldLabel htmlFor={questionId}>CÃ¢u há»i phÃ¢n tÃ­ch</FieldLabel>
                <Textarea
                  id={questionId}
                  value={form.question}
                  onChange={(event) => {
                    setForm((current) => ({ ...current, question: event.target.value }))
                    if (questionError) {
                      setQuestionError(null)
                    }
                  }}
                  placeholder="VÃ­ dá»¥: Nhá»¯ng sá»± kiá»‡n nÃ o Ä‘ang há»— trá»£ xu hÆ°á»›ng tÄƒng cá»§a vÃ ng trong 7 ngÃ y gáº§n Ä‘Ã¢y?"
                  className="min-h-[180px] resize-y bg-background/85"
                  aria-invalid={questionError ? true : undefined}
                  disabled={isPending}
                />
                <FieldDescription>
                  CÃ¢u há»i cÃ ng cá»¥ thá»ƒ, há»‡ thá»‘ng cÃ ng dá»… tráº£ vá» káº¿t luáº­n vÃ  báº±ng chá»©ng bÃ¡m sÃ¡t ngá»¯
                  cáº£nh.
                </FieldDescription>
                <FieldError>{questionError}</FieldError>
              </Field>

              <Field className="justify-end">
                <FieldLabel className="sr-only">Thá»±c thi truy váº¥n</FieldLabel>
                <Button type="submit" size="lg" disabled={isPending} className="w-full md:w-auto">
                  {isPending ? <Spinner data-icon="inline-start" /> : <Sparkles data-icon="inline-start" />}
                  {isPending ? "Äang phÃ¢n tÃ­ch..." : "PhÃ¢n tÃ­ch"}
                </Button>
                <FieldDescription>
                  PhiÃªn báº£n hiá»‡n táº¡i luÃ´n dÃ¹ng thá»i Ä‘iá»ƒm backend nháº­n truy váº¥n.
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
                title="Gá»£i Ã½ báº¯t Ä‘áº§u"
                description="Chá»n má»™t cÃ¢u há»i máº«u rá»“i chá»‰nh láº¡i cho sÃ¡t tÃ i sáº£n, giai Ä‘oáº¡n hoáº·c luáº­n Ä‘iá»ƒm cáº§n kiá»ƒm chá»©ng."
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
              <EmptyTitle>ChÆ°a cÃ³ briefing nÃ o Ä‘Æ°á»£c hiá»ƒn thá»‹</EmptyTitle>
              <EmptyDescription>
                Sau khi cháº¡y truy váº¥n, pháº§n nÃ y sáº½ hiá»ƒn thá»‹ káº¿t luáº­n, tÃ­n hiá»‡u tin cáº­y, báº±ng chá»©ng
                vÃ  cÃ¡c sá»± kiá»‡n liÃªn quan.
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
                <EmptyTitle>Äang tá»•ng há»£p briefing má»›i</EmptyTitle>
                <EmptyDescription>
                  Káº¿t quáº£ cÅ© Ä‘Ã£ Ä‘Æ°á»£c gá»¡ khá»i tráº¡ng thÃ¡i hoáº¡t Ä‘á»™ng. Báº£n briefing má»›i sáº½ xuáº¥t hiá»‡n táº¡i
                  Ä‘Ã¢y ngay khi xá»­ lÃ½ xong.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : null}

          {phase === "success" && latestSuccessfulRun ? (
              <BriefingContent
                run={latestSuccessfulRun}
                canReadEvents={canReadEvents}
                canReadNewsArticles={canReadNewsArticles}
              />
          ) : null}

          {phase === "error" ? (
            latestSuccessfulRun ? (
              <div className="flex flex-col gap-6">
                <section className="rounded-[28px] border border-border bg-muted/15 p-6 shadow-sm">
                  <div className="flex flex-col gap-4">
                    <SectionHeading
                      icon={Sparkles}
                      title="Báº£n briefing thÃ nh cÃ´ng gáº§n nháº¥t"
                      description="Giá»¯ láº¡i Ä‘á»ƒ tham chiáº¿u sau khi truy váº¥n má»›i tháº¥t báº¡i."
                    />
                    <DetailValue label="Ãp dá»¥ng cho cÃ¢u há»i" value={latestSuccessfulRun.question} />
                  </div>
                </section>

                <BriefingContent
                  run={latestSuccessfulRun}
                  canReadEvents={canReadEvents}
                  canReadNewsArticles={canReadNewsArticles}
                />
              </div>
            ) : (
              <Empty className="rounded-[28px] border border-dashed border-border bg-muted/10 py-16">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <TriangleAlert className="size-5 text-muted-foreground" />
                  </EmptyMedia>
                  <EmptyTitle>ChÆ°a cÃ³ báº£n briefing thÃ nh cÃ´ng Ä‘á»ƒ tham chiáº¿u</EmptyTitle>
                  <EmptyDescription>
                    HÃ£y Ä‘iá»u chá»‰nh cÃ¢u há»i hoáº·c thá»­ láº¡i khi dá»¯ liá»‡u sáºµn sÃ ng hÆ¡n.
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
  const title = event.title?.trim() || "Sá»± kiá»‡n chÆ°a cÃ³ tiÃªu Ä‘á»"
  const fallbackMeta = !event.title?.trim() ? formatEventFallbackMeta(event.id) : null
  const canOpenEvent = canReadEvents && typeof event.id === "number"

  return (
    <article className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-background/70 p-5">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={getConfidenceVariant(event.confidence)}>
          Äá»™ tin cáº­y {formatConfidence(event.confidence)}
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
          {event.summary?.trim() || "ChÆ°a cÃ³ tÃ³m táº¯t chi tiáº¿t cho sá»± kiá»‡n nÃ y."}
        </p>
      </div>

      <div className="mt-auto flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            TÃ i sáº£n liÃªn quan
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
            <span className="text-sm text-muted-foreground">ChÆ°a cÃ³ tÃ i sáº£n liÃªn quan.</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            MÃ£ chá»§ Ä‘á»
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
            <span className="text-sm text-muted-foreground">ChÆ°a cÃ³ chá»§ Ä‘á» liÃªn quan.</span>
          )}
        </div>
      </div>
    </article>
  )
}

function EvidenceCard({
  evidence,
  canReadEvents,
  canReadNewsArticles,
}: {
  evidence: MarketQueryEvidenceResponse
  canReadEvents: boolean
  canReadNewsArticles: boolean
}) {
  const eventTitle = evidence.eventTitle?.trim()
  const artifactTitle = evidence.artifactTitle?.trim()
  const eventLabel =
    eventTitle ||
    (typeof evidence.eventId === "number" ? "Sá»± kiá»‡n chÆ°a cÃ³ tiÃªu Ä‘á»" : "ChÆ°a gáº¯n sá»± kiá»‡n")
  const artifactLabel =
    artifactTitle ||
    (typeof evidence.artifactId === "number"
      ? "TÃ i liá»‡u chÆ°a cÃ³ tiÃªu Ä‘á»"
      : "ChÆ°a cÃ³ tÃ i liá»‡u nguá»“n")
  const eventMeta = !eventTitle ? formatEventFallbackMeta(evidence.eventId) : null
  const artifactMeta = !artifactTitle
    ? formatArtifactFallbackMeta(evidence.artifactId)
    : null
  const hasBlockedEvent = typeof evidence.eventId === "number" && !canReadEvents
  const hasBlockedArtifact =
    typeof evidence.artifactId === "number" &&
    isNewsArticleArtifact(evidence.artifactType) &&
    !canReadNewsArticles
  const traceabilityHint = formatTraceabilityHint(hasBlockedEvent, hasBlockedArtifact)

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-border bg-background/80 p-5">
      <div className="flex flex-wrap items-center gap-2">
        {evidence.artifactType ? (
          <Badge variant="outline">
            {MARKET_QUERY_ARTIFACT_TYPE_LABELS[evidence.artifactType]}
          </Badge>
        ) : null}
        {evidence.evidenceRole ? (
          <Badge variant="secondary">
            {MARKET_QUERY_EVIDENCE_ROLE_LABELS[evidence.evidenceRole]}
          </Badge>
        ) : null}
        <Badge variant={getConfidenceVariant(evidence.evidenceConfidence)}>
          Äá»™ tin cáº­y {formatConfidence(evidence.evidenceConfidence)}
        </Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start">
        <div className="grid gap-4 md:grid-cols-2">
          <DetailValue label="Sá»± kiá»‡n" value={eventLabel} meta={eventMeta} />
          <DetailValue label="Tai lieu" value={artifactLabel} meta={artifactMeta} />
          <DetailValue
            label="Nguá»“n"
            value={evidence.newsOutletName?.trim() || "ChÆ°a cÃ³"}
            valueClassName="text-muted-foreground"
          />
          <DetailValue
            label="Thá»i Ä‘iá»ƒm xuáº¥t báº£n"
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
                  Xem sá»± kiá»‡n
                </Link>
              </Button>
            ) : null
          ) : null}

          {typeof evidence.artifactId === "number" &&
          isNewsArticleArtifact(evidence.artifactType) ? (
            canReadNewsArticles ? (
              <Button variant="outline" size="sm" asChild>
                <Link href={`/news-articles/${evidence.artifactId}`}>
                  <FileText data-icon="inline-start" />
                  Xem bai viet
                </Link>
              </Button>
            ) : null
          ) : null}

          {evidence.artifactUrl ? (
            <Button variant="outline" size="sm" asChild>
              <a href={evidence.artifactUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink data-icon="inline-start" />
                Má»Ÿ liÃªn káº¿t gá»‘c
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
    ? "Äang phÃ¢n tÃ­ch"
    : isError
      ? "KhÃ´ng thá»ƒ hoÃ n táº¥t"
      : "Káº¿t quáº£ hiá»‡n táº¡i"
  const description = isRunning
    ? "Há»‡ thá»‘ng Ä‘ang tá»•ng há»£p káº¿t luáº­n, Ä‘á»™ tin cáº­y vÃ  báº±ng chá»©ng cho cÃ¢u há»i nÃ y."
    : isError
      ? "Truy váº¥n vá»«a gá»­i chÆ°a hoÃ n táº¥t. Ná»™i dung bÃªn dÆ°á»›i, náº¿u cÃ³, chá»‰ lÃ  káº¿t quáº£ thÃ nh cÃ´ng trÆ°á»›c Ä‘Ã³."
      : "ÄÃ¢y lÃ  cÃ¢u há»i mÃ  báº£n briefing hiá»‡n táº¡i Ä‘ang tráº£ lá»i."
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
                Há»‡ thá»‘ng Ä‘ang xá»­ lÃ½ yÃªu cáº§u má»›i.
              </span>
            ) : null}
          </div>

          <DetailValue label="CÃ¢u há»i Ä‘ang theo dÃµi" value={question} />
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>

          {isError && error ? (
            <div className="rounded-2xl border border-destructive/20 bg-background/80 p-4 text-sm leading-6 text-destructive">
              {error}
            </div>
          ) : null}

          {isError && hasPreviousSuccess ? (
            <p className="text-sm leading-6 text-muted-foreground">
              Báº£n briefing thÃ nh cÃ´ng gáº§n nháº¥t Ä‘Æ°á»£c giá»¯ láº¡i bÃªn dÆ°á»›i Ä‘á»ƒ tham chiáº¿u, khÃ´ng pháº£i cÃ¢u tráº£
              lá»i cho truy váº¥n vá»«a lá»—i.
            </p>
          ) : null}
        </div>

        {phase === "success" && result ? (
          <div className="flex flex-wrap gap-2">
            <Badge variant={getConfidenceVariant(result.confidence)}>
              Äá»™ tin cáº­y {formatConfidence(result.confidence)}
            </Badge>
            <Badge variant="outline">{evidenceCount} báº±ng chá»©ng</Badge>
            <Badge variant="outline">{keyEventCount} sá»± kiá»‡n</Badge>
          </div>
        ) : null}
      </div>
    </section>
  )
}

function BriefingContent({
  run,
  canReadEvents,
  canReadNewsArticles,
}: {
  run: SuccessfulQueryRun
  canReadEvents: boolean
  canReadNewsArticles: boolean
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
              title="Káº¿t luáº­n"
              description="Pháº§n tráº£ lá»i trá»±c tiáº¿p cho cÃ¢u há»i Ä‘ang Ä‘Æ°á»£c hiá»ƒn thá»‹."
            />

            <div className="rounded-2xl border border-border bg-muted/20 p-5">
              <p className="whitespace-pre-wrap text-[15px] leading-8 text-foreground">
                {run.result.answer?.trim() || "Backend chÆ°a tráº£ vá» ná»™i dung káº¿t luáº­n cá»¥ thá»ƒ."}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-border bg-muted/20 p-6">
          <div className="flex flex-col gap-5">
            <SectionHeading
              icon={Layers3}
              title="TÃ­n hiá»‡u tin cáº­y"
              description="Äá»™ cháº¯c cháº¯n, giá»›i háº¡n hiá»‡n táº¡i vÃ  pháº¡m vi tÃ i sáº£n Ä‘Æ°á»£c xÃ©t."
            />

            <div className="grid gap-4">
              <div className="rounded-2xl border border-border bg-background/85 p-5">
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Äá»™ tin cáº­y
                </span>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <Badge variant={getConfidenceVariant(run.result.confidence)}>
                    {formatConfidence(run.result.confidence)}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    GiÃ¡ trá»‹ nÃ y pháº£n Ã¡nh má»©c cháº¯c cháº¯n cá»§a káº¿t luáº­n hiá»‡n táº¡i.
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-background/85 p-5">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  <TriangleAlert className="size-4" />
                  Giá»›i háº¡n hiá»‡n táº¡i
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
                    ChÆ°a cÃ³ giá»›i háº¡n nÃ o Ä‘Æ°á»£c backend tráº£ vá» cho truy váº¥n nÃ y.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-border bg-background/85 p-5">
                <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  TÃ i sáº£n Ä‘Ã£ xÃ©t
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
                    ChÆ°a cÃ³ danh sÃ¡ch tÃ i sáº£n Ä‘Æ°á»£c backend tráº£ vá».
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
            title="Báº±ng chá»©ng"
            description="ÄÃ¢y lÃ  pháº§n nÃªn Ä‘á»c Ä‘áº§u tiÃªn khi cáº§n kiá»ƒm chá»©ng káº¿t luáº­n hiá»‡n táº¡i."
          />

          {evidence.length > 0 ? (
            <div className="flex flex-col gap-4">
              {evidence.map((item, index) => (
                <EvidenceCard
                  key={`${item.artifactId ?? item.eventId ?? "evidence"}-${index}`}
                  evidence={item}
                  canReadEvents={canReadEvents}
                  canReadNewsArticles={canReadNewsArticles}
                />
              ))}
            </div>
          ) : (
            <SectionEmpty
              title="ChÆ°a cÃ³ báº±ng chá»©ng"
              description="Backend chÆ°a tráº£ vá» báº±ng chá»©ng chi tiáº¿t cho truy váº¥n nÃ y."
            />
          )}
        </div>
      </section>

      <section className="rounded-[28px] border border-border bg-background p-6 shadow-sm">
        <div className="flex flex-col gap-5">
          <SectionHeading
            icon={GitBranch}
            title="Sá»± kiá»‡n trá»ng yáº¿u"
            description="Nhá»¯ng diá»…n biáº¿n ná»•i báº­t Ä‘á»ƒ Ä‘á»c sÃ¢u hÆ¡n khi cáº§n."
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
              title="ChÆ°a cÃ³ sá»± kiá»‡n trá»ng yáº¿u"
              description="Truy váº¥n nÃ y chÆ°a tráº£ vá» danh sÃ¡ch sá»± kiá»‡n ná»•i báº­t Ä‘á»ƒ Ä‘á»‘i chiáº¿u thÃªm."
            />
          )}
        </div>
      </section>

      <Collapsible className="group/collapsible rounded-[28px] border border-border bg-background p-6 shadow-sm">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <SectionHeading
              icon={Layers3}
              title="QuÃ¡ trÃ¬nh tá»•ng há»£p"
              description="ÄÆ°á»£c thu gá»n máº·c Ä‘á»‹nh Ä‘á»ƒ giá»¯ nhá»‹p Ä‘á»c khi báº¡n chá»‰ cáº§n káº¿t luáº­n vÃ  báº±ng chá»©ng."
            />

            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="group/button">
                <ChevronRight
                  className="transition-transform group-data-[state=open]/collapsible:rotate-90"
                  data-icon="inline-start"
                />
                {reasoningChain.length > 0
                  ? `Xem ${reasoningChain.length} bÆ°á»›c tá»•ng há»£p`
                  : "Xem chi tiáº¿t tá»•ng há»£p"}
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
                title="ChÆ°a cÃ³ chuá»—i tá»•ng há»£p"
                description="Backend chÆ°a tráº£ vá» chuá»—i tá»•ng há»£p cho truy váº¥n nÃ y."
              />
            )}
          </CollapsibleContent>
        </div>
      </Collapsible>
    </div>
  )
}

