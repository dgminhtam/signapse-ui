import { Suspense } from "react"

import { getCurrentPermissions } from "@/app/lib/permissions-server"
import {
  canExecuteMarketQueries,
  MARKET_QUERY_EXECUTE_PERMISSIONS,
} from "@/app/lib/market-query/permissions"
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

import { MarketQueryWorkbench } from "./market-query-workbench"

export default async function MarketQueryPage() {
  const permissions = await getCurrentPermissions()

  if (!canExecuteMarketQueries(permissions)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Truy vấn thị trường</CardTitle>
          <CardDescription>
            Đặt câu hỏi dựa trên sự kiện và tài liệu nguồn để nhận bản tổng hợp phân tích
            thị trường ngay trong hệ thống.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <AccessDenied
            description="Bạn không có quyền sử dụng công cụ truy vấn thị trường."
            permission={MARKET_QUERY_EXECUTE_PERMISSIONS[0]}
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Truy vấn thị trường</CardTitle>
        <CardDescription>
          Đặt một câu hỏi để nhận briefing thị trường gồm kết luận, độ tin cậy và bằng chứng liên quan.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <Suspense fallback={<MarketQueryWorkbenchSkeleton />}>
          <MarketQueryWorkbench />
        </Suspense>
      </CardContent>
    </Card>
  )
}

function MarketQueryWorkbenchSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]">
        <div className="rounded-2xl border border-border p-6">
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Skeleton className="h-6 w-28 rounded-full" />
              <Skeleton className="h-6 w-32 rounded-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-5/6" />
            </div>
            <Skeleton className="h-40 w-full rounded-xl" />
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-border p-6">
          <div className="flex flex-col gap-4">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-40 rounded-full" />
              <Skeleton className="h-8 w-44 rounded-full" />
              <Skeleton className="h-8 w-36 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,1fr)]">
        <Skeleton className="h-72 w-full rounded-2xl" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>

      <Skeleton className="h-72 w-full rounded-2xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  )
}
