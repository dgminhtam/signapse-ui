import { Suspense } from "react"

import { getAiProviderConfigs } from "@/app/api/ai-provider-configs/action"
import { hasPermission } from "@/app/lib/permissions"
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

import { AiProviderConfigListPage } from "./ai-provider-config-list"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AiProviderConfigsPage({ searchParams }: PageProps) {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, "ai-provider-config:read")) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cấu hình nhà cung cấp AI</CardTitle>
          <CardDescription>
            Quản lý thông tin xác thực, model đã chọn và nhà cung cấp AI mặc định.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <AccessDenied
            description="Bạn không có quyền xem cấu hình nhà cung cấp AI."
            permission="ai-provider-config:read"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cấu hình nhà cung cấp AI</CardTitle>
        <CardDescription>
          Quản lý thông tin xác thực, model đã chọn và nhà cung cấp AI mặc định.
        </CardDescription>
      </CardHeader>

      <Separator />

      <Suspense fallback={<ListSkeleton />}>
        <AiProviderConfigsContent searchParamsPromise={searchParams} />
      </Suspense>
    </Card>
  )
}

async function AiProviderConfigsContent({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParamsPromise
  const { page = "1", size = "10", sort = "id_desc", ...filterParams } =
    resolvedParams

  const providerPage = await getAiProviderConfigs({
    page: Math.max(0, Number(page) - 1),
    size: Number(size),
    sort: buildSortQuery(sort as string),
    filter: buildFilterQuery(filterParams),
  })

  return (
    <CardContent className="pt-6">
      <AiProviderConfigListPage providerPage={providerPage} />
    </CardContent>
  )
}

function ListSkeleton() {
  return (
    <CardContent className="pt-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex w-full flex-1 flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-full max-w-sm" />
          </div>
          <div className="flex w-full flex-col gap-2 rounded-xl border border-border/60 bg-muted/20 p-2 sm:w-auto sm:flex-row sm:items-center">
            <Skeleton className="h-8 w-full sm:w-[200px]" />
            <Skeleton className="h-8 w-full sm:w-[120px]" />
          </div>
        </div>

        <div className="rounded-md border">
          <div className="grid grid-cols-6 gap-4 border-b bg-muted/50 px-4 py-3">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-6 gap-4 border-b px-4 py-4 last:border-0"
            >
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-44" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-6 w-12 rounded-full" />
              <Skeleton className="h-4 w-28" />
              <div className="flex justify-end gap-2">
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
                <Skeleton className="h-8 w-8 rounded" />
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
      </div>
    </CardContent>
  )
}
