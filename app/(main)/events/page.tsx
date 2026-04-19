import { Suspense } from "react"

import { getEvents } from "@/app/api/events/action"
import { hasAnyPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { EVENT_READ_PERMISSIONS } from "@/app/lib/events/permissions"
import { buildFilterQuery, buildSortQuery } from "@/app/lib/utils"
import { AccessDenied } from "@/components/access-denied"
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
  TableHead,
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
      <Card>
        <CardHeader>
          <CardTitle>Sự kiện</CardTitle>
          <CardDescription>
            Theo dõi các sự kiện đã được suy diễn từ tài liệu nguồn và trạng thái làm giàu liên quan.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <AccessDenied
            description="Bạn không có quyền truy cập khu vực quản lý sự kiện."
            permission={EVENT_READ_PERMISSIONS[0]}
          />
        </CardContent>
      </Card>
    )
  }

  const params = await searchParams
  const page = Number(params.page) || 1
  const size = Number(params.size) || 10
  const sort = typeof params.sort === "string" ? params.sort : "occurredAt_desc"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sự kiện</CardTitle>
        <CardDescription>
          Duyệt các sự kiện đã được tổng hợp, theo dõi trạng thái làm giàu và kiểm tra chuỗi
          bằng chứng liên quan.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <Suspense fallback={<EventListSkeleton />}>
          <EventListContent page={page} size={size} sort={sort} searchParams={params} />
        </Suspense>
      </CardContent>
    </Card>
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-4">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 flex-1" />
        </div>
        <Skeleton className="h-10 w-[180px]" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[360px]">Sự kiện</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Độ tin cậy</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="hover:bg-transparent">
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-[260px]" />
                    <Skeleton className="h-3 w-[220px]" />
                    <Skeleton className="h-3 w-[180px]" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-28" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
