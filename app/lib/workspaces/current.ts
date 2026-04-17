import { getMyWorkspaces } from "@/app/api/workspaces/action"
import { resolveActiveWorkspace } from "@/app/lib/workspaces/active"
import { WorkspaceResponse } from "@/app/lib/workspaces/definitions"

const DEFAULT_WORKSPACE_SEARCH = {
  filter: "",
  page: 0,
  size: 100,
  sort: [{ field: "id", direction: "asc" as const }],
}

export async function getActiveWorkspaceForCurrentUser(): Promise<WorkspaceResponse | null> {
  const workspacePage = await getMyWorkspaces(DEFAULT_WORKSPACE_SEARCH)
  return resolveActiveWorkspace(workspacePage.content ?? [])
}
