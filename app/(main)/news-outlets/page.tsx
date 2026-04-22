import { Suspense } from "react"

import { getNewsOutlets } from "@/app/api/news-outlets/action"
import { hasPermission } from "@/app/lib/permissions"
import {
  NEWS_OUTLET_READ_PERMISSION,
} from "@/app/lib/news-outlets/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
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

import { NewsOutletListPage } from "./news-outlet-list"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function NewsOutletsPage({ searchParams }: PageProps) {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, NEWS_OUTLET_READ_PERMISSION)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nguồn tin</CardTitle>
          <CardDescription>
            Quản lý danh sách nguồn tin và trạng thái kích hoạt theo contract mới
            của backend.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <AccessDenied
            description="Bạn không có quyền xem khu vực quản lý nguồn tin."
            permission={NEWS_OUTLET_READ_PERMISSION}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nguồn tin</CardTitle>
        <CardDescription>
          Quản lý danh sách news outlet theo contract backend hiện tại, bao gồm
          thông tin trang chủ, RSS, slug và trạng thái kích hoạt.
        </CardDescription>
      </CardHeader>

      <Separator />

      <Suspense fallback={<ListSkeleton />}>
        <NewsOutletContent searchParamsPromise={searchParams} />
      </Suspense>
    </Card>
  )
}

async function NewsOutletContent({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParamsPromise
  const { page = "1", size = "12", sort = "id_desc", ...filterParams } =
    resolvedParams

  const pageIndex = Math.max(0, Number(page) - 1)
  const filter = buildFilterQuery(filterParams)
  const sortQuery = buildSortQuery(sort as string)

  const newsOutletPage = await getNewsOutlets({
    page: pageIndex,
    size: Number(size),
    sort: sortQuery,
    filter,
  })

  return (
    <CardContent className="pt-6">
      <NewsOutletListPage newsOutletPage={newsOutletPage} />
    </CardContent>
  )
}

function ListSkeleton() {
  return (
    <CardContent className="flex flex-col gap-6 pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex w-full flex-1 flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
          <Skeleton className="h-10 w-[160px]" />
          <Skeleton className="h-10 w-full max-w-sm" />
        </div>
        <div className="flex w-full flex-col gap-2 rounded-xl border border-border/60 bg-muted/20 p-2 sm:w-auto sm:flex-row sm:items-center">
          <Skeleton className="h-8 w-full sm:w-[200px]" />
          <Skeleton className="h-8 w-full sm:w-[120px]" />
        </div>
      </div>

      <div className="rounded-md border">
        <div className="flex h-10 items-center justify-between gap-4 border-b bg-muted/50 px-4">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="ml-auto h-4 w-20" />
        </div>
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex h-20 items-center justify-between gap-4 border-b px-4 last:border-0"
          >
            <div className="flex w-1/3 flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-full" />
            </div>
            <Skeleton className="h-6 w-24 rounded" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-5 w-10 rounded-full" />
            <div className="ml-auto flex gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-border/60 bg-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-28" />
          </div>
          <Skeleton className="h-4 w-52" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </CardContent>
  )
}
