"use client"

import { FormEvent, useId, useState, useTransition } from "react"
import { Clock3, MessageSquareText, Plus, SendHorizontal } from "lucide-react"
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
import { AppPaginationControls } from "@/components/app-pagination-controls"
import { AppSelectPageSize } from "@/components/app-select-page-size"
import { AppTimeMetadata } from "@/components/app-time-metadata"
import {
  AppListTable,
  AppListTableEmptyState,
  AppListTableHead,
  AppListTableHeaderRow,
} from "@/components/app-list-table"
import {
  AppListToolbar,
  AppListToolbarLeading,
  AppListToolbarTrailing,
} from "@/components/app-list-toolbar"
import { LocalizedLink as Link } from "@/components/localized-link"
import { Button } from "@/components/ui/button"
import {
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"

interface MarketConversationListPageProps {
  conversationPage: Page<MarketConversationSummaryResponse>
}

export function MarketConversationListPage({
  conversationPage,
}: MarketConversationListPageProps) {
  const { dictionary, formatDateTime, locale } = useLocalization()
  const conversations = conversationPage.content ?? []
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
        withLocalePath(
          `/market-conversations/${createResult.data.id}`,
          locale
        )
      )
      router.refresh()
    })
  }

  return (
    <div className="grid w-full gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(360px,420px)]">
      <section className="rounded-xl border bg-card xl:order-2 xl:sticky xl:top-20 xl:self-start">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-5">
          <div className="flex flex-col gap-1">
            <h2 className="text-base font-medium">
              {dictionary.marketConversations.start.title}
            </h2>
            <p className="text-sm text-muted-foreground">
              {dictionary.marketConversations.start.description}
            </p>
          </div>

          <FieldGroup>
            <Field data-invalid={!!questionError}>
              <FieldLabel htmlFor={questionId}>
                {dictionary.marketConversations.start.questionLabel}
              </FieldLabel>
              <Textarea
                id={questionId}
                value={question}
                onChange={(event) => handleQuestionChange(event.target.value)}
                placeholder={dictionary.marketConversations.start.questionPlaceholder}
                className="min-h-[118px] resize-y"
                aria-invalid={questionError ? true : undefined}
                disabled={isPending}
              />
              <FieldDescription>
                {dictionary.marketConversations.start.questionDescription}
              </FieldDescription>
              <FieldError>{questionError}</FieldError>
            </Field>
          </FieldGroup>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPending}
              className="w-full sm:w-auto xl:w-full"
            >
              {isPending ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <SendHorizontal data-icon="inline-start" />
              )}
              {isPending
                ? dictionary.marketConversations.start.starting
                : dictionary.marketConversations.start.start}
            </Button>
          </div>
        </form>
      </section>

      <section className="flex min-w-0 flex-col xl:order-1">
        <AppListToolbar>
          <AppListToolbarLeading>
            <div className="flex items-center gap-2 text-sm font-medium">
              <MessageSquareText className="size-4 text-muted-foreground" />
              {dictionary.marketConversations.list.title}
            </div>
          </AppListToolbarLeading>
          <AppListToolbarTrailing>
            <AppSelectPageSize
              className="w-full sm:w-auto"
              defaultSize={conversationPage.size}
              showLabel={false}
              triggerClassName="w-full sm:w-[120px]"
            />
          </AppListToolbarTrailing>
        </AppListToolbar>

        <AppListTable>
          <Table>
            <TableHeader>
              <AppListTableHeaderRow>
                <AppListTableHead className="w-[52%]">
                  {dictionary.marketConversations.list.conversationColumn}
                </AppListTableHead>
                <AppListTableHead className="w-44">
                  {dictionary.marketConversations.list.updatedColumn}
                </AppListTableHead>
                <AppListTableHead className="w-44">
                  {dictionary.marketConversations.list.createdColumn}
                </AppListTableHead>
                <AppListTableHead className="w-28 text-right">
                  {dictionary.common.actions}
                </AppListTableHead>
              </AppListTableHeaderRow>
            </TableHeader>
            <TableBody>
              {conversations.length > 0 ? (
                conversations.map((conversation) => (
                  <TableRow key={conversation.id} className="border-border">
                    <TableCell className="align-top whitespace-normal">
                      <div className="flex min-w-0 flex-col gap-1">
                        <Link
                          href={`/market-conversations/${conversation.id}`}
                          className="line-clamp-1 font-medium break-words hover:underline"
                        >
                          {conversation.title}
                        </Link>
                        <span className="text-xs text-muted-foreground">
                          {dictionary.marketConversations.list.workspaceScoped}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="w-44">
                      <AppTimeMetadata icon={Clock3}>
                        {formatDateTime(
                          conversation.updatedAt,
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                          dictionary.common.notAvailable
                        )}
                      </AppTimeMetadata>
                    </TableCell>
                    <TableCell className="w-44">
                      <AppTimeMetadata icon={Clock3}>
                        {formatDateTime(
                          conversation.createdAt,
                          {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                          dictionary.common.notAvailable
                        )}
                      </AppTimeMetadata>
                    </TableCell>
                    <TableCell className="w-28 text-right">
                      <Button asChild variant="ghost" size="icon-sm">
                        <Link href={`/market-conversations/${conversation.id}`}>
                          <Plus data-icon="inline-start" />
                          <span className="sr-only">
                            {dictionary.marketConversations.list.openConversation}
                          </span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <AppListTableEmptyState colSpan={4}>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <MessageSquareText />
                    </EmptyMedia>
                    <EmptyTitle>
                      {dictionary.marketConversations.list.emptyTitle}
                    </EmptyTitle>
                    <EmptyDescription>
                      {dictionary.marketConversations.list.emptyDescription}
                    </EmptyDescription>
                  </EmptyHeader>
                </AppListTableEmptyState>
              )}
            </TableBody>
          </Table>
        </AppListTable>

        {conversationPage.totalElements > 0 ? (
          <AppPaginationControls page={conversationPage} className="mt-4" />
        ) : null}
      </section>
    </div>
  )
}
