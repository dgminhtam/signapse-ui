import { describe, expect, it } from "vitest"

import { en } from "@/app/lib/i18n/dictionaries/en"
import {
  deriveMarketConversationTitle,
  getMarketQueryRequestSchema,
  getSubmitMarketConversationMessageSchema,
  marketConversationMessagePageResponseSchema,
  normalizeMarketConversationMessages,
  reconcileMarketConversationMessages,
} from "@/app/lib/market-query/definitions"
import {
  getSaveTelegramMarketAnalysisScheduleSchema,
  normalizeSaveTelegramMarketAnalysisScheduleRequest,
  type SaveTelegramMarketAnalysisScheduleRequest,
} from "@/app/lib/telegram/definitions"

describe("Telegram schedule contract", () => {
  it("coerces and validates a supported normalized schedule", () => {
    const result = getSaveTelegramMarketAnalysisScheduleSchema(en, [
      "en",
      "vi",
    ]).safeParse({
      name: "  Morning analysis ",
      workspaceId: "7",
      destinationId: "8",
      assetId: "9",
      timezone: " Asia/Bangkok ",
      localTimes: [" 09:30 ", "16:00"],
      outputLanguageIsoCode: " en ",
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data).toMatchObject({
        workspaceId: 7,
        destinationId: 8,
        assetId: 9,
        timezone: "Asia/Bangkok",
        outputLanguageIsoCode: "en",
      })
    }
  })

  it("rejects invalid, duplicate, and unsupported schedule values", () => {
    const result = getSaveTelegramMarketAnalysisScheduleSchema(en, [
      "en",
    ]).safeParse({
      name: "",
      workspaceId: 0,
      destinationId: 2,
      assetId: 3,
      timezone: "Not/A/Timezone",
      localTimes: ["09:30", "09:30", "25:00"],
      outputLanguageIsoCode: "vi",
    })

    expect(result.success).toBe(false)
    if (!result.success) {
      const messages = result.error.issues.map((issue) => issue.message)
      expect(messages).toContain(en.telegram.localTimeDuplicate)
      expect(messages).toContain(en.telegram.outputLanguageUnsupported)
    }
  })

  it("normalizes whitespace and time ordering without mutating the input", () => {
    const request: SaveTelegramMarketAnalysisScheduleRequest = {
      name: "  Evening ",
      workspaceId: 7,
      destinationId: 8,
      assetId: 9,
      timezone: " Asia/Bangkok ",
      localTimes: [" 18:00 ", "09:30"],
      outputLanguageIsoCode: " en ",
    }

    expect(normalizeSaveTelegramMarketAnalysisScheduleRequest(request)).toEqual(
      {
        ...request,
        name: "Evening",
        timezone: "Asia/Bangkok",
        localTimes: ["09:30", "18:00"],
        outputLanguageIsoCode: "en",
      }
    )
    expect(request.localTimes).toEqual([" 18:00 ", "09:30"])
  })
})

describe("market-query contract", () => {
  it("trims questions and rejects empty or malformed request values", () => {
    const valid = getMarketQueryRequestSchema(en).safeParse({
      question: "  What moved gold? ",
      asOfTime: "2026-07-29T00:00:00.000Z",
    })
    const empty = getMarketQueryRequestSchema(en).safeParse({ question: "   " })
    const malformed = getMarketQueryRequestSchema(en).safeParse({
      question: "question",
      asOfTime: "yesterday",
    })

    expect(valid.success && valid.data.question).toBe("What moved gold?")
    expect(empty.success).toBe(false)
    expect(malformed.success).toBe(false)
  })

  it("normalizes conversation messages and validates history cursors", () => {
    const message = (id: number, content: string) => ({
      id,
      role: "USER" as const,
      status: "COMPLETED" as const,
      content,
      failureReason: null,
      createdDate: "2026-07-29T00:00:00.000Z",
    })
    const first = message(1, "first")
    const stale = message(2, "stale")
    const updated = message(2, "updated")

    expect(
      normalizeMarketConversationMessages([stale, first]).map(({ id }) => id)
    ).toEqual([1, 2])
    expect(
      reconcileMarketConversationMessages([first, stale], [updated]).map(
        ({ content }) => content
      )
    ).toEqual(["first", "updated"])
    expect(deriveMarketConversationTitle("  too   many   spaces ", 20)).toBe(
      "too many spaces"
    )
    expect(deriveMarketConversationTitle("abcdefghij", 6)).toBe("abc...")

    expect(
      marketConversationMessagePageResponseSchema.safeParse({
        content: [first],
        hasMore: true,
      }).success
    ).toBe(false)
    expect(
      marketConversationMessagePageResponseSchema.safeParse({
        content: [first],
        hasMore: true,
        nextBeforeMessageId: 1,
      }).success
    ).toBe(true)
  })

  it("requires a non-empty submitted message", () => {
    expect(
      getSubmitMarketConversationMessageSchema(en).safeParse({ message: "  " })
        .success
    ).toBe(false)
    expect(
      getSubmitMarketConversationMessageSchema(en).safeParse({
        message: "  hello ",
      }).success
    ).toBe(true)
  })
})
