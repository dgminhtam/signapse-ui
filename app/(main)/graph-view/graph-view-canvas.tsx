"use client"

import {
  DragElementForce,
  ExtensionCategory,
  Graph,
  getExtension,
  invokeLayoutMethod,
  register,
} from "@antv/g6"
import type {
  BaseLayout,
  D3ForceLayoutOptions,
  DragElementForceOptions,
  EdgeData,
  GraphData,
  ID,
  NodeData,
  Point,
  ViewportAnimationEffectTiming,
} from "@antv/g6"
import {
  ArrowUpRight,
  Calendar,
  ExternalLink,
  Minus,
  Plus,
  RotateCcw,
  X,
} from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"

import {
  getGraphViewRelationLabel,
  parseGraphViewNodeId,
} from "@/app/lib/graph-view/definitions"
import type {
  GraphViewEdgeKind,
  GraphViewNode,
  GraphViewNodeKind,
} from "@/app/lib/graph-view/definitions"
import { AppTimeMetadata } from "@/components/app-time-metadata"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import {
  GRAPH_VIEW_EDGE_VISUALS,
  GRAPH_VIEW_NODE_VISUALS,
} from "./graph-view-visuals"
import type { GraphModel } from "./graph-view-workbench"

type ClusterState = {
  clusterByNodeId: Map<string, string>
  clusterLabelByKey: Map<string, string>
}

type GraphAnalysisBounds = {
  maxX: number
  maxY: number
  minX: number
  minY: number
}

type BoundedDragElementForceOptions = DragElementForceOptions & {
  getAnalysisBounds: () => GraphAnalysisBounds
}

type GraphThemeMode = "light" | "dark"

type GraphCanvasPalette = {
  activeNodeHaloColor: string
  edgeHighlightLineWidthBoost: number
  edgeHighlightOpacity: number
  edgeInactiveOpacity: number
  labelBackground: boolean
  labelBackgroundFill: string
  labelBackgroundOpacity: number
  labelFill: string
  labelStroke: string
  labelStrokeOpacity: number
  labelStrokeWidth: number
  nodeHighlightOpacity: number
  nodeInactiveOpacity: number
  selectionEdgeOpacity: number
  selectionInactiveEdgeOpacity: number
  selectionInactiveNodeOpacity: number
  selectionNodeHaloColor: string
  selectionRelatedNodeOpacity: number
  nodeStroke: string
  tooltipSurfaceClassName: string
}

type HoverTooltipState = {
  kind: GraphViewNodeKind
  label: string
  nodeId: string
  x: number
  y: number
}

const MIN_CANVAS_WIDTH = 360
const MIN_CANVAS_HEIGHT = 640
const GRAPH_CANVAS_PAN_RANGE = 0.45
const GRAPH_ANALYSIS_BOUNDS_SCALE = 1.45
const GRAPH_ANALYSIS_BOUNDS_MIN_PADDING = 144
const GRAPH_HOVER_TOOLTIP_OFFSET = 14
const GRAPH_HOVER_TOOLTIP_MIN_MARGIN = 12
const GRAPH_HOVER_TOOLTIP_MAX_WIDTH = 320
const GRAPH_HOVER_TOOLTIP_HEIGHT = 84
const GRAPH_RECENTER_ANIMATION = {
  duration: 520,
  easing: "ease-in-out",
} satisfies ViewportAnimationEffectTiming
const GRAPH_ZOOM_ANIMATION = {
  duration: 220,
  easing: "ease-out",
} satisfies ViewportAnimationEffectTiming
const GRAPH_ZOOM_STEP_RATIO = 1.18
const GRAPH_ZOOM_RANGE: [number, number] = [0.45, 2.2]
const BOUNDED_DRAG_ELEMENT_FORCE_TYPE = "bounded-drag-element-force"
const GRAPH_HUD_NODE_KIND_ORDER = [
  "event",
  "asset",
  "theme",
  "news-article",
] satisfies GraphViewNodeKind[]
const GRAPH_HUD_EDGE_KIND_ORDER = [
  "event-asset",
  "event-theme",
  "news-article-event",
] satisfies GraphViewEdgeKind[]
const GRAPH_SELECTION_STATE_NAMES = [
  "selected",
  "selected-related",
  "selected-inactive",
]
const GRAPH_SELECTION_EDGE_STATE_NAMES = [
  "selected-related",
  "selected-inactive",
]

function createGraphCanvasPalette(mode: GraphThemeMode): GraphCanvasPalette {
  if (mode === "dark") {
    return {
      activeNodeHaloColor: "rgba(248, 250, 252, 0.65)",
      edgeHighlightLineWidthBoost: 0.95,
      edgeHighlightOpacity: 0.84,
      edgeInactiveOpacity: 0.34,
      labelBackground: true,
      labelBackgroundFill: "rgba(2, 6, 23, 0.86)",
      labelBackgroundOpacity: 0.82,
      labelFill: "#f8fafc",
      labelStroke: "rgba(2, 6, 23, 0.92)",
      labelStrokeOpacity: 0.92,
      labelStrokeWidth: 3.2,
      nodeHighlightOpacity: 1,
      nodeInactiveOpacity: 0.66,
      selectionEdgeOpacity: 0.9,
      selectionInactiveEdgeOpacity: 0.2,
      selectionInactiveNodeOpacity: 0.38,
      selectionNodeHaloColor: "rgba(248, 250, 252, 0.78)",
      selectionRelatedNodeOpacity: 0.82,
      nodeStroke: "rgba(241, 245, 249, 0.9)",
      tooltipSurfaceClassName:
        "border-border/80 bg-popover/95 text-popover-foreground shadow-xl",
    }
  }

  return {
    activeNodeHaloColor: "rgba(15, 23, 42, 0.36)",
    edgeHighlightLineWidthBoost: 0.8,
    edgeHighlightOpacity: 0.78,
    edgeInactiveOpacity: 0.24,
    labelBackground: true,
    labelBackgroundFill: "rgba(248, 250, 252, 0.88)",
    labelBackgroundOpacity: 0.76,
    labelFill: "#172033",
    labelStroke: "rgba(248, 250, 252, 0.96)",
    labelStrokeOpacity: 0.96,
    labelStrokeWidth: 2.6,
    nodeHighlightOpacity: 1,
    nodeInactiveOpacity: 0.61,
    selectionEdgeOpacity: 0.82,
    selectionInactiveEdgeOpacity: 0.16,
    selectionInactiveNodeOpacity: 0.28,
    selectionNodeHaloColor: "rgba(15, 23, 42, 0.44)",
    selectionRelatedNodeOpacity: 0.72,
    nodeStroke: "rgba(255, 255, 255, 0.88)",
    tooltipSurfaceClassName:
      "border-border/80 bg-popover/95 text-popover-foreground shadow-xl",
  }
}

class BoundedDragElementForce extends DragElementForce {
  private getBoundedForceLayoutInstance() {
    return this.context.layout
      ?.getLayoutInstance()
      .find((layout) => layout.id === "d3-force" || layout.id === "d3-force-3d")
  }

  protected override async moveElement(ids: ID[], offset: Point) {
    if (this.context.graph.destroyed) {
      return
    }

    const layout = this.getBoundedForceLayoutInstance()
    const options = this.options as unknown as Required<BoundedDragElementForceOptions>
    const bounds = options.getAnalysisBounds()
    const [dx, dy] = this.clampByRotation(offset)

    this.context.graph.getNodeData(ids).forEach((element, index) => {
      const style = (element.style ?? {}) as Record<string, unknown>
      const currentX = getElementNumberValue(style, "x", 0)
      const currentY = getElementNumberValue(style, "y", 0)
      const [nextX, nextY] = clampPointToAnalysisBounds(
        [currentX + dx, currentY + dy],
        bounds
      )

      if (layout) {
        invokeLayoutMethod(layout as BaseLayout, "setFixedPosition", ids[index], [
          nextX,
          nextY,
        ])
      }
    })
  }
}

function ensureBoundedDragElementForceRegistered() {
  if (getExtension(ExtensionCategory.BEHAVIOR, BOUNDED_DRAG_ELEMENT_FORCE_TYPE)) {
    return
  }

  register(
    ExtensionCategory.BEHAVIOR,
    BOUNDED_DRAG_ELEMENT_FORCE_TYPE,
    BoundedDragElementForce
  )
}

function GraphHudCountChip({
  className,
  count,
  label,
}: {
  className: string
  count: number
  label: string
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full border px-2.5 text-[11px] font-medium shadow-sm backdrop-blur",
        className
      )}
    >
      <span>{label}</span>
      <span className="rounded-full bg-background/70 px-1.5 py-0.5 text-[10px] font-semibold">
        {count}
      </span>
    </span>
  )
}

function formatInspectorDate(value?: string | null) {
  if (!value) {
    return null
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date)
}

function formatInspectorConfidence(value?: number | null) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null
  }

  const normalizedValue = value <= 1 ? value * 100 : value

  return `${Math.round(normalizedValue)}%`
}

function getNodeDetailHref(node: GraphViewNode) {
  const entityReference = parseGraphViewNodeId(node.id)

  if (!entityReference) {
    return null
  }

  if (entityReference.kind === "event") {
    return {
      href: `/events/${entityReference.entityId}`,
      label: "Mở sự kiện",
    }
  }

  if (entityReference.kind === "news-article") {
    return {
      href: `/news-articles/${entityReference.entityId}`,
      label: "Mở bài viết",
    }
  }

  return null
}

function GraphNodeInspectorField({
  label,
  value,
  valueNode,
}: {
  label: string
  value?: string | null
  valueNode?: ReactNode
}) {
  if (!value && !valueNode) {
    return null
  }

  return (
    <div className="min-w-0 rounded-lg border border-border/60 bg-background/55 px-2.5 py-2">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 truncate" title={value ?? undefined}>
        {valueNode ?? (
          <span className="text-xs font-medium text-foreground">{value}</span>
        )}
      </dd>
    </div>
  )
}

function GraphNodeDetailInspector({
  node,
  onClose,
  relatedEdgeCount,
  relatedNodeCount,
}: {
  node: GraphViewNode
  onClose: () => void
  relatedEdgeCount: number
  relatedNodeCount: number
}) {
  const visual = GRAPH_VIEW_NODE_VISUALS[node.kind]
  const metadata = node.metadata ?? {}
  const detailHref = getNodeDetailHref(node)
  const detailActionLabel =
    node.kind === "event"
      ? "Đọc sự kiện"
      : node.kind === "news-article"
        ? "Đọc bài viết"
        : detailHref?.label
  const sourceUrl =
    node.kind === "news-article" && metadata.url?.trim()
      ? metadata.url.trim()
      : null
  const occurredAt = formatInspectorDate(metadata.occurredAt)
  const publishedAt = formatInspectorDate(metadata.publishedAt)
  const confidence = formatInspectorConfidence(metadata.confidence)

  return (
    <aside className="pointer-events-auto absolute inset-x-3 bottom-14 z-20 max-h-[26rem] overflow-hidden rounded-2xl border border-border/80 bg-popover/95 text-popover-foreground shadow-2xl backdrop-blur-md md:inset-x-auto md:bottom-auto md:right-4 md:top-16 md:max-h-[calc(100%-5rem)] md:w-[22rem]">
      <div className="flex items-start gap-3 border-b border-border/70 px-3.5 py-3">
        <span
          aria-hidden="true"
          className="mt-1 size-3.5 shrink-0 rounded-full shadow-sm"
          style={{ backgroundColor: visual.color }}
        />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {visual.label}
          </p>
          <h2 className="mt-1 line-clamp-3 text-sm font-semibold leading-snug">
            {node.label}
          </h2>
          {node.secondaryLabel ? (
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {node.secondaryLabel}
            </p>
          ) : null}
        </div>
        <Button
          aria-label="Đóng chi tiết nút"
          title="Đóng chi tiết nút"
          type="button"
          size="icon-xs"
          variant="ghost"
          className="rounded-full"
          onClick={onClose}
        >
          <X aria-hidden="true" className="size-3.5" data-icon="inline-start" />
        </Button>
      </div>

      <div className="max-h-[20rem] overflow-y-auto p-3.5 md:max-h-[calc(100vh-11rem)]">
        <dl className="grid grid-cols-2 gap-2">
          <GraphNodeInspectorField
            label="Thời điểm"
            value={occurredAt}
            valueNode={
              <AppTimeMetadata icon={Calendar}>{occurredAt}</AppTimeMetadata>
            }
          />
          <GraphNodeInspectorField
            label="Xuất bản"
            value={publishedAt}
            valueNode={
              <AppTimeMetadata icon={Calendar}>{publishedAt}</AppTimeMetadata>
            }
          />
          <GraphNodeInspectorField label="Độ tin cậy" value={confidence} />
          <GraphNodeInspectorField label="Trạng thái" value={metadata.status} />
          <GraphNodeInspectorField label="Nguồn tin" value={metadata.newsOutletName} />
          <GraphNodeInspectorField label="Mã giao dịch" value={metadata.symbol} />
          <GraphNodeInspectorField label="Loại tài sản" value={metadata.assetType} />
          <GraphNodeInspectorField label="Slug" value={metadata.slug} />
          <GraphNodeInspectorField label="Khóa chuẩn" value={metadata.canonicalKey} />
          <GraphNodeInspectorField
            label="Nút liên quan"
            value={String(Math.max(relatedNodeCount - 1, 0))}
          />
          <GraphNodeInspectorField
            label="Cạnh liên quan"
            value={String(relatedEdgeCount)}
          />
        </dl>

        {detailHref || sourceUrl ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {detailHref ? (
              <Button asChild size="sm" variant="secondary">
                <Link href={detailHref.href}>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4"
                    data-icon="inline-start"
                  />
                  <span>{detailActionLabel}</span>
                </Link>
              </Button>
            ) : null}
            {sourceUrl ? (
              <Button asChild size="sm" variant="outline">
                <a href={sourceUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink
                    aria-hidden="true"
                    className="size-4"
                    data-icon="inline-start"
                  />
                  <span>Mở nguồn gốc</span>
                </a>
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </aside>
  )
}

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

function createG6GraphData(
  graphModel: GraphModel,
  graphPalette: GraphCanvasPalette
): GraphData {
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
        labelBackground: graphPalette.labelBackground,
        labelBackgroundFill: graphPalette.labelBackgroundFill,
        labelBackgroundOpacity: graphPalette.labelBackgroundOpacity,
        labelBackgroundPadding: [2, 4, 2, 4],
        labelFill: graphPalette.labelFill,
        labelFontSize: 11,
        labelFontWeight: 600,
        labelMaxWidth: 220,
        labelOffsetX: 9,
        labelPlacement: "right",
        labelStroke: graphPalette.labelStroke,
        labelStrokeOpacity: graphPalette.labelStrokeOpacity,
        labelLineWidth: graphPalette.labelStrokeWidth,
        labelText: showLabel ? createBoundedLabel(node.label) : "",
        lineWidth: 2,
        opacity: 0.96,
        shadowBlur: node.kind === "asset" || node.kind === "theme" ? 8 : 4,
        shadowColor: `${visual.color}40`,
        size,
        stroke: graphPalette.nodeStroke,
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

function createGraphAnalysisBounds(
  width: number,
  height: number
): GraphAnalysisBounds {
  const horizontalPadding = Math.max(
    (width * (GRAPH_ANALYSIS_BOUNDS_SCALE - 1)) / 2,
    GRAPH_ANALYSIS_BOUNDS_MIN_PADDING
  )
  const verticalPadding = Math.max(
    (height * (GRAPH_ANALYSIS_BOUNDS_SCALE - 1)) / 2,
    GRAPH_ANALYSIS_BOUNDS_MIN_PADDING
  )

  return {
    maxX: width + horizontalPadding,
    maxY: height + verticalPadding,
    minX: -horizontalPadding,
    minY: -verticalPadding,
  }
}

function clampValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function clampPointToAnalysisBounds(
  [x, y]: Point,
  bounds: GraphAnalysisBounds
): [number, number] {
  return [
    clampValue(x, bounds.minX, bounds.maxX),
    clampValue(y, bounds.minY, bounds.maxY),
  ]
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

function createNodeStateStyles(graphPalette: GraphCanvasPalette) {
  const keepBaseStroke = (node: NodeData) => ({
    lineWidth: getElementNumberValue(node.style ?? {}, "lineWidth", 2),
    stroke:
      typeof node.style?.stroke === "string"
        ? node.style.stroke
        : graphPalette.nodeStroke,
  })

  return {
    active: (node: NodeData) => ({
      ...keepBaseStroke(node),
      opacity: 1,
      shadowBlur: 22,
      shadowColor: graphPalette.activeNodeHaloColor,
    }),
    highlight: (node: NodeData) => ({
      ...keepBaseStroke(node),
      opacity: graphPalette.nodeHighlightOpacity,
      shadowBlur: 12,
    }),
    inactive: {
      opacity: graphPalette.nodeInactiveOpacity,
      shadowBlur: 0,
    },
    selected: (node: NodeData) => ({
      ...keepBaseStroke(node),
      lineWidth: getElementNumberValue(node.style ?? {}, "lineWidth", 2) + 1.4,
      opacity: 1,
      shadowBlur: 26,
      shadowColor: graphPalette.selectionNodeHaloColor,
    }),
    "selected-inactive": {
      opacity: graphPalette.selectionInactiveNodeOpacity,
      shadowBlur: 0,
    },
    "selected-related": (node: NodeData) => ({
      ...keepBaseStroke(node),
      opacity: graphPalette.selectionRelatedNodeOpacity,
      shadowBlur: 10,
    }),
  }
}

function createEdgeStateStyles(graphPalette: GraphCanvasPalette) {
  return {
    highlight: (edge: EdgeData) => ({
      lineWidth:
        getElementNumberValue(edge.style ?? {}, "lineWidth", 1.3) +
        graphPalette.edgeHighlightLineWidthBoost,
      opacity: graphPalette.edgeHighlightOpacity,
    }),
    inactive: {
      opacity: graphPalette.edgeInactiveOpacity,
    },
    "selected-inactive": {
      opacity: graphPalette.selectionInactiveEdgeOpacity,
    },
    "selected-related": (edge: EdgeData) => ({
      lineWidth:
        getElementNumberValue(edge.style ?? {}, "lineWidth", 1.3) +
        graphPalette.edgeHighlightLineWidthBoost,
      opacity: graphPalette.selectionEdgeOpacity,
    }),
  }
}

function resolveLocalPointerPosition(
  graph: Graph,
  container: HTMLDivElement,
  event: {
    clientX?: number
    clientY?: number
    target?: { id?: string }
  }
) {
  const bounds = container.getBoundingClientRect()
  const clientX = event.clientX
  const clientY = event.clientY
  const hasClientPoint =
    typeof clientX === "number" &&
    Number.isFinite(clientX) &&
    typeof clientY === "number" &&
    Number.isFinite(clientY)

  if (hasClientPoint) {
    return {
      x: clientX - bounds.left,
      y: clientY - bounds.top,
    }
  }

  const nodeId = event.target?.id

  if (nodeId) {
    const [canvasX, canvasY] = graph.getCanvasByViewport(
      graph.getElementPosition(nodeId)
    )

    return {
      x: canvasX,
      y: canvasY,
    }
  }

  return {
    x: bounds.width / 2,
    y: bounds.height / 2,
  }
}

function clampHoverTooltipPosition(container: HTMLDivElement, x: number, y: number) {
  const rect = container.getBoundingClientRect()
  const maxX = Math.max(
    GRAPH_HOVER_TOOLTIP_MIN_MARGIN,
    rect.width - GRAPH_HOVER_TOOLTIP_MAX_WIDTH - GRAPH_HOVER_TOOLTIP_MIN_MARGIN
  )
  const maxY = Math.max(
    GRAPH_HOVER_TOOLTIP_MIN_MARGIN,
    rect.height - GRAPH_HOVER_TOOLTIP_HEIGHT - GRAPH_HOVER_TOOLTIP_MIN_MARGIN
  )

  return {
    x: clampValue(
      x + GRAPH_HOVER_TOOLTIP_OFFSET,
      GRAPH_HOVER_TOOLTIP_MIN_MARGIN,
      maxX
    ),
    y: clampValue(
      y + GRAPH_HOVER_TOOLTIP_OFFSET,
      GRAPH_HOVER_TOOLTIP_MIN_MARGIN,
      maxY
    ),
  }
}

function removeGraphElementStates(states: string[], names: readonly string[]) {
  return states.filter((state) => !names.includes(state))
}

function applySelectedGraphStates(
  graph: Graph,
  graphModel: GraphModel,
  selectedNodeId: string | null
) {
  if (graph.destroyed) {
    return Promise.resolve()
  }

  const relatedNodeIds = selectedNodeId
    ? (graphModel.relatedNodesByNodeId.get(selectedNodeId) ?? new Set([selectedNodeId]))
    : new Set<string>()
  const relatedEdgeIds = selectedNodeId
    ? (graphModel.relatedEdgesByNodeId.get(selectedNodeId) ?? new Set<string>())
    : new Set<string>()
  const stateUpdates: Record<string, string[]> = {}

  graphModel.nodes.forEach((node) => {
    const nextState = removeGraphElementStates(
      graph.getElementState(node.id),
      GRAPH_SELECTION_STATE_NAMES
    )

    if (selectedNodeId) {
      if (node.id === selectedNodeId) {
        nextState.push("selected")
      } else if (relatedNodeIds.has(node.id)) {
        nextState.push("selected-related")
      } else {
        nextState.push("selected-inactive")
      }
    }

    stateUpdates[node.id] = nextState
  })

  graphModel.edges.forEach((edge) => {
    const nextState = removeGraphElementStates(
      graph.getElementState(edge.id),
      GRAPH_SELECTION_EDGE_STATE_NAMES
    )

    if (selectedNodeId) {
      nextState.push(
        relatedEdgeIds.has(edge.id) ? "selected-related" : "selected-inactive"
      )
    }

    stateUpdates[edge.id] = nextState
  })

  if (Object.keys(stateUpdates).length === 0) {
    return Promise.resolve()
  }

  return graph.setElementState(stateUpdates, false)
}

export function GraphViewCanvas({ graphModel }: { graphModel: GraphModel }) {
  const { resolvedTheme } = useTheme()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const graphRef = useRef<Graph | null>(null)
  const graphRenderReadyRef = useRef<Graph | null>(null)
  const hasAppliedSelectionStateRef = useRef(false)
  const lastNodeDragAtRef = useRef(0)
  const [hoverTooltip, setHoverTooltip] = useState<HoverTooltipState | null>(null)
  const [renderReadyVersion, setRenderReadyVersion] = useState(0)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const graphThemeMode: GraphThemeMode =
    resolvedTheme === "dark" ? "dark" : "light"
  const graphPalette = useMemo(
    () => createGraphCanvasPalette(graphThemeMode),
    [graphThemeMode]
  )
  const graphData = useMemo(
    () => createG6GraphData(graphModel, graphPalette),
    [graphModel, graphPalette]
  )
  const selectedNode = selectedNodeId
    ? (graphModel.nodeMap.get(selectedNodeId) ?? null)
    : null
  const selectedGraphNodeId = selectedNode ? selectedNode.id : null
  const selectedRelatedNodeCount = selectedGraphNodeId
    ? (graphModel.relatedNodesByNodeId.get(selectedGraphNodeId)?.size ?? 1)
    : 0
  const selectedRelatedEdgeCount = selectedGraphNodeId
    ? (graphModel.relatedEdgesByNodeId.get(selectedGraphNodeId)?.size ?? 0)
    : 0

  const clearSelectedNode = () => {
    setSelectedNodeId(null)
  }

  const handleRecenter = () => {
    const graph = graphRef.current

    if (!graph || graph.destroyed) {
      return
    }

    void graph
      .fitView(
        {
          direction: "both",
          when: "always",
        },
        GRAPH_RECENTER_ANIMATION
      )
      .catch((error) => {
        if (!graph.destroyed) {
          console.error(error)
        }
      })
  }

  const handleZoom = (direction: "in" | "out") => {
    const graph = graphRef.current

    if (!graph || graph.destroyed) {
      return
    }

    const currentZoom = graph.getZoom()
    const nextRawZoom =
      direction === "in"
        ? currentZoom * GRAPH_ZOOM_STEP_RATIO
        : currentZoom / GRAPH_ZOOM_STEP_RATIO
    const nextZoom = clampValue(nextRawZoom, GRAPH_ZOOM_RANGE[0], GRAPH_ZOOM_RANGE[1])

    void graph.zoomTo(nextZoom, GRAPH_ZOOM_ANIMATION).catch((error) => {
      if (!graph.destroyed) {
        console.error(error)
      }
    })
  }

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    ensureBoundedDragElementForceRegistered()

    const { height, width } = getContainerSize(container)
    let analysisBounds = createGraphAnalysisBounds(width, height)
    let isDisposed = false
    let renderFrameId: number | null = null
    let renderPromise: Promise<void> | null = null
    const graph = new Graph({
      autoFit: {
        type: 'center',
        animation: {
          duration: 1000,
          easing: 'ease-in-out',
        },
      },
      animation: true,
      behaviors: [
        {
          range: GRAPH_CANVAS_PAN_RANGE,
          type: "drag-canvas",
        },
        {
          animation: false,
          degree: 1,
          direction: "both",
          enable: (event: { targetType?: string }) => event.targetType === "node",
          inactiveState: "inactive",
          state: "highlight",
          type: "hover-activate",
        },
        {
          fixed: true,
          getAnalysisBounds: () => analysisBounds,
          type: BOUNDED_DRAG_ELEMENT_FORCE_TYPE,
        },
      ],
      container,
      data: graphData,
      edge: {
        state: createEdgeStateStyles(graphPalette),
        style: (edge) => edge.style ?? {},
        type: "line",
      },
      height,
      layout: createForceLayout(width, height),
      node: {
        state: createNodeStateStyles(graphPalette),
        style: (node) => node.style ?? {},
        type: "circle",
      },
      padding: 48,
      width,
      zoomRange: GRAPH_ZOOM_RANGE,
    })

    graphRef.current = graph
    graphRenderReadyRef.current = null
    hasAppliedSelectionStateRef.current = false

    const clearNodeActiveState = (nodeId?: string) => {
      if (!nodeId || graph.destroyed) {
        return
      }

      const nextState = graph.getElementState(nodeId).filter((state) => state !== "active")
      void graph.setElementState(nodeId, nextState, false)
    }

    const updateHoverTooltip = (
      nodeId: string,
      event: {
        clientX?: number
        clientY?: number
        target?: { id?: string }
      }
    ) => {
      const node = graphModel.nodeMap.get(nodeId)

      if (!node || graph.destroyed) {
        return
      }

      const localPoint = resolveLocalPointerPosition(graph, container, event)
      const position = clampHoverTooltipPosition(
        container,
        localPoint.x,
        localPoint.y
      )

      setHoverTooltip({
        kind: node.kind,
        label: node.label,
        nodeId,
        x: position.x,
        y: position.y,
      })
    }

    const handleNodePointerEnter = (event: {
      target?: { id?: string }
      clientX?: number
      clientY?: number
    }) => {
      const nodeId = event.target?.id

      if (!nodeId || graph.destroyed) {
        return
      }

      const nextState = Array.from(
        new Set([...graph.getElementState(nodeId), "active"])
      )
      void graph.setElementState(nodeId, nextState, false)
      updateHoverTooltip(nodeId, event)
    }

    const handleNodePointerMove = (event: {
      target?: { id?: string }
      clientX?: number
      clientY?: number
    }) => {
      const nodeId = event.target?.id

      if (!nodeId) {
        return
      }

      updateHoverTooltip(nodeId, event)
    }

    const handleNodePointerLeave = (event: { target?: { id?: string } }) => {
      clearNodeActiveState(event.target?.id)
      setHoverTooltip(null)
    }

    const handleNodeDragStart = (event: { target?: { id?: string } }) => {
      lastNodeDragAtRef.current = performance.now()
      clearNodeActiveState(event.target?.id)
      setHoverTooltip(null)
    }

    const handleNodeDragEnd = () => {
      lastNodeDragAtRef.current = performance.now()
    }

    const handleNodeClick = (event: { target?: { id?: string } }) => {
      const nodeId = event.target?.id

      if (!nodeId || graph.destroyed) {
        return
      }

      if (performance.now() - lastNodeDragAtRef.current < 180) {
        return
      }

      setHoverTooltip(null)
      setSelectedNodeId(nodeId)
    }

    const handleCanvasClick = (event: {
      target?: { id?: string }
      targetType?: string
    }) => {
      if (event.target?.id || event.targetType === "node") {
        return
      }

      setHoverTooltip(null)
      setSelectedNodeId(null)
    }

    graph.on("node:pointerenter", handleNodePointerEnter as (event: unknown) => void)
    graph.on("node:pointermove", handleNodePointerMove as (event: unknown) => void)
    graph.on("node:pointerleave", handleNodePointerLeave as (event: unknown) => void)
    graph.on("node:dragstart", handleNodeDragStart as (event: unknown) => void)
    graph.on("node:dragend", handleNodeDragEnd as (event: unknown) => void)
    graph.on("node:click", handleNodeClick as (event: unknown) => void)
    graph.on("canvas:click", handleCanvasClick as (event: unknown) => void)

    const renderGraph = async () => {
      try {
        await graph.render()

        if (isDisposed || graph.destroyed) {
          return
        }

        graphRenderReadyRef.current = graph
        setRenderReadyVersion((version) => version + 1)

        await graph.fitView({
          direction: "both",
          when: "always",
        })
      } catch (error) {
        if (isDisposed || graph.destroyed) {
          return
        }

        console.error(error)
      }
    }

    const destroyGraph = () => {
      const isCurrentGraph =
        graphRef.current === graph || graphRenderReadyRef.current === graph

      if (graphRenderReadyRef.current === graph) {
        graphRenderReadyRef.current = null
      }

      if (isCurrentGraph) {
        hasAppliedSelectionStateRef.current = false
      }

      if (!graph.destroyed) {
        graph.destroy()
      }

      if (graphRef.current === graph) {
        graphRef.current = null
      }
    }

    renderFrameId = window.requestAnimationFrame(() => {
      renderFrameId = null
      renderPromise = renderGraph()
    })

    const resizeObserver = new ResizeObserver(() => {
      if (isDisposed || graph.destroyed) {
        return
      }

      const nextSize = getContainerSize(container)
      analysisBounds = createGraphAnalysisBounds(nextSize.width, nextSize.height)
      graph.setSize(nextSize.width, nextSize.height)
    })

    resizeObserver.observe(container)

    return () => {
      isDisposed = true
      if (graphRenderReadyRef.current === graph) {
        graphRenderReadyRef.current = null
      }

      hasAppliedSelectionStateRef.current = false
      resizeObserver.disconnect()
      graph.off("node:pointerenter", handleNodePointerEnter as (event: unknown) => void)
      graph.off("node:pointermove", handleNodePointerMove as (event: unknown) => void)
      graph.off("node:pointerleave", handleNodePointerLeave as (event: unknown) => void)
      graph.off("node:dragstart", handleNodeDragStart as (event: unknown) => void)
      graph.off("node:dragend", handleNodeDragEnd as (event: unknown) => void)
      graph.off("node:click", handleNodeClick as (event: unknown) => void)
      graph.off("canvas:click", handleCanvasClick as (event: unknown) => void)

      if (renderFrameId !== null) {
        window.cancelAnimationFrame(renderFrameId)
        renderFrameId = null
      }

      if (renderPromise) {
        void renderPromise.finally(destroyGraph)
        return
      }

      destroyGraph()
    }
  }, [graphData, graphModel.nodeMap, graphPalette])

  useEffect(() => {
    const graph = graphRef.current

    if (!graph || graph.destroyed || graphRenderReadyRef.current !== graph) {
      return
    }

    if (!selectedGraphNodeId && !hasAppliedSelectionStateRef.current) {
      return
    }

    hasAppliedSelectionStateRef.current = true
    void applySelectedGraphStates(graph, graphModel, selectedGraphNodeId).catch(
      (error) => {
        if (!graph.destroyed && graphRenderReadyRef.current === graph) {
          console.error(error)
        }
      }
    )
  }, [graphModel, renderReadyVersion, selectedGraphNodeId])

  return (
    <div className="relative h-full min-h-[720px] w-full animate-in duration-500 fade-in lg:min-h-[calc(100svh-8rem)]">
      <div
        ref={containerRef}
        className="h-full min-h-[720px] w-full cursor-grab active:cursor-grabbing lg:min-h-[calc(100svh-8rem)]"
      />

      {hoverTooltip ? (
        <div
          className={cn(
            "pointer-events-none absolute z-20 w-[min(20rem,calc(100%-1.5rem))] rounded-lg border px-3 py-2 backdrop-blur-sm",
            graphPalette.tooltipSurfaceClassName
          )}
          style={{
            left: `${hoverTooltip.x}px`,
            top: `${hoverTooltip.y}px`,
          }}
        >
          <p className="line-clamp-3 text-xs font-semibold leading-snug">
            {hoverTooltip.label}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            {GRAPH_VIEW_NODE_VISUALS[hoverTooltip.kind].label}
          </p>
        </div>
      ) : null}

      {selectedNode ? (
        <GraphNodeDetailInspector
          node={selectedNode}
          onClose={clearSelectedNode}
          relatedEdgeCount={selectedRelatedEdgeCount}
          relatedNodeCount={selectedRelatedNodeCount}
        />
      ) : null}

      <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex flex-wrap items-start justify-between gap-2 sm:inset-x-4 sm:top-4">
        <div className="rounded-full border border-border/80 bg-background/88 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm backdrop-blur">
          Biểu đồ tri thức
        </div>

        <div className="flex max-w-[min(100%,34rem)] flex-wrap items-center justify-end gap-1.5">
          {GRAPH_HUD_NODE_KIND_ORDER.filter(
            (kind) => graphModel.nodeCounts[kind] > 0
          ).map((kind) => (
            <GraphHudCountChip
              className={GRAPH_VIEW_NODE_VISUALS[kind].chipClassName}
              count={graphModel.nodeCounts[kind]}
              key={kind}
              label={GRAPH_VIEW_NODE_VISUALS[kind].label}
            />
          ))}
          <Button
            aria-label="Phóng to biểu đồ"
            title="Phóng to biểu đồ"
            type="button"
            size="icon-sm"
            variant="secondary"
            className="pointer-events-auto rounded-full border border-border/80 bg-background/88 shadow-sm backdrop-blur hover:bg-background"
            onClick={() => handleZoom("in")}
          >
            <Plus
              aria-hidden="true"
              className="size-4"
              data-icon="inline-start"
            />
          </Button>
          <Button
            aria-label="Thu nhỏ biểu đồ"
            title="Thu nhỏ biểu đồ"
            type="button"
            size="icon-sm"
            variant="secondary"
            className="pointer-events-auto rounded-full border border-border/80 bg-background/88 shadow-sm backdrop-blur hover:bg-background"
            onClick={() => handleZoom("out")}
          >
            <Minus
              aria-hidden="true"
              className="size-4"
              data-icon="inline-start"
            />
          </Button>
          <Button
            aria-label="Đưa biểu đồ về trung tâm"
            title="Đưa biểu đồ về trung tâm"
            type="button"
            size="icon-sm"
            variant="secondary"
            className="pointer-events-auto rounded-full border border-border/80 bg-background/88 shadow-sm backdrop-blur hover:bg-background"
            onClick={handleRecenter}
          >
            <RotateCcw
              aria-hidden="true"
              className="size-4"
              data-icon="inline-start"
            />
          </Button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex flex-wrap items-end justify-between gap-2 sm:inset-x-4 sm:bottom-4">
        <div className="rounded-full border border-border/80 bg-background/82 px-3 py-1.5 text-[11px] text-muted-foreground shadow-sm backdrop-blur">
          {graphModel.nodes.length} nút · {graphModel.edges.length} cạnh
        </div>

        <div className="flex max-w-[min(100%,36rem)] flex-wrap justify-end gap-1.5">
          {GRAPH_HUD_EDGE_KIND_ORDER.filter(
            (kind) => graphModel.edgeCounts[kind] > 0
          ).map((kind) => (
            <GraphHudCountChip
              className={GRAPH_VIEW_EDGE_VISUALS[kind].chipClassName}
              count={graphModel.edgeCounts[kind]}
              key={kind}
              label={GRAPH_VIEW_EDGE_VISUALS[kind].label}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
