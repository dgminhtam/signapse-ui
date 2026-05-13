"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"

import { fetchAuthenticated } from "@/app/api/auth/action"
import { ActionResult } from "@/app/lib/definitions"
import {
  createTelegramBotConnectionSchema,
  createTelegramLinkTokenSchema,
  CreateTelegramBotConnectionRequest,
  CreateTelegramLinkTokenRequest,
  saveTelegramMarketAnalysisScheduleSchema,
  SaveTelegramMarketAnalysisScheduleRequest,
  TelegramBotConnectionResponse,
  TelegramDestinationResponse,
  TelegramFeatureSettingResponse,
  TelegramLinkTokenResponse,
  TelegramMarketAnalysisScheduleResponse,
  updateTelegramBotConnectionSchema,
  UpdateTelegramBotConnectionRequest,
  updateTelegramDestinationSchema,
  UpdateTelegramDestinationRequest,
  updateTelegramFeatureSettingSchema,
  UpdateTelegramFeatureSettingRequest,
} from "@/app/lib/telegram/definitions"

function getValidationError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Dữ liệu Telegram không hợp lệ."
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
  const parsed = createTelegramBotConnectionSchema.safeParse(request)

  if (!parsed.success) {
    return { success: false, error: getValidationError(parsed.error) }
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
      error: getActionError(error, "Không thể kết nối bot Telegram."),
    }
  }
}

export async function updateTelegramBotConnection(
  id: number,
  request: UpdateTelegramBotConnectionRequest
): Promise<ActionResult<TelegramBotConnectionResponse>> {
  const parsed = updateTelegramBotConnectionSchema.safeParse(request)

  if (!parsed.success) {
    return { success: false, error: getValidationError(parsed.error) }
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
      error: getActionError(error, "Không thể cập nhật bot Telegram."),
    }
  }
}

export async function disableTelegramBotConnection(
  id: number
): Promise<ActionResult<TelegramBotConnectionResponse>> {
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
      error: getActionError(error, "Không thể tạm dừng bot Telegram."),
    }
  }
}

export async function deleteTelegramBotConnection(
  id: number
): Promise<ActionResult> {
  try {
    await fetchAuthenticated<void>(`/telegram/bot-connections/${id}`, {
      method: "DELETE",
    })

    revalidateTelegramConfiguration()

    return { success: true, data: undefined }
  } catch (error: unknown) {
    return {
      success: false,
      error: getActionError(error, "Không thể xóa bot Telegram."),
    }
  }
}

export async function createTelegramLinkToken(
  request: CreateTelegramLinkTokenRequest
): Promise<ActionResult<TelegramLinkTokenResponse>> {
  const parsed = createTelegramLinkTokenSchema.safeParse(request)

  if (!parsed.success) {
    return { success: false, error: getValidationError(parsed.error) }
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
      error: getActionError(error, "Không thể tạo lệnh liên kết Telegram."),
    }
  }
}

export async function updateTelegramDestination(
  id: number,
  request: UpdateTelegramDestinationRequest
): Promise<ActionResult<TelegramDestinationResponse>> {
  const parsed = updateTelegramDestinationSchema.safeParse(request)

  if (!parsed.success) {
    return { success: false, error: getValidationError(parsed.error) }
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
      error: getActionError(error, "Không thể cập nhật điểm nhận Telegram."),
    }
  }
}

export async function disableTelegramDestination(
  id: number
): Promise<ActionResult<TelegramDestinationResponse>> {
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
      error: getActionError(error, "Không thể tạm dừng điểm nhận Telegram."),
    }
  }
}

export async function deleteTelegramDestination(
  id: number
): Promise<ActionResult> {
  try {
    await fetchAuthenticated<void>(`/telegram/destinations/${id}`, {
      method: "DELETE",
    })

    revalidateTelegramConfiguration()

    return { success: true, data: undefined }
  } catch (error: unknown) {
    return {
      success: false,
      error: getActionError(error, "Không thể xóa điểm nhận Telegram."),
    }
  }
}

export async function updateTelegramFeatureSetting(
  request: UpdateTelegramFeatureSettingRequest
): Promise<ActionResult<TelegramFeatureSettingResponse>> {
  const parsed = updateTelegramFeatureSettingSchema.safeParse(request)

  if (!parsed.success) {
    return { success: false, error: getValidationError(parsed.error) }
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
      error: getActionError(error, "Không thể cập nhật định tuyến Telegram."),
    }
  }
}

export async function createTelegramMarketAnalysisSchedule(
  request: SaveTelegramMarketAnalysisScheduleRequest
): Promise<ActionResult<TelegramMarketAnalysisScheduleResponse>> {
  const parsed = saveTelegramMarketAnalysisScheduleSchema.safeParse(request)

  if (!parsed.success) {
    return { success: false, error: getValidationError(parsed.error) }
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
      error: getActionError(error, "Không thể tạo lịch phân tích Telegram."),
    }
  }
}

export async function updateTelegramMarketAnalysisSchedule(
  id: number,
  request: SaveTelegramMarketAnalysisScheduleRequest
): Promise<ActionResult<TelegramMarketAnalysisScheduleResponse>> {
  const parsed = saveTelegramMarketAnalysisScheduleSchema.safeParse(request)

  if (!parsed.success) {
    return { success: false, error: getValidationError(parsed.error) }
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
      error: getActionError(error, "Không thể cập nhật lịch phân tích Telegram."),
    }
  }
}

export async function disableTelegramMarketAnalysisSchedule(
  id: number
): Promise<ActionResult<TelegramMarketAnalysisScheduleResponse>> {
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
      error: getActionError(error, "Không thể tạm dừng lịch phân tích Telegram."),
    }
  }
}

export async function deleteTelegramMarketAnalysisSchedule(
  id: number
): Promise<ActionResult> {
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
      error: getActionError(error, "Không thể xóa lịch phân tích Telegram."),
    }
  }
}
