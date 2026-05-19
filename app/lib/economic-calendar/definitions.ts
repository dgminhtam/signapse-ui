import type { Dictionary } from "@/app/lib/i18n/dictionary-types"

export type EconomicCalendarStatus = "PENDING" | "AVAILABLE" | string

export interface EconomicCalendarListResponse {
  id: number
  title: string
  currencyCode?: string
  impact?: string
  forecastValue?: string
  previousValue?: string
  actualValue?: string
  contentAvailable?: boolean
  status?: EconomicCalendarStatus
  scheduledAt?: string
  syncedAt?: string
  createdDate?: string
  lastModifiedDate?: string
}

export interface EconomicCalendarResponse extends EconomicCalendarListResponse {
  content?: string
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
  return formatEconomicCalendarValue(impact, dictionary.economicCalendar.noImpact)
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
