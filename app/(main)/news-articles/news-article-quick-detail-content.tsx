import { Calendar, ExternalLink, FileText, GitBranch, Globe2 } from "lucide-react"
import Link from "next/link"

import { EVENT_STATUS_LABELS } from "@/app/lib/events/definitions"
import {
  LINKED_EVENT_EVIDENCE_ROLE_LABELS,
  NEWS_ARTICLE_STATUS_LABELS,
  NewsArticleResponse,
  getNewsArticleStatusVariant,
} from "@/app/lib/news-articles/definitions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { getEventStatusVariant } from "../events/event-presentation"

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

function getImageUrl(article: NewsArticleResponse) {
  return (
    article.featureImage?.urlMedium ||
    article.featureImage?.urlLarge ||
    article.featureImage?.urlOriginal
  )
}

export function NewsArticleQuickDetailContent({
  article,
  canReadEvents,
}: {
  article: NewsArticleResponse
  canReadEvents: boolean
}) {
  const linkedEvents = article.linkedEvents ?? []
  const imageUrl = getImageUrl(article)

  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={getNewsArticleStatusVariant(article.status)}>
            {NEWS_ARTICLE_STATUS_LABELS[article.status]}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Globe2 className="size-4" />
            {article.newsOutletName?.trim() || "Chưa có nguồn tin"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-4" />
            {formatDateTime(article.publishedAt)}
          </span>
        </div>

        {article.description?.trim() ? (
          <p className="text-sm leading-6 text-muted-foreground">
            {article.description}
          </p>
        ) : null}
      </section>

      {imageUrl ? (
        <div className="overflow-hidden rounded-lg border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={article.featureImage?.altText?.trim() || article.title}
            className="aspect-video max-h-56 w-full object-cover"
          />
        </div>
      ) : null}

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <FileText className="size-4 text-muted-foreground" />
          Nội dung
        </div>
        <div className="rounded-lg border bg-background p-3">
          <p className="line-clamp-[14] whitespace-pre-wrap text-sm leading-7 text-foreground/90">
            {article.content?.trim() || "Bài viết này chưa có nội dung chi tiết."}
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <GitBranch className="size-4 text-muted-foreground" />
          Sự kiện liên kết
        </div>

        {linkedEvents.length ? (
          <div className="flex flex-col gap-3">
            {linkedEvents.slice(0, 4).map((linkedEvent, index) => {
              const canOpenEvent =
                canReadEvents && typeof linkedEvent.eventId === "number"

              return (
                <article
                  key={`${linkedEvent.eventId ?? "linked-event"}-${index}`}
                  className="rounded-lg border bg-muted/20 p-3"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {linkedEvent.eventStatus ? (
                      <Badge variant={getEventStatusVariant(linkedEvent.eventStatus)}>
                        {EVENT_STATUS_LABELS[linkedEvent.eventStatus]}
                      </Badge>
                    ) : null}
                    {linkedEvent.evidenceRole ? (
                      <Badge variant="secondary">
                        {LINKED_EVENT_EVIDENCE_ROLE_LABELS[linkedEvent.evidenceRole]}
                      </Badge>
                    ) : null}
                  </div>

                  <h3 className="mt-2 line-clamp-2 text-sm font-medium">
                    {linkedEvent.eventTitle ||
                      (typeof linkedEvent.eventId === "number"
                        ? `Sự kiện #${linkedEvent.eventId}`
                        : "Sự kiện chưa có tiêu đề")}
                  </h3>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Độ tin cậy bằng chứng:{" "}
                    {formatConfidence(linkedEvent.evidenceConfidence)}
                  </div>
                  {linkedEvent.evidenceNote?.trim() ? (
                    <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                      {linkedEvent.evidenceNote}
                    </p>
                  ) : null}

                  {canOpenEvent ? (
                    <Button asChild size="sm" variant="outline" className="mt-3">
                      <Link href={`/events/${linkedEvent.eventId}`}>
                        <ExternalLink aria-hidden="true" data-icon="inline-start" />
                        Xem sự kiện
                      </Link>
                    </Button>
                  ) : null}
                </article>
              )
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            Bài viết này chưa có sự kiện liên kết trong dữ liệu hiện tại.
          </div>
        )}
      </section>

      <section className="flex flex-wrap gap-2">
        <Button asChild size="sm" variant="outline">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink aria-hidden="true" data-icon="inline-start" />
            Mở nguồn gốc
          </a>
        </Button>
      </section>
    </div>
  )
}
