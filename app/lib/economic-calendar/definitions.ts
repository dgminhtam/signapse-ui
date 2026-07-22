import type { Dictionary } from "@/app/lib/i18n/dictionary-types"

export type EconomicCalendarStatus = "PENDING" | "AVAILABLE"

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
  contentAvailable: boolean
  status: EconomicCalendarStatus
  scheduledAt: string | null
  syncedAt: string | null
  createdDate: string
  lastModifiedDate: string | null
}

export interface EconomicCalendarResponse extends EconomicCalendarListResponse {
  content: string | null
}

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
  const normalizedImpact = impact?.trim().toUpperCase()

  if (!normalizedImpact) {
    return dictionary.economicCalendar.noImpact
  }

  if (normalizedImpact.includes("HIGH")) {
    return dictionary.economicCalendar.impactLabels.HIGH
  }

  if (normalizedImpact.includes("MEDIUM")) {
    return dictionary.economicCalendar.impactLabels.MEDIUM
  }

  if (normalizedImpact.includes("LOW")) {
    return dictionary.economicCalendar.impactLabels.LOW
  }

  return dictionary.economicCalendar.impactLabels.UNKNOWN
}

export function getEconomicCalendarImpactVariant(
  impact?: string | null
): "secondary" | "outline" {
  return impact?.trim() ? "secondary" : "outline"
}

export function getEconomicCalendarStatusLabel(
  status?: string | null,
  contentAvailable?: boolean,
  dictionary?: Dictionary
) {
  const labels = dictionary?.economicCalendar.statusLabels

  switch (status?.toUpperCase()) {
    case "AVAILABLE":
      return labels?.AVAILABLE ?? "AVAILABLE"
    case "PENDING":
      return labels?.PENDING ?? "PENDING"
    default:
      if (contentAvailable === true) {
        return labels?.AVAILABLE ?? "AVAILABLE"
      }

      if (contentAvailable === false) {
        return labels?.PENDING ?? "PENDING"
      }

      return labels?.UNKNOWN ?? "UNKNOWN"
  }
}

export function getEconomicCalendarStatusVariant(
  status?: string | null,
  contentAvailable?: boolean
): "default" | "secondary" | "outline" {
  switch (status?.toUpperCase()) {
    case "AVAILABLE":
      return "default"
    case "PENDING":
      return "secondary"
    default:
      if (contentAvailable === true) {
        return "default"
      }

      if (contentAvailable === false) {
        return "secondary"
      }

      return "outline"
  }
}
