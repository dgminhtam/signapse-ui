"use client"

import dynamic from "next/dynamic"

import type { MarketChartWorkbenchProps } from "./market-chart-workbench"
import { MarketChartSurfaceSkeleton } from "./market-chart-skeleton"

const MarketChartWorkbench = dynamic(
  () =>
    import("./market-chart-workbench").then(
      (module) => module.MarketChartWorkbench
    ),
  {
    ssr: false,
    loading: () => <MarketChartSurfaceSkeleton />,
  }
)

export function MarketChartWorkbenchClient(props: MarketChartWorkbenchProps) {
  return <MarketChartWorkbench {...props} />
}
