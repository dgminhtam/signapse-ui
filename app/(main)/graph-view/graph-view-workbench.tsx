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
import { Badge } from "@/components/ui/badge"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { cn } from "@/lib/utils"

import {
  GRAPH_VIEW_EDGE_VISUALS,
  GRAPH_VIEW_NODE_VISUALS,
} from "./graph-view-visuals"

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

function KindChip({
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

function GraphMetric({
  hint,
  label,
  value,
}: {
  hint: string
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-background/78 p-4 shadow-xs backdrop-blur">
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          {label}
        </span>
        <p className="text-xl font-semibold tracking-tight text-foreground">
          {value}
        </p>
        <p className="text-xs leading-5 text-muted-foreground">{hint}</p>
      </div>
    </div>
  )
}

function GraphViewCanvasFallback() {
  return (
    <div className="relative h-full min-h-[640px] w-full animate-pulse overflow-hidden rounded-[24px]">
      <div className="pointer-events-none absolute inset-x-4 top-4 flex flex-wrap items-start justify-between gap-3">
        <div className="flex max-w-[min(100%,30rem)] flex-col gap-2 rounded-2xl border border-border/70 bg-background/85 px-3.5 py-2.5 shadow-sm backdrop-blur">
          <div className="h-3 w-28 rounded-full bg-muted" />
          <div className="h-3 w-72 max-w-full rounded-full bg-muted/90" />
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
  const graphModel = useMemo(() => buildGraphModel(graphView), [graphView])
  const hasGraph = graphModel.nodes.length > 0

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="flex max-w-4xl flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">Không gian lực G6</Badge>
            <Badge variant="outline">Thử nghiệm theo cụm</Badge>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">
              Biểu đồ tri thức theo lực liên kết
            </h1>
            <p className="max-w-3xl text-sm leading-7 text-muted-foreground">
              Canvas này dùng D3 force của G6 để kéo các thực thể liên quan về
              gần nhau. Bạn có thể kéo nút, pan hoặc zoom để phân tích cấu trúc
              trước khi đội mình khôi phục các lớp chi tiết nâng cao.
            </p>
          </div>
        </div>

        {hasGraph ? (
          <div className="flex flex-wrap items-center gap-2">
            {NODE_KIND_ORDER.map((kind) => (
              <KindChip
                className={GRAPH_VIEW_NODE_VISUALS[kind].chipClassName}
                count={graphModel.nodeCounts[kind]}
                key={kind}
                label={GRAPH_VIEW_NODE_VISUALS[kind].label}
              />
            ))}
          </div>
        ) : null}
      </div>

      <section className="rounded-[36px] border border-border/80 bg-[linear-gradient(180deg,rgba(245,247,250,0.88),rgba(248,250,252,0.98))] p-4 shadow-[0_30px_90px_-60px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6 dark:bg-[linear-gradient(180deg,rgba(15,23,42,0.82),rgba(15,23,42,0.96))]">
        {hasGraph ? (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex flex-col gap-2">
                <p className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  Team clustering layout
                </p>
                <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                  Asset và chủ đề đóng vai trò neo cụm; sự kiện và bài viết sẽ
                  được suy luận cụm từ quan hệ hiện có trong payload backend.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-border/80 bg-background/82 px-3 py-1.5 text-xs text-muted-foreground shadow-xs">
                  {graphModel.nodes.length} nút
                </span>
                <span className="rounded-full border border-border/80 bg-background/82 px-3 py-1.5 text-xs text-muted-foreground shadow-xs">
                  {graphModel.edges.length} cạnh
                </span>
                <span className="rounded-full border border-border/80 bg-background/82 px-3 py-1.5 text-xs text-muted-foreground shadow-xs">
                  Không lưu vị trí kéo về backend
                </span>
              </div>
            </div>

            <div className="relative min-h-[720px] overflow-hidden rounded-[30px] border border-border/80 bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.12),_transparent_28%),radial-gradient(circle_at_82%_18%,_rgba(217,119,6,0.14),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(37,99,235,0.14),_transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.72),rgba(248,250,252,0.96))] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_24px_80px_-50px_rgba(15,23,42,0.45)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(15,118,110,0.18),_transparent_28%),radial-gradient(circle_at_82%_18%,_rgba(217,119,6,0.16),_transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(37,99,235,0.18),_transparent_30%),linear-gradient(180deg,rgba(15,23,42,0.68),rgba(15,23,42,0.92))]">
              <GraphViewCanvas graphModel={graphModel} />
            </div>

            <div className="grid gap-3 lg:grid-cols-3">
              <GraphMetric
                hint="Dữ liệu được render trực tiếp từ contract graph-view hiện tại."
                label="Quy mô"
                value={`${graphModel.nodes.length} nút`}
              />
              <GraphMetric
                hint="G6 xử lý edge song song bằng id ổn định, không còn lỗi duplicate graphology."
                label="Liên kết"
                value={`${graphModel.edges.length} cạnh`}
              />
              <GraphMetric
                hint="Kéo nút để các node liên quan phản hồi qua force layout."
                label="Tương tác"
                value="Kéo, pan, zoom"
              />
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
                payload có dữ liệu, canvas G6 sẽ tự dựng lại từ cùng contract
                hiện tại.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </section>

      {hasGraph ? (
        <div className="flex flex-wrap items-center gap-2">
          {EDGE_KIND_ORDER.map((kind) => (
            <KindChip
              className={GRAPH_VIEW_EDGE_VISUALS[kind].chipClassName}
              count={graphModel.edgeCounts[kind]}
              key={kind}
              label={GRAPH_VIEW_EDGE_VISUALS[kind].label}
            />
          ))}
        </div>
      ) : null}
    </div>
  )
}
