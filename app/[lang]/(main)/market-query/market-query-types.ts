import type { MarketQueryResponse } from "@/app/lib/market-query/definitions"

export interface QueryFormState {
  question: string
}

export interface SuccessfulQueryRun {
  question: string
  result: MarketQueryResponse
}

export interface FailedQueryRun {
  question: string
  error: string
}

export type QueryPhase = "idle" | "running" | "success" | "error"
