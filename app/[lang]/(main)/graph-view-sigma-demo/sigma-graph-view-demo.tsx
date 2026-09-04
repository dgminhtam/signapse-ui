"use client"

import FA2Layout from "graphology-layout-forceatlas2/worker"
import {
  ArrowUpRight,
  LocateFixed,
  Minus,
  Plus,
  RefreshCw,
  X,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import Sigma from "sigma"

import type { AppLocale } from "@/app/lib/i18n/config"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import {
  createGraphViewDemoFixture,
  createGraphViewDemoGraph,
  createGraphViewDemoSeedPositions,
  GRAPH_VIEW_DEMO_EDGE_COUNTS,
  GRAPH_VIEW_DEMO_FIXTURE_VERSION,
  GRAPH_VIEW_DEMO_LAYOUT_VERSION,
  type GraphViewDemoEdgeAttributes,
  type GraphViewDemoEdgeCount,
  type GraphViewDemoGraph,
  type GraphViewDemoNodeAttributes,
  type GraphViewDemoPosition,
} from "@/app/lib/graph-view/demo-fixture"
import {
  readGraphViewDemoLayoutCache,
  writeGraphViewDemoLayoutCache,
} from "@/app/lib/graph-view/demo-layout-cache"
import {
  getGraphViewNodeEntityId,
  type GraphViewEdge,
  type GraphViewNode,
  type GraphViewNodeKind,
} from "@/app/lib/graph-view/definitions"
import { useLocalization } from "@/app/lib/i18n/provider"
import type { EventResponse } from "@/app/lib/events/definitions"
import type { NewsArticleResponse } from "@/app/lib/news-articles/definitions"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

import {
  LocalEntityQuickDetailDrawer,
  type LocalQuickDetailEntity,
  type LocalQuickDetailFixture,
} from "../local-entity-quick-detail-drawer"
import {
  getGraphViewEdgeVisuals,
  getGraphViewNodeVisuals,
} from "../graph-view/graph-view-visuals"

type GraphDemoThemeMode = "light" | "dark"
type GraphDemoLayoutStatus =
  "seed" | "cached" | "refining" | "ready" | "unsupported" | "error"

type GraphDemoPalette = {
  edgeDimStroke: string
  labelDimFill: string
  labelFill: string
  nodeDimFill: string
}

type GraphDemoNodeVisual = {
  chipClassName: string
  color: string
  label: string
  size: number
}

type GraphDemoEdgeVisual = {
  chipClassName: string
  color: string
  label: string
  size: number
}

const GRAPH_DEMO_ZOOM_RANGE = [0.12, 2.4] as const
const GRAPH_DEMO_ZOOM_FACTOR = 1.35
const GRAPH_DEMO_LAYOUT_DURATION = 1800
const GRAPH_DEMO_DRAG_LAYOUT_DURATION = 750
const GRAPH_DEMO_NODE_KIND_ORDER = [
  "event",
  "asset",
  "news-article",
  "narrative",
] as const satisfies readonly GraphViewNodeKind[]

function createGraphDemoPalette(mode: GraphDemoThemeMode): GraphDemoPalette {
  if (mode === "dark") {
    return {
      edgeDimStroke: "#64748b",
      labelDimFill: "#94a3b8",
      labelFill: "#f8fafc",
      nodeDimFill: "#64748b",
    }
  }

  return {
    edgeDimStroke: "#94a3b8",
    labelDimFill: "#64748b",
    labelFill: "#172033",
    nodeDimFill: "#cbd5e1",
  }
}

function canUseWebGL() {
  const canvas = document.createElement("canvas")

  return Boolean(
    canvas.getContext("webgl2") ??
    canvas.getContext("webgl") ??
    canvas.getContext("experimental-webgl")
  )
}

function getMotionDuration(duration: number) {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? 0
    : duration
}

function getNodeIds(graphView: { nodes: readonly GraphViewNode[] }) {
  return graphView.nodes.map((node) => node.id)
}

function getGraphPositions(graph: GraphViewDemoGraph) {
  const positions: Record<string, GraphViewDemoPosition> = {}

  graph.forEachNode((node, attributes) => {
    positions[node] = { x: attributes.x, y: attributes.y }
  })

  return positions
}

function getFocusedGraphParts(
  graph: GraphViewDemoGraph,
  nodeId: string | null,
  edgeId: string | null
) {
  if (nodeId) {
    return {
      edges: new Set(graph.edges(nodeId)),
      nodes: new Set([nodeId, ...graph.neighbors(nodeId)]),
    }
  }

  if (edgeId) {
    const [source, target] = graph.extremities(edgeId)

    return {
      edges: new Set([edgeId]),
      nodes: new Set([source, target]),
    }
  }

  return { edges: new Set<string>(), nodes: new Set<string>() }
}

function getGraphNodeRelationCounts(
  graphView: { edges: readonly GraphViewEdge[] },
  nodeId: string | null
) {
  if (!nodeId) {
    return { edges: 0, nodes: 0 }
  }

  const relatedNodeIds = new Set([nodeId])
  let relatedEdgeCount = 0

  for (const edge of graphView.edges) {
    if (edge.sourceNodeId !== nodeId && edge.targetNodeId !== nodeId) {
      continue
    }

    relatedEdgeCount += 1
    relatedNodeIds.add(edge.sourceNodeId)
    relatedNodeIds.add(edge.targetNodeId)
  }

  return { edges: relatedEdgeCount, nodes: relatedNodeIds.size }
}

function getDemoStatusLabel(
  status: GraphDemoLayoutStatus,
  dictionary: Dictionary
) {
  if (status === "cached") return dictionary.graphView.demo.layoutCached
  if (status === "refining") return dictionary.graphView.demo.layoutRefining
  if (status === "ready") return dictionary.graphView.demo.layoutReady
  if (status === "unsupported")
    return dictionary.graphView.demo.layoutUnsupported
  if (status === "error") return dictionary.graphView.demo.layoutError
  return dictionary.graphView.demo.layoutSeed
}

function getDemoQuickDetailFixture(
  node: GraphViewNode,
  locale: AppLocale
): LocalQuickDetailFixture | null {
  const entityId = getGraphViewNodeEntityId(node.id, node.kind)

  if (entityId === null) {
    return null
  }

  const now = "2026-01-15T12:00:00.000Z"
  const isVietnamese = locale === "vi"

  if (node.kind === "event") {
    const event: EventResponse = {
      assets: [],
      canonicalKey: node.metadata?.canonicalKey ?? `DEMO-EVENT-${entityId}`,
      confidence: node.metadata?.confidence ?? 0.8,
      createdDate: now,
      description: isVietnamese
        ? "Sự kiện fixture dùng để kiểm tra luồng quick detail cục bộ."
        : "A fixture event used to test the local quick-detail flow.",
      evidence: [],
      id: entityId,
      lastModifiedDate: now,
      status: "ENRICHED",
      themes: [],
      title: node.label,
      occurredAt: node.metadata?.occurredAt ?? now,
    }

    return {
      entity: { id: entityId, kind: "event" },
      event,
    }
  }

  if (node.kind !== "news-article") {
    return null
  }

  const article: NewsArticleResponse = {
    createdDate: now,
    description: isVietnamese
      ? "Bài viết fixture dùng để kiểm tra reader cục bộ."
      : "A fixture article used to test the local reader.",
    id: entityId,
    lastModifiedDate: now,
    publishedAt: node.metadata?.publishedAt ?? now,
    sourceName: "Signapse Fixture",
    status: "EVENT_RESOLVED",
    title: node.label,
    url: "",
    content: isVietnamese
      ? "Nội dung bài viết fixture được hiển thị hoàn toàn phía client."
      : "Fixture article content rendered entirely on the client.",
  }

  return {
    article,
    entity: { id: entityId, kind: "news-article" },
  }
}

function DemoControlButton({
  "aria-label": ariaLabel,
  children,
  onClick,
  testId,
}: {
  "aria-label": string
  children: ReactNode
  onClick: () => void
  testId: string
}) {
  return (
    <Button
      aria-label={ariaLabel}
      data-testid={testId}
      size="icon"
      type="button"
      variant="ghost"
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

function DemoNodeInspector({
  node,
  nodeVisuals,
  onClose,
  onOpenQuickDetail,
  relatedEdgeCount,
  relatedNodeCount,
}: {
  node: GraphViewNode
  nodeVisuals: Record<GraphViewNodeKind, GraphDemoNodeVisual>
  onClose: () => void
  onOpenQuickDetail: (
    entity: LocalQuickDetailEntity,
    trigger: HTMLElement
  ) => void
  relatedEdgeCount: number
  relatedNodeCount: number
}) {
  const {
    dictionary,
    formatMessage,
    formatNumber,
    formatDateTime,
    formatPercent,
  } = useLocalization()
  const visual = nodeVisuals[node.kind]
  const metadata = node.metadata ?? {}
  const entityId = getGraphViewNodeEntityId(node.id, node.kind)
  const quickDetailEntity =
    entityId !== null && (node.kind === "event" || node.kind === "news-article")
      ? { id: entityId, kind: node.kind }
      : null
  const relationSummary = formatMessage(
    dictionary.graphView.inspector.relationSummary,
    {
      edges: formatNumber(relatedEdgeCount),
      nodes: formatNumber(Math.max(relatedNodeCount - 1, 0)),
    }
  )
  const fields = [
    node.kind === "event"
      ? {
          label: dictionary.graphView.inspector.time,
          value: metadata.occurredAt
            ? formatDateTime(
                metadata.occurredAt,
                { day: "2-digit", month: "2-digit", year: "numeric" },
                dictionary.common.notAvailable
              )
            : null,
        }
      : null,
    node.kind === "news-article"
      ? {
          label: dictionary.graphView.inspector.publishedAt,
          value: metadata.publishedAt
            ? formatDateTime(
                metadata.publishedAt,
                { day: "2-digit", month: "2-digit", year: "numeric" },
                dictionary.common.notAvailable
              )
            : null,
        }
      : null,
    node.kind === "asset"
      ? {
          label: dictionary.graphView.inspector.symbol,
          value: metadata.symbol ?? null,
        }
      : null,
    node.kind === "narrative"
      ? {
          label: dictionary.graphView.inspector.thesis,
          value: metadata.thesis ?? null,
        }
      : null,
    typeof metadata.confidence === "number"
      ? {
          label: dictionary.graphView.inspector.confidence,
          value: formatPercent(
            metadata.confidence <= 1
              ? metadata.confidence
              : metadata.confidence / 100,
            { maximumFractionDigits: 0 }
          ),
        }
      : null,
  ].filter((field): field is { label: string; value: string } =>
    Boolean(field?.value)
  )

  return (
    <aside
      aria-label={dictionary.graphView.demo.selectedNode}
      className="pointer-events-auto absolute inset-x-3 bottom-14 z-20 max-h-[26rem] overflow-hidden rounded-2xl border border-border/80 bg-popover/95 text-popover-foreground shadow-2xl backdrop-blur-md md:inset-x-auto md:top-16 md:right-4 md:bottom-auto md:max-h-[calc(100%-5rem)] md:w-[22rem]"
      data-testid="graph-demo-inspector"
    >
      <div className="flex items-start gap-3 border-b border-border/70 px-3.5 py-3">
        <span
          aria-hidden="true"
          className="mt-1 size-3.5 shrink-0 rounded-full shadow-sm"
          style={{ backgroundColor: visual.color }}
        />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {visual.label}
          </p>
          <h2 className="mt-1 line-clamp-3 text-sm leading-snug font-semibold">
            {node.label}
          </h2>
          {node.secondaryLabel ? (
            <p className="mt-1 truncate text-xs text-muted-foreground">
              {node.secondaryLabel}
            </p>
          ) : null}
        </div>
        <Button
          aria-label={dictionary.graphView.demo.closeDetails}
          data-testid="graph-demo-close-inspector"
          size="icon-xs"
          type="button"
          variant="ghost"
          onClick={onClose}
        >
          <X aria-hidden="true" data-icon="inline-start" />
        </Button>
      </div>

      <div className="max-h-[20rem] overflow-y-auto p-3.5">
        {fields.length > 0 ? (
          <dl className="flex flex-col gap-2">
            {fields.map((field) => (
              <div
                className="min-w-0 rounded-lg border border-border/60 bg-background/55 px-2.5 py-2"
                key={field.label}
              >
                <dt className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                  {field.label}
                </dt>
                <dd className="mt-1 truncate text-xs font-medium text-foreground">
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>
        ) : null}

        <p className="mt-3 rounded-full border border-border/60 bg-background/45 px-2.5 py-1 text-[11px] text-muted-foreground">
          {relationSummary}
        </p>

        {quickDetailEntity ? (
          <Button
            data-testid="graph-demo-open-quick-detail"
            size="sm"
            type="button"
            variant="secondary"
            onClick={(event) =>
              onOpenQuickDetail(quickDetailEntity, event.currentTarget)
            }
          >
            <ArrowUpRight aria-hidden="true" data-icon="inline-start" />
            {node.kind === "event"
              ? dictionary.graphView.demo.openEvent
              : dictionary.graphView.demo.openArticle}
          </Button>
        ) : null}
      </div>
    </aside>
  )
}

function DemoEdgeInspector({
  edge,
  edgeVisuals,
  onClose,
}: {
  edge: GraphViewEdge
  edgeVisuals: Record<string, GraphDemoEdgeVisual>
  onClose: () => void
}) {
  const { dictionary } = useLocalization()
  const visual = edgeVisuals[edge.kind]
  const fields = [
    { label: dictionary.graphView.demo.relation, value: visual.label },
    {
      label: dictionary.graphView.demo.direction,
      value: `${edge.sourceNodeId} → ${edge.targetNodeId}`,
    },
    { label: dictionary.graphView.inspector.status, value: edge.relationType },
    edge.note
      ? { label: dictionary.graphView.demo.note, value: edge.note }
      : null,
  ].filter((field): field is { label: string; value: string } =>
    Boolean(field?.value)
  )

  return (
    <aside
      aria-label={dictionary.graphView.demo.selectedEdge}
      className="pointer-events-auto absolute inset-x-3 bottom-14 z-20 max-h-[26rem] overflow-hidden rounded-2xl border border-border/80 bg-popover/95 text-popover-foreground shadow-2xl backdrop-blur-md md:inset-x-auto md:top-16 md:right-4 md:bottom-auto md:max-h-[calc(100%-5rem)] md:w-[22rem]"
      data-testid="graph-demo-edge-inspector"
    >
      <div className="flex items-start gap-3 border-b border-border/70 px-3.5 py-3">
        <span
          aria-hidden="true"
          className="mt-1 size-3.5 shrink-0 rounded-full shadow-sm"
          style={{ backgroundColor: visual?.color }}
        />
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
            {dictionary.graphView.demo.selectedEdge}
          </p>
          <h2 className="mt-1 line-clamp-2 text-sm leading-snug font-semibold">
            {edge.id}
          </h2>
        </div>
        <Button
          aria-label={dictionary.graphView.demo.closeDetails}
          data-testid="graph-demo-close-edge-inspector"
          size="icon-xs"
          type="button"
          variant="ghost"
          onClick={onClose}
        >
          <X aria-hidden="true" data-icon="inline-start" />
        </Button>
      </div>

      <dl className="flex max-h-[20rem] flex-col gap-2 overflow-y-auto p-3.5">
        {fields.map((field) => (
          <div
            className="min-w-0 rounded-lg border border-border/60 bg-background/55 px-2.5 py-2"
            key={field.label}
          >
            <dt className="text-[10px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
              {field.label}
            </dt>
            <dd className="mt-1 text-xs font-medium break-words text-foreground">
              {field.value}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  )
}

export function SigmaGraphViewDemo({
  initialEdgeCount,
}: {
  initialEdgeCount: GraphViewDemoEdgeCount
}) {
  const localization = useLocalization()
  const { dictionary, formatMessage, formatNumber, locale } = localization
  const { resolvedTheme } = useTheme()
  const [edgeCount, setEdgeCount] = useState(initialEdgeCount)
  const [layoutStatus, setLayoutStatus] =
    useState<GraphDemoLayoutStatus>("seed")
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null)
  const [quickDetailEntity, setQuickDetailEntity] =
    useState<LocalQuickDetailEntity | null>(null)
  const [renderError, setRenderError] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const sigmaRef = useRef<Sigma<
    GraphViewDemoNodeAttributes,
    GraphViewDemoEdgeAttributes
  > | null>(null)
  const graphRef = useRef<GraphViewDemoGraph | null>(null)
  const layoutRef = useRef<FA2Layout<
    GraphViewDemoNodeAttributes,
    GraphViewDemoEdgeAttributes
  > | null>(null)
  const layoutStopTimerRef = useRef<number | null>(null)
  const selectedNodeIdRef = useRef<string | null>(null)
  const selectedEdgeIdRef = useRef<string | null>(null)
  const hoveredNodeIdRef = useRef<string | null>(null)
  const activeNodesRef = useRef<Set<string>>(new Set())
  const activeEdgesRef = useRef<Set<string>>(new Set())
  const draggedNodeIdRef = useRef<string | null>(null)
  const draggedNodeMovedRef = useRef(false)
  const quickDetailReturnFocusRef = useRef<HTMLElement | null>(null)
  const graphThemeMode: GraphDemoThemeMode =
    resolvedTheme === "dark" ? "dark" : "light"
  const graphPalette = useMemo(
    () => createGraphDemoPalette(graphThemeMode),
    [graphThemeMode]
  )
  const graphView = useMemo(
    () => createGraphViewDemoFixture(edgeCount, locale),
    [edgeCount, locale]
  )
  const nodeVisuals = useMemo(
    () => getGraphViewNodeVisuals(dictionary),
    [dictionary]
  ) as Record<GraphViewNodeKind, GraphDemoNodeVisual>
  const edgeVisuals = useMemo(
    () => getGraphViewEdgeVisuals(dictionary),
    [dictionary]
  ) as Record<string, GraphDemoEdgeVisual>
  const selectedNode = selectedNodeId
    ? (graphView.nodes.find((node) => node.id === selectedNodeId) ?? null)
    : null
  const selectedEdge = selectedEdgeId
    ? (graphView.edges.find((edge) => edge.id === selectedEdgeId) ?? null)
    : null
  const selectedNodeRelationCounts = useMemo(
    () => getGraphNodeRelationCounts(graphView, selectedNodeId),
    [graphView, selectedNodeId]
  )
  const quickDetailFixture = useMemo(
    () =>
      selectedNode ? getDemoQuickDetailFixture(selectedNode, locale) : null,
    [locale, selectedNode]
  )
  const layoutStatusLabel = getDemoStatusLabel(layoutStatus, dictionary)

  useEffect(() => {
    selectedNodeIdRef.current = selectedNodeId
  }, [selectedNodeId])

  useEffect(() => {
    selectedEdgeIdRef.current = selectedEdgeId
  }, [selectedEdgeId])

  useEffect(() => {
    const container = containerRef.current

    if (!container) {
      return
    }

    let sigma: Sigma<
      GraphViewDemoNodeAttributes,
      GraphViewDemoEdgeAttributes
    > | null = null
    let graph: GraphViewDemoGraph | null = null
    let layout: FA2Layout<
      GraphViewDemoNodeAttributes,
      GraphViewDemoEdgeAttributes
    > | null = null
    let isDisposed = false
    const nodeIds = getNodeIds(graphView)
    const cachedPositions = readGraphViewDemoLayoutCache(edgeCount, nodeIds)
    const initialPositions =
      cachedPositions ?? createGraphViewDemoSeedPositions(graphView.nodes)

    const updateBenchmarkAnchor = () => {
      const nodeId = nodeIds[0]

      if (!sigma || !nodeId || isDisposed) {
        return
      }

      const displayData = sigma.getNodeDisplayData(nodeId)

      if (!displayData) {
        return
      }

      const viewportPosition = sigma.framedGraphToViewport({
        x: displayData.x,
        y: displayData.y,
      })

      container.dataset.benchmarkAnchorId = nodeId
      container.dataset.benchmarkAnchorX = String(viewportPosition.x)
      container.dataset.benchmarkAnchorY = String(viewportPosition.y)
    }

    selectedNodeIdRef.current = null
    selectedEdgeIdRef.current = null
    hoveredNodeIdRef.current = null
    activeNodesRef.current = new Set()
    activeEdgesRef.current = new Set()
    setSelectedNodeId(null)
    setSelectedEdgeId(null)
    setQuickDetailEntity(null)
    setRenderError(false)

    if (!canUseWebGL()) {
      window.queueMicrotask(() => {
        if (!isDisposed) {
          setLayoutStatus("unsupported")
        }
      })
      return
    }

    const refreshFocus = () => {
      if (!sigma || !graph || sigma.getGraph() !== graph) {
        return
      }

      sigma.scheduleRefresh({
        layoutUnchange: true,
        partialGraph: {
          edges: graph.edges(),
          nodes: graph.nodes(),
        },
      })
    }

    const updateFocus = (nodeId: string | null, edgeId: string | null) => {
      if (!graph) {
        return
      }

      const focused = getFocusedGraphParts(graph, nodeId, edgeId)
      activeNodesRef.current = focused.nodes
      activeEdgesRef.current = focused.edges
      refreshFocus()
    }

    const stopLayout = (writeCache: boolean) => {
      if (!layout || !graph || isDisposed) {
        return
      }

      layout.stop()
      layoutStopTimerRef.current = null
      if (writeCache) {
        writeGraphViewDemoLayoutCache(
          edgeCount,
          nodeIds,
          getGraphPositions(graph)
        )
      }

      if (sigma && !sigma.getCamera().isAnimated()) {
        void sigma
          .getCamera()
          .animatedReset({ duration: getMotionDuration(280) })
          .then(updateBenchmarkAnchor)
          .catch(() => undefined)
      }

      updateBenchmarkAnchor()

      setLayoutStatus(
        writeCache ? "ready" : cachedPositions ? "cached" : "ready"
      )
    }

    const scheduleLayoutStop = (duration: number, writeCache: boolean) => {
      if (layoutStopTimerRef.current !== null) {
        window.clearTimeout(layoutStopTimerRef.current)
      }

      layoutStopTimerRef.current = window.setTimeout(
        () => stopLayout(writeCache),
        duration
      )
    }

    const startLayout = (duration: number, writeCache: boolean) => {
      if (!layout || layout.isRunning()) {
        scheduleLayoutStop(duration, writeCache)
        return
      }

      layout.start()
      setLayoutStatus("refining")
      scheduleLayoutStop(duration, writeCache)
    }

    try {
      const layoutGraph = createGraphViewDemoGraph({
        dictionary,
        edgeVisuals,
        graphView,
        nodeVisuals,
        positions: initialPositions,
      })
      const priorityNodeIds = new Set(
        layoutGraph
          .nodes()
          .filter((nodeId) => {
            const attributes = layoutGraph.getNodeAttributes(nodeId)

            return (
              attributes.kind === "asset" ||
              attributes.kind === "narrative" ||
              layoutGraph.degree(nodeId) >= 8
            )
          })
          .sort((left, right) => {
            const degreeDelta =
              layoutGraph.degree(right) - layoutGraph.degree(left)

            return degreeDelta || left.localeCompare(right)
          })
          .slice(0, 12)
      )

      graph = layoutGraph
      graphRef.current = layoutGraph

      sigma = new Sigma(layoutGraph, container, {
        autoCenter: true,
        autoRescale: true,
        cameraPanBoundaries: true,
        defaultEdgeColor: graphPalette.edgeDimStroke,
        defaultEdgeType: "line",
        defaultNodeColor: graphPalette.nodeDimFill,
        defaultNodeType: "circle",
        edgeLabelColor: { color: graphPalette.labelFill },
        edgeLabelFont: "Geist, sans-serif",
        edgeLabelSize: 9,
        edgeLabelWeight: "500",
        enableCameraPanning: true,
        enableCameraRotation: false,
        enableCameraZooming: true,
        enableEdgeEvents: true,
        hideEdgesOnMove: true,
        hideLabelsOnMove: true,
        labelColor: { color: graphPalette.labelFill },
        labelDensity: 0.08,
        labelFont: "Geist, sans-serif",
        labelRenderedSizeThreshold: 9,
        labelSize: 11,
        labelWeight: "600",
        maxCameraRatio: GRAPH_DEMO_ZOOM_RANGE[1],
        minCameraRatio: GRAPH_DEMO_ZOOM_RANGE[0],
        nodeReducer: (node, data) => {
          const hasFocus =
            activeNodesRef.current.size > 0 || activeEdgesRef.current.size > 0
          const isActive = activeNodesRef.current.has(node)
          const isFocused =
            node === selectedNodeIdRef.current ||
            node === hoveredNodeIdRef.current

          if (!hasFocus) {
            return {
              ...data,
              forceLabel: priorityNodeIds.has(node),
              highlighted: false,
              label: data.label,
            }
          }

          if (isActive) {
            return {
              ...data,
              forceLabel: true,
              highlighted: true,
              label: data.label,
              zIndex: isFocused ? 3 : 2,
            }
          }

          return {
            ...data,
            color: graphPalette.nodeDimFill,
            forceLabel: false,
            highlighted: false,
            label: null,
            zIndex: 0,
          }
        },
        edgeReducer: (edge, data) => {
          const hasFocus =
            activeNodesRef.current.size > 0 || activeEdgesRef.current.size > 0
          const isActive = activeEdgesRef.current.has(edge)
          const isSelected = edge === selectedEdgeIdRef.current

          if (!hasFocus) {
            return {
              ...data,
              forceLabel: false,
              label: null,
            }
          }

          if (isActive) {
            return {
              ...data,
              forceLabel: isSelected,
              label: isSelected ? data.label : null,
              size: isSelected ? data.size + 0.5 : data.size,
            }
          }

          return {
            ...data,
            color: graphPalette.edgeDimStroke,
            forceLabel: false,
            label: null,
            size: Math.max(0.5, data.size * 0.6),
          }
        },
        renderEdgeLabels: true,
        renderLabels: true,
        stagePadding: 48,
      })
      sigmaRef.current = sigma
      sigma.on("afterRender", updateBenchmarkAnchor)
      window.requestAnimationFrame(updateBenchmarkAnchor)

      layout = new FA2Layout(layoutGraph, {
        settings: {
          adjustSizes: true,
          barnesHutOptimize: true,
          barnesHutTheta: 0.7,
          gravity: 0.6,
          scalingRatio: 8,
          slowDown: 8,
        },
      })
      layoutRef.current = layout

      sigma.on("wheelStage", ({ preventSigmaDefault }) => {
        preventSigmaDefault()
      })
      sigma.on("wheelNode", ({ preventSigmaDefault }) => {
        preventSigmaDefault()
      })
      sigma.on("enterNode", ({ node }) => {
        if (selectedNodeIdRef.current || selectedEdgeIdRef.current) {
          return
        }

        hoveredNodeIdRef.current = node
        updateFocus(node, null)
      })
      sigma.on("leaveNode", ({ node }) => {
        if (hoveredNodeIdRef.current !== node) {
          return
        }

        hoveredNodeIdRef.current = null
        updateFocus(null, null)
      })
      sigma.on("clickNode", ({ node, preventSigmaDefault }) => {
        preventSigmaDefault()

        if (draggedNodeMovedRef.current) {
          draggedNodeMovedRef.current = false
          return
        }

        hoveredNodeIdRef.current = null

        if (selectedNodeIdRef.current === node) {
          selectedNodeIdRef.current = null
          setSelectedNodeId(null)
          updateFocus(null, null)
          return
        }

        selectedNodeIdRef.current = node
        selectedEdgeIdRef.current = null
        setSelectedNodeId(node)
        setSelectedEdgeId(null)
        updateFocus(node, null)
      })
      sigma.on("clickEdge", ({ edge, preventSigmaDefault }) => {
        preventSigmaDefault()
        hoveredNodeIdRef.current = null
        selectedNodeIdRef.current = null
        setSelectedNodeId(null)

        if (selectedEdgeIdRef.current === edge) {
          selectedEdgeIdRef.current = null
          setSelectedEdgeId(null)
          updateFocus(null, null)
          return
        }

        selectedEdgeIdRef.current = edge
        setSelectedEdgeId(edge)
        updateFocus(null, edge)
      })
      sigma.on("clickStage", () => {
        hoveredNodeIdRef.current = null
        selectedNodeIdRef.current = null
        selectedEdgeIdRef.current = null
        setSelectedNodeId(null)
        setSelectedEdgeId(null)
        updateFocus(null, null)
      })
      sigma.on("downNode", ({ node, preventSigmaDefault }) => {
        preventSigmaDefault()
        draggedNodeIdRef.current = node
        draggedNodeMovedRef.current = false
        layoutGraph.setNodeAttribute(node, "fixed", true)
        startLayout(GRAPH_DEMO_DRAG_LAYOUT_DURATION, false)
      })
      sigma.getMouseCaptor().on("mousemovebody", (event) => {
        const node = draggedNodeIdRef.current

        if (!node) {
          return
        }

        event.preventSigmaDefault()
        const position = sigma?.viewportToGraph({ x: event.x, y: event.y })

        if (!position) {
          return
        }

        draggedNodeMovedRef.current = true
        layoutGraph.updateNodeAttributes(node, (attributes) => ({
          ...attributes,
          fixed: true,
          x: position.x,
          y: position.y,
        }))
      })
      sigma.getMouseCaptor().on("mouseup", (event) => {
        if (!draggedNodeIdRef.current) {
          return
        }

        event.preventSigmaDefault()
        layoutGraph.setNodeAttribute(draggedNodeIdRef.current, "fixed", true)
        draggedNodeIdRef.current = null
        scheduleLayoutStop(GRAPH_DEMO_DRAG_LAYOUT_DURATION, false)
      })

      const resizeObserver = new ResizeObserver(() => {
        if (!isDisposed && sigma) {
          sigma.resize()
        }
      })
      resizeObserver.observe(container)

      if (cachedPositions) {
        window.queueMicrotask(() => {
          if (!isDisposed) {
            setLayoutStatus("cached")
          }
        })
      } else {
        startLayout(GRAPH_DEMO_LAYOUT_DURATION, true)
      }

      return () => {
        isDisposed = true
        resizeObserver.disconnect()

        if (layoutStopTimerRef.current !== null) {
          window.clearTimeout(layoutStopTimerRef.current)
          layoutStopTimerRef.current = null
        }

        layout?.kill()
        sigma?.kill()

        if (layoutRef.current === layout) {
          layoutRef.current = null
        }
        if (sigmaRef.current === sigma) {
          sigmaRef.current = null
        }
        if (graphRef.current === graph) {
          graphRef.current = null
        }
      }
    } catch (error) {
      if (!isDisposed) {
        console.error(error)
        window.queueMicrotask(() => {
          if (!isDisposed) {
            setRenderError(true)
            setLayoutStatus("error")
          }
        })
      }
    }

    return () => {
      isDisposed = true

      if (layoutStopTimerRef.current !== null) {
        window.clearTimeout(layoutStopTimerRef.current)
        layoutStopTimerRef.current = null
      }

      layout?.kill()
      sigma?.kill()

      if (layoutRef.current === layout) {
        layoutRef.current = null
      }
      if (sigmaRef.current === sigma) {
        sigmaRef.current = null
      }
      if (graphRef.current === graph) {
        graphRef.current = null
      }
    }
  }, [dictionary, edgeCount, edgeVisuals, graphPalette, graphView, nodeVisuals])

  const handleZoom = (direction: "in" | "out") => {
    const sigma = sigmaRef.current

    if (!sigma) {
      return
    }

    const camera = sigma.getCamera()
    const currentRatio = camera.getState().ratio
    const nextRatio = Math.min(
      Math.max(
        direction === "in"
          ? currentRatio / GRAPH_DEMO_ZOOM_FACTOR
          : currentRatio * GRAPH_DEMO_ZOOM_FACTOR,
        GRAPH_DEMO_ZOOM_RANGE[0]
      ),
      GRAPH_DEMO_ZOOM_RANGE[1]
    )

    void camera
      .animate(
        { ratio: nextRatio },
        { duration: getMotionDuration(220), easing: "quadraticInOut" }
      )
      .catch(() => undefined)
  }

  const handleRecenter = () => {
    const sigma = sigmaRef.current

    if (!sigma) {
      return
    }

    void sigma
      .getCamera()
      .animatedReset({ duration: getMotionDuration(320) })
      .catch(() => undefined)
  }

  const handleReLayout = () => {
    const graph = graphRef.current
    const layout = layoutRef.current

    if (!graph || !layout) {
      return
    }

    const seedPositions = createGraphViewDemoSeedPositions(graphView.nodes)

    graph.updateEachNodeAttributes((node, attributes) => ({
      ...attributes,
      fixed: false,
      x: seedPositions[node]?.x ?? attributes.x,
      y: seedPositions[node]?.y ?? attributes.y,
    }))
    selectedNodeIdRef.current = null
    selectedEdgeIdRef.current = null
    hoveredNodeIdRef.current = null
    activeNodesRef.current = new Set()
    activeEdgesRef.current = new Set()
    setSelectedNodeId(null)
    setSelectedEdgeId(null)
    setQuickDetailEntity(null)
    setLayoutStatus("refining")

    if (layout.isRunning()) {
      layout.stop()
    }

    layout.start()

    if (layoutStopTimerRef.current !== null) {
      window.clearTimeout(layoutStopTimerRef.current)
    }

    layoutStopTimerRef.current = window.setTimeout(() => {
      const currentGraph = graphRef.current

      if (!currentGraph || currentGraph !== graph) {
        return
      }

      layout.stop()
      writeGraphViewDemoLayoutCache(
        edgeCount,
        getNodeIds(graphView),
        getGraphPositions(currentGraph)
      )
      setLayoutStatus("ready")
      layoutStopTimerRef.current = null
    }, GRAPH_DEMO_LAYOUT_DURATION)
  }

  const handleEdgePresetChange = (nextEdgeCount: GraphViewDemoEdgeCount) => {
    if (nextEdgeCount === edgeCount) {
      return
    }

    setEdgeCount(nextEdgeCount)
  }

  const handleOpenQuickDetail = (
    entity: LocalQuickDetailEntity,
    trigger: HTMLElement
  ) => {
    quickDetailReturnFocusRef.current = trigger
    setQuickDetailEntity(entity)
  }

  const statusIsBlocking = layoutStatus === "unsupported" || renderError

  return (
    <section
      className="relative h-[calc(100svh-6.5rem)] min-h-[36rem] w-full max-w-full overflow-hidden rounded-xl border bg-card shadow-sm"
      data-engine="sigma"
      data-fixture-version={GRAPH_VIEW_DEMO_FIXTURE_VERSION}
      data-layout-status={layoutStatus}
      data-layout-version={GRAPH_VIEW_DEMO_LAYOUT_VERSION}
      data-testid="graph-view-sigma-demo"
    >
      <div
        aria-hidden={statusIsBlocking}
        className={cn(
          "size-full min-h-[36rem] max-w-full",
          statusIsBlocking && "invisible"
        )}
        data-engine-canvas="sigma"
        data-testid="graph-demo-canvas"
        ref={containerRef}
      />

      {statusIsBlocking ? (
        <div className="absolute inset-6 flex items-center justify-center rounded-xl border border-dashed border-border/70 bg-muted/20 p-6 text-center">
          <div className="max-w-md" role="status" aria-live="polite">
            <p className="text-sm font-semibold text-foreground">
              {layoutStatus === "unsupported"
                ? dictionary.graphView.demo.unsupportedTitle
                : dictionary.graphView.demo.layoutError}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {layoutStatus === "unsupported"
                ? dictionary.graphView.demo.layoutUnsupported
                : dictionary.graphView.demo.layoutError}
            </p>
          </div>
        </div>
      ) : null}

      <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex flex-wrap items-start justify-between gap-2 sm:inset-x-4 sm:top-4">
        <div className="pointer-events-auto max-w-[min(100%,34rem)] min-w-0">
          <p className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            {dictionary.graphView.demo.eyebrow}
          </p>
          <h1 className="mt-1 max-w-[min(70vw,32rem)] truncate text-lg font-semibold tracking-tight text-foreground sm:text-xl">
            {dictionary.graphView.demo.title}
          </h1>
          <p className="mt-1 hidden max-w-xl text-xs leading-5 text-muted-foreground sm:block">
            {dictionary.graphView.demo.description}
          </p>
        </div>

        <div className="pointer-events-auto flex max-w-[min(100%,34rem)] flex-wrap items-center justify-end gap-1.5">
          {GRAPH_DEMO_NODE_KIND_ORDER.map((kind) => (
            <Badge
              className={nodeVisuals[kind].chipClassName}
              key={kind}
              variant="outline"
            >
              {nodeVisuals[kind].label} {formatNumber(25)}
            </Badge>
          ))}
        </div>
      </div>

      <div className="pointer-events-auto absolute top-[5.75rem] right-3 z-10 flex flex-col gap-2 sm:top-16 sm:right-4">
        <ButtonGroup orientation="vertical">
          <DemoControlButton
            aria-label={dictionary.graphView.controls.zoomOut}
            testId="graph-demo-zoom-out"
            onClick={() => handleZoom("out")}
          >
            <Minus aria-hidden="true" data-icon="inline-start" />
          </DemoControlButton>
          <DemoControlButton
            aria-label={dictionary.graphView.controls.recenter}
            testId="graph-demo-recenter"
            onClick={handleRecenter}
          >
            <LocateFixed aria-hidden="true" data-icon="inline-start" />
          </DemoControlButton>
          <DemoControlButton
            aria-label={dictionary.graphView.controls.zoomIn}
            testId="graph-demo-zoom-in"
            onClick={() => handleZoom("in")}
          >
            <Plus aria-hidden="true" data-icon="inline-start" />
          </DemoControlButton>
        </ButtonGroup>
        <Button
          aria-label={dictionary.graphView.demo.reLayout}
          data-testid="graph-demo-re-layout"
          size="icon"
          type="button"
          variant="outline"
          onClick={handleReLayout}
        >
          <RefreshCw aria-hidden="true" data-icon="inline-start" />
        </Button>
      </div>

      <div className="pointer-events-auto absolute inset-x-3 bottom-3 z-10 flex flex-col gap-2 sm:inset-x-4 sm:bottom-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div className="rounded-full border border-border/60 bg-background/80 px-2.5 py-1 text-[10px] text-muted-foreground shadow-sm backdrop-blur">
            <span data-testid="graph-demo-node-count">
              {formatMessage(dictionary.graphView.demo.nodeCount, {
                count: formatNumber(graphView.nodes.length),
              })}
            </span>
            <span aria-hidden="true"> · </span>
            <span data-testid="graph-demo-edge-count">
              {formatMessage(dictionary.graphView.demo.edgeCount, {
                count: formatNumber(graphView.edges.length),
              })}
            </span>
          </div>

          <div
            aria-label={dictionary.graphView.demo.density}
            className="flex flex-wrap justify-end gap-1.5"
            data-testid="graph-demo-density-controls"
            role="group"
          >
            {GRAPH_VIEW_DEMO_EDGE_COUNTS.map((preset) => {
              const label = formatMessage(
                dictionary.graphView.demo.edgePreset,
                {
                  edges: formatNumber(preset),
                }
              )

              return (
                <Button
                  aria-pressed={preset === edgeCount}
                  data-edge-count={preset}
                  data-testid={`graph-demo-density-${preset}`}
                  key={preset}
                  size="sm"
                  type="button"
                  variant={preset === edgeCount ? "secondary" : "outline"}
                  onClick={() => handleEdgePresetChange(preset)}
                >
                  {label}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-muted-foreground">
          <span data-testid="graph-demo-layout-status">
            {layoutStatusLabel}
          </span>
          <span>
            {dictionary.graphView.demo.layoutVersion.replace(
              "{version}",
              GRAPH_VIEW_DEMO_LAYOUT_VERSION
            )}
          </span>
        </div>
      </div>

      {selectedNode ? (
        <DemoNodeInspector
          node={selectedNode}
          nodeVisuals={nodeVisuals}
          onClose={() => {
            selectedNodeIdRef.current = null
            setSelectedNodeId(null)
            activeNodesRef.current = new Set()
            activeEdgesRef.current = new Set()
            sigmaRef.current?.scheduleRefresh({
              layoutUnchange: true,
              partialGraph: {
                edges: graphRef.current?.edges() ?? [],
                nodes: graphRef.current?.nodes() ?? [],
              },
            })
          }}
          onOpenQuickDetail={handleOpenQuickDetail}
          relatedEdgeCount={selectedNodeRelationCounts.edges}
          relatedNodeCount={selectedNodeRelationCounts.nodes}
        />
      ) : selectedEdge ? (
        <DemoEdgeInspector
          edge={selectedEdge}
          edgeVisuals={edgeVisuals}
          onClose={() => {
            selectedEdgeIdRef.current = null
            setSelectedEdgeId(null)
            activeNodesRef.current = new Set()
            activeEdgesRef.current = new Set()
            sigmaRef.current?.scheduleRefresh({
              layoutUnchange: true,
              partialGraph: {
                edges: graphRef.current?.edges() ?? [],
                nodes: graphRef.current?.nodes() ?? [],
              },
            })
          }}
        />
      ) : null}

      <LocalEntityQuickDetailDrawer
        entity={quickDetailEntity}
        fixture={quickDetailFixture}
        onClose={() => setQuickDetailEntity(null)}
        owner="graph-view"
        returnFocusRef={quickDetailReturnFocusRef}
      />
    </section>
  )
}
