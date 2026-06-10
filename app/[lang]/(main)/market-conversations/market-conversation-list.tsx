"use client"

import { FormEvent, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  createMarketConversation,
  submitMarketConversationMessage,
} from "@/app/api/market-conversations/action"
import { Page } from "@/app/lib/definitions"
import { useLocalization } from "@/app/lib/i18n/provider"
import { withLocalePath } from "@/app/lib/i18n/routing"
import {
  MarketConversationSummaryResponse,
  deriveMarketConversationTitle,
} from "@/app/lib/market-query/definitions"

import { MarketConversationComposer } from "./market-conversation-composer"
import { MarketConversationHistorySheet } from "./market-conversation-history-sheet"

interface MarketConversationListPageProps {
  conversationPage: Page<MarketConversationSummaryResponse>
}

export function MarketConversationListPage({
  conversationPage,
}: MarketConversationListPageProps) {
  const { dictionary, locale } = useLocalization()
  const [question, setQuestion] = useState("")
  const [questionError, setQuestionError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleQuestionChange(value: string) {
    setQuestion(value)
    if (questionError) {
      setQuestionError(null)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedQuestion = question.trim()

    if (!trimmedQuestion) {
      setQuestionError(dictionary.marketConversations.messageRequired)
      return
    }

    setQuestionError(null)

    startTransition(async () => {
      const createResult = await createMarketConversation({
        title: deriveMarketConversationTitle(trimmedQuestion),
      })

      if (!createResult.success) {
        setQuestionError(createResult.error)
        toast.error(createResult.error)
        return
      }

      const submitResult = await submitMarketConversationMessage(
        createResult.data.id,
        { message: trimmedQuestion }
      )

      if (!submitResult.success) {
        setQuestionError(submitResult.error)
        toast.error(submitResult.error)
        return
      }

      toast.success(dictionary.marketConversations.startSuccess)
      router.push(
        withLocalePath(`/market-conversations/${createResult.data.id}`, locale)
      )
      router.refresh()
    })
  }

  return (
    <div className="flex min-h-[calc(100vh-12rem)] w-full flex-col gap-6">
      <div className="flex justify-end">
        <MarketConversationHistorySheet conversationPage={conversationPage} />
      </div>

      <section className="flex flex-1 items-center justify-center py-10">
        <div className="flex w-full max-w-3xl flex-col gap-5">
          <h1 className="text-center text-2xl font-semibold tracking-normal">
            {dictionary.marketConversations.start.promptTitle}
          </h1>
          <MarketConversationComposer
            value={question}
            error={questionError}
            isPending={isPending}
            label={dictionary.marketConversations.start.questionLabel}
            placeholder={dictionary.marketConversations.start.questionPlaceholder}
            submitLabel={dictionary.marketConversations.start.start}
            submittingLabel={dictionary.marketConversations.start.starting}
            onChange={handleQuestionChange}
            onSubmit={handleSubmit}
          />
        </div>
      </section>
    </div>
  )
}
