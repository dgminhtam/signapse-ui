"use server"

import { revalidatePath } from "next/cache"

import { fetchAuthenticated } from "@/app/api/auth/action"
import {
  AiProviderConfigCreateRequest,
  AiProviderConfigListResponse,
  AiProviderModelCatalogRequest,
  AiProviderModelCatalogResponse,
  AiProviderConfigResponse,
  AiProviderConfigServerResponse,
  AiProviderConfigUpdateRequest,
  sanitizeAiProviderConfig,
  sanitizeAiProviderConfigListItem,
} from "@/app/lib/ai-provider-configs/definitions"
import { ActionResult, Page, SearchParams } from "@/app/lib/definitions"
import { queryParamsToString } from "@/app/lib/utils"

function sanitizeAiProviderConfigPage(
  page: Page<AiProviderConfigServerResponse>
): Page<AiProviderConfigListResponse> {
  return {
    ...page,
    content: page.content.map(sanitizeAiProviderConfigListItem),
  }
}

export async function getAiProviderConfigs(
  searchParams: SearchParams
): Promise<Page<AiProviderConfigListResponse>> {
  const response = await fetchAuthenticated<Page<AiProviderConfigServerResponse>>(
    `/ai-provider-configs?${queryParamsToString(searchParams)}`
  )
  return sanitizeAiProviderConfigPage(response)
}

export async function getAiProviderConfigById(id: number): Promise<AiProviderConfigResponse> {
  const response = await fetchAuthenticated<AiProviderConfigServerResponse>(
    `/ai-provider-configs/${id}`
  )
  return sanitizeAiProviderConfig(response)
}

export async function getAiProviderModelCatalog(
  request: AiProviderModelCatalogRequest
): Promise<ActionResult<AiProviderModelCatalogResponse>> {
  try {
    const data = await fetchAuthenticated<AiProviderModelCatalogResponse>(
      "/ai-provider-configs/model-catalog",
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    )
    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Không thể xác thực và tải danh sách model",
    }
  }
}

export async function createAiProviderConfig(
  request: AiProviderConfigCreateRequest
): Promise<ActionResult<AiProviderConfigResponse>> {
  try {
    const data = await fetchAuthenticated<AiProviderConfigServerResponse>("/ai-provider-configs", {
      method: "POST",
      body: JSON.stringify(request),
    })
    revalidatePath("/ai-provider-configs")
    return { success: true, data: sanitizeAiProviderConfig(data) }
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Không thể tạo cấu hình nhà cung cấp AI",
    }
  }
}

export async function updateAiProviderConfig(
  id: number,
  request: AiProviderConfigUpdateRequest
): Promise<ActionResult<AiProviderConfigResponse>> {
  try {
    const data = await fetchAuthenticated<AiProviderConfigServerResponse>(
      `/ai-provider-configs/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(request),
      }
    )
    revalidatePath("/ai-provider-configs")
    revalidatePath(`/ai-provider-configs/${id}`)
    return { success: true, data: sanitizeAiProviderConfig(data) }
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Không thể cập nhật cấu hình nhà cung cấp AI",
    }
  }
}

export async function setAiProviderConfigDefault(
  id: number
): Promise<ActionResult<AiProviderConfigResponse>> {
  try {
    const data = await fetchAuthenticated<AiProviderConfigServerResponse>(
      `/ai-provider-configs/${id}/set-default`,
      {
        method: "PATCH",
      }
    )
    revalidatePath("/ai-provider-configs")
    revalidatePath(`/ai-provider-configs/${id}`)
    return { success: true, data: sanitizeAiProviderConfig(data) }
  } catch (error: unknown) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Không thể đặt nhà cung cấp AI mặc định",
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
      error: error instanceof Error ? error.message : "Không thể xóa cấu hình nhà cung cấp AI",
    }
  }
}
