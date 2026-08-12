"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { ActionResult } from "@/app/lib/definitions"
import { getDictionary } from "@/app/lib/i18n/dictionaries"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import { getRequestLocale } from "@/app/lib/i18n/server"
import {
  CreateTelegramBotConnectionRequest,
  CreateTelegramLinkTokenRequest,
  getCreateTelegramBotConnectionSchema,
  getCreateTelegramLinkTokenSchema,
  getSaveTelegramMarketAnalysisScheduleSchema,
  getUpdateTelegramBotConnectionSchema,
  getUpdateTelegramDestinationSchema,
  getUpdateTelegramFeatureSettingSchema,
  SaveTelegramMarketAnalysisScheduleRequest,
  TelegramBotConnectionResponse,
  TelegramDestinationResponse,
  TelegramFeatureSettingResponse,
  TelegramLinkTokenResponse,
  TelegramMarketAnalysisScheduleResponse,
  UpdateTelegramBotConnectionRequest,
  UpdateTelegramDestinationRequest,
  UpdateTelegramFeatureSettingRequest,
} from "@/app/lib/telegram/definitions"

async function getTelegramDictionary() {
  return getDictionary(await getRequestLocale())
}

function getValidationError(error: z.ZodError, dictionary: Dictionary): string {
  return error.issues[0]?.message ?? dictionary.telegram.validationInvalid
}

function getActionError(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}

function revalidateTelegramConfiguration() {
  revalidatePath("/telegram")
}

export async function getTelegramBotConnections(): Promise<
  TelegramBotConnectionResponse[]
> {
  return fetchAuthenticated<TelegramBotConnectionResponse[]>(
    "/telegram/bot-connections"
  )
}

export async function getTelegramDestinations(): Promise<
  TelegramDestinationResponse[]
> {
  return fetchAuthenticated<TelegramDestinationResponse[]>(
    "/telegram/destinations"
  )
}

export async function getTelegramFeatureSettings(): Promise<
  TelegramFeatureSettingResponse[]
> {
  return fetchAuthenticated<TelegramFeatureSettingResponse[]>(
    "/telegram/feature-settings"
  )
}

export async function getTelegramMarketAnalysisSchedules(): Promise<
  TelegramMarketAnalysisScheduleResponse[]
> {
  return fetchAuthenticated<TelegramMarketAnalysisScheduleResponse[]>(
    "/telegram/market-analysis-schedules"
  )
}

export async function createTelegramBotConnection(
  request: CreateTelegramBotConnectionRequest
): Promise<ActionResult<TelegramBotConnectionResponse>> {
  const dictionary = await getTelegramDictionary()
  const parsed =
    getCreateTelegramBotConnectionSchema(dictionary).safeParse(request)

  if (!parsed.success) {
    return {
      success: false,
      error: getValidationError(parsed.error, dictionary),
    }
  }

  try {
    const data = await fetchAuthenticated<TelegramBotConnectionResponse>(
      "/telegram/bot-connections",
      {
        method: "POST",
        body: JSON.stringify(parsed.data),
      }
    )

    revalidateTelegramConfiguration()

    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error: getActionError(error, dictionary.telegram.bot.createError),
    }
  }
}

export async function updateTelegramBotConnection(
  id: number,
  request: UpdateTelegramBotConnectionRequest
): Promise<ActionResult<TelegramBotConnectionResponse>> {
  const dictionary = await getTelegramDictionary()
  const parsed = getUpdateTelegramBotConnectionSchema().safeParse(request)

  if (!parsed.success) {
    return {
      success: false,
      error: getValidationError(parsed.error, dictionary),
    }
  }

  try {
    const data = await fetchAuthenticated<TelegramBotConnectionResponse>(
      `/telegram/bot-connections/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(parsed.data),
      }
    )

    revalidateTelegramConfiguration()

    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error: getActionError(error, dictionary.telegram.bot.updateError),
    }
  }
}

export async function disableTelegramBotConnection(
  id: number
): Promise<ActionResult<TelegramBotConnectionResponse>> {
  const dictionary = await getTelegramDictionary()

  try {
    const data = await fetchAuthenticated<TelegramBotConnectionResponse>(
      `/telegram/bot-connections/${id}/disable`,
      {
        method: "PATCH",
      }
    )

    revalidateTelegramConfiguration()

    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error: getActionError(error, dictionary.telegram.bot.pauseError),
    }
  }
}

export async function deleteTelegramBotConnection(
  id: number
): Promise<ActionResult> {
  const dictionary = await getTelegramDictionary()

  try {
    await fetchAuthenticated<void>(`/telegram/bot-connections/${id}`, {
      method: "DELETE",
    })

    revalidateTelegramConfiguration()

    return { success: true, data: undefined }
  } catch (error: unknown) {
    return {
      success: false,
      error: getActionError(error, dictionary.telegram.bot.deleteError),
    }
  }
}

export async function createTelegramLinkToken(
  request: CreateTelegramLinkTokenRequest
): Promise<ActionResult<TelegramLinkTokenResponse>> {
  const dictionary = await getTelegramDictionary()
  const parsed = getCreateTelegramLinkTokenSchema().safeParse(request)

  if (!parsed.success) {
    return {
      success: false,
      error: getValidationError(parsed.error, dictionary),
    }
  }

  try {
    const data = await fetchAuthenticated<TelegramLinkTokenResponse>(
      "/telegram/destinations/link-token",
      {
        method: "POST",
        body: JSON.stringify(parsed.data),
      }
    )

    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error: getActionError(
        error,
        dictionary.telegram.destination.createLinkError
      ),
    }
  }
}

export async function updateTelegramDestination(
  id: number,
  request: UpdateTelegramDestinationRequest
): Promise<ActionResult<TelegramDestinationResponse>> {
  const dictionary = await getTelegramDictionary()
  const parsed = getUpdateTelegramDestinationSchema().safeParse(request)

  if (!parsed.success) {
    return {
      success: false,
      error: getValidationError(parsed.error, dictionary),
    }
  }

  try {
    const data = await fetchAuthenticated<TelegramDestinationResponse>(
      `/telegram/destinations/${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(parsed.data),
      }
    )

    revalidateTelegramConfiguration()

    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error: getActionError(error, dictionary.telegram.destination.updateError),
    }
  }
}

export async function disableTelegramDestination(
  id: number
): Promise<ActionResult<TelegramDestinationResponse>> {
  const dictionary = await getTelegramDictionary()

  try {
    const data = await fetchAuthenticated<TelegramDestinationResponse>(
      `/telegram/destinations/${id}/disable`,
      {
        method: "PATCH",
      }
    )

    revalidateTelegramConfiguration()

    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error: getActionError(error, dictionary.telegram.destination.pauseError),
    }
  }
}

export async function deleteTelegramDestination(
  id: number
): Promise<ActionResult> {
  const dictionary = await getTelegramDictionary()

  try {
    await fetchAuthenticated<void>(`/telegram/destinations/${id}`, {
      method: "DELETE",
    })

    revalidateTelegramConfiguration()

    return { success: true, data: undefined }
  } catch (error: unknown) {
    return {
      success: false,
      error: getActionError(error, dictionary.telegram.destination.deleteError),
    }
  }
}

export async function updateTelegramFeatureSetting(
  request: UpdateTelegramFeatureSettingRequest
): Promise<ActionResult<TelegramFeatureSettingResponse>> {
  const dictionary = await getTelegramDictionary()
  const parsed = getUpdateTelegramFeatureSettingSchema().safeParse(request)

  if (!parsed.success) {
    return {
      success: false,
      error: getValidationError(parsed.error, dictionary),
    }
  }

  try {
    const data = await fetchAuthenticated<TelegramFeatureSettingResponse>(
      "/telegram/feature-settings",
      {
        method: "PUT",
        body: JSON.stringify(parsed.data),
      }
    )

    revalidateTelegramConfiguration()

    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error: getActionError(error, dictionary.telegram.routing.updateError),
    }
  }
}

export async function createTelegramMarketAnalysisSchedule(
  request: SaveTelegramMarketAnalysisScheduleRequest
): Promise<ActionResult<TelegramMarketAnalysisScheduleResponse>> {
  const dictionary = await getTelegramDictionary()
  const parsed =
    getSaveTelegramMarketAnalysisScheduleSchema(dictionary).safeParse(request)

  if (!parsed.success) {
    return {
      success: false,
      error: getValidationError(parsed.error, dictionary),
    }
  }

  try {
    const data =
      await fetchAuthenticated<TelegramMarketAnalysisScheduleResponse>(
        "/telegram/market-analysis-schedules",
        {
          method: "POST",
          body: JSON.stringify(parsed.data),
        }
      )

    revalidateTelegramConfiguration()

    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error: getActionError(error, dictionary.telegram.schedule.createError),
    }
  }
}

export async function updateTelegramMarketAnalysisSchedule(
  id: number,
  request: SaveTelegramMarketAnalysisScheduleRequest
): Promise<ActionResult<TelegramMarketAnalysisScheduleResponse>> {
  const dictionary = await getTelegramDictionary()
  const parsed =
    getSaveTelegramMarketAnalysisScheduleSchema(dictionary).safeParse(request)

  if (!parsed.success) {
    return {
      success: false,
      error: getValidationError(parsed.error, dictionary),
    }
  }

  try {
    const data =
      await fetchAuthenticated<TelegramMarketAnalysisScheduleResponse>(
        `/telegram/market-analysis-schedules/${id}`,
        {
          method: "PUT",
          body: JSON.stringify(parsed.data),
        }
      )

    revalidateTelegramConfiguration()

    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error: getActionError(error, dictionary.telegram.schedule.updateError),
    }
  }
}

export async function disableTelegramMarketAnalysisSchedule(
  id: number
): Promise<ActionResult<TelegramMarketAnalysisScheduleResponse>> {
  const dictionary = await getTelegramDictionary()

  try {
    const data =
      await fetchAuthenticated<TelegramMarketAnalysisScheduleResponse>(
        `/telegram/market-analysis-schedules/${id}/disable`,
        {
          method: "PATCH",
        }
      )

    revalidateTelegramConfiguration()

    return { success: true, data }
  } catch (error: unknown) {
    return {
      success: false,
      error: getActionError(error, dictionary.telegram.schedule.pauseError),
    }
  }
}

export async function deleteTelegramMarketAnalysisSchedule(
  id: number
): Promise<ActionResult> {
  const dictionary = await getTelegramDictionary()

  try {
    await fetchAuthenticated<void>(
      `/telegram/market-analysis-schedules/${id}`,
      {
        method: "DELETE",
      }
    )

    revalidateTelegramConfiguration()

    return { success: true, data: undefined }
  } catch (error: unknown) {
    return {
      success: false,
      error: getActionError(error, dictionary.telegram.schedule.deleteError),
    }
  }
}
