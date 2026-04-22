import { Suspense } from "react"

import { getNewsArticles } from "@/app/api/news-articles/action"
import { hasAnyPermission } from "@/app/lib/permissions"
import { NEWS_ARTICLE_READ_PERMISSIONS } from "@/app/lib/news-articles/permissions"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { NewsArticleList } from "./news-article-list"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function NewsArticlesPage({ searchParams }: PageProps) {
  const permissions = await getCurrentPermissions()

  if (!hasAnyPermission(permissions, NEWS_ARTICLE_READ_PERMISSIONS)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bai viet tin tuc</CardTitle>
          <CardDescription>
            Xem va quan ly danh sach bai viet tin tuc theo contract backend hien tai.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <AccessDenied
            description="Ban khong co quyen truy cap khu vuc quan ly bai viet tin tuc."
            permission={NEWS_ARTICLE_READ_PERMISSIONS[0]}
          />
        </CardContent>
      </Card>
    )
  }

  const params = await searchParams
  const page = Number(params.page) || 1
  const size = Number(params.size) || 10
  const sort = typeof params.sort === "string" ? params.sort : "publishedAt_desc"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bai viet tin tuc</CardTitle>
        <CardDescription>
          Theo doi noi dung da ingest, trang thai bai viet, va cac thao tac operator
          theo surface canon `news-articles`.
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <Suspense fallback={<NewsArticleListSkeleton />}>
          <NewsArticleListContent page={page} size={size} sort={sort} searchParams={params} />
        </Suspense>
      </CardContent>
    </Card>
  )
}

async function NewsArticleListContent({
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

  const newsArticlePage = await getNewsArticles({
    page: page - 1,
    size,
    filter,
    sort: sortQuery,
  })

  return <NewsArticleList newsArticlePage={newsArticlePage} />
}

function NewsArticleListSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-4">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 flex-1" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-[200px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-[360px]">Bai viet</TableHead>
              <TableHead>Nguon tin</TableHead>
              <TableHead>Thoi gian</TableHead>
              <TableHead>Trang thai</TableHead>
              <TableHead className="text-right">Thao tac</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index} className="hover:bg-transparent">
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-[260px]" />
                    <Skeleton className="h-3 w-[220px]" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-28" />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-32" />
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
