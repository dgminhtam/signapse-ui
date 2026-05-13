import { format } from "date-fns"
import {
  Activity,
  ArrowLeft,
  CalendarClock,
  ChevronDown,
  Clock3,
  Database,
  FileText,
  Hash,
  Landmark,
  RefreshCcw,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense, type ElementType, type ReactNode } from "react"

import { getEconomicCalendarEntryById } from "@/app/api/economic-calendar/action"
import {
  EconomicCalendarResponse,
  formatEconomicCalendarValue,
  getEconomicCalendarImpactLabel,
  getEconomicCalendarImpactVariant,
  getEconomicCalendarStatusLabel,
  getEconomicCalendarStatusVariant,
} from "@/app/lib/economic-calendar/definitions"
import { ECONOMIC_CALENDAR_READ_PERMISSIONS } from "@/app/lib/economic-calendar/permissions"
import { hasAnyPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { AppTimeMetadata } from "@/components/app-time-metadata"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface PageProps {
  params: Promise<{ id: string }>
}

type ApiLikeError = Error & { status?: number }

function formatDateTime(value?: string) {
  if (!value) {
    return "Chưa có"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Chưa có"
  }

  return format(date, "dd/MM/yyyy HH:mm")
}

function formatCurrency(value?: string) {
  return value?.trim().toUpperCase() || "Chưa có"
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
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {title}
      </div>
      <div className="mt-2">
        {valueNode ?? (
          <p className="break-words font-medium text-foreground">{value}</p>
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
      <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h2>
    </div>
  )
}

export default async function EconomicCalendarDetailPage({ params }: PageProps) {
  const permissions = await getCurrentPermissions()

  if (!hasAnyPermission(permissions, ECONOMIC_CALENDAR_READ_PERMISSIONS)) {
    return (
      <AccessDenied
        description="Bạn không có quyền xem chi tiết lịch kinh tế."
        permission={ECONOMIC_CALENDAR_READ_PERMISSIONS[0]}
      />
    )
  }

  const { id } = await params
  const entryId = Number(id)

  if (!Number.isFinite(entryId)) {
    notFound()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center">
        <Button asChild variant="ghost" size="sm" className="-ml-2 gap-2">
          <Link href="/economic-calendar">
            <ArrowLeft className="h-4 w-4" data-icon="inline-start" />
            Quay lại lịch kinh tế
          </Link>
        </Button>
      </div>

      <Suspense fallback={<EconomicCalendarDetailSkeleton />}>
        <FetchEconomicCalendarEntryData id={entryId} />
      </Suspense>
    </div>
  )
}

async function FetchEconomicCalendarEntryData({ id }: { id: number }) {
  let entry: EconomicCalendarResponse

  try {
    entry = await getEconomicCalendarEntryById(id)
  } catch (error) {
    if (isNotFoundError(error)) {
      notFound()
    }

    throw error
  }

  const hasContent = Boolean(entry.contentAvailable && entry.content?.trim())

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={getEconomicCalendarImpactVariant(entry.impact)}>
              Tác động: {getEconomicCalendarImpactLabel(entry.impact)}
            </Badge>
            <Badge
              variant={getEconomicCalendarStatusVariant(
                entry.status,
                entry.contentAvailable
              )}
            >
              {getEconomicCalendarStatusLabel(entry.status, entry.contentAvailable)}
            </Badge>
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold leading-tight text-foreground">
              {formatEconomicCalendarValue(entry.title, "Sự kiện chưa có tiêu đề")}
            </h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 pt-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Landmark className="h-4 w-4" />
                Tiền tệ {formatCurrency(entry.currencyCode)}
              </span>
              <AppTimeMetadata icon={CalendarClock}>
                Công bố {formatDateTime(entry.scheduledAt)}
              </AppTimeMetadata>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <DetailCard
              title="Actual"
              value={formatEconomicCalendarValue(entry.actualValue)}
              icon={Database}
            />
            <DetailCard
              title="Forecast"
              value={formatEconomicCalendarValue(entry.forecastValue)}
              icon={Database}
            />
            <DetailCard
              title="Previous"
              value={formatEconomicCalendarValue(entry.previousValue)}
              icon={Database}
            />
            <DetailCard
              title="Đồng bộ"
              valueNode={
                <AppTimeMetadata icon={RefreshCcw}>
                  {formatDateTime(entry.syncedAt)}
                </AppTimeMetadata>
              }
              icon={RefreshCcw}
            />
          </div>

          <section className="flex flex-col gap-3">
            <SectionHeading title="Nội dung chi tiết" icon={FileText} />
            <div className="rounded-lg border border-border p-4">
              {hasContent ? (
                <div className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">
                  {entry.content}
                </div>
              ) : (
                <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 font-medium text-foreground">
                    <FileText className="h-4 w-4" />
                    Nội dung chi tiết chưa sẵn sàng
                  </div>
                  <p>
                    Backend chưa có nội dung chi tiết cho mục lịch kinh tế này. Hãy
                    đồng bộ lại hoặc kiểm tra sau khi trạng thái chuyển sang có dữ liệu.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-dashed bg-muted/10">
            <details>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4 text-sm font-semibold text-muted-foreground">
                <span className="inline-flex items-center gap-2 uppercase tracking-wide">
                  <Hash className="h-4 w-4" />
                  Thông tin kỹ thuật
                </span>
                <ChevronDown className="h-4 w-4" />
              </summary>
              <div className="grid gap-4 border-t border-border p-4 sm:grid-cols-2 xl:grid-cols-3">
                <DetailCard title="Mã mục" value={String(entry.id)} icon={Hash} />
                <DetailCard
                  title="Trạng thái"
                  value={getEconomicCalendarStatusLabel(
                    entry.status,
                    entry.contentAvailable
                  )}
                  icon={Activity}
                />
                <DetailCard
                  title="Tạo lúc"
                  valueNode={
                    <AppTimeMetadata icon={Clock3}>
                      {formatDateTime(entry.createdDate)}
                    </AppTimeMetadata>
                  }
                  icon={Clock3}
                />
                <DetailCard
                  title="Cập nhật"
                  valueNode={
                    <AppTimeMetadata icon={RefreshCcw}>
                      {formatDateTime(entry.lastModifiedDate)}
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

function EconomicCalendarDetailSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-28 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
        <div className="flex flex-col gap-2">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-lg border p-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-3 h-5 w-full" />
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-40 w-full rounded-lg" />
        </div>
        <Skeleton className="h-14 w-full rounded-lg" />
      </div>
    </div>
  )
}
