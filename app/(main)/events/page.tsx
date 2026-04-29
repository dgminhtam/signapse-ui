import { Suspense } from "react"

import { getEvents } from "@/app/api/events/action"
import { EVENT_READ_PERMISSIONS } from "@/app/lib/events/permissions"
import { hasAnyPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { buildFilterQuery, buildSortQuery } from "@/app/lib/utils"
import { AccessDenied } from "@/components/access-denied"
import {
  AppListTable,
  AppListTableHead,
  AppListTableHeaderRow,
} from "@/components/app-list-table"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { EventList } from "./event-list"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function EventsPage({ searchParams }: PageProps) {
  const permissions = await getCurrentPermissions()

  if (!hasAnyPermission(permissions, EVENT_READ_PERMISSIONS)) {
    return (
      <AccessDenied
        description="Bạn không có quyền truy cập khu vực quản lý sự kiện."
        permission={EVENT_READ_PERMISSIONS[0]}
      />
    )
  }

  const params = await searchParams
  const page = Number(params.page) || 1
  const size = Number(params.size) || 10
  const sort = typeof params.sort === "string" ? params.sort : "occurredAt_desc"

  return (
    <Suspense fallback={<EventListSkeleton />}>
      <EventListContent
        page={page}
        size={size}
        sort={sort}
        searchParams={params}
      />
    </Suspense>
  )
}

async function EventListContent({
  page,
  size,
  sort,
  searchParams,
}: {
  page: number
  size: number
  sort: string
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const filter = buildFilterQuery(searchParams)
  const sortQuery = buildSortQuery(sort)
  const eventPage = await getEvents({
    page: page - 1,
    size,
    filter,
    sort: sortQuery,
  })

  return <EventList eventPage={eventPage} />
}

function EventListSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex w-full flex-1 flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
          <Skeleton className="h-9 w-[200px]" />
          <Skeleton className="h-9 w-[220px]" />
          <Skeleton className="h-9 flex-1" />
        </div>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
          <Skeleton className="h-9 w-full sm:w-[200px]" />
          <Skeleton className="h-9 w-full sm:w-[120px]" />
        </div>
      </div>

      <AppListTable>
        <Table>
          <TableHeader>
            <AppListTableHeaderRow>
              <AppListTableHead className="w-[44%]">Sự kiện</AppListTableHead>
              <AppListTableHead className="w-36">Trạng thái</AppListTableHead>
              <AppListTableHead className="w-44">Xảy ra lúc</AppListTableHead>
              <AppListTableHead className="w-28">Độ tin cậy</AppListTableHead>
              <AppListTableHead className="w-20 text-right">
                Thao tác
              </AppListTableHead>
            </AppListTableHeaderRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="hover:bg-transparent">
                <TableCell className="align-top whitespace-normal">
                  <div className="flex min-w-0 flex-col gap-2">
                    <Skeleton className="h-4 w-[260px]" />
                    <Skeleton className="h-3 w-[220px]" />
                  </div>
                </TableCell>
                <TableCell className="w-36">
                  <Skeleton className="h-6 w-32" />
                </TableCell>
                <TableCell className="w-44">
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell className="w-28">
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="w-20 text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AppListTable>

      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-28" />
          </div>
          <Skeleton className="h-4 w-56" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  )
}
