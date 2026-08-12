import { Suspense } from "react"

import { getGraphView } from "@/app/api/graph-view/action"
import { getServerDictionary } from "@/app/lib/i18n/server"
import { GRAPH_VIEW_READ_PERMISSIONS } from "@/app/lib/graph-view/permissions"
import { hasAnyPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { Skeleton } from "@/components/ui/skeleton"

import { GraphViewWorkbench } from "./graph-view-workbench"

export default async function GraphViewPage() {
  const [permissions, dictionary] = await Promise.all([
    getCurrentPermissions(),
    getServerDictionary(),
  ])

  if (!hasAnyPermission(permissions, GRAPH_VIEW_READ_PERMISSIONS)) {
    return (
      <section className="flex flex-col gap-6">
        <div className="flex max-w-3xl flex-col gap-2">
          <p className="text-sm font-medium tracking-[0.16em] text-muted-foreground uppercase">
            {dictionary.graphView.workspaceEyebrow}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {dictionary.graphView.title}
          </h1>
          <p className="text-sm leading-7 text-muted-foreground">
            {dictionary.graphView.description}
          </p>
        </div>

        <div className="rounded-[32px] border border-border/80 bg-background/85 p-6 shadow-sm backdrop-blur">
          <AccessDenied
            description={dictionary.graphView.readDenied}
            permission={GRAPH_VIEW_READ_PERMISSIONS[0]}
          />
        </div>
      </section>
    )
  }

  return (
    <Suspense fallback={<GraphViewSkeleton />}>
      <GraphViewContent />
    </Suspense>
  )
}

async function GraphViewContent() {
  const graphView = await getGraphView()

  return <GraphViewWorkbench graphView={graphView} />
}

function GraphViewSkeleton() {
  return (
    <div className="relative h-[calc(100svh-6.5rem)] min-h-[36rem] w-full max-w-full overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="pointer-events-none absolute inset-x-4 top-4 z-10 flex flex-wrap items-start justify-between gap-3">
        <Skeleton className="h-7 w-44" />

        <div className="flex max-w-[min(100%,28rem)] flex-wrap justify-end gap-1.5">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
      </div>

      <div className="pointer-events-none absolute top-16 right-4 z-10 flex flex-col gap-1.5">
        <Skeleton className="size-7" />
        <Skeleton className="size-7" />
        <Skeleton className="size-7" />
      </div>

      <div className="absolute inset-6 rounded-xl border border-dashed border-border/60 bg-muted/20" />

      <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 flex flex-wrap items-end justify-between gap-3">
        <Skeleton className="h-7 w-36 rounded-full" />
        <div className="flex max-w-[min(100%,30rem)] flex-wrap justify-end gap-1.5 opacity-70">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>
      </div>
    </div>
  )
}
