"use server"

import { revalidatePath } from "next/cache"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { ActionResult, Page, SearchParams } from "@/app/lib/definitions"
import { getServerDictionary } from "@/app/lib/i18n/server"
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
    const workspace = await fetchAuthenticated<WorkspaceResponse>(
      "/me/workspaces",
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    )
    revalidatePath("/", "layout")
    return { success: true, data: workspace }
  } catch (error: unknown) {
    const dictionary = await getServerDictionary()
    const errorMessage =
      error instanceof Error ? error.message : dictionary.workspace.createError
    return { success: false, error: errorMessage }
  }
}

export async function updateWorkspace(
  id: number,
  request: WorkspaceUpdateRequest
): Promise<ActionResult<WorkspaceResponse>> {
  try {
    const workspace = await fetchAuthenticated<WorkspaceResponse>(
      `/me/workspaces/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(request),
      }
    )
    revalidatePath("/", "layout")
    return { success: true, data: workspace }
  } catch (error: unknown) {
    const dictionary = await getServerDictionary()
    const errorMessage =
      error instanceof Error ? error.message : dictionary.workspace.updateError
    return { success: false, error: errorMessage }
  }
}

export async function setCurrentWorkspace(
  id: number
): Promise<ActionResult<WorkspaceResponse>> {
  try {
    const workspace = await fetchAuthenticated<WorkspaceResponse>(
      `/me/workspaces/${id}/set-current`,
      {
        method: "PATCH",
      }
    )
    revalidatePath("/", "layout")
    return { success: true, data: workspace }
  } catch (error: unknown) {
    const dictionary = await getServerDictionary()
    const errorMessage =
      error instanceof Error ? error.message : dictionary.workspace.switchError
    return { success: false, error: errorMessage }
  }
}
