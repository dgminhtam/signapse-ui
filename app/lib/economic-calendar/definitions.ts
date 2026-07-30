import type { Dictionary } from "@/app/lib/i18n/dictionary-types"

export type EconomicCalendarStatus = "PENDING" | "AVAILABLE"

export const ECONOMIC_CALENDAR_IMPACT_LEVELS = [
  "HIGH",
  "MEDIUM",
  "LOW",
] as const

export type EconomicCalendarImpactLevel =
  (typeof ECONOMIC_CALENDAR_IMPACT_LEVELS)[number]

export interface EconomicCalendarListResponse {
  id: number
  title: string | null
  currencyCode: string | null
  type: string | null
  impact: string | null
  forecastValue: string | null
  previousValue: string | null
  actualValue: string | null
  description: string | null
  revision: string | null
  newsUrl: string | null
  actualBetterWorse: string | null
  revisionBetterWorse: string | null
  status: EconomicCalendarStatus
  scheduledAt: string | null
  syncedAt: string | null
  createdDate: string
  lastModifiedDate: string | null
}

export type EconomicCalendarResponse = EconomicCalendarListResponse

export interface EconomicCalendarSyncResponse {
  fetchedCount?: number
  createdCount?: number
  updatedCount?: number
  skippedCount?: number
  syncedAt?: string
}

export function formatEconomicCalendarValue(
  value: string | null | undefined,
  fallback: string
) {
  return value?.trim() || fallback
}

export function getEconomicCalendarImpactLabel(
  impact: string | null | undefined,
  dictionary: Dictionary
) {
  if (!impact?.trim()) {
    return dictionary.economicCalendar.noImpact
  }

  const impactLevel = getEconomicCalendarImpactLevel(impact)

  return impactLevel
    ? dictionary.economicCalendar.impactLabels[impactLevel]
    : dictionary.economicCalendar.impactLabels.UNKNOWN
}

export function getEconomicCalendarImpactLevel(
  impact: string | null | undefined
): EconomicCalendarImpactLevel | null {
  const normalizedImpact = impact?.trim().toUpperCase()

  return (
    ECONOMIC_CALENDAR_IMPACT_LEVELS.find((level) =>
      normalizedImpact?.includes(level)
    ) ?? null
  )
}

export function isEconomicCalendarImpactSelected(
  impact: string | null | undefined,
  selectedImpacts: readonly EconomicCalendarImpactLevel[]
) {
  const impactLevel = getEconomicCalendarImpactLevel(impact)

  return impactLevel !== null && selectedImpacts.includes(impactLevel)
}

export function getEconomicCalendarImpactBadgeProps(
  impact: string | null | undefined
) {
  switch (getEconomicCalendarImpactLevel(impact)) {
    case "HIGH":
    return {
      className:
        "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
    }
    case "MEDIUM":
    return {
      className:
        "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
    }
    case "LOW":
    return {
      className:
        "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    }
    default:
      return { variant: "outline" as const }
  }
}

export function getEconomicCalendarStatusLabel(
  status?: string | null,
  dictionary?: Dictionary
) {
  const labels = dictionary?.economicCalendar.statusLabels

  switch (status?.toUpperCase()) {
    case "AVAILABLE":
      return labels?.AVAILABLE ?? "AVAILABLE"
    case "PENDING":
      return labels?.PENDING ?? "PENDING"
    default:
      return labels?.UNKNOWN ?? "UNKNOWN"
  }
}

export function getEconomicCalendarStatusVariant(
  status?: string | null
): "default" | "secondary" | "outline" {
  switch (status?.toUpperCase()) {
    case "AVAILABLE":
      return "default"
    case "PENDING":
      return "secondary"
    default:
      return "outline"
  }
}
