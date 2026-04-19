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
import { SOURCE_DOCUMENT_TYPE_LABELS } from "@/app/lib/source-documents/definitions"
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

function formatDateTime(value?: string) {
  if (!value) {
    return "Chưa có"
  }

  return format(new Date(value), "dd/MM/yyyy HH:mm")
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
          <CardTitle>Chi tiết sự kiện</CardTitle>
          <CardDescription>
            Xem thông tin tổng hợp, liên kết tài sản/chủ đề và chuỗi bằng chứng của sự kiện.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <AccessDenied
            description="Bạn không có quyền xem chi tiết sự kiện."
            permission={EVENT_READ_PERMISSIONS[0]}
          />
        </CardContent>
      </Card>
    )
  }

  const { id } = await params
  const eventId = Number(id)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/events">
            <ArrowLeft className="mr-2 h-4 w-4" data-icon="inline-start" />
            Quay lại danh sách
          </Link>
        </Button>
      </div>

      <Card>
        <Suspense fallback={<EventDetailSkeleton />}>
          <FetchEventData id={eventId} />
        </Suspense>
      </Card>
    </div>
  )
}

async function FetchEventData({ id }: { id: number }) {
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
                {event.active ? "Đang hoạt động" : "Không hoạt động"}
              </Badge>
            </div>

            <div className="flex flex-col gap-1">
              <CardTitle className="text-2xl">{event.title}</CardTitle>
              <CardDescription className="pt-1">
                {event.summary?.trim() || "Chưa có tóm tắt cho sự kiện này."}
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
            <DetailCard title="Mã sự kiện" value={String(event.id)} icon={Hash} />
            <DetailCard title="Slug" value={event.slug || "Chưa có"} icon={Link2} />
            <DetailCard
              title="Khóa chuẩn"
              value={event.canonicalKey || "Chưa có"}
              icon={GitBranch}
            />
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
            <DetailCard title="Tạo lúc" value={formatDateTime(event.createdDate)} icon={Clock3} />
            <DetailCard
              title="Cập nhật"
              value={formatDateTime(event.lastModifiedDate)}
              icon={RefreshCcw}
            />
          </div>

          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Mô tả
              </h2>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 p-4">
              <p className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">
                {event.description?.trim() || "Chưa có mô tả chi tiết."}
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Trạng thái làm giàu
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <DetailCard
                title="Trạng thái"
                value={getEventEnrichmentLabel(event.enrichmentStatus)}
                icon={Sparkles}
              />
              <DetailCard
                title="Lần làm giàu gần nhất"
                value={formatDateTime(event.enrichmentAttemptedAt)}
                icon={Clock3}
              />
              <DetailCard
                title="Hoàn tất lúc"
                value={formatDateTime(event.enrichmentCompletedAt)}
                icon={RefreshCcw}
              />
              <DetailCard
                title="Hoạt động"
                value={event.active ? "Đang hoạt động" : "Không hoạt động"}
                icon={Layers3}
              />
            </div>

            {event.enrichmentError ? (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                <div className="mb-1 font-semibold">Lỗi làm giàu gần nhất</div>
                <div className="whitespace-pre-wrap">{event.enrichmentError}</div>
              </div>
            ) : null}
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Layers3 className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Tài sản liên quan
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
                        {asset.assetName || "Chưa có tên tài sản"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {asset.assetSymbol || "Chưa có mã"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Trọng số: {typeof asset.weight === "number" ? asset.weight.toFixed(2) : "Chưa có"}
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
            <div className="flex items-center gap-2">
              <Layers3 className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Chủ đề liên quan
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
                        {theme.themeTitle || "Chưa có tên chủ đề"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {theme.themeSlug || "Chưa có slug"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Trọng số: {typeof theme.weight === "number" ? theme.weight.toFixed(2) : "Chưa có"}
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

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <GitBranch className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Bài viết bằng chứng
              </h2>
            </div>

            {evidenceItems.length > 0 ? (
              <div className="flex flex-col gap-3">
                {evidenceItems.map((evidence, index) => (
                  <div
                    key={`${evidence.sourceDocumentId ?? "evidence"}-${index}`}
                    className="rounded-lg border border-border bg-muted/20 p-4"
                  >
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {evidence.documentType ? (
                            <Badge variant="outline">
                              {SOURCE_DOCUMENT_TYPE_LABELS[evidence.documentType]}
                            </Badge>
                          ) : null}
                          {evidence.evidenceRole ? (
                            <Badge variant="secondary">
                              {EVENT_EVIDENCE_ROLE_LABELS[evidence.evidenceRole]}
                            </Badge>
                          ) : null}
                        </div>
                        <p className="font-medium text-foreground">
                          {evidence.sourceDocumentTitle || "Chưa có tiêu đề tài liệu"}
                        </p>
                        <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                          <span>Nguồn: {evidence.sourceName || "Chưa có"}</span>
                          <span>Xuất bản: {formatDateTime(evidence.publishedAt)}</span>
                          <span>
                            Độ tin cậy: {typeof evidence.confidence === "number" ? `${Math.round(evidence.confidence * 100)}%` : "Chưa có"}
                          </span>
                        </div>
                        {evidence.evidenceNote?.trim() ? (
                          <p className="whitespace-pre-wrap text-sm text-foreground/90">
                            {evidence.evidenceNote}
                          </p>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {typeof evidence.sourceDocumentId === "number" ? (
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/source-documents/${evidence.sourceDocumentId}`}>
                              <FileText className="h-4 w-4" data-icon="inline-start" />
                              Xem tài liệu
                            </Link>
                          </Button>
                        ) : null}
                        {evidence.sourceDocumentUrl ? (
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={evidence.sourceDocumentUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" data-icon="inline-start" />
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
                description="Sự kiện này chưa có bài viết bằng chứng trong dữ liệu hiện tại."
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
