import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

import { MultiDirectedGraph } from "graphology"

function summarizeIssues(
  issues: Array<{
    code: string
    message: string
    path: PropertyKey[]
  }>
) {
  return issues.map((issue) => ({
    code: issue.code,
    message: issue.message,
    path:
      issue.path.length > 0
        ? issue.path
            .map((segment) =>
              typeof segment === "number" ? `[${segment}]` : String(segment)
            )
            .join(".")
            .replace(".[", "[")
        : "<root>",
  }))
}

function verifyParallelEdgesCanBeLoaded() {
  const modelGraph = new MultiDirectedGraph()
  const runtimeGraph = new MultiDirectedGraph()
  const edges = [
    {
      id: "event:4->asset:7:AFFECTED_ASSET",
      relationType: "AFFECTED_ASSET",
      sourceNodeId: "event:4",
      targetNodeId: "asset:7",
    },
    {
      id: "event:4->asset:7:PRIMARY_SUBJECT",
      relationType: "PRIMARY_SUBJECT",
      sourceNodeId: "event:4",
      targetNodeId: "asset:7",
    },
    {
      id: "event:3->theme:10:PRIMARY_THEME",
      relationType: "PRIMARY_THEME",
      sourceNodeId: "event:3",
      targetNodeId: "theme:10",
    },
    {
      id: "event:3->theme:10:SECONDARY_THEME",
      relationType: "SECONDARY_THEME",
      sourceNodeId: "event:3",
      targetNodeId: "theme:10",
    },
  ]

  for (const edge of edges) {
    if (!modelGraph.hasNode(edge.sourceNodeId)) {
      modelGraph.addNode(edge.sourceNodeId)
    }

    if (!modelGraph.hasNode(edge.targetNodeId)) {
      modelGraph.addNode(edge.targetNodeId)
    }

    modelGraph.addDirectedEdgeWithKey(
      edge.id,
      edge.sourceNodeId,
      edge.targetNodeId,
      {
        relationType: edge.relationType,
      }
    )
  }

  runtimeGraph.import(modelGraph)

  const missingEdge = edges.find((edge) => !runtimeGraph.hasEdge(edge.id))

  if (missingEdge) {
    console.error("Parallel graph edge should remain addressable by id", {
      edgeId: missingEdge.id,
    })
    return false
  }

  const relationMismatch = edges.find(
    (edge) =>
      runtimeGraph.getEdgeAttribute(edge.id, "relationType") !==
      edge.relationType
  )

  if (relationMismatch) {
    console.error("Parallel graph edge should preserve relation metadata", {
      edgeId: relationMismatch.id,
      relationType: relationMismatch.relationType,
    })
    return false
  }

  if (runtimeGraph.size !== edges.length) {
    console.error("Parallel graph should preserve every distinct edge", {
      actual: runtimeGraph.size,
      expected: edges.length,
    })
    return false
  }

  return true
}

async function main() {
  const { graphViewResponseSchema } = (await import(
    new URL("../app/lib/graph-view/definitions.ts", import.meta.url).href
  )) as typeof import("../app/lib/graph-view/definitions")
  const fixturePath = resolve(
    import.meta.dirname,
    "./fixtures/graph-view-runtime-response.json"
  )
  const rawFixture = await readFile(fixturePath, "utf8")
  const runtimePayload = JSON.parse(rawFixture) as unknown

  const validPayloadResult = graphViewResponseSchema.safeParse(runtimePayload)

  if (!validPayloadResult.success) {
    console.error("Graph-view nullable metadata fixture should parse", {
      issues: summarizeIssues(validPayloadResult.error.issues),
    })
    process.exitCode = 1
    return
  }

  const invalidPayloadResult = graphViewResponseSchema.safeParse({
    nodes: [
      {
        id: "event:1",
        kind: "unsupported-kind",
        label: "Payload invalid",
      },
    ],
    edges: [],
  })

  if (invalidPayloadResult.success) {
    console.error(
      "Graph-view schema should stay strict for unsupported node kinds"
    )
    process.exitCode = 1
    return
  }

  if (!verifyParallelEdgesCanBeLoaded()) {
    process.exitCode = 1
    return
  }

  console.log("Graph-view response and multigraph regression checks passed.")
}

void main()
