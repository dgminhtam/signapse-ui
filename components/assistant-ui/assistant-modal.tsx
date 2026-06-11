"use client"

import * as React from "react"
import {
  AssistantModalPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  type MessageState,
} from "@assistant-ui/react"
import {
  ArrowUpIcon,
  BotIcon,
  ChevronDownIcon,
  HistoryIcon,
  MessageSquareTextIcon,
  Maximize2Icon,
  Minimize2Icon,
  PenLineIcon,
  RefreshCcwIcon,
  XIcon,
} from "lucide-react"

import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button"
import type { MarketConversationAssistantController } from "@/components/assistant-ui/use-market-conversation-assistant"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
  InputGroupText,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

interface AssistantModalProps {
  labels: Dictionary["aiAssistant"]
  controller: MarketConversationAssistantController
}

export function AssistantModal({ labels, controller }: AssistantModalProps) {
  const [open, setOpen] = React.useState(false)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const closeButtonRef = React.useRef<HTMLButtonElement>(null)
  const panel = (
    <AssistantModalPanel
      labels={labels}
      controller={controller}
      closeButtonRef={closeButtonRef}
      isFullscreen={isFullscreen}
      setOpen={setOpen}
      setIsFullscreen={setIsFullscreen}
    />
  )

  return (
    <AssistantModalPrimitive.Root
      open={open}
      onOpenChange={setOpen}
      unstable_openOnRunStart={false}
    >
      <AssistantModalPrimitive.Anchor className="fixed end-4 bottom-4">
        <AssistantModalPrimitive.Trigger asChild>
          <AssistantModalButton labels={labels} open={open} />
        </AssistantModalPrimitive.Trigger>
      </AssistantModalPrimitive.Anchor>

      {isFullscreen && open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="global-ai-assistant-title"
          aria-describedby="global-ai-assistant-description"
          className="fixed inset-4 z-50 flex flex-col overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-md outline-none"
        >
          {panel}
        </div>
      ) : (
        <AssistantModalPrimitive.Content
          sideOffset={12}
          dissmissOnInteractOutside
          aria-labelledby="global-ai-assistant-title"
          aria-describedby="global-ai-assistant-description"
          onOpenAutoFocus={(event) => {
            event.preventDefault()
            closeButtonRef.current?.focus()
          }}
          className="flex h-[min(42rem,calc(100dvh-5.5rem))] w-[calc(100vw-2rem)] max-w-2xl flex-col overflow-hidden rounded-xl border bg-popover text-popover-foreground shadow-md outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95"
        >
          {panel}
        </AssistantModalPrimitive.Content>
      )}
    </AssistantModalPrimitive.Root>
  )
}

interface AssistantModalPanelProps {
  labels: Dictionary["aiAssistant"]
  controller: MarketConversationAssistantController
  closeButtonRef: React.RefObject<HTMLButtonElement | null>
  isFullscreen: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>
}

function AssistantModalPanel({
  labels,
  controller,
  closeButtonRef,
  isFullscreen,
  setOpen,
  setIsFullscreen,
}: AssistantModalPanelProps) {
  return (
    <>
        <header className="flex shrink-0 items-center justify-between gap-3 p-3">
          <div className="flex min-w-0 items-center gap-2">
            <BotIcon className="size-4 shrink-0" aria-hidden="true" />
            <div className="min-w-0">
              <h2
                id="global-ai-assistant-title"
                className="truncate text-sm font-medium"
              >
                {controller.selectedConversation?.title ?? labels.title}
              </h2>
              <p
                id="global-ai-assistant-description"
                className="truncate text-xs text-muted-foreground"
              >
                {controller.selectedConversation
                  ? labels.persistedThread
                  : labels.newThread}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <TooltipIconButton
              type="button"
              variant="ghost"
              size="icon"
              tooltip={labels.newConversation}
              aria-label={labels.newConversation}
              onClick={controller.startNewConversation}
            >
              <PenLineIcon />
            </TooltipIconButton>
            <ConversationHistory labels={labels} controller={controller} />
            <TooltipIconButton
              type="button"
              variant="ghost"
              size="icon"
              tooltip={
                isFullscreen ? labels.exitFullscreen : labels.enterFullscreen
              }
              aria-label={
                isFullscreen ? labels.exitFullscreen : labels.enterFullscreen
              }
              aria-pressed={isFullscreen}
              onClick={() => setIsFullscreen((current) => !current)}
            >
              {isFullscreen ? <Minimize2Icon /> : <Maximize2Icon />}
            </TooltipIconButton>
            <TooltipIconButton
              ref={closeButtonRef}
              type="button"
              variant="ghost"
              size="icon"
              tooltip={labels.close}
              aria-label={labels.close}
              onClick={() => setOpen(false)}
            >
              <XIcon />
            </TooltipIconButton>
          </div>
        </header>

        <Separator />

        <ThreadPrimitive.Root className="flex min-h-0 flex-1 flex-col">
          <ThreadPrimitive.Viewport
            className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4"
            autoScroll
            scrollToBottomOnThreadSwitch
          >
            <ThreadPrimitive.Empty>
              <AssistantEmptyState labels={labels} controller={controller} />
            </ThreadPrimitive.Empty>

            {controller.selectedConversation ? (
              <OlderMessagesControl labels={labels} controller={controller} />
            ) : null}

            <ThreadPrimitive.Messages>
              {({ message }) => (
                <AssistantMessage message={message} labels={labels} />
              )}
            </ThreadPrimitive.Messages>

            {controller.messagesError ? (
              <RetryState
                message={controller.messagesError}
                retryLabel={labels.retry}
                onRetry={
                  controller.selectedConversation
                    ? () =>
                        void controller.selectConversation(
                          controller.selectedConversation!
                        )
                    : undefined
                }
              />
            ) : null}
          </ThreadPrimitive.Viewport>

          <div className="flex shrink-0 flex-col gap-3 p-4 pt-0">
            <FieldGroup>
              <Field>
                <FieldLabel
                  htmlFor="global-ai-assistant-message"
                  className="sr-only"
                >
                  {labels.messageLabel}
                </FieldLabel>
                <ComposerPrimitive.Root>
                  <InputGroup>
                    <ComposerPrimitive.Input asChild submitMode="enter">
                      <InputGroupTextarea
                        id="global-ai-assistant-message"
                        rows={2}
                        placeholder={labels.messagePlaceholder}
                        aria-describedby="global-ai-assistant-composer-state"
                      />
                    </ComposerPrimitive.Input>
                    <InputGroupAddon
                      align="block-end"
                      className="justify-between"
                    >
                      <InputGroupText id="global-ai-assistant-composer-state">
                        {controller.isSubmitting ? (
                          <>
                            <Spinner />
                            {labels.pending}
                          </>
                        ) : controller.submissionError ? (
                          controller.submissionError
                        ) : (
                          labels.composerHint
                        )}
                      </InputGroupText>
                      <ComposerPrimitive.Send asChild>
                        <InputGroupButton
                          type="submit"
                          variant="default"
                          size="icon-sm"
                          aria-label={labels.send}
                        >
                          {controller.isSubmitting ? (
                            <Spinner />
                          ) : (
                            <ArrowUpIcon />
                          )}
                        </InputGroupButton>
                      </ComposerPrimitive.Send>
                    </InputGroupAddon>
                  </InputGroup>
                </ComposerPrimitive.Root>
              </Field>
            </FieldGroup>

          </div>
        </ThreadPrimitive.Root>
    </>
  )
}

function AssistantEmptyState({
  labels,
  controller,
}: {
  labels: Dictionary["aiAssistant"]
  controller: MarketConversationAssistantController
}) {
  if (controller.isMessagesLoading) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center gap-2 text-sm text-muted-foreground">
        <Spinner />
        {labels.loadingMessages}
      </div>
    )
  }

  return (
    <Empty className="min-h-0 flex-1">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <MessageSquareTextIcon />
        </EmptyMedia>
        <EmptyTitle>{labels.welcomeTitle}</EmptyTitle>
        <EmptyDescription>{labels.welcomeDescription}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

function ConversationHistory({
  labels,
  controller,
}: {
  labels: Dictionary["aiAssistant"]
  controller: MarketConversationAssistantController
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <TooltipIconButton
          type="button"
          variant="ghost"
          size="icon"
          tooltip={labels.history}
          aria-label={labels.history}
        >
          <HistoryIcon />
        </TooltipIconButton>
      </PopoverTrigger>
      <PopoverContent align="end" className="max-h-96 overflow-y-auto">
        <PopoverHeader>
          <PopoverTitle>{labels.historyTitle}</PopoverTitle>
        </PopoverHeader>
        <div className="flex flex-col gap-1">
          {controller.historyError ? (
            <RetryState
              message={controller.historyError}
              retryLabel={labels.retry}
              onRetry={controller.retryHistory}
            />
          ) : null}
          {controller.conversations.length === 0 &&
          !controller.isHistoryLoading &&
          !controller.historyError ? (
            <p className="px-2 py-3 text-sm text-muted-foreground">
              {labels.historyEmpty}
            </p>
          ) : null}
          {controller.conversations.map((conversation) => (
            <Button
              key={conversation.id}
              type="button"
              variant="ghost"
              className="justify-start"
              onClick={() => void controller.selectConversation(conversation)}
            >
              <MessageSquareTextIcon data-icon="inline-start" />
              <span className="truncate">{conversation.title}</span>
            </Button>
          ))}
          {controller.hasMoreHistory ? (
            <Button
              type="button"
              variant="ghost"
              disabled={controller.isHistoryLoading}
              onClick={() => void controller.loadMoreHistory()}
            >
              {controller.isHistoryLoading ? (
                <Spinner />
              ) : (
                <ChevronDownIcon data-icon="inline-start" />
              )}
              {labels.loadMoreHistory}
            </Button>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function OlderMessagesControl({
  labels,
  controller,
}: {
  labels: Dictionary["aiAssistant"]
  controller: MarketConversationAssistantController
}) {
  if (!controller.hasMoreMessages) {
    return null
  }

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={controller.isOlderMessagesLoading}
      onClick={() => void controller.loadOlderMessages()}
    >
      {controller.isOlderMessagesLoading ? (
        <Spinner />
      ) : (
        <ChevronDownIcon data-icon="inline-start" />
      )}
      {labels.loadOlderMessages}
    </Button>
  )
}

function AssistantMessage({
  message,
  labels,
}: {
  message: MessageState
  labels: Dictionary["aiAssistant"]
}) {
  const text = message.content
    .filter((part): part is { type: "text"; text: string } => part.type === "text")
    .map((part) => part.text)
    .join("\n")
  const isUser = message.role === "user"
  const isFailed = message.status?.type === "incomplete"

  return (
    <MessagePrimitive.Root
      className={cn(
        "flex w-full",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-lg px-3 py-2 text-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted",
          isFailed && "border border-destructive"
        )}
      >
        <p className="whitespace-pre-wrap break-words">
          {text || (isFailed ? labels.messageFailed : labels.emptyMessage)}
        </p>
        {isFailed ? (
          <p className="mt-1 text-xs text-muted-foreground">
            {labels.messageFailed}
          </p>
        ) : null}
      </div>
    </MessagePrimitive.Root>
  )
}

function RetryState({
  message,
  retryLabel,
  onRetry,
}: {
  message: string
  retryLabel: string
  onRetry?: () => void
}) {
  return (
    <div
      role="alert"
      className="flex flex-col gap-2 rounded-lg border border-destructive p-2 text-sm"
    >
      <p className="text-muted-foreground">{message}</p>
      {onRetry ? (
        <Button type="button" variant="ghost" onClick={onRetry}>
          <RefreshCcwIcon data-icon="inline-start" />
          {retryLabel}
        </Button>
      ) : null}
    </div>
  )
}

interface AssistantModalButtonProps {
  labels: Dictionary["aiAssistant"]
  open: boolean
  className?: string
}

const AssistantModalButton = React.forwardRef<
  HTMLButtonElement,
  AssistantModalButtonProps
>(({ labels, open, className, ...props }, ref) => {
  const accessibleLabel = open ? labels.close : labels.open

  return (
    <TooltipIconButton
      ref={ref}
      type="button"
      variant="default"
      size="icon-lg"
      tooltip={accessibleLabel}
      side="left"
      aria-label={accessibleLabel}
      aria-expanded={open}
      className={cn("size-12 rounded-xl", className)}
      {...props}
    >
      {open ? <ChevronDownIcon /> : <BotIcon />}
    </TooltipIconButton>
  )
})

AssistantModalButton.displayName = "AssistantModalButton"
