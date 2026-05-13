"use client"

import { format } from "date-fns"
import { CalendarClock, Eye, Landmark, RefreshCcw } from "lucide-react"
import Link from "next/link"

import { Page } from "@/app/lib/definitions"
import {
  EconomicCalendarListResponse,
  formatEconomicCalendarValue,
  getEconomicCalendarImpactLabel,
  getEconomicCalendarImpactVariant,
  getEconomicCalendarStatusLabel,
  getEconomicCalendarStatusVariant,
} from "@/app/lib/economic-calendar/definitions"
import { AppTimeMetadata } from "@/components/app-time-metadata"
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
import { SortSelect } from "@/components/sort-select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { EconomicCalendarSearch } from "./economic-calendar-search"
import { EconomicCalendarSyncButton } from "./economic-calendar-sync-button"

interface EconomicCalendarListProps {
  economicCalendarPage: Page<EconomicCalendarListResponse>
}

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

export function EconomicCalendarList({
  economicCalendarPage,
}: EconomicCalendarListProps) {
  const entries = economicCalendarPage.content ?? []

  return (
    <div className="w-full">
      <AppListToolbar>
        <AppListToolbarLeading>
          <EconomicCalendarSyncButton />
          <EconomicCalendarSearch />
        </AppListToolbarLeading>
        <AppListToolbarTrailing>
          <SortSelect
            className="w-full sm:w-auto"
            label="Sắp xếp lịch kinh tế"
            placeholder="Sắp xếp"
            options={[
              { label: "Ngày công bố mới nhất", value: "scheduledAt_desc" },
              { label: "Ngày công bố cũ nhất", value: "scheduledAt_asc" },
              { label: "Đồng bộ mới nhất", value: "syncedAt_desc" },
              { label: "Ngày tạo mới nhất", value: "createdDate_desc" },
            ]}
            triggerClassName="w-full sm:w-[200px]"
          />
          <AppSelectPageSize
            className="w-full sm:w-auto"
            defaultSize={economicCalendarPage.size}
            showLabel={false}
            triggerClassName="w-full sm:w-[120px]"
          />
        </AppListToolbarTrailing>
      </AppListToolbar>

      <AppListTable>
        <Table>
          <TableHeader>
            <AppListTableHeaderRow>
              <AppListTableHead className="w-[32%]">Sự kiện</AppListTableHead>
              <AppListTableHead className="w-24">Tiền tệ</AppListTableHead>
              <AppListTableHead className="w-28">Tác động</AppListTableHead>
              <AppListTableHead className="w-32">Trạng thái</AppListTableHead>
              <AppListTableHead className="w-44">Thời gian</AppListTableHead>
              <AppListTableHead className="w-40">Giá trị</AppListTableHead>
              <AppListTableHead className="w-20 text-right">
                Thao tác
              </AppListTableHead>
            </AppListTableHeaderRow>
          </TableHeader>
          <TableBody>
            {entries.length > 0 ? (
              entries.map((entry) => (
                <TableRow
                  key={entry.id}
                  className="border-border transition-colors hover:bg-muted/50"
                >
                  <TableCell className="align-top whitespace-normal">
                    <div className="flex min-w-0 flex-col gap-1">
                      <Link
                        href={`/economic-calendar/${entry.id}`}
                        className="line-clamp-1 font-medium break-words hover:underline"
                      >
                        {formatEconomicCalendarValue(
                          entry.title,
                          "Sự kiện chưa có tiêu đề"
                        )}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        Mã mục #{entry.id}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="w-24 text-sm">
                    <span className="font-medium text-foreground">
                      {formatCurrency(entry.currencyCode)}
                    </span>
                  </TableCell>
                  <TableCell className="w-28">
                    <Badge
                      variant={getEconomicCalendarImpactVariant(entry.impact)}
                    >
                      {getEconomicCalendarImpactLabel(entry.impact)}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-32">
                    <Badge
                      variant={getEconomicCalendarStatusVariant(
                        entry.status,
                        entry.contentAvailable
                      )}
                    >
                      {getEconomicCalendarStatusLabel(
                        entry.status,
                        entry.contentAvailable
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-44">
                    <div className="flex flex-col gap-1">
                      <AppTimeMetadata icon={CalendarClock}>
                        Công bố {formatDateTime(entry.scheduledAt)}
                      </AppTimeMetadata>
                      <AppTimeMetadata icon={RefreshCcw}>
                        Đồng bộ {formatDateTime(entry.syncedAt)}
                      </AppTimeMetadata>
                    </div>
                  </TableCell>
                  <TableCell className="w-40 max-w-[10rem] text-sm text-muted-foreground">
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="truncate">
                        Actual: {formatEconomicCalendarValue(entry.actualValue)}
                      </span>
                      <span className="truncate">
                        Forecast:{" "}
                        {formatEconomicCalendarValue(entry.forecastValue)}
                      </span>
                      <span className="truncate">
                        Previous:{" "}
                        {formatEconomicCalendarValue(entry.previousValue)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="w-20 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        asChild
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Link href={`/economic-calendar/${entry.id}`}>
                          <Eye data-icon="inline-start" />
                          <span className="sr-only">
                            Xem chi tiết lịch kinh tế
                          </span>
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <AppListTableEmptyState colSpan={7}>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Landmark className="text-muted-foreground" />
                  </EmptyMedia>
                  <EmptyTitle>Chưa có dữ liệu lịch kinh tế</EmptyTitle>
                  <EmptyDescription>
                    Không có mục lịch kinh tế nào khớp với bộ lọc hiện tại.
                  </EmptyDescription>
                </EmptyHeader>
              </AppListTableEmptyState>
            )}
          </TableBody>
        </Table>
      </AppListTable>

      <AppPaginationControls page={economicCalendarPage} className="mt-4" />
    </div>
  )
}
