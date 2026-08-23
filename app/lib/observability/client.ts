"use client"

import { track } from "@vercel/analytics"

import {
  sanitizeObservabilityAttributes,
  type ObservabilityAttributes,
  type ObservabilityOperation,
  type ObservabilityOutcome,
} from "./semantic"

interface ClientPerformanceDependencies {
  eventsEnabled: boolean
  mark: (name: string) => void
  measure: (name: string, startMark: string, endMark: string) => void
  now: () => number
  report: (name: string, properties: ObservabilityAttributes) => void
}

export interface ClientPerformanceMeasurement {
  finish(
    outcome: ObservabilityOutcome,
    attributes?: Record<string, unknown>
  ): void
}

let measurementSequence = 0

export function createClientPerformanceAdapter(
  overrides: Partial<ClientPerformanceDependencies> = {}
) {
  const dependencies: ClientPerformanceDependencies = {
    eventsEnabled:
      process.env.NEXT_PUBLIC_SIGNAPSE_PERFORMANCE_EVENTS_ENABLED === "true",
    mark: (name) => performance.mark(name),
    measure: (name, startMark, endMark) =>
      performance.measure(name, startMark, endMark),
    now: () => performance.now(),
    report: (name, properties) => track(name, properties),
    ...overrides,
  }

  return function startClientPerformanceMeasurement(
    operation: ObservabilityOperation,
    attributes: Record<string, unknown> = {}
  ): ClientPerformanceMeasurement {
    const sequence = measurementSequence++
    const startMark = `${operation}:start:${sequence}`
    const endMark = `${operation}:end:${sequence}`
    const startedAt = safeNow(dependencies.now)
    let finished = false
    safeReport(() => dependencies.mark(startMark))

    return {
      finish(outcome, finishAttributes = {}) {
        if (finished) {
          return
        }
        finished = true
        const durationMs = Math.max(0, safeNow(dependencies.now) - startedAt)
        safeReport(() => dependencies.mark(endMark))
        safeReport(() => dependencies.measure(operation, startMark, endMark))

        if (!dependencies.eventsEnabled) {
          return
        }

        const properties = sanitizeObservabilityAttributes({
          ...attributes,
          ...finishAttributes,
          operation,
          outcome,
          duration_ms: Math.round(durationMs),
        })
        safeReport(() => dependencies.report(operation, properties))
      },
    }
  }
}

export const startClientPerformanceMeasurement =
  createClientPerformanceAdapter()

function safeNow(now: () => number): number {
  try {
    const value = now()
    return Number.isFinite(value) ? value : 0
  } catch {
    return 0
  }
}

function safeReport(action: () => void): void {
  try {
    action()
  } catch {
    // Client reporting is optional and must not affect the interaction.
  }
}
