"use server"

import { revalidatePath } from "next/cache"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { ActionResult, Page, SearchParams } from "@/app/lib/definitions"
import {
  WorkspaceCreateRequest,
  WorkspaceResponse,
  WorkspaceUpdateRequest,
} from "@/app/lib/workspaces/definitions"
import { queryParamsToString } from "@/app/lib/utils"

export async function getMyWorkspaces(
  searchParams: SearchParams
): Promise<Page<WorkspaceResponse>> {
  return fetchAuthenticated<Page<WorkspaceResponse>>(
    `/me/workspaces?${queryParamsToString(searchParams)}`
  )
}

export async function createWorkspace(
  request: WorkspaceCreateRequest
): Promise<ActionResult<WorkspaceResponse>> {
  try {
    const workspace = await fetchAuthenticated<WorkspaceResponse>("/me/workspaces", {
      method: "POST",
      body: JSON.stringify(request),
    })
    revalidatePath("/", "layout")
    return { success: true, data: workspace }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create workspace"
    return { success: false, error: errorMessage }
  }
}

export async function updateWorkspace(
  id: number,
  request: WorkspaceUpdateRequest
): Promise<ActionResult<WorkspaceResponse>> {
  try {
    const workspace = await fetchAuthenticated<WorkspaceResponse>(`/me/workspaces/${id}`, {
      method: "PUT",
      body: JSON.stringify(request),
    })
    revalidatePath("/", "layout")
    return { success: true, data: workspace }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update workspace"
    return { success: false, error: errorMessage }
  }
}

export async function setDefaultWorkspace(id: number): Promise<ActionResult<WorkspaceResponse>> {
  try {
    const workspace = await fetchAuthenticated<WorkspaceResponse>(
      `/me/workspaces/${id}/set-default`,
      {
        method: "PATCH",
      }
    )
    revalidatePath("/", "layout")
    return { success: true, data: workspace }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to set default workspace"
    return { success: false, error: errorMessage }
  }
}
