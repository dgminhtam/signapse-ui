import { Suspense } from "react"
import { format } from "date-fns"
import {
  ArrowLeft,
  Calendar,
  Clock3,
  ExternalLink,
  FileText,
  GitBranch,
  Hash,
  Layers3,
  Link2,
  RefreshCcw,
  Sparkles,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getEventById } from "@/app/api/events/action"
import { ARTIFACT_TYPE_LABELS, isNewsArticleArtifact } from "@/app/lib/artifacts/definitions"
import { hasAnyPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import {
  EVENT_ASSET_RELATION_LABELS,
  EVENT_ASSET_TYPE_LABELS,
  EVENT_EVIDENCE_ROLE_LABELS,
  EVENT_THEME_RELATION_LABELS,
  EventResponse,
} from "@/app/lib/events/definitions"
import { EVENT_READ_PERMISSIONS } from "@/app/lib/events/permissions"
import { NEWS_ARTICLE_READ_PERMISSIONS } from "@/app/lib/news-articles/permissions"
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

import { EventEnrichButton } from "../event-enrich-button"
import {
  getEventEnrichmentLabel,
  getEventEnrichmentVariant,
  getEventStatusLabel,
  getEventStatusVariant,
} from "../event-presentation"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

type ApiLikeError = Error & { status?: number }

function formatDateTime(value?: string | null) {
  if (!value) {
    return "Chua co"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Chua co"
  }

  return format(date, "dd/MM/yyyy HH:mm")
}

function formatConfidence(value?: number) {
  if (typeof value !== "number") {
    return "Chua co"
  }

  return `${Math.round(value * 100)}%`
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
          <Layers3 className="h-10 w-10 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

export default async function EventDetailPage({ params }: PageProps) {
  const permissions = await getCurrentPermissions()

  if (!hasAnyPermission(permissions, EVENT_READ_PERMISSIONS)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chi tiet su kien</CardTitle>
          <CardDescription>
            Xem thong tin tong hop, lien ket tai san, chu de va bang chung cua su kien.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <AccessDenied
            description="Ban khong co quyen xem chi tiet su kien."
            permission={EVENT_READ_PERMISSIONS[0]}
          />
        </CardContent>
      </Card>
    )
  }

  const { id } = await params
  const eventId = Number(id)
  const canReadNewsArticles = hasAnyPermission(permissions, NEWS_ARTICLE_READ_PERMISSIONS)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/events">
            <ArrowLeft className="mr-2 h-4 w-4" data-icon="inline-start" />
            Quay lai danh sach
          </Link>
        </Button>
      </div>

      <Card>
        <Suspense fallback={<EventDetailSkeleton />}>
          <FetchEventData id={eventId} canReadNewsArticles={canReadNewsArticles} />
        </Suspense>
      </Card>
    </div>
  )
}

async function FetchEventData({
  id,
  canReadNewsArticles,
}: {
  id: number
  canReadNewsArticles: boolean
}) {
  let event: EventResponse

  try {
    event = await getEventById(id)
  } catch (error) {
    if (isNotFoundError(error)) {
      notFound()
    }

    throw error
  }

  const assets = event.assets ?? []
  const themes = event.themes ?? []
  const evidenceItems = event.evidence ?? []

  return (
    <>
      <CardHeader>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={getEventStatusVariant(event.status)}>
                {getEventStatusLabel(event.status)}
              </Badge>
              <Badge variant={getEventEnrichmentVariant(event.enrichmentStatus)}>
                {getEventEnrichmentLabel(event.enrichmentStatus)}
              </Badge>
              <Badge variant={event.active ? "secondary" : "outline"}>
                {event.active ? "Dang hoat dong" : "Khong hoat dong"}
              </Badge>
            </div>

            <div className="flex flex-col gap-1">
              <CardTitle className="text-2xl">{event.title}</CardTitle>
              <CardDescription className="pt-1">
                {event.summary?.trim() || "Chua co tom tat cho su kien nay."}
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <EventEnrichButton id={event.id} />
          </div>
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <div className="flex flex-col gap-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <DetailCard title="Ma su kien" value={String(event.id)} icon={Hash} />
            <DetailCard title="Slug" value={event.slug || "Chua co"} icon={Link2} />
            <DetailCard
              title="Khoa chuan"
              value={event.canonicalKey || "Chua co"}
              icon={GitBranch}
            />
            <DetailCard
              title="Do tin cay"
              value={formatConfidence(event.confidence)}
              icon={Layers3}
            />
            <DetailCard title="Xay ra luc" value={formatDateTime(event.occurredAt)} icon={Calendar} />
            <DetailCard
              title="Xac nhan luc"
              value={formatDateTime(event.confirmedAt)}
              icon={Calendar}
            />
            <DetailCard title="Tao luc" value={formatDateTime(event.createdDate)} icon={Clock3} />
            <DetailCard
              title="Cap nhat"
              value={formatDateTime(event.lastModifiedDate)}
              icon={RefreshCcw}
            />
          </div>

          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Mo ta
              </h2>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <p className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">
                {event.description?.trim() || "Chua co mo ta chi tiet."}
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Trang thai lam giau
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <DetailCard
                title="Trang thai"
                value={getEventEnrichmentLabel(event.enrichmentStatus)}
                icon={Sparkles}
              />
              <DetailCard
                title="Lan lam giau gan nhat"
                value={formatDateTime(event.enrichmentAttemptedAt)}
                icon={Clock3}
              />
              <DetailCard
                title="Hoan tat luc"
                value={formatDateTime(event.enrichmentCompletedAt)}
                icon={RefreshCcw}
              />
              <DetailCard
                title="Hoat dong"
                value={event.active ? "Dang hoat dong" : "Khong hoat dong"}
                icon={Layers3}
              />
            </div>

            {event.enrichmentError ? (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                <div className="mb-1 font-semibold">Loi lam giau gan nhat</div>
                <div className="whitespace-pre-wrap">{event.enrichmentError}</div>
              </div>
            ) : null}
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Layers3 className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Tai san lien quan
              </h2>
            </div>

            {assets.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {assets.map((asset, index) => (
                  <div
                    key={`${asset.assetId ?? "asset"}-${index}`}
                    className="rounded-lg border border-border bg-muted/20 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
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
                    <div className="mt-3 flex flex-col gap-1">
                      <p className="font-medium text-foreground">
                        {asset.assetName || "Chua co ten tai san"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {asset.assetSymbol || "Chua co ma"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Trong so:{" "}
                        {typeof asset.weight === "number" ? asset.weight.toFixed(2) : "Chua co"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <SectionEmpty
                title="Chua co tai san lien quan"
                description="Su kien nay chua co lien ket tai san trong du lieu hien tai."
              />
            )}
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Layers3 className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Chu de lien quan
              </h2>
            </div>

            {themes.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {themes.map((theme, index) => (
                  <div
                    key={`${theme.themeId ?? "theme"}-${index}`}
                    className="rounded-lg border border-border bg-muted/20 p-4"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {theme.relationType ? (
                        <Badge variant="secondary">
                          {EVENT_THEME_RELATION_LABELS[theme.relationType]}
                        </Badge>
                      ) : null}
                    </div>
                    <div className="mt-3 flex flex-col gap-1">
                      <p className="font-medium text-foreground">
                        {theme.themeTitle || "Chua co ten chu de"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {theme.themeSlug || "Chua co slug"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Trong so:{" "}
                        {typeof theme.weight === "number" ? theme.weight.toFixed(2) : "Chua co"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <SectionEmpty
                title="Chua co chu de lien quan"
                description="Su kien nay chua co lien ket chu de trong du lieu hien tai."
              />
            )}
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Bang chung
              </h2>
            </div>

            {evidenceItems.length > 0 ? (
              <div className="flex flex-col gap-3">
                {evidenceItems.map((evidence, index) => (
                  <div
                    key={`${evidence.artifactId ?? "evidence"}-${index}`}
                    className="rounded-lg border border-border bg-muted/20 p-4"
                  >
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                      <div className="flex flex-col gap-2">
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
                        </div>
                        <p className="font-medium text-foreground">
                          {evidence.artifactTitle || "Chua co tieu de tu lieu"}
                        </p>
                        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                          <span>Nguon tin: {evidence.newsOutletName || "Chua co"}</span>
                          <span>Xuat ban: {formatDateTime(evidence.publishedAt)}</span>
                          <span>Do tin cay: {formatConfidence(evidence.confidence)}</span>
                        </div>
                        {evidence.evidenceNote?.trim() ? (
                          <p className="whitespace-pre-wrap text-sm text-foreground/90">
                            {evidence.evidenceNote}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {typeof evidence.artifactId === "number" &&
                        isNewsArticleArtifact(evidence.artifactType) &&
                        canReadNewsArticles ? (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/news-articles/${evidence.artifactId}`}>
                              <FileText className="h-4 w-4" data-icon="inline-start" />
                              Xem bai viet
                            </Link>
                          </Button>
                        ) : null}
                        {evidence.artifactUrl ? (
                          <Button variant="outline" size="sm" asChild>
                            <a href={evidence.artifactUrl} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="h-4 w-4" data-icon="inline-start" />
                              Mo lien ket goc
                            </a>
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <SectionEmpty
                title="Chua co bang chung"
                description="Su kien nay chua co bang chung chi tiet trong du lieu hien tai."
              />
            )}
          </section>
        </div>
      </CardContent>
    </>
  )
}

function EventDetailSkeleton() {
  return (
    <>
      <CardHeader className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="rounded-lg border p-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-3 h-5 w-full" />
            </div>
          ))}
        </div>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-3">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        ))}
      </CardContent>
    </>
  )
}
