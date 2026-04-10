import { Suspense } from "react"
import { getNewsSources } from "@/app/api/news-sources/action"
import { NewsSourceListPage } from "./news-source-list"
import { buildFilterQuery, buildSortQuery } from "@/app/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function NewsSourcesPage({ searchParams }: PageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>News Sources</CardTitle>
        <CardDescription>
          Manage external news sources and RSS feeds for automated data collection.
        </CardDescription>
      </CardHeader>

      <Separator />

      <Suspense fallback={<ListSkeleton />}>
        <NewsSourceContent searchParamsPromise={searchParams} />
      </Suspense>
    </Card>
  )
}

async function NewsSourceContent({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParamsPromise
  const { page = "1", size = "12", sort = "id_desc", ...filterParams } = resolvedParams

  const pageIndex = Math.max(0, Number(page) - 1)
  const filter = buildFilterQuery(filterParams)
  const sortQuery = buildSortQuery(sort as string)

  const newsSourcePage = await getNewsSources({
    page: pageIndex,
    size: Number(size),
    sort: sortQuery,
    filter,
  })

  return (
    <CardContent className="pt-6">
      <NewsSourceListPage newsSourcePage={newsSourcePage} />
    </CardContent>
  )
}

function ListSkeleton() {
  return (
    <CardContent className="space-y-6 pt-6">
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
          <Skeleton className="h-4 w-20 ml-auto" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex h-16 items-center justify-between gap-4 border-b px-4 last:border-0">
            <div className="w-1/3 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-12 rounded-full" />
            <Skeleton className="h-4 w-32" />
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
