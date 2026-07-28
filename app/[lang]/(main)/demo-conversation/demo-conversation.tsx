"use client"

import * as React from "react"
import { useChat } from "@ai-sdk/react"
import { createChat } from "@shadcn/helpers/ai-sdk"
import type { UIMessage } from "ai"
import { useRouter } from "next/navigation"
import {
  ArrowUpIcon,
  ChevronDownIcon,
  GlobeIcon,
  ImageIcon,
  MessageCircleDashedIcon,
  PaperclipIcon,
  PenLineIcon,
  PlusIcon,
  TelescopeIcon,
  XIcon,
} from "lucide-react"

import { useLocalization } from "@/app/lib/i18n/provider"
import { useLocalizedPath } from "@/components/localized-link"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"
import { Message, MessageContent, MessageHeader } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerVisibility,
} from "@/components/ui/message-scroller"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Spinner } from "@/components/ui/spinner"

import { getMessageText, type DemoConversationLabels } from "./fixture"

const USER_PREVIEW_LIMIT = 72
const ASSISTANT_PREVIEW_LIMIT = 160
const HISTORY_TITLE_LIMIT = 56
const HISTORY_BATCH_SIZE = 8
const HISTORY_SCROLL_THRESHOLD = 32

export function DemoConversation() {
  const { dictionary, locale } = useLocalization()
  const router = useRouter()
  const dashboardPath = useLocalizedPath("/dashboard")
  const labels = dictionary.demoConversation
  const chat = React.useMemo(() => {
    const fixture = createChat()
    const scriptedTurns = [
      [labels.script.scrollQuestion, labels.script.scrollAnswer],
      [labels.script.anchorQuestion, labels.script.anchorAnswer],
      [labels.script.readerQuestion, labels.script.readerAnswer],
      [labels.script.accessibilityQuestion, labels.script.accessibilityAnswer],
    ] as const

    for (let index = 0; index < 25; index += 1) {
      const turn = scriptedTurns[index % scriptedTurns.length]

      if (turn) {
        fixture.user(turn[0]).sleep(1000).assistant(turn[1])
      }
    }

    return fixture
  }, [labels])
  const initialMessages = React.useMemo(() => chat.get(0), [chat])
  const historyConversations = React.useMemo(
    () =>
      Array.from({ length: 25 }, (_, index) => {
        const messages = chat.get((index + 1) * 2)
        const userMessage = messages.at(-2)
        const prompt = userMessage ? getMessageText(userMessage) : labels.title

        return {
          id: `fixture-${index + 1}`,
          title: `${truncatePreview(prompt, HISTORY_TITLE_LIMIT)} · ${index + 1}`,
          messages,
        }
      }),
    [chat, labels.title]
  )
  const transport = React.useMemo(() => chat.transport({ delayMs: 20 }), [chat])
  const { messages, sendMessage, status, setMessages } = useChat({
    id: `demo-conversation-${locale}`,
    messages: initialMessages,
    transport,
  })
  const [selectedId, setSelectedId] = React.useState("new")
  const [title, setTitle] = React.useState(labels.title)
  const [historyOpen, setHistoryOpen] = React.useState(false)
  const [historyQuery, setHistoryQuery] = React.useState("")
  const [historyLimit, setHistoryLimit] = React.useState(HISTORY_BATCH_SIZE)
  const filteredHistory = React.useMemo(() => {
    const normalizedQuery = historyQuery.trim().toLocaleLowerCase(locale)

    return normalizedQuery
      ? historyConversations.filter((conversation) =>
          conversation.title.toLocaleLowerCase(locale).includes(normalizedQuery)
        )
      : historyConversations
  }, [historyConversations, historyQuery, locale])
  const visibleHistory = filteredHistory.slice(0, historyLimit)
  const nextMessage = chat.next(messages)
  const isBusy = status === "submitted" || status === "streaming"
  const lastMessage = messages.at(-1)
  const isThinking =
    status === "submitted" ||
    (status === "streaming" &&
      (!lastMessage ||
        lastMessage.role !== "assistant" ||
        getMessageText(lastMessage).length === 0))

  function startNewConversation() {
    setSelectedId("new")
    setTitle(labels.title)
    setMessages(initialMessages)
    setHistoryOpen(false)
  }

  function setHistoryPopoverOpen(open: boolean) {
    setHistoryOpen(open)
    setHistoryQuery("")
    setHistoryLimit(HISTORY_BATCH_SIZE)
  }

  function selectConversation(
    conversation: (typeof historyConversations)[number]
  ) {
    setSelectedId(conversation.id)
    setTitle(conversation.title)
    setMessages(conversation.messages)
    setHistoryOpen(false)
  }

  return (
    <MessageScrollerProvider key={selectedId} autoScroll>
      <div className="relative flex flex-col gap-4">
        <div className="mx-auto w-full max-w-xl">
          <Card size="sm" className="h-140 w-full gap-0">
            <CardHeader className="border-b gap-0">
              <CardTitle className="min-w-0">
                <Popover
                  open={historyOpen}
                  onOpenChange={setHistoryPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      className="max-w-full justify-start"
                      aria-label={`${labels.historyTitle}: ${title}`}
                      disabled={isBusy}
                    >
                      <span className="min-w-0 truncate">{title}</span>
                      <ChevronDownIcon data-icon="inline-end" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    align="start"
                    className="p-0 w-80 max-w-[calc(100vw-2rem)]"
                  >
                    <Command shouldFilter={false}>
                      <CommandInput
                        value={historyQuery}
                        onValueChange={(value) => {
                          setHistoryQuery(value)
                          setHistoryLimit(HISTORY_BATCH_SIZE)
                        }}
                        placeholder={labels.historySearchPlaceholder}
                        aria-label={labels.historySearchLabel}
                      />
                      <CommandList
                        className="max-h-64"
                        onScroll={(event) => {
                          const target = event.currentTarget
                          const distanceToBottom =
                            target.scrollHeight -
                            target.scrollTop -
                            target.clientHeight

                          if (
                            distanceToBottom <= HISTORY_SCROLL_THRESHOLD &&
                            historyLimit < filteredHistory.length
                          ) {
                            setHistoryLimit((current) =>
                              Math.min(
                                current + HISTORY_BATCH_SIZE,
                                filteredHistory.length
                              )
                            )
                          }
                        }}
                      >
                        <CommandEmpty>{labels.historyEmpty}</CommandEmpty>
                        <CommandGroup heading={labels.historyTitle}>
                          {visibleHistory.map((conversation) => (
                            <CommandItem
                              key={conversation.id}
                              value={conversation.id}
                              data-checked={selectedId === conversation.id}
                              aria-current={
                                selectedId === conversation.id
                                  ? "true"
                                  : undefined
                              }
                              onSelect={() => selectConversation(conversation)}
                            >
                              <span className="min-w-0 truncate">
                                {conversation.title}
                              </span>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </CardTitle>
              <CardAction className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={labels.newConversation}
                  onClick={startNewConversation}
                  disabled={isBusy}
                >
                  <PenLineIcon />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={labels.close}
                  onClick={() => router.push(dashboardPath)}
                >
                  <XIcon />
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent className="relative flex-1 overflow-hidden p-0">
              {messages.length === 0 ? (
                <Empty className="h-full">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <MessageCircleDashedIcon />
                    </EmptyMedia>
                    <EmptyTitle>{labels.emptyTitle}</EmptyTitle>
                    <EmptyDescription>
                      {labels.emptyDescription}
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                <MessageScroller>
                  <MessageScrollerViewport
                    aria-label={labels.messagesLabel}
                    className="!no-scrollbar"
                  >
                    <MessageScrollerContent
                      aria-busy={isBusy}
                      className="p-(--card-spacing) sm:pr-14"
                    >
                      {messages.map((message) => (
                        <DemoMessage
                          key={message.id}
                          labels={labels}
                          message={message}
                        />
                      ))}
                      {isThinking ? (
                        <MessageScrollerItem messageId="thinking">
                          <Message align="start">
                            <MessageContent>
                              <Marker role="status">
                                <MarkerIcon>
                                  <Spinner />
                                </MarkerIcon>
                                <MarkerContent className="shimmer">
                                  {labels.thinking}
                                </MarkerContent>
                              </Marker>
                            </MessageContent>
                          </Message>
                        </MessageScrollerItem>
                      ) : null}
                    </MessageScrollerContent>
                  </MessageScrollerViewport>
                  <MessageScrollerButton
                    aria-label={labels.scrollToLatest}
                    className="rounded-full"
                  />
                </MessageScroller>
              )}
              <MessageTrackingRail labels={labels} messages={messages} />
            </CardContent>
            <CardFooter className="flex-col gap-2 border-t-0 bg-card">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!nextMessage || isBusy) {
                    return
                  }
                  void sendMessage(nextMessage)
                }}
                className="w-full"
              >
                <InputGroup className="rounded-2xl border-0">
                  <div className="h-14 w-full px-3 py-2.5">
                    <span
                      className="line-clamp-2 opacity-60 data-[status=ready]:opacity-100"
                      data-status={status}
                    >
                      {nextMessage ? (
                        getMessageText(nextMessage)
                      ) : (
                        <span className="text-muted-foreground">
                          {labels.exhausted}
                        </span>
                      )}
                    </span>
                  </div>
                  <InputGroupAddon align="block-end" className="pt-1">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <InputGroupButton
                          aria-label={labels.addFiles}
                          type="button"
                          size="icon-sm"
                          variant="outline"
                          className="rounded-full"
                        >
                          <PlusIcon />
                        </InputGroupButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="start"
                        side="top"
                        className="w-44"
                      >
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <PaperclipIcon />
                            {labels.addPhotosAndFiles}
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            <ImageIcon />
                            {labels.createImage}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <TelescopeIcon />
                            {labels.deepResearch}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <GlobeIcon />
                            {labels.webSearch}
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <InputGroupButton
                      type="submit"
                      variant="default"
                      size="icon-sm"
                      disabled={!nextMessage || isBusy}
                      className="ml-auto rounded-full"
                      aria-label={isBusy ? labels.sending : labels.send}
                    >
                      <ArrowUpIcon />
                      <span className="sr-only">
                        {isBusy ? labels.sending : labels.send}
                      </span>
                    </InputGroupButton>
                  </InputGroupAddon>
                </InputGroup>
              </form>
            </CardFooter>
          </Card>
        </div>
        <div className="px-0.5 text-center text-xs text-muted-foreground">
          {labels.readOnlyNotice}
        </div>
      </div>
    </MessageScrollerProvider>
  )
}

function MessageTrackingRail({
  labels,
  messages,
}: {
  labels: DemoConversationLabels
  messages: UIMessage[]
}) {
  const railRef = React.useRef<HTMLDivElement>(null)
  const { scrollToMessage } = useMessageScroller()
  const { currentAnchorId, visibleMessageIds } = useMessageScrollerVisibility()
  const turns = messages.flatMap((message, index) =>
    message.role === "user"
      ? [
          {
            user: message,
            assistant:
              messages[index + 1]?.role === "assistant"
                ? messages[index + 1]
                : undefined,
          },
        ]
      : []
  )

  React.useEffect(() => {
    if (!currentAnchorId) {
      return
    }

    railRef.current
      ?.querySelector<HTMLElement>(
        `[data-message-id="${CSS.escape(currentAnchorId)}"]`
      )
      ?.scrollIntoView({ block: "nearest" })
  }, [currentAnchorId])

  if (turns.length === 0) {
    return null
  }

  return (
    <nav
      aria-label={labels.trackingLabel}
      className="absolute inset-y-2 right-2 hidden w-8 overflow-hidden sm:block"
    >
      <div
        ref={railRef}
        className="no-scrollbar h-full scroll-fade overflow-y-auto overscroll-contain"
      >
        <div className="flex min-h-full flex-col items-center justify-center">
          {turns.map((turn, index) => {
            const isActive = currentAnchorId === turn.user.id
            const isVisible = visibleMessageIds.includes(turn.user.id)
            const userPreview = truncatePreview(
              getMessageText(turn.user),
              USER_PREVIEW_LIMIT
            )
            const assistantPreview = truncatePreview(
              turn.assistant ? getMessageText(turn.assistant) : labels.thinking,
              ASSISTANT_PREVIEW_LIMIT
            )

            return (
              <HoverCard key={turn.user.id} openDelay={150} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-xs"
                    data-message-id={turn.user.id}
                    aria-label={`${labels.jumpToTurn} ${index + 1}`}
                    aria-current={isActive ? "step" : undefined}
                    onClick={() => {
                      void scrollToMessage(turn.user.id)
                    }}
                  >
                    <span
                      className={`h-px w-1.5 rounded-full transition-[width] group-hover/button:w-4 group-focus-visible/button:w-4 ${
                        isActive
                          ? "bg-foreground"
                          : isVisible
                            ? "bg-muted-foreground"
                            : "bg-muted-foreground/40"
                      }`}
                    />
                  </Button>
                </HoverCardTrigger>
                <HoverCardContent
                  side="left"
                  align="center"
                  sideOffset={8}
                  className="w-80 max-w-[calc(100vw-2rem)] bg-muted ring-0"
                >
                  <div className="flex flex-col gap-1">
                    <p className="line-clamp-2 font-medium">{userPreview}</p>
                    <p className="line-clamp-3 text-muted-foreground">
                      {assistantPreview}
                    </p>
                  </div>
                </HoverCardContent>
              </HoverCard>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

function truncatePreview(text: string, maxLength: number) {
  const trimmedText = text.trim()

  return trimmedText.length > maxLength
    ? `${trimmedText.slice(0, maxLength).trimEnd()}…`
    : trimmedText
}

function DemoMessage({
  labels,
  message,
}: {
  labels: DemoConversationLabels
  message: UIMessage
}) {
  const isUser = message.role === "user"

  return (
    <MessageScrollerItem
      messageId={message.id}
      scrollAnchor={isUser}
      className="animate-in fade-in slide-in-from-bottom-2 motion-reduce:animate-none"
    >
      <Message align={isUser ? "end" : "start"}>
        <MessageContent>
          <MessageHeader className="sr-only">
            {isUser ? labels.userRole : labels.assistantRole}
          </MessageHeader>
          <Bubble
            variant={isUser ? "default" : "ghost"}
            align={isUser ? "end" : "start"}
          >
            <BubbleContent>
              <p className="whitespace-pre-wrap">{getMessageText(message)}</p>
            </BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    </MessageScrollerItem>
  )
}
