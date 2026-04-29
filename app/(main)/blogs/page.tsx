import { Suspense } from "react"
import { BlogListPage } from "@/app/(main)/blogs/blog-list"
import { getBlogs } from "@/app/api/blogs/action"
import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { buildSortQuery, buildFilterQuery } from "@/app/lib/utils"
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

interface BlogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: BlogPageProps) {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, "blog:read")) {
    return (
      <AccessDenied
        description="Bạn không có quyền xem danh sách bài viết."
        permission="blog:read"
      />
    )
  }

  return (
    <Suspense fallback={<BlogListSkeleton />}>
      <BlogListContent searchParamsPromise={searchParams} />
    </Suspense>
  )
}

async function BlogListContent({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParamsPromise
  const { page = "1", size = "10", sort = "", ...filterParams } = resolvedParams

  const pageIndex = Math.max(0, Number(page) - 1)
  const filter = buildFilterQuery(filterParams)

  const blogPage = await getBlogs({
    filter: filter,
    page: pageIndex,
    size: Number(size),
    sort: buildSortQuery(sort as string),
  })

  return <BlogListPage blogPage={blogPage} />
}

function BlogListSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col justify-between gap-4 sm:flex-row">
        <div className="flex w-full flex-1 items-center gap-4 sm:w-auto">
          <Skeleton className="h-9 w-[160px]" />
          <Skeleton className="h-9 w-full max-w-sm" />
        </div>
        <Skeleton className="h-9 w-[180px]" />
      </div>

      <AppListTable>
        <Table>
          <TableHeader>
            <AppListTableHeaderRow>
              <AppListTableHead className="w-[58%]">
                <Skeleton className="h-4 w-32" />
              </AppListTableHead>
              <AppListTableHead className="w-32 text-center">
                <Skeleton className="mx-auto h-4 w-20" />
              </AppListTableHead>
              <AppListTableHead className="w-40 text-center">
                <Skeleton className="mx-auto h-4 w-32" />
              </AppListTableHead>
              <AppListTableHead className="w-28 text-center">
                <Skeleton className="ml-auto h-4 w-20" />
              </AppListTableHead>
            </AppListTableHeaderRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell className="align-top whitespace-normal">
                  <div className="flex min-w-0 flex-col gap-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </TableCell>
                <TableCell className="w-32 text-center">
                  <Skeleton className="mx-auto h-6 w-20 rounded-full" />
                </TableCell>
                <TableCell className="w-40 text-center">
                  <Skeleton className="mx-auto h-4 w-32" />
                </TableCell>
                <TableCell className="w-28 text-right">
                  <div className="flex justify-end gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </AppListTable>

      <div className="mt-4 flex items-center justify-between gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  )
}
