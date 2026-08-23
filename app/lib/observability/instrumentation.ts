import { registerOTel, type Configuration } from "@vercel/otel"

import { isP0FixtureModeEnabled } from "@/app/lib/dev-auth-mode"

import {
  normalizeBackendRoute,
  sanitizeObservabilityAttributes,
} from "./semantic"

const SERVICE_NAME = "signapse-ui"

type ConfiguredSpanProcessor = Exclude<
  NonNullable<Configuration["spanProcessors"]>[number],
  string
>

interface MutableExportSpan {
  attributes: Record<string, unknown>
  events?: Array<{ attributes?: Record<string, unknown> }>
  links?: Array<{ attributes?: Record<string, unknown> }>
  name: string
  status?: { message?: string }
}

export function registerServerTelemetry(
  register: (configuration: Configuration) => void = registerOTel
): boolean {
  if (
    process.env.SIGNAPSE_TELEMETRY_ENABLED !== "true" ||
    isP0FixtureModeEnabled()
  ) {
    return false
  }

  process.env.NEXT_OTEL_FETCH_DISABLED = "1"

  try {
    register({
      serviceName: SERVICE_NAME,
      instrumentations: [],
      propagators: ["tracecontext"],
      spanProcessors: [privacySpanProcessor, "auto"],
      traceSampler: resolveTraceSampler(process.env),
    })
    return true
  } catch {
    return false
  }
}

export function resolveTraceSampler(
  environment: Record<string, string | undefined>
): NonNullable<Configuration["traceSampler"]> {
  const configured = environment.OTEL_TRACES_SAMPLER?.trim().toLowerCase()
  const ratio = Number(environment.OTEL_TRACES_SAMPLER_ARG)

  switch (configured) {
    case undefined:
    case "":
    case "always_on":
    case "parentbased_always_on":
      return "parentbased_always_on"
    case "always_off":
    case "parentbased_always_off":
      return "parentbased_always_off"
    case "traceidratio":
    case "parentbased_traceidratio":
      return Number.isFinite(ratio) && ratio >= 0 && ratio <= 1
        ? "parentbased_traceidratio"
        : "parentbased_always_off"
    default:
      return "parentbased_always_off"
  }
}

export function sanitizeExportedSpan(span: MutableExportSpan): void {
  const sourceAttributes = span.attributes
  const originalName = span.name
  const isApplicationSpan = originalName.startsWith("signapse.")
  const safeName = isApplicationSpan
    ? originalName
    : classifyFrameworkSpan(originalName, sourceAttributes)
  const routeSource =
    sourceAttributes.route ??
    sourceAttributes["http.route"] ??
    sourceAttributes["http.target"] ??
    sourceAttributes["http.url"]
  const safeAttributes = sanitizeObservabilityAttributes({
    ...sourceAttributes,
    operation: safeName,
    method: normalizeMethod(
      sourceAttributes.method ?? sourceAttributes["http.method"]
    ),
    route:
      typeof routeSource === "string"
        ? normalizeBackendRoute(routeSource)
        : undefined,
    environment: normalizeEnvironment(process.env.VERCEL_ENV),
  })

  for (const key of Object.keys(sourceAttributes)) {
    delete sourceAttributes[key]
  }
  Object.assign(sourceAttributes, safeAttributes)
  span.name = safeName

  if (span.status) {
    delete span.status.message
  }
  span.events?.splice(0)
  span.links?.forEach((link) => {
    if (!link.attributes) {
      return
    }
    for (const key of Object.keys(link.attributes)) {
      delete link.attributes[key]
    }
  })
}

const privacySpanProcessor: ConfiguredSpanProcessor = {
  forceFlush: async () => undefined,
  onEnd(span) {
    try {
      sanitizeExportedSpan(span as unknown as MutableExportSpan)
    } catch {
      // Export privacy enforcement must not become a request failure path.
    }
  },
  onStart() {},
  shutdown: async () => undefined,
}

function classifyFrameworkSpan(
  name: string,
  attributes: Record<string, unknown>
): string {
  const spanType = String(attributes["next.span_type"] ?? "")
  return /render/i.test(name) || /render/i.test(spanType)
    ? "next.render"
    : "next.request"
}

function normalizeMethod(method: unknown): string | undefined {
  if (typeof method !== "string") {
    return undefined
  }
  const normalized = method.toUpperCase()
  return /^(?:DELETE|GET|HEAD|OPTIONS|PATCH|POST|PUT)$/.test(normalized)
    ? normalized
    : undefined
}

function normalizeEnvironment(environment: string | undefined): string {
  return environment === "production" ||
    environment === "preview" ||
    environment === "development"
    ? environment
    : "unknown"
}
