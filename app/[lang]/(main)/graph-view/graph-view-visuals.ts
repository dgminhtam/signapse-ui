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
  narrative: {
    chipClassName:
      "border-violet-300/60 bg-violet-50 text-violet-900 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-100",
    color: "#7c3aed",
    size: 26,
  },
  "warm-episode": {
    chipClassName:
      "border-cyan-300/60 bg-cyan-50 text-cyan-900 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-100",
    color: "#0891b2",
    size: 25,
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
  "asset-warm-episode": {
    chipClassName:
      "border-cyan-300/60 bg-cyan-50 text-cyan-900 dark:border-cyan-500/30 dark:bg-cyan-500/10 dark:text-cyan-100",
    color: "#22d3ee",
    size: 1.35,
  },
  "warm-episode-event": {
    chipClassName:
      "border-sky-300/60 bg-sky-50 text-sky-900 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-100",
    color: "#38bdf8",
    size: 1.45,
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
    narrative: {
      ...GRAPH_VIEW_NODE_VISUALS.narrative,
      label: dictionary.graphView.nodeKinds.narrative,
    },
    "warm-episode": {
      ...GRAPH_VIEW_NODE_VISUALS["warm-episode"],
      label: dictionary.graphView.nodeKinds["warm-episode"],
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
    "narrative-event": {
      ...GRAPH_VIEW_EDGE_VISUALS["narrative-event"],
      label: dictionary.graphView.edgeKinds["narrative-event"],
    },
    "narrative-asset": {
      ...GRAPH_VIEW_EDGE_VISUALS["narrative-asset"],
      label: dictionary.graphView.edgeKinds["narrative-asset"],
    },
    "asset-warm-episode": {
      ...GRAPH_VIEW_EDGE_VISUALS["asset-warm-episode"],
      label: dictionary.graphView.edgeKinds["asset-warm-episode"],
    },
    "warm-episode-event": {
      ...GRAPH_VIEW_EDGE_VISUALS["warm-episode-event"],
      label: dictionary.graphView.edgeKinds["warm-episode-event"],
    },
  } satisfies Record<
    GraphViewEdgeKind,
    (typeof GRAPH_VIEW_EDGE_VISUALS)[GraphViewEdgeKind] & { label: string }
  >
}
