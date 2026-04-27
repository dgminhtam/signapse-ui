"use server"

import { revalidatePath } from "next/cache"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { ActionResult, Page, SearchParams } from "@/app/lib/definitions"
import {
  CreateSystemPromptRequest,
  SystemPromptResponse,
  SystemPromptType,
  UpdateSystemPromptRequest,
} from "@/app/lib/system-prompts/definitions"
import { queryParamsToString } from "@/app/lib/utils"

function getSystemPromptPath(promptType: string) {
  return `/system-prompts/${encodeURIComponent(promptType)}`
}

function revalidateSystemPromptRoutes(promptType?: string) {
  revalidatePath("/system-prompts")

  if (promptType) {
    revalidatePath(getSystemPromptPath(promptType))
    return
  }

  revalidatePath("/system-prompts/[promptType]", "page")
}

export async function getSystemPrompts(
  searchParams: SearchParams
): Promise<Page<SystemPromptResponse>> {
  return fetchAuthenticated<Page<SystemPromptResponse>>(
    `/system-prompts?${queryParamsToString(searchParams)}`
  )
}

export async function getSystemPromptByType(
  promptType: SystemPromptType
): Promise<SystemPromptResponse> {
  return fetchAuthenticated<SystemPromptResponse>(getSystemPromptPath(promptType))
}

export async function createSystemPrompt(
  request: CreateSystemPromptRequest
): Promise<ActionResult<SystemPromptResponse>> {
  try {
    const data = await fetchAuthenticated<SystemPromptResponse>("/system-prompts", {
      method: "POST",
      body: JSON.stringify(request),
    })

    revalidateSystemPromptRoutes(request.promptType)

    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Không thể tạo prompt hệ thống.",
    }
  }
}

export async function updateSystemPrompt(
  promptType: SystemPromptType,
  request: UpdateSystemPromptRequest
): Promise<ActionResult<SystemPromptResponse>> {
  try {
    const data = await fetchAuthenticated<SystemPromptResponse>(
      getSystemPromptPath(promptType),
      {
        method: "PUT",
        body: JSON.stringify(request),
      }
    )

    revalidateSystemPromptRoutes(promptType)

    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Không thể cập nhật prompt hệ thống.",
    }
  }
}

export async function deleteSystemPrompt(
  promptType: SystemPromptType
): Promise<ActionResult> {
  try {
    await fetchAuthenticated<void>(getSystemPromptPath(promptType), {
      method: "DELETE",
    })

    revalidateSystemPromptRoutes(promptType)

    return { success: true, data: undefined }
  } catch (error: unknown) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Không thể xóa prompt hệ thống.",
    }
  }
}
