import { Suspense } from "react"
import { CronjobListPage } from "@/app/(main)/cronjobs/cronjob-list"
import { getCronjobs } from "@/app/api/cronjobs/action"
import { buildSortQuery, buildFilterQuery } from "@/app/lib/utils"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

interface CronjobPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: CronjobPageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cronjob Management</CardTitle>
        <CardDescription>
          List, search, and manage all system cronjobs.
        </CardDescription>
      </CardHeader>

      <Separator />

      <Suspense fallback={<CronjobListSkeleton />}>
        <CronjobListContent searchParamsPromise={searchParams} />
      </Suspense>
    </Card>
  )
}

async function CronjobListContent({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParamsPromise
  const { page = "1", size = "12", sort = "", ...filterParams } = resolvedParams

  const pageIndex = Math.max(0, Number(page) - 1)
  const filter = buildFilterQuery(filterParams)

  const cronjobPage = await getCronjobs({
    filter: filter,
    page: pageIndex,
    size: Number(size),
    sort: buildSortQuery(sort as string),
  })

  return (
    <CardContent>
      <CronjobListPage cronjobPage={cronjobPage} />
    </CardContent>
  )
}

function CronjobListSkeleton() {
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
        <div className="flex h-10 items-center gap-4 border-b bg-muted/50 px-4 text-center">
          <Skeleton className="h-4 w-32 text-left" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="ml-auto h-4 w-20" />
        </div>

        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex h-16 items-center gap-4 border-b px-4 last:border-0 text-center"
          >
            <div className="min-w-[150px] flex-1 text-left space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32 font-mono" />
            <Skeleton className="h-4 w-32" />
            <div className="ml-auto flex gap-2">
              <Skeleton className="h-8 w-8" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-2">
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
