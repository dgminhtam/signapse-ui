"use client"

import { FormEvent, KeyboardEvent, useId, useState, useTransition } from "react"
import { SendHorizontal } from "lucide-react"
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
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { Kbd } from "@/components/ui/kbd"
import { Spinner } from "@/components/ui/spinner"

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
  const questionId = useId()

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

  function handleQuestionKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (
      event.key === "Enter" &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing
    ) {
      event.preventDefault()
      event.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-12rem)] w-full flex-col gap-6">
      <div className="flex justify-end">
        <MarketConversationHistorySheet conversationPage={conversationPage} />
      </div>

      <section className="flex flex-1 items-center justify-center py-10">
        <form
          onSubmit={handleSubmit}
          className="flex w-full max-w-3xl flex-col gap-5"
        >
          <h1 className="text-center text-2xl font-semibold tracking-normal">
            {dictionary.marketConversations.start.promptTitle}
          </h1>
          <FieldGroup>
            <Field data-invalid={!!questionError} data-disabled={isPending}>
              <FieldLabel htmlFor={questionId} className="sr-only">
                {dictionary.marketConversations.start.questionLabel}
              </FieldLabel>
              <InputGroup className="min-h-36 rounded-xl bg-card shadow-sm">
                <InputGroupTextarea
                  id={questionId}
                  value={question}
                  onChange={(event) => handleQuestionChange(event.target.value)}
                  onKeyDown={handleQuestionKeyDown}
                  placeholder={
                    dictionary.marketConversations.start.questionPlaceholder
                  }
                  className="min-h-24 px-4 pt-4"
                  aria-invalid={questionError ? true : undefined}
                  disabled={isPending}
                  rows={4}
                />
                <InputGroupAddon align="block-end" className="justify-between">
                  <Kbd>Enter</Kbd>
                  <InputGroupButton
                    type="submit"
                    variant="default"
                    size="icon-sm"
                    className="rounded-full"
                    disabled={isPending}
                    aria-label={
                      isPending
                        ? dictionary.marketConversations.start.starting
                        : dictionary.marketConversations.start.start
                    }
                  >
                    {isPending ? <Spinner /> : <SendHorizontal />}
                  </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>
              <FieldError>{questionError}</FieldError>
            </Field>
          </FieldGroup>
        </form>
      </section>
    </div>
  )
}
