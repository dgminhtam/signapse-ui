import { Suspense } from "react"

import { getEconomicCalendarEntries } from "@/app/api/economic-calendar/action"
import { ECONOMIC_CALENDAR_READ_PERMISSIONS } from "@/app/lib/economic-calendar/permissions"
import { hasAnyPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { buildFilterQuery, buildSortQuery } from "@/app/lib/utils"
import { AccessDenied } from "@/components/access-denied"
import {
  AppListTable,
  AppListTableHead,
  AppListTableHeaderRow,
} from "@/components/app-list-table"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { EconomicCalendarList } from "./economic-calendar-list"

interface EconomicCalendarPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function EconomicCalendarPage({
  searchParams,
}: EconomicCalendarPageProps) {
  const permissions = await getCurrentPermissions()

  if (!hasAnyPermission(permissions, ECONOMIC_CALENDAR_READ_PERMISSIONS)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lịch kinh tế</CardTitle>
          <CardDescription>
            Theo dõi các mốc công bố kinh tế và trạng thái dữ liệu đã đồng bộ từ
            backend.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <AccessDenied
            description="Bạn không có quyền truy cập lịch kinh tế."
            permission={ECONOMIC_CALENDAR_READ_PERMISSIONS[0]}
          />
        </CardContent>
      </Card>
    )
  }

  const params = await searchParams
  const page = Number(params.page) || 1
  const size = Number(params.size) || 10
  const sort = typeof params.sort === "string" ? params.sort : "scheduledAt_desc"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch kinh tế</CardTitle>
        <CardDescription>
          Duyệt dữ liệu lịch kinh tế theo tiền tệ, tác động, trạng thái nội dung
          và các giá trị actual, forecast, previous.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <Suspense fallback={<EconomicCalendarListSkeleton />}>
          <EconomicCalendarListContent
            page={page}
            size={size}
            sort={sort}
            searchParams={params}
          />
        </Suspense>
      </CardContent>
    </Card>
  )
}

async function EconomicCalendarListContent({
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
  const filterParams = { ...searchParams }
  delete filterParams.page
  delete filterParams.size
  delete filterParams.sort
  const filter = buildFilterQuery(filterParams)
  const economicCalendarPage = await getEconomicCalendarEntries({
    page: page - 1,
    size,
    filter,
    sort: buildSortQuery(sort),
  })

  return <EconomicCalendarList economicCalendarPage={economicCalendarPage} />
}

function EconomicCalendarListSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex w-full flex-1 flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
          <Skeleton className="h-10 w-full sm:w-[180px]" />
          <Skeleton className="h-10 w-full sm:max-w-sm" />
        </div>
        <div className="flex w-full flex-col gap-2 rounded-xl border border-border/60 bg-muted/20 p-2 sm:w-auto sm:flex-row sm:items-center">
          <Skeleton className="h-8 w-full sm:w-[200px]" />
          <Skeleton className="h-8 w-full sm:w-[120px]" />
        </div>
      </div>

      <AppListTable>
        <Table>
          <TableHeader>
            <AppListTableHeaderRow>
              <AppListTableHead>Sự kiện</AppListTableHead>
              <AppListTableHead>Tiền tệ</AppListTableHead>
              <AppListTableHead>Tác động</AppListTableHead>
              <AppListTableHead>Trạng thái</AppListTableHead>
              <AppListTableHead>Thời gian</AppListTableHead>
              <AppListTableHead>Giá trị</AppListTableHead>
              <AppListTableHead className="text-right">Thao tác</AppListTableHead>
            </AppListTableHeaderRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="hover:bg-transparent">
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-[260px]" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end">
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AppListTable>

      <Skeleton className="h-16 w-full rounded-xl" />
    </div>
  )
}
