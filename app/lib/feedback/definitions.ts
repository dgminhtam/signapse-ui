import type { AppLocale } from "@/app/lib/i18n/config"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"

export const FEEDBACK_TYPES = ["BUG", "IDEA"] as const
export type FeedbackType = (typeof FEEDBACK_TYPES)[number]

export const FEEDBACK_STATUSES = [
  "PENDING_REVIEW",
  "PROMOTED",
  "DISMISSED",
] as const
export type FeedbackStatus = (typeof FEEDBACK_STATUSES)[number]

export type FeedbackMutationKind =
  "compose" | "withdraw" | "promote" | "dismiss" | "erase"

export type FeedbackMutationMode =
  "success" | "pending" | "validation-error" | "mutation-failure"

export interface FeedbackActionCapabilities {
  canWithdraw: boolean
  canPromote: boolean
  canDismiss: boolean
  canErase: boolean
}

export interface FeedbackScreenshot {
  name: string
  mimeType: string
  size: number
  previewable: boolean
  previewUrl?: string
}

export interface FeedbackTechnicalContext {
  pagePath: string
  appVersion: string
  browser: string
  operatingSystem: string
  locale: AppLocale
  observedAt: string
}

export interface FeedbackSender {
  id: string
  displayName: string
  email?: string
  active?: boolean
}

export interface FeedbackRecord {
  id: string
  ownerId: string
  type: FeedbackType
  title: string
  description: string
  expectedOutcome: string
  reproductionSteps?: string
  clientContext?: FeedbackTechnicalContext
  screenshot?: FeedbackScreenshot
  status: FeedbackStatus
  createdAt: string
  updatedAt: string
  reviewMessage?: string
  githubIssueUrl?: string
  sender?: FeedbackSender
  capabilities: FeedbackActionCapabilities
}

export interface FeedbackSubmitInput {
  type: FeedbackType
  title: string
  description: string
  expectedOutcome: string
  reproductionSteps?: string
  clientContext?: FeedbackTechnicalContext
  screenshot?: FeedbackScreenshot
}

export interface FeedbackReviewInput {
  id: string
  reviewMessage: string
}

export interface FeedbackMutationResult {
  success: boolean
  error?: string
  record?: FeedbackRecord
}

export function getFeedbackTypeLabel(
  type: FeedbackType,
  dictionary: Dictionary
): string {
  return dictionary.feedback.types[type]
}

export function getFeedbackStatusLabel(
  status: FeedbackStatus,
  dictionary: Dictionary
): string {
  return dictionary.feedback.statuses[status]
}

export function getFeedbackStatusDescription(
  status: FeedbackStatus,
  dictionary: Dictionary
): string {
  return dictionary.feedback.statusDescriptions[status]
}

export const FEEDBACK_PAGE_SIZE = 10
export const FEEDBACK_FIXTURE_USER_ID = "dev-auth-user"
