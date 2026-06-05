import { Calendar, ExternalLink, FileText, GitBranch } from "lucide-react"
import { LocalizedLink as Link } from "@/components/localized-link"

import {
  getMarketQueryArtifactTypeLabels,
  getMarketQueryEvidenceRoleLabels,
  type MarketQueryEvidenceResponse,
} from "@/app/lib/market-query/definitions"
import { useLocalization } from "@/app/lib/i18n/provider"
import { AppTimeMetadata } from "@/components/app-time-metadata"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  formatConfidence,
  formatMarketQueryDateTime,
  formatEventFallbackMeta,
  formatSourceDocumentFallbackMeta,
  formatTraceabilityHint,
  getConfidenceVariant,
  getSourceDocumentHref,
} from "./market-query-format"
import { DetailValue, SectionEmpty, SectionHeading } from "./market-query-section"

export function EvidenceList({
  evidence,
  canReadEvents,
  canReadSourceDocuments,
}: {
  evidence: MarketQueryEvidenceResponse[]
  canReadEvents: boolean
  canReadSourceDocuments: boolean
}) {
  const { dictionary } = useLocalization()

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="border-b border-border bg-muted/15 p-5">
        <SectionHeading
          icon={FileText}
          title={dictionary.marketQuery.evidence.title}
          description={dictionary.marketQuery.evidence.description}
        />
      </div>

      {evidence.length > 0 ? (
        <div className="divide-y divide-border">
          {evidence.map((item, index) => (
            <EvidenceRow
              key={`${item.newsArticleId ?? item.eventId ?? "evidence"}-${index}`}
              evidence={item}
              canReadEvents={canReadEvents}
              canReadSourceDocuments={canReadSourceDocuments}
            />
          ))}
        </div>
      ) : (
        <div className="p-5">
          <SectionEmpty
            title={dictionary.marketQuery.evidence.emptyTitle}
            description={dictionary.marketQuery.evidence.emptyDescription}
          />
        </div>
      )}
    </section>
  )
}

function EvidenceRow({
  evidence,
  canReadEvents,
  canReadSourceDocuments,
}: {
  evidence: MarketQueryEvidenceResponse
  canReadEvents: boolean
  canReadSourceDocuments: boolean
}) {
  const {
    dictionary,
    formatDateTime,
    formatMessage,
    formatPercent,
  } = useLocalization()
  const artifactTypeLabels = getMarketQueryArtifactTypeLabels(dictionary)
  const evidenceRoleLabels = getMarketQueryEvidenceRoleLabels(dictionary)
  const eventTitle = evidence.eventTitle?.trim()
  const sourceDocumentTitle = evidence.newsArticleTitle?.trim()
  const eventLabel =
    eventTitle ||
    (typeof evidence.eventId === "number"
      ? dictionary.marketQuery.evidence.eventUntitled
      : dictionary.marketQuery.evidence.eventMissing)
  const sourceDocumentLabel =
    sourceDocumentTitle ||
    (typeof evidence.newsArticleId === "number"
      ? dictionary.marketQuery.evidence.sourceDocumentUntitled
      : dictionary.marketQuery.evidence.sourceDocumentMissing)
  const eventMeta = !eventTitle
    ? formatEventFallbackMeta(evidence.eventId, dictionary)
    : null
  const sourceDocumentMeta = !sourceDocumentTitle
    ? formatSourceDocumentFallbackMeta(evidence.newsArticleId, dictionary)
    : null
  const hasBlockedEvent = typeof evidence.eventId === "number" && !canReadEvents
  const hasBlockedSourceDocument =
    typeof evidence.newsArticleId === "number" && !canReadSourceDocuments
  const traceabilityHint = formatTraceabilityHint(
    hasBlockedEvent,
    hasBlockedSourceDocument,
    dictionary
  )

  return (
    <article className="grid gap-4 p-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {evidence.artifactType ? (
            <Badge variant="outline">
              {artifactTypeLabels[evidence.artifactType]}
            </Badge>
          ) : null}
          {evidence.evidenceRole ? (
            <Badge variant="secondary">
              {evidenceRoleLabels[evidence.evidenceRole]}
            </Badge>
          ) : null}
          <Badge variant={getConfidenceVariant(evidence.evidenceConfidence)}>
            {formatMessage(dictionary.marketQuery.evidence.confidenceBadge, {
              value: formatConfidence(
                evidence.evidenceConfidence,
                dictionary,
                formatPercent
              ),
            })}
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <DetailValue
            label={dictionary.marketQuery.evidence.eventLabel}
            value={eventLabel}
            meta={eventMeta}
          />
          <DetailValue
            label={dictionary.marketQuery.evidence.sourceDocumentLabel}
            value={sourceDocumentLabel}
            meta={sourceDocumentMeta}
          />
          <DetailValue
            label={dictionary.marketQuery.evidence.outletLabel}
            value={
              evidence.newsOutletName?.trim() ||
              dictionary.marketQuery.evidence.outletMissing
            }
            valueClassName="text-muted-foreground"
          />
          <DetailValue
            label={dictionary.marketQuery.evidence.publishedAtLabel}
            valueNode={
              <AppTimeMetadata icon={Calendar}>
                {formatMarketQueryDateTime(
                  evidence.publishedAt,
                  formatDateTime,
                  dictionary
                )}
              </AppTimeMetadata>
            }
          />
        </div>
      </div>

      <div className="flex flex-col items-start gap-3 xl:items-end">
        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
          {typeof evidence.eventId === "number" && canReadEvents ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/events/${evidence.eventId}`}>
                <GitBranch data-icon="inline-start" />
                {dictionary.marketQuery.evidence.openEvent}
              </Link>
            </Button>
          ) : null}

          {typeof evidence.newsArticleId === "number" && canReadSourceDocuments ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={getSourceDocumentHref(evidence.newsArticleId)}>
                <FileText data-icon="inline-start" />
                {dictionary.marketQuery.evidence.openSourceDocument}
              </Link>
            </Button>
          ) : null}

          {evidence.newsArticleUrl ? (
            <Button variant="outline" size="sm" asChild>
              <a href={evidence.newsArticleUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink data-icon="inline-start" />
                {dictionary.marketQuery.evidence.openOriginalLink}
              </a>
            </Button>
          ) : null}
        </div>

        {traceabilityHint ? (
          <p className="max-w-sm text-sm leading-6 text-muted-foreground xl:text-right">
            {traceabilityHint}
          </p>
        ) : null}
      </div>
    </article>
  )
}
