import { Suspense } from "react"

import { getGraphView } from "@/app/api/graph-view/action"
import { GRAPH_VIEW_READ_PERMISSIONS } from "@/app/lib/graph-view/permissions"
import { hasAnyPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import { AccessDenied } from "@/components/access-denied"
import { Skeleton } from "@/components/ui/skeleton"

import { GraphViewWorkbench } from "./graph-view-workbench"

export default async function GraphViewPage() {
  const permissions = await getCurrentPermissions()

  if (!hasAnyPermission(permissions, GRAPH_VIEW_READ_PERMISSIONS)) {
    return (
      <section className="flex flex-col gap-6">
        <div className="flex max-w-3xl flex-col gap-2">
          <p className="text-sm font-medium tracking-[0.16em] text-muted-foreground uppercase">
            Không gian tri thức
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Biểu đồ tri thức
          </h1>
          <p className="text-sm leading-7 text-muted-foreground">
            Không gian này dùng để theo dõi cách sự kiện, tài sản, chủ đề và
            tài liệu nguồn kết nối với nhau trên cùng một mặt phẳng khám phá.
          </p>
        </div>

        <div className="rounded-[32px] border border-border/80 bg-background/85 p-6 shadow-sm backdrop-blur">
          <AccessDenied
            description="Bạn không có quyền truy cập biểu đồ tri thức."
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
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-36 rounded-full" />
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="h-5 w-[42rem] max-w-full" />
      </div>

      <div className="rounded-[36px] border border-border/80 bg-[linear-gradient(180deg,rgba(245,247,250,0.88),rgba(248,250,252,0.98))] p-4 shadow-[0_30px_90px_-60px_rgba(15,23,42,0.45)] sm:p-6 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.82),rgba(15,23,42,0.96))]">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex max-w-3xl flex-col gap-3">
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-7 w-32 rounded-full" />
                <Skeleton className="h-7 w-24 rounded-full" />
              </div>
              <Skeleton className="h-8 w-64 max-w-full" />
              <Skeleton className="h-4 w-[34rem] max-w-full" />
            </div>

            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-9 w-28 rounded-full" />
              <Skeleton className="h-9 w-36 rounded-full" />
              <Skeleton className="h-9 w-32 rounded-full" />
            </div>
          </div>

          <Skeleton className="min-h-[720px] w-full rounded-[30px]" />

          <div className="grid gap-3 lg:grid-cols-3">
            <Skeleton className="h-24 rounded-[24px]" />
            <Skeleton className="h-24 rounded-[24px]" />
            <Skeleton className="h-24 rounded-[24px]" />
          </div>
        </div>
      </div>
    </div>
  )
}
