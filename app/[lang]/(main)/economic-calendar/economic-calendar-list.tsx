"use client"

import { CalendarClock, Eye, Landmark, RefreshCcw } from "lucide-react"
import { LocalizedLink as Link } from "@/components/localized-link"

import { Page } from "@/app/lib/definitions"
import { useLocalization } from "@/app/lib/i18n/provider"
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

function formatCurrency(value: string | undefined, fallback: string) {
  return value?.trim().toUpperCase() || fallback
}

export function EconomicCalendarList({
  economicCalendarPage,
}: EconomicCalendarListProps) {
  const { dictionary, formatDateTime, formatMessage } = useLocalization()
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
            label={dictionary.economicCalendar.sortLabel}
            placeholder={dictionary.lists.sortPlaceholder}
            options={[
              {
                label: dictionary.economicCalendar.scheduledNewest,
                value: "scheduledAt_desc",
              },
              {
                label: dictionary.economicCalendar.scheduledOldest,
                value: "scheduledAt_asc",
              },
              {
                label: dictionary.economicCalendar.syncedNewest,
                value: "syncedAt_desc",
              },
              {
                label: dictionary.economicCalendar.createdNewest,
                value: "createdDate_desc",
              },
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
              <AppListTableHead className="w-[32%]">
                {dictionary.economicCalendar.eventColumn}
              </AppListTableHead>
              <AppListTableHead className="w-24">
                {dictionary.economicCalendar.currencyColumn}
              </AppListTableHead>
              <AppListTableHead className="w-28">
                {dictionary.economicCalendar.impactColumn}
              </AppListTableHead>
              <AppListTableHead className="w-32">
                {dictionary.economicCalendar.statusColumn}
              </AppListTableHead>
              <AppListTableHead className="w-44">
                {dictionary.economicCalendar.timeColumn}
              </AppListTableHead>
              <AppListTableHead className="w-40">
                {dictionary.economicCalendar.valueColumn}
              </AppListTableHead>
              <AppListTableHead className="w-20 text-right">
                {dictionary.economicCalendar.actionsColumn}
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
                          dictionary.economicCalendar.untitled
                        )}
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {formatMessage(dictionary.economicCalendar.itemId, {
                          id: entry.id,
                        })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="w-24 text-sm">
                    <span className="font-medium text-foreground">
                      {formatCurrency(
                        entry.currencyCode,
                        dictionary.common.notAvailable
                      )}
                    </span>
                  </TableCell>
                  <TableCell className="w-28">
                    <Badge
                      variant={getEconomicCalendarImpactVariant(entry.impact)}
                    >
                      {getEconomicCalendarImpactLabel(entry.impact, dictionary)}
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
                        entry.contentAvailable,
                        dictionary
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="w-44">
                    <div className="flex flex-col gap-1">
                      <AppTimeMetadata icon={CalendarClock}>
                        {formatMessage(dictionary.economicCalendar.publishedAt, {
                          time: formatDateTime(
                            entry.scheduledAt,
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                            dictionary.common.notAvailable
                          ),
                        })}
                      </AppTimeMetadata>
                      <AppTimeMetadata icon={RefreshCcw}>
                        {formatMessage(dictionary.economicCalendar.syncedAt, {
                          time: formatDateTime(
                            entry.syncedAt,
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            },
                            dictionary.common.notAvailable
                          ),
                        })}
                      </AppTimeMetadata>
                    </div>
                  </TableCell>
                  <TableCell className="w-40 max-w-[10rem] text-sm text-muted-foreground">
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="truncate">
                        {dictionary.economicCalendar.actual}:{" "}
                        {formatEconomicCalendarValue(
                          entry.actualValue,
                          dictionary.common.notAvailable
                        )}
                      </span>
                      <span className="truncate">
                        {dictionary.economicCalendar.forecast}:{" "}
                        {formatEconomicCalendarValue(
                          entry.forecastValue,
                          dictionary.common.notAvailable
                        )}
                      </span>
                      <span className="truncate">
                        {dictionary.economicCalendar.previous}:{" "}
                        {formatEconomicCalendarValue(
                          entry.previousValue,
                          dictionary.common.notAvailable
                        )}
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
                            {dictionary.economicCalendar.viewDetail}
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
                  <EmptyTitle>
                    {dictionary.economicCalendar.emptyTitle}
                  </EmptyTitle>
                  <EmptyDescription>
                    {dictionary.economicCalendar.emptyDescription}
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
