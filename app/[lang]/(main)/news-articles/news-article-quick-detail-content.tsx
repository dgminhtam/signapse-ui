import { Calendar, ExternalLink, FileText, GitBranch, Globe2 } from "lucide-react"
import { LocalizedLink as Link } from "@/components/localized-link"

import { AppLocale } from "@/app/lib/i18n/config"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import { formatMessage } from "@/app/lib/i18n/messages"
import {
  formatDateTime as formatLocalizedDateTime,
  formatPercent,
} from "@/app/lib/i18n/format"
import {
  NewsArticleResponse,
  getNewsArticleStatusVariant,
} from "@/app/lib/news-articles/definitions"
import { AppTimeMetadata } from "@/components/app-time-metadata"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { getEventStatusVariant } from "../events/event-presentation"

function formatDateTime(
  value: string | null | undefined,
  locale: AppLocale,
  dictionary: Dictionary
) {
  if (!value) {
    return dictionary.common.notAvailable
  }

  return formatLocalizedDateTime(
    value,
    locale,
    {
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      month: "2-digit",
      year: "numeric",
    },
    dictionary.common.notAvailable
  )
}

function formatConfidence(
  value: number | undefined,
  locale: AppLocale,
  dictionary: Dictionary
) {
  if (typeof value !== "number") {
    return dictionary.newsArticles.noConfidence
  }

  const normalizedValue = value <= 1 ? value : value / 100

  return formatPercent(normalizedValue, locale, {
    maximumFractionDigits: 0,
  })
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
  dictionary,
  locale,
}: {
  article: NewsArticleResponse
  canReadEvents: boolean
  dictionary: Dictionary
  locale: AppLocale
}) {
  const linkedEvents = article.linkedEvents ?? []
  const imageUrl = getImageUrl(article)

  return (
    <div className="flex flex-col gap-5">
      <section className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={getNewsArticleStatusVariant(article.status)}>
            {dictionary.newsArticles.statusLabels[article.status]}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Globe2 className="size-4" />
            {article.newsOutletName?.trim() || dictionary.newsArticles.noOutlet}
          </span>
          <AppTimeMetadata icon={Calendar}>
            {formatDateTime(article.publishedAt, locale, dictionary)}
          </AppTimeMetadata>
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
          {dictionary.newsArticles.contentTitle}
        </div>
        <div className="rounded-lg border bg-background p-3">
          <p className="line-clamp-[14] whitespace-pre-wrap text-sm leading-7 text-foreground/90">
            {article.content?.trim() || dictionary.newsArticles.quickContentEmpty}
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <GitBranch className="size-4 text-muted-foreground" />
          {dictionary.newsArticles.linkedEventsTitle}
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
                        {dictionary.events.statusLabels[linkedEvent.eventStatus]}
                      </Badge>
                    ) : null}
                    {linkedEvent.evidenceRole ? (
                      <Badge variant="secondary">
                        {
                          dictionary.newsArticles.evidenceRoleLabels[
                            linkedEvent.evidenceRole
                          ]
                        }
                      </Badge>
                    ) : null}
                  </div>

                  <h3 className="mt-2 line-clamp-2 text-sm font-medium">
                    {linkedEvent.eventTitle ||
                      (typeof linkedEvent.eventId === "number"
                        ? formatMessage(dictionary.newsArticles.eventFallback, {
                            id: linkedEvent.eventId,
                          })
                        : dictionary.newsArticles.untitledEvent)}
                  </h3>
                  <div className="mt-1 text-xs text-muted-foreground">
                    {formatMessage(dictionary.newsArticles.evidenceConfidence, {
                      value: formatConfidence(
                        linkedEvent.evidenceConfidence,
                        locale,
                        dictionary
                      ),
                    })}
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
                        {dictionary.newsArticles.viewEvent}
                      </Link>
                    </Button>
                  ) : null}
                </article>
              )
            })}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
            {dictionary.newsArticles.linkedEventsEmptyDescription}
          </div>
        )}
      </section>

      <section className="flex flex-wrap gap-2">
        <Button asChild size="sm" variant="outline">
          <a href={article.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink aria-hidden="true" data-icon="inline-start" />
            {dictionary.newsArticles.openOriginal}
          </a>
        </Button>
      </section>
    </div>
  )
}
