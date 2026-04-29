"use client"

import { Graph } from "@antv/g6"
import type {
  D3ForceLayoutOptions,
  EdgeData,
  GraphData,
  NodeData,
} from "@antv/g6"
import { useEffect, useMemo, useRef } from "react"

import { getGraphViewRelationLabel } from "@/app/lib/graph-view/definitions"

import {
  GRAPH_VIEW_EDGE_VISUALS,
  GRAPH_VIEW_NODE_VISUALS,
} from "./graph-view-visuals"
import type { GraphModel } from "./graph-view-workbench"

type ClusterState = {
  clusterByNodeId: Map<string, string>
  clusterLabelByKey: Map<string, string>
}

const MIN_CANVAS_WIDTH = 360
const MIN_CANVAS_HEIGHT = 640

function hashText(value: string) {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }

  return Math.abs(hash)
}

function createSeedPosition(nodeId: string, index: number, total: number) {
  const hash = hashText(nodeId)
  const angle = (index / Math.max(total, 1)) * Math.PI * 2 + (hash % 48) / 48
  const radius = 180 + (index % 9) * 18 + (hash % 24)

  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  }
}

function createBoundedLabel(label: string, maxLength = 34) {
  const normalizedLabel = label.trim()
  const characters = Array.from(normalizedLabel)

  if (characters.length <= maxLength) {
    return normalizedLabel
  }

  return `${characters
    .slice(0, Math.max(maxLength - 3, 1))
    .join("")
    .trimEnd()}...`
}

function getRelationScore(relationType: string, weight?: number | null) {
  const baseScoreByRelation: Record<string, number> = {
    PRIMARY_SUBJECT: 100,
    PRIMARY_THEME: 94,
    AFFECTED_ASSET: 76,
    SECONDARY_THEME: 66,
    REFERENCE_ASSET: 48,
    PRIMARY: 82,
    SUPPORTING: 58,
  }

  return (baseScoreByRelation[relationType] ?? 42) + (weight ?? 0) * 20
}

function inferClusterState(graphModel: GraphModel): ClusterState {
  const clusterByNodeId = new Map<string, string>()
  const clusterLabelByKey = new Map<string, string>()
  const eventClusterCandidates = new Map<
    string,
    {
      key: string
      label: string
      score: number
    }
  >()

  graphModel.nodes.forEach((node) => {
    if (node.kind !== "asset" && node.kind !== "theme") {
      return
    }

    clusterByNodeId.set(node.id, node.id)
    clusterLabelByKey.set(node.id, node.label)
  })

  graphModel.edges.forEach((edge) => {
    const sourceNode = graphModel.nodeMap.get(edge.sourceNodeId)
    const targetNode = graphModel.nodeMap.get(edge.targetNodeId)

    if (!sourceNode || !targetNode) {
      return
    }

    const eventNode =
      sourceNode.kind === "event"
        ? sourceNode
        : targetNode.kind === "event"
          ? targetNode
          : null
    const anchorNode =
      sourceNode.kind === "asset" || sourceNode.kind === "theme"
        ? sourceNode
        : targetNode.kind === "asset" || targetNode.kind === "theme"
          ? targetNode
          : null

    if (!eventNode || !anchorNode) {
      return
    }

    const score = getRelationScore(edge.relationType, edge.weight)
    const previousCandidate = eventClusterCandidates.get(eventNode.id)

    if (!previousCandidate || score > previousCandidate.score) {
      eventClusterCandidates.set(eventNode.id, {
        key: anchorNode.id,
        label: anchorNode.label,
        score,
      })
    }
  })

  graphModel.nodes.forEach((node) => {
    if (node.kind !== "event") {
      return
    }

    const candidate = eventClusterCandidates.get(node.id)

    if (candidate) {
      clusterByNodeId.set(node.id, candidate.key)
      clusterLabelByKey.set(candidate.key, candidate.label)
      return
    }

    clusterByNodeId.set(node.id, node.id)
    clusterLabelByKey.set(node.id, node.label)
  })

  graphModel.nodes.forEach((node) => {
    if (node.kind !== "news-article") {
      return
    }

    const eventEdge = graphModel.edges.find((edge) => {
      if (edge.sourceNodeId !== node.id && edge.targetNodeId !== node.id) {
        return false
      }

      const otherNodeId =
        edge.sourceNodeId === node.id ? edge.targetNodeId : edge.sourceNodeId

      return graphModel.nodeMap.get(otherNodeId)?.kind === "event"
    })

    if (!eventEdge) {
      return
    }

    const eventNodeId =
      eventEdge.sourceNodeId === node.id
        ? eventEdge.targetNodeId
        : eventEdge.sourceNodeId
    const inheritedClusterKey = clusterByNodeId.get(eventNodeId)

    if (inheritedClusterKey) {
      clusterByNodeId.set(node.id, inheritedClusterKey)
    }
  })

  graphModel.nodes.forEach((node) => {
    if (clusterByNodeId.has(node.id)) {
      return
    }

    const fallbackKey = `${node.kind}:${node.id}`
    clusterByNodeId.set(node.id, fallbackKey)
    clusterLabelByKey.set(fallbackKey, GRAPH_VIEW_NODE_VISUALS[node.kind].label)
  })

  return {
    clusterByNodeId,
    clusterLabelByKey,
  }
}

function shouldShowLabel(
  graphModel: GraphModel,
  nodeId: string,
  nodeKind: NodeData["kind"]
) {
  const edgeCount = graphModel.relatedEdgesByNodeId.get(nodeId)?.size ?? 0

  if (graphModel.nodes.length <= 42) {
    return true
  }

  return nodeKind === "asset" || nodeKind === "theme" || edgeCount >= 4
}

function createG6GraphData(graphModel: GraphModel): GraphData {
  const clusterState = inferClusterState(graphModel)
  const nodes: NodeData[] = graphModel.nodes.map((node, index) => {
    const visual = GRAPH_VIEW_NODE_VISUALS[node.kind]
    const clusterKey = clusterState.clusterByNodeId.get(node.id) ?? node.id
    const linkCount = graphModel.relatedEdgesByNodeId.get(node.id)?.size ?? 0
    const size = visual.size + Math.min(linkCount, 8) * 1.4
    const seedPosition = createSeedPosition(
      node.id,
      index,
      graphModel.nodes.length
    )
    const showLabel = shouldShowLabel(graphModel, node.id, node.kind)

    return {
      id: node.id,
      cluster: clusterKey,
      clusterLabel: clusterState.clusterLabelByKey.get(clusterKey) ?? clusterKey,
      kind: node.kind,
      label: node.label,
      linkCount,
      nodeRadius: size / 2 + 14,
      type: "circle",
      data: {
        clusterKey,
        kind: node.kind,
        label: node.label,
        metadata: node.metadata ?? null,
        secondaryLabel: node.secondaryLabel ?? null,
      },
      style: {
        fill: visual.color,
        labelFill: "#172033",
        labelFontSize: 11,
        labelFontWeight: 600,
        labelMaxWidth: 220,
        labelOffsetX: 9,
        labelPlacement: "right",
        labelText: showLabel ? createBoundedLabel(node.label) : "",
        lineWidth: 2,
        opacity: 0.96,
        shadowBlur: node.kind === "asset" || node.kind === "theme" ? 8 : 4,
        shadowColor: `${visual.color}40`,
        size,
        stroke: "rgba(255,255,255,0.88)",
        x: seedPosition.x,
        y: seedPosition.y,
      },
    }
  })

  const edges: EdgeData[] = graphModel.edges.map((edge) => {
    const visual = GRAPH_VIEW_EDGE_VISUALS[edge.kind]
    const sourceClusterKey =
      clusterState.clusterByNodeId.get(edge.sourceNodeId) ?? edge.sourceNodeId
    const targetClusterKey =
      clusterState.clusterByNodeId.get(edge.targetNodeId) ?? edge.targetNodeId
    const sameCluster = sourceClusterKey === targetClusterKey

    return {
      id: edge.id,
      confidence: edge.confidence ?? null,
      kind: edge.kind,
      relationType: edge.relationType,
      sameCluster,
      source: edge.sourceNodeId,
      sourceClusterKey,
      sourceNodeId: edge.sourceNodeId,
      target: edge.targetNodeId,
      targetClusterKey,
      targetNodeId: edge.targetNodeId,
      weight: edge.weight ?? null,
      data: {
        confidence: edge.confidence ?? null,
        kind: edge.kind,
        note: edge.note ?? null,
        relationLabel: getGraphViewRelationLabel(edge.relationType),
        relationType: edge.relationType,
        sourceNodeId: edge.sourceNodeId,
        targetNodeId: edge.targetNodeId,
        weight: edge.weight ?? null,
      },
      style: {
        lineWidth: visual.size,
        opacity: sameCluster ? 0.46 : 0.32,
        stroke: visual.color,
      },
      type: "line",
    }
  })

  return {
    edges,
    nodes,
  }
}

function getElementNumberValue(
  datum: { [key: string]: unknown },
  key: string,
  fallback: number
) {
  const value = datum[key]

  return typeof value === "number" && Number.isFinite(value) ? value : fallback
}

function getElementBooleanValue(
  datum: { [key: string]: unknown },
  key: string
) {
  return datum[key] === true
}

function createForceLayout(width: number, height: number) {
  return {
    alpha: 0.92,
    alphaDecay: 0.038,
    center: {
      strength: 0.12,
      x: width / 2,
      y: height / 2,
    },
    clusterBy: (node) => String(node.cluster ?? node.id),
    clusterEdgeDistance: 220,
    clusterEdgeStrength: 0.16,
    clusterFociStrength: 0.72,
    clusterNodeSize: 36,
    clusterNodeStrength: -12,
    clustering: true,
    collide: {
      iterations: 3,
      radius: (node) => getElementNumberValue(node, "nodeRadius", 24),
      strength: 0.88,
    },
    link: {
      distance: (edge) =>
        getElementBooleanValue(edge, "sameCluster") ? 96 : 210,
      iterations: 2,
      strength: (edge) =>
        getElementBooleanValue(edge, "sameCluster") ? 0.72 : 0.2,
    },
    manyBody: {
      distanceMax: 780,
      distanceMin: 18,
      strength: (node) => {
        const radius = getElementNumberValue(node, "nodeRadius", 24)

        return -160 - radius * 7
      },
      theta: 0.82,
    },
    preventOverlap: true,
    type: "d3-force",
    velocityDecay: 0.42,
    x: {
      strength: 0.045,
      x: width / 2,
    },
    y: {
      strength: 0.045,
      y: height / 2,
    },
  } satisfies D3ForceLayoutOptions & { type: "d3-force" }
}

function getContainerSize(container: HTMLDivElement) {
  const rect = container.getBoundingClientRect()

  return {
    height: Math.max(rect.height, MIN_CANVAS_HEIGHT),
    width: Math.max(rect.width, MIN_CANVAS_WIDTH),
  }
}

export function GraphViewCanvas({ graphModel }: { graphModel: GraphModel }) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const graphRef = useRef<Graph | null>(null)
  const graphData = useMemo(() => createG6GraphData(graphModel), [graphModel])

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    const { height, width } = getContainerSize(container)
    let isDisposed = false
    const graph = new Graph({
      animation: false,
      autoFit: "view",
      behaviors: [
        "drag-canvas",
        "zoom-canvas",
        {
          fixed: false,
          type: "drag-element-force",
        },
      ],
      container,
      data: graphData,
      edge: {
        style: (edge) => edge.style ?? {},
        type: "line",
      },
      height,
      layout: createForceLayout(width, height),
      node: {
        style: (node) => node.style ?? {},
        type: "circle",
      },
      padding: 48,
      width,
      zoomRange: [0.12, 4],
    })

    graphRef.current = graph
    void graph.render().then(() => {
      if (!isDisposed && !graph.destroyed) {
        void graph.fitView({
          direction: "both",
          when: "always",
        })
      }
    })

    const resizeObserver = new ResizeObserver(() => {
      if (isDisposed || graph.destroyed) {
        return
      }

      const nextSize = getContainerSize(container)
      graph.setSize(nextSize.width, nextSize.height)
    })

    resizeObserver.observe(container)

    return () => {
      isDisposed = true
      resizeObserver.disconnect()
      graph.destroy()
      graphRef.current = null
    }
  }, [graphData])

  return (
    <div className="relative h-full min-h-[640px] w-full animate-in duration-500 fade-in">
      <div
        ref={containerRef}
        className="h-full min-h-[640px] w-full cursor-grab active:cursor-grabbing"
      />

      <div className="pointer-events-none absolute inset-x-4 top-4 z-10 flex flex-wrap items-start justify-between gap-3">
        <div className="max-w-[min(100%,32rem)] rounded-2xl border border-border/80 bg-background/88 px-3.5 py-2.5 shadow-sm backdrop-blur">
          <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            D3 force layout
          </p>
          <p className="mt-1 text-xs leading-5 text-foreground/85">
            Kéo một nút để các quan hệ gần nó phản hồi theo lực; cuộn để zoom
            và kéo nền để di chuyển canvas.
          </p>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 flex flex-wrap items-end justify-between gap-3">
        <div className="rounded-full border border-border/80 bg-background/88 px-3 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur">
          {graphModel.nodes.length} nút · {graphModel.edges.length} cạnh
        </div>
        <div className="rounded-full border border-border/80 bg-background/88 px-3 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur">
          Force drag không ghi vị trí về backend
        </div>
      </div>
    </div>
  )
}
