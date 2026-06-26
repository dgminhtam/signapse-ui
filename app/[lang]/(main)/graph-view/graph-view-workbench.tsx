"use client"

import { Network } from "lucide-react"
import dynamic from "next/dynamic"
import { useMemo } from "react"

import { useLocalization } from "@/app/lib/i18n/provider"
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
  "news-article",
  "narrative",
]
const EDGE_KIND_ORDER: GraphViewEdgeKind[] = [
  "event-asset",
  "news-article-event",
  "narrative-event",
  "narrative-asset",
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

export function GraphViewWorkbench({
  graphView,
}: {
  graphView: GraphViewResponse
}) {
  const { dictionary } = useLocalization()
  const graphModel = useMemo(() => buildGraphModel(graphView), [graphView])
  const hasGraph = graphModel.nodes.length > 0

  return (
    <section className="relative h-[calc(100svh-6.5rem)] min-h-[36rem] w-full max-w-full overflow-hidden rounded-xl border bg-card shadow-sm">
      {hasGraph ? (
        <GraphViewCanvas graphModel={graphModel} />
      ) : (
        <Empty className="size-full min-h-[36rem] border-0 bg-transparent">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Network className="size-5 text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>{dictionary.graphView.emptyTitle}</EmptyTitle>
            <EmptyDescription>
              {dictionary.graphView.emptyDescription}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </section>
  )
}
