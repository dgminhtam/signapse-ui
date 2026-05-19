import type { MarketQueryResponse } from "@/app/lib/market-query/definitions"
import { useLocalization } from "@/app/lib/i18n/provider"
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
  const {
    dictionary,
    formatMessage,
    formatNumber,
    formatPercent,
  } = useLocalization()
  const isRunning = phase === "running"
  const isError = phase === "error"
  const badgeVariant = isError ? "destructive" : isRunning ? "outline" : "default"
  const statusLabel = isRunning
    ? dictionary.marketQuery.state.analyzing
    : isError
      ? dictionary.marketQuery.state.failed
      : dictionary.marketQuery.state.currentResult
  const description = isRunning
    ? dictionary.marketQuery.state.runningDescription
    : isError
      ? dictionary.marketQuery.state.errorDescription
      : dictionary.marketQuery.state.successDescription
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
                {dictionary.marketQuery.state.runningIndicator}
              </span>
            ) : null}
          </div>

          <DetailValue
            label={dictionary.marketQuery.state.questionLabel}
            value={question}
          />
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>

          {isError && error ? (
            <div className="rounded-xl border border-destructive/20 bg-background/80 p-4 text-sm leading-6 text-destructive">
              {error}
            </div>
          ) : null}

          {isError && hasPreviousSuccess ? (
            <p className="text-sm leading-6 text-muted-foreground">
              {dictionary.marketQuery.state.previousRetained}
            </p>
          ) : null}
        </div>

        {phase === "success" && result ? (
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <Badge variant={getConfidenceVariant(result.confidence)}>
              {formatMessage(dictionary.marketQuery.state.confidenceBadge, {
                value: formatConfidence(result.confidence, dictionary, formatPercent),
              })}
            </Badge>
            <Badge variant="outline">
              {formatMessage(dictionary.marketQuery.state.evidenceBadge, {
                count: formatNumber(evidenceCount),
              })}
            </Badge>
            <Badge variant="outline">
              {formatMessage(dictionary.marketQuery.state.keyEventsBadge, {
                count: formatNumber(keyEventCount),
              })}
            </Badge>
          </div>
        ) : null}
      </div>
    </section>
  )
}
