import { Suspense } from "react"

import { getAiProviderConfigs } from "@/app/api/ai-provider-configs/action"
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

import { AiProviderConfigListPage } from "./ai-provider-config-list"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function AiProviderConfigsPage({ searchParams }: PageProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Provider Configs</CardTitle>
        <CardDescription>
          Manage provider credentials, model selection, and the default AI provider.
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
  const { page = "1", size = "10", sort = "id_desc", ...filterParams } = resolvedParams

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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-1 items-center gap-4 sm:w-auto">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-full max-w-sm" />
          </div>
          <Skeleton className="h-10 w-[180px]" />
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
            <div key={index} className="grid grid-cols-6 gap-4 border-b px-4 py-4 last:border-0">
              <div className="space-y-2">
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

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-4 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-8 w-8 rounded" />
          </div>
        </div>
      </div>
    </CardContent>
  )
}
