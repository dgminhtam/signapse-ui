import { redirect } from "next/navigation"

export default function WatchlistsPage() {
  redirect("/")
}

/*

import { getWatchlists } from "@/app/api/watchlists/action"
import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { getActiveWorkspaceForCurrentUser } from "@/app/lib/workspaces/current"
import { AccessDenied } from "@/components/access-denied"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { FolderOpenIcon } from "lucide-react"

import { WatchlistListPage } from "./watchlist-list"

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function WatchlistsPage({ searchParams }: PageProps) {
  const permissions = await getCurrentPermissions()

  if (!hasPermission(permissions, "watchlist:read")) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Watchlists</CardTitle>
          <CardDescription>
            Manage workspace-level watchlists and the assets tracked inside each list.
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <AccessDenied
            description="You do not have permission to view watchlists."
            permission="watchlist:read"
          />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Watchlists</CardTitle>
        <CardDescription>
          Organize tracked assets by workspace and keep each watchlist scoped to the active workspace.
        </CardDescription>
      </CardHeader>

      <Separator />

      <Suspense fallback={<WatchlistsSkeleton />}>
        <WatchlistsContent searchParamsPromise={searchParams} />
      </Suspense>
    </Card>
  )
}

async function WatchlistsContent({
  searchParamsPromise,
}: {
  searchParamsPromise: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const resolvedParams = await searchParamsPromise
  const queryValue = resolvedParams.query
  const query = Array.isArray(queryValue) ? queryValue[0] ?? "" : queryValue ?? ""
  const activeWorkspace = await getActiveWorkspaceForCurrentUser().catch(() => null)

  if (!activeWorkspace) {
    return (
      <CardContent className="pt-6">
        <Empty className="min-h-[320px] rounded-lg border border-dashed">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderOpenIcon />
            </EmptyMedia>
            <EmptyTitle>Chưa có workspace hoạt động</EmptyTitle>
            <EmptyDescription>
              Hãy tạo hoặc chọn một workspace ở sidebar trước khi quản lý watchlist.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </CardContent>
    )
  }

  const watchlistPage = await getWatchlists({
    filter: "",
    page: 0,
    size: 100,
    sort: [{ field: "createdDate", direction: "desc" }],
  })

  const normalizedQuery = query.trim().toLowerCase()
  const filteredWatchlists = normalizedQuery
    ? watchlistPage.content.filter((watchlist) => {
        const inName = watchlist.name.toLowerCase().includes(normalizedQuery)
        const inDescription = watchlist.description?.toLowerCase().includes(normalizedQuery) ?? false
        const inItems = watchlist.items.some(
          (item) =>
            item.assetName.toLowerCase().includes(normalizedQuery) ||
            item.assetSymbol.toLowerCase().includes(normalizedQuery)
        )

        return inName || inDescription || inItems
      })
    : watchlistPage.content

  return (
    <CardContent className="pt-6">
      <WatchlistListPage
        activeWorkspace={activeWorkspace}
        watchlists={filteredWatchlists}
      />
    </CardContent>
  )
}

function WatchlistsSkeleton() {
  return (
    <CardContent className="space-y-6 pt-6">
      <Skeleton className="h-18 w-full rounded-lg" />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-10 w-36" />
      </div>
      {[...Array(2)].map((_, index) => (
        <div key={index} className="rounded-xl border p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-72" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="mt-6 rounded-lg border p-4">
            {[...Array(3)].map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="flex items-center justify-between gap-4 border-b py-3 last:border-0"
              >
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-8 w-8" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </CardContent>
  )
}
*/
