"use client"

import { Clock3, History, MessageSquareText } from "lucide-react"

import { Page } from "@/app/lib/definitions"
import { useLocalization } from "@/app/lib/i18n/provider"
import { MarketConversationSummaryResponse } from "@/app/lib/market-query/definitions"
import { AppPaginationControls } from "@/components/app-pagination-controls"
import { AppSelectPageSize } from "@/components/app-select-page-size"
import { AppTimeMetadata } from "@/components/app-time-metadata"
import { LocalizedLink as Link } from "@/components/localized-link"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

interface MarketConversationHistorySheetProps {
  className?: string
  conversationPage: Page<MarketConversationSummaryResponse>
  currentConversationId?: number
}

export function MarketConversationHistorySheet({
  className,
  conversationPage,
  currentConversationId,
}: MarketConversationHistorySheetProps) {
  const { dictionary, formatDateTime } = useLocalization()
  const conversations = conversationPage.content ?? []

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button type="button" variant="outline" className={className}>
          <History data-icon="inline-start" />
          {dictionary.marketConversations.list.openHistory}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{dictionary.marketConversations.list.title}</SheetTitle>
          <SheetDescription>
            {dictionary.marketConversations.list.historyDescription}
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col gap-4 px-4 pb-4">
          {conversationPage.totalElements > 0 ? (
            <div className="flex justify-end">
              <AppSelectPageSize
                className="w-full sm:w-auto"
                defaultSize={conversationPage.size}
                showLabel={false}
                triggerClassName="w-full sm:w-[120px]"
              />
            </div>
          ) : null}

          {conversations.length > 0 ? (
            <div className="flex flex-col gap-2">
              {conversations.map((conversation) => {
                const isCurrent = conversation.id === currentConversationId

                return (
                  <SheetClose key={conversation.id} asChild>
                    <Link
                      href={`/market-conversations/${conversation.id}`}
                      aria-current={isCurrent ? "page" : undefined}
                      className={cn(
                        "flex min-w-0 flex-col gap-2 rounded-lg border p-3 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                        isCurrent && "bg-accent text-accent-foreground"
                      )}
                    >
                      <div className="flex min-w-0 items-start justify-between gap-3">
                        <span className="line-clamp-2 font-medium break-words">
                          {conversation.title}
                        </span>
                        {isCurrent ? (
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {dictionary.marketConversations.list.current}
                          </span>
                        ) : null}
                      </div>
                      <AppTimeMetadata icon={Clock3}>
                        {formatDateTime(
                          conversation.lastModifiedDate,
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
                    </Link>
                  </SheetClose>
                )
              })}
            </div>
          ) : (
            <Empty className="min-h-[260px] border">
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
            </Empty>
          )}

          {conversationPage.totalElements > 0 ? (
            <AppPaginationControls page={conversationPage} />
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}
