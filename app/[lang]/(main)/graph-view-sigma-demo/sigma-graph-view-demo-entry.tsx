"use client"

import dynamic from "next/dynamic"

import type { GraphViewDemoEdgeCount } from "@/app/lib/graph-view/demo-fixture"

const SigmaGraphViewDemo = dynamic(
  () =>
    import("./sigma-graph-view-demo").then(
      (module) => module.SigmaGraphViewDemo
    ),
  {
    loading: () => (
      <div className="relative h-[calc(100svh-6.5rem)] min-h-[36rem] w-full max-w-full overflow-hidden rounded-xl border bg-card shadow-sm" />
    ),
    ssr: false,
  }
)

export function SigmaGraphViewDemoEntry({
  initialEdgeCount,
}: {
  initialEdgeCount: GraphViewDemoEdgeCount
}) {
  return <SigmaGraphViewDemo initialEdgeCount={initialEdgeCount} />
}
