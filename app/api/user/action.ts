"use server"

import { revalidatePath } from "next/cache"
import { isClerkAPIResponseError } from "@clerk/nextjs/errors"
import { clerkClient } from "@clerk/nextjs/server"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { ActionResult } from "@/app/lib/definitions"
import { getDictionary } from "@/app/lib/i18n/dictionaries"
import { getRequestLocale } from "@/app/lib/i18n/server"
import { hasPermission } from "@/app/lib/permissions"
import { getCurrentPermissions } from "@/app/lib/permissions-server"
import {
  BackendMeResponse,
  CreateUserRequest,
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
  return fetchAuthenticated<UserSearchResponse>(
    `/users${buildUserSearchQuery(request)}`
  )
}

export async function createUser(
  request: CreateUserRequest
): Promise<ActionResult<{ clerkUserId: string }>> {
  try {
    const permissions = await getCurrentPermissions()

    if (!hasPermission(permissions, "user:update")) {
      const dictionary = await getDictionary(await getRequestLocale())

      return { success: false, error: dictionary.users.createError }
    }

    const client = await clerkClient()
    const user = await client.users.createUser({
      emailAddress: [request.email.trim()],
      firstName: request.firstName.trim(),
      lastName: request.lastName.trim(),
    })

    revalidatePath("/users")

    return { success: true, data: { clerkUserId: user.id } }
  } catch (error: unknown) {
    const dictionary = await getDictionary(await getRequestLocale())
    const errorMessage =
      isClerkAPIResponseError(error) && error.status === 422
        ? dictionary.users.emailInvalid
        : error instanceof Error
          ? error.message
          : dictionary.users.createError

    return { success: false, error: errorMessage }
  }
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
      error instanceof Error
        ? error.message
        : dictionary.accountProfile.updateError

    return { success: false, error: errorMessage }
  }
}
