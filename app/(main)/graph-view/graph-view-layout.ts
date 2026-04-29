type MinimumSpacingNodeAttributes = {
  baseSize: number
  x: number
  y: number
}

type MinimumSpacingGraph<NodeAttributes extends MinimumSpacingNodeAttributes> = {
  forEachNode: (
    callback: (nodeId: string, attributes: NodeAttributes) => void
  ) => void
  getNodeAttributes: (nodeId: string) => NodeAttributes
  hasNode: (nodeId: string) => boolean
  setNodeAttribute: (nodeId: string, name: "x" | "y", value: number) => void
}

type MinimumSpacingOptions = {
  damping?: number
  iterations?: number
  nodeIds?: Iterable<string>
  padding?: number
}

const DEFAULT_NODE_SPACING_DAMPING = 0.62
const DEFAULT_NODE_SPACING_ITERATIONS = 18
const DEFAULT_NODE_SPACING_PADDING = 12
const MIN_DISTANCE_EPSILON = 0.001

function hashText(value: string) {
  let hash = 0

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index)
    hash |= 0
  }

  return Math.abs(hash)
}

function getMinimumNodeDistance(
  sourceSize: number,
  targetSize: number,
  padding: number
) {
  return (sourceSize + targetSize) * 0.72 + padding
}

function getDeterministicUnitVector(sourceNodeId: string, targetNodeId: string) {
  const angle =
    ((hashText(`${sourceNodeId}:${targetNodeId}`) % 360) * Math.PI) / 180

  return {
    x: Math.cos(angle),
    y: Math.sin(angle),
  }
}

function collectSpacingNodes<NodeAttributes extends MinimumSpacingNodeAttributes>(
  graph: MinimumSpacingGraph<NodeAttributes>,
  nodeIds?: Iterable<string>
) {
  const nodes: Array<{
    baseSize: number
    id: string
    x: number
    y: number
  }> = []

  if (nodeIds) {
    for (const nodeId of nodeIds) {
      if (!graph.hasNode(nodeId)) {
        continue
      }

      const attributes = graph.getNodeAttributes(nodeId)

      nodes.push({
        baseSize: attributes.baseSize,
        id: nodeId,
        x: attributes.x,
        y: attributes.y,
      })
    }

    return nodes
  }

  graph.forEachNode((nodeId, attributes) => {
    nodes.push({
      baseSize: attributes.baseSize,
      id: nodeId,
      x: attributes.x,
      y: attributes.y,
    })
  })

  return nodes
}

export function applyMinimumNodeSpacing<
  NodeAttributes extends MinimumSpacingNodeAttributes,
>(graph: MinimumSpacingGraph<NodeAttributes>, options: MinimumSpacingOptions = {}) {
  const nodes = collectSpacingNodes(graph, options.nodeIds)

  if (nodes.length < 2) {
    return
  }

  const damping = options.damping ?? DEFAULT_NODE_SPACING_DAMPING
  const iterations = options.iterations ?? DEFAULT_NODE_SPACING_ITERATIONS
  const padding = options.padding ?? DEFAULT_NODE_SPACING_PADDING

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const offsets = new Map<string, { x: number; y: number }>()
    let maxShift = 0

    for (let sourceIndex = 0; sourceIndex < nodes.length; sourceIndex += 1) {
      const sourceNode = nodes[sourceIndex]

      for (
        let targetIndex = sourceIndex + 1;
        targetIndex < nodes.length;
        targetIndex += 1
      ) {
        const targetNode = nodes[targetIndex]
        let deltaX = targetNode.x - sourceNode.x
        let deltaY = targetNode.y - sourceNode.y
        let distance = Math.hypot(deltaX, deltaY)
        const minimumDistance = getMinimumNodeDistance(
          sourceNode.baseSize,
          targetNode.baseSize,
          padding
        )

        if (distance >= minimumDistance) {
          continue
        }

        if (distance < MIN_DISTANCE_EPSILON) {
          const direction = getDeterministicUnitVector(
            sourceNode.id,
            targetNode.id
          )
          deltaX = direction.x
          deltaY = direction.y
          distance = 1
        }

        const overlap = ((minimumDistance - distance) / 2) * damping
        const unitX = deltaX / distance
        const unitY = deltaY / distance
        const sourceOffset = offsets.get(sourceNode.id) ?? { x: 0, y: 0 }
        const targetOffset = offsets.get(targetNode.id) ?? { x: 0, y: 0 }

        sourceOffset.x -= unitX * overlap
        sourceOffset.y -= unitY * overlap
        targetOffset.x += unitX * overlap
        targetOffset.y += unitY * overlap
        offsets.set(sourceNode.id, sourceOffset)
        offsets.set(targetNode.id, targetOffset)
      }
    }

    for (const node of nodes) {
      const offset = offsets.get(node.id)

      if (!offset) {
        continue
      }

      node.x += offset.x
      node.y += offset.y
      maxShift = Math.max(maxShift, Math.hypot(offset.x, offset.y))
    }

    if (maxShift < 0.01) {
      break
    }
  }

  for (const node of nodes) {
    graph.setNodeAttribute(node.id, "x", node.x)
    graph.setNodeAttribute(node.id, "y", node.y)
  }
}

export function nudgeNodeOutOfOverlap<
  NodeAttributes extends MinimumSpacingNodeAttributes,
>(
  graph: MinimumSpacingGraph<NodeAttributes>,
  nodeId: string,
  options: Omit<MinimumSpacingOptions, "nodeIds"> & {
    candidateNodeIds?: Iterable<string>
  } = {}
) {
  if (!graph.hasNode(nodeId)) {
    return
  }

  const draggedNode = graph.getNodeAttributes(nodeId)
  const padding = options.padding ?? DEFAULT_NODE_SPACING_PADDING
  const damping = options.damping ?? DEFAULT_NODE_SPACING_DAMPING
  const iterations = options.iterations ?? 8
  const candidateNodeIds = new Set(options.candidateNodeIds)
  candidateNodeIds.delete(nodeId)

  if (candidateNodeIds.size === 0) {
    graph.forEachNode((candidateNodeId) => {
      if (candidateNodeId !== nodeId) {
        candidateNodeIds.add(candidateNodeId)
      }
    })
  }

  let nextX = draggedNode.x
  let nextY = draggedNode.y

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    let shiftX = 0
    let shiftY = 0

    for (const candidateNodeId of candidateNodeIds) {
      if (!graph.hasNode(candidateNodeId)) {
        continue
      }

      const candidateNode = graph.getNodeAttributes(candidateNodeId)
      let deltaX = nextX - candidateNode.x
      let deltaY = nextY - candidateNode.y
      let distance = Math.hypot(deltaX, deltaY)
      const minimumDistance = getMinimumNodeDistance(
        draggedNode.baseSize,
        candidateNode.baseSize,
        padding
      )

      if (distance >= minimumDistance) {
        continue
      }

      if (distance < MIN_DISTANCE_EPSILON) {
        const direction = getDeterministicUnitVector(nodeId, candidateNodeId)
        deltaX = direction.x
        deltaY = direction.y
        distance = 1
      }

      const overlap = (minimumDistance - distance) * damping
      shiftX += (deltaX / distance) * overlap
      shiftY += (deltaY / distance) * overlap
    }

    nextX += shiftX
    nextY += shiftY

    if (Math.hypot(shiftX, shiftY) < 0.01) {
      break
    }
  }

  graph.setNodeAttribute(nodeId, "x", nextX)
  graph.setNodeAttribute(nodeId, "y", nextY)
}
