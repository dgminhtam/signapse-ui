"use client"

import { type FormEvent, useEffect, useId, useRef, useState, useTransition } from "react"
import { SearchCheck, Sparkles, TriangleAlert } from "lucide-react"
import { toast } from "sonner"

import { queryMarket } from "@/app/api/query/action"
import { EVENT_READ_PERMISSIONS } from "@/app/lib/events/permissions"
import { MARKET_QUERY_SOURCE_DOCUMENT_READ_PERMISSIONS } from "@/app/lib/market-query/permissions"
import { useHasAnyPermission } from "@/components/permission-provider"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Spinner } from "@/components/ui/spinner"

import { BriefingContent } from "./market-query-briefing-content"
import { MarketQueryComposer } from "./market-query-composer"
import { getScrollBehavior } from "./market-query-format"
import { DetailValue, SectionHeading } from "./market-query-section"
import { QueryStateCard } from "./market-query-state-card"
import type {
  FailedQueryRun,
  QueryFormState,
  QueryPhase,
  SuccessfulQueryRun,
} from "./market-query-types"

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

export function MarketQueryWorkbench() {
  const canReadEvents = useHasAnyPermission(EVENT_READ_PERMISSIONS)
  const canReadSourceDocuments = useHasAnyPermission(MARKET_QUERY_SOURCE_DOCUMENT_READ_PERMISSIONS)
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState<QueryFormState>({ question: "" })
  const [questionError, setQuestionError] = useState<string | null>(null)
  const [phase, setPhase] = useState<QueryPhase>("idle")
  const [activeQuestion, setActiveQuestion] = useState("")
  const [latestSuccessfulRun, setLatestSuccessfulRun] = useState<SuccessfulQueryRun | null>(null)
  const [failedRun, setFailedRun] = useState<FailedQueryRun | null>(null)
  const questionId = useId()
  const resultRegionRef = useRef<HTMLDivElement | null>(null)
  const isRunning = phase === "running" || isPending
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

  const handleQuestionChange = (value: string) => {
    setForm((current) => ({ ...current, question: value }))
    if (questionError) {
      setQuestionError(null)
    }
  }

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

      <MarketQueryComposer
        question={form.question}
        questionId={questionId}
        questionError={questionError}
        isPending={isRunning}
        showExamples={phase === "idle"}
        onQuestionChange={handleQuestionChange}
        onExampleClick={handleExampleClick}
        onSubmit={handleSubmit}
      />

      {phase === "idle" ? (
        <Empty className="rounded-2xl border border-dashed border-border bg-muted/10 py-14">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <SearchCheck className="size-5 text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>Chưa có bản tổng hợp nào được hiển thị</EmptyTitle>
            <EmptyDescription>
              Sau khi chạy truy vấn, phần này sẽ hiển thị kết luận, tín hiệu tin cậy,
              bằng chứng và các sự kiện liên quan.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
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

          {phase === "running" ? <RunningResultPlaceholder /> : null}

          {phase === "success" && latestSuccessfulRun ? (
            <BriefingContent
              run={latestSuccessfulRun}
              canReadEvents={canReadEvents}
              canReadSourceDocuments={canReadSourceDocuments}
            />
          ) : null}

          {phase === "error" ? (
            latestSuccessfulRun ? (
              <PreviousSuccessfulBriefing
                run={latestSuccessfulRun}
                canReadEvents={canReadEvents}
                canReadSourceDocuments={canReadSourceDocuments}
              />
            ) : (
              <Empty className="rounded-2xl border border-dashed border-border bg-muted/10 py-14">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <TriangleAlert className="size-5 text-muted-foreground" />
                  </EmptyMedia>
                  <EmptyTitle>Chưa có bản tổng hợp thành công để tham chiếu</EmptyTitle>
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

function RunningResultPlaceholder() {
  return (
    <Empty className="rounded-2xl border border-dashed border-border bg-muted/10 py-14">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner className="size-5 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>Đang tổng hợp bản phân tích mới</EmptyTitle>
        <EmptyDescription>
          Bản tổng hợp cũ đã được tách khỏi trạng thái hiện tại. Kết quả mới sẽ xuất
          hiện tại đây ngay khi xử lý xong.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

function PreviousSuccessfulBriefing({
  run,
  canReadEvents,
  canReadSourceDocuments,
}: {
  run: SuccessfulQueryRun
  canReadEvents: boolean
  canReadSourceDocuments: boolean
}) {
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-2xl border border-border bg-muted/10 p-5">
        <div className="flex flex-col gap-4">
          <SectionHeading
            icon={Sparkles}
            title="Bản tổng hợp thành công gần nhất"
            description="Giữ lại để tham chiếu sau khi truy vấn mới thất bại."
          />
          <DetailValue label="Áp dụng cho câu hỏi" value={run.question} />
        </div>
      </section>

      <BriefingContent
        run={run}
        canReadEvents={canReadEvents}
        canReadSourceDocuments={canReadSourceDocuments}
      />
    </div>
  )
}
