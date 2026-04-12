"use server"

import { revalidatePath } from "next/cache"

import { fetchAuthenticated } from "@/app/api/auth/action"
import {
  AiProviderConfigListResponse,
  AiProviderConfigRequest,
  AiProviderConfigResponse,
} from "@/app/lib/ai-provider-configs/definitions"
import { ActionResult, Page, SearchParams } from "@/app/lib/definitions"
import { queryParamsToString } from "@/app/lib/utils"

export async function getAiProviderConfigs(
  searchParams: SearchParams
): Promise<Page<AiProviderConfigListResponse>> {
  return fetchAuthenticated<Page<AiProviderConfigListResponse>>(
    `/ai-provider-configs?${queryParamsToString(searchParams)}`
  )
}

export async function getActiveAiProviderConfigs(): Promise<AiProviderConfigResponse[]> {
  return fetchAuthenticated<AiProviderConfigResponse[]>("/ai-provider-configs/active")
}

export async function getAiProviderConfigById(id: number): Promise<AiProviderConfigResponse> {
  return fetchAuthenticated<AiProviderConfigResponse>(`/ai-provider-configs/${id}`)
}

export async function createAiProviderConfig(
  request: AiProviderConfigRequest
): Promise<ActionResult<AiProviderConfigResponse>> {
  try {
    const data = await fetchAuthenticated<AiProviderConfigResponse>("/ai-provider-configs", {
      method: "POST",
      body: JSON.stringify(request),
    })
    revalidatePath("/ai-provider-configs")
    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create AI provider config",
    }
  }
}

export async function updateAiProviderConfig(
  id: number,
  request: AiProviderConfigRequest
): Promise<ActionResult<AiProviderConfigResponse>> {
  try {
    const data = await fetchAuthenticated<AiProviderConfigResponse>(`/ai-provider-configs/${id}`, {
      method: "PUT",
      body: JSON.stringify(request),
    })
    revalidatePath("/ai-provider-configs")
    revalidatePath(`/ai-provider-configs/${id}`)
    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update AI provider config",
    }
  }
}

export async function toggleAiProviderConfigActive(
  id: number
): Promise<ActionResult<AiProviderConfigResponse>> {
  try {
    const data = await fetchAuthenticated<AiProviderConfigResponse>(
      `/ai-provider-configs/${id}/toggle-active`,
      {
        method: "PATCH",
      }
    )
    revalidatePath("/ai-provider-configs")
    revalidatePath(`/ai-provider-configs/${id}`)
    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update provider status",
    }
  }
}

export async function setAiProviderConfigDefault(
  id: number
): Promise<ActionResult<AiProviderConfigResponse>> {
  try {
    const data = await fetchAuthenticated<AiProviderConfigResponse>(
      `/ai-provider-configs/${id}/set-default`,
      {
        method: "PATCH",
      }
    )
    revalidatePath("/ai-provider-configs")
    revalidatePath(`/ai-provider-configs/${id}`)
    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to set default AI provider",
    }
  }
}

export async function deleteAiProviderConfig(id: number): Promise<ActionResult> {
  try {
    await fetchAuthenticated<void>(`/ai-provider-configs/${id}`, {
      method: "DELETE",
    })
    revalidatePath("/ai-provider-configs")
    return { success: true, data: undefined }
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete AI provider config",
    }
  }
}
