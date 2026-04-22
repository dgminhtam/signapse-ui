"use server"

import { fetchAuthenticated } from "@/app/api/auth/action"
import {
  GraphViewResponse,
  graphViewResponseSchema,
} from "@/app/lib/graph-view/definitions"

const GRAPH_VIEW_VALIDATION_ISSUE_LIMIT = 12

function formatGraphViewValidationPath(path: PropertyKey[]): string {
  if (path.length === 0) {
    return "<root>"
  }

  return path
    .map((segment) =>
      typeof segment === "number" ? `[${segment}]` : String(segment)
    )
    .join(".")
    .replace(".[", "[")
}

function summarizeGraphViewValidationIssues(
  issues: Array<{
    code: string
    message: string
    path: PropertyKey[]
  }>
) {
  return issues.slice(0, GRAPH_VIEW_VALIDATION_ISSUE_LIMIT).map((issue) => ({
    code: issue.code,
    message: issue.message,
    path: formatGraphViewValidationPath(issue.path),
  }))
}

export async function getGraphView(): Promise<GraphViewResponse> {
  const response = await fetchAuthenticated<unknown>("/graph-view")
  const parsedResponse = graphViewResponseSchema.safeParse(response)

  if (!parsedResponse.success) {
    const issues = parsedResponse.error.issues

    console.error("Graph view response validation failed", {
      issueCount: issues.length,
      issues: summarizeGraphViewValidationIssues(issues),
      truncated: issues.length > GRAPH_VIEW_VALIDATION_ISSUE_LIMIT,
    })
    throw new Error(
      "Backend trả về dữ liệu biểu đồ tri thức không đúng định dạng mong đợi."
    )
  }

  return parsedResponse.data
}
