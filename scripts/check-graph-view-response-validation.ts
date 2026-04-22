import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

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

  console.log("Graph-view response schema regression checks passed.")
}

void main()
