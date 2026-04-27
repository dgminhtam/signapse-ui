import type { MarketQueryResponse } from "@/app/lib/market-query/definitions"
import { Badge } from "@/components/ui/badge"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

import { formatConfidence, getConfidenceVariant } from "./market-query-format"
import { DetailValue } from "./market-query-section"
import type { QueryPhase } from "./market-query-types"

export function QueryStateCard({
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
      : "Đây là câu hỏi mà bản tổng hợp hiện tại đang trả lời."
  const evidenceCount = result?.evidence?.length ?? 0
  const keyEventCount = result?.keyEvents?.length ?? 0

  return (
    <section
      className={cn(
        "rounded-2xl border p-5",
        isError
          ? "border-destructive/30 bg-destructive/5"
          : isRunning
            ? "border-border bg-primary/5"
            : "border-border bg-muted/10"
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
            <div className="rounded-xl border border-destructive/20 bg-background/80 p-4 text-sm leading-6 text-destructive">
              {error}
            </div>
          ) : null}

          {isError && hasPreviousSuccess ? (
            <p className="text-sm leading-6 text-muted-foreground">
              Bản tổng hợp thành công gần nhất được giữ lại bên dưới để tham chiếu, không phải
              câu trả lời cho truy vấn vừa lỗi.
            </p>
          ) : null}
        </div>

        {phase === "success" && result ? (
          <div className="flex flex-wrap gap-2 lg:justify-end">
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
