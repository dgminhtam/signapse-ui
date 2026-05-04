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
    <div className="relative min-h-[720px] overflow-hidden rounded-[30px] border border-border/80 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.12),_transparent_28%),radial-gradient(circle_at_82%_18%,_rgba(217,119,6,0.14),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(37,99,235,0.14),_transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(248,250,252,0.96))] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_24px_80px_-50px_rgba(15,23,42,0.45)] lg:min-h-[calc(100svh-8rem)]">
      <div className="pointer-events-none absolute inset-x-4 top-4 z-10 flex flex-wrap items-start justify-between gap-3">
        <Skeleton className="h-8 w-36 rounded-full" />

        <div className="flex max-w-[min(100%,28rem)] flex-wrap justify-end gap-2">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="size-8 rounded-full" />
        </div>
      </div>

      <div className="absolute inset-6 rounded-[24px] border border-dashed border-border/60 bg-muted/20" />

      <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 flex flex-wrap items-end justify-between gap-3">
        <Skeleton className="h-8 w-44 rounded-full" />
        <div className="flex flex-wrap justify-end gap-2">
          <Skeleton className="h-8 w-36 rounded-full" />
          <Skeleton className="h-8 w-36 rounded-full" />
          <Skeleton className="h-8 w-36 rounded-full" />
        </div>
      </div>
    </div>
  )
}
