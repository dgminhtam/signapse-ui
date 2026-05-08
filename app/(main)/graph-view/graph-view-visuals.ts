import type {
  GraphViewEdgeKind,
  GraphViewNodeKind,
} from "@/app/lib/graph-view/definitions"

export const GRAPH_VIEW_NODE_VISUALS = {
  event: {
    chipClassName:
      "border-amber-300/60 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100",
    color: "#d97706",
    label: "Sự kiện",
    size: 24,
  },
  asset: {
    chipClassName:
      "border-teal-300/60 bg-teal-50 text-teal-900 dark:border-teal-500/30 dark:bg-teal-500/10 dark:text-teal-100",
    color: "#0f766e",
    label: "Tài sản",
    size: 30,
  },
  theme: {
    chipClassName:
      "border-blue-300/60 bg-blue-50 text-blue-900 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100",
    color: "#2563eb",
    label: "Chủ đề",
    size: 28,
  },
  "news-article": {
    chipClassName:
      "border-rose-300/60 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100",
    color: "#be123c",
    label: "Bài viết",
    size: 22,
  },
} satisfies Record<
  GraphViewNodeKind,
  {
    chipClassName: string
    color: string
    label: string
    size: number
  }
>

export const GRAPH_VIEW_EDGE_VISUALS = {
  "event-asset": {
    chipClassName:
      "border-amber-300/60 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100",
    color: "#f59e0b",
    label: "Sự kiện - tài sản",
    size: 1.45,
  },
  "event-theme": {
    chipClassName:
      "border-blue-300/60 bg-blue-50 text-blue-900 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100",
    color: "#60a5fa",
    label: "Sự kiện - chủ đề",
    size: 1.25,
  },
  "news-article-event": {
    chipClassName:
      "border-rose-300/60 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100",
    color: "#fb7185",
    label: "Bằng chứng - sự kiện",
    size: 1.6,
  },
} satisfies Record<
  GraphViewEdgeKind,
  {
    chipClassName: string
    color: string
    label: string
    size: number
  }
>
