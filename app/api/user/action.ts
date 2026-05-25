"use server"

import { revalidatePath } from "next/cache"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { ActionResult } from "@/app/lib/definitions"
import { getDictionary } from "@/app/lib/i18n/dictionaries"
import { getRequestLocale } from "@/app/lib/i18n/server"
import {
  BackendMeResponse,
  UpdateUserProfileRequest,
} from "@/app/lib/users/definitions"

export async function getMe(): Promise<BackendMeResponse> {
  return fetchAuthenticated<BackendMeResponse>("/me")
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
