"use client"

import { MultiDirectedGraph } from "graphology"
import forceAtlas2 from "graphology-layout-forceatlas2"
import {
  ArrowUpRight,
  ChevronRight,
  ExternalLink,
  Globe2,
  Network,
  PanelRightOpen,
  ScanSearch,
  Sparkles,
  X,
} from "lucide-react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { Dialog as DialogPrimitive } from "radix-ui"
import { useMemo, useState } from "react"

import { EVENT_READ_PERMISSIONS } from "@/app/lib/events/permissions"
import {
  GRAPH_VIEW_EDGE_KIND_LABELS,
  GRAPH_VIEW_NODE_KIND_LABELS,
  GraphViewEdge,
  GraphViewEdgeKind,
  GraphViewNode,
  GraphViewNodeKind,
  GraphViewResponse,
  getGraphViewNodeEntityId,
  getGraphViewRelationLabel,
} from "@/app/lib/graph-view/definitions"
import { NEWS_ARTICLE_READ_PERMISSIONS } from "@/app/lib/news-articles/permissions"
import { useHasAnyPermission } from "@/components/permission-provider"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

const GraphViewCanvas = dynamic(
  () => import("./graph-view-canvas").then((module) => module.GraphViewCanvas),
  {
    ssr: false,
    loading: () => <GraphViewCanvasFallback />,
  }
)

export type SelectedGraphItem =
  | {
      type: "node"
      id: string
    }
  | {
      type: "edge"
      id: string
    }
  | null

export interface GraphNodeAttributes {
  x: number
  y: number
  color: string
  label: string
  size: number
  baseColor: string
  baseLabel: string
  baseSize: number
  kind: GraphViewNodeKind
}

export interface GraphEdgeAttributes {
  color: string
  label: string
  size: number
  baseColor: string
  baseLabel: string
  baseSize: number
  kind: GraphViewEdgeKind
  relationType: string
  sourceNodeId: string
  targetNodeId: string
}

export interface GraphModel {
  graph: MultiDirectedGraph<GraphNodeAttributes, GraphEdgeAttributes>
  nodes: GraphViewNode[]
  edges: GraphViewEdge[]
  nodeMap: Map<string, GraphViewNode>
  edgeMap: Map<string, GraphViewEdge>
  relatedNodesByNodeId: Map<string, Set<string>>
  relatedEdgesByNodeId: Map<string, Set<string>>
  nodeCounts: Record<GraphViewNodeKind, number>
  edgeCounts: Record<GraphViewEdgeKind, number>
}

export interface LocalFocusState {
  centerNodeId: string
  edgeIds: Set<string>
  nodeIds: Set<string>
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
const LOCAL_FOCUS_DEPTH_OPTIONS = [1, 2, 3] as const

const NODE_VISUALS = {
  event: {
    color: "#d97706",
    size: 16,
    chipClassName:
      "border-amber-300/60 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100",
  },
  asset: {
    color: "#0f766e",
    size: 14,
    chipClassName:
      "border-teal-300/60 bg-teal-50 text-teal-900 dark:border-teal-500/30 dark:bg-teal-500/10 dark:text-teal-100",
  },
  theme: {
    color: "#2563eb",
    size: 13,
    chipClassName:
      "border-blue-300/60 bg-blue-50 text-blue-900 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100",
  },
  "news-article": {
    color: "#be123c",
    size: 15,
    chipClassName:
      "border-rose-300/60 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100",
  },
} satisfies Record<
  GraphViewNodeKind,
  {
    color: string
    size: number
    chipClassName: string
  }
>

const EDGE_VISUALS = {
  "event-asset": {
    color: "#f59e0b",
    size: 1.9,
    chipClassName:
      "border-amber-300/60 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100",
  },
  "event-theme": {
    color: "#60a5fa",
    size: 1.7,
    chipClassName:
      "border-blue-300/60 bg-blue-50 text-blue-900 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100",
  },
  "source-artifact-event": {
    color: "#fb7185",
    size: 2.1,
    chipClassName:
      "border-rose-300/60 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100",
  },
} satisfies Record<
  GraphViewEdgeKind,
  {
    color: string
    size: number
    chipClassName: string
  }
>

function formatDateTime(value?: string | null) {
  if (!value) {
    return "Chưa có"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return "Chưa có"
  }

  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

function formatPercent(value?: number | null) {
  if (typeof value !== "number") {
    return "Chưa có"
  }

  return `${Math.round(value * 100)}%`
}

function formatNumber(value?: number | null) {
  if (typeof value !== "number") {
    return "Chưa có"
  }

  return new Intl.NumberFormat("vi-VN", {
    maximumFractionDigits: 2,
  }).format(value)
}

function createCountRecord<T extends string>(
  keys: readonly T[]
): Record<T, number> {
  return Object.fromEntries(keys.map((key) => [key, 0])) as Record<T, number>
}

function hashText(value: string) {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }

  return Math.abs(hash)
}

function createSeedPosition(
  nodeId: string,
  kind: GraphViewNodeKind,
  index: number,
  total: number
) {
  const hash = hashText(nodeId)
  const kindIndex = NODE_KIND_ORDER.indexOf(kind)
  const baseAngle = (index / Math.max(total, 1)) * Math.PI * 2
  const jitterAngle = ((hash % 360) * Math.PI) / 180
  const ring = 9 + kindIndex * 4 + (hash % 13) / 10
  const radius = ring + (index % 5) * 0.9
  const angle = baseAngle + jitterAngle / 8

  return {
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
  }
}

function buildGraphModel(graphView: GraphViewResponse): GraphModel {
  const graph = new MultiDirectedGraph<
    GraphNodeAttributes,
    GraphEdgeAttributes
  >()
  const nodeMap = new Map<string, GraphViewNode>()
  const edgeMap = new Map<string, GraphViewEdge>()
  const relatedNodesByNodeId = new Map<string, Set<string>>()
  const relatedEdgesByNodeId = new Map<string, Set<string>>()
  const nodeCounts = createCountRecord(NODE_KIND_ORDER)
  const edgeCounts = createCountRecord(EDGE_KIND_ORDER)
  const nodes: GraphViewNode[] = []
  const edges: GraphViewEdge[] = []

  for (const rawNode of graphView.nodes) {
    if (nodeMap.has(rawNode.id)) {
      continue
    }

    nodeMap.set(rawNode.id, rawNode)
    relatedNodesByNodeId.set(rawNode.id, new Set([rawNode.id]))
    relatedEdgesByNodeId.set(rawNode.id, new Set())
    nodeCounts[rawNode.kind] += 1
    nodes.push(rawNode)
  }

  nodes.forEach((node, index) => {
    const visual = NODE_VISUALS[node.kind]
    const position = createSeedPosition(node.id, node.kind, index, nodes.length)

    graph.addNode(node.id, {
      ...position,
      color: visual.color,
      label: node.label,
      size: visual.size,
      baseColor: visual.color,
      baseLabel: node.label,
      baseSize: visual.size,
      kind: node.kind,
    })
  })

  for (const rawEdge of graphView.edges) {
    if (edgeMap.has(rawEdge.id)) {
      continue
    }

    if (
      !nodeMap.has(rawEdge.sourceNodeId) ||
      !nodeMap.has(rawEdge.targetNodeId)
    ) {
      continue
    }

    edgeMap.set(rawEdge.id, rawEdge)
    edgeCounts[rawEdge.kind] += 1
    edges.push(rawEdge)

    relatedNodesByNodeId.get(rawEdge.sourceNodeId)?.add(rawEdge.targetNodeId)
    relatedNodesByNodeId.get(rawEdge.targetNodeId)?.add(rawEdge.sourceNodeId)
    relatedEdgesByNodeId.get(rawEdge.sourceNodeId)?.add(rawEdge.id)
    relatedEdgesByNodeId.get(rawEdge.targetNodeId)?.add(rawEdge.id)

    const visual = EDGE_VISUALS[rawEdge.kind]
    graph.addDirectedEdgeWithKey(
      rawEdge.id,
      rawEdge.sourceNodeId,
      rawEdge.targetNodeId,
      {
        color: visual.color,
        label: getGraphViewRelationLabel(rawEdge.relationType),
        size: visual.size,
        baseColor: visual.color,
        baseLabel: getGraphViewRelationLabel(rawEdge.relationType),
        baseSize: visual.size,
        kind: rawEdge.kind,
        relationType: rawEdge.relationType,
        sourceNodeId: rawEdge.sourceNodeId,
        targetNodeId: rawEdge.targetNodeId,
      }
    )
  }

  if (nodes.length > 1 && edges.length > 0) {
    forceAtlas2.assign(graph, {
      iterations: nodes.length > 120 ? 180 : 120,
      settings: {
        ...forceAtlas2.inferSettings(graph),
        barnesHutOptimize: nodes.length > 80,
        gravity: 0.08,
        linLogMode: true,
        scalingRatio: 20,
        slowDown: 10,
        strongGravityMode: false,
      },
      getEdgeWeight: (_, attributes) =>
        typeof attributes.baseSize === "number" && attributes.baseSize > 0
          ? attributes.baseSize
          : 1,
    })
  }

  return {
    graph,
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

function getNodeNeighborCount(graphModel: GraphModel, nodeId: string) {
  const relatedNodes = graphModel.relatedNodesByNodeId.get(nodeId)

  if (!relatedNodes) {
    return 0
  }

  return Math.max(relatedNodes.size - 1, 0)
}

function getNodeLinkCount(graphModel: GraphModel, nodeId: string) {
  return graphModel.relatedEdgesByNodeId.get(nodeId)?.size ?? 0
}

function getLocalFocusState(
  graphModel: GraphModel,
  centerNodeId: string,
  depth: number
): LocalFocusState | null {
  if (!graphModel.nodeMap.has(centerNodeId)) {
    return null
  }

  const nodeIds = new Set<string>([centerNodeId])
  let frontier = new Set<string>([centerNodeId])

  for (let currentDepth = 0; currentDepth < depth; currentDepth += 1) {
    if (frontier.size === 0) {
      break
    }

    const nextFrontier = new Set<string>()

    frontier.forEach((nodeId) => {
      graphModel.relatedNodesByNodeId.get(nodeId)?.forEach((relatedNodeId) => {
        if (!nodeIds.has(relatedNodeId)) {
          nodeIds.add(relatedNodeId)
          nextFrontier.add(relatedNodeId)
        }
      })
    })

    frontier = nextFrontier
  }

  const edgeIds = new Set<string>()

  graphModel.edges.forEach((edge) => {
    if (nodeIds.has(edge.sourceNodeId) && nodeIds.has(edge.targetNodeId)) {
      edgeIds.add(edge.id)
    }
  })

  return {
    centerNodeId,
    edgeIds,
    nodeIds,
  }
}

function getActiveSelectedItem(
  graphModel: GraphModel,
  selectedItem: SelectedGraphItem
) {
  if (!selectedItem) {
    return null
  }

  if (selectedItem.type === "node") {
    return graphModel.nodeMap.has(selectedItem.id) ? selectedItem : null
  }

  return graphModel.edgeMap.has(selectedItem.id) ? selectedItem : null
}

function getNodeMetadataRows(node: GraphViewNode) {
  const rows: Array<{
    label: string
    value: string
  }> = [
    {
      label: "Mã nút",
      value: node.id,
    },
  ]
  const metadata = node.metadata

  if (node.secondaryLabel?.trim()) {
    rows.push({
      label: "Nhãn phụ",
      value: node.secondaryLabel,
    })
  }

  if (metadata?.canonicalKey?.trim()) {
    rows.push({
      label: "Khóa chuẩn",
      value: metadata.canonicalKey,
    })
  }

  if (metadata?.slug?.trim()) {
    rows.push({
      label: "Slug",
      value: metadata.slug,
    })
  }

  if (metadata?.symbol?.trim()) {
    rows.push({
      label: "Mã tài sản",
      value: metadata.symbol,
    })
  }

  if (metadata?.assetType?.trim()) {
    rows.push({
      label: "Loại tài sản",
      value: metadata.assetType,
    })
  }

  if (metadata?.newsOutletName?.trim()) {
    rows.push({
      label: "Nguồn",
      value: metadata.newsOutletName,
    })
  }

  if (metadata?.occurredAt) {
    rows.push({
      label: "Xảy ra lúc",
      value: formatDateTime(metadata.occurredAt),
    })
  }

  if (metadata?.publishedAt) {
    rows.push({
      label: "Xuất bản",
      value: formatDateTime(metadata.publishedAt),
    })
  }

  if (typeof metadata?.active === "boolean") {
    rows.push({
      label: "Hoạt động",
      value: metadata.active ? "Đang hoạt động" : "Không hoạt động",
    })
  }

  if (typeof metadata?.confidence === "number") {
    rows.push({
      label: "Độ tin cậy",
      value: formatPercent(metadata.confidence),
    })
  }

  return rows
}

function getNodeDrilldown(
  node: GraphViewNode,
  canReadEvents: boolean,
  canReadNewsArticles: boolean
) {
  if (node.kind === "event") {
    const entityId = getGraphViewNodeEntityId(node.id, "event")

    if (!entityId) {
      return null
    }

    return {
      href: `/events/${entityId}`,
      enabled: canReadEvents,
      label: "Mở chi tiết sự kiện",
      disabledLabel: "Bạn chưa có quyền mở chi tiết sự kiện.",
    }
  }

  if (node.kind === "news-article") {
    const entityId = getGraphViewNodeEntityId(node.id, "news-article")

    if (!entityId) {
      return null
    }

    return {
      href: `/news-articles/${entityId}`,
      enabled: canReadNewsArticles,
      label: "Mở chi tiết bài viết",
      disabledLabel: "Bạn chưa có quyền mở chi tiết bài viết.",
    }
  }

  return null
}

function KindChip({
  label,
  count,
  className,
}: {
  label: string
  count: number
  className: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium",
        className
      )}
    >
      <span>{label}</span>
      <span className="rounded-full bg-background/70 px-1.5 py-0.5 text-[11px]">
        {count}
      </span>
    </span>
  )
}

function PanelCard({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-background/80 p-4",
        className
      )}
    >
      {children}
    </div>
  )
}

function DetailGrid({
  rows,
}: {
  rows: Array<{
    label: string
    value: string
  }>
}) {
  if (rows.length === 0) {
    return null
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
      {rows.map((row) => (
        <PanelCard key={`${row.label}-${row.value}`}>
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              {row.label}
            </span>
            <p className="text-sm leading-6 break-words text-foreground">
              {row.value}
            </p>
          </div>
        </PanelCard>
      ))}
    </div>
  )
}

function InspectorStat({
  hint,
  label,
  value,
}: {
  hint: string
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/80 p-4 shadow-xs">
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          {label}
        </span>
        <p className="text-lg font-semibold text-foreground">{value}</p>
        <p className="text-xs leading-5 text-muted-foreground">{hint}</p>
      </div>
    </div>
  )
}

function ControlSwitchRow({
  checked,
  description,
  disabled,
  label,
  onCheckedChange,
}: {
  checked: boolean
  description: string
  disabled?: boolean
  label: string
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-2xl border border-border/70 bg-background/70 p-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>

      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={onCheckedChange}
        size="sm"
      />
    </div>
  )
}

function CollapsibleInspectorSection({
  children,
  defaultOpen = false,
  description,
  title,
}: {
  children: React.ReactNode
  defaultOpen?: boolean
  description: string
  title: string
}) {
  return (
    <Collapsible
      className="group/collapsible rounded-2xl border border-border/70 bg-background/65"
      defaultOpen={defaultOpen}
    >
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold text-foreground">{title}</p>
            <p className="text-xs leading-5 text-muted-foreground">
              {description}
            </p>
          </div>

          <CollapsibleTrigger asChild>
            <Button className="group/button" size="sm" variant="ghost">
              <ChevronRight
                className="transition-transform group-data-[state=open]/collapsible:rotate-90"
                data-icon="inline-start"
              />
              Mở rộng
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="overflow-hidden">
          <div className="flex flex-col gap-4 pt-1">{children}</div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  )
}

function GraphOverviewPanel({
  graphModel,
  localFocusState,
  localFocusDepth,
  showContextualEdgeLabels,
}: {
  graphModel: GraphModel
  localFocusState: LocalFocusState | null
  localFocusDepth: number
  showContextualEdgeLabels: boolean
}) {
  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-300">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Tổng quan</Badge>
          <Badge variant="outline">
            {localFocusState
              ? `Cụm ${localFocusDepth} bậc`
              : "Toàn cảnh toàn bộ đồ thị"}
          </Badge>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xl font-semibold text-foreground">
            Không gian khám phá đã sẵn sàng
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            Rê chuột để kiểm tra vùng lân cận trực tiếp trên canvas. Khi muốn
            giữ một ngữ cảnh ổn định hơn, hãy nhấp vào nút hoặc cạnh để mở bảng
            chi tiết nổi ngay trên cùng ngữ cảnh đang xem.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <InspectorStat
          hint={`${graphModel.edges.length} cạnh định hướng đang sẵn sàng để duyệt`}
          label="Quy mô"
          value={`${graphModel.nodes.length} nút`}
        />
        <InspectorStat
          hint={
            showContextualEdgeLabels
              ? "Nhãn cạnh được hé lộ theo vùng liên quan hoặc khi chế độ cụm cần thêm ngữ cảnh"
              : "Nhãn cạnh chỉ xuất hiện khi thật sự cần để giữ đồ thị thông thoáng"
          }
          label="Nhịp đọc"
          value={showContextualEdgeLabels ? "Ngữ cảnh mở rộng" : "Ngữ cảnh gọn"}
        />
      </div>

      <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-border bg-background/90">
            <Globe2 className="size-4 text-muted-foreground" />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              Quy tắc hiển thị
            </span>
            <p className="text-sm leading-6 text-foreground">
              Frontend giữ nguyên chiều cạnh từ <code>sourceNodeId</code> sang{" "}
              <code>targetNodeId</code>, không tự suy diễn hay đảo chiều theo{" "}
              <code>relationType</code>.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function NodeDetailPanel({
  graphModel,
  node,
  canReadEvents,
  canReadNewsArticles,
}: {
  graphModel: GraphModel
  node: GraphViewNode
  canReadEvents: boolean
  canReadNewsArticles: boolean
}) {
  const nodeVisual = NODE_VISUALS[node.kind]
  const metadataRows = getNodeMetadataRows(node)
  const neighborCount = getNodeNeighborCount(graphModel, node.id)
  const linkCount = getNodeLinkCount(graphModel, node.id)
  const drilldown = getNodeDrilldown(
    node,
    canReadEvents,
    canReadNewsArticles
  )
  const sourceUrl = node.metadata?.url?.trim() || null

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-2 duration-300">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            className={cn("border", nodeVisual.chipClassName)}
            variant="outline"
          >
            {GRAPH_VIEW_NODE_KIND_LABELS[node.kind]}
          </Badge>
          <Badge variant="outline">{linkCount} liên kết trực tiếp</Badge>
          <Badge variant="outline">{neighborCount} nút kề</Badge>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xl font-semibold text-foreground">{node.label}</p>
          <p className="text-sm leading-6 text-muted-foreground">
            {node.secondaryLabel?.trim() ||
              "Nút này đang đóng vai trò như một điểm neo để duyệt lớp tri thức dùng chung."}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {drilldown ? (
            drilldown.enabled ? (
              <Button asChild size="sm" variant="outline">
                <Link href={drilldown.href}>
                  <ArrowUpRight data-icon="inline-start" />
                  {drilldown.label}
                </Link>
              </Button>
            ) : (
              <Button disabled size="sm" variant="outline">
                <ArrowUpRight data-icon="inline-start" />
                Không mở được chi tiết
              </Button>
            )
          ) : null}

          {sourceUrl ? (
            <Button asChild size="sm" variant="outline">
              <a href={sourceUrl} rel="noreferrer noopener" target="_blank">
                <ExternalLink data-icon="inline-start" />
                Mở liên kết gốc
              </a>
            </Button>
          ) : null}
        </div>

        {drilldown && !drilldown.enabled ? (
          <p className="text-xs leading-5 text-muted-foreground">
            {drilldown.disabledLabel}
          </p>
        ) : null}
      </div>

      <DetailGrid rows={metadataRows} />
    </div>
  )
}

function EdgeDetailPanel({
  graphModel,
  edge,
}: {
  graphModel: GraphModel
  edge: GraphViewEdge
}) {
  const sourceNode = graphModel.nodeMap.get(edge.sourceNodeId)
  const targetNode = graphModel.nodeMap.get(edge.targetNodeId)
  const edgeVisual = EDGE_VISUALS[edge.kind]

  const rows = [
    {
      label: "Mã cạnh",
      value: edge.id,
    },
    {
      label: "Loại cạnh",
      value: GRAPH_VIEW_EDGE_KIND_LABELS[edge.kind],
    },
    {
      label: "Quan hệ",
      value: getGraphViewRelationLabel(edge.relationType),
    },
    {
      label: "Chiều cạnh",
      value: `${sourceNode?.label || edge.sourceNodeId} -> ${targetNode?.label || edge.targetNodeId}`,
    },
    {
      label: "Trọng số",
      value: formatNumber(edge.weight),
    },
    {
      label: "Độ tin cậy",
      value: formatPercent(edge.confidence),
    },
  ]

  if (edge.note?.trim()) {
    rows.push({
      label: "Ghi chú",
      value: edge.note,
    })
  }

  return (
    <div className="flex flex-col gap-5 animate-in fade-in slide-in-from-right-2 duration-300">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge
            className={cn("border", edgeVisual.chipClassName)}
            variant="outline"
          >
            {GRAPH_VIEW_EDGE_KIND_LABELS[edge.kind]}
          </Badge>
          <Badge variant="outline">
            {getGraphViewRelationLabel(edge.relationType)}
          </Badge>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-xl font-semibold text-foreground">
            {sourceNode?.label || edge.sourceNodeId}
            {" -> "}
            {targetNode?.label || edge.targetNodeId}
          </p>
          <p className="text-sm leading-6 text-muted-foreground">
            Cạnh này giữ nguyên hướng nguồn và đích theo payload backend để tránh
            làm sai ngữ nghĩa của quan hệ.
          </p>
        </div>
      </div>

      <DetailGrid rows={rows} />
    </div>
  )
}

function GraphLegendContent({ graphModel }: { graphModel: GraphModel }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Sparkles className="size-4 text-muted-foreground" />
        <span className="text-sm font-semibold text-foreground">
          Màu sắc và ký hiệu
        </span>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          Loại nút
        </span>
        <div className="flex flex-wrap gap-2">
          {NODE_KIND_ORDER.map((kind) => (
            <KindChip
              key={kind}
              className={NODE_VISUALS[kind].chipClassName}
              count={graphModel.nodeCounts[kind]}
              label={GRAPH_VIEW_NODE_KIND_LABELS[kind]}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          Loại cạnh
        </span>
        <div className="flex flex-wrap gap-2">
          {EDGE_KIND_ORDER.map((kind) => (
            <KindChip
              key={kind}
              className={EDGE_VISUALS[kind].chipClassName}
              count={graphModel.edgeCounts[kind]}
              label={GRAPH_VIEW_EDGE_KIND_LABELS[kind]}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function GraphControlsSheetContent({
  graphModel,
  isLocalFocusEnabled,
  localFocusDepth,
  localFocusState,
  onLocalFocusDepthChange,
  onLocalFocusEnabledChange,
  onShowContextualEdgeLabelsChange,
  selectedNode,
  showContextualEdgeLabels,
}: {
  graphModel: GraphModel
  isLocalFocusEnabled: boolean
  localFocusDepth: number
  localFocusState: LocalFocusState | null
  onLocalFocusDepthChange: (depth: number) => void
  onLocalFocusEnabledChange: (enabled: boolean) => void
  onShowContextualEdgeLabelsChange: (enabled: boolean) => void
  selectedNode: GraphViewNode | null
  showContextualEdgeLabels: boolean
}) {
  const visibleNodeCount = localFocusState?.nodeIds.size ?? graphModel.nodes.length
  const visibleEdgeCount = localFocusState?.edgeIds.size ?? graphModel.edges.length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary">Điều khiển khám phá</Badge>
          <Badge variant="outline">
            {visibleNodeCount}/{graphModel.nodes.length} nút hiển thị
          </Badge>
          <Badge variant="outline">
            {visibleEdgeCount}/{graphModel.edges.length} cạnh hiển thị
          </Badge>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-foreground">
            Các lớp thông tin phụ được gom về một nơi
          </h2>
          <p className="text-sm leading-6 text-muted-foreground">
            Canvas giữ vai trò trung tâm, còn bảng này chỉ mở khi bạn cần chỉnh
            nhịp đọc, chú giải hoặc hỗ trợ khám phá cụm.
          </p>
        </div>
      </div>

      <GraphOverviewPanel
        graphModel={graphModel}
        localFocusDepth={localFocusDepth}
        localFocusState={localFocusState}
        showContextualEdgeLabels={showContextualEdgeLabels}
      />

      <div className="flex flex-col gap-4 rounded-[24px] border border-border/70 bg-background/70 p-4">
        <div className="flex items-center gap-2">
          <ScanSearch className="size-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">
            Tinh chỉnh nhịp khám phá
          </span>
        </div>

        <ControlSwitchRow
          checked={isLocalFocusEnabled}
          description={
            selectedNode
              ? "Giới hạn tầm nhìn quanh nút đang chọn để đọc cụm dày đặc rõ ràng hơn mà vẫn quay lại toàn cảnh ngay được."
              : "Chọn một nút trên canvas để bật chế độ tập trung cụm."
          }
          disabled={!selectedNode}
          label="Tập trung theo cụm"
          onCheckedChange={onLocalFocusEnabledChange}
        />

        <ControlSwitchRow
          checked={showContextualEdgeLabels}
          description="Chỉ hé lộ nhãn cạnh khi ngữ cảnh tương tác thật sự cần thêm diễn giải."
          label="Nhãn cạnh theo ngữ cảnh"
          onCheckedChange={onShowContextualEdgeLabelsChange}
        />

        <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                Độ sâu lân cận
              </span>
              <p className="text-sm leading-6 text-foreground">
                {selectedNode
                  ? `Đang lấy ${localFocusDepth} bậc quanh ${selectedNode.label}.`
                  : "Độ sâu chỉ khả dụng sau khi bạn đã chọn một nút."}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {LOCAL_FOCUS_DEPTH_OPTIONS.map((depthOption) => (
                <Button
                  disabled={!selectedNode}
                  key={depthOption}
                  onClick={() => {
                    onLocalFocusDepthChange(depthOption)

                    if (selectedNode) {
                      onLocalFocusEnabledChange(true)
                    }
                  }}
                  size="sm"
                  type="button"
                  variant={
                    depthOption === localFocusDepth ? "default" : "outline"
                  }
                >
                  {depthOption} bậc
                </Button>
              ))}

              {isLocalFocusEnabled ? (
                <Button
                  onClick={() => onLocalFocusEnabledChange(false)}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  <Globe2 data-icon="inline-start" />
                  Trở về toàn cảnh
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <CollapsibleInspectorSection
        description="Màu sắc và số lượng được ẩn vào đây để canvas giữ nhịp đọc chính."
        title="Chú giải biểu đồ"
      >
        <GraphLegendContent graphModel={graphModel} />
      </CollapsibleInspectorSection>

      <CollapsibleInspectorSection
        description="Những gợi ý ngắn để bạn đọc đồ thị dày mà không bị rối."
        title="Cách đọc nhanh"
      >
        <div className="grid gap-3">
          <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
            <p className="text-sm leading-6 text-foreground">
              Rê chuột để kiểm tra vùng lân cận trực tiếp. Nhấp vào nút hoặc
              cạnh để mở hộp thoại chi tiết mà không làm mất vị trí đang xem.
            </p>
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
            <p className="text-sm leading-6 text-foreground">
              Khi một cụm quá dày, hãy chọn nút rồi bật chế độ tập trung để cắt
              nhiễu trước khi quay lại toàn cảnh.
            </p>
          </div>
        </div>
      </CollapsibleInspectorSection>
    </div>
  )
}

function GraphSelectionDialog({
  canReadEvents,
  canReadNewsArticles,
  graphModel,
  onOpenChange,
  selectedEdge,
  selectedNode,
}: {
  canReadEvents: boolean
  canReadNewsArticles: boolean
  graphModel: GraphModel
  onOpenChange: (open: boolean) => void
  selectedEdge: GraphViewEdge | null
  selectedNode: GraphViewNode | null
}) {
  const isOpen = !!selectedNode || !!selectedEdge
  const edgeSourceNode = selectedEdge
    ? graphModel.nodeMap.get(selectedEdge.sourceNodeId)
    : null
  const edgeTargetNode = selectedEdge
    ? graphModel.nodeMap.get(selectedEdge.targetNodeId)
    : null

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onOpenChange}>
      {isOpen ? (
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/12 duration-150 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 supports-backdrop-filter:backdrop-blur-xs" />

          <DialogPrimitive.Content
            className={cn(
              "fixed inset-x-3 bottom-3 z-50 flex max-h-[88vh] flex-col overflow-hidden rounded-[28px] border border-border/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.98))] shadow-[0_40px_120px_-60px_rgba(15,23,42,0.65)] outline-none duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-bottom-8 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-8 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.96),rgba(15,23,42,0.98))] sm:left-1/2 sm:top-1/2 sm:bottom-auto sm:w-[min(44rem,calc(100vw-2rem))] sm:max-w-none sm:-translate-x-1/2 sm:-translate-y-1/2 sm:data-[state=closed]:zoom-out-95 sm:data-[state=open]:zoom-in-95"
            )}
          >
            <div className="flex items-start justify-between gap-4 border-b border-border/70 px-5 py-4 sm:px-6 sm:py-5">
              <div className="flex min-w-0 flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary">
                    {selectedNode ? "Chi tiết nút" : "Chi tiết cạnh"}
                  </Badge>
                  {selectedNode ? (
                    <Badge
                      className={cn(
                        "border",
                        NODE_VISUALS[selectedNode.kind].chipClassName
                      )}
                      variant="outline"
                    >
                      {GRAPH_VIEW_NODE_KIND_LABELS[selectedNode.kind]}
                    </Badge>
                  ) : selectedEdge ? (
                    <Badge
                      className={cn(
                        "border",
                        EDGE_VISUALS[selectedEdge.kind].chipClassName
                      )}
                      variant="outline"
                    >
                      {GRAPH_VIEW_EDGE_KIND_LABELS[selectedEdge.kind]}
                    </Badge>
                  ) : null}
                </div>

                <div className="flex min-w-0 flex-col gap-1">
                  <DialogPrimitive.Title className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    {selectedNode
                      ? selectedNode.label
                      : edgeSourceNode && edgeTargetNode
                        ? `${edgeSourceNode.label} -> ${edgeTargetNode.label}`
                        : "Chi tiết liên kết"}
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Description className="text-sm leading-6 text-muted-foreground">
                    {selectedNode
                      ? "Thông tin được mở theo đúng ngữ cảnh bạn vừa neo trên canvas. Đóng hộp thoại để tiếp tục khám phá tại đúng vị trí hiện tại."
                      : "Quan hệ được hiển thị theo đúng chiều nguồn và đích từ payload backend, đồng thời giữ nguyên góc nhìn hiện tại của canvas."}
                  </DialogPrimitive.Description>
                </div>
              </div>

              <DialogPrimitive.Close asChild>
                <Button
                  aria-label="Đóng chi tiết"
                  size="icon-sm"
                  type="button"
                  variant="ghost"
                >
                  <X />
                </Button>
              </DialogPrimitive.Close>
            </div>

            <div className="overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
              {selectedNode ? (
                <NodeDetailPanel
                  canReadEvents={canReadEvents}
                  canReadNewsArticles={canReadNewsArticles}
                  graphModel={graphModel}
                  node={selectedNode}
                />
              ) : selectedEdge ? (
                <EdgeDetailPanel edge={selectedEdge} graphModel={graphModel} />
              ) : null}
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      ) : null}
    </DialogPrimitive.Root>
  )
}

function GraphViewCanvasFallback() {
  return (
    <div className="relative h-full min-h-[640px] w-full overflow-hidden animate-pulse rounded-[24px]">
      <div className="pointer-events-none absolute inset-x-4 top-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex max-w-[min(100%,28rem)] flex-col gap-2 rounded-2xl border border-border/70 bg-background/85 px-3.5 py-2.5 shadow-sm backdrop-blur">
          <div className="h-3 w-28 rounded-full bg-muted" />
          <div className="h-3 w-64 max-w-full rounded-full bg-muted/90" />
        </div>

        <div className="flex items-center gap-1 rounded-full border border-border/70 bg-background/90 p-1 shadow-sm backdrop-blur">
          <div className="size-7 rounded-full bg-muted" />
          <div className="size-7 rounded-full bg-muted" />
          <div className="size-7 rounded-full bg-muted" />
        </div>
      </div>

      <div className="absolute inset-6 rounded-[24px] border border-dashed border-border/60 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.10),_transparent_28%),radial-gradient(circle_at_82%_18%,_rgba(217,119,6,0.12),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(37,99,235,0.12),_transparent_30%)]" />

      <div className="pointer-events-none absolute inset-x-4 bottom-4 flex flex-wrap items-end justify-between gap-3">
        <div className="h-8 w-44 rounded-full border border-border/70 bg-background/88 shadow-sm backdrop-blur" />
        <div className="h-8 w-40 rounded-full border border-border/70 bg-background/88 shadow-sm backdrop-blur" />
      </div>
    </div>
  )
}

export function GraphViewWorkbench({
  graphView,
}: {
  graphView: GraphViewResponse
}) {
  const canReadEvents = useHasAnyPermission(EVENT_READ_PERMISSIONS)
  const canReadNewsArticles = useHasAnyPermission(
    NEWS_ARTICLE_READ_PERMISSIONS
  )
  const graphModel = useMemo(() => buildGraphModel(graphView), [graphView])
  const [isControlsOpen, setIsControlsOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<SelectedGraphItem>(null)
  const [isLocalFocusEnabled, setIsLocalFocusEnabled] = useState(false)
  const [localFocusDepth, setLocalFocusDepth] = useState(1)
  const [showContextualEdgeLabels, setShowContextualEdgeLabels] =
    useState(false)
  const activeSelectedItem = getActiveSelectedItem(graphModel, selectedItem)
  const selectedNodeId =
    activeSelectedItem?.type === "node" ? activeSelectedItem.id : null

  const selectedNode =
    activeSelectedItem?.type === "node"
      ? (graphModel.nodeMap.get(activeSelectedItem.id) ?? null)
      : null
  const selectedEdge =
    activeSelectedItem?.type === "edge"
      ? (graphModel.edgeMap.get(activeSelectedItem.id) ?? null)
      : null
  const isLocalFocusActive = isLocalFocusEnabled && !!selectedNodeId
  const localFocusState =
    isLocalFocusActive && selectedNodeId
      ? getLocalFocusState(graphModel, selectedNodeId, localFocusDepth)
      : null

  const visibleNodeCount = localFocusState?.nodeIds.size ?? graphModel.nodes.length
  const visibleEdgeCount = localFocusState?.edgeIds.size ?? graphModel.edges.length
  const surfaceStatus = selectedNode
    ? `Đã neo nút ${selectedNode.label}`
    : selectedEdge
      ? `Đã neo cạnh ${getGraphViewRelationLabel(selectedEdge.relationType)}`
      : "Chọn một nút hoặc cạnh để bắt đầu"
  const handleSelectionChange = (nextSelectedItem: SelectedGraphItem) => {
    setSelectedItem(nextSelectedItem)

    if (nextSelectedItem) {
      setIsControlsOpen(false)
    }

    if (nextSelectedItem?.type !== "node") {
      setIsLocalFocusEnabled(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="flex max-w-4xl flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Không gian khám phá</Badge>
              <Badge variant="outline">
                {localFocusState ? `Cụm ${localFocusDepth} bậc` : "Toàn cảnh"}
              </Badge>
              {showContextualEdgeLabels ? (
                <Badge variant="outline">Nhãn cạnh theo ngữ cảnh</Badge>
              ) : null}
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                Biểu đồ tri thức dùng chung
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
                Màn hình này ưu tiên canvas làm mặt đọc chính. Các điều khiển,
                chú giải và thông tin phụ chỉ mở ra khi bạn thật sự cần để tránh
                kéo sự chú ý ra khỏi vùng khám phá.
              </p>
            </div>
          </div>

          {graphModel.nodes.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <Button
                onClick={() => setIsControlsOpen(true)}
                size="sm"
                type="button"
                variant="outline"
              >
                <PanelRightOpen data-icon="inline-start" />
                Điều khiển
              </Button>

              <Button
                disabled={!selectedNode}
                onClick={() => setIsLocalFocusEnabled((current) => !current)}
                size="sm"
                type="button"
                variant={isLocalFocusActive ? "default" : "outline"}
              >
                <ScanSearch data-icon="inline-start" />
                {isLocalFocusActive
                  ? "Đang tập trung cụm"
                  : "Tập trung quanh nút"}
              </Button>

              {isLocalFocusActive ? (
                <Button
                  onClick={() => setIsLocalFocusEnabled(false)}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  <Globe2 data-icon="inline-start" />
                  Toàn cảnh
                </Button>
              ) : null}
            </div>
          ) : null}
        </div>

        <section className="rounded-[36px] border border-border/80 bg-[linear-gradient(180deg,rgba(245,247,250,0.88),rgba(248,250,252,0.98))] p-4 shadow-[0_30px_90px_-60px_rgba(15,23,42,0.5)] backdrop-blur sm:p-6 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.82),rgba(15,23,42,0.96))]">
          {graphModel.nodes.length > 0 ? (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col gap-2">
                  <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                    Không gian đồ thị
                  </p>
                  <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                    Rê chuột để đọc quan hệ gần nhất, nhấp vào nút hoặc cạnh để
                    mở hộp thoại chi tiết, và giữ nguyên góc nhìn hiện tại của
                    canvas trong suốt quá trình khám phá.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-border/80 bg-background/82 px-3 py-1.5 text-xs text-muted-foreground shadow-xs">
                    {visibleNodeCount}/{graphModel.nodes.length} nút hiển thị
                  </span>
                  <span className="rounded-full border border-border/80 bg-background/82 px-3 py-1.5 text-xs text-muted-foreground shadow-xs">
                    {visibleEdgeCount}/{graphModel.edges.length} cạnh hiển thị
                  </span>
                  <span className="max-w-full truncate rounded-full border border-border/80 bg-background/82 px-3 py-1.5 text-xs text-muted-foreground shadow-xs sm:max-w-[24rem]">
                    {surfaceStatus}
                  </span>
                </div>
              </div>

              <div className="relative min-h-[720px] overflow-hidden rounded-[30px] border border-border/80 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.12),_transparent_28%),radial-gradient(circle_at_82%_18%,_rgba(217,119,6,0.14),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(37,99,235,0.14),_transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(248,250,252,0.96))] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_24px_80px_-50px_rgba(15,23,42,0.45)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.18),_transparent_28%),radial-gradient(circle_at_82%_18%,_rgba(217,119,6,0.16),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(37,99,235,0.18),_transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.68),rgba(15,23,42,0.92))]">
                <GraphViewCanvas
                  graphModel={graphModel}
                  localFocusDepth={localFocusDepth}
                  localFocusState={localFocusState}
                  onSelectionChange={handleSelectionChange}
                  selectedItem={activeSelectedItem}
                  showContextualEdgeLabels={showContextualEdgeLabels}
                />
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <p className="text-xs leading-6 text-muted-foreground">
                  Đồ thị chỉ dùng chuyển động để định hướng rồi ổn định lại, tránh
                  cảm giác rung liên tục hoặc biến canvas thành một màn trình diễn
                  physics.
                </p>
                <p className="text-xs leading-6 text-muted-foreground">
                  {localFocusState
                    ? `Chế độ cụm đang giới hạn tầm nhìn còn ${visibleNodeCount} nút và ${visibleEdgeCount} cạnh.`
                    : "Khi cần chú giải hoặc điều chỉnh nhịp đọc, hãy mở bảng điều khiển thay vì để các lớp thông tin phụ luôn xuất hiện."}
                </p>
              </div>
            </div>
          ) : (
            <Empty className="min-h-[720px] rounded-[30px] border border-dashed border-border bg-background/72">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Network className="size-5 text-muted-foreground" />
                </EmptyMedia>
                <EmptyTitle>Chưa có dữ liệu để dựng biểu đồ</EmptyTitle>
                <EmptyDescription>
                  Backend chưa trả về nút nào cho <code>/graph-view</code>. Khi
                  payload có dữ liệu, canvas và bảng điều khiển ngữ cảnh sẽ tự
                  hiển thị theo cùng contract này.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </section>
      </div>

      <Sheet open={isControlsOpen} onOpenChange={setIsControlsOpen}>
        <SheetContent
          className="w-full overflow-y-auto border-l border-border/80 bg-background/96 px-0 sm:max-w-lg"
          side="right"
        >
          <SheetHeader className="px-5 sm:px-6">
            <SheetTitle>Bảng điều khiển biểu đồ</SheetTitle>
            <SheetDescription>
              Tất cả lớp thông tin phụ được gom về đây để màn hình chính giữ
              nhịp khám phá gọn hơn.
            </SheetDescription>
          </SheetHeader>

          <div className="px-5 pb-5 sm:px-6 sm:pb-6">
            <GraphControlsSheetContent
              graphModel={graphModel}
              isLocalFocusEnabled={isLocalFocusActive}
              localFocusDepth={localFocusDepth}
              localFocusState={localFocusState}
              onLocalFocusDepthChange={setLocalFocusDepth}
              onLocalFocusEnabledChange={setIsLocalFocusEnabled}
              onShowContextualEdgeLabelsChange={setShowContextualEdgeLabels}
              selectedNode={selectedNode}
              showContextualEdgeLabels={showContextualEdgeLabels}
            />
          </div>
        </SheetContent>
      </Sheet>

      <GraphSelectionDialog
        canReadEvents={canReadEvents}
        canReadNewsArticles={canReadNewsArticles}
        graphModel={graphModel}
        onOpenChange={(open) => {
          if (!open) {
            handleSelectionChange(null)
          }
        }}
        selectedEdge={selectedEdge}
        selectedNode={selectedNode}
      />
    </>
  )
}
