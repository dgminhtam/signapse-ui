import type {
  GraphViewEdgeKind,
  GraphViewNodeKind,
} from "@/app/lib/graph-view/definitions"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"

export const GRAPH_VIEW_NODE_VISUALS = {
  event: {
    chipClassName:
      "border-amber-300/60 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100",
    color: "#d97706",
    size: 28,
  },
  asset: {
    chipClassName:
      "border-teal-300/60 bg-teal-50 text-teal-900 dark:border-teal-500/30 dark:bg-teal-500/10 dark:text-teal-100",
    color: "#0f766e",
    size: 64,
  },
  "news-article": {
    chipClassName:
      "border-rose-300/60 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100",
    color: "#be123c",
    size: 24,
  },
  narrative: {
    chipClassName:
      "border-violet-300/60 bg-violet-50 text-violet-900 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-100",
    color: "#7c3aed",
    size: 42,
  },
} satisfies Record<
  GraphViewNodeKind,
  {
    chipClassName: string
    color: string
    size: number
  }
>

export const GRAPH_VIEW_EDGE_VISUALS = {
  "event-asset": {
    chipClassName:
      "border-amber-300/60 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100",
    color: "#f59e0b",
    size: 1.45,
  },
  "news-article-event": {
    chipClassName:
      "border-rose-300/60 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100",
    color: "#fb7185",
    size: 1.6,
  },
  "narrative-event": {
    chipClassName:
      "border-violet-300/60 bg-violet-50 text-violet-900 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-100",
    color: "#a78bfa",
    size: 1.5,
  },
  "narrative-asset": {
    chipClassName:
      "border-fuchsia-300/60 bg-fuchsia-50 text-fuchsia-900 dark:border-fuchsia-500/30 dark:bg-fuchsia-500/10 dark:text-fuchsia-100",
    color: "#d946ef",
    size: 1.35,
  },
} satisfies Record<
  GraphViewEdgeKind,
  {
    chipClassName: string
    color: string
    size: number
  }
>

export function getGraphViewNodeVisuals(dictionary: Dictionary) {
  return Object.fromEntries(
    Object.entries(GRAPH_VIEW_NODE_VISUALS).map(([kind, visual]) => [
      kind,
      {
        ...visual,
        label: dictionary.graphView.nodeKinds[kind as GraphViewNodeKind],
      },
    ])
  ) as Record<
    GraphViewNodeKind,
    (typeof GRAPH_VIEW_NODE_VISUALS)[GraphViewNodeKind] & { label: string }
  >
}

export function getGraphViewEdgeVisuals(dictionary: Dictionary) {
  return Object.fromEntries(
    Object.entries(GRAPH_VIEW_EDGE_VISUALS).map(([kind, visual]) => [
      kind,
      {
        ...visual,
        label: dictionary.graphView.edgeKinds[kind as GraphViewEdgeKind],
      },
    ])
  ) as Record<
    GraphViewEdgeKind,
    (typeof GRAPH_VIEW_EDGE_VISUALS)[GraphViewEdgeKind] & { label: string }
  >
}
