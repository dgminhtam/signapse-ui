import { SpanStatusCode } from "@opentelemetry/api"
import { describe, expect, it, vi } from "vitest"

import { createServerObservabilityAdapter } from "@/app/lib/observability/server"
import { propagation } from "@opentelemetry/api"
import { injectTraceContextForBackend } from "@/app/lib/observability/server"

function createRecordingFixture() {
  const attributes: Record<string, unknown>[] = []
  const statuses: { code: SpanStatusCode }[] = []
  const diagnostics: Record<string, unknown>[] = []
  const end = vi.fn()
  const span = {
    end,
    setAttributes: (value: Record<string, unknown>) => attributes.push(value),
    setStatus: (value: { code: SpanStatusCode }) => statuses.push(value),
    spanContext: () => ({ traceId: "a".repeat(32) }),
  }
  const tracer = {
    startActiveSpan: async <T>(
      _name: string,
      _options: unknown,
      callback: (activeSpan: typeof span) => Promise<T>
    ) => callback(span),
  }
  let now = 10
  const observe = createServerObservabilityAdapter({
    getActiveTraceId: () => "a".repeat(32),
    getTracer: () => tracer,
    now: () => now++,
    writeDiagnostic: (record) => diagnostics.push(record),
  })

  return { attributes, diagnostics, end, observe, statuses }
}

describe("server observability adapter", () => {
  it("records terminal success and preserves the wrapped result", async () => {
    const fixture = createRecordingFixture()

    await expect(
      fixture.observe(
        "signapse.dashboard.load",
        { feature: "dashboard" },
        async () => Promise.resolve("result")
      )
    ).resolves.toBe("result")

    expect(fixture.attributes.at(-1)).toMatchObject({
      operation: "signapse.dashboard.load",
      feature: "dashboard",
      outcome: "success",
    })
    expect(fixture.statuses).toEqual([{ code: SpanStatusCode.OK }])
    expect(fixture.end).toHaveBeenCalledOnce()
  })

  it.each([
    ["timeout", "timeout"],
    ["cancelled", "abort"],
  ] as const)(
    "records %s failures without serializing errors",
    async (outcome, errorType) => {
      const fixture = createRecordingFixture()
      const originalError = new Error("private remote response")

      await expect(
        fixture.observe("signapse.backend.request", {}, async (controller) => {
          controller.setOutcome(outcome)
          controller.reportFailure(errorType, {
            authorization: "Bearer secret",
          })
          throw originalError
        })
      ).rejects.toBe(originalError)

      expect(fixture.diagnostics[0]).toMatchObject({
        operation: "signapse.backend.request",
        "error.type": errorType,
        trace_id: "a".repeat(32),
      })
      expect(JSON.stringify(fixture.diagnostics)).not.toContain(
        "private remote response"
      )
      expect(JSON.stringify(fixture.diagnostics)).not.toContain("Bearer secret")
    }
  )

  it("omits missing trace context", async () => {
    const fixture = createRecordingFixture()
    const observe = createServerObservabilityAdapter({
      getActiveTraceId: () => undefined,
      getTracer: () => ({
        startActiveSpan: async (_name, _options, callback) =>
          callback({
            end() {},
            setAttributes() {},
            setStatus() {},
            spanContext: () => ({ traceId: "" }),
          }),
      }),
      writeDiagnostic: (record) => fixture.diagnostics.push(record),
    })

    await observe("signapse.backend.request", {}, async (controller) => {
      controller.reportFailure("network")
    })

    expect(fixture.diagnostics[0]).not.toHaveProperty("trace_id")
  })

  it("fails open when tracing and diagnostics fail", async () => {
    const originalError = new Error("application error")
    const observe = createServerObservabilityAdapter({
      getTracer: () => {
        throw new Error("tracer unavailable")
      },
      writeDiagnostic: () => {
        throw new Error("logger unavailable")
      },
    })

    await expect(
      observe("signapse.backend.request", {}, async (controller) => {
        controller.reportFailure("unknown")
        throw originalError
      })
    ).rejects.toBe(originalError)
  })

  it("preserves a successful result when the tracer fails after the callback", async () => {
    const observe = createServerObservabilityAdapter({
      getTracer: () => ({
        async startActiveSpan(_name, _options, callback) {
          await callback({
            end() {},
            setAttributes() {},
            setStatus() {},
            spanContext: () => ({ traceId: "a".repeat(32) }),
          })
          throw new Error("late exporter failure")
        },
      }),
    })

    await expect(
      observe("signapse.dashboard.load", {}, async () => "application result")
    ).resolves.toBe("application result")
  })

  it("fails open when clock and active trace lookup fail", async () => {
    const diagnostics: Record<string, unknown>[] = []
    const observe = createServerObservabilityAdapter({
      getActiveTraceId: () => {
        throw new Error("context unavailable")
      },
      getTracer: () => {
        throw new Error("tracer unavailable")
      },
      now: () => {
        throw new Error("clock unavailable")
      },
      writeDiagnostic: (record) => diagnostics.push(record),
    })

    await expect(
      observe("signapse.backend.request", {}, async (controller) => {
        controller.reportFailure("network")
        return "application result"
      })
    ).resolves.toBe("application result")
    expect(diagnostics[0]).not.toHaveProperty("trace_id")
  })

  it("propagates trace context only to the configured backend origin", () => {
    const inject = vi
      .spyOn(propagation, "inject")
      .mockImplementation((_context, carrier) => {
        ;(carrier as Record<string, string>).traceparent = "safe-trace-context"
      })
    const backendHeaders: Record<string, string> = {}
    const externalHeaders: Record<string, string> = {}

    injectTraceContextForBackend(
      backendHeaders,
      "https://api.example.test/candles?assetId=secret",
      "https://api.example.test"
    )
    injectTraceContextForBackend(
      externalHeaders,
      "https://other.example.test/candles",
      "https://api.example.test"
    )

    expect(backendHeaders).toEqual({ traceparent: "safe-trace-context" })
    expect(externalHeaders).toEqual({})
    expect(inject).toHaveBeenCalledOnce()
  })
})
