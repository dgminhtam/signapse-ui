"use server"

import { revalidatePath } from "next/cache"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { ActionResult } from "@/app/lib/definitions"
import { getDictionary } from "@/app/lib/i18n/dictionaries"
import { getRequestLocale } from "@/app/lib/i18n/server"
import {
  MailServiceResponse,
  MailServiceSaveRequest,
} from "@/app/lib/mail-service/definitions"

function revalidateMailService() {
  revalidatePath("/mail-service")
}

async function getMailServiceDictionary() {
  return getDictionary(await getRequestLocale())
}

export async function getMailServiceProviders(): Promise<string[]> {
  return fetchAuthenticated<string[]>("/mail-service/provider")
}

export async function getMailServices(): Promise<MailServiceResponse[]> {
  return fetchAuthenticated<MailServiceResponse[]>("/mail-service")
}

export async function createMailService(
  request: MailServiceSaveRequest
): Promise<ActionResult<MailServiceResponse>> {
  try {
    const data = await fetchAuthenticated<MailServiceResponse>("/mail-service", {
      method: "POST",
      body: JSON.stringify(request),
    })

    revalidateMailService()

    return { success: true, data }
  } catch (error: unknown) {
    const dictionary = await getMailServiceDictionary()

    return {
      success: false,
      error:
        error instanceof Error ? error.message : dictionary.mailService.createError,
    }
  }
}

export async function updateMailService(
  request: MailServiceSaveRequest
): Promise<ActionResult<MailServiceResponse>> {
  try {
    const data = await fetchAuthenticated<MailServiceResponse>("/mail-service", {
      method: "PATCH",
      body: JSON.stringify(request),
    })

    revalidateMailService()

    return { success: true, data }
  } catch (error: unknown) {
    const dictionary = await getMailServiceDictionary()

    return {
      success: false,
      error:
        error instanceof Error ? error.message : dictionary.mailService.updateError,
    }
  }
}

export async function deleteMailService(email: string): Promise<ActionResult> {
  try {
    await fetchAuthenticated<void>(
      `/mail-service/${encodeURIComponent(email)}`,
      {
        method: "DELETE",
      }
    )

    revalidateMailService()

    return { success: true, data: undefined }
  } catch (error: unknown) {
    const dictionary = await getMailServiceDictionary()

    return {
      success: false,
      error:
        error instanceof Error ? error.message : dictionary.mailService.deleteError,
    }
  }
}
