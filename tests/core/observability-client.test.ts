// @vitest-environment jsdom

import { describe, expect, it, vi } from "vitest"

import { createClientPerformanceAdapter } from "@/app/lib/observability/client"

describe("client performance adapter", () => {
  it("records local marks and an approved rounded event when enabled", () => {
    const mark = vi.fn()
    const measure = vi.fn()
    const report = vi.fn()
    const times = [10.2, 22.8]
    const start = createClientPerformanceAdapter({
      eventsEnabled: true,
      mark,
      measure,
      now: () => times.shift() ?? 22.8,
      report,
    })

    const measurement = start("signapse.market_assistant.submit", {
      "conversation.kind": "new",
      conversation_id: "conversation-secret",
      prompt: "private prompt",
    })
    measurement.finish("success")
    measurement.finish("error")

    expect(mark).toHaveBeenCalledTimes(2)
    expect(measure).toHaveBeenCalledOnce()
    expect(report).toHaveBeenCalledWith("signapse.market_assistant.submit", {
      operation: "signapse.market_assistant.submit",
      outcome: "success",
      duration_ms: 13,
      "conversation.kind": "new",
    })
  })

  it("keeps local entries and skips delivery when disabled", () => {
    const measure = vi.fn()
    const report = vi.fn()
    const start = createClientPerformanceAdapter({
      eventsEnabled: false,
      mark: vi.fn(),
      measure,
      report,
    })

    start("signapse.market_chart.initial_load").finish("success")

    expect(measure).toHaveBeenCalledOnce()
    expect(report).not.toHaveBeenCalled()
  })

  it("fails open when Performance APIs are unsupported or reporting throws", () => {
    const start = createClientPerformanceAdapter({
      eventsEnabled: true,
      mark: () => {
        throw new Error("unsupported")
      },
      measure: () => {
        throw new Error("unsupported")
      },
      now: () => {
        throw new Error("unsupported")
      },
      report: () => {
        throw new Error("reporting failed")
      },
    })

    expect(() =>
      start("signapse.market_chart.live_connect").finish("network_error")
    ).not.toThrow()
  })
})
