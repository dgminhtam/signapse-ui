import { Fragment, type ReactNode } from "react"
import {
  ActivityIcon,
  ArrowRightIcon,
  CalendarClockIcon,
  CircleAlertIcon,
  FileTextIcon,
  NewspaperIcon,
  RadarIcon,
  SparklesIcon,
  TargetIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  WalletCardsIcon,
  WaypointsIcon,
  ZapIcon,
  type LucideIcon,
} from "lucide-react"

import type { AppLocale } from "@/app/lib/i18n/config"
import {
  getEconomicCalendarImpactBadgeProps,
  getEconomicCalendarImpactLabel,
} from "@/app/lib/economic-calendar/definitions"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import {
  formatDateTime,
  formatNumber,
  formatPercent,
} from "@/app/lib/i18n/format"
import { formatMessage } from "@/app/lib/i18n/messages"
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
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { Skeleton } from "@/components/ui/skeleton"

import type { DashboardPrototypeScenario } from "./dashboard-prototype-scenario"

interface DashboardPrototypeViewProps {
  dictionary: Dictionary
  locale: AppLocale
  scenario: DashboardPrototypeScenario
}

type PrototypeDictionary = Dictionary["dashboardPrototype"]

const WORKSPACE_UPDATED_AT = "2026-05-27T00:36:00.000Z"

const WORKSPACE_ASSETS = [
  { name: "Euro / US Dollar", symbol: "EUR/USD", type: "forex" },
  { name: "Gold Spot", symbol: "XAU/USD", type: "metal" },
  { name: "Bitcoin", symbol: "BTC/USD", type: "crypto" },
  { name: "NVIDIA", symbol: "NVDA", type: "equity" },
  {
    name: "US Dollar / Japanese Yen",
    symbol: "USD/JPY",
    type: "forex",
  },
  { name: "Brent Crude Oil", symbol: "Brent", type: "energy" },
  { name: "US Dollar Index", symbol: "DXY", type: "index" },
  { name: "S&P 500 Index", symbol: "SPX", type: "index" },
] as const satisfies readonly {
  name: string
  symbol: string
  type: keyof PrototypeDictionary["watchlist"]["types"]
}[]

type WorkspaceAsset = (typeof WORKSPACE_ASSETS)[number]

export function DashboardPrototypeView({
  dictionary,
  locale,
  scenario,
}: DashboardPrototypeViewProps) {
  const t = dictionary.dashboardPrototype

  return (
    <div className="flex min-w-0 flex-col gap-4 sm:gap-6">
      <h1 className="sr-only">{t.title}</h1>
      <PrototypeControls scenario={scenario} t={t} />
      {scenario === "loading" ? (
        <DashboardPrototypeSkeleton t={t} />
      ) : (
        <>
          <CurrentWorkspace
            assets={scenario === "empty" ? [] : WORKSPACE_ASSETS}
            locale={locale}
            t={t}
          />
          <TradingSnapshot
            dictionary={dictionary}
            isEmpty={scenario === "empty"}
            locale={locale}
            t={t}
          />
          <div className="grid min-w-0 gap-4 lg:grid-cols-12">
            <EventTimeline
              dictionary={dictionary}
              isEmpty={scenario === "empty"}
              locale={locale}
              t={t}
            />
            <LatestArticles isEmpty={scenario === "empty"} t={t} />
          </div>
          <div className="grid min-w-0 gap-4 lg:grid-cols-12">
            <AssetsInFocus isEmpty={scenario === "empty"} t={t} />
            <MarketNarratives
              isEmpty={scenario === "empty"}
              isError={scenario === "partial-error"}
              locale={locale}
              t={t}
            />
          </div>
        </>
      )}
    </div>
  )
}

function PrototypeControls({
  scenario,
  t,
}: {
  scenario: DashboardPrototypeScenario
  t: PrototypeDictionary
}) {
  const options = [
    { label: t.controls.scenarios.default, value: "default" },
    { label: t.controls.scenarios.loading, value: "loading" },
    { label: t.controls.scenarios.empty, value: "empty" },
    { label: t.controls.scenarios.partialError, value: "partial-error" },
  ] satisfies { label: string; value: DashboardPrototypeScenario }[]

  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>
          <h2>{t.controls.label}</h2>
        </CardTitle>
        <CardDescription>{t.controls.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <nav aria-label={t.controls.label}>
          <div className="flex flex-wrap gap-2">
            {options.map((option) => {
              const isActive = option.value === scenario

              return (
                <Button
                  key={option.value}
                  variant={isActive ? "secondary" : "ghost"}
                  render={<LocalizedLink
                    href={{
                      pathname: "/dashboard-prototype",
                      query: { scenario: option.value },
                    }}
                    aria-current={isActive ? "page" : undefined} />}
                >
                  {option.label}
                </Button>
              )
            })}
          </div>
        </nav>
      </CardContent>
    </Card>
  )
}

function CurrentWorkspace({
  assets,
  locale,
  t,
}: {
  assets: readonly WorkspaceAsset[]
  locale: AppLocale
  t: PrototypeDictionary
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>
          <h2 className="text-2xl font-semibold tracking-tight">
            {t.context.workspace}
          </h2>
        </CardTitle>
        <CardDescription>{t.context.workspaceDescription}</CardDescription>
        <CardAction>
          <Button variant="outline"
            render={<LocalizedLink href="/dashboard" />}
          >
            <TargetIcon data-icon="inline-start" />
                          {t.context.manageAssets}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          <AppTimeMetadata icon={CalendarClockIcon}>
            {formatDateTime(WORKSPACE_UPDATED_AT, locale, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </AppTimeMetadata>
          <div className="flex flex-col gap-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3
                id="dashboard-prototype-workspace-assets-label"
                className="text-sm font-medium"
              >
                {t.context.assetsLabel}
              </h3>
              <Badge variant="secondary">
                {formatNumber(assets.length, locale)}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {t.context.assetsDescription}
            </p>
          </div>
          {assets.length > 0 ? (
            <ItemGroup
              aria-labelledby="dashboard-prototype-workspace-assets-label"
              className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4"
            >
              {assets.map((asset) => (
                <Item
                  key={asset.symbol}
                  role="listitem"
                  size="sm"
                  variant="outline"
                >
                  <ItemContent className="min-w-0">
                    <ItemTitle className="line-clamp-none break-words">
                      {asset.name}
                    </ItemTitle>
                    <ItemDescription>
                      <span className="font-mono">{asset.symbol}</span>
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions className="shrink-0">
                    <Badge variant="secondary">
                      {t.watchlist.types[asset.type]}
                    </Badge>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          ) : (
            <p className="text-sm text-muted-foreground">
              {t.context.emptyAssets}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function TradingSnapshot({
  dictionary,
  isEmpty,
  locale,
  t,
}: {
  dictionary: Dictionary
  isEmpty: boolean
  locale: AppLocale
  t: PrototypeDictionary
}) {
  return (
    <section aria-labelledby="dashboard-prototype-snapshot-title">
      <h2 id="dashboard-prototype-snapshot-title" className="sr-only">
        {t.snapshot.title}
      </h2>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-12">
        <SnapshotCard
          className="md:col-span-2 xl:col-span-5"
          description={
            isEmpty ? (
              dictionary.common.noData
            ) : (
              <>
                <span>
                  {t.snapshot.eventTime} · {t.snapshot.eventCurrency}
                </span>
                <Badge {...getEconomicCalendarImpactBadgeProps("HIGH")}>
                  {getEconomicCalendarImpactLabel("HIGH", dictionary)}
                </Badge>
              </>
            )
          }
          icon={ZapIcon}
          title={t.snapshot.nextEvent}
          value={isEmpty ? dictionary.common.noData : t.snapshot.eventTitle}
        />
        <SnapshotCard
          className="xl:col-span-2"
          description={t.snapshot.eventsWindow}
          icon={ActivityIcon}
          title={t.snapshot.events}
          value={formatNumber(isEmpty ? 0 : 12, locale)}
        />
        <SnapshotCard
          className="xl:col-span-3"
          description={t.snapshot.narrativesWindow}
          icon={RadarIcon}
          title={t.snapshot.narratives}
          value={formatNumber(isEmpty ? 0 : 4, locale)}
        />
        <SnapshotCard
          className="xl:col-span-2"
          description={t.snapshot.newsWindow}
          icon={NewspaperIcon}
          title={t.snapshot.news}
          value={formatNumber(isEmpty ? 0 : 18, locale)}
        />
      </div>
    </section>
  )
}

function SnapshotCard({
  className,
  description,
  icon: Icon,
  title,
  value,
}: {
  className?: string
  description: ReactNode
  icon: LucideIcon
  title: string
  value: string
}) {
  return (
    <Card className={className} size="sm">
      <CardHeader>
        <CardTitle>
          <h3>{title}</h3>
        </CardTitle>
        <CardAction>
          <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="font-mono text-2xl font-semibold tracking-tight tabular-nums">
          {value}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {description}
        </div>
      </CardContent>
    </Card>
  )
}

function EventTimeline({
  dictionary,
  isEmpty,
  locale,
  t,
}: {
  dictionary: Dictionary
  isEmpty: boolean
  locale: AppLocale
  t: PrototypeDictionary
}) {
  const items = [
    {
      affectedAssets: ["DXY", "USD/JPY"],
      confidence: 0.84,
      description: t.events.items.jobs.description,
      occurredAt: "2026-05-27T01:45:00.000Z",
      themes: t.events.items.jobs.themes,
      title: t.events.items.jobs.title,
    },
    {
      affectedAssets: ["DXY", "XAU/USD", "SPX"],
      confidence: 0.79,
      description: t.events.items.cpi.description,
      occurredAt: "2026-05-27T01:20:00.000Z",
      themes: t.events.items.cpi.themes,
      title: t.events.items.cpi.title,
    },
    {
      affectedAssets: ["NVDA", "SPX", "NDX"],
      confidence: 0.76,
      description: t.events.items.semiconductors.description,
      occurredAt: "2026-05-27T00:55:00.000Z",
      themes: t.events.items.semiconductors.themes,
      title: t.events.items.semiconductors.title,
    },
    {
      affectedAssets: ["EUR/USD", "DXY"],
      confidence: 0.72,
      description: t.events.items.ecb.description,
      occurredAt: "2026-05-26T23:50:00.000Z",
      themes: t.events.items.ecb.themes,
      title: t.events.items.ecb.title,
    },
    {
      affectedAssets: ["BTC/USD"],
      confidence: 0.68,
      description: t.events.items.bitcoin.description,
      occurredAt: "2026-05-26T22:40:00.000Z",
      themes: t.events.items.bitcoin.themes,
      title: t.events.items.bitcoin.title,
    },
    {
      affectedAssets: ["Brent", "DXY"],
      confidence: 0.81,
      description: t.events.items.oil.description,
      occurredAt: "2026-05-26T20:30:00.000Z",
      themes: t.events.items.oil.themes,
      title: t.events.items.oil.title,
    },
  ]

  return (
    <Card className="min-w-0 lg:col-span-8">
      <CardHeader>
        <CardTitle>
          <h2>{t.events.title}</h2>
        </CardTitle>
        <CardDescription>{t.events.description}</CardDescription>
        {!isEmpty ? (
          <CardAction>
            <Button variant="ghost"
              render={<LocalizedLink href="/events" aria-label={t.events.viewAll} />}
            >
              <span className="hidden sm:inline">{t.events.viewAll}</span>
                              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <ModuleEmpty
            actionHref="/events"
            actionLabel={t.events.viewAll}
            description={t.empty.eventsDescription}
            icon={FileTextIcon}
            title={t.empty.eventsTitle}
          />
        ) : (
          <ItemGroup className="gap-0">
            {items.map((item, index) => (
              <Fragment key={item.title}>
                {index > 0 ? <ItemSeparator /> : null}
                <Item asChild>
                  <LocalizedLink
                    href="/events"
                    aria-label={`${t.events.openEvent}: ${item.title}`}
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
                      <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-2">
                        <div className="flex min-w-0 flex-wrap items-center gap-1 text-xs">
                          <span className="text-muted-foreground">
                            {t.events.themes}:
                          </span>
                          <span>{item.themes.join(" · ")}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1">
                          <span className="text-xs text-muted-foreground">
                            {t.events.affectedAssets}:
                          </span>
                          {item.affectedAssets.map((asset) => (
                            <Badge key={asset} variant="outline">
                              {asset}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex w-full flex-wrap justify-between gap-2">
                        <AppTimeMetadata icon={CalendarClockIcon}>
                          {formatDateTime(
                            item.occurredAt,
                            locale,
                            {
                              dateStyle: "medium",
                              timeStyle: "short",
                            },
                            dictionary.common.notAvailable
                          )}
                        </AppTimeMetadata>
                        <span className="text-xs text-muted-foreground">
                          {dictionary.events.confidenceColumn}:{" "}
                          {formatPercent(item.confidence, locale, {
                            maximumFractionDigits: 0,
                          })}
                        </span>
                      </div>
                    </ItemFooter>
                  </LocalizedLink>
                </Item>
              </Fragment>
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}

function LatestArticles({
  isEmpty,
  t,
}: {
  isEmpty: boolean
  t: PrototypeDictionary
}) {
  const articles = [
    {
      source: t.articles.items.gold.source,
      summary: t.articles.items.gold.summary,
      time: t.articles.items.gold.time,
      title: t.articles.items.gold.title,
    },
    {
      source: t.articles.items.ecb.source,
      summary: t.articles.items.ecb.summary,
      time: t.articles.items.ecb.time,
      title: t.articles.items.ecb.title,
    },
    {
      source: t.articles.items.semiconductors.source,
      summary: t.articles.items.semiconductors.summary,
      time: t.articles.items.semiconductors.time,
      title: t.articles.items.semiconductors.title,
    },
    {
      source: t.articles.items.bitcoin.source,
      summary: t.articles.items.bitcoin.summary,
      time: t.articles.items.bitcoin.time,
      title: t.articles.items.bitcoin.title,
    },
    {
      source: t.articles.items.oil.source,
      summary: t.articles.items.oil.summary,
      time: t.articles.items.oil.time,
      title: t.articles.items.oil.title,
    },
  ]

  return (
    <Card className="min-w-0 lg:col-span-4">
      <CardHeader>
        <CardTitle>
          <h2>{t.articles.title}</h2>
        </CardTitle>
        <CardDescription>{t.articles.description}</CardDescription>
        {!isEmpty ? (
          <CardAction>
            <Button variant="ghost"
              render={<LocalizedLink
                href="/news-articles"
                aria-label={t.articles.viewAll} />}
            >
              <span className="hidden sm:inline">{t.articles.viewAll}</span>
                              <ArrowRightIcon data-icon="inline-end" />
            </Button>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <ModuleEmpty
            actionHref="/news-articles"
            actionLabel={t.articles.viewAll}
            description={t.empty.articlesDescription}
            icon={NewspaperIcon}
            title={t.empty.articlesTitle}
          />
        ) : (
          <ItemGroup className="gap-0">
            {articles.map((article, index) => (
              <Fragment key={`${article.title}-${article.time}`}>
                {index > 0 ? <ItemSeparator /> : null}
                <Item>
                  <ItemMedia variant="icon">
                    <NewspaperIcon aria-hidden="true" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>
                      <h3>{article.title}</h3>
                    </ItemTitle>
                    <ItemDescription className="line-clamp-2">
                      {article.summary}
                    </ItemDescription>
                    <p className="text-xs text-muted-foreground">
                      {article.source} · {article.time}
                    </p>
                  </ItemContent>
                </Item>
              </Fragment>
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}

function AssetsInFocus({
  isEmpty,
  t,
}: {
  isEmpty: boolean
  t: PrototypeDictionary
}) {
  const assets = [
    {
      context: t.watchlist.contexts.eurusd,
      name: "Euro / US Dollar",
      symbol: "EURUSD",
      type: t.watchlist.types.forex,
    },
    {
      context: t.watchlist.contexts.xauusd,
      name: "Gold Spot",
      symbol: "XAUUSD",
      type: t.watchlist.types.metal,
    },
    {
      context: t.watchlist.contexts.btcusd,
      name: "Bitcoin",
      symbol: "BTCUSD",
      type: t.watchlist.types.crypto,
    },
    {
      context: t.watchlist.contexts.nvda,
      name: "NVIDIA",
      symbol: "NVDA",
      type: t.watchlist.types.equity,
    },
    {
      context: t.watchlist.contexts.usdjpy,
      name: "US Dollar / Japanese Yen",
      symbol: "USDJPY",
      type: t.watchlist.types.forex,
    },
    {
      context: t.watchlist.contexts.brent,
      name: "Brent Crude",
      symbol: "BRENT",
      type: t.watchlist.types.energy,
    },
  ]

  return (
    <Card className="min-w-0 lg:col-span-7">
      <CardHeader>
        <CardTitle>
          <h2>{t.watchlist.title}</h2>
        </CardTitle>
        <CardDescription>{t.watchlist.description}</CardDescription>
        {!isEmpty ? (
          <CardAction>
            <Button variant="ghost"
              render={<LocalizedLink
                href="/graph-view"
                aria-label={t.watchlist.graphView} />}
            >
              <WaypointsIcon data-icon="inline-start" />
                              <span className="hidden sm:inline">
                                {t.watchlist.graphView}
                              </span>
            </Button>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <ModuleEmpty
            actionHref="/dashboard"
            actionLabel={t.context.manageAssets}
            description={t.empty.watchlistDescription}
            icon={TargetIcon}
            title={t.empty.watchlistTitle}
          />
        ) : (
          <ItemGroup className="gap-0">
            {assets.map((asset, index) => (
              <Fragment key={asset.symbol}>
                {index > 0 ? <ItemSeparator /> : null}
                <Item>
                  <ItemMedia variant="icon">
                    <WalletCardsIcon aria-hidden="true" />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>
                      <h3>
                        {asset.symbol} · {asset.name}
                      </h3>
                    </ItemTitle>
                    <ItemDescription>{asset.context}</ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Badge variant="secondary">{asset.type}</Badge>
                  </ItemActions>
                  <ItemFooter>
                    <Button size="sm" variant="ghost"
                      render={<LocalizedLink href="/market-charts" />}
                    >
                      <ActivityIcon data-icon="inline-start" />
                                              {t.watchlist.marketCharts}
                    </Button>
                  </ItemFooter>
                </Item>
              </Fragment>
            ))}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}

function MarketNarratives({
  isEmpty,
  isError,
  locale,
  t,
}: {
  isEmpty: boolean
  isError: boolean
  locale: AppLocale
  t: PrototypeDictionary
}) {
  const narratives = [
    {
      assets: ["DXY", "EUR/USD", "USD/JPY"],
      confidence: 0.82,
      icon: SparklesIcon,
      status: t.narratives.statuses.emerging,
      statusVariant: "secondary" as const,
      theme: t.narratives.items.dollar.theme,
      thesis: t.narratives.items.dollar.thesis,
      title: t.narratives.items.dollar.title,
      updated: t.narratives.items.dollar.updated,
    },
    {
      assets: ["XAU/USD", "DXY", "USD/JPY"],
      confidence: 0.78,
      icon: TrendingUpIcon,
      status: t.narratives.statuses.active,
      statusVariant: "default" as const,
      theme: t.narratives.items.gold.theme,
      thesis: t.narratives.items.gold.thesis,
      title: t.narratives.items.gold.title,
      updated: t.narratives.items.gold.updated,
    },
    {
      assets: ["NVDA", "SPX", "NDX"],
      confidence: 0.61,
      icon: TrendingDownIcon,
      status: t.narratives.statuses.weakening,
      statusVariant: "secondary" as const,
      theme: t.narratives.items.ai.theme,
      thesis: t.narratives.items.ai.thesis,
      title: t.narratives.items.ai.title,
      updated: t.narratives.items.ai.updated,
    },
  ]

  return (
    <Card className="min-w-0 lg:col-span-5">
      <CardHeader>
        <CardTitle>
          <h2>{t.narratives.title}</h2>
        </CardTitle>
        <CardDescription>{t.narratives.description}</CardDescription>
        {!isError && !isEmpty ? (
          <CardAction>
            <Button variant="ghost"
              render={<LocalizedLink
                href="/graph-view"
                aria-label={t.narratives.viewGraph} />}
            >
              <WaypointsIcon data-icon="inline-start" />
                              <span className="hidden sm:inline">
                                {t.narratives.viewGraph}
                              </span>
            </Button>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent>
        {isError ? (
          <Empty className="min-h-56 border" role="alert">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <CircleAlertIcon aria-hidden="true" />
              </EmptyMedia>
              <EmptyTitle>{t.error.narrativesTitle}</EmptyTitle>
              <EmptyDescription>
                {t.error.narrativesDescription}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button variant="outline"
                render={<LocalizedLink
                  href={{
                    pathname: "/dashboard-prototype",
                    query: { scenario: "default" },
                  }} />}
              >
                {t.error.retry}
              </Button>
            </EmptyContent>
          </Empty>
        ) : isEmpty ? (
          <ModuleEmpty
            actionHref="/graph-view"
            actionLabel={t.narratives.viewGraph}
            description={t.empty.narrativesDescription}
            icon={RadarIcon}
            title={t.empty.narrativesTitle}
          />
        ) : (
          <ItemGroup className="gap-0">
            {narratives.map((narrative, index) => {
              const Icon = narrative.icon

              return (
                <Fragment key={narrative.title}>
                  {index > 0 ? <ItemSeparator /> : null}
                  <Item>
                    <ItemMedia variant="icon">
                      <Icon aria-hidden="true" />
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>
                        <h3>{narrative.title}</h3>
                      </ItemTitle>
                      <ItemDescription>{narrative.thesis}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Badge variant={narrative.statusVariant}>
                        {narrative.status}
                      </Badge>
                    </ItemActions>
                    <ItemFooter className="flex-col items-start">
                      <div className="flex flex-wrap items-baseline gap-1 text-xs">
                        <span className="text-muted-foreground">
                          {t.narratives.theme}:
                        </span>
                        <span>{narrative.theme}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1">
                        <span className="text-xs text-muted-foreground">
                          {t.narratives.affectedAssets}:
                        </span>
                        {narrative.assets.map((asset) => (
                          <Badge key={asset} variant="outline">
                            {asset}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex w-full flex-wrap justify-between gap-2">
                        <span className="text-xs text-muted-foreground">
                          {formatMessage(t.narratives.confidence, {
                            value: formatPercent(narrative.confidence, locale, {
                              maximumFractionDigits: 0,
                            }),
                          })}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatMessage(t.narratives.updated, {
                            time: narrative.updated,
                          })}
                        </span>
                      </div>
                    </ItemFooter>
                  </Item>
                </Fragment>
              )
            })}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  )
}

function ModuleEmpty({
  actionHref,
  actionLabel,
  description,
  icon: Icon,
  title,
}: {
  actionHref: string
  actionLabel: string
  description: string
  icon: LucideIcon
  title: string
}) {
  return (
    <Empty className="min-h-56 border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Icon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline"
          render={<LocalizedLink href={actionHref} />}
        >
          {actionLabel}
                      <ArrowRightIcon data-icon="inline-end" />
        </Button>
      </EmptyContent>
    </Empty>
  )
}

function DashboardPrototypeSkeleton({ t }: { t: PrototypeDictionary }) {
  return (
    <div
      className="flex min-w-0 flex-col gap-4 sm:gap-6"
      aria-label={t.controls.scenarios.loading}
      aria-busy="true"
    >
      <Card size="sm">
        <CardHeader>
          <CardTitle>
            <h2 className="sr-only">{t.context.workspace}</h2>
            <Skeleton
              aria-hidden="true"
              className="h-7 w-48 motion-reduce:animate-none"
            />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-72 max-w-full motion-reduce:animate-none" />
          </CardDescription>
          <CardAction>
            <Skeleton className="h-9 w-32 motion-reduce:animate-none" />
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-36 motion-reduce:animate-none" />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-36 motion-reduce:animate-none" />
                <Skeleton className="h-5 w-7 motion-reduce:animate-none" />
              </div>
              <Skeleton className="h-4 w-64 max-w-full motion-reduce:animate-none" />
            </div>
            <ItemGroup className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
              {WORKSPACE_ASSETS.map((asset) => (
                <Item
                  aria-hidden="true"
                  key={asset.symbol}
                  size="sm"
                  variant="outline"
                >
                  <ItemContent>
                    <Skeleton className="h-4 w-32 motion-reduce:animate-none" />
                    <Skeleton className="h-4 w-16 motion-reduce:animate-none" />
                  </ItemContent>
                  <ItemActions>
                    <Skeleton className="h-5 w-14 motion-reduce:animate-none" />
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          </div>
        </CardContent>
      </Card>

      <section aria-labelledby="dashboard-prototype-loading-snapshot-title">
        <h2 id="dashboard-prototype-loading-snapshot-title" className="sr-only">
          {t.snapshot.title}
        </h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-12">
          {[
            "md:col-span-2 xl:col-span-5",
            "xl:col-span-2",
            "xl:col-span-3",
            "xl:col-span-2",
          ].map((className, index) => (
            <Card className={className} key={`${className}-${index}`} size="sm">
              <CardHeader>
                <Skeleton className="h-4 w-28 motion-reduce:animate-none" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-24 motion-reduce:animate-none" />
                {index === 0 ? (
                  <div className="mt-2 flex items-center gap-2">
                    <Skeleton className="h-3 w-20 motion-reduce:animate-none" />
                    <Skeleton className="h-5 w-10 motion-reduce:animate-none" />
                  </div>
                ) : (
                  <Skeleton className="mt-2 h-3 w-32 motion-reduce:animate-none" />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <div className="grid min-w-0 gap-4 lg:grid-cols-12">
        <ModuleSkeleton
          className="lg:col-span-8"
          rows={6}
          showRowMetadata
          title={t.events.title}
        />
        <ModuleSkeleton
          className="lg:col-span-4"
          rows={5}
          showArticleSummary
          title={t.articles.title}
        />
      </div>
      <div className="grid min-w-0 gap-4 lg:grid-cols-12">
        <ModuleSkeleton
          className="lg:col-span-7"
          rows={6}
          title={t.watchlist.title}
        />
        <ModuleSkeleton
          className="lg:col-span-5"
          rows={3}
          showRowMetadata
          title={t.narratives.title}
        />
      </div>
    </div>
  )
}

function ModuleSkeleton({
  className,
  rows,
  showArticleSummary = false,
  showRowMetadata = false,
  title,
}: {
  className: string
  rows: number
  showArticleSummary?: boolean
  showRowMetadata?: boolean
  title: string
}) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>
          <h2 className="sr-only">{title}</h2>
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
          {Array.from({ length: rows }, (_, index) => (
            <div className="flex items-center gap-3" key={index}>
              <Skeleton className="size-8 shrink-0 motion-reduce:animate-none" />
              <div className="flex min-w-0 flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-3/4 motion-reduce:animate-none" />
                <Skeleton className="h-3 w-1/2 motion-reduce:animate-none" />
                {showArticleSummary ? (
                  <>
                    <Skeleton className="h-3 w-2/3 motion-reduce:animate-none" />
                    <Skeleton className="h-3 w-1/3 motion-reduce:animate-none" />
                  </>
                ) : null}
                {showRowMetadata ? (
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-5 w-40 motion-reduce:animate-none" />
                      <Skeleton className="h-5 w-48 motion-reduce:animate-none" />
                    </div>
                    <div className="flex flex-wrap justify-between gap-2">
                      <Skeleton className="h-3 w-28 motion-reduce:animate-none" />
                      <Skeleton className="h-3 w-20 motion-reduce:animate-none" />
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
