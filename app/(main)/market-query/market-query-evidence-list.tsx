import { ExternalLink, FileText, GitBranch } from "lucide-react"
import Link from "next/link"

import {
  MARKET_QUERY_ARTIFACT_TYPE_LABELS,
  MARKET_QUERY_EVIDENCE_ROLE_LABELS,
  type MarketQueryEvidenceResponse,
} from "@/app/lib/market-query/definitions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  formatConfidence,
  formatDateTime,
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
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="border-b border-border bg-muted/15 p-5">
        <SectionHeading
          icon={FileText}
          title="Bằng chứng"
          description="Đọc phần này để kiểm chứng nhanh kết luận và mức độ tin cậy của bản tổng hợp."
        />
      </div>

      {evidence.length > 0 ? (
        <div className="divide-y divide-border">
          {evidence.map((item, index) => (
            <EvidenceRow
              key={`${item.artifactId ?? item.eventId ?? "evidence"}-${index}`}
              evidence={item}
              canReadEvents={canReadEvents}
              canReadSourceDocuments={canReadSourceDocuments}
            />
          ))}
        </div>
      ) : (
        <div className="p-5">
          <SectionEmpty
            title="Chưa có bằng chứng"
            description="Hệ thống chưa trả về bằng chứng chi tiết cho truy vấn này."
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
  const eventTitle = evidence.eventTitle?.trim()
  const sourceDocumentTitle = evidence.artifactTitle?.trim()
  const eventLabel =
    eventTitle ||
    (typeof evidence.eventId === "number" ? "Sự kiện chưa có tiêu đề" : "Chưa gắn sự kiện")
  const sourceDocumentLabel =
    sourceDocumentTitle ||
    (typeof evidence.artifactId === "number"
      ? "Tài liệu nguồn chưa có tiêu đề"
      : "Chưa có tài liệu nguồn")
  const eventMeta = !eventTitle ? formatEventFallbackMeta(evidence.eventId) : null
  const sourceDocumentMeta = !sourceDocumentTitle
    ? formatSourceDocumentFallbackMeta(evidence.artifactId)
    : null
  const hasBlockedEvent = typeof evidence.eventId === "number" && !canReadEvents
  const hasBlockedSourceDocument =
    typeof evidence.artifactId === "number" && !canReadSourceDocuments
  const traceabilityHint = formatTraceabilityHint(hasBlockedEvent, hasBlockedSourceDocument)

  return (
    <article className="grid gap-4 p-5 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-start">
      <div className="flex flex-col gap-4">
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
            Độ tin cậy {formatConfidence(evidence.evidenceConfidence)}
          </Badge>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <DetailValue label="Sự kiện" value={eventLabel} meta={eventMeta} />
          <DetailValue
            label="Tài liệu nguồn"
            value={sourceDocumentLabel}
            meta={sourceDocumentMeta}
          />
          <DetailValue
            label="Nguồn phát hành"
            value={evidence.newsOutletName?.trim() || "Chưa có"}
            valueClassName="text-muted-foreground"
          />
          <DetailValue
            label="Thời điểm xuất bản"
            value={formatDateTime(evidence.publishedAt)}
            valueClassName="text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex flex-col items-start gap-3 xl:items-end">
        <div className="flex flex-wrap items-center gap-2 xl:justify-end">
          {typeof evidence.eventId === "number" && canReadEvents ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/events/${evidence.eventId}`}>
                <GitBranch data-icon="inline-start" />
                Mở sự kiện
              </Link>
            </Button>
          ) : null}

          {typeof evidence.artifactId === "number" && canReadSourceDocuments ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={getSourceDocumentHref(evidence.artifactId)}>
                <FileText data-icon="inline-start" />
                Mở tài liệu nguồn
              </Link>
            </Button>
          ) : null}

          {evidence.artifactUrl ? (
            <Button variant="outline" size="sm" asChild>
              <a href={evidence.artifactUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink data-icon="inline-start" />
                Mở liên kết gốc
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
