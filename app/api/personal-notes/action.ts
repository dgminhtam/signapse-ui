"use server"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { ActionResult, Page, SearchParams } from "@/app/lib/definitions"
import { getServerDictionary } from "@/app/lib/i18n/server"
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
    const dictionary = await getServerDictionary()
    const errorMessage =
      error instanceof Error ? error.message : dictionary.personalNotes.createError

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
    const dictionary = await getServerDictionary()
    const errorMessage =
      error instanceof Error ? error.message : dictionary.personalNotes.saveError

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
    const dictionary = await getServerDictionary()
    const errorMessage =
      error instanceof Error ? error.message : dictionary.personalNotes.deleteError

    return { success: false, error: errorMessage }
  }
}
