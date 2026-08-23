import { describe, expect, it, vi } from "vitest"

import { observeDashboardLoad } from "@/app/lib/observability/journeys"

describe("priority server journeys", () => {
  it("wraps Dashboard assembly and preserves its result", async () => {
    const result = "dashboard-result"
    const observe = vi.fn(async (_operation, _attributes, work) => work({}))

    await expect(
      observeDashboardLoad(
        async () => result,
        observe as Parameters<typeof observeDashboardLoad>[1]
      )
    ).resolves.toBe(result)
    expect(observe).toHaveBeenCalledWith(
      "signapse.dashboard.load",
      { feature: "dashboard" },
      expect.any(Function)
    )
  })

  it("preserves Dashboard assembly failures", async () => {
    const error = new Error("workspace action failed")
    const observe = vi.fn(async (_operation, _attributes, work) => work({}))

    await expect(
      observeDashboardLoad(
        async () => {
          throw error
        },
        observe as Parameters<typeof observeDashboardLoad>[1]
      )
    ).rejects.toBe(error)
  })
})
