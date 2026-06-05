import { Calendar, GitBranch } from "lucide-react"
import { LocalizedLink as Link } from "@/components/localized-link"

import { useLocalization } from "@/app/lib/i18n/provider"
import type { MarketQueryKeyEventResponse } from "@/app/lib/market-query/definitions"
import { AppTimeMetadata } from "@/components/app-time-metadata"
import { Badge } from "@/components/ui/badge"

import {
  formatConfidence,
  formatMarketQueryDateTime,
  formatEventFallbackMeta,
  getConfidenceVariant,
} from "./market-query-format"
import { SectionEmpty, SectionHeading } from "./market-query-section"

export function KeyEventsList({
  keyEvents,
  canReadEvents,
}: {
  keyEvents: MarketQueryKeyEventResponse[]
  canReadEvents: boolean
}) {
  const { dictionary } = useLocalization()

  return (
    <section className="rounded-2xl bg-muted/10 p-5">
      <div className="flex flex-col gap-5">
        <SectionHeading
          icon={GitBranch}
          title={dictionary.marketQuery.keyEvents.title}
          description={dictionary.marketQuery.keyEvents.description}
        />

        {keyEvents.length > 0 ? (
          <div className="grid gap-4 xl:grid-cols-2">
            {keyEvents.map((event, index) => (
              <KeyEventCard
                key={`${event.id ?? "event"}-${index}`}
                event={event}
                canReadEvents={canReadEvents}
              />
            ))}
          </div>
        ) : (
          <SectionEmpty
            title={dictionary.marketQuery.keyEvents.emptyTitle}
            description={dictionary.marketQuery.keyEvents.emptyDescription}
          />
        )}
      </div>
    </section>
  )
}

function KeyEventCard({
  event,
  canReadEvents,
}: {
  event: MarketQueryKeyEventResponse
  canReadEvents: boolean
}) {
  const {
    dictionary,
    formatDateTime,
    formatMessage,
    formatPercent,
  } = useLocalization()
  const title = event.title?.trim() || dictionary.marketQuery.keyEvents.untitled
  const fallbackMeta = !event.title?.trim()
    ? formatEventFallbackMeta(event.id, dictionary)
    : null
  const canOpenEvent = canReadEvents && typeof event.id === "number"

  return (
    <article className="flex h-full flex-col gap-4 rounded-xl border border-border bg-background/75 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={getConfidenceVariant(event.confidence)}>
          {formatMessage(dictionary.marketQuery.evidence.confidenceBadge, {
            value: formatConfidence(event.confidence, dictionary, formatPercent),
          })}
        </Badge>
        {event.occurredAt ? (
          <AppTimeMetadata icon={Calendar}>
            {formatMarketQueryDateTime(
              event.occurredAt,
              formatDateTime,
              dictionary
            )}
          </AppTimeMetadata>
        ) : null}
      </div>

      <div className="flex flex-col gap-2">
        {canOpenEvent ? (
          <Link href={`/events/${event.id}`} className="font-semibold text-foreground hover:underline">
            {title}
          </Link>
        ) : (
          <p className="font-semibold text-foreground">{title}</p>
        )}
        {fallbackMeta ? <p className="text-xs leading-5 text-muted-foreground">{fallbackMeta}</p> : null}
        <p className="text-sm leading-6 text-muted-foreground">
          {event.description?.trim() || dictionary.marketQuery.keyEvents.summaryEmpty}
        </p>
      </div>

      <div className="mt-auto grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {dictionary.marketQuery.keyEvents.assetsLabel}
          </span>
          {event.assetSymbols && event.assetSymbols.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {event.assetSymbols.map((assetSymbol) => (
                <Badge key={assetSymbol} variant="secondary">
                  {assetSymbol}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">
              {dictionary.marketQuery.keyEvents.assetsEmpty}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {dictionary.marketQuery.keyEvents.themesLabel}
          </span>
          {event.themeSlugs && event.themeSlugs.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {event.themeSlugs.map((themeSlug) => (
                <Badge key={themeSlug} variant="outline">
                  {themeSlug}
                </Badge>
              ))}
            </div>
          ) : (
            <span className="text-sm text-muted-foreground">
              {dictionary.marketQuery.keyEvents.themesEmpty}
            </span>
          )}
        </div>
      </div>
    </article>
  )
}
