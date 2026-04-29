"use client"

import { format } from "date-fns"
import { Calendar, Eye, GitBranch } from "lucide-react"
import Link from "next/link"

import { Page } from "@/app/lib/definitions"
import { EventListResponse } from "@/app/lib/events/definitions"
import { AppPaginationControls } from "@/components/app-pagination-controls"
import {
  AppListToolbar,
  AppListToolbarLeading,
  AppListToolbarTrailing,
} from "@/components/app-list-toolbar"
import {
  AppListTable,
  AppListTableEmptyState,
  AppListTableHead,
  AppListTableHeaderRow,
} from "@/components/app-list-table"
import { AppSelectPageSize } from "@/components/app-select-page-size"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
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
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { EventEnrichPendingButton } from "./event-enrich-pending-button"
import { EventMarketReactionPendingButton } from "./event-market-reaction-pending-button"
import { EventSearch } from "./event-search"
import {
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
          <EventMarketReactionPendingButton />
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

      <AppListTable>
        <Table>
          <TableHeader>
            <AppListTableHeaderRow>
              <AppListTableHead className="w-[44%]">Sự kiện</AppListTableHead>
              <AppListTableHead className="w-36">Trạng thái</AppListTableHead>
              <AppListTableHead className="w-44">Thời gian</AppListTableHead>
              <AppListTableHead className="w-28">Độ tin cậy</AppListTableHead>
              <AppListTableHead className="w-20 text-right">
                Thao tác
              </AppListTableHead>
            </AppListTableHeaderRow>
          </TableHeader>
          <TableBody>
            {events.length > 0 ? (
              events.map((event) => (
                <TableRow
                  key={event.id}
                  className="border-border transition-colors hover:bg-muted/50"
                >
                  <TableCell className="align-top whitespace-normal">
                    <div className="flex min-w-0 flex-col gap-1">
                      <Link
                        href={`/events/${event.id}`}
                        className="line-clamp-1 font-medium break-words hover:underline"
                      >
                        {event.title}
                      </Link>
                      <span className="line-clamp-2 text-xs break-words text-muted-foreground">
                        {event.description?.trim() || "Chưa có mô tả ngắn."}
                      </span>
                      {event.canonicalKey ? (
                        <span className="line-clamp-1 text-xs break-all text-muted-foreground">
                          Khóa chuẩn: {event.canonicalKey}
                        </span>
                      ) : null}
                    </div>
                  </TableCell>
                  <TableCell className="w-36">
                    <Badge variant={getEventStatusVariant(event.status)}>
                      {getEventStatusLabel(event.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-44 text-sm text-muted-foreground">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDateTime(event.occurredAt)}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="w-28 text-sm text-muted-foreground">
                    {formatConfidence(event.confidence)}
                  </TableCell>
                  <TableCell className="w-20 text-right">
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
              <AppListTableEmptyState colSpan={5}>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <GitBranch className="text-muted-foreground" />
                  </EmptyMedia>
                  <EmptyTitle>Chưa có sự kiện</EmptyTitle>
                  <EmptyDescription>
                    Không có sự kiện nào khớp với bộ lọc hiện tại.
                  </EmptyDescription>
                </EmptyHeader>
              </AppListTableEmptyState>
            )}
          </TableBody>
        </Table>
      </AppListTable>

      <AppPaginationControls page={eventPage} className="mt-4" />
    </div>
  )
}
