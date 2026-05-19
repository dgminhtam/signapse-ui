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
    size: 24,
  },
  asset: {
    chipClassName:
      "border-teal-300/60 bg-teal-50 text-teal-900 dark:border-teal-500/30 dark:bg-teal-500/10 dark:text-teal-100",
    color: "#0f766e",
    size: 30,
  },
  theme: {
    chipClassName:
      "border-blue-300/60 bg-blue-50 text-blue-900 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100",
    color: "#2563eb",
    size: 28,
  },
  "news-article": {
    chipClassName:
      "border-rose-300/60 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100",
    color: "#be123c",
    size: 22,
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
  "event-theme": {
    chipClassName:
      "border-blue-300/60 bg-blue-50 text-blue-900 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-100",
    color: "#60a5fa",
    size: 1.25,
  },
  "news-article-event": {
    chipClassName:
      "border-rose-300/60 bg-rose-50 text-rose-900 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-100",
    color: "#fb7185",
    size: 1.6,
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
  return {
    event: {
      ...GRAPH_VIEW_NODE_VISUALS.event,
      label: dictionary.graphView.nodeKinds.event,
    },
    asset: {
      ...GRAPH_VIEW_NODE_VISUALS.asset,
      label: dictionary.graphView.nodeKinds.asset,
    },
    theme: {
      ...GRAPH_VIEW_NODE_VISUALS.theme,
      label: dictionary.graphView.nodeKinds.theme,
    },
    "news-article": {
      ...GRAPH_VIEW_NODE_VISUALS["news-article"],
      label: dictionary.graphView.nodeKinds["news-article"],
    },
  } satisfies Record<
    GraphViewNodeKind,
    (typeof GRAPH_VIEW_NODE_VISUALS)[GraphViewNodeKind] & { label: string }
  >
}

export function getGraphViewEdgeVisuals(dictionary: Dictionary) {
  return {
    "event-asset": {
      ...GRAPH_VIEW_EDGE_VISUALS["event-asset"],
      label: dictionary.graphView.edgeKinds["event-asset"],
    },
    "event-theme": {
      ...GRAPH_VIEW_EDGE_VISUALS["event-theme"],
      label: dictionary.graphView.edgeKinds["event-theme"],
    },
    "news-article-event": {
      ...GRAPH_VIEW_EDGE_VISUALS["news-article-event"],
      label: dictionary.graphView.edgeKinds["news-article-event"],
    },
  } satisfies Record<
    GraphViewEdgeKind,
    (typeof GRAPH_VIEW_EDGE_VISUALS)[GraphViewEdgeKind] & { label: string }
  >
}
