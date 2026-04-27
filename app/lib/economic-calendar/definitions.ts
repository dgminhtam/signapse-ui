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
  value?: string | null,
  fallback = "Chưa có"
) {
  return value?.trim() || fallback
}

export function getEconomicCalendarImpactLabel(impact?: string | null) {
  return formatEconomicCalendarValue(impact, "Chưa có tác động")
}

export function getEconomicCalendarImpactVariant(
  impact?: string | null
): "secondary" | "outline" {
  return impact?.trim() ? "secondary" : "outline"
}

export function getEconomicCalendarStatusLabel(
  status?: string | null,
  contentAvailable?: boolean
) {
  switch (status?.toUpperCase()) {
    case "AVAILABLE":
      return "Có dữ liệu"
    case "PENDING":
      return "Đang chờ"
    default:
      if (contentAvailable === true) {
        return "Có dữ liệu"
      }

      if (contentAvailable === false) {
        return "Đang chờ"
      }

      return "Chưa rõ"
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
