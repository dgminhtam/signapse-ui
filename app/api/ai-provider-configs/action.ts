"use server"

import { revalidatePath } from "next/cache"

import { fetchAuthenticated } from "@/app/api/auth/action"
import {
  AiProviderConfigCreateRequest,
  AiProviderConfigListResponse,
  AiProviderModelCatalogRequest,
  AiProviderModelCatalogResponse,
  AiProviderConfigResponse,
  AiProviderConfigUpdateRequest,
  AiProviderCredentialCreateRequest,
  AiProviderCredentialResponse,
  AiProviderCredentialUpdateRequest,
} from "@/app/lib/ai-provider-configs/definitions"
import { ActionResult, Page, SearchParams } from "@/app/lib/definitions"
import { getDictionary } from "@/app/lib/i18n/dictionaries"
import { getRequestLocale } from "@/app/lib/i18n/server"
import { queryParamsToString } from "@/app/lib/utils"

function revalidateAiProviderConfig(id?: number) {
  revalidatePath("/ai-provider-configs")

  if (id) {
    revalidatePath(`/ai-provider-configs/${id}`)
  }
}

async function getAiProviderConfigDictionary() {
  return getDictionary(await getRequestLocale())
}

export async function getAiProviderConfigs(
  searchParams: SearchParams
): Promise<Page<AiProviderConfigListResponse>> {
  return fetchAuthenticated<Page<AiProviderConfigListResponse>>(
    `/ai-provider-configs?${queryParamsToString(searchParams)}`
  )
}

export async function getAiProviderConfigById(id: number): Promise<AiProviderConfigResponse> {
  return fetchAuthenticated<AiProviderConfigResponse>(
    `/ai-provider-configs/${id}`
  )
}

export async function getAiProviderCredentials(
  id: number
): Promise<AiProviderCredentialResponse[]> {
  return fetchAuthenticated<AiProviderCredentialResponse[]>(
    `/ai-provider-configs/${id}/credentials`
  )
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
    const dictionary = await getAiProviderConfigDictionary()

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : dictionary.aiProviderConfigs.modelCatalogError,
    }
  }
}

export async function createAiProviderConfig(
  request: AiProviderConfigCreateRequest
): Promise<ActionResult<AiProviderConfigResponse>> {
  try {
    const data = await fetchAuthenticated<AiProviderConfigResponse>("/ai-provider-configs", {
      method: "POST",
      body: JSON.stringify(request),
    })
    revalidateAiProviderConfig(data.id)
    return { success: true, data }
  } catch (error: unknown) {
    const dictionary = await getAiProviderConfigDictionary()

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : dictionary.aiProviderConfigs.createError,
    }
  }
}

export async function updateAiProviderConfig(
  id: number,
  request: AiProviderConfigUpdateRequest
): Promise<ActionResult<AiProviderConfigResponse>> {
  try {
    const data = await fetchAuthenticated<AiProviderConfigResponse>(
      `/ai-provider-configs/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(request),
      }
    )
    revalidateAiProviderConfig(id)
    return { success: true, data }
  } catch (error: unknown) {
    const dictionary = await getAiProviderConfigDictionary()

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : dictionary.aiProviderConfigs.updateError,
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
    revalidateAiProviderConfig(id)
    return { success: true, data }
  } catch (error: unknown) {
    const dictionary = await getAiProviderConfigDictionary()

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : dictionary.aiProviderConfigs.setDefaultError,
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
    const dictionary = await getAiProviderConfigDictionary()

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : dictionary.aiProviderConfigs.deleteConfigError,
    }
  }
}

export async function createAiProviderCredential(
  id: number,
  request: AiProviderCredentialCreateRequest
): Promise<ActionResult<AiProviderCredentialResponse>> {
  try {
    const data = await fetchAuthenticated<AiProviderCredentialResponse>(
      `/ai-provider-configs/${id}/credentials`,
      {
        method: "POST",
        body: JSON.stringify(request),
      }
    )
    revalidateAiProviderConfig(id)
    return { success: true, data }
  } catch (error: unknown) {
    const dictionary = await getAiProviderConfigDictionary()

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : dictionary.aiProviderConfigs.credentialCreateError,
    }
  }
}

export async function updateAiProviderCredential(
  id: number,
  credentialId: number,
  request: AiProviderCredentialUpdateRequest
): Promise<ActionResult<AiProviderCredentialResponse>> {
  try {
    const data = await fetchAuthenticated<AiProviderCredentialResponse>(
      `/ai-provider-configs/${id}/credentials/${credentialId}`,
      {
        method: "PUT",
        body: JSON.stringify(request),
      }
    )
    revalidateAiProviderConfig(id)
    return { success: true, data }
  } catch (error: unknown) {
    const dictionary = await getAiProviderConfigDictionary()

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : dictionary.aiProviderConfigs.credentialUpdateError,
    }
  }
}

export async function deleteAiProviderCredential(
  id: number,
  credentialId: number
): Promise<ActionResult> {
  try {
    await fetchAuthenticated<void>(
      `/ai-provider-configs/${id}/credentials/${credentialId}`,
      {
        method: "DELETE",
      }
    )
    revalidateAiProviderConfig(id)
    return { success: true, data: undefined }
  } catch (error: unknown) {
    const dictionary = await getAiProviderConfigDictionary()

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : dictionary.aiProviderConfigs.credentialDeleteError,
    }
  }
}
