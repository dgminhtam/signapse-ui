import { Suspense } from "react"

import { getSystemPrompts } from "@/app/api/system-prompts/action"
import { canReadSystemPrompts } from "@/app/lib/system-prompts/permissions"
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

import { SystemPromptList } from "./system-prompt-list"

interface SystemPromptsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SystemPromptsPage({
  searchParams,
}: SystemPromptsPageProps) {
  const permissions = await getCurrentPermissions()

  if (!canReadSystemPrompts(permissions)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Prompt hệ thống</CardTitle>
          <CardDescription>
            Quản lý prompt điều khiển các workflow AI của hệ thống.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <AccessDenied
            description="Bạn không có quyền xem prompt hệ thống."
            permission="system-prompt:read"
          />
        </CardContent>
      </Card>
    )
  }

  const params = await searchParams
  const page = Number(params.page) || 1
  const size = Number(params.size) || 10
  const sort =
    typeof params.sort === "string" ? params.sort : "lastModifiedDate_desc"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Prompt hệ thống</CardTitle>
        <CardDescription>
          Quản lý nội dung prompt đang điều khiển các workflow AI như lọc tin,
          suy luận sự kiện và tổng hợp truy vấn thị trường.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <Suspense fallback={<SystemPromptListSkeleton />}>
          <SystemPromptListContent
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

async function SystemPromptListContent({
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
  const promptPage = await getSystemPrompts({
    page: page - 1,
    size,
    filter,
    sort: buildSortQuery(sort),
  })

  return <SystemPromptList promptPage={promptPage} />
}

function SystemPromptListSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex w-full flex-1 flex-col gap-4 sm:w-auto sm:flex-row sm:items-center">
          <Skeleton className="h-10 w-full sm:w-[150px]" />
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
              <AppListTableHead>Loại prompt</AppListTableHead>
              <AppListTableHead>Nhóm workflow</AppListTableHead>
              <AppListTableHead>Độ dài</AppListTableHead>
              <AppListTableHead>Cập nhật</AppListTableHead>
              <AppListTableHead>Tạo lúc</AppListTableHead>
              <AppListTableHead className="text-right">Thao tác</AppListTableHead>
            </AppListTableHeaderRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="hover:bg-transparent">
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-52" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24 rounded-full" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
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
