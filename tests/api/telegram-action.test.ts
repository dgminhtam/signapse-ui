import { beforeEach, describe, expect, it, vi } from "vitest"

const { testDictionary } = vi.hoisted(() => ({
  testDictionary: {
    telegram: {
      validationInvalid: "Telegram validation failed",
      scheduleNameRequired: "Schedule name is required",
      localTimeInvalid: "Local time is invalid",
      outputLanguageRequired: "Output language is required",
      outputLanguageUnsupported: "Output language is unsupported",
      timezoneRequired: "Timezone is required",
      timezoneInvalid: "Timezone is invalid",
      localTimeRequired: "At least one local time is required",
      localTimeLimit: "Too many local times",
      localTimeDuplicate: "Local times must be unique",
      schedule: {
        languageCatalogError: "Language catalog unavailable",
        createError: "Schedule create failed",
        updateError: "Schedule update failed",
        disableError: "Schedule disable failed",
        deleteError: "Schedule delete failed",
      },
    },
  },
}))

vi.mock("@/app/api/auth/action", () => ({
  fetchAuthenticated: vi.fn(),
}))

vi.mock("@/app/api/languages/action", () => ({
  getLanguages: vi.fn(),
}))

vi.mock("@/app/lib/i18n/dictionaries", () => ({
  getDictionary: vi.fn(async () => testDictionary),
}))

vi.mock("@/app/lib/i18n/server", () => ({
  getRequestLocale: vi.fn(async () => "vi"),
}))

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}))

import { fetchAuthenticated } from "@/app/api/auth/action"
import { getLanguages } from "@/app/api/languages/action"
import {
  createTelegramMarketAnalysisSchedule,
  deleteTelegramMarketAnalysisSchedule,
  disableTelegramMarketAnalysisSchedule,
  updateTelegramMarketAnalysisSchedule,
} from "@/app/api/telegram/action"
import { revalidatePath } from "next/cache"
import type { SaveTelegramMarketAnalysisScheduleRequest } from "@/app/lib/telegram/definitions"

const scheduleRequest = (): SaveTelegramMarketAnalysisScheduleRequest => ({
  name: "  Morning analysis ",
  workspaceId: 7,
  destinationId: 8,
  assetId: 9,
  timezone: " Asia/Bangkok ",
  localTimes: ["18:00", "09:00"],
  outputLanguageIsoCode: "en",
})

const scheduleResponse = {
  id: 11,
  name: "Morning analysis",
  workspaceId: 7,
  timezone: "Asia/Bangkok",
  localTimes: ["09:00", "18:00"],
  status: "ACTIVE" as const,
}

describe("Telegram scheduled asset analysis actions", () => {
  beforeEach(() => {
    vi.mocked(fetchAuthenticated).mockReset()
    vi.mocked(getLanguages).mockReset()
    vi.mocked(revalidatePath).mockClear()
    vi.mocked(getLanguages).mockResolvedValue({
      languages: [{ id: 1, isoCode: "en", name: "English" }],
    })
  })

  it("creates and updates schedules with normalized request bodies", async () => {
    vi.mocked(fetchAuthenticated).mockResolvedValue(scheduleResponse)

    const created =
      await createTelegramMarketAnalysisSchedule(scheduleRequest())
    expect(created).toEqual({ success: true, data: scheduleResponse })
    expect(fetchAuthenticated).toHaveBeenCalledWith(
      "/telegram/market-analysis-schedules",
      {
        method: "POST",
        body: JSON.stringify({
          name: "Morning analysis",
          workspaceId: 7,
          destinationId: 8,
          assetId: 9,
          timezone: "Asia/Bangkok",
          localTimes: ["09:00", "18:00"],
          outputLanguageIsoCode: "en",
        }),
      }
    )
    expect(revalidatePath).toHaveBeenCalledWith("/telegram")

    vi.mocked(fetchAuthenticated).mockClear()
    vi.mocked(revalidatePath).mockClear()
    const updated = await updateTelegramMarketAnalysisSchedule(
      11,
      scheduleRequest()
    )
    expect(updated).toEqual({ success: true, data: scheduleResponse })
    expect(fetchAuthenticated).toHaveBeenCalledWith(
      "/telegram/market-analysis-schedules/11",
      expect.objectContaining({ method: "PUT" })
    )
    expect(revalidatePath).toHaveBeenCalledWith("/telegram")
  })

  it("disables and deletes schedules through their mutation endpoints", async () => {
    vi.mocked(fetchAuthenticated).mockResolvedValue(scheduleResponse)

    await expect(disableTelegramMarketAnalysisSchedule(11)).resolves.toEqual({
      success: true,
      data: scheduleResponse,
    })
    expect(fetchAuthenticated).toHaveBeenCalledWith(
      "/telegram/market-analysis-schedules/11/disable",
      { method: "PATCH" }
    )

    vi.mocked(fetchAuthenticated).mockResolvedValue(undefined)
    await expect(deleteTelegramMarketAnalysisSchedule(11)).resolves.toEqual({
      success: true,
      data: undefined,
    })
    expect(fetchAuthenticated).toHaveBeenCalledWith(
      "/telegram/market-analysis-schedules/11",
      { method: "DELETE" }
    )
    expect(revalidatePath).toHaveBeenCalledTimes(2)
  })

  it("returns localized validation errors and recovers backend failures", async () => {
    const invalid = await createTelegramMarketAnalysisSchedule({
      ...scheduleRequest(),
      name: "",
    })
    expect(invalid).toEqual({
      success: false,
      error: testDictionary.telegram.scheduleNameRequired,
    })
    expect(fetchAuthenticated).not.toHaveBeenCalled()

    vi.mocked(fetchAuthenticated).mockRejectedValue(
      new Error("Backend unavailable")
    )
    const failed = await updateTelegramMarketAnalysisSchedule(
      11,
      scheduleRequest()
    )
    expect(failed).toEqual({ success: false, error: "Backend unavailable" })
    expect(revalidatePath).not.toHaveBeenCalled()
  })
})
