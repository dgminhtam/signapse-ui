import { beforeEach, describe, expect, it, afterEach, vi } from "vitest"

vi.mock("@clerk/nextjs/server", () => ({
  auth: vi.fn(),
}))

const { testDictionary } = vi.hoisted(() => ({
  testDictionary: {
    errors: {
      generic: "Generic transport error",
      missingApiBaseUrl: "Missing API base URL",
      missingToken: "Missing authentication token",
      unauthenticated: "Authentication required",
    },
  },
}))

vi.mock("@/app/lib/i18n/dictionaries", () => ({
  getDictionary: vi.fn(async () => testDictionary),
}))

vi.mock("@/app/lib/i18n/server", () => ({
  getRequestLocale: vi.fn(async () => "vi"),
}))

import { auth } from "@clerk/nextjs/server"
import {
  fetchAuthenticated,
  fetchPublic,
  getBackendAuthHeaders,
  getClerkToken,
} from "@/app/api/auth/action"

describe("authenticated transport", () => {
  let fetchMock: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.stubEnv("API_BASE_URL", "https://api.example.test")
    vi.stubEnv("SIGNAPSE_AUTH_MODE", "")
    fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  it("adds deterministic default headers and parses successful JSON", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ enabled: true }), { status: 200 })
    )

    await expect(fetchPublic<{ enabled: boolean }>("/config")).resolves.toEqual(
      {
        enabled: true,
      }
    )

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe("https://api.example.test/config")
    expect(options.method).toBe("GET")
    expect(options.cache).toBe("no-store")
    expect(options.headers).toEqual({
      Accept: "application/json",
      "Accept-Language": "vi",
    })
    expect(options.signal).toBeInstanceOf(AbortSignal)
  })

  it("handles empty success responses and missing configuration", async () => {
    fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }))
    await expect(fetchPublic("/empty")).resolves.toBeNull()

    fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }))
    await expect(fetchPublic("/empty-body")).resolves.toBeNull()

    vi.stubEnv("API_BASE_URL", "")
    await expect(fetchPublic("/config")).rejects.toThrow(
      testDictionary.errors.missingApiBaseUrl
    )
  })

  it("preserves localized API error messages and not-found status", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ message: "Rejected by backend" }), {
        status: 422,
      })
    )
    await expect(fetchPublic("/invalid")).rejects.toMatchObject({
      message: "Rejected by backend",
      status: 422,
    })

    fetchMock.mockResolvedValueOnce(new Response("Not Found", { status: 404 }))
    await expect(fetchPublic("/missing")).rejects.toMatchObject({
      message: "Not Found",
      status: 404,
    })
  })

  it("aborts a request after the transport timeout", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {})
    vi.useFakeTimers()
    fetchMock.mockImplementation(
      (_input: RequestInfo | URL, options?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          options?.signal?.addEventListener("abort", () => {
            reject(new DOMException("The operation was aborted", "AbortError"))
          })
        })
    )

    const pending = fetchPublic("/slow")
    const rejection = expect(pending).rejects.toThrow(
      "The operation was aborted"
    )
    await vi.advanceTimersByTimeAsync(60_000)

    await rejection
  })

  it("requires a Clerk user and token before sending authenticated requests", async () => {
    const getToken = vi.fn().mockResolvedValue("token-123")
    vi.mocked(auth).mockResolvedValue({
      getToken,
      userId: "user-123",
    } as unknown as Awaited<ReturnType<typeof auth>>)

    await expect(getClerkToken()).resolves.toBe("token-123")
    await expect(getBackendAuthHeaders()).resolves.toEqual({
      Authorization: "Bearer token-123",
    })

    fetchMock.mockResolvedValue(new Response(JSON.stringify({ ok: true })))
    await fetchAuthenticated("/protected", {
      headers: { "X-Test": "yes" },
    })

    const [, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(options.headers).toEqual({
      Accept: "application/json",
      "Accept-Language": "vi",
      Authorization: "Bearer token-123",
      "X-Test": "yes",
    })
    expect(getToken).toHaveBeenCalledWith({ template: "signapse" })
  })

  it("returns localized authentication errors for absent user or token", async () => {
    vi.mocked(auth).mockResolvedValue({
      getToken: vi.fn(),
      userId: null,
    } as unknown as Awaited<ReturnType<typeof auth>>)
    await expect(getClerkToken()).rejects.toThrow(
      testDictionary.errors.unauthenticated
    )

    vi.mocked(auth).mockResolvedValue({
      getToken: vi.fn().mockResolvedValue(null),
      userId: "user-123",
    } as unknown as Awaited<ReturnType<typeof auth>>)
    await expect(getClerkToken()).rejects.toThrow(
      testDictionary.errors.missingToken
    )
  })
})
