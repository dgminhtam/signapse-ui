import { getServerDictionary, getRequestLocale } from "@/app/lib/i18n/server"
import {
  createGraphViewDemoFixture,
  getGraphViewDemoEdgeCount,
} from "@/app/lib/graph-view/demo-fixture"
import { GRAPH_VIEW_READ_PERMISSIONS } from "@/app/lib/graph-view/permissions"
import { hasAnyPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"

import { GraphViewWorkbench } from "../graph-view/graph-view-workbench"

type BaselinePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function GraphViewG6BaselinePage({
  searchParams,
}: BaselinePageProps) {
  const [permissions, dictionary, locale, params] = await Promise.all([
    getCurrentPermissions(),
    getServerDictionary(),
    getRequestLocale(),
    searchParams,
  ])

  if (!hasAnyPermission(permissions, GRAPH_VIEW_READ_PERMISSIONS)) {
    return (
      <section className="flex flex-col gap-6">
        <div className="flex max-w-3xl flex-col gap-2">
          <p className="text-sm font-medium tracking-[0.16em] text-muted-foreground uppercase">
            {dictionary.graphView.demo.baselineEyebrow}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {dictionary.graphView.demo.baselineTitle}
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
    <GraphViewWorkbench
      graphView={createGraphViewDemoFixture(
        getGraphViewDemoEdgeCount(rawEdgeCount),
        locale
      )}
    />
  )
}
