import { Suspense } from "react"
import { format } from "date-fns"
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Clock3,
  ExternalLink,
  FileText,
  GitBranch,
  Globe2,
  Hash,
  Link2,
  RefreshCcw,
  Rss,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

import { getSourceDocumentById } from "@/app/api/source-documents/action"
import {
  EVENT_ENRICHMENT_STATUS_LABELS,
  EVENT_STATUS_LABELS,
} from "@/app/lib/events/definitions"
import { EVENT_READ_PERMISSIONS } from "@/app/lib/events/permissions"
import { hasAnyPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import {
  LINKED_EVENT_EVIDENCE_ROLE_LABELS,
  SOURCE_DOCUMENT_EVENT_DERIVATION_STATUS_LABELS,
  SOURCE_DOCUMENT_LIFECYCLE_LABELS,
  SOURCE_DOCUMENT_READINESS_STATUS_LABELS,
  SOURCE_DOCUMENT_TYPE_LABELS,
  SourceDocumentResponse,
} from "@/app/lib/source-documents/definitions"
import { SOURCE_DOCUMENT_READ_PERMISSIONS } from "@/app/lib/source-documents/permissions"
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
import { SourceDocumentAnalyzeButton } from "../source-document-analyze-button"
import { SourceDocumentCrawlButton } from "../source-document-crawl-button"
import { SourceDocumentDeleteButton } from "../source-document-delete-button"
import { SourceDocumentDeriveEventButton } from "../source-document-derive-event-button"
import { getSourceDocumentEventDerivationVariant } from "../source-document-event-derivation"

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

function getImageUrl(document: SourceDocumentResponse) {
  return (
    document.featureImage?.urlMedium ||
    document.featureImage?.urlLarge ||
    document.featureImage?.urlOriginal
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

export default async function SourceDocumentDetailPage({ params }: PageProps) {
  const permissions = await getCurrentPermissions()

  if (!hasAnyPermission(permissions, SOURCE_DOCUMENT_READ_PERMISSIONS)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Chi tiết tài liệu nguồn</CardTitle>
          <CardDescription>
            Xem nội dung đã ingest và metadata chi tiết theo từng loại tài liệu.
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <AccessDenied
            description="Bạn không có quyền xem chi tiết tài liệu nguồn."
            permission={SOURCE_DOCUMENT_READ_PERMISSIONS[0]}
          />
        </CardContent>
      </Card>
    )
  }

  const { id } = await params
  const sourceDocumentId = Number(id)
  const canReadEvents = hasAnyPermission(permissions, EVENT_READ_PERMISSIONS)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/source-documents">
            <ArrowLeft className="mr-2 h-4 w-4" data-icon="inline-start" />
            Quay lại danh sách
          </Link>
        </Button>
      </div>

      <Card>
        <Suspense fallback={<SourceDocumentDetailSkeleton />}>
          <FetchSourceDocumentData id={sourceDocumentId} canReadEvents={canReadEvents} />
        </Suspense>
      </Card>
    </div>
  )
}

async function FetchSourceDocumentData({
  id,
  canReadEvents,
}: {
  id: number
  canReadEvents: boolean
}) {
  let document: SourceDocumentResponse

  try {
    document = await getSourceDocumentById(id)
  } catch (error) {
    if (isNotFoundError(error)) {
      notFound()
    }

    throw error
  }

  const imageUrl = getImageUrl(document)
  const isEconomicCalendar = document.documentType === "ECONOMIC_CALENDAR"
  const isNewsDocument = document.documentType === "NEWS"
  const linkedEvents = document.linkedEvents ?? []

  return (
    <>
      <CardHeader>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">
                {SOURCE_DOCUMENT_TYPE_LABELS[document.documentType]}
              </Badge>
              <Badge variant={document.lifecycleStatus === "FAILED" ? "destructive" : "secondary"}>
                {SOURCE_DOCUMENT_LIFECYCLE_LABELS[document.lifecycleStatus]}
              </Badge>
              <Badge variant={document.readinessStatus === "FAILED" ? "destructive" : "outline"}>
                {SOURCE_DOCUMENT_READINESS_STATUS_LABELS[document.readinessStatus]}
              </Badge>
              <Badge variant={getSourceDocumentEventDerivationVariant(document.eventDerivationStatus)}>
                {document.eventDerivationStatus
                  ? SOURCE_DOCUMENT_EVENT_DERIVATION_STATUS_LABELS[document.eventDerivationStatus]
                  : "Chưa suy diễn"}
              </Badge>
            </div>

            <div className="flex flex-col gap-1">
              <CardTitle className="text-2xl">{document.title}</CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <Globe2 className="h-4 w-4" />
                  {document.sourceName}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {formatDateTime(document.publishedAt)}
                </span>
                {document.author ? (
                  <span className="inline-flex items-center gap-1.5">
                    <FileText className="h-4 w-4" />
                    {document.author}
                  </span>
                ) : null}
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <SourceDocumentAnalyzeButton
              id={document.id}
              variant="outline"
              size="sm"
              showText
            />
            <SourceDocumentCrawlButton id={document.id} />
            <Button variant="outline" size="sm" asChild>
              <a href={document.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" data-icon="inline-start" />
                Mở nguồn gốc
              </a>
            </Button>
            <SourceDocumentDeleteButton
              id={document.id}
              title={document.title}
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
                alt={document.featureImage?.altText || document.title}
                className="aspect-video w-full object-cover"
              />
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <DetailCard title="Mã tài liệu" value={String(document.id)} icon={Hash} />
            <DetailCard title="Nguồn" value={document.sourceName} icon={Globe2} />
            <DetailCard
              title="Xuất bản"
              value={formatDateTime(document.publishedAt)}
              icon={Calendar}
            />
            <DetailCard title="Tạo lúc" value={formatDateTime(document.createdDate)} icon={Clock3} />
            <DetailCard
              title="Cập nhật"
              value={formatDateTime(document.lastModifiedDate)}
              icon={RefreshCcw}
            />
          </div>

          {document.description?.trim() ? (
            <section className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Mô tả
                </h2>
              </div>
              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <p className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">
                  {document.description}
                </p>
              </div>
            </section>
          ) : null}

          <section className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Rss className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Nội dung
              </h2>
            </div>
            <div className="rounded-lg border border-border p-4">
              <div className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">
                {document.content?.trim() || "Chưa có nội dung chi tiết."}
              </div>
            </div>
          </section>

          {isEconomicCalendar ? (
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Thông tin lịch kinh tế
                </h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <DetailCard
                  title="Quốc gia"
                  value={document.countryCode || "Chưa có"}
                  icon={Globe2}
                />
                <DetailCard
                  title="Mức độ ảnh hưởng"
                  value={document.importance || "Chưa có"}
                  icon={AlertTriangle}
                />
                <DetailCard
                  title="Thời gian dự kiến"
                  value={formatDateTime(document.scheduledAt)}
                  icon={Calendar}
                />
                <DetailCard
                  title="Giá trị trước đó"
                  value={document.previousValue || "Chưa có"}
                  icon={FileText}
                />
                <DetailCard
                  title="Dự báo"
                  value={document.forecastValue || "Chưa có"}
                  icon={FileText}
                />
                <DetailCard
                  title="Thực tế"
                  value={document.actualValue || "Chưa có"}
                  icon={FileText}
                />
              </div>
            </section>
          ) : null}

          <section className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Suy diễn sự kiện
                </h2>
              </div>
              {isNewsDocument ? <SourceDocumentDeriveEventButton id={document.id} /> : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <DetailCard
                title="Trạng thái"
                value={
                  document.eventDerivationStatus
                    ? SOURCE_DOCUMENT_EVENT_DERIVATION_STATUS_LABELS[document.eventDerivationStatus]
                    : "Chưa suy diễn"
                }
                icon={GitBranch}
              />
              <DetailCard
                title="Lần suy diễn gần nhất"
                value={formatDateTime(document.eventDerivationAttemptedAt)}
                icon={Clock3}
              />
              <DetailCard
                title="Hoàn tất lúc"
                value={formatDateTime(document.eventDerivationCompletedAt)}
                icon={RefreshCcw}
              />
            </div>

            {document.eventDerivationError ? (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                <div className="mb-1 font-semibold">Lỗi suy diễn gần nhất</div>
                <div className="whitespace-pre-wrap">{document.eventDerivationError}</div>
              </div>
            ) : null}
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Sự kiện liên kết
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
                              {linkedEvent.eventTitle || `Sự kiện #${linkedEvent.eventId}`}
                            </Link>
                          ) : (
                            <p className="font-medium text-foreground">
                              {linkedEvent.eventTitle ||
                                (typeof linkedEvent.eventId === "number"
                                  ? `Sự kiện #${linkedEvent.eventId}`
                                  : "Sự kiện chưa có tiêu đề")}
                            </p>
                          )}

                          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                            <span>
                              Khóa chuẩn: {linkedEvent.eventCanonicalKey || "Chưa có"}
                            </span>
                            <span>
                              Độ tin cậy bằng chứng:{" "}
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
                              Xem sự kiện
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
                title="Chưa có sự kiện liên kết"
                description="Tài liệu này chưa có sự kiện liên kết trong dữ liệu hiện tại."
              />
            )}
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Metadata hệ thống
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <DetailCard
                title="Trạng thái sẵn sàng"
                value={SOURCE_DOCUMENT_READINESS_STATUS_LABELS[document.readinessStatus]}
                icon={RefreshCcw}
              />
              <DetailCard
                title="External Key"
                value={document.externalKey || "Chưa có"}
                icon={Hash}
              />
              <DetailCard
                title="Lần crawl gần nhất"
                value={formatDateTime(document.contentCrawlAttemptedAt)}
                icon={RefreshCcw}
              />
            </div>

            {document.contentCrawlError ? (
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive">
                <div className="mb-1 font-semibold">Lỗi crawl gần nhất</div>
                <div className="whitespace-pre-wrap">{document.contentCrawlError}</div>
              </div>
            ) : null}
          </section>
        </div>
      </CardContent>
    </>
  )
}

function SourceDocumentDetailSkeleton() {
  return (
    <>
      <CardHeader className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="flex flex-col gap-8 pt-6">
        <Skeleton className="aspect-video w-full rounded-lg" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="rounded-lg border p-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-3 h-5 w-full" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-24 w-full rounded-lg" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-48 w-full rounded-lg" />
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </CardContent>
    </>
  )
}
