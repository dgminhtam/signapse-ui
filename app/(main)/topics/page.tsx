import { Suspense } from "react"

import { getTopics } from "@/app/api/topics/action"
import { buildFilterQuery, buildSortQuery } from "@/app/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

import { TopicListPage } from "./topic-list"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function TopicsPage({ searchParams }: PageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Topics</CardTitle>
        <CardDescription>
          Manage the topics, keywords, and entities used across the knowledge graph.
        </CardDescription>
      </CardHeader>

      <Separator />

      <Suspense fallback={<ListSkeleton />}>
        <TopicsContent searchParamsPromise={searchParams} />
      </Suspense>
    </Card>
  )
}

async function TopicsContent({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParamsPromise
  const { page = "1", size = "12", sort = "id_desc", ...filterParams } = resolvedParams

  const topicPage = await getTopics({
    page: Math.max(0, Number(page) - 1),
    size: Number(size),
    sort: buildSortQuery(sort as string),
    filter: buildFilterQuery(filterParams),
  })

  return (
    <CardContent className="pt-6">
      <TopicListPage topicPage={topicPage} />
    </CardContent>
  )
}

function ListSkeleton() {
  return (
    <CardContent className="space-y-6 pt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between">
        <div className="flex w-full flex-1 items-center gap-4 sm:w-auto">
          <Skeleton className="h-10 w-[140px]" />
          <Skeleton className="h-10 w-full max-w-sm" />
        </div>
        <Skeleton className="h-10 w-[150px]" />
      </div>

      <div className="rounded-md border">
        <div className="grid grid-cols-5 gap-4 border-b bg-muted/50 px-4 py-3">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="mx-auto h-4 w-16" />
          <Skeleton className="mx-auto h-4 w-24" />
          <Skeleton className="ml-auto h-4 w-20" />
        </div>
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="grid grid-cols-5 gap-4 border-b px-4 py-4 last:border-0">
            <div className="space-y-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-52" />
            </div>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mx-auto h-6 w-12 rounded-full" />
            <Skeleton className="mx-auto h-4 w-28" />
            <div className="flex justify-end gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </CardContent>
  )
}
