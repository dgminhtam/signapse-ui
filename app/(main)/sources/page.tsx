import { Suspense } from "react"

import { getSources } from "@/app/api/sources/action"
import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { buildFilterQuery, buildSortQuery } from "@/app/lib/utils"
import { AccessDenied } from "@/components/access-denied"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { SourceListPage } from "./source-list"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SourcesPage({ searchParams }: PageProps) {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, "source:read")) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nguồn dữ liệu</CardTitle>
          <CardDescription>
            Quản lý các nguồn dữ liệu, trạng thái ingest và quyền thao tác tương ứng.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <AccessDenied
            description="Bạn không có quyền xem khu vực quản lý nguồn dữ liệu."
            permission="source:read"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nguồn dữ liệu</CardTitle>
        <CardDescription>
          Quản lý danh sách nguồn theo contract backend hiện tại, bao gồm trạng thái
          ingest và nguồn do hệ thống quản lý.
        </CardDescription>
      </CardHeader>

      <Separator />

      <Suspense fallback={<ListSkeleton />}>
        <SourceContent searchParamsPromise={searchParams} />
      </Suspense>
    </Card>
  )
}

async function SourceContent({
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

  const sourcePage = await getSources({
    page: pageIndex,
    size: Number(size),
    sort: sortQuery,
    filter,
  })

  return (
    <CardContent className="pt-6">
      <SourceListPage sourcePage={sourcePage} />
    </CardContent>
  )
}

function ListSkeleton() {
  return (
    <CardContent className="flex flex-col gap-6 pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="flex w-full flex-1 items-center gap-4 sm:w-auto">
          <Skeleton className="h-10 w-[160px]" />
          <Skeleton className="h-10 w-full max-w-sm" />
        </div>
        <Skeleton className="h-10 w-[180px]" />
      </div>

      <div className="rounded-md border">
        <div className="flex h-10 items-center justify-between gap-4 border-b bg-muted/50 px-4">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="ml-auto h-4 w-20" />
        </div>
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className="flex h-16 items-center justify-between gap-4 border-b px-4 last:border-0"
          >
            <div className="w-1/3 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-5 w-10 rounded-full" />
            <div className="ml-auto flex gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </CardContent>
  )
}
