import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

vi.mock("@/app/api/auth/action", () => ({
  getBackendAuthHeaders: vi.fn(async () => ({ Authorization: "Bearer test" })),
}))
vi.mock("@/app/lib/i18n/server", () => ({
  getRequestLocale: vi.fn(async () => "en"),
}))
vi.mock("@/app/lib/observability/server", () => ({
  injectTraceContextForBackend: vi.fn(),
}))

import { proxyFeedbackScreenshot } from "@/app/api/feedback/screenshot"

describe("feedback screenshot proxy routes", () => {
  beforeEach(() => {
    vi.stubEnv("API_BASE_URL", "https://api.example.test")
    vi.stubGlobal("fetch", vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  it("uses the personal scope and returns normalized inline image headers", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(new Uint8Array([1, 2, 3]), {
        status: 200,
        headers: { "content-type": "image/png" },
      })
    )
    const request = new Request("https://app.example.test/api/feedback/personal/42/screenshot") as unknown as import("next/server").NextRequest
    const response = await proxyFeedbackScreenshot(request, "42", "personal")

    expect(response.status).toBe(200)
    expect(response.headers.get("Content-Type")).toBe("image/png")
    expect(response.headers.get("Content-Disposition")).toBe("inline")
    expect(response.headers.get("Cache-Control")).toBe("private, no-store")
    expect(response.headers.get("X-Content-Type-Options")).toBe("nosniff")
    expect(response.headers.get("ETag")).toBeNull()
    expect(String(vi.mocked(fetch).mock.calls[0]?.[0])).toBe(
      "https://api.example.test/me/feedback-submissions/42/screenshot"
    )
  })

  it("uses moderation scope and isolates missing or storage failures", async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce(new Response(null, { status: 404 }))
      .mockRejectedValueOnce(new Error("private storage detail"))
    const request = new Request("https://app.example.test/screenshot") as unknown as import("next/server").NextRequest

    await expect(
      proxyFeedbackScreenshot(request, "7", "moderation")
    ).resolves.toMatchObject({ status: 404 })
    await expect(
      proxyFeedbackScreenshot(request, "7", "moderation")
    ).resolves.toMatchObject({ status: 502 })
    expect(String(vi.mocked(fetch).mock.calls[0]?.[0])).toBe(
      "https://api.example.test/feedback-submissions/7/screenshot"
    )
  })

  it("rejects invalid IDs and unexpected upstream MIME without exposing bytes", async () => {
    const request = new Request("https://app.example.test/screenshot") as unknown as import("next/server").NextRequest
    await expect(
      proxyFeedbackScreenshot(request, "not-an-id", "personal")
    ).resolves.toMatchObject({ status: 404 })
    expect(fetch).not.toHaveBeenCalled()

    vi.mocked(fetch).mockResolvedValue(
      new Response(new Uint8Array([1]), {
        status: 200,
        headers: { "content-type": "application/octet-stream" },
      })
    )
    await expect(
      proxyFeedbackScreenshot(request, "8", "personal")
    ).resolves.toMatchObject({ status: 502 })
  })
})
