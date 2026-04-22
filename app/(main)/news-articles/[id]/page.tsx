import { format } from "date-fns"
import {
  ArrowLeft,
  Calendar,
  Clock3,
  ExternalLink,
  FileText,
  GitBranch,
  Globe2,
  Hash,
  Link2,
  Layers3,
  RefreshCcw,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"

import { getNewsArticleById } from "@/app/api/news-articles/action"
import {
  EVENT_ENRICHMENT_STATUS_LABELS,
  EVENT_STATUS_LABELS,
} from "@/app/lib/events/definitions"
import { EVENT_READ_PERMISSIONS } from "@/app/lib/events/permissions"
import {
  LINKED_EVENT_EVIDENCE_ROLE_LABELS,
  NEWS_ARTICLE_STATUS_LABELS,
  NewsArticleResponse,
  getNewsArticleStatusVariant,
} from "@/app/lib/news-articles/definitions"
import { NEWS_ARTICLE_READ_PERMISSIONS } from "@/app/lib/news-articles/permissions"
import { hasAnyPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

import { getEventEnrichmentVariant, getEventStatusVariant } from "../../events/event-presentation"
import { NewsArticleAnalyzeButton } from "../news-article-analyze-button"
import { NewsArticleCrawlButton } from "../news-article-crawl-button"
import { NewsArticleDeleteButton } from "../news-article-delete-button"
import { NewsArticleDeriveEventButton } from "../news-article-derive-event-button"

interface PageProps {
  params: Promise<{ id: string }>
}

type ApiLikeError = Error & { status?: number }

function formatDateTime(value?: string) {
  if (!value) {
    return "Chua co"
  }

  return format(new Date(value), "dd/MM/yyyy HH:mm")
}

function formatConfidence(value?: number) {
  if (typeof value !== "number") {
    return "Chua co"
  }

  return `${Math.round(value * 100)}%`
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
  icon: Icon,
}: {
  title: string
  value: string
  icon: React.ElementType
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      <p className="mt-2 break-words font-medium text-foreground">{value}</p>
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

  if (!hasAnyPermission(permissions, NEWS_ARTICLE_READ_PERMISSIONS)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chi tiet bai viet tin tuc</CardTitle>
          <CardDescription>
            Xem noi dung da ingest, metadata bai viet, va cac lien ket su kien lien quan.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <AccessDenied
            description="Ban khong co quyen xem chi tiet bai viet tin tuc."
            permission={NEWS_ARTICLE_READ_PERMISSIONS[0]}
          />
        </CardContent>
      </Card>
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
            <ArrowLeft className="mr-2 h-4 w-4" data-icon="inline-start" />
            Quay lai danh sach
          </Link>
        </Button>
      </div>

      <Card>
        <Suspense fallback={<NewsArticleDetailSkeleton />}>
          <FetchNewsArticleData id={newsArticleId} canReadEvents={canReadEvents} />
        </Suspense>
      </Card>
    </div>
  )
}

async function FetchNewsArticleData({
  id,
  canReadEvents,
}: {
  id: number
  canReadEvents: boolean
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

  return (
    <>
      <CardHeader>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={getNewsArticleStatusVariant(article.status)}>
                {NEWS_ARTICLE_STATUS_LABELS[article.status]}
              </Badge>
            </div>

            <div className="flex flex-col gap-1">
              <CardTitle className="text-2xl">{article.title}</CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <Globe2 className="h-4 w-4" />
                  {article.newsOutletName?.trim() || "Chua co nguon tin"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDateTime(article.publishedAt)}
                </span>
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <NewsArticleAnalyzeButton id={article.id} variant="outline" size="sm" showText />
            <NewsArticleCrawlButton id={article.id} />
            <NewsArticleDeriveEventButton id={article.id} />
            <Button variant="outline" size="sm" asChild>
              <a href={article.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" data-icon="inline-start" />
                Mo lien ket goc
              </a>
            </Button>
            <NewsArticleDeleteButton
              id={article.id}
              title={article.title}
              variant="outline"
              size="sm"
              showText
              redirectToListOnSuccess
            />
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <div className="flex flex-col gap-8">
          {imageUrl ? (
            <div className="overflow-hidden rounded-lg border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={article.featureImage?.altText || article.title}
                className="aspect-video w-full object-cover"
              />
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
            <DetailCard title="Ma bai viet" value={String(article.id)} icon={Hash} />
            <DetailCard
              title="Nguon tin"
              value={article.newsOutletName?.trim() || "Chua co"}
              icon={Globe2}
            />
            <DetailCard
              title="Xuat ban"
              value={formatDateTime(article.publishedAt)}
              icon={Calendar}
            />
            <DetailCard
              title="Trang thai"
              value={NEWS_ARTICLE_STATUS_LABELS[article.status]}
              icon={Layers3}
            />
            <DetailCard title="Tao luc" value={formatDateTime(article.createdDate)} icon={Clock3} />
            <DetailCard
              title="Cap nhat"
              value={formatDateTime(article.lastModifiedDate)}
              icon={RefreshCcw}
            />
          </div>

          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Metadata he thong
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <DetailCard
                title="External Key"
                value={article.externalKey || "Chua co"}
                icon={Link2}
              />
              <DetailCard
                title="News Outlet ID"
                value={typeof article.newsOutletId === "number" ? String(article.newsOutletId) : "Chua co"}
                icon={Hash}
              />
              <DetailCard
                title="Lien ket goc"
                value={article.url || "Chua co"}
                icon={ExternalLink}
              />
            </div>
          </section>

          {article.description?.trim() ? (
            <section className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Mo ta
                </h2>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <p className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">
                  {article.description}
                </p>
              </div>
            </section>
          ) : null}

          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Noi dung
              </h2>
            </div>
            <div className="rounded-lg border border-border p-4">
              <div className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">
                {article.content?.trim() || "Chua co noi dung chi tiet."}
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Su kien lien ket
              </h2>
            </div>

            {linkedEvents.length > 0 ? (
              <div className="flex flex-col gap-3">
                {linkedEvents.map((linkedEvent, index) => {
                  const canOpenEvent = canReadEvents && typeof linkedEvent.eventId === "number"

                  return (
                    <div
                      key={`${linkedEvent.eventId ?? "linked-event"}-${index}`}
                      className="rounded-lg border border-border bg-muted/20 p-4"
                    >
                      <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            {linkedEvent.eventStatus ? (
                              <Badge variant={getEventStatusVariant(linkedEvent.eventStatus)}>
                                {EVENT_STATUS_LABELS[linkedEvent.eventStatus]}
                              </Badge>
                            ) : null}
                            {linkedEvent.eventEnrichmentStatus ? (
                              <Badge
                                variant={getEventEnrichmentVariant(linkedEvent.eventEnrichmentStatus)}
                              >
                                {
                                  EVENT_ENRICHMENT_STATUS_LABELS[
                                    linkedEvent.eventEnrichmentStatus
                                  ]
                                }
                              </Badge>
                            ) : null}
                            {linkedEvent.evidenceRole ? (
                              <Badge variant="secondary">
                                {LINKED_EVENT_EVIDENCE_ROLE_LABELS[linkedEvent.evidenceRole]}
                              </Badge>
                            ) : null}
                          </div>

                          {canOpenEvent ? (
                            <Link
                              href={`/events/${linkedEvent.eventId}`}
                              className="font-medium text-foreground hover:underline"
                            >
                              {linkedEvent.eventTitle || `Su kien #${linkedEvent.eventId}`}
                            </Link>
                          ) : (
                            <p className="font-medium text-foreground">
                              {linkedEvent.eventTitle ||
                                (typeof linkedEvent.eventId === "number"
                                  ? `Su kien #${linkedEvent.eventId}`
                                  : "Su kien chua co tieu de")}
                            </p>
                          )}

                          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                            <span>
                              Khoa chuan: {linkedEvent.eventCanonicalKey || "Chua co"}
                            </span>
                            <span>
                              Do tin cay bang chung:{" "}
                              {formatConfidence(linkedEvent.evidenceConfidence)}
                            </span>
                          </div>

                          {linkedEvent.evidenceNote?.trim() ? (
                            <p className="whitespace-pre-wrap text-sm text-foreground/90">
                              {linkedEvent.evidenceNote}
                            </p>
                          ) : null}
                        </div>

                        {canOpenEvent ? (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/events/${linkedEvent.eventId}`}>
                              <ExternalLink className="h-4 w-4" data-icon="inline-start" />
                              Xem su kien
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
                title="Chua co su kien lien ket"
                description="Bai viet nay chua co su kien lien ket trong du lieu hien tai."
              />
            )}
          </section>
        </div>
      </CardContent>
    </>
  )
}

function NewsArticleDetailSkeleton() {
  return (
    <>
      <CardHeader className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-28 rounded-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-8 pt-6">
        <Skeleton className="aspect-video w-full rounded-lg" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="rounded-lg border p-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-3 h-5 w-full" />
            </div>
          ))}
        </div>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        ))}
      </CardContent>
    </>
  )
}
