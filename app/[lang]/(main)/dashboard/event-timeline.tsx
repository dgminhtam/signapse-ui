import {
  ArrowRightIcon,
  CalendarClockIcon,
  CircleSlashIcon,
  FileTextIcon,
  ShieldAlertIcon,
  ActivityIcon,
  type LucideIcon,
} from "lucide-react"

import type {
  DashboardRecentEventsMetricResponse,
  DashboardSummaryResponse,
} from "@/app/lib/dashboard/definitions"
import type { AppLocale } from "@/app/lib/i18n/config"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import { formatDateTime, formatPercent } from "@/app/lib/i18n/format"
import { LocalizedLink } from "@/components/localized-link"
import { AppTimeMetadata } from "@/components/app-time-metadata"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton"

import { DashboardQuickDetailLink } from "./dashboard-quick-detail"

export function EventTimeline({
  dictionary,
  error,
  locale,
  metric,
}: {
  dictionary: Dictionary
  error: string | null
  locale: AppLocale
  metric: DashboardRecentEventsMetricResponse | null
}) {
  const t = dictionary.workspaceOverview.eventTimeline
  const hasItems = metric?.state === "AVAILABLE" && metric.items.length > 0
  const showViewAll = hasItems

  return (
    <section aria-labelledby="dashboard-event-timeline-title">
      <Card className="min-w-0" size="sm">
        <CardHeader>
          <CardTitle>
            <h2 id="dashboard-event-timeline-title">{t.title}</h2>
          </CardTitle>
          <CardDescription>{t.description}</CardDescription>
          {showViewAll ? (
            <CardAction>
              <Button asChild variant="ghost">
                <LocalizedLink href="/events" aria-label={t.viewAll}>
                  <span className="hidden sm:inline">{t.viewAll}</span>
                  <ArrowRightIcon data-icon="inline-end" />
                </LocalizedLink>
              </Button>
            </CardAction>
          ) : null}
        </CardHeader>
        <CardContent>
          {error || !metric ? (
            <TimelineState
              description={error ?? t.errorDescription}
              icon={CircleSlashIcon}
              title={t.errorTitle}
            />
          ) : metric.state === "DENIED" ? (
            <TimelineState
              description={t.deniedDescription}
              icon={ShieldAlertIcon}
              title={t.deniedTitle}
            />
          ) : metric.state === "ERROR" ? (
            <TimelineState
              description={t.errorDescription}
              icon={CircleSlashIcon}
              title={t.errorTitle}
            />
          ) : hasItems ? (
            <EventTimelineItems
              dictionary={dictionary}
              items={metric.items}
              locale={locale}
            />
          ) : (
            <EmptyEventTimeline dictionary={dictionary} />
          )}
        </CardContent>
      </Card>
    </section>
  )
}

export function EventTimelineSkeleton() {
  return (
    <section aria-hidden="true">
      <Card className="min-w-0" size="sm">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-36 motion-reduce:animate-none" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-56 max-w-full motion-reduce:animate-none" />
          </CardDescription>
          <CardAction>
            <Skeleton className="h-9 w-9 motion-reduce:animate-none sm:w-28" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {Array.from({ length: 6 }, (_, index) => (
              <div className="flex items-start gap-3" key={index}>
                <Skeleton className="size-8 shrink-0 motion-reduce:animate-none" />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <Skeleton className="h-4 w-3/4 motion-reduce:animate-none" />
                  <Skeleton className="h-3 w-full max-w-xl motion-reduce:animate-none" />
                  <Skeleton className="h-3 w-2/3 motion-reduce:animate-none" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-5 w-32 motion-reduce:animate-none" />
                    <Skeleton className="h-5 w-24 motion-reduce:animate-none" />
                  </div>
                  <div className="flex flex-wrap justify-between gap-2">
                    <Skeleton className="h-3 w-28 motion-reduce:animate-none" />
                    <Skeleton className="h-3 w-20 motion-reduce:animate-none" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

function EventTimelineItems({
  dictionary,
  items,
  locale,
}: {
  dictionary: Dictionary
  items: DashboardSummaryResponse["recentEvents"]["items"]
  locale: AppLocale
}) {
  const t = dictionary.workspaceOverview.eventTimeline

  return (
    <ItemGroup className="gap-0">
      {items.map((item, index) => (
        <div key={item.id}>
          {index > 0 ? <ItemSeparator /> : null}
          <Item asChild>
            <DashboardQuickDetailLink
              entity={{ id: item.id, kind: "event" }}
              href={`/events/${item.id}`}
              aria-label={`${t.openEvent}: ${item.title}`}
            >
              <ItemMedia className="self-start" variant="icon">
                <ActivityIcon aria-hidden="true" />
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  <h3>{item.title}</h3>
                </ItemTitle>
                <ItemDescription className="line-clamp-2">
                  {item.description}
                </ItemDescription>
              </ItemContent>
              <ItemFooter className="flex-col items-start gap-2">
                <EventContext
                  affectedAssets={item.affectedAssets}
                  dictionary={dictionary}
                  themes={item.themes}
                />
                <div className="flex w-full flex-wrap justify-between gap-2">
                  <AppTimeMetadata icon={CalendarClockIcon}>
                    {formatDateTime(
                      item.occurredAt,
                      locale,
                      { dateStyle: "medium", timeStyle: "short" },
                      t.invalidDate
                    )}
                  </AppTimeMetadata>
                  <span className="text-xs text-muted-foreground tabular-nums">
                    {t.confidence}: {formatConfidence(item.confidence, locale)}
                  </span>
                </div>
              </ItemFooter>
            </DashboardQuickDetailLink>
          </Item>
        </div>
      ))}
    </ItemGroup>
  )
}

function EventContext({
  affectedAssets,
  dictionary,
  themes,
}: {
  affectedAssets: DashboardSummaryResponse["recentEvents"]["items"][number]["affectedAssets"]
  dictionary: Dictionary
  themes: DashboardSummaryResponse["recentEvents"]["items"][number]["themes"]
}) {
  const t = dictionary.workspaceOverview.eventTimeline
  const themeLabels = themes
    .map((theme) => theme.themeTitle?.trim())
    .filter((title): title is string => Boolean(title))
  const assetLabels = affectedAssets
    .map((asset) => asset.assetSymbol?.trim() || asset.assetName?.trim())
    .filter((label): label is string => Boolean(label))

  if (themeLabels.length === 0 && assetLabels.length === 0) {
    return null
  }

  return (
    <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2">
      {themeLabels.length > 0 ? (
        <div className="flex min-w-0 flex-wrap items-center gap-1 text-xs">
          <span className="text-muted-foreground">{t.themes}:</span>
          <span>{themeLabels.join(" · ")}</span>
        </div>
      ) : null}
      {assetLabels.length > 0 ? (
        <div className="flex flex-wrap items-center gap-1">
          <span className="text-xs text-muted-foreground">
            {t.affectedAssets}:
          </span>
          {assetLabels.map((asset) => (
            <Badge key={asset} variant="outline">
              {asset}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function EmptyEventTimeline({ dictionary }: { dictionary: Dictionary }) {
  const t = dictionary.workspaceOverview.eventTimeline

  return (
    <Empty className="min-h-40 border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FileTextIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>{t.emptyTitle}</EmptyTitle>
        <EmptyDescription>{t.emptyDescription}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild variant="outline" size="sm">
          <LocalizedLink href="/events">
            {t.viewAll}
            <ArrowRightIcon data-icon="inline-end" />
          </LocalizedLink>
        </Button>
      </EmptyContent>
    </Empty>
  )
}

function TimelineState({
  description,
  icon: Icon,
  title,
}: {
  description: string
  icon: LucideIcon
  title: string
}) {
  return (
    <Empty className="min-h-40 border" role="alert">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  )
}

function formatConfidence(value: number, locale: AppLocale) {
  return formatPercent(value <= 1 ? value : value / 100, locale, {
    maximumFractionDigits: 0,
  })
}
