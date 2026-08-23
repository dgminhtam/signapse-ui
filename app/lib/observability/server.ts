import {
  context,
  propagation,
  SpanKind,
  SpanStatusCode,
  trace,
  type Context,
  type Span,
  type TextMapSetter,
} from "@opentelemetry/api"

import {
  sanitizeObservabilityAttributes,
  summarizeValidationIssues,
  type ValidationIssueLike,
  type ObservabilityAttributes,
  type ObservabilityErrorType,
  type ObservabilityOperation,
  type ObservabilityOutcome,
} from "./semantic"

const TRACER_NAME = "signapse-ui"

interface SpanLike {
  end(): void
  setAttributes(attributes: ObservabilityAttributes): void
  setStatus(status: { code: SpanStatusCode }): void
  spanContext(): { traceId: string }
}

interface TracerLike {
  startActiveSpan<T>(
    name: string,
    options: { attributes: ObservabilityAttributes; kind: SpanKind },
    callback: (span: SpanLike) => Promise<T>
  ): Promise<T>
}

export interface ServerOperationController {
  addAttributes(attributes: Record<string, unknown>): void
  reportFailure(
    errorType: ObservabilityErrorType,
    attributes?: Record<string, unknown>
  ): void
  setOutcome(outcome: ObservabilityOutcome): void
}

interface ServerObservabilityDependencies {
  getActiveTraceId: () => string | undefined
  getTracer: () => TracerLike
  now: () => number
  writeDiagnostic: (record: ObservabilityAttributes) => void
}

export function createServerObservabilityAdapter(
  overrides: Partial<ServerObservabilityDependencies> = {}
) {
  const dependencies: ServerObservabilityDependencies = {
    getActiveTraceId,
    getTracer: () => trace.getTracer(TRACER_NAME) as TracerLike,
    now: () => performance.now(),
    writeDiagnostic: (record) => console.error(JSON.stringify(record)),
    ...overrides,
  }

  return async function observeServerOperation<T>(
    operation: ObservabilityOperation,
    attributes: Record<string, unknown>,
    work: (controller: ServerOperationController) => Promise<T>
  ): Promise<T> {
    let workStarted = false
    let workCompleted = false
    let workFailed = false
    let workError: unknown
    let workResult!: T
    const run = async (span?: SpanLike): Promise<T> => {
      workStarted = true
      const startedAt = safeNow(dependencies.now)
      let outcome: ObservabilityOutcome = "success"
      let terminalAttributes = sanitizeObservabilityAttributes({
        operation,
        ...attributes,
      })
      const controller: ServerOperationController = {
        addAttributes(nextAttributes) {
          terminalAttributes = {
            ...terminalAttributes,
            ...sanitizeObservabilityAttributes(nextAttributes),
          }
        },
        reportFailure(errorType, failureAttributes = {}) {
          const diagnostic = sanitizeObservabilityAttributes({
            ...terminalAttributes,
            ...failureAttributes,
            operation,
            outcome,
            "error.type": errorType,
            duration_ms: Math.max(0, safeNow(dependencies.now) - startedAt),
            trace_id: safeActiveTraceId(dependencies.getActiveTraceId),
          })
          try {
            dependencies.writeDiagnostic(diagnostic)
          } catch {
            // Observability must never create a second failure path.
          }
        },
        setOutcome(nextOutcome) {
          outcome = nextOutcome
        },
      }

      try {
        workResult = await work(controller)
        workCompleted = true
        return workResult
      } catch (error) {
        workFailed = true
        workError = error
        outcome = outcome === "success" ? classifyThrownOutcome(error) : outcome
        throw error
      } finally {
        const finishedAttributes = sanitizeObservabilityAttributes({
          ...terminalAttributes,
          outcome,
          duration_ms: Math.max(0, safeNow(dependencies.now) - startedAt),
        })
        safeSpanCall(() => span?.setAttributes(finishedAttributes))
        safeSpanCall(() =>
          span?.setStatus({
            code:
              outcome === "success" || outcome === "empty"
                ? SpanStatusCode.OK
                : SpanStatusCode.ERROR,
          })
        )
        safeSpanCall(() => span?.end())
      }
    }

    try {
      const tracer = dependencies.getTracer()
      return await tracer.startActiveSpan(
        operation,
        {
          attributes: sanitizeObservabilityAttributes({
            operation,
            ...attributes,
          }),
          kind: SpanKind.INTERNAL,
        },
        run
      )
    } catch (error) {
      if (workFailed) {
        throw workError
      }
      if (workCompleted) {
        return workResult
      }
      if (workStarted) {
        throw error
      }
      return run()
    }
  }
}

export const observeServerOperation = createServerObservabilityAdapter()

export function reportValidationFailure(
  operation: ObservabilityOperation,
  attributes: Record<string, unknown>,
  issues: readonly ValidationIssueLike[]
): void {
  try {
    const record = sanitizeObservabilityAttributes({
      ...attributes,
      ...summarizeValidationIssues(issues),
      operation,
      outcome: "validation_error",
      "error.type": "validation",
      trace_id: getActiveTraceId(),
    })
    console.error(JSON.stringify(record))
  } catch {
    // Diagnostic output must not alter localized application errors.
  }
}

export function getActiveTraceId(): string | undefined {
  try {
    return safeTraceId(trace.getActiveSpan()?.spanContext().traceId)
  } catch {
    return undefined
  }
}

type TraceHeaderCarrier = Headers | Record<string, string>

export function injectActiveTraceContext(headers: TraceHeaderCarrier): void {
  try {
    propagation.inject(context.active(), headers, HEADERS_SETTER)
  } catch {
    // Propagation is optional and must be fail-open.
  }
}

export function injectTraceContextForBackend(
  headers: TraceHeaderCarrier,
  requestUrl: string,
  backendBaseUrl: string | undefined
): void {
  if (!backendBaseUrl || !isSameOrigin(requestUrl, backendBaseUrl)) {
    return
  }
  injectActiveTraceContext(headers)
}

const HEADERS_SETTER: TextMapSetter<TraceHeaderCarrier> = {
  set(carrier, key, value) {
    if (carrier instanceof Headers) {
      carrier.set(key, value)
      return
    }
    carrier[key] = value
  },
}

function classifyThrownOutcome(error: unknown): ObservabilityOutcome {
  if (error instanceof DOMException && error.name === "AbortError") {
    return "cancelled"
  }
  return "error"
}

function isSameOrigin(requestUrl: string, backendBaseUrl: string): boolean {
  try {
    return new URL(requestUrl).origin === new URL(backendBaseUrl).origin
  } catch {
    return false
  }
}

function safeTraceId(traceId: string | undefined): string | undefined {
  return traceId && /^[0-9a-f]{32}$/i.test(traceId) ? traceId : undefined
}

function safeActiveTraceId(
  getTraceId: () => string | undefined
): string | undefined {
  try {
    return safeTraceId(getTraceId())
  } catch {
    return undefined
  }
}

function safeNow(now: () => number): number {
  try {
    const value = now()
    return Number.isFinite(value) ? value : 0
  } catch {
    return 0
  }
}

function safeSpanCall(action: () => void): void {
  try {
    action()
  } catch {
    // Span lifecycle failures must not alter application behavior.
  }
}

export type { Context, Span }
