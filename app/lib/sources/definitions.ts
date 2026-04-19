export type SourceType =
  | "NEWS"
  | "ECONOMIC_CALENDAR"
  | "RESEARCH"
  | "MARKET_DATA"
  | "SENTIMENT"
  | "OTHER"

export interface SourceRequest {
  name: string
  type: SourceType
  description?: string
  url: string
  rssUrl?: string
  active?: boolean
}

export interface SourceResponse {
  id: number
  name: string
  type: SourceType
  description?: string
  url: string
  rssUrl?: string
  lastIngestedAt?: string
  lastIngestStatus?: string
  lastIngestError?: string
  systemManaged?: boolean
  active: boolean
  createdDate: string
  lastModifiedDate: string
}

export interface SourceListResponse {
  id: number
  name: string
  type: SourceType
  description?: string
  url: string
  rssUrl?: string
  lastIngestedAt?: string
  lastIngestStatus?: string
  systemManaged?: boolean
  active: boolean
  createdDate: string
}

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  NEWS: "Tin tức",
  ECONOMIC_CALENDAR: "Lịch kinh tế",
  RESEARCH: "Nghiên cứu",
  MARKET_DATA: "Dữ liệu thị trường",
  SENTIMENT: "Tâm lý thị trường",
  OTHER: "Khác",
}
