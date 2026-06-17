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
  LocateFixed,
  Minus,
  Plus,
  X,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"

import {
  getGraphViewRelationLabel,
  parseGraphViewNodeId,
} from "@/app/lib/graph-view/definitions"
import { useLocalization } from "@/app/lib/i18n/provider"
import type {
  GraphViewEdgeKind,
  GraphViewNode,
  GraphViewNodeKind,
} from "@/app/lib/graph-view/definitions"
import { AppTimeMetadata } from "@/components/app-time-metadata"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import {
  getGraphViewEdgeVisuals,
  getGraphViewNodeVisuals,
} from "./graph-view-visuals"
import type { GraphModel } from "./graph-view-workbench"
import {
  LocalEntityQuickDetailDrawer,
  type LocalQuickDetailEntity,
} from "../local-entity-quick-detail-drawer"

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
  edgeHighlightLineWidthBoost: number
  edgeHighlightOpacity: number
  edgeInactiveOpacity: number
  labelBackground: boolean
  labelFill: string
  labelHoverFill: string
  labelHoverMaxWidth: number
  labelInactiveOpacity: number
  nodeHighlightOpacity: number
  nodeInactiveOpacity: number
  selectionEdgeOpacity: number
  selectionInactiveEdgeOpacity: number
  selectionInactiveNodeOpacity: number
  selectionRelatedNodeOpacity: number
}

const MIN_CANVAS_WIDTH = 360
const MIN_CANVAS_HEIGHT = 640
const GRAPH_CANVAS_PAN_RANGE = 0.45
const GRAPH_ANALYSIS_BOUNDS_SCALE = 1.45
const GRAPH_ANALYSIS_BOUNDS_MIN_PADDING = 144
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
const GRAPH_DENSE_NODE_THRESHOLD = 80
const GRAPH_DENSE_EDGE_THRESHOLD = 140
const GRAPH_DENSE_HIGH_CONNECTIVITY_EDGE_COUNT = 7
const GRAPH_INSPECTOR_DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
}
type LocalizationContext = ReturnType<typeof useLocalization>
type LocalizedNodeVisuals = ReturnType<typeof getGraphViewNodeVisuals>
type LocalizedEdgeVisuals = ReturnType<typeof getGraphViewEdgeVisuals>
const BOUNDED_DRAG_ELEMENT_FORCE_TYPE = "bounded-drag-element-force"
const GRAPH_HUD_NODE_KIND_ORDER = [
  "event",
  "asset",
  "theme",
  "news-article",
  "narrative",
  "warm-episode",
] satisfies GraphViewNodeKind[]
const GRAPH_HUD_EDGE_KIND_ORDER = [
  "event-asset",
  "event-theme",
  "news-article-event",
  "narrative-event",
  "narrative-asset",
  "asset-warm-episode",
  "warm-episode-event",
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
      edgeHighlightLineWidthBoost: 0.95,
      edgeHighlightOpacity: 0.84,
      edgeInactiveOpacity: 0.34,
      labelBackground: false,
      labelFill: "#f8fafc",
      labelHoverFill: "#ffffff",
      labelHoverMaxWidth: 300,
      labelInactiveOpacity: 0.72,
      nodeHighlightOpacity: 1,
      nodeInactiveOpacity: 0.66,
      selectionEdgeOpacity: 0.9,
      selectionInactiveEdgeOpacity: 0.2,
      selectionInactiveNodeOpacity: 0.38,
      selectionRelatedNodeOpacity: 0.82,
    }
  }

  return {
    edgeHighlightLineWidthBoost: 0.8,
    edgeHighlightOpacity: 0.78,
    edgeInactiveOpacity: 0.24,
    labelBackground: false,
    labelFill: "#172033",
    labelHoverFill: "#020617",
    labelHoverMaxWidth: 300,
    labelInactiveOpacity: 0.7,
    nodeHighlightOpacity: 1,
    nodeInactiveOpacity: 0.61,
    selectionEdgeOpacity: 0.82,
    selectionInactiveEdgeOpacity: 0.16,
    selectionInactiveNodeOpacity: 0.28,
    selectionRelatedNodeOpacity: 0.72,
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
  priority = "normal",
}: {
  className: string
  count: string
  label: string
  priority?: "normal" | "subtle"
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium backdrop-blur",
        priority === "normal"
          ? "h-7 px-2.5 text-[11px] shadow-sm"
          : "h-6 px-2 text-[10px] opacity-75 shadow-none",
        className
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "rounded-full bg-background/60 font-semibold",
          priority === "normal" ? "px-1.5 py-0.5 text-[10px]" : "px-1 text-[9px]"
        )}
      >
        {count}
      </span>
    </span>
  )
}

function GraphToolButton({
  children,
  label,
  onClick,
}: {
  children: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          aria-label={label}
          type="button"
          size="icon-sm"
          variant="outline"
          className="pointer-events-auto"
          onClick={onClick}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  )
}

function formatInspectorDate(
  value: string | null | undefined,
  localization: LocalizationContext
) {
  const formatted = localization.formatDateTime(
    value,
    GRAPH_INSPECTOR_DATE_TIME_OPTIONS,
    ""
  )

  return formatted || null
}

function formatInspectorConfidence(
  value: number | null | undefined,
  localization: LocalizationContext
) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return null
  }

  const normalizedValue = value <= 1 ? value : value / 100

  return localization.formatPercent(normalizedValue, {
    maximumFractionDigits: 0,
  })
}

function getInspectorText(value: string | null | undefined) {
  const trimmedValue = value?.trim()

  return trimmedValue || null
}

function getMeaningfulInspectorStatus(value: string | null | undefined) {
  const trimmedValue = getInspectorText(value)

  if (!trimmedValue || /^[A-Z0-9_]+$/.test(trimmedValue)) {
    return null
  }

  return trimmedValue
}

function getKnowledgeLayerLabel(
  value: string | null | undefined,
  dictionary: LocalizationContext["dictionary"]
) {
  const trimmedValue = getInspectorText(value)

  if (!trimmedValue) {
    return null
  }

  const labels = dictionary.graphView.knowledgeLayers as Record<string, string>
  return labels[trimmedValue] || trimmedValue
}

function getNodeQuickDetailAction(
  node: GraphViewNode,
  dictionary: LocalizationContext["dictionary"]
) {
  const entityReference = parseGraphViewNodeId(node.id)

  if (!entityReference) {
    return null
  }

  if (entityReference.kind === "event") {
    return {
      entity: {
        id: entityReference.entityId,
        kind: "event" as const,
      },
      label: dictionary.graphView.inspector.openEvent,
    }
  }

  if (entityReference.kind === "news-article") {
    return {
      entity: {
        id: entityReference.entityId,
        kind: "news-article" as const,
      },
      label: dictionary.graphView.inspector.openArticle,
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
      <dd className="mt-1 min-w-0" title={value ?? undefined}>
        {valueNode ?? (
          <span className="block truncate text-xs font-medium text-foreground">
            {value}
          </span>
        )}
      </dd>
    </div>
  )
}

function getGraphNodeInspectorFields({
  confidence,
  dictionary,
  metadata,
  node,
  occurredAt,
  periodEnd,
  periodStart,
  publishedAt,
}: {
  confidence: string | null
  dictionary: LocalizationContext["dictionary"]
  metadata: GraphViewNode["metadata"]
  node: GraphViewNode
  occurredAt: string | null
  periodEnd: string | null
  periodStart: string | null
  publishedAt: string | null
}) {
  const eventStatus = getMeaningfulInspectorStatus(metadata?.status)
  const knowledgeLayer = getKnowledgeLayerLabel(
    metadata?.knowledgeLayer,
    dictionary
  )
  const narrativeStatus = getInspectorText(metadata?.narrativeStatus)
  const newsOutletName = getInspectorText(metadata?.newsOutletName)
  const assetType = getInspectorText(metadata?.assetType)
  const thesis = getInspectorText(metadata?.thesis)
  const symbol = getInspectorText(metadata?.symbol)
  const showSymbol =
    symbol && symbol.toLowerCase() !== node.label.trim().toLowerCase()

  if (node.kind === "event") {
    return [
      {
        key: "occurred-at",
        label: dictionary.graphView.inspector.time,
        value: occurredAt,
        valueNode: occurredAt ? (
          <AppTimeMetadata icon={Calendar}>{occurredAt}</AppTimeMetadata>
        ) : undefined,
      },
      {
        key: "confidence",
        label: dictionary.graphView.inspector.confidence,
        value: confidence,
      },
      {
        key: "status",
        label: dictionary.graphView.inspector.status,
        value: eventStatus,
      },
    ]
  }

  if (node.kind === "news-article") {
    return [
      {
        key: "news-outlet",
        label: dictionary.graphView.inspector.newsOutlet,
        value: newsOutletName,
      },
      {
        key: "published-at",
        label: dictionary.graphView.inspector.publishedAt,
        value: publishedAt,
        valueNode: publishedAt ? (
          <AppTimeMetadata icon={Calendar}>{publishedAt}</AppTimeMetadata>
        ) : undefined,
      },
      {
        key: "confidence",
        label: dictionary.graphView.inspector.confidence,
        value: confidence,
      },
    ]
  }

  if (node.kind === "asset") {
    return [
      {
        key: "symbol",
        label: dictionary.graphView.inspector.symbol,
        value: showSymbol ? symbol : null,
      },
      {
        key: "asset-type",
        label: dictionary.graphView.inspector.assetType,
        value: assetType,
      },
    ]
  }

  if (node.kind === "narrative") {
    return [
      {
        key: "thesis",
        label: dictionary.graphView.inspector.thesis,
        value: thesis,
        valueNode: thesis ? (
          <span className="line-clamp-4 text-xs font-medium text-foreground">
            {thesis}
          </span>
        ) : undefined,
      },
      {
        key: "narrative-status",
        label: dictionary.graphView.inspector.narrativeStatus,
        value: narrativeStatus,
      },
      {
        key: "confidence",
        label: dictionary.graphView.inspector.confidence,
        value: confidence,
      },
    ]
  }

  if (node.kind === "warm-episode") {
    return [
      {
        key: "period-start",
        label: dictionary.graphView.inspector.periodStart,
        value: periodStart,
        valueNode: periodStart ? (
          <AppTimeMetadata icon={Calendar}>{periodStart}</AppTimeMetadata>
        ) : undefined,
      },
      {
        key: "period-end",
        label: dictionary.graphView.inspector.periodEnd,
        value: periodEnd,
        valueNode: periodEnd ? (
          <AppTimeMetadata icon={Calendar}>{periodEnd}</AppTimeMetadata>
        ) : undefined,
      },
      {
        key: "knowledge-layer",
        label: dictionary.graphView.inspector.knowledgeLayer,
        value: knowledgeLayer,
      },
      {
        key: "confidence",
        label: dictionary.graphView.inspector.confidence,
        value: confidence,
      },
    ]
  }

  return []
}

function GraphNodeDetailInspector({
  node,
  onClose,
  onOpenQuickDetail,
  relatedEdgeCount,
  relatedNodeCount,
}: {
  node: GraphViewNode
  onClose: () => void
  onOpenQuickDetail: (entity: LocalQuickDetailEntity) => void
  relatedEdgeCount: number
  relatedNodeCount: number
}) {
  const localization = useLocalization()
  const { dictionary, formatMessage, formatNumber } = localization
  const nodeVisuals = getGraphViewNodeVisuals(dictionary)
  const visual = nodeVisuals[node.kind]
  const metadata = node.metadata ?? {}
  const quickDetailAction = getNodeQuickDetailAction(node, dictionary)
  const detailActionLabel =
    node.kind === "event"
      ? dictionary.graphView.inspector.readEvent
      : node.kind === "news-article"
        ? dictionary.graphView.inspector.readArticle
        : quickDetailAction?.label
  const sourceUrl =
    node.kind === "news-article" && metadata.url?.trim()
      ? metadata.url.trim()
      : null
  const occurredAt = formatInspectorDate(metadata.occurredAt, localization)
  const periodStart = formatInspectorDate(metadata.periodStart, localization)
  const periodEnd = formatInspectorDate(metadata.periodEnd, localization)
  const publishedAt = formatInspectorDate(metadata.publishedAt, localization)
  const confidence = formatInspectorConfidence(metadata.confidence, localization)
  const relationSummary = formatMessage(
    dictionary.graphView.inspector.relationSummary,
    {
      edges: formatNumber(relatedEdgeCount),
      nodes: formatNumber(Math.max(relatedNodeCount - 1, 0)),
    }
  )
  const inspectorFields = getGraphNodeInspectorFields({
    confidence,
    dictionary,
    metadata,
    node,
    occurredAt,
    periodEnd,
    periodStart,
    publishedAt,
  })

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
          aria-label={dictionary.graphView.inspector.closeNodeDetails}
          title={dictionary.graphView.inspector.closeNodeDetails}
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
        {inspectorFields.length > 0 ? (
          <dl className="flex flex-col gap-2">
            {inspectorFields.map((field) => (
              <GraphNodeInspectorField
                key={field.key}
                label={field.label}
                value={field.value}
                valueNode={field.valueNode}
              />
            ))}
          </dl>
        ) : null}

        <p className="mt-3 rounded-full border border-border/60 bg-background/45 px-2.5 py-1 text-[11px] text-muted-foreground">
          {relationSummary}
        </p>

        {quickDetailAction || sourceUrl ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {quickDetailAction ? (
              <Button
                size="sm"
                type="button"
                variant="secondary"
                onClick={() => onOpenQuickDetail(quickDetailAction.entity)}
              >
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4"
                  data-icon="inline-start"
                />
                <span>{detailActionLabel}</span>
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
                  <span>{dictionary.graphView.inspector.openOriginalSource}</span>
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

function getGraphNodeFullLabel(node: NodeData) {
  const data = node.data as { label?: unknown } | undefined

  if (typeof data?.label === "string") {
    return data.label.trim()
  }

  if (typeof node.label === "string") {
    return node.label.trim()
  }

  return ""
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

function isDenseGraphModel(graphModel: GraphModel) {
  return (
    graphModel.nodes.length >= GRAPH_DENSE_NODE_THRESHOLD ||
    graphModel.edges.length >= GRAPH_DENSE_EDGE_THRESHOLD
  )
}

function isPriorityLabelNode({
  edgeCount,
  isDenseGraph,
  nodeKind,
}: {
  edgeCount: number
  isDenseGraph: boolean
  nodeKind: NodeData["kind"]
}) {
  if (nodeKind === "asset" || nodeKind === "theme") {
    return true
  }

  if (!isDenseGraph) {
    return (
      (nodeKind === "narrative" && edgeCount >= 2) ||
      (nodeKind === "warm-episode" && edgeCount >= 2) ||
      (nodeKind === "event" && edgeCount >= 4) ||
      edgeCount >= 6
    )
  }

  return (
    (nodeKind === "narrative" && edgeCount >= 2) ||
    (nodeKind === "warm-episode" && edgeCount >= 2) ||
    (nodeKind === "event" && edgeCount >= 4) ||
    (nodeKind === "news-article" && edgeCount >= 2) ||
    edgeCount >= GRAPH_DENSE_HIGH_CONNECTIVITY_EDGE_COUNT
  )
}

function inferClusterState(
  graphModel: GraphModel,
  nodeVisuals: LocalizedNodeVisuals
): ClusterState {
  const clusterByNodeId = new Map<string, string>()
  const clusterLabelByKey = new Map<string, string>()
  const edgesByNodeId = new Map<string, typeof graphModel.edges>()
  const eventClusterCandidates = new Map<
    string,
    {
      key: string
      label: string
      score: number
    }
  >()

  graphModel.nodes.forEach((node) => {
    edgesByNodeId.set(node.id, [])
  })

  graphModel.edges.forEach((edge) => {
    edgesByNodeId.get(edge.sourceNodeId)?.push(edge)
    edgesByNodeId.get(edge.targetNodeId)?.push(edge)
  })

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
    if (
      node.kind !== "news-article" &&
      node.kind !== "narrative" &&
      node.kind !== "warm-episode"
    ) {
      return
    }

    const eventEdge = edgesByNodeId.get(node.id)?.find((edge) => {
      const otherNodeId =
        edge.sourceNodeId === node.id ? edge.targetNodeId : edge.sourceNodeId

      return graphModel.nodeMap.get(otherNodeId)?.kind === "event"
    })

    if (eventEdge) {
      const eventNodeId =
        eventEdge.sourceNodeId === node.id
          ? eventEdge.targetNodeId
          : eventEdge.sourceNodeId
      const inheritedClusterKey = clusterByNodeId.get(eventNodeId)

      if (inheritedClusterKey) {
        clusterByNodeId.set(node.id, inheritedClusterKey)
        return
      }
    }

    if (node.kind !== "narrative" && node.kind !== "warm-episode") {
      return
    }

    const anchorEdge = edgesByNodeId.get(node.id)?.find((edge) => {
      const otherNodeId =
        edge.sourceNodeId === node.id ? edge.targetNodeId : edge.sourceNodeId
      const otherNode = graphModel.nodeMap.get(otherNodeId)

      return otherNode?.kind === "asset" || otherNode?.kind === "theme"
    })

    if (!anchorEdge) {
      return
    }

    const anchorNodeId =
      anchorEdge.sourceNodeId === node.id
        ? anchorEdge.targetNodeId
        : anchorEdge.sourceNodeId
    const anchorNode = graphModel.nodeMap.get(anchorNodeId)

    if (anchorNode) {
      clusterByNodeId.set(node.id, anchorNode.id)
      clusterLabelByKey.set(anchorNode.id, anchorNode.label)
    }
  })

  graphModel.nodes.forEach((node) => {
    if (clusterByNodeId.has(node.id)) {
      return
    }

    const fallbackKey = `${node.kind}:${node.id}`
    clusterByNodeId.set(node.id, fallbackKey)
    clusterLabelByKey.set(fallbackKey, nodeVisuals[node.kind].label)
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

  if (graphModel.nodes.length <= 24) {
    return true
  }

  return isPriorityLabelNode({
    edgeCount,
    isDenseGraph: isDenseGraphModel(graphModel),
    nodeKind,
  })
}

function createG6GraphData(
  graphModel: GraphModel,
  graphPalette: GraphCanvasPalette,
  nodeVisuals: LocalizedNodeVisuals,
  edgeVisuals: LocalizedEdgeVisuals,
  dictionary: LocalizationContext["dictionary"]
): GraphData {
  const clusterState = inferClusterState(graphModel, nodeVisuals)
  const nodes: NodeData[] = graphModel.nodes.map((node, index) => {
    const visual = nodeVisuals[node.kind]
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
        labelFill: graphPalette.labelFill,
        labelFontSize: 11,
        labelFontWeight: 600,
        labelMaxWidth: 220,
        labelMaxLines: 1,
        labelOffsetX: 9,
        labelPlacement: "right",
        labelText: showLabel ? node.label.trim() : "",
        labelTextOverflow: "ellipsis",
        labelWordWrap: true,
        lineWidth: 0,
        opacity: 0.96,
        size,
        x: seedPosition.x,
        y: seedPosition.y,
      },
    }
  })

  const edges: EdgeData[] = graphModel.edges.map((edge) => {
    const visual = edgeVisuals[edge.kind]
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
        relationLabel: getGraphViewRelationLabel(edge.relationType, dictionary),
        relationType: edge.relationType,
        sourceNodeId: edge.sourceNodeId,
        targetNodeId: edge.targetNodeId,
        weight: edge.weight ?? null,
      },
      style: {
        lineWidth: visual.size,
        opacity: sameCluster ? 0.46 : 0.32,
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
  const expandedLabel = (node: NodeData) => ({
    labelBackground: false,
    labelFill: graphPalette.labelHoverFill,
    labelFontSize: 12,
    labelFontWeight: 700,
    labelMaxLines: 3,
    labelMaxWidth: graphPalette.labelHoverMaxWidth,
    labelOpacity: 1,
    labelText: getGraphNodeFullLabel(node),
    labelTextOverflow: "ellipsis",
    labelWordWrap: true,
  })

  return {
    active: (node: NodeData) => ({
      ...expandedLabel(node),
      opacity: 1,
    }),
    highlight: (node: NodeData) => ({
      labelOpacity: 0.92,
      opacity: graphPalette.nodeHighlightOpacity,
    }),
    inactive: {
      labelOpacity: graphPalette.labelInactiveOpacity,
      opacity: graphPalette.nodeInactiveOpacity,
    },
    selected: (node: NodeData) => ({
      ...expandedLabel(node),
      opacity: 1,
    }),
    "selected-inactive": {
      labelOpacity: graphPalette.labelInactiveOpacity,
      opacity: graphPalette.selectionInactiveNodeOpacity,
    },
    "selected-related": (node: NodeData) => ({
      labelOpacity: 0.88,
      opacity: graphPalette.selectionRelatedNodeOpacity,
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
    ? (graphModel.relatedNodesByNodeId.get(selectedNodeId) ??
      new Set([selectedNodeId]))
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
  const localization = useLocalization()
  const { dictionary, formatMessage, formatNumber } = localization
  const { resolvedTheme } = useTheme()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const graphRef = useRef<Graph | null>(null)
  const graphRenderReadyRef = useRef<Graph | null>(null)
  const hasAppliedSelectionStateRef = useRef(false)
  const lastNodeDragAtRef = useRef(0)
  const [quickDetailEntity, setQuickDetailEntity] =
    useState<LocalQuickDetailEntity | null>(null)
  const [renderReadyVersion, setRenderReadyVersion] = useState(0)
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const graphThemeMode: GraphThemeMode =
    resolvedTheme === "dark" ? "dark" : "light"
  const graphPalette = useMemo(
    () => createGraphCanvasPalette(graphThemeMode),
    [graphThemeMode]
  )
  const nodeVisuals = useMemo(
    () => getGraphViewNodeVisuals(dictionary),
    [dictionary]
  )
  const edgeVisuals = useMemo(
    () => getGraphViewEdgeVisuals(dictionary),
    [dictionary]
  )
  const graphData = useMemo(
    () =>
      createG6GraphData(
        graphModel,
        graphPalette,
        nodeVisuals,
        edgeVisuals,
        dictionary
      ),
    [dictionary, edgeVisuals, graphModel, graphPalette, nodeVisuals]
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
        type: "center",
        animation: {
          duration: 1000,
          easing: "ease-in-out",
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

      const nextState = graph
        .getElementState(nodeId)
        .filter((state) => state !== "active")
      void graph.setElementState(nodeId, nextState, false)
    }

    const handleNodePointerEnter = (event: { target?: { id?: string } }) => {
      const nodeId = event.target?.id

      if (!nodeId || graph.destroyed) {
        return
      }

      const nextState = Array.from(
        new Set([...graph.getElementState(nodeId), "active"])
      )
      void graph.setElementState(nodeId, nextState, false)
    }

    const handleNodePointerLeave = (event: { target?: { id?: string } }) => {
      clearNodeActiveState(event.target?.id)
    }

    const handleNodeDragStart = (event: { target?: { id?: string } }) => {
      lastNodeDragAtRef.current = performance.now()
      clearNodeActiveState(event.target?.id)
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

      setSelectedNodeId(nodeId)
    }

    const handleCanvasClick = (event: {
      target?: { id?: string }
      targetType?: string
    }) => {
      if (event.target?.id || event.targetType === "node") {
        return
      }

      setSelectedNodeId(null)
    }

    graph.on("node:pointerenter", handleNodePointerEnter as (event: unknown) => void)
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
  }, [graphData, graphModel, graphPalette])

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
    <div className="relative size-full min-h-[36rem] max-w-full animate-in overflow-hidden duration-500 fade-in">
      <div
        ref={containerRef}
        className="size-full min-h-[36rem] max-w-full cursor-grab active:cursor-grabbing"
      />

      {selectedNode ? (
        <GraphNodeDetailInspector
          node={selectedNode}
          onClose={clearSelectedNode}
          onOpenQuickDetail={setQuickDetailEntity}
          relatedEdgeCount={selectedRelatedEdgeCount}
          relatedNodeCount={selectedRelatedNodeCount}
        />
      ) : null}

      <LocalEntityQuickDetailDrawer
        entity={quickDetailEntity}
        onClose={() => setQuickDetailEntity(null)}
      />

      <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex flex-wrap items-start justify-between gap-2 sm:inset-x-4 sm:top-4">
        <h1 className="max-w-[min(70%,24rem)] truncate text-lg font-semibold tracking-tight text-foreground sm:text-xl">
          {dictionary.graphView.title}
        </h1>

        <div className="flex max-w-[min(100%,32rem)] flex-wrap items-center justify-end gap-1.5 opacity-90">
          {GRAPH_HUD_NODE_KIND_ORDER.filter(
            (kind) => graphModel.nodeCounts[kind] > 0
          ).map((kind) => (
            <GraphHudCountChip
              className={nodeVisuals[kind].chipClassName}
              count={formatNumber(graphModel.nodeCounts[kind])}
              key={kind}
              label={nodeVisuals[kind].label}
            />
          ))}
        </div>
      </div>

      <TooltipProvider>
        <ButtonGroup
          orientation="vertical"
          className="pointer-events-auto absolute right-3 top-14 z-10 sm:right-4 sm:top-16"
        >
          <GraphToolButton
            label={dictionary.graphView.controls.zoomOut}
            onClick={() => handleZoom("out")}
          >
            <Minus aria-hidden="true" data-icon="inline-start" />
          </GraphToolButton>
          <GraphToolButton
            label={dictionary.graphView.controls.recenter}
            onClick={handleRecenter}
          >
            <LocateFixed aria-hidden="true" data-icon="inline-start" />
          </GraphToolButton>
          <GraphToolButton
            label={dictionary.graphView.controls.zoomIn}
            onClick={() => handleZoom("in")}
          >
            <Plus aria-hidden="true" data-icon="inline-start" />
          </GraphToolButton>
        </ButtonGroup>
      </TooltipProvider>

      <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex flex-wrap items-end justify-between gap-2 sm:inset-x-4 sm:bottom-4">
        <div className="rounded-full border border-border/60 bg-background/70 px-2.5 py-1 text-[10px] text-muted-foreground shadow-sm backdrop-blur">
          {formatMessage(dictionary.graphView.controls.summary, {
            nodes: formatNumber(graphModel.nodes.length),
            edges: formatNumber(graphModel.edges.length),
          })}
        </div>

        <div className="flex max-w-[min(100%,32rem)] flex-wrap justify-end gap-1.5">
          {GRAPH_HUD_EDGE_KIND_ORDER.filter(
            (kind) => graphModel.edgeCounts[kind] > 0
          ).map((kind) => (
            <GraphHudCountChip
              className={edgeVisuals[kind].chipClassName}
              count={formatNumber(graphModel.edgeCounts[kind])}
              key={kind}
              label={edgeVisuals[kind].label}
              priority="subtle"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
