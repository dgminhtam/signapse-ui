import { Suspense } from "react"
import { getEconomicEvents } from "@/app/api/economic-calendar/action"
import { EconomicCalendarList } from "./economic-calendar-list"
import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { buildFilterQuery, buildSortQuery } from "@/app/lib/utils"
import { AccessDenied } from "@/components/access-denied"
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

export default async function EconomicCalendarPage({ searchParams }: PageProps) {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, "event:read")) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Economic Calendar</CardTitle>
          <CardDescription>
            Track and manage international economic events that impact the financial markets.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <AccessDenied
            description="You do not have permission to view economic calendar data."
            permission="event:read"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Economic Calendar</CardTitle>
        <CardDescription>
          Track and manage international economic events that impact the financial markets.
        </CardDescription>
      </CardHeader>

      <Separator />

      <Suspense fallback={<ListSkeleton />}>
        <EconomicCalendarContent searchParamsPromise={searchParams} />
      </Suspense>
    </Card>
  )
}

async function EconomicCalendarContent({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParamsPromise
  const { page = "1", size = "12", sort = "eventDate_desc", ...filterParams } = resolvedParams

  const pageIndex = Math.max(0, Number(page) - 1)
  const filter = buildFilterQuery(filterParams)
  const sortQuery = buildSortQuery(sort as string)

  const eventPage = await getEconomicEvents({
    page: pageIndex,
    size: Number(size),
    sort: sortQuery,
    filter,
  })

  return (
    <CardContent className="pt-6">
      <EconomicCalendarList eventPage={eventPage} />
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
        <Skeleton className="h-10 w-[180px]" />
      </div>

      <div className="rounded-md border">
        <div className="flex h-10 items-center justify-between gap-4 border-b bg-muted/50 px-4">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16 ml-auto" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex h-16 items-center justify-between gap-4 border-b px-4 last:border-0">
            <div className="w-1/4 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
            <div className="ml-auto flex gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between">
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
