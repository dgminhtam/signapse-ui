import { Layers3, Sparkles, TriangleAlert } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { useLocalization } from "@/app/lib/i18n/provider"

import {
  formatConfidence,
  getConfidenceVariant,
} from "./market-query-format"
import { EvidenceList } from "./market-query-evidence-list"
import { KeyEventsList } from "./market-query-key-events"
import { ReasoningPanel } from "./market-query-reasoning-panel"
import { SectionHeading } from "./market-query-section"
import type { SuccessfulQueryRun } from "./market-query-types"

export function BriefingContent({
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
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.75fr)]">
        <AnswerPanel answer={run.result.answer} />
        <TrustSignalsPanel
          confidence={run.result.confidence}
          limitations={limitations}
          assetsConsidered={assetsConsidered}
        />
      </div>

      <EvidenceList
        evidence={evidence}
        canReadEvents={canReadEvents}
        canReadSourceDocuments={canReadSourceDocuments}
      />

      <KeyEventsList keyEvents={keyEvents} canReadEvents={canReadEvents} />

      <ReasoningPanel reasoningChain={reasoningChain} />
    </div>
  )
}

function AnswerPanel({ answer }: { answer?: string }) {
  const { dictionary } = useLocalization()

  return (
    <section className="rounded-3xl border border-primary/20 bg-gradient-to-br from-background via-background to-muted/35 p-6 shadow-sm">
      <div className="flex flex-col gap-5">
        <SectionHeading
          icon={Sparkles}
          title={dictionary.marketQuery.answer.title}
          description={dictionary.marketQuery.answer.description}
        />

        <p className="whitespace-pre-wrap text-[15px] leading-8 text-foreground">
          {answer?.trim() || dictionary.marketQuery.answer.empty}
        </p>
      </div>
    </section>
  )
}

function TrustSignalsPanel({
  confidence,
  limitations,
  assetsConsidered,
}: {
  confidence?: number
  limitations: string[]
  assetsConsidered: string[]
}) {
  const { dictionary, formatPercent } = useLocalization()

  return (
    <aside className="rounded-2xl bg-muted/20 p-5">
      <div className="flex flex-col gap-5">
        <SectionHeading
          icon={Layers3}
          title={dictionary.marketQuery.trust.title}
          description={dictionary.marketQuery.trust.description}
        />

        <div className="flex flex-col divide-y divide-border/70">
          <div className="flex flex-col gap-3 py-4 first:pt-0">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {dictionary.marketQuery.trust.confidenceLabel}
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant={getConfidenceVariant(confidence)}>
                {formatConfidence(confidence, dictionary, formatPercent)}
              </Badge>
              <span className="text-sm leading-6 text-muted-foreground">
                {dictionary.marketQuery.trust.confidenceDescription}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3 py-4">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              <TriangleAlert className="size-4" />
              {dictionary.marketQuery.trust.limitationsLabel}
            </div>

            {limitations.length > 0 ? (
              <ul className="flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
                {limitations.map((limitation, index) => (
                  <li
                    key={`${limitation}-${index}`}
                    className="rounded-lg bg-background/65 px-3 py-2"
                  >
                    {limitation}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                {dictionary.marketQuery.trust.limitationsEmpty}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
              {dictionary.marketQuery.trust.assetsLabel}
            </span>
            {assetsConsidered.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {assetsConsidered.map((asset) => (
                  <Badge key={asset} variant="secondary">
                    {asset}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {dictionary.marketQuery.trust.assetsEmpty}
              </p>
            )}
          </div>
        </div>
      </div>
    </aside>
  )
}
