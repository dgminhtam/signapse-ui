import { afterEach, describe, expect, it, vi } from "vitest"

import {
  registerServerTelemetry,
  resolveTraceSampler,
  sanitizeExportedSpan,
} from "@/app/lib/observability/instrumentation"

afterEach(() => {
  vi.unstubAllEnvs()
})

describe("server telemetry registration", () => {
  it("registers the stable service with privacy-first processors", () => {
    vi.stubEnv("SIGNAPSE_TELEMETRY_ENABLED", "true")
    vi.stubEnv("SIGNAPSE_AUTH_MODE", "")
    const register = vi.fn()

    expect(registerServerTelemetry(register)).toBe(true)
    expect(register).toHaveBeenCalledWith(
      expect.objectContaining({
        serviceName: "signapse-ui",
        instrumentations: [],
        propagators: ["tracecontext"],
        traceSampler: "parentbased_always_on",
      })
    )
    expect(process.env.NEXT_OTEL_FETCH_DISABLED).toBe("1")
  })

  it("does not register when disabled or in fixture mode", () => {
    const register = vi.fn()
    vi.stubEnv("SIGNAPSE_TELEMETRY_ENABLED", "false")
    expect(registerServerTelemetry(register)).toBe(false)

    vi.stubEnv("SIGNAPSE_TELEMETRY_ENABLED", "true")
    vi.stubEnv("SIGNAPSE_AUTH_MODE", "disabled")
    vi.stubEnv("SIGNAPSE_E2E_MODE", "fixture")
    vi.stubEnv("NODE_ENV", "test")
    expect(registerServerTelemetry(register)).toBe(false)
    expect(register).not.toHaveBeenCalled()
  })

  it("fails open when registration throws", () => {
    vi.stubEnv("SIGNAPSE_TELEMETRY_ENABLED", "true")
    vi.stubEnv("SIGNAPSE_AUTH_MODE", "")

    expect(
      registerServerTelemetry(() => {
        throw new Error("exporter unavailable")
      })
    ).toBe(false)
  })

  it.each([
    [{}, "parentbased_always_on"],
    [{ OTEL_TRACES_SAMPLER: "always_on" }, "parentbased_always_on"],
    [{ OTEL_TRACES_SAMPLER: "always_off" }, "parentbased_always_off"],
    [
      {
        OTEL_TRACES_SAMPLER: "traceidratio",
        OTEL_TRACES_SAMPLER_ARG: "0.25",
      },
      "parentbased_traceidratio",
    ],
    [
      {
        OTEL_TRACES_SAMPLER: "traceidratio",
        OTEL_TRACES_SAMPLER_ARG: "2",
      },
      "parentbased_always_off",
    ],
    [{ OTEL_TRACES_SAMPLER: "invalid" }, "parentbased_always_off"],
  ] as const)(
    "maps standard sampler configuration %#",
    (environment, expected) => {
      expect(resolveTraceSampler(environment)).toBe(expected)
    }
  )
})

describe("export privacy", () => {
  it("removes sensitive framework names, URL/query attributes, events, and links", () => {
    vi.stubEnv("VERCEL_ENV", "preview")
    const span = {
      name: "GET https://app.test/users/user-secret?token=query-secret",
      attributes: {
        "http.method": "GET",
        "http.target": "/users/user-secret?token=query-secret",
        "http.url": "https://app.test/users/user-secret?token=query-secret",
        "next.span_type": "BaseServer.handleRequest",
        authorization: "Bearer header-secret",
        prompt: "private prompt",
      },
      status: { message: "remote payload secret" },
      events: [{ attributes: { "exception.message": "payload secret" } }],
      links: [{ attributes: { user_id: "user-secret" } }],
    }

    sanitizeExportedSpan(span)

    expect(span.name).toBe("next.request")
    expect(span.attributes).toEqual({
      operation: "next.request",
      method: "GET",
      route: "/users/:id",
      environment: "preview",
    })
    expect(span.status).toEqual({})
    expect(span.events).toEqual([])
    expect(span.links).toEqual([{ attributes: {} }])
    expect(JSON.stringify(span)).not.toMatch(
      /user-secret|query-secret|header-secret|private prompt|payload secret/
    )
  })
})
