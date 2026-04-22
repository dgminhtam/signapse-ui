"use client"

import { format } from "date-fns"
import { Calendar, Eye, GitBranch } from "lucide-react"
import Link from "next/link"

import { Page } from "@/app/lib/definitions"
import {
  EVENT_ENRICHMENT_STATUS_LABELS,
  EventListResponse,
} from "@/app/lib/events/definitions"
import { AppPaginationControls } from "@/components/app-pagination-controls"
import {
  AppListToolbar,
  AppListToolbarLeading,
  AppListToolbarTrailing,
} from "@/components/app-list-toolbar"
import { AppSelectPageSize } from "@/components/app-select-page-size"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { SortSelect } from "@/components/sort-select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { EventEnrichPendingButton } from "./event-enrich-pending-button"
import { EventSearch } from "./event-search"
import {
  getEventEnrichmentVariant,
  getEventStatusLabel,
  getEventStatusVariant,
} from "./event-presentation"

interface EventListProps {
  eventPage: Page<EventListResponse>
}

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

export function EventList({ eventPage }: EventListProps) {
  const events = eventPage.content

  return (
    <div className="w-full">
      <AppListToolbar>
        <AppListToolbarLeading>
          <EventEnrichPendingButton />
          <EventSearch />
        </AppListToolbarLeading>
        <AppListToolbarTrailing>
          <SortSelect
            className="w-full sm:w-auto"
            options={[
              { label: "Mới xảy ra nhất", value: "occurredAt_desc" },
              { label: "Cũ nhất", value: "occurredAt_asc" },
              { label: "Độ tin cậy cao", value: "confidence_desc" },
              { label: "Ngày tạo", value: "createdDate_desc" },
            ]}
            triggerClassName="w-full sm:w-[200px]"
          />
          <AppSelectPageSize
            className="w-full sm:w-auto"
            defaultSize={eventPage.size}
            showLabel={false}
            triggerClassName="w-full sm:w-[120px]"
          />
        </AppListToolbarTrailing>
      </AppListToolbar>

      <div className="rounded-md border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="font-semibold text-foreground">Sự kiện</TableHead>
              <TableHead className="font-semibold text-foreground">Trạng thái</TableHead>
              <TableHead className="font-semibold text-foreground">Thời gian</TableHead>
              <TableHead className="font-semibold text-foreground">
                Độ tin cậy
              </TableHead>
              <TableHead className="text-right font-semibold text-foreground">
                Thao tác
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length > 0 ? (
              events.map((event) => (
                <TableRow
                  key={event.id}
                  className="border-border transition-colors hover:bg-muted/50"
                >
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Link
                        href={`/events/${event.id}`}
                        className="line-clamp-1 font-medium hover:underline"
                      >
                        {event.title}
                      </Link>
                      <span className="line-clamp-2 text-xs text-muted-foreground">
                        {event.summary?.trim() || "Chưa có tóm tắt ngắn."}
                      </span>
                      {event.canonicalKey ? (
                        <span className="text-xs text-muted-foreground">
                          Khóa chuẩn: {event.canonicalKey}
                        </span>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-2">
                      <Badge variant={getEventStatusVariant(event.status)}>
                        {getEventStatusLabel(event.status)}
                      </Badge>
                      <Badge variant={getEventEnrichmentVariant(event.enrichmentStatus)}>
                        {event.enrichmentStatus
                          ? EVENT_ENRICHMENT_STATUS_LABELS[event.enrichmentStatus]
                          : "Chưa làm giàu"}
                      </Badge>
                      <Badge variant={event.active ? "secondary" : "outline"}>
                        {event.active ? "Đang hoạt động" : "Không hoạt động"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDateTime(event.occurredAt)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Cập nhật {formatDateTime(event.lastModifiedDate)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatConfidence(event.confidence)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        asChild
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Link href={`/events/${event.id}`}>
                          <Eye data-icon="inline-start" />
                          <span className="sr-only">Xem chi tiết sự kiện</span>
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-24 text-center">
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <GitBranch className="text-muted-foreground" />
                      </EmptyMedia>
                      <EmptyTitle>Chưa có sự kiện</EmptyTitle>
                      <EmptyDescription>
                        Không có sự kiện nào khớp với bộ lọc hiện tại.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AppPaginationControls page={eventPage} className="mt-4" />
    </div>
  )
}
