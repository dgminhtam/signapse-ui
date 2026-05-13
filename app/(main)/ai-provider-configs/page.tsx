import { Suspense } from "react"

import { getAiProviderConfigs } from "@/app/api/ai-provider-configs/action"
import { hasPermission } from "@/app/lib/permissions"
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

import { AiProviderConfigListPage } from "./ai-provider-config-list"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AiProviderConfigsPage({
  searchParams,
}: PageProps) {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, "ai-provider-config:read")) {
    return (
      <AccessDenied
        description="Bạn không có quyền xem cấu hình nhà cung cấp AI."
        permission="ai-provider-config:read"
      />
    )
  }

  return (
    <Suspense fallback={<ListSkeleton />}>
      <AiProviderConfigsContent searchParamsPromise={searchParams} />
    </Suspense>
  )
}

async function AiProviderConfigsContent({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParamsPromise
  const {
    page = "1",
    size = "10",
    sort = "id_desc",
    ...filterParams
  } = resolvedParams

  const providerPage = await getAiProviderConfigs({
    page: Math.max(0, Number(page) - 1),
    size: Number(size),
    sort: buildSortQuery(sort as string),
    filter: buildFilterQuery(filterParams),
  })

  return <AiProviderConfigListPage providerPage={providerPage} />
}

function ListSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex w-full flex-1 flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
          <Skeleton className="h-9 w-[180px]" />
          <Skeleton className="h-9 w-full max-w-sm" />
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
              <AppListTableHead className="w-[32%]">
                <Skeleton className="h-4 w-24" />
              </AppListTableHead>
              <AppListTableHead className="w-36">
                <Skeleton className="h-4 w-20" />
              </AppListTableHead>
              <AppListTableHead className="w-[24%]">
                <Skeleton className="h-4 w-24" />
              </AppListTableHead>
              <AppListTableHead className="w-36 text-center">
                <Skeleton className="mx-auto h-4 w-16" />
              </AppListTableHead>
              <AppListTableHead className="w-40">
                <Skeleton className="h-4 w-20" />
              </AppListTableHead>
              <AppListTableHead className="w-28 text-right">
                <Skeleton className="ml-auto h-4 w-20" />
              </AppListTableHead>
            </AppListTableHeaderRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell className="align-top whitespace-normal">
                  <div className="flex min-w-0 flex-col gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-44" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </TableCell>
                <TableCell className="w-36">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>
                <TableCell className="w-[24%] max-w-[18rem]">
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell className="w-36 text-center">
                  <Skeleton className="mx-auto h-6 w-12 rounded-full" />
                </TableCell>
                <TableCell className="w-40">
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell className="w-28">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
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
  )
}
