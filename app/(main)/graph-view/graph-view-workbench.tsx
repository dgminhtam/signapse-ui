"use client"

import { Network } from "lucide-react"
import dynamic from "next/dynamic"
import { useMemo } from "react"

import {
  GraphViewEdge,
  GraphViewEdgeKind,
  GraphViewNode,
  GraphViewNodeKind,
  GraphViewResponse,
} from "@/app/lib/graph-view/definitions"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

const GraphViewCanvas = dynamic(
  () => import("./graph-view-canvas").then((module) => module.GraphViewCanvas),
  {
    ssr: false,
    loading: () => <GraphViewCanvasFallback />,
  }
)

export interface GraphModel {
  nodes: GraphViewNode[]
  edges: GraphViewEdge[]
  nodeMap: Map<string, GraphViewNode>
  edgeMap: Map<string, GraphViewEdge>
  relatedNodesByNodeId: Map<string, Set<string>>
  relatedEdgesByNodeId: Map<string, Set<string>>
  nodeCounts: Record<GraphViewNodeKind, number>
  edgeCounts: Record<GraphViewEdgeKind, number>
}

const NODE_KIND_ORDER: GraphViewNodeKind[] = [
  "event",
  "asset",
  "theme",
  "news-article",
]
const EDGE_KIND_ORDER: GraphViewEdgeKind[] = [
  "event-asset",
  "event-theme",
  "source-artifact-event",
]

function createCountRecord<T extends string>(
  keys: readonly T[]
): Record<T, number> {
  return Object.fromEntries(keys.map((key) => [key, 0])) as Record<T, number>
}

function buildGraphModel(graphView: GraphViewResponse): GraphModel {
  const nodeMap = new Map<string, GraphViewNode>()
  const edgeMap = new Map<string, GraphViewEdge>()
  const relatedNodesByNodeId = new Map<string, Set<string>>()
  const relatedEdgesByNodeId = new Map<string, Set<string>>()
  const nodeCounts = createCountRecord(NODE_KIND_ORDER)
  const edgeCounts = createCountRecord(EDGE_KIND_ORDER)
  const nodes: GraphViewNode[] = []
  const edges: GraphViewEdge[] = []

  for (const node of graphView.nodes) {
    if (nodeMap.has(node.id)) {
      continue
    }

    nodeMap.set(node.id, node)
    relatedNodesByNodeId.set(node.id, new Set([node.id]))
    relatedEdgesByNodeId.set(node.id, new Set())
    nodeCounts[node.kind] += 1
    nodes.push(node)
  }

  for (const edge of graphView.edges) {
    if (edgeMap.has(edge.id)) {
      continue
    }

    if (!nodeMap.has(edge.sourceNodeId) || !nodeMap.has(edge.targetNodeId)) {
      continue
    }

    edgeMap.set(edge.id, edge)
    relatedNodesByNodeId.get(edge.sourceNodeId)?.add(edge.targetNodeId)
    relatedNodesByNodeId.get(edge.targetNodeId)?.add(edge.sourceNodeId)
    relatedEdgesByNodeId.get(edge.sourceNodeId)?.add(edge.id)
    relatedEdgesByNodeId.get(edge.targetNodeId)?.add(edge.id)
    edgeCounts[edge.kind] += 1
    edges.push(edge)
  }

  return {
    nodes,
    edges,
    nodeMap,
    edgeMap,
    relatedNodesByNodeId,
    relatedEdgesByNodeId,
    nodeCounts,
    edgeCounts,
  }
}

function GraphViewCanvasFallback() {
  return (
    <div className="relative h-full min-h-[720px] w-full animate-pulse overflow-hidden lg:min-h-[calc(100svh-8rem)]">
      <div className="pointer-events-none absolute inset-x-4 top-4 z-10 flex flex-wrap items-start justify-between gap-3">
        <div className="h-8 w-36 rounded-full border border-border/70 bg-background/85 shadow-sm backdrop-blur" />

        <div className="flex max-w-[min(100%,28rem)] flex-wrap justify-end gap-2">
          <div className="h-7 w-24 rounded-full border border-border/70 bg-background/85 shadow-sm backdrop-blur" />
          <div className="h-7 w-24 rounded-full border border-border/70 bg-background/85 shadow-sm backdrop-blur" />
          <div className="h-7 w-24 rounded-full border border-border/70 bg-background/85 shadow-sm backdrop-blur" />
          <div className="size-8 rounded-full border border-border/70 bg-background/85 shadow-sm backdrop-blur" />
        </div>
      </div>

      <div className="absolute inset-6 rounded-[24px] border border-dashed border-border/60 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.10),_transparent_28%),radial-gradient(circle_at_82%_18%,_rgba(217,119,6,0.12),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(37,99,235,0.12),_transparent_30%)]" />

      <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 flex flex-wrap items-end justify-between gap-3">
        <div className="h-8 w-44 rounded-full border border-border/70 bg-background/88 shadow-sm backdrop-blur" />
        <div className="flex flex-wrap justify-end gap-2">
          <div className="h-8 w-36 rounded-full border border-border/70 bg-background/88 shadow-sm backdrop-blur" />
          <div className="h-8 w-36 rounded-full border border-border/70 bg-background/88 shadow-sm backdrop-blur" />
          <div className="h-8 w-36 rounded-full border border-border/70 bg-background/88 shadow-sm backdrop-blur" />
        </div>
      </div>
    </div>
  )
}

export function GraphViewWorkbench({
  graphView,
}: {
  graphView: GraphViewResponse
}) {
  const graphModel = useMemo(() => buildGraphModel(graphView), [graphView])
  const hasGraph = graphModel.nodes.length > 0

  return (
    <section className="relative min-h-[720px] overflow-hidden rounded-[30px] border border-border/80 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.12),_transparent_28%),radial-gradient(circle_at_82%_18%,_rgba(217,119,6,0.14),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(37,99,235,0.14),_transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(248,250,252,0.96))] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_24px_80px_-50px_rgba(15,23,42,0.45)] lg:min-h-[calc(100svh-8rem)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.18),_transparent_28%),radial-gradient(circle_at_82%_18%,_rgba(217,119,6,0.16),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(37,99,235,0.18),_transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.68),rgba(15,23,42,0.92))]">
      {hasGraph ? (
        <GraphViewCanvas graphModel={graphModel} />
      ) : (
        <Empty className="min-h-[720px] border-0 bg-transparent lg:min-h-[calc(100svh-8rem)]">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Network className="size-5 text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>Chưa có dữ liệu để dựng biểu đồ</EmptyTitle>
            <EmptyDescription>
              Backend chưa trả về nút nào cho <code>/graph-view</code>. Khi
              payload có dữ liệu, canvas G6 sẽ tự dựng lại từ cùng contract
              hiện tại.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </section>
  )
}
