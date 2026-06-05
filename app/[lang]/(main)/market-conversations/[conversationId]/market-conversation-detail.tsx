"use client"

import { FormEvent, useId, useMemo, useState, useTransition } from "react"
import {
  ArrowLeft,
  Bot,
  CalendarClock,
  Clock3,
  ExternalLink,
  FileText,
  LinkIcon,
  MessageSquareText,
  RefreshCcw,
  SendHorizontal,
  Sparkles,
  TriangleAlert,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

import {
  deliverMarketAnalysisToTelegram,
  getMarketAnalysisById,
  getMarketAnalysisEvidence,
  submitMarketConversationMessage,
} from "@/app/api/market-conversations/action"
import { useLocalization } from "@/app/lib/i18n/provider"
import {
  MarketAnalysisEvidenceResponse,
  MarketAnalysisResponse,
  MarketChatMessageResponse,
  MarketConversationDetailResponse,
} from "@/app/lib/market-query/definitions"
import { TelegramDestinationResponse } from "@/app/lib/telegram/definitions"
import { AppTimeMetadata } from "@/components/app-time-metadata"
import { LocalizedLink as Link } from "@/components/localized-link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Empty,
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface MarketConversationDetailPageProps {
  conversation: MarketConversationDetailResponse
  permissions: {
    economicCalendar: boolean
    events: boolean
    narratives: boolean
    newsArticles: boolean
  }
  telegramDestinations: TelegramDestinationResponse[]
}

type AnalysisLoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "loaded"; data: MarketAnalysisResponse }
  | { status: "error"; error: string }

type EvidenceLoadState =
  | { status: "idle" }
  | { status: "loading"; analysisId: number }
  | { status: "loaded"; analysisId: number; data: MarketAnalysisEvidenceResponse[] }
  | { status: "error"; analysisId: number; error: string }

interface EntityPermissions {
  economicCalendar: boolean
  events: boolean
  narratives: boolean
  newsArticles: boolean
}

export function MarketConversationDetailPage({
  conversation,
  permissions,
  telegramDestinations,
}: MarketConversationDetailPageProps) {
  const { dictionary, formatDateTime } = useLocalization()
  const [messages, setMessages] = useState(conversation.messages)
  const [message, setMessage] = useState("")
  const [messageError, setMessageError] = useState<string | null>(null)
  const [pendingDraft, setPendingDraft] = useState<string | null>(null)
  const [isSubmitting, startSubmitTransition] = useTransition()
  const [analysisCache, setAnalysisCache] = useState<Record<number, AnalysisLoadState>>({})
  const [expandedAnalysisIds, setExpandedAnalysisIds] = useState<Set<number>>(
    () => new Set()
  )
  const [evidenceOpen, setEvidenceOpen] = useState(false)
  const [evidenceState, setEvidenceState] = useState<EvidenceLoadState>({
    status: "idle",
  })
  const messageId = useId()
  const router = useRouter()
  const activeDestinations = useMemo(
    () => telegramDestinations.filter((destination) => destination.status === "ACTIVE"),
    [telegramDestinations]
  )
  const visibleMessages = useMemo(() => {
    if (!pendingDraft) {
      return messages
    }

    return [
      ...messages,
      createLocalMessage("USER", "TEXT", "COMPLETED", pendingDraft),
      createLocalMessage(
        "ASSISTANT",
        "ANALYSIS",
        "PENDING",
        dictionary.marketConversations.detail.pendingAssistant
      ),
    ]
  }, [dictionary.marketConversations.detail.pendingAssistant, messages, pendingDraft])

  function handleMessageChange(value: string) {
    setMessage(value)
    if (messageError) {
      setMessageError(null)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedMessage = message.trim()

    if (!trimmedMessage) {
      setMessageError(dictionary.marketConversations.messageRequired)
      return
    }

    setMessageError(null)
    setPendingDraft(trimmedMessage)

    startSubmitTransition(async () => {
      const result = await submitMarketConversationMessage(conversation.id, {
        message: trimmedMessage,
      })

      setPendingDraft(null)

      if (!result.success) {
        setMessageError(result.error)
        toast.error(result.error)
        return
      }

      setMessages((current) => [
        ...current,
        result.data.userMessage,
        result.data.assistantMessage,
      ])
      setMessage("")
      toast.success(dictionary.marketConversations.detail.submitSuccess)
      router.refresh()
    })
  }

  async function loadAnalysis(analysisId: number) {
    const current = analysisCache[analysisId]

    if (current?.status === "loaded" || current?.status === "loading") {
      return
    }

    setAnalysisCache((cache) => ({
      ...cache,
      [analysisId]: { status: "loading" },
    }))

    try {
      const data = await getMarketAnalysisById(analysisId)
      setAnalysisCache((cache) => ({
        ...cache,
        [analysisId]: { status: "loaded", data },
      }))
    } catch (error: unknown) {
      setAnalysisCache((cache) => ({
        ...cache,
        [analysisId]: {
          status: "error",
          error:
            error instanceof Error
              ? error.message
              : dictionary.marketConversations.analysis.loadError,
        },
      }))
    }
  }

  function toggleAnalysis(analysisId: number) {
    setExpandedAnalysisIds((current) => {
      const next = new Set(current)

      if (next.has(analysisId)) {
        next.delete(analysisId)
      } else {
        next.add(analysisId)
        void loadAnalysis(analysisId)
      }

      return next
    })
  }

  async function openEvidence(analysisId: number) {
    setEvidenceOpen(true)
    setEvidenceState({ status: "loading", analysisId })

    try {
      const data = await getMarketAnalysisEvidence(analysisId)
      setEvidenceState({ status: "loaded", analysisId, data })
    } catch (error: unknown) {
      setEvidenceState({
        status: "error",
        analysisId,
        error:
          error instanceof Error
            ? error.message
            : dictionary.marketConversations.evidence.loadError,
      })
    }
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          <Button asChild variant="ghost" className="w-fit">
            <Link href="/market-conversations">
              <ArrowLeft data-icon="inline-start" />
              {dictionary.marketConversations.detail.backToList}
            </Link>
          </Button>
          <div className="flex min-w-0 flex-col gap-1">
            <h1 className="text-xl font-semibold tracking-normal">
              {conversation.title}
            </h1>
            <div className="flex flex-wrap gap-3">
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
              <AppTimeMetadata icon={CalendarClock}>
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
            </div>
          </div>
        </div>
      </div>

      <section
        aria-label={dictionary.marketConversations.detail.timelineLabel}
        className="flex flex-col gap-4"
      >
        {visibleMessages.length > 0 ? (
          visibleMessages.map((item) => (
            <TimelineMessage
              key={item.id}
              message={item}
              analysisState={
                item.analysisId ? analysisCache[item.analysisId] ?? { status: "idle" } : { status: "idle" }
              }
              analysisExpanded={item.analysisId ? expandedAnalysisIds.has(item.analysisId) : false}
              activeDestinations={activeDestinations}
              onEvidenceOpen={openEvidence}
              onToggleAnalysis={toggleAnalysis}
              onRetryAnalysis={loadAnalysis}
            />
          ))
        ) : (
          <Empty className="min-h-[260px] border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MessageSquareText />
              </EmptyMedia>
              <EmptyTitle>
                {dictionary.marketConversations.detail.emptyTitle}
              </EmptyTitle>
              <EmptyDescription>
                {dictionary.marketConversations.detail.emptyDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </section>

      <section className="rounded-xl border bg-card">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-4">
          <FieldGroup>
            <Field data-invalid={!!messageError}>
              <FieldLabel htmlFor={messageId}>
                {dictionary.marketConversations.detail.messageLabel}
              </FieldLabel>
              <Textarea
                id={messageId}
                value={message}
                onChange={(event) => handleMessageChange(event.target.value)}
                placeholder={dictionary.marketConversations.detail.messagePlaceholder}
                className="min-h-[104px] resize-y"
                aria-invalid={messageError ? true : undefined}
                disabled={isSubmitting}
              />
              <FieldDescription>
                {dictionary.marketConversations.detail.messageDescription}
              </FieldDescription>
              <FieldError>{messageError}</FieldError>
            </Field>
          </FieldGroup>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <Spinner data-icon="inline-start" />
              ) : (
                <SendHorizontal data-icon="inline-start" />
              )}
              {isSubmitting
                ? dictionary.marketConversations.detail.submitting
                : dictionary.marketConversations.detail.submit}
            </Button>
          </div>
        </form>
      </section>

      <EvidenceSheet
        open={evidenceOpen}
        state={evidenceState}
        entityPermissions={permissions}
        onOpenChange={setEvidenceOpen}
        onRetry={(analysisId) => void openEvidence(analysisId)}
      />
    </div>
  )
}

function createLocalMessage(
  role: MarketChatMessageResponse["role"],
  kind: MarketChatMessageResponse["kind"],
  status: MarketChatMessageResponse["status"],
  content: string
): MarketChatMessageResponse {
  return {
    id: -Date.now() - Math.floor(Math.random() * 1000),
    role,
    kind,
    status,
    content,
    analysisId: null,
    failureReason: null,
    createdAt: new Date().toISOString(),
  }
}

function TimelineMessage({
  activeDestinations,
  analysisExpanded,
  analysisState,
  message,
  onEvidenceOpen,
  onRetryAnalysis,
  onToggleAnalysis,
}: {
  activeDestinations: TelegramDestinationResponse[]
  analysisExpanded: boolean
  analysisState: AnalysisLoadState
  message: MarketChatMessageResponse
  onEvidenceOpen: (analysisId: number) => void
  onRetryAnalysis: (analysisId: number) => void
  onToggleAnalysis: (analysisId: number) => void
}) {
  const { dictionary, formatDateTime } = useLocalization()
  const isUser = message.role === "USER"
  const isAssistantAnalysis = message.role === "ASSISTANT" && message.kind === "ANALYSIS"

  return (
    <article
      className={cn(
        "flex",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "flex max-w-[min(100%,52rem)] flex-col gap-3 rounded-xl border px-4 py-3",
          isUser ? "bg-muted/30" : "bg-card"
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={isUser ? "secondary" : "outline"}>
            {isUser
              ? dictionary.marketConversations.detail.userRole
              : dictionary.marketConversations.detail.assistantRole}
          </Badge>
          <AppTimeMetadata icon={Clock3}>
            {formatDateTime(
              message.createdAt,
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
          {message.status === "PENDING" ? (
            <Badge variant="secondary">
              <Spinner data-icon="inline-start" />
              {dictionary.marketConversations.statusLabels.PENDING}
            </Badge>
          ) : null}
          {message.status === "FAILED" ? (
            <Badge variant="destructive">
              {dictionary.marketConversations.statusLabels.FAILED}
            </Badge>
          ) : null}
        </div>

        {message.status === "FAILED" ? (
          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2 text-destructive">
              <TriangleAlert className="size-4" />
              {message.failureReason || dictionary.marketConversations.detail.messageFailed}
            </div>
          </div>
        ) : (
          <p className="whitespace-pre-wrap text-sm leading-7">
            {message.content?.trim() || dictionary.marketConversations.detail.emptyMessage}
          </p>
        )}

        {isAssistantAnalysis && message.analysisId ? (
          <AssistantAnalysisActions
            activeDestinations={activeDestinations}
            analysisExpanded={analysisExpanded}
            analysisId={message.analysisId}
            analysisState={analysisState}
            messageStatus={message.status}
            onEvidenceOpen={onEvidenceOpen}
            onRetryAnalysis={onRetryAnalysis}
            onToggleAnalysis={onToggleAnalysis}
          />
        ) : null}
      </div>
    </article>
  )
}

function AssistantAnalysisActions({
  activeDestinations,
  analysisExpanded,
  analysisId,
  analysisState,
  messageStatus,
  onEvidenceOpen,
  onRetryAnalysis,
  onToggleAnalysis,
}: {
  activeDestinations: TelegramDestinationResponse[]
  analysisExpanded: boolean
  analysisId: number
  analysisState: AnalysisLoadState
  messageStatus: MarketChatMessageResponse["status"]
  onEvidenceOpen: (analysisId: number) => void
  onRetryAnalysis: (analysisId: number) => void
  onToggleAnalysis: (analysisId: number) => void
}) {
  const { dictionary } = useLocalization()
  const canUseActions = messageStatus === "COMPLETED"

  return (
    <div className="flex flex-col gap-3 border-t pt-3">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={!canUseActions}
          onClick={() => onToggleAnalysis(analysisId)}
        >
          <Sparkles data-icon="inline-start" />
          {analysisExpanded
            ? dictionary.marketConversations.analysis.hideDetails
            : dictionary.marketConversations.analysis.showDetails}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!canUseActions}
          onClick={() => onEvidenceOpen(analysisId)}
        >
          <FileText data-icon="inline-start" />
          {dictionary.marketConversations.evidence.open}
        </Button>
      </div>

      {analysisExpanded ? (
        <AnalysisDetails
          analysisId={analysisId}
          state={analysisState}
          onRetry={onRetryAnalysis}
        />
      ) : null}

      {canUseActions ? (
        <TelegramDeliveryControl
          activeDestinations={activeDestinations}
          analysisId={analysisId}
        />
      ) : null}
    </div>
  )
}

function AnalysisDetails({
  analysisId,
  onRetry,
  state,
}: {
  analysisId: number
  onRetry: (analysisId: number) => void
  state: AnalysisLoadState
}) {
  const { dictionary, formatPercent } = useLocalization()

  if (state.status === "idle" || state.status === "loading") {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner />
        {dictionary.marketConversations.analysis.loading}
      </div>
    )
  }

  if (state.status === "error") {
    return (
      <div className="flex flex-col gap-2 rounded-lg border border-destructive/20 p-3 text-sm">
        <span className="text-destructive">{state.error}</span>
        <Button type="button" variant="outline" onClick={() => onRetry(analysisId)}>
          <RefreshCcw data-icon="inline-start" />
          {dictionary.common.retry}
        </Button>
      </div>
    )
  }

  const analysis = state.data
  const confidence =
    typeof analysis.confidence === "number"
      ? formatPercent(analysis.confidence)
      : dictionary.marketConversations.analysis.confidenceUnknown

  return (
    <div className="grid gap-3 rounded-lg border bg-muted/15 p-3">
      {analysis.status === "FAILED" ? (
        <div className="flex items-center gap-2 text-sm text-destructive">
          <TriangleAlert className="size-4" />
          {analysis.failureReason || dictionary.marketConversations.analysis.failed}
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        <DetailBlock
          title={dictionary.marketConversations.analysis.confidence}
          value={confidence}
        />
        <DetailBlock
          title={dictionary.marketConversations.analysis.model}
          value={
            [analysis.modelProvider, analysis.modelName]
              .filter(Boolean)
              .join(" / ") || dictionary.common.notAvailable
          }
        />
      </div>

      <ListBlock
        title={dictionary.marketConversations.analysis.limitations}
        items={analysis.limitations}
        empty={dictionary.marketConversations.analysis.limitationsEmpty}
      />
      <ListBlock
        title={dictionary.marketConversations.analysis.assets}
        items={analysis.assetsConsidered}
        empty={dictionary.marketConversations.analysis.assetsEmpty}
        asBadges
      />
      <ListBlock
        title={dictionary.marketConversations.analysis.reasoning}
        items={analysis.reasoningChain}
        empty={dictionary.marketConversations.analysis.reasoningEmpty}
        ordered
      />
      <ObjectSummaryBlock
        title={dictionary.marketConversations.analysis.keyEvents}
        items={analysis.keyEvents}
        empty={dictionary.marketConversations.analysis.keyEventsEmpty}
      />
      <ObjectSummaryBlock
        title={dictionary.marketConversations.analysis.keyNarratives}
        items={analysis.keyNarratives}
        empty={dictionary.marketConversations.analysis.keyNarrativesEmpty}
      />
    </div>
  )
}

function DetailBlock({ title, value }: { title: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-background/70 p-3">
      <span className="text-xs text-muted-foreground">{title}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  )
}

function ListBlock({
  asBadges,
  empty,
  items,
  ordered,
  title,
}: {
  asBadges?: boolean
  empty: string
  items: string[]
  ordered?: boolean
  title: string
}) {
  const ListElement = ordered ? "ol" : "ul"

  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-sm font-medium">{title}</h3>
      {items.length > 0 ? (
        asBadges ? (
          <div className="flex flex-wrap gap-2">
            {items.map((item) => (
              <Badge key={item} variant="secondary">
                {item}
              </Badge>
            ))}
          </div>
        ) : (
          <ListElement className="flex flex-col gap-1 text-sm text-muted-foreground">
            {items.map((item, index) => (
              <li key={`${item}-${index}`}>{item}</li>
            ))}
          </ListElement>
        )
      ) : (
        <p className="text-sm text-muted-foreground">{empty}</p>
      )}
    </section>
  )
}

function ObjectSummaryBlock({
  empty,
  items,
  title,
}: {
  empty: string
  items: Record<string, unknown>[]
  title: string
}) {
  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-sm font-medium">{title}</h3>
      {items.length > 0 ? (
        <div className="grid gap-2">
          {items.map((item, index) => (
            <div key={index} className="rounded-lg bg-background/70 p-3">
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium">
                  {getReadableObjectTitle(item, index)}
                </span>
                <span className="line-clamp-3 text-sm text-muted-foreground">
                  {getReadableObjectDescription(item)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{empty}</p>
      )}
    </section>
  )
}

function getReadableObjectTitle(item: Record<string, unknown>, index: number) {
  return (
    getStringField(item, "title") ||
    getStringField(item, "name") ||
    getStringField(item, "eventTitle") ||
    getStringField(item, "narrativeTitle") ||
    `#${getStringField(item, "id") || index + 1}`
  )
}

function getReadableObjectDescription(item: Record<string, unknown>) {
  return (
    getStringField(item, "description") ||
    getStringField(item, "summary") ||
    getStringField(item, "thesis") ||
    getStringField(item, "evidenceNote") ||
    getStringField(item, "status") ||
    "-"
  )
}

function getStringField(item: Record<string, unknown>, key: string) {
  const value = item[key]

  if (typeof value === "string" && value.trim()) {
    return value.trim()
  }

  if (typeof value === "number") {
    return value.toString()
  }

  return ""
}

function TelegramDeliveryControl({
  activeDestinations,
  analysisId,
}: {
  activeDestinations: TelegramDestinationResponse[]
  analysisId: number
}) {
  const { dictionary } = useLocalization()
  const [selectedDestinationId, setSelectedDestinationId] = useState("")
  const [deliveryMessage, setDeliveryMessage] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const singleDestinationId =
    activeDestinations.length === 1 ? activeDestinations[0]?.id.toString() ?? "" : ""
  const selectedDestinationIsActive = activeDestinations.some(
    (destination) => destination.id.toString() === selectedDestinationId
  )
  const effectiveSelectedDestinationId = selectedDestinationIsActive
    ? selectedDestinationId
    : singleDestinationId

  if (activeDestinations.length === 0) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border bg-muted/15 p-3 text-sm text-muted-foreground">
        <span>{dictionary.marketConversations.telegram.noDestinations}</span>
        <Button asChild variant="outline" className="w-fit">
          <Link href="/telegram">
            <LinkIcon data-icon="inline-start" />
            {dictionary.marketConversations.telegram.setup}
          </Link>
        </Button>
      </div>
    )
  }

  function handleSend() {
    const destinationId = Number(effectiveSelectedDestinationId)

    if (!Number.isInteger(destinationId) || destinationId <= 0) {
      setDeliveryMessage(dictionary.marketConversations.telegram.destinationRequired)
      return
    }

    setDeliveryMessage(null)
    startTransition(async () => {
      const result = await deliverMarketAnalysisToTelegram(analysisId, {
        destinationId,
      })

      if (!result.success) {
        setDeliveryMessage(result.error)
        toast.error(result.error)
        return
      }

      const delivery = result.data
      const isSuccess = delivery.duplicate || delivery.status === "SENT"
      const message = delivery.duplicate
        ? dictionary.marketConversations.telegram.duplicate
        : isSuccess
          ? dictionary.marketConversations.telegram.sent
          : delivery.failureReason || dictionary.marketConversations.telegram.sendError

      setDeliveryMessage(message)

      if (isSuccess) {
        toast.success(message)
      } else {
        toast.error(message)
      }
    })
  }

  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-muted/15 p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <Select
          value={effectiveSelectedDestinationId}
          onValueChange={setSelectedDestinationId}
          disabled={isPending}
        >
          <SelectTrigger
            className="w-full sm:w-[260px]"
            aria-label={dictionary.marketConversations.telegram.destinationLabel}
          >
            <SelectValue
              placeholder={dictionary.marketConversations.telegram.destinationPlaceholder}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {activeDestinations.map((destination) => (
                <SelectItem key={destination.id} value={destination.id.toString()}>
                  {formatTelegramDestinationLabel(destination)}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant="outline"
          disabled={isPending || !effectiveSelectedDestinationId}
          onClick={handleSend}
        >
          {isPending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <Bot data-icon="inline-start" />
          )}
          {isPending
            ? dictionary.marketConversations.telegram.sending
            : dictionary.marketConversations.telegram.send}
        </Button>
      </div>
      {deliveryMessage ? (
        <p className="text-sm text-muted-foreground">{deliveryMessage}</p>
      ) : null}
    </div>
  )
}

function formatTelegramDestinationLabel(destination: TelegramDestinationResponse) {
  return (
    destination.displayLabel ||
    destination.chatTitle ||
    destination.username ||
    destination.chatId ||
    `#${destination.id}`
  )
}

function EvidenceSheet({
  entityPermissions,
  onOpenChange,
  onRetry,
  open,
  state,
}: {
  entityPermissions: EntityPermissions
  onOpenChange: (open: boolean) => void
  onRetry: (analysisId: number) => void
  open: boolean
  state: EvidenceLoadState
}) {
  const { dictionary } = useLocalization()
  const analysisId =
    state.status === "loading" || state.status === "loaded" || state.status === "error"
      ? state.analysisId
      : null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{dictionary.marketConversations.evidence.title}</SheetTitle>
          <SheetDescription>
            {dictionary.marketConversations.evidence.description}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3 px-4 pb-4">
          {state.status === "idle" || state.status === "loading" ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Spinner />
              {dictionary.marketConversations.evidence.loading}
            </div>
          ) : null}

          {state.status === "error" ? (
            <Empty className="min-h-[220px] border">
              <EmptyHeader>
                <EmptyMedia variant="icon" className="bg-destructive/10 text-destructive">
                  <TriangleAlert />
                </EmptyMedia>
                <EmptyTitle>
                  {dictionary.marketConversations.evidence.errorTitle}
                </EmptyTitle>
                <EmptyDescription>{state.error}</EmptyDescription>
              </EmptyHeader>
              {analysisId ? (
                <div className="mt-3 flex justify-center">
                  <Button type="button" variant="outline" onClick={() => onRetry(analysisId)}>
                    <RefreshCcw data-icon="inline-start" />
                    {dictionary.common.retry}
                  </Button>
                </div>
              ) : null}
            </Empty>
          ) : null}

          {state.status === "loaded" && state.data.length === 0 ? (
            <Empty className="min-h-[220px] border">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileText />
                </EmptyMedia>
                <EmptyTitle>
                  {dictionary.marketConversations.evidence.emptyTitle}
                </EmptyTitle>
                <EmptyDescription>
                  {dictionary.marketConversations.evidence.emptyDescription}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : null}

          {state.status === "loaded" && state.data.length > 0 ? (
            <div className="flex flex-col gap-3">
              {state.data.map((evidence) => (
                <EvidenceItem
                  key={evidence.id}
                  evidence={evidence}
                  entityPermissions={entityPermissions}
                />
              ))}
            </div>
          ) : null}
        </div>
      </SheetContent>
    </Sheet>
  )
}

function EvidenceItem({
  entityPermissions,
  evidence,
}: {
  entityPermissions: EntityPermissions
  evidence: MarketAnalysisEvidenceResponse
}) {
  const { dictionary, formatDateTime } = useLocalization()
  const internalHref = getEvidenceInternalHref(evidence, entityPermissions)

  return (
    <article className="flex flex-col gap-3 rounded-lg border bg-card p-3">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">
          {dictionary.marketConversations.evidence.sourceTypeLabels[evidence.sourceType]}
        </Badge>
        <Badge variant="outline">
          {dictionary.marketConversations.evidence.roleLabels[evidence.role]}
        </Badge>
      </div>
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-medium">
          {evidence.titleSnapshot || dictionary.marketConversations.evidence.untitled}
        </h3>
        <span className="text-sm text-muted-foreground">
          {evidence.sourceSnapshot || dictionary.marketConversations.evidence.sourceMissing}
        </span>
      </div>
      {evidence.evidenceNoteSnapshot ? (
        <p className="text-sm leading-6 text-muted-foreground">
          {evidence.evidenceNoteSnapshot}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-2">
        {evidence.publishedAtSnapshot ? (
          <AppTimeMetadata icon={Clock3}>
            {formatDateTime(
              evidence.publishedAtSnapshot,
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
        ) : null}
      </div>
      <div className="flex flex-wrap gap-2">
        {internalHref ? (
          <Button asChild type="button" variant="outline">
            <Link href={internalHref}>
              <LinkIcon data-icon="inline-start" />
              {dictionary.marketConversations.evidence.openInternal}
            </Link>
          </Button>
        ) : null}
        {evidence.urlSnapshot ? (
          <Button asChild type="button" variant="outline">
            <a
              href={evidence.urlSnapshot}
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink data-icon="inline-start" />
              {dictionary.marketConversations.evidence.openExternal}
            </a>
          </Button>
        ) : null}
      </div>
    </article>
  )
}

function getEvidenceInternalHref(
  evidence: MarketAnalysisEvidenceResponse,
  permissions: EntityPermissions
) {
  if (evidence.eventId && permissions.events) {
    return `/events/${evidence.eventId}`
  }

  if (evidence.newsArticleId && permissions.newsArticles) {
    return `/news-articles/${evidence.newsArticleId}`
  }

  if (evidence.economicCalendarEntryId && permissions.economicCalendar) {
    return `/economic-calendar/${evidence.economicCalendarEntryId}`
  }

  return null
}
