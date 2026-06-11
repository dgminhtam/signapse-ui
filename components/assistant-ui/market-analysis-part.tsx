"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  RefreshCcwIcon,
  SparklesIcon,
  TriangleAlertIcon,
} from "lucide-react"

import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import { useLocalization } from "@/app/lib/i18n/provider"
import type { MarketAnalysisPartData } from "@/components/assistant-ui/market-conversation-runtime"
import type {
  AnalysisLoadState,
  MarketConversationAssistantController,
} from "@/components/assistant-ui/use-market-conversation-assistant"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"

interface MarketAnalysisPartProps {
  data: MarketAnalysisPartData
  labels: Dictionary["aiAssistant"]["analysis"]
  controller: MarketConversationAssistantController
}

export function MarketAnalysisPart({
  data,
  labels,
  controller,
}: MarketAnalysisPartProps) {
  const contentId = React.useId()
  const isExpanded = controller.expandedAnalysisIds.has(data.analysisId)
  const state =
    controller.analysisCache[data.analysisId] ??
    ({ status: "idle" } satisfies AnalysisLoadState)

  if (data.messageStatus !== "completed") {
    return (
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {data.messageStatus === "pending" ? (
          <Spinner />
        ) : (
          <TriangleAlertIcon className="size-3" aria-hidden="true" />
        )}
        <span>
          {data.messageStatus === "pending"
            ? labels.preparing
            : labels.unavailable}
        </span>
      </div>
    )
  }

  return (
    <Collapsible
      open={isExpanded}
      onOpenChange={(open) => {
        if (open !== isExpanded) {
          controller.toggleAnalysis(data.analysisId)
        }
      }}
      className="flex flex-col gap-2"
    >
      <Separator />
      <CollapsibleTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-between"
          aria-expanded={isExpanded}
          aria-controls={contentId}
          aria-label={
            isExpanded ? labels.hideDetails : labels.showDetails
          }
        >
          <span className="flex min-w-0 items-center gap-1.5">
            <SparklesIcon data-icon="inline-start" />
            <span>{labels.available}</span>
            {state.status === "loaded" &&
            typeof state.data.confidence === "number" ? (
              <ConfidenceBadge confidence={state.data.confidence} />
            ) : null}
          </span>
          {isExpanded ? (
            <ChevronUpIcon data-icon="inline-end" />
          ) : (
            <ChevronDownIcon data-icon="inline-end" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent id={contentId}>
        <AnalysisDetails
          analysisId={data.analysisId}
          labels={labels}
          state={state}
          onRetry={controller.retryAnalysis}
        />
      </CollapsibleContent>
    </Collapsible>
  )
}

function ConfidenceBadge({ confidence }: { confidence: number }) {
  const { formatPercent } = useLocalization()

  return <Badge variant="secondary">{formatPercent(confidence)}</Badge>
}

function AnalysisDetails({
  analysisId,
  labels,
  onRetry,
  state,
}: {
  analysisId: number
  labels: Dictionary["aiAssistant"]["analysis"]
  onRetry: (analysisId: number) => Promise<void>
  state: AnalysisLoadState
}) {
  const { formatPercent } = useLocalization()

  if (state.status === "idle" || state.status === "loading") {
    return (
      <p
        role="status"
        className="flex items-center gap-2 text-xs text-muted-foreground"
      >
        <Spinner />
        {labels.loading}
      </p>
    )
  }

  if (state.status === "error") {
    return (
      <div className="flex flex-col items-start gap-2 text-xs" role="alert">
        <p className="text-destructive">{state.error || labels.loadError}</p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => void onRetry(analysisId)}
        >
          <RefreshCcwIcon data-icon="inline-start" />
          {labels.retry}
        </Button>
      </div>
    )
  }

  const analysis = state.data

  if (analysis.status === "FAILED") {
    return (
      <p role="alert" className="text-xs text-destructive">
        {analysis.failureReason || labels.failed}
      </p>
    )
  }

  const eventSummaries = getObjectSummaries(
    analysis.keyEvents,
    labels.itemLabel
  )
  const narrativeSummaries = getObjectSummaries(
    analysis.keyNarratives,
    labels.itemLabel
  )

  return (
    <div className="flex flex-col gap-4 pt-1">
      <dl className="grid gap-3 sm:grid-cols-2">
        {typeof analysis.confidence === "number" ? (
          <AnalysisMetric
            label={labels.confidence}
            value={formatPercent(analysis.confidence)}
          />
        ) : null}
        <AnalysisMetric
          label={labels.model}
          value={
            [analysis.modelProvider, analysis.modelName]
              .filter(Boolean)
              .join(" / ") || labels.notAvailable
          }
        />
      </dl>

      <StringListSection
        title={labels.assets}
        items={analysis.assetsConsidered}
        badges
      />
      <StringListSection
        title={labels.limitations}
        items={analysis.limitations}
      />
      <ObjectListSection title={labels.keyEvents} items={eventSummaries} />
      <ObjectListSection
        title={labels.keyNarratives}
        items={narrativeSummaries}
      />
    </div>
  )
}

function AnalysisMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-1">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="truncate text-sm font-medium">{value}</dd>
    </div>
  )
}

function StringListSection({
  badges,
  items,
  title,
}: {
  badges?: boolean
  items: string[]
  title: string
}) {
  const values = items.map((item) => item.trim()).filter(Boolean)

  if (values.length === 0) {
    return null
  }

  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xs font-medium">{title}</h3>
      {badges ? (
        <div className="flex flex-wrap gap-1.5">
          {values.map((item) => (
            <Badge key={item} variant="secondary">
              {item}
            </Badge>
          ))}
        </div>
      ) : (
        <ul className="flex list-disc flex-col gap-1 ps-4 text-xs text-muted-foreground">
          {values.map((item, index) => (
            <li key={`${item}-${index}`}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  )
}

interface ObjectSummary {
  title: string
  description: string | null
}

function ObjectListSection({
  items,
  title,
}: {
  items: ObjectSummary[]
  title: string
}) {
  if (items.length === 0) {
    return null
  }

  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xs font-medium">{title}</h3>
      <ul className="flex flex-col gap-2">
        {items.map((item, index) => (
          <li key={`${item.title}-${index}`} className="min-w-0">
            <p className="truncate text-xs font-medium">{item.title}</p>
            {item.description ? (
              <p className="line-clamp-2 text-xs text-muted-foreground">
                {item.description}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  )
}

function getObjectSummaries(
  items: Record<string, unknown>[],
  itemLabel: string
): ObjectSummary[] {
  return items.map((item, index) => ({
    title:
      getStringField(item, ["title", "name", "eventTitle", "narrativeTitle"]) ||
      `${itemLabel} ${index + 1}`,
    description:
      getStringField(item, [
        "description",
        "summary",
        "thesis",
        "evidenceNote",
        "status",
      ]) || null,
  }))
}

function getStringField(
  item: Record<string, unknown>,
  keys: string[]
): string {
  for (const key of keys) {
    const value = item[key]

    if (typeof value === "string" && value.trim()) {
      return value.trim()
    }

    if (typeof value === "number") {
      return String(value)
    }
  }

  return ""
}
