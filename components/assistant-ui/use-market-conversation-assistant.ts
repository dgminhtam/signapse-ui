"use client"

import * as React from "react"
import type { AppendMessage } from "@assistant-ui/react"

import {
  createMarketConversation,
  getMarketAnalysisById,
  getMarketConversationMessages,
  getMarketConversations,
  submitMarketConversationMessage,
} from "@/app/api/market-conversations/action"
import {
  deriveMarketConversationTitle,
  normalizeMarketConversationMessages,
  reconcileMarketConversationMessages,
  type MarketAnalysisResponse,
  type MarketChatMessageResponse,
  type MarketConversationSummaryResponse,
} from "@/app/lib/market-query/definitions"
import {
  getAppendMessageText,
  mapMarketConversationMessage,
} from "@/components/assistant-ui/market-conversation-runtime"

const HISTORY_PAGE_SIZE = 10

export type AnalysisLoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "loaded"; data: MarketAnalysisResponse }
  | { status: "error"; error: string }

export function useMarketConversationAssistant(workspaceId: number | null) {
  const [conversations, setConversations] = React.useState<
    MarketConversationSummaryResponse[]
  >([])
  const [selectedConversation, setSelectedConversation] =
    React.useState<MarketConversationSummaryResponse | null>(null)
  const [messages, setMessages] = React.useState<MarketChatMessageResponse[]>([])
  const [historyPage, setHistoryPage] = React.useState(0)
  const [hasMoreHistory, setHasMoreHistory] = React.useState(false)
  const [nextBeforeMessageId, setNextBeforeMessageId] = React.useState<
    number | null
  >(null)
  const [hasMoreMessages, setHasMoreMessages] = React.useState(false)
  const [isHistoryLoading, setIsHistoryLoading] = React.useState(false)
  const [isMessagesLoading, setIsMessagesLoading] = React.useState(false)
  const [isOlderMessagesLoading, setIsOlderMessagesLoading] =
    React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [historyError, setHistoryError] = React.useState<string | null>(null)
  const [messagesError, setMessagesError] = React.useState<string | null>(null)
  const [submissionError, setSubmissionError] = React.useState<string | null>(
    null
  )
  const [analysisCache, setAnalysisCache] = React.useState<
    Record<number, AnalysisLoadState>
  >({})
  const [expandedAnalysisIds, setExpandedAnalysisIds] = React.useState<
    Set<number>
  >(() => new Set())

  const workspaceEpochRef = React.useRef(0)
  const threadEpochRef = React.useRef(0)
  const analysisRequestKeysRef = React.useRef(new Set<string>())

  const resetAnalysisState = React.useCallback(() => {
    setAnalysisCache({})
    setExpandedAnalysisIds(new Set())
    analysisRequestKeysRef.current.clear()
  }, [])

  const loadHistoryPage = React.useCallback(
    async (page: number, append: boolean) => {
      if (workspaceId == null) return

      const workspaceEpoch = workspaceEpochRef.current
      setIsHistoryLoading(true)
      setHistoryError(null)

      try {
        const result = await getMarketConversations({
          filter: "",
          page,
          size: HISTORY_PAGE_SIZE,
          sort: [{ field: "lastModifiedDate", direction: "desc" }],
        })

        if (workspaceEpoch !== workspaceEpochRef.current) return

        setConversations((current) => {
          const next = append ? [...current, ...result.content] : result.content
          const byId = new Map(next.map((conversation) => [conversation.id, conversation]))
          return [...byId.values()]
        })
        setHistoryPage(page)
        setHasMoreHistory(!result.last)
      } catch (error) {
        if (workspaceEpoch !== workspaceEpochRef.current) return
        setHistoryError(error instanceof Error ? error.message : String(error))
      } finally {
        if (workspaceEpoch === workspaceEpochRef.current) {
          setIsHistoryLoading(false)
        }
      }
    },
    [workspaceId]
  )

  React.useEffect(() => {
    workspaceEpochRef.current += 1
    threadEpochRef.current += 1
    setConversations([])
    setSelectedConversation(null)
    setMessages([])
    setHistoryPage(0)
    setHasMoreHistory(false)
    setNextBeforeMessageId(null)
    setHasMoreMessages(false)
    setHistoryError(null)
    setMessagesError(null)
    setSubmissionError(null)
    resetAnalysisState()

    if (workspaceId != null) {
      void loadHistoryPage(0, false)
    }
  }, [loadHistoryPage, resetAnalysisState, workspaceId])

  const selectConversation = React.useCallback(
    async (conversation: MarketConversationSummaryResponse) => {
      const threadEpoch = ++threadEpochRef.current
      const workspaceEpoch = workspaceEpochRef.current
      setSelectedConversation(conversation)
      setMessages([])
      setNextBeforeMessageId(null)
      setHasMoreMessages(false)
      setMessagesError(null)
      setSubmissionError(null)
      setIsMessagesLoading(true)
      resetAnalysisState()

      try {
        const page = await getMarketConversationMessages(conversation.id)

        if (
          workspaceEpoch !== workspaceEpochRef.current ||
          threadEpoch !== threadEpochRef.current
        ) {
          return
        }

        setMessages(normalizeMarketConversationMessages(page.content))
        setHasMoreMessages(page.hasMore)
        setNextBeforeMessageId(page.nextBeforeMessageId ?? null)
      } catch (error) {
        if (
          workspaceEpoch === workspaceEpochRef.current &&
          threadEpoch === threadEpochRef.current
        ) {
          setMessagesError(error instanceof Error ? error.message : String(error))
        }
      } finally {
        if (
          workspaceEpoch === workspaceEpochRef.current &&
          threadEpoch === threadEpochRef.current
        ) {
          setIsMessagesLoading(false)
        }
      }
    },
    [resetAnalysisState]
  )

  const startNewConversation = React.useCallback(() => {
    threadEpochRef.current += 1
    setSelectedConversation(null)
    setMessages([])
    setNextBeforeMessageId(null)
    setHasMoreMessages(false)
    setMessagesError(null)
    setSubmissionError(null)
    resetAnalysisState()
  }, [resetAnalysisState])

  const loadAnalysis = React.useCallback(
    async (analysisId: number) => {
      const current = analysisCache[analysisId]
      if (current?.status === "loading" || current?.status === "loaded") {
        return
      }

      const workspaceEpoch = workspaceEpochRef.current
      const threadEpoch = threadEpochRef.current
      const requestKey = `${workspaceEpoch}:${threadEpoch}:${analysisId}`

      if (analysisRequestKeysRef.current.has(requestKey)) {
        return
      }

      analysisRequestKeysRef.current.add(requestKey)
      setAnalysisCache((cache) => ({
        ...cache,
        [analysisId]: { status: "loading" },
      }))

      try {
        const data = await getMarketAnalysisById(analysisId)

        if (
          workspaceEpoch !== workspaceEpochRef.current ||
          threadEpoch !== threadEpochRef.current
        ) {
          return
        }

        setAnalysisCache((cache) => ({
          ...cache,
          [analysisId]: { status: "loaded", data },
        }))
      } catch (error) {
        if (
          workspaceEpoch === workspaceEpochRef.current &&
          threadEpoch === threadEpochRef.current
        ) {
          setAnalysisCache((cache) => ({
            ...cache,
            [analysisId]: {
              status: "error",
              error: error instanceof Error ? error.message : String(error),
            },
          }))
        }
      } finally {
        analysisRequestKeysRef.current.delete(requestKey)
      }
    },
    [analysisCache]
  )

  const toggleAnalysis = React.useCallback(
    (analysisId: number) => {
      const isExpanded = expandedAnalysisIds.has(analysisId)

      setExpandedAnalysisIds((current) => {
        const next = new Set(current)

        if (isExpanded) {
          next.delete(analysisId)
        } else {
          next.add(analysisId)
        }

        return next
      })

      if (!isExpanded) {
        void loadAnalysis(analysisId)
      }
    },
    [expandedAnalysisIds, loadAnalysis]
  )

  const loadOlderMessages = React.useCallback(async () => {
    if (
      !selectedConversation ||
      !hasMoreMessages ||
      nextBeforeMessageId == null ||
      isOlderMessagesLoading
    ) {
      return
    }

    const workspaceEpoch = workspaceEpochRef.current
    const threadEpoch = threadEpochRef.current
    setIsOlderMessagesLoading(true)
    setMessagesError(null)

    try {
      const page = await getMarketConversationMessages(
        selectedConversation.id,
        nextBeforeMessageId
      )

      if (
        workspaceEpoch !== workspaceEpochRef.current ||
        threadEpoch !== threadEpochRef.current
      ) {
        return
      }

      setMessages((current) =>
        reconcileMarketConversationMessages(page.content, current)
      )
      setHasMoreMessages(page.hasMore)
      setNextBeforeMessageId(page.nextBeforeMessageId ?? null)
    } catch (error) {
      if (
        workspaceEpoch === workspaceEpochRef.current &&
        threadEpoch === threadEpochRef.current
      ) {
        setMessagesError(error instanceof Error ? error.message : String(error))
      }
    } finally {
      if (
        workspaceEpoch === workspaceEpochRef.current &&
        threadEpoch === threadEpochRef.current
      ) {
        setIsOlderMessagesLoading(false)
      }
    }
  }, [
    hasMoreMessages,
    isOlderMessagesLoading,
    nextBeforeMessageId,
    selectedConversation,
  ])

  const submitMessage = React.useCallback(
    async (appendMessage: AppendMessage) => {
      const message = getAppendMessageText(appendMessage)
      if (!message || isSubmitting || workspaceId == null) return

      const workspaceEpoch = workspaceEpochRef.current
      const threadEpoch = threadEpochRef.current
      let conversation = selectedConversation
      setIsSubmitting(true)
      setSubmissionError(null)

      try {
        if (!conversation) {
          const createResult = await createMarketConversation({
            title: deriveMarketConversationTitle(message),
          })

          if (!createResult.success) {
            throw new Error(createResult.error)
          }

          if (
            workspaceEpoch !== workspaceEpochRef.current ||
            threadEpoch !== threadEpochRef.current
          ) {
            return
          }

          conversation = createResult.data
          setSelectedConversation(conversation)
          setConversations((current) => [
            conversation!,
            ...current.filter((item) => item.id !== conversation!.id),
          ])
        }

        const submitResult = await submitMarketConversationMessage(
          conversation.id,
          { message }
        )

        if (!submitResult.success) {
          throw new Error(submitResult.error)
        }

        if (
          workspaceEpoch !== workspaceEpochRef.current ||
          threadEpoch !== threadEpochRef.current
        ) {
          return
        }

        setMessages((current) =>
          reconcileMarketConversationMessages(current, [
            submitResult.data.userMessage,
            submitResult.data.assistantMessage,
          ])
        )
        setConversations((current) => [
          conversation!,
          ...current.filter((item) => item.id !== conversation!.id),
        ])
      } catch (error) {
        if (
          workspaceEpoch === workspaceEpochRef.current &&
          threadEpoch === threadEpochRef.current
        ) {
          const errorMessage =
            error instanceof Error ? error.message : String(error)
          setSubmissionError(errorMessage)
          throw error
        }
      } finally {
        if (
          workspaceEpoch === workspaceEpochRef.current &&
          threadEpoch === threadEpochRef.current
        ) {
          setIsSubmitting(false)
        }
      }
    },
    [isSubmitting, selectedConversation, workspaceId]
  )

  return {
    conversations,
    selectedConversation,
    messages,
    runtimeMessages: messages.map(mapMarketConversationMessage),
    hasMoreHistory,
    hasMoreMessages,
    isHistoryLoading,
    isMessagesLoading,
    isOlderMessagesLoading,
    isSubmitting,
    historyError,
    messagesError,
    submissionError,
    analysisCache,
    expandedAnalysisIds,
    loadMoreHistory: () => loadHistoryPage(historyPage + 1, true),
    retryHistory: () => loadHistoryPage(0, false),
    selectConversation,
    startNewConversation,
    loadOlderMessages,
    loadAnalysis,
    retryAnalysis: loadAnalysis,
    toggleAnalysis,
    submitMessage,
  }
}

export type MarketConversationAssistantController = ReturnType<
  typeof useMarketConversationAssistant
>
