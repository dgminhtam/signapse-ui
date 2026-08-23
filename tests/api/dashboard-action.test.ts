import { describe, expect, it, vi } from "vitest"

vi.mock("@/app/api/auth/action", () => ({
  fetchAuthenticated: vi.fn(async () => ({
    authorization: "Bearer secret",
    prompt: "private prompt",
    workspaceId: 987654,
  })),
}))

vi.mock("@/app/lib/i18n/dictionaries", () => ({
  getDictionary: vi.fn(async () => ({
    workspaceOverview: {
      tradingSnapshot: {
        summaryErrorDescription: "Localized dashboard response error",
      },
    },
  })),
}))

vi.mock("@/app/lib/i18n/server", () => ({
  getRequestLocale: vi.fn(async () => "vi"),
}))

import { getDashboardSummary } from "@/app/api/dashboard/action"

describe("dashboard action observability", () => {
  it("keeps the localized error and emits only bounded validation metadata", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {})

    await expect(getDashboardSummary()).rejects.toThrow(
      "Localized dashboard response error"
    )

    const diagnostic = String(consoleError.mock.calls[0]?.[0])
    expect(diagnostic).toContain('"operation":"signapse.dashboard.load"')
    expect(diagnostic).toContain('"outcome":"validation_error"')
    expect(diagnostic).toContain('"validation.issue_count"')
    expect(diagnostic).not.toMatch(
      /Bearer secret|private prompt|987654|authorization|workspaceId/
    )
  })
})
