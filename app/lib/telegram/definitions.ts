import { z } from "zod"

import { WorkspaceWatchlistAssetListItemResponse } from "@/app/lib/watchlists/definitions"
import { WorkspaceResponse } from "@/app/lib/workspaces/definitions"

export const TELEGRAM_FEATURE_KEYS = [
  "ECONOMIC_CALENDAR_ALERT",
  "MARKET_NEWS_ALERT",
  "SCHEDULED_MARKET_ANALYSIS",
] as const

export type TelegramFeatureKey = (typeof TELEGRAM_FEATURE_KEYS)[number]

export type TelegramConnectionStatus =
  | "ACTIVE"
  | "DISABLED"
  | "REMOVED"
  | "INVALID"

export type TelegramDestinationStatus = "ACTIVE" | "DISABLED" | "REMOVED"

export type TelegramChatType =
  | "PRIVATE"
  | "GROUP"
  | "SUPERGROUP"
  | "CHANNEL"
  | "UNKNOWN"

export interface TelegramBotConnectionResponse {
  id: number
  botId?: number
  botUsername?: string
  botFirstName?: string
  displayLabel?: string
  status: TelegramConnectionStatus
  webhookUrl?: string
  failureReason?: string
  verifiedAt?: string
  lastValidatedAt?: string
  lastWebhookRegisteredAt?: string
  createdDate?: string
  lastModifiedDate?: string
}

export interface TelegramDestinationResponse {
  id: number
  botConnectionId: number
  botUsername?: string
  botDisplayLabel?: string
  chatId?: string
  chatType: TelegramChatType
  displayLabel?: string
  chatTitle?: string
  username?: string
  status: TelegramDestinationStatus
  createdDate?: string
  lastModifiedDate?: string
}

export interface ScheduledAssetResponse {
  assetId: number
  assetSymbol?: string
  assetName?: string
}

export interface TelegramMarketAnalysisScheduleResponse {
  id: number
  name: string
  workspaceId: number
  workspaceName?: string
  destination?: TelegramDestinationResponse
  timezone: string
  localTimes: string[]
  assets?: ScheduledAssetResponse[]
  status: TelegramDestinationStatus
  createdDate?: string
  lastModifiedDate?: string
}

export interface TelegramFeatureSettingResponse {
  id: number
  featureKey: TelegramFeatureKey
  workspaceId: number
  workspaceName?: string
  enabled: boolean
  destination?: TelegramDestinationResponse
  createdDate?: string
  lastModifiedDate?: string
}

export interface TelegramLinkTokenResponse {
  botConnectionId: number
  token?: string
  startCommand: string
  expiresAt?: string
}

export const createTelegramBotConnectionSchema = z.object({
  botToken: z.string().trim().min(1, "Vui lòng nhập token bot."),
  displayLabel: z.string().trim().optional(),
})

export const updateTelegramBotConnectionSchema = z.object({
  displayLabel: z.string().trim().optional(),
})

export const createTelegramLinkTokenSchema = z.object({
  botConnectionId: z.coerce.number().int().positive(),
})

export const updateTelegramDestinationSchema = z.object({
  displayLabel: z.string().trim().optional(),
})

export const updateTelegramFeatureSettingSchema = z.object({
  featureKey: z.enum(TELEGRAM_FEATURE_KEYS),
  workspaceId: z.coerce.number().int().positive(),
  destinationId: z.coerce.number().int().positive(),
  enabled: z.boolean().optional(),
})

export const saveTelegramMarketAnalysisScheduleSchema = z.object({
  name: z.string().trim().min(1, "Vui lòng nhập tên lịch."),
  workspaceId: z.coerce.number().int().positive(),
  destinationId: z.coerce.number().int().positive(),
  timezone: z.string().trim().min(1, "Vui lòng nhập múi giờ."),
  localTimes: z
    .array(z.string().trim().min(1))
    .min(1, "Vui lòng nhập ít nhất một giờ gửi."),
  assetIds: z.array(z.coerce.number().int().positive()).optional(),
})

export type CreateTelegramBotConnectionRequest = z.infer<
  typeof createTelegramBotConnectionSchema
>
export type UpdateTelegramBotConnectionRequest = z.infer<
  typeof updateTelegramBotConnectionSchema
>
export type CreateTelegramLinkTokenRequest = z.infer<
  typeof createTelegramLinkTokenSchema
>
export type UpdateTelegramDestinationRequest = z.infer<
  typeof updateTelegramDestinationSchema
>
export type UpdateTelegramFeatureSettingRequest = z.infer<
  typeof updateTelegramFeatureSettingSchema
>
export type SaveTelegramMarketAnalysisScheduleRequest = z.infer<
  typeof saveTelegramMarketAnalysisScheduleSchema
>

export interface TelegramSectionAccess {
  botConnections: boolean
  destinations: boolean
  featureSettings: boolean
  schedules: boolean
  watchlistAssets: boolean
}

export interface TelegramManageAccess {
  botConnections: boolean
  destinations: boolean
  featureSettings: boolean
  schedules: boolean
}

export interface TelegramConfigurationData {
  botConnections: TelegramBotConnectionResponse[]
  destinations: TelegramDestinationResponse[]
  featureSettings: TelegramFeatureSettingResponse[]
  schedules: TelegramMarketAnalysisScheduleResponse[]
  currentWorkspace: WorkspaceResponse | null
  watchlistAssets: WorkspaceWatchlistAssetListItemResponse[]
  sectionAccess: TelegramSectionAccess
  manageAccess: TelegramManageAccess
}
