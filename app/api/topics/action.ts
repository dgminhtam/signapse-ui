"use server"

import { revalidatePath } from "next/cache"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { ActionResult, Page, SearchParams } from "@/app/lib/definitions"
import {
  TopicCreateRequest,
  TopicListResponse,
  TopicResponse,
  TopicUpdateRequest,
} from "@/app/lib/topics/definitions"
import { queryParamsToString } from "@/app/lib/utils"

export async function getTopics(searchParams: SearchParams): Promise<Page<TopicListResponse>> {
  return fetchAuthenticated<Page<TopicListResponse>>(`/topics?${queryParamsToString(searchParams)}`)
}

export async function getTopicById(id: number): Promise<TopicResponse> {
  return fetchAuthenticated<TopicResponse>(`/topics/${id}`)
}

export async function createTopic(
  request: TopicCreateRequest
): Promise<ActionResult<TopicResponse>> {
  try {
    const topic = await fetchAuthenticated<TopicResponse>("/topics", {
      method: "POST",
      body: JSON.stringify(request),
    })
    revalidatePath("/topics")
    return { success: true, data: topic }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to create topic"
    return { success: false, error: errorMessage }
  }
}

export async function updateTopic(
  id: number,
  request: TopicUpdateRequest
): Promise<ActionResult<TopicResponse>> {
  try {
    const topic = await fetchAuthenticated<TopicResponse>(`/topics/${id}`, {
      method: "PUT",
      body: JSON.stringify(request),
    })
    revalidatePath("/topics")
    revalidatePath(`/topics/${id}`)
    return { success: true, data: topic }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update topic"
    return { success: false, error: errorMessage }
  }
}

export async function toggleTopicActive(id: number): Promise<ActionResult<TopicResponse>> {
  try {
    const topic = await fetchAuthenticated<TopicResponse>(`/topics/${id}/toggle-active`, {
      method: "PATCH",
    })
    revalidatePath("/topics")
    revalidatePath(`/topics/${id}`)
    return { success: true, data: topic }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to toggle topic status"
    return { success: false, error: errorMessage }
  }
}

export async function deleteTopic(id: number): Promise<ActionResult> {
  try {
    await fetchAuthenticated<void>(`/topics/${id}`, {
      method: "DELETE",
    })
    revalidatePath("/topics")
    return { success: true, data: undefined }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to delete topic"
    return { success: false, error: errorMessage }
  }
}
