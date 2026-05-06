import { Calendar, ExternalLink, FileText, GitBranch, Layers3 } from "lucide-react"
import Link from "next/link"

import {
  ARTIFACT_TYPE_LABELS,
  isNewsArticleArtifact,
} from "@/app/lib/artifacts/definitions"
import {
  EVENT_ASSET_RELATION_LABELS,
  EVENT_ASSET_TYPE_LABELS,
  EVENT_EVIDENCE_ROLE_LABELS,
  EventResponse,
} from "@/app/lib/events/definitions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  getEventStatusLabel,
  getEventStatusVariant,
} from "./event-presentation"

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
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

function formatConfidence(value?: number) {
  if (typeof value !== "number") {
    return "Chưa có"
  }

  const normalizedValue = value <= 1 ? value * 100 : value

  return `${Math.round(normalizedValue)}%`
}

function QuickFact({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="rounded-lg border bg-muted/20 p-3">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium text-foreground">{value}</dd>
    </div>
  )
}

export function EventQuickDetailContent({
  canReadNewsArticles,
  event,
}: {
  canReadNewsArticles: boolean
  event: EventResponse
}) {
  const evidenceItems = event.evidence ?? []
  const assets = event.assets ?? []
  const primaryAssets = assets.slice(0, 4)

  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={getEventStatusVariant(event.status)}>
            {getEventStatusLabel(event.status)}
          </Badge>
        </div>

        <p className="text-sm leading-6 text-muted-foreground">
          {event.description?.trim() || "Sự kiện này chưa có mô tả chi tiết."}
        </p>
      </section>

      <dl className="grid gap-3 sm:grid-cols-3">
        <QuickFact label="Độ tin cậy" value={formatConfidence(event.confidence)} />
        <QuickFact label="Xảy ra lúc" value={formatDateTime(event.occurredAt)} />
        <QuickFact label="Xác nhận lúc" value={formatDateTime(event.confirmedAt)} />
      </dl>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <GitBranch className="size-4 text-muted-foreground" />
          Bằng chứng chính
        </div>

        {evidenceItems.length ? (
          <div className="flex flex-col gap-3">
            {evidenceItems.slice(0, 4).map((evidence, index) => (
              <article
                key={`${evidence.artifactId ?? "evidence"}-${index}`}
                className="rounded-lg border bg-background p-3"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {evidence.artifactType ? (
                    <Badge variant="outline">
                      {ARTIFACT_TYPE_LABELS[evidence.artifactType]}
                    </Badge>
                  ) : null}
                  {evidence.evidenceRole ? (
                    <Badge variant="secondary">
                      {EVENT_EVIDENCE_ROLE_LABELS[evidence.evidenceRole]}
                    </Badge>
                  ) : null}
                  <Badge variant="outline">
                    Tin cậy {formatConfidence(evidence.confidence)}
                  </Badge>
                </div>

                <h3 className="mt-2 line-clamp-2 text-sm font-medium">
                  {evidence.artifactTitle || "Bằng chứng chưa có tiêu đề"}
                </h3>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                  <span>{evidence.newsOutletName || "Chưa có nguồn tin"}</span>
                  <span>{formatDateTime(evidence.publishedAt)}</span>
                </div>
                {evidence.evidenceNote?.trim() ? (
                  <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {evidence.evidenceNote}
                  </p>
                ) : null}

                <div className="mt-3 flex flex-wrap gap-2">
                  {typeof evidence.artifactId === "number" &&
                  isNewsArticleArtifact(evidence.artifactType) &&
                  canReadNewsArticles ? (
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/news-articles/${evidence.artifactId}`}>
                        <FileText aria-hidden="true" data-icon="inline-start" />
                        Xem bài viết
                      </Link>
                    </Button>
                  ) : null}
                  {evidence.artifactUrl ? (
                    <Button asChild size="sm" variant="outline">
                      <a
                        href={evidence.artifactUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink aria-hidden="true" data-icon="inline-start" />
                        Mở nguồn gốc
                      </a>
                    </Button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            Sự kiện này chưa có bằng chứng trong dữ liệu hiện tại.
          </div>
        )}
      </section>

      {primaryAssets.length ? (
        <section className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Layers3 className="size-4 text-muted-foreground" />
            Tài sản liên quan
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {primaryAssets.map((asset, index) => (
              <div
                key={`${asset.assetId ?? "asset"}-${index}`}
                className="rounded-lg border bg-muted/20 p-3"
              >
                <div className="flex flex-wrap gap-2">
                  {asset.assetType ? (
                    <Badge variant="outline">
                      {EVENT_ASSET_TYPE_LABELS[asset.assetType]}
                    </Badge>
                  ) : null}
                  {asset.relationType ? (
                    <Badge variant="secondary">
                      {EVENT_ASSET_RELATION_LABELS[asset.relationType]}
                    </Badge>
                  ) : null}
                </div>
                <div className="mt-2 text-sm font-medium">
                  {asset.assetSymbol || asset.assetName || "Tài sản chưa có tên"}
                </div>
                {asset.assetName ? (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {asset.assetName}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="flex items-center gap-2 rounded-lg border bg-muted/20 p-3 text-xs text-muted-foreground">
        <Calendar className="size-4 shrink-0" />
        Cập nhật lần cuối: {formatDateTime(event.lastModifiedDate)}
      </section>
    </div>
  )
}
