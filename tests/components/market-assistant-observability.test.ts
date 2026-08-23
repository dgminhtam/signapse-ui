// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest"

import { startAssistantSubmitMeasurement } from "@/components/market-conversation-assistant/assistant-observability"
import type { ClientPerformanceMeasurement } from "@/app/lib/observability/client"

describe("Market Assistant submit observability", () => {
  it.each(["new", "existing"] as const)(
    "classifies a %s conversation without exposing content or identity",
    (conversationKind) => {
      const finish = vi.fn()
      const start = vi.fn((): ClientPerformanceMeasurement => ({ finish }))

      const measurement = startAssistantSubmitMeasurement(
        conversationKind,
        start
      )
      measurement.finish("success")

      expect(start).toHaveBeenCalledWith("signapse.market_assistant.submit", {
        feature: "market_assistant",
        "conversation.kind": conversationKind,
      })
      expect(finish).toHaveBeenCalledWith("success")
      expect(JSON.stringify(start.mock.calls)).not.toMatch(
        /conversationId|message|prompt|reveal|motion/
      )
    }
  )

  it("keeps failure and stale outcomes at the same seam", () => {
    const finishes: string[] = []
    const start = vi.fn((): ClientPerformanceMeasurement => ({
      finish(outcome) {
        finishes.push(outcome)
      },
    }))

    startAssistantSubmitMeasurement("new", start).finish("error")
    startAssistantSubmitMeasurement("existing", start).finish("stale")

    expect(finishes).toEqual(["error", "stale"])
  })
})
