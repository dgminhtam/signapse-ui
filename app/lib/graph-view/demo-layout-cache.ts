import {
  GRAPH_VIEW_DEMO_FIXTURE_VERSION,
  GRAPH_VIEW_DEMO_LAYOUT_VERSION,
  type GraphViewDemoEdgeCount,
  type GraphViewDemoPosition,
} from "./demo-fixture"

export type GraphViewDemoLayoutStorage = Pick<
  Storage,
  "getItem" | "removeItem" | "setItem"
>

type SerializedLayout = {
  edgeCount: GraphViewDemoEdgeCount
  fixtureVersion: string
  layoutVersion: string
  positions: Record<string, GraphViewDemoPosition>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value)
}

function getStorage(storage?: GraphViewDemoLayoutStorage) {
  if (storage) {
    return storage
  }

  if (typeof window === "undefined") {
    return null
  }

  try {
    return window.localStorage
  } catch {
    return null
  }
}

export function getGraphViewDemoLayoutCacheKey(
  edgeCount: GraphViewDemoEdgeCount
) {
  return [
    "signapse",
    "graph-view-demo",
    GRAPH_VIEW_DEMO_FIXTURE_VERSION,
    GRAPH_VIEW_DEMO_LAYOUT_VERSION,
    edgeCount,
  ].join(":")
}

export function readGraphViewDemoLayoutCache(
  edgeCount: GraphViewDemoEdgeCount,
  nodeIds: readonly string[],
  storage?: GraphViewDemoLayoutStorage
): Record<string, GraphViewDemoPosition> | null {
  const targetStorage = getStorage(storage)

  if (!targetStorage) {
    return null
  }

  let raw: string | null

  try {
    raw = targetStorage.getItem(getGraphViewDemoLayoutCacheKey(edgeCount))
  } catch {
    return null
  }

  if (!raw) {
    return null
  }

  try {
    const parsed: unknown = JSON.parse(raw)

    if (
      !isRecord(parsed) ||
      parsed.edgeCount !== edgeCount ||
      parsed.fixtureVersion !== GRAPH_VIEW_DEMO_FIXTURE_VERSION ||
      parsed.layoutVersion !== GRAPH_VIEW_DEMO_LAYOUT_VERSION ||
      !isRecord(parsed.positions)
    ) {
      return null
    }

    const positions: Record<string, GraphViewDemoPosition> = {}

    for (const nodeId of nodeIds) {
      const position = parsed.positions[nodeId]

      if (
        !isRecord(position) ||
        !isFiniteNumber(position.x) ||
        !isFiniteNumber(position.y)
      ) {
        return null
      }

      positions[nodeId] = { x: position.x, y: position.y }
    }

    return positions
  } catch {
    return null
  }
}

export function writeGraphViewDemoLayoutCache(
  edgeCount: GraphViewDemoEdgeCount,
  nodeIds: readonly string[],
  positions: Readonly<Record<string, GraphViewDemoPosition>>,
  storage?: GraphViewDemoLayoutStorage
) {
  const targetStorage = getStorage(storage)

  if (!targetStorage) {
    return false
  }

  const cachedPositions: Record<string, GraphViewDemoPosition> = {}

  for (const nodeId of nodeIds) {
    const position = positions[nodeId]

    if (
      !position ||
      !isFiniteNumber(position.x) ||
      !isFiniteNumber(position.y)
    ) {
      return false
    }

    cachedPositions[nodeId] = { x: position.x, y: position.y }
  }

  const payload: SerializedLayout = {
    edgeCount,
    fixtureVersion: GRAPH_VIEW_DEMO_FIXTURE_VERSION,
    layoutVersion: GRAPH_VIEW_DEMO_LAYOUT_VERSION,
    positions: cachedPositions,
  }

  try {
    targetStorage.setItem(
      getGraphViewDemoLayoutCacheKey(edgeCount),
      JSON.stringify(payload)
    )
    return true
  } catch {
    return false
  }
}

export function clearGraphViewDemoLayoutCache(
  edgeCount: GraphViewDemoEdgeCount,
  storage?: GraphViewDemoLayoutStorage
) {
  const targetStorage = getStorage(storage)

  if (!targetStorage) {
    return false
  }

  try {
    targetStorage.removeItem(getGraphViewDemoLayoutCacheKey(edgeCount))
    return true
  } catch {
    return false
  }
}
