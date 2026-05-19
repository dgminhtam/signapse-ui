import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Clock3,
  ExternalLink,
  FileText,
  GitBranch,
  Globe2,
  Hash,
  ImageIcon,
  RefreshCcw,
} from "lucide-react"
import { LocalizedLink as Link } from "@/components/localized-link"
import { notFound } from "next/navigation"
import { Suspense, type ElementType, type ReactNode } from "react"

import { getNewsArticleById } from "@/app/api/news-articles/action"
import { EVENT_READ_PERMISSIONS } from "@/app/lib/events/permissions"
import { AppLocale } from "@/app/lib/i18n/config"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import { formatMessage } from "@/app/lib/i18n/messages"
import {
  formatDateTime as formatLocalizedDateTime,
  formatPercent,
} from "@/app/lib/i18n/format"
import { getRequestLocale, getServerDictionary } from "@/app/lib/i18n/server"
import {
  NewsArticleResponse,
  getNewsArticleStatusVariant,
} from "@/app/lib/news-articles/definitions"
import { NEWS_ARTICLE_READ_PERMISSIONS } from "@/app/lib/news-articles/permissions"
import { hasAnyPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { AppTimeMetadata } from "@/components/app-time-metadata"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"

import { getEventStatusVariant } from "../../events/event-presentation"
import { NewsArticleDetailActions } from "../news-article-detail-actions"
import { NewsArticleDeriveEventButton } from "../news-article-derive-event-button"

interface PageProps {
  params: Promise<{ id: string }>
}

type ApiLikeError = Error & { status?: number }

function formatDateTime(
  value: string | undefined,
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
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
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

  return formatPercent(value <= 1 ? value : value / 100, locale, {
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

function isNotFoundError(error: unknown) {
  if (!(error instanceof Error)) {
    return false
  }

  if ((error as ApiLikeError).status === 404) {
    return true
  }

  return /(?:^|\b)(?:404|not[\s-]?found)(?:\b|$)/i.test(error.message)
}

function DetailCard({
  title,
  value,
  valueNode,
  icon: Icon,
}: {
  title: string
  value?: string
  valueNode?: ReactNode
  icon: ElementType
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      <div className="mt-2">
        {valueNode ?? (
          <p className="font-medium break-words text-foreground">{value}</p>
        )}
      </div>
    </div>
  )
}

function SectionHeading({
  title,
  icon: Icon,
}: {
  title: string
  icon: ElementType
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h2>
    </div>
  )
}

function SectionEmpty({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <Empty className="min-h-[220px] rounded-lg border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <GitBranch className="h-10 w-10 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export default async function NewsArticleDetailPage({ params }: PageProps) {
  const permissions = await getCurrentPermissions()
  const locale = await getRequestLocale()
  const dictionary = await getServerDictionary()

  if (!hasAnyPermission(permissions, NEWS_ARTICLE_READ_PERMISSIONS)) {
    return (
      <AccessDenied
        description={dictionary.newsArticles.detailDenied}
        permission={NEWS_ARTICLE_READ_PERMISSIONS[0]}
      />
    )
  }

  const { id } = await params
  const newsArticleId = Number(id)
  const canReadEvents = hasAnyPermission(permissions, EVENT_READ_PERMISSIONS)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/news-articles">
            <ArrowLeft data-icon="inline-start" />
            {dictionary.newsArticles.backToList}
          </Link>
        </Button>
      </div>

      <Suspense fallback={<NewsArticleDetailSkeleton />}>
        <FetchNewsArticleData
          id={newsArticleId}
          canReadEvents={canReadEvents}
          dictionary={dictionary}
          locale={locale}
        />
      </Suspense>
    </div>
  )
}

async function FetchNewsArticleData({
  id,
  canReadEvents,
  dictionary,
  locale,
}: {
  id: number
  canReadEvents: boolean
  dictionary: Dictionary
  locale: AppLocale
}) {
  let article: NewsArticleResponse

  try {
    article = await getNewsArticleById(id)
  } catch (error) {
    if (isNotFoundError(error)) {
      notFound()
    }

    throw error
  }

  const imageUrl = getImageUrl(article)
  const linkedEvents = article.linkedEvents ?? []
  const description = article.description?.trim()
  const content = article.content?.trim()

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={getNewsArticleStatusVariant(article.status)}>
                {dictionary.newsArticles.statusLabels[article.status]}
              </Badge>
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="text-2xl leading-tight font-semibold text-foreground">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Globe2 className="h-4 w-4" />
                  {article.newsOutletName?.trim() ||
                    dictionary.newsArticles.noOutlet}
                </span>
                <AppTimeMetadata icon={Calendar}>
                  {formatDateTime(article.publishedAt, locale, dictionary)}
                </AppTimeMetadata>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2 xl:justify-end">
            <NewsArticleDeriveEventButton id={article.id} />
            <NewsArticleDetailActions
              id={article.id}
              title={article.title}
              url={article.url}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {description || imageUrl ? (
          <div
            className={
              description && imageUrl
                ? "grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-stretch"
                : "grid gap-6"
            }
          >
            {description ? (
              <section className="flex h-full min-w-0 flex-col gap-3">
                <SectionHeading
                  title={dictionary.newsArticles.descriptionTitle}
                  icon={FileText}
                />
                <div className="min-h-[203px] flex-1 rounded-lg border border-border bg-muted/20 p-4">
                  <p className="text-sm leading-7 whitespace-pre-wrap text-foreground/90">
                    {description}
                  </p>
                </div>
              </section>
            ) : null}

            {imageUrl ? (
              <section className="flex h-full max-w-[360px] flex-col gap-3 xl:max-w-none">
                <SectionHeading
                  title={dictionary.newsArticles.imageTitle}
                  icon={ImageIcon}
                />
                <div className="aspect-video min-h-[203px] flex-1 overflow-hidden rounded-lg border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={article.featureImage?.altText?.trim() || article.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </section>
            ) : null}
          </div>
        ) : null}

        <section className="flex flex-col gap-4">
          <SectionHeading
            title={dictionary.newsArticles.linkedEventsTitle}
            icon={GitBranch}
          />

          {linkedEvents.length > 0 ? (
            <div className="flex flex-col gap-3">
              {linkedEvents.map((linkedEvent, index) => {
                const canOpenEvent =
                  canReadEvents && typeof linkedEvent.eventId === "number"

                return (
                  <div
                    key={`${linkedEvent.eventId ?? "linked-event"}-${index}`}
                    className="rounded-lg border border-border bg-muted/20 p-4"
                  >
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {linkedEvent.eventStatus ? (
                            <Badge
                              variant={getEventStatusVariant(
                                linkedEvent.eventStatus
                              )}
                            >
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

                        {canOpenEvent ? (
                          <Link
                            href={`/events/${linkedEvent.eventId}`}
                            className="font-medium text-foreground hover:underline"
                          >
                            {linkedEvent.eventTitle ||
                              formatMessage(dictionary.newsArticles.eventFallback, {
                                id: linkedEvent.eventId ?? "",
                              })}
                          </Link>
                        ) : (
                          <p className="font-medium text-foreground">
                            {linkedEvent.eventTitle ||
                              (typeof linkedEvent.eventId === "number"
                                ? formatMessage(
                                    dictionary.newsArticles.eventFallback,
                                    { id: linkedEvent.eventId }
                                  )
                                : dictionary.newsArticles.untitledEvent)}
                          </p>
                        )}

                        <p className="text-sm text-muted-foreground">
                          {formatMessage(
                            dictionary.newsArticles.evidenceConfidence,
                            {
                              value: formatConfidence(
                                linkedEvent.evidenceConfidence,
                                locale,
                                dictionary
                              ),
                            }
                          )}
                        </p>

                        {linkedEvent.evidenceNote?.trim() ? (
                          <p className="text-sm whitespace-pre-wrap text-foreground/90">
                            {linkedEvent.evidenceNote}
                          </p>
                        ) : null}
                      </div>

                      {canOpenEvent ? (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/events/${linkedEvent.eventId}`}>
                            <ExternalLink data-icon="inline-start" />
                            {dictionary.newsArticles.viewEvent}
                          </Link>
                        </Button>
                      ) : null}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <SectionEmpty
              title={dictionary.newsArticles.linkedEventsEmptyTitle}
              description={dictionary.newsArticles.linkedEventsEmptyDescription}
            />
          )}
        </section>

        <section className="flex flex-col gap-3">
          <SectionHeading
            title={dictionary.newsArticles.contentTitle}
            icon={FileText}
          />
          <div className="rounded-lg border border-border p-4">
            <div className="max-w-4xl text-sm leading-7 whitespace-pre-wrap text-foreground/90">
              {content || dictionary.newsArticles.contentEmpty}
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-dashed bg-muted/10">
          <details>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-2 tracking-wide uppercase">
                <Hash className="h-4 w-4" />
                {dictionary.newsArticles.technicalInfo}
              </span>
              <ChevronDown className="h-4 w-4" />
            </summary>
            <div className="grid gap-4 border-t border-border p-4 sm:grid-cols-2 xl:grid-cols-3">
              <DetailCard
                title={dictionary.newsArticles.sourceUrl}
                value={article.url || dictionary.common.notAvailable}
                icon={ExternalLink}
              />
              <DetailCard
                title={dictionary.newsArticles.createdAt}
                valueNode={
                  <AppTimeMetadata icon={Clock3}>
                    {formatDateTime(article.createdDate, locale, dictionary)}
                  </AppTimeMetadata>
                }
                icon={Clock3}
              />
              <DetailCard
                title={dictionary.newsArticles.updatedAt}
                valueNode={
                  <AppTimeMetadata icon={RefreshCcw}>
                    {formatDateTime(
                      article.lastModifiedDate,
                      locale,
                      dictionary
                    )}
                  </AppTimeMetadata>
                }
                icon={RefreshCcw}
              />
            </div>
          </details>
        </section>
      </div>
    </div>
  )
}

function NewsArticleDetailSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-2/3 min-w-[260px]" />
            <Skeleton className="h-4 w-1/2 min-w-[220px]" />
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="size-8" />
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-stretch">
          <div className="flex h-full min-w-0 flex-col gap-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="min-h-[203px] flex-1 rounded-lg" />
          </div>
          <div className="flex h-full flex-col gap-3">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="aspect-video min-h-[203px] flex-1 rounded-lg" />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-56 w-full max-w-4xl rounded-lg" />
        </div>
        <Skeleton className="h-14 w-full rounded-lg" />
      </div>
    </div>
  )
}
