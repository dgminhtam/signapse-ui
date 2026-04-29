import { Suspense, type ElementType } from "react"
import { format } from "date-fns"
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  Clock3,
  ExternalLink,
  FileText,
  GitBranch,
  Hash,
  Layers3,
  Link2,
  RefreshCcw,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getEventById } from "@/app/api/events/action"
import {
  ARTIFACT_TYPE_LABELS,
  isNewsArticleArtifact,
} from "@/app/lib/artifacts/definitions"
import { hasAnyPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import {
  EVENT_ASSET_RELATION_LABELS,
  EVENT_ASSET_TYPE_LABELS,
  EVENT_EVIDENCE_ROLE_LABELS,
  EVENT_THEME_RELATION_LABELS,
  EventMarketReactionDirection,
  EventMarketReactionSummaryResponse,
  EventResponse,
} from "@/app/lib/events/definitions"
import { EVENT_READ_PERMISSIONS } from "@/app/lib/events/permissions"
import { NEWS_ARTICLE_READ_PERMISSIONS } from "@/app/lib/news-articles/permissions"
import { AccessDenied } from "@/components/access-denied"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Skeleton } from "@/components/ui/skeleton"

import { EventEnrichButton } from "../event-enrich-button"
import { EventMarketReactionButton } from "../event-market-reaction-button"
import {
  getEventMarketReactionDirectionLabel,
  getEventMarketReactionDirectionVariant,
  getEventMarketReactionTimeHorizonLabel,
  getEventMarketReactionTimeHorizonVariant,
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
    return "Chưa có"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Chưa có"
  }

  return format(date, "dd/MM/yyyy HH:mm")
}

function formatConfidence(value?: number) {
  if (typeof value !== "number") {
    return "Chưa có"
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
  icon: ElementType
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/20 p-4">
      <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      <p className="mt-2 font-medium break-words text-foreground">{value}</p>
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
          <Layers3 className="h-10 w-10 text-muted-foreground" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

function countMarketReactionDirections(
  reactions: EventMarketReactionSummaryResponse[]
) {
  return reactions.reduce<
    Partial<Record<EventMarketReactionDirection, number>>
  >((counts, reaction) => {
    if (!reaction.direction) {
      return counts
    }

    counts[reaction.direction] = (counts[reaction.direction] ?? 0) + 1
    return counts
  }, {})
}

function MarketReactionCard({
  reaction,
  index,
}: {
  reaction: EventMarketReactionSummaryResponse
  index: number
}) {
  const assetLabel =
    reaction.assetSymbol?.trim() ||
    reaction.assetName?.trim() ||
    `Tài sản ${index + 1}`
  const showAssetName =
    reaction.assetName?.trim() && reaction.assetName.trim() !== assetLabel

  return (
    <Card size="sm">
      <CardHeader className="gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {reaction.assetType ? (
            <Badge variant="outline">
              {EVENT_ASSET_TYPE_LABELS[reaction.assetType]}
            </Badge>
          ) : null}
          {reaction.direction ? (
            <Badge
              variant={getEventMarketReactionDirectionVariant(
                reaction.direction
              )}
            >
              {getEventMarketReactionDirectionLabel(reaction.direction)}
            </Badge>
          ) : null}
          {reaction.timeHorizon ? (
            <Badge
              variant={getEventMarketReactionTimeHorizonVariant(
                reaction.timeHorizon
              )}
            >
              {getEventMarketReactionTimeHorizonLabel(reaction.timeHorizon)}
            </Badge>
          ) : null}
        </div>

        <CardTitle>{assetLabel}</CardTitle>
        {showAssetName ? (
          <CardDescription>{reaction.assetName}</CardDescription>
        ) : null}

        <CardAction className="text-right text-xs text-muted-foreground">
          <div>Độ tin cậy</div>
          <div className="font-medium text-foreground">
            {formatConfidence(reaction.confidence)}
          </div>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        <p className="line-clamp-4 text-sm leading-6 whitespace-pre-wrap text-foreground/90">
          {reaction.reasoning?.trim() ||
            "Chưa có diễn giải chi tiết cho tác động này."}
        </p>
        <div className="text-xs text-muted-foreground">
          Quan sát lúc: {formatDateTime(reaction.observedAt)}
        </div>
      </CardContent>
    </Card>
  )
}

export default async function EventDetailPage({ params }: PageProps) {
  const permissions = await getCurrentPermissions()

  if (!hasAnyPermission(permissions, EVENT_READ_PERMISSIONS)) {
    return (
      <AccessDenied
        description="Bạn không có quyền xem chi tiết sự kiện."
        permission={EVENT_READ_PERMISSIONS[0]}
      />
    )
  }

  const { id } = await params
  const eventId = Number(id)
  const canReadNewsArticles = hasAnyPermission(
    permissions,
    NEWS_ARTICLE_READ_PERMISSIONS
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="-ml-2 gap-2">
          <Link href="/events">
            <ArrowLeft data-icon="inline-start" />
            Quay lại danh sách
          </Link>
        </Button>
      </div>

      <Suspense fallback={<EventDetailSkeleton />}>
        <FetchEventData
          id={eventId}
          canReadNewsArticles={canReadNewsArticles}
        />
      </Suspense>
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
  const marketReactions = event.marketReactions ?? []
  const marketReactionCounts = countMarketReactionDirections(marketReactions)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={getEventStatusVariant(event.status)}>
                {getEventStatusLabel(event.status)}
              </Badge>
            </div>

            <div className="flex flex-col gap-1">
              <h1 className="text-2xl leading-tight font-semibold text-foreground">
                {event.title}
              </h1>
              <p className="max-w-4xl pt-1 text-sm leading-6 text-muted-foreground">
                {event.description?.trim() || "Chưa có mô tả cho sự kiện này."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <EventEnrichButton id={event.id} variant="outline" />
            <EventMarketReactionButton id={event.id} />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <DetailCard
            title="Độ tin cậy"
            value={formatConfidence(event.confidence)}
            icon={Layers3}
          />
          <DetailCard
            title="Xảy ra lúc"
            value={formatDateTime(event.occurredAt)}
            icon={Calendar}
          />
          <DetailCard
            title="Xác nhận lúc"
            value={formatDateTime(event.confirmedAt)}
            icon={Calendar}
          />
        </div>

        <section className="flex flex-col gap-4">
          <SectionHeading title="Bằng chứng" icon={GitBranch} />

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
                        {evidence.artifactTitle || "Chưa có tiêu đề tư liệu"}
                      </p>
                      <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                        <span>
                          Nguồn tin: {evidence.newsOutletName || "Chưa có"}
                        </span>
                        <span>
                          Xuất bản: {formatDateTime(evidence.publishedAt)}
                        </span>
                        <span>
                          Độ tin cậy: {formatConfidence(evidence.confidence)}
                        </span>
                      </div>
                      {evidence.evidenceNote?.trim() ? (
                        <p className="text-sm leading-6 whitespace-pre-wrap text-foreground/90">
                          {evidence.evidenceNote}
                        </p>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {typeof evidence.artifactId === "number" &&
                      isNewsArticleArtifact(evidence.artifactType) &&
                      canReadNewsArticles ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          asChild
                        >
                          <Link href={`/news-articles/${evidence.artifactId}`}>
                            <FileText data-icon="inline-start" />
                            Xem bài viết
                          </Link>
                        </Button>
                      ) : null}
                      {evidence.artifactUrl ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          asChild
                        >
                          <a
                            href={evidence.artifactUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink data-icon="inline-start" />
                            Mở liên kết gốc
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
              title="Chưa có bằng chứng"
              description="Sự kiện này chưa có bằng chứng chi tiết trong dữ liệu hiện tại."
            />
          )}
        </section>

        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SectionHeading title="Tác động thị trường" icon={TrendingUp} />
            {marketReactions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {marketReactions.length} tác động
                </Badge>
                {(["BULLISH", "BEARISH", "MIXED", "NEUTRAL"] as const).map(
                  (direction) => {
                    const count = marketReactionCounts[direction] ?? 0

                    if (count === 0) {
                      return null
                    }

                    return (
                      <Badge
                        key={direction}
                        variant={getEventMarketReactionDirectionVariant(
                          direction
                        )}
                      >
                        {count}{" "}
                        {getEventMarketReactionDirectionLabel(
                          direction
                        ).toLowerCase()}
                      </Badge>
                    )
                  }
                )}
              </div>
            ) : null}
          </div>

          {marketReactions.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {marketReactions.map((reaction, index) => (
                <MarketReactionCard
                  key={`${reaction.id ?? reaction.assetId ?? "reaction"}-${index}`}
                  reaction={reaction}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <SectionEmpty
              title="Chưa có tác động thị trường"
              description="Sự kiện này chưa có kết quả suy luận hướng phản ứng theo từng tài sản."
            />
          )}
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading title="Tài sản liên quan" icon={Layers3} />

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
                      {asset.assetName || "Chưa có tên tài sản"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {asset.assetSymbol || "Chưa có mã"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Trọng số:{" "}
                      {typeof asset.weight === "number"
                        ? asset.weight.toFixed(2)
                        : "Chưa có"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <SectionEmpty
              title="Chưa có tài sản liên quan"
              description="Sự kiện này chưa có liên kết tài sản trong dữ liệu hiện tại."
            />
          )}
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeading title="Chủ đề liên quan" icon={Layers3} />

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
                      {theme.themeTitle || "Chưa có tên chủ đề"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {theme.themeSlug || "Chưa có slug"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Trọng số:{" "}
                      {typeof theme.weight === "number"
                        ? theme.weight.toFixed(2)
                        : "Chưa có"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <SectionEmpty
              title="Chưa có chủ đề liên quan"
              description="Sự kiện này chưa có liên kết chủ đề trong dữ liệu hiện tại."
            />
          )}
        </section>

        <section className="rounded-lg border border-dashed bg-muted/10">
          <details>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-semibold text-muted-foreground">
              <span className="inline-flex items-center gap-2 tracking-wide uppercase">
                <Hash className="h-4 w-4" />
                Thông tin kỹ thuật
              </span>
              <ChevronDown className="h-4 w-4" />
            </summary>
            <div className="grid gap-4 border-t border-border p-4 sm:grid-cols-2 xl:grid-cols-3">
              <DetailCard
                title="Mã sự kiện"
                value={String(event.id)}
                icon={Hash}
              />
              <DetailCard
                title="Slug"
                value={event.slug || "Chưa có"}
                icon={Link2}
              />
              <DetailCard
                title="Khóa chuẩn"
                value={event.canonicalKey || "Chưa có"}
                icon={GitBranch}
              />
              <DetailCard
                title="Tạo lúc"
                value={formatDateTime(event.createdDate)}
                icon={Clock3}
              />
              <DetailCard
                title="Cập nhật"
                value={formatDateTime(event.lastModifiedDate)}
                icon={RefreshCcw}
              />
            </div>
          </details>
        </section>
      </div>
    </div>
  )
}

function EventDetailSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-32 rounded-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-lg border p-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-3 h-5 w-full" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Skeleton className="h-4 w-40" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className="h-40 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-lg" />
          ))}
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className="h-28 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-14 w-full rounded-lg" />
      </div>
    </div>
  )
}
