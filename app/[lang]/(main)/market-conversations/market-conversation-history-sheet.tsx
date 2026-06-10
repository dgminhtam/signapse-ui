"use client"

import { Clock3, History, MessageSquareText } from "lucide-react"

import { Page } from "@/app/lib/definitions"
import { useLocalization } from "@/app/lib/i18n/provider"
import { MarketConversationSummaryResponse } from "@/app/lib/market-query/definitions"
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
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface MarketConversationHistorySheetProps {
  className?: string
  conversationPage: Page<MarketConversationSummaryResponse>
  currentConversationId?: number
  conversationTitle?: string
}

export function MarketConversationHistorySheet({
  className,
  conversationPage,
  currentConversationId,
  conversationTitle,
}: MarketConversationHistorySheetProps) {
  const { dictionary, formatDateTime } = useLocalization()
  const conversations = conversationPage.content ?? []

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" className={className}>
          <History data-icon="inline-start" />
          {conversationTitle || dictionary.marketConversations.list.openHistory}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-h-96 w-80 overflow-y-auto p-0">
        <PopoverHeader className="border-b px-4 py-3">
          <PopoverTitle>{dictionary.marketConversations.list.title}</PopoverTitle>
        </PopoverHeader>

        <div className="flex flex-col gap-2 px-4 py-3">
          {conversations.length > 0 ? (
            <div className="flex flex-col gap-2">
              {conversations.map((conversation) => {
                const isCurrent = conversation.id === currentConversationId

                return (
                  <Link
                    key={conversation.id}
                    href={`/market-conversations/${conversation.id}`}
                    aria-current={isCurrent ? "page" : undefined}
                    className={cn(
                      "flex min-w-0 flex-col gap-1 rounded-lg border p-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                      isCurrent && "bg-accent text-accent-foreground"
                    )}
                  >
                    <div className="flex min-w-0 items-start justify-between gap-2">
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
                )
              })}
            </div>
          ) : (
            <Empty className="min-h-[180px] border">
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
        </div>
      </PopoverContent>
    </Popover>
  )
}
