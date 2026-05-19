import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import { formatMessage } from "@/app/lib/i18n/messages"

const MARKET_QUERY_DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
}

type DateTimeFormatter = (
  value: string | number | Date | null | undefined,
  options?: Intl.DateTimeFormatOptions,
  fallback?: string
) => string

type PercentFormatter = (
  value: number,
  options?: Intl.NumberFormatOptions
) => string

export function getExamplePrompts(dictionary: Dictionary) {
  return [
    dictionary.marketQuery.composer.examplePrompt1,
    dictionary.marketQuery.composer.examplePrompt2,
    dictionary.marketQuery.composer.examplePrompt3,
  ]
}

export function getScrollBehavior(): ScrollBehavior {
  if (typeof window === "undefined") {
    return "auto"
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"
}

export function formatTraceabilityHint(
  hasBlockedEvent: boolean,
  hasBlockedSourceDocument: boolean,
  dictionary: Dictionary
) {
  if (hasBlockedEvent && hasBlockedSourceDocument) {
    return dictionary.marketQuery.format.blockedEventAndSource
  }

  if (hasBlockedEvent) {
    return dictionary.marketQuery.format.blockedEvent
  }

  if (hasBlockedSourceDocument) {
    return dictionary.marketQuery.format.blockedSourceDocument
  }

  return null
}

export function formatMarketQueryDateTime(
  value: string | null | undefined,
  formatDateTime: DateTimeFormatter,
  dictionary: Dictionary
) {
  return formatDateTime(
    value,
    MARKET_QUERY_DATE_TIME_OPTIONS,
    dictionary.marketQuery.format.notAvailable
  )
}

export function formatConfidence(
  value: number | undefined,
  dictionary: Dictionary,
  formatPercent: PercentFormatter
) {
  if (typeof value !== "number") {
    return dictionary.marketQuery.confidenceUnknown
  }

  return formatPercent(value, {
    maximumFractionDigits: 0,
  })
}

export function getConfidenceVariant(
  value?: number
): "default" | "secondary" | "outline" | "destructive" {
  if (typeof value !== "number") {
    return "outline"
  }

  if (value >= 0.75) {
    return "default"
  }

  if (value >= 0.5) {
    return "secondary"
  }

  if (value < 0.3) {
    return "destructive"
  }

  return "outline"
}

export function formatEventFallbackMeta(id: number | undefined, dictionary: Dictionary) {
  return typeof id === "number"
    ? formatMessage(dictionary.marketQuery.format.eventFallback, { id })
    : null
}

export function formatSourceDocumentFallbackMeta(
  id: number | undefined,
  dictionary: Dictionary
) {
  return typeof id === "number"
    ? formatMessage(dictionary.marketQuery.format.sourceDocumentFallback, { id })
    : null
}

export function getSourceDocumentHref(id: number) {
  return `/source-documents/${id}`
}
