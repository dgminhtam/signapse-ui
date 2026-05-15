"use server"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { ActionResult, Page, SearchParams } from "@/app/lib/definitions"
import {
  CreatePersonalNoteRequest,
  PersonalNoteResponse,
  UpdatePersonalNoteRequest,
} from "@/app/lib/personal-notes/definitions"
import { queryParamsToString } from "@/app/lib/utils"

export async function getPersonalNotes(
  searchParams: SearchParams
): Promise<Page<PersonalNoteResponse>> {
  return fetchAuthenticated<Page<PersonalNoteResponse>>(
    `/me/notes?${queryParamsToString(searchParams)}`
  )
}

export async function getPersonalNote(
  id: number
): Promise<PersonalNoteResponse> {
  return fetchAuthenticated<PersonalNoteResponse>(`/me/notes/${id}`)
}

export async function createPersonalNote(
  request: CreatePersonalNoteRequest
): Promise<ActionResult<PersonalNoteResponse>> {
  try {
    const note = await fetchAuthenticated<PersonalNoteResponse>("/me/notes", {
      method: "POST",
      body: JSON.stringify({
        contentHtml: request.contentHtml,
      }),
    })

    return { success: true, data: note }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Không thể tạo ghi chú"

    return { success: false, error: errorMessage }
  }
}

export async function updatePersonalNote(
  id: number,
  request: UpdatePersonalNoteRequest
): Promise<ActionResult<PersonalNoteResponse>> {
  try {
    const note = await fetchAuthenticated<PersonalNoteResponse>(
      `/me/notes/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          contentHtml: request.contentHtml,
        }),
      }
    )

    return { success: true, data: note }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Không thể lưu ghi chú"

    return { success: false, error: errorMessage }
  }
}

export async function deletePersonalNote(id: number): Promise<ActionResult> {
  try {
    await fetchAuthenticated<void>(`/me/notes/${id}`, {
      method: "DELETE",
    })

    return { success: true, data: undefined }
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Không thể xóa ghi chú"

    return { success: false, error: errorMessage }
  }
}
