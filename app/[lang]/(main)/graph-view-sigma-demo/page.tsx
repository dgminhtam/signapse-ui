import { Suspense } from "react"

import { getServerDictionary } from "@/app/lib/i18n/server"
import { getGraphViewDemoEdgeCount } from "@/app/lib/graph-view/demo-fixture"
import { GRAPH_VIEW_READ_PERMISSIONS } from "@/app/lib/graph-view/permissions"
import { hasAnyPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { Skeleton } from "@/components/ui/skeleton"

import { SigmaGraphViewDemoEntry } from "./sigma-graph-view-demo-entry"

type DemoPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function SigmaGraphViewDemoPage({
  searchParams,
}: DemoPageProps) {
  const [permissions, dictionary, params] = await Promise.all([
    getCurrentPermissions(),
    getServerDictionary(),
    searchParams,
  ])

  if (!hasAnyPermission(permissions, GRAPH_VIEW_READ_PERMISSIONS)) {
    return (
      <section className="flex flex-col gap-6">
        <div className="flex max-w-3xl flex-col gap-2">
          <p className="text-sm font-medium tracking-[0.16em] text-muted-foreground uppercase">
            {dictionary.graphView.demo.eyebrow}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {dictionary.graphView.demo.title}
          </h1>
        </div>
        <div className="rounded-[28px] border border-border/80 bg-background/85 p-6 shadow-sm backdrop-blur">
          <AccessDenied
            description={dictionary.graphView.readDenied}
            permission={GRAPH_VIEW_READ_PERMISSIONS[0]}
          />
        </div>
      </section>
    )
  }

  const rawEdgeCount = Array.isArray(params.edges)
    ? params.edges[0]
    : params.edges

  return (
    <Suspense fallback={<SigmaGraphViewDemoSkeleton />}>
      <SigmaGraphViewDemoEntry
        initialEdgeCount={getGraphViewDemoEdgeCount(rawEdgeCount)}
      />
    </Suspense>
  )
}

function SigmaGraphViewDemoSkeleton() {
  return (
    <div className="relative h-[calc(100svh-6.5rem)] min-h-[36rem] w-full max-w-full overflow-hidden rounded-xl border bg-card shadow-sm">
      <Skeleton className="absolute inset-6 rounded-xl" />
    </div>
  )
}
