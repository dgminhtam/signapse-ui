export type EconomicImpact = "HIGH" | "MEDIUM" | "LOW"

export interface EconomicEventListResponse {
  id: number
  title: string
  country: string
  eventDate: string        // ISO datetime
  impact: EconomicImpact
  forecast?: string
  previous?: string
  actual?: string
  description?: string
  createdDate: string
}

export interface EconomicEventResponse extends EconomicEventListResponse {
  externalKey?: string
  lastModifiedDate: string
}
