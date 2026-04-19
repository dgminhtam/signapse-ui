import { Suspense } from "react"

import { getSourceDocuments } from "@/app/api/source-documents/action"
import { hasAnyPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { SOURCE_DOCUMENT_READ_PERMISSIONS } from "@/app/lib/source-documents/permissions"
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

import { SourceDocumentList } from "./source-document-list"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SourceDocumentsPage({ searchParams }: PageProps) {
  const permissions = await getCurrentPermissions()

  if (!hasAnyPermission(permissions, SOURCE_DOCUMENT_READ_PERMISSIONS)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Tài liệu nguồn</CardTitle>
          <CardDescription>
            Xem và quản lý toàn bộ nội dung đã được ingest từ các nguồn dữ liệu.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <AccessDenied
            description="Bạn không có quyền truy cập khu vực quản lý tài liệu nguồn."
            permission={SOURCE_DOCUMENT_READ_PERMISSIONS[0]}
          />
        </CardContent>
      </Card>
    )
  }

  const params = await searchParams
  const page = Number(params.page) || 1
  const size = Number(params.size) || 10
  const sort =
    typeof params.sort === "string" ? params.sort : "publishedAt_desc"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tài liệu nguồn</CardTitle>
        <CardDescription>
          Theo dõi nội dung đã ingest, trạng thái xử lý và thao tác quản trị theo
          contract `source-documents` mới.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <Suspense fallback={<SourceDocumentListSkeleton />}>
          <SourceDocumentListContent
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

async function SourceDocumentListContent({
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

  const sourceDocumentPage = await getSourceDocuments({
    page: page - 1,
    size,
    filter,
    sort: sortQuery,
  })

  return <SourceDocumentList sourceDocumentPage={sourceDocumentPage} />
}

function SourceDocumentListSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-4">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 flex-1" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[220px]" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[360px]">Tài liệu</TableHead>
              <TableHead>Loại</TableHead>
              <TableHead>Thời gian</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="hover:bg-transparent">
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-[260px]" />
                    <Skeleton className="h-3 w-[120px]" />
                    <Skeleton className="h-3 w-[220px]" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24" />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-6 w-28" />
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-6 w-32" />
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
                    <Skeleton className="h-8 w-8 rounded" />
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
