import { Suspense } from "react"
import { getArticles } from "@/app/api/articles/action"
import { ArticleList } from "./article-list"
import { ArticleSearch } from "./article-search"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

interface PageProps {
  searchParams: Promise<{
    page?: string
    size?: string
    filter?: string
  }>
}

export default async function ArticlesPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Number(params.page) || 1
  const size = Number(params.size) || 10
  const filter = params.filter || ""

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Articles</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Article Management</CardTitle>
          <CardDescription>
            View and manage articles aggregated from your news sources.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <ArticleSearch />
            </div>

            <Suspense fallback={<ArticleListSkeleton />}>
              <ArticleListData page={page} size={size} filter={filter} />
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

async function ArticleListData({
  page,
  size,
  filter,
}: {
  page: number
  size: number
  filter: string
}) {
  const articlePage = await getArticles({
    page: page - 1,
    size,
    filter,
  })

  return <ArticleList articlePage={articlePage} />
}

function ArticleListSkeleton() {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[400px]">Article</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Published Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-3 w-[200px]" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-32" />
              </TableCell>
              <TableCell className="text-right">
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
    </div>
  )
}
