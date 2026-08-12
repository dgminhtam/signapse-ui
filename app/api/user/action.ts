"use server"

import { revalidatePath } from "next/cache"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { ActionResult } from "@/app/lib/definitions"
import { getDictionary } from "@/app/lib/i18n/dictionaries"
import { getRequestLocale } from "@/app/lib/i18n/server"
import {
  BackendMeResponse,
  UpdateManagedUserRequest,
  UpdateUserProfileRequest,
  UserResponse,
  UserSearchRequest,
  UserSearchResponse,
} from "@/app/lib/users/definitions"

function buildUserSearchQuery(request: UserSearchRequest) {
  const params = new URLSearchParams()
  const filter = request.filter?.trim()

  if (filter) {
    params.set("$filter", filter)
  }

  const query = params.toString()
  return query ? `?${query}` : ""
}

export async function getMe(): Promise<BackendMeResponse> {
  return fetchAuthenticated<BackendMeResponse>("/me")
}

export async function getUsers(
  request: UserSearchRequest = {}
): Promise<UserSearchResponse> {
  return fetchAuthenticated<UserSearchResponse>(`/users${buildUserSearchQuery(request)}`)
}

export async function updateManagedUser(
  id: number,
  request: UpdateManagedUserRequest
): Promise<ActionResult<UserResponse>> {
  try {
    const user = await fetchAuthenticated<UserResponse>(
      `/users/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify(request),
      }
    )

    revalidatePath("/users")

    return { success: true, data: user }
  } catch (error: unknown) {
    const dictionary = await getDictionary(await getRequestLocale())
    const errorMessage =
      error instanceof Error ? error.message : dictionary.users.updateError

    return { success: false, error: errorMessage }
  }
}

export async function updateMyProfile(
  request: UpdateUserProfileRequest
): Promise<ActionResult<BackendMeResponse>> {
  try {
    const profile = await fetchAuthenticated<BackendMeResponse>("/me", {
      method: "PATCH",
      body: JSON.stringify(request),
    })

    revalidatePath("/account")
    revalidatePath("/", "layout")

    return { success: true, data: profile }
  } catch (error: unknown) {
    const dictionary = await getDictionary(await getRequestLocale())
    const errorMessage =
      error instanceof Error ? error.message : dictionary.accountProfile.updateError

    return { success: false, error: errorMessage }
  }
}
