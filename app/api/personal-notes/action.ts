"use server"

import { fetchAuthenticated } from "@/app/api/auth/action"
import type { ActionResult, Page, SearchParams } from "@/app/lib/definitions"
import { getServerDictionary } from "@/app/lib/i18n/server"
import {
  personalNoteMutationSchema,
  type PersonalNoteMutationRequest,
  type PersonalNoteResponse,
  type PersonalNoteSummaryResponse,
} from "@/app/lib/personal-notes/definitions"
import { queryParamsToString } from "@/app/lib/utils"

export async function getPersonalNotes(
  searchParams: SearchParams
): Promise<Page<PersonalNoteSummaryResponse>> {
  return fetchAuthenticated<Page<PersonalNoteSummaryResponse>>(
    `/me/notes?${queryParamsToString(searchParams)}`
  )
}

export async function getPersonalNote(
  id: number
): Promise<PersonalNoteResponse> {
  return fetchAuthenticated<PersonalNoteResponse>(`/me/notes/${id}`)
}

export async function createPersonalNote(
  request: PersonalNoteMutationRequest
): Promise<ActionResult<PersonalNoteResponse>> {
  const dictionary = await getServerDictionary()
  const parsed = personalNoteMutationSchema.safeParse(request)

  if (!parsed.success) {
    return { success: false, error: dictionary.personalNotes.invalidContent }
  }

  try {
    const note = await fetchAuthenticated<PersonalNoteResponse>("/me/notes", {
      method: "POST",
      body: JSON.stringify(parsed.data),
    })
    return { success: true, data: note }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : dictionary.personalNotes.createError,
    }
  }
}

export async function updatePersonalNote(
  id: number,
  request: PersonalNoteMutationRequest
): Promise<ActionResult<PersonalNoteResponse>> {
  const dictionary = await getServerDictionary()
  const parsed = personalNoteMutationSchema.safeParse(request)

  if (!parsed.success) {
    return { success: false, error: dictionary.personalNotes.invalidContent }
  }

  try {
    const note = await fetchAuthenticated<PersonalNoteResponse>(
      `/me/notes/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(parsed.data),
      }
    )
    return { success: true, data: note }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : dictionary.personalNotes.updateError,
    }
  }
}

export async function deletePersonalNote(
  id: number
): Promise<ActionResult<void>> {
  const dictionary = await getServerDictionary()

  try {
    await fetchAuthenticated<void>(`/me/notes/${id}`, { method: "DELETE" })
    return { success: true, data: undefined }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : dictionary.personalNotes.deleteError,
    }
  }
}
