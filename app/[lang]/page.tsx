import { auth } from "@clerk/nextjs/server"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { ElementType, ReactNode } from "react"
import {
  ArrowRightIcon,
  BrainCircuitIcon,
  CalendarClockIcon,
  ChartCandlestickIcon,
  CheckCircle2Icon,
  LineChartIcon,
  NetworkIcon,
  NewspaperIcon,
  SearchIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TargetIcon,
} from "lucide-react"

import type { AppLocale } from "@/app/lib/i18n/config"
import { isDevAuthModeEnabled } from "@/app/lib/dev-auth-mode"
import { getDictionary, hasLocale } from "@/app/lib/i18n/dictionaries"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import { withLocalePath } from "@/app/lib/i18n/routing"
import { Logo } from "@/components/logo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const REQUEST_ACCESS_HREF =
  "mailto:request-access@signapse.ai?subject=Signapse%20access%20request"

type LandingPageProps = {
  params: Promise<{ lang: string }>
}

export async function generateMetadata({
  params,
}: LandingPageProps): Promise<Metadata> {
  const { lang } = await params

  if (!hasLocale(lang)) {
    return {}
  }

  const dictionary = await getDictionary(lang)

  return {
    title: `Signapse - ${dictionary.landing.hero.eyebrow}`,
    description: dictionary.landing.hero.body,
  }
}

export default async function Page({ params }: LandingPageProps) {
  const { lang } = await params

  if (!hasLocale(lang)) {
    notFound()
  }

  const dictionary = await getDictionary(lang)
  const { isAuthenticated } = isDevAuthModeEnabled()
    ? { isAuthenticated: true }
    : await auth()

  return (
    <main className="min-h-svh bg-background text-foreground">
      <LandingHeader
        dictionary={dictionary}
        locale={lang}
        isAuthenticated={isAuthenticated}
      />
      <HeroSection
        dictionary={dictionary}
        locale={lang}
        isAuthenticated={isAuthenticated}
      />
      <ProblemSection dictionary={dictionary} />
      <PillarsSection dictionary={dictionary} />
      <PipelineSection dictionary={dictionary} />
      <PersonalizationSection dictionary={dictionary} />
      <TrustSection dictionary={dictionary} />
      <FinalCtaSection
        dictionary={dictionary}
        locale={lang}
        isAuthenticated={isAuthenticated}
      />
    </main>
  )
}

function LandingHeader({
  dictionary,
  locale,
  isAuthenticated,
}: {
  dictionary: Dictionary
  locale: AppLocale
  isAuthenticated: boolean
}) {
  return (
    <header className="border-b bg-background/95">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href={withLocalePath("/", locale)}
          className="flex items-center gap-3 font-semibold"
        >
          <Logo width={32} height={32} />
          <span>{dictionary.common.appName}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a
            href="#product"
            className="transition-colors hover:text-foreground"
          >
            {dictionary.landing.nav.product}
          </a>
          <a
            href="#pipeline"
            className="transition-colors hover:text-foreground"
          >
            {dictionary.landing.nav.pipeline}
          </a>
          <a href="#trust" className="transition-colors hover:text-foreground">
            {dictionary.landing.nav.trust}
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <Button asChild>
              <Link
                href={withLocalePath("/dashboard", locale)}
                aria-label={dictionary.landing.cta.openDashboardAria}
              >
                {dictionary.landing.nav.openDashboard}
                <ArrowRightIcon data-icon="inline-end" />
              </Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" className="hidden sm:inline-flex">
                <Link
                  href={withLocalePath("/sign-in", locale)}
                  aria-label={dictionary.landing.cta.signInAria}
                >
                  {dictionary.landing.nav.signIn}
                </Link>
              </Button>
              <Button asChild>
                <a
                  href={REQUEST_ACCESS_HREF}
                  aria-label={dictionary.landing.cta.requestAccessAria}
                >
                  {dictionary.landing.nav.requestAccess}
                  <ArrowRightIcon data-icon="inline-end" />
                </a>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}

function HeroSection({
  dictionary,
  locale,
  isAuthenticated,
}: {
  dictionary: Dictionary
  locale: AppLocale
  isAuthenticated: boolean
}) {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:44px_44px] opacity-30" />
      <div className="relative mx-auto grid min-h-[82svh] w-full max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.86fr_1.14fr] lg:px-8">
        <div className="flex max-w-3xl flex-col gap-7">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{dictionary.landing.hero.eyebrow}</Badge>
            <Badge variant="outline">
              {dictionary.landing.hero.intelligenceFlow}
            </Badge>
          </div>

          <div className="flex flex-col gap-5">
            <h1 className="max-w-4xl text-4xl leading-tight font-semibold tracking-normal text-foreground sm:text-5xl lg:text-6xl">
              {dictionary.landing.hero.title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {dictionary.landing.hero.body}
            </p>
          </div>

          <LandingCtas
            dictionary={dictionary}
            locale={locale}
            isAuthenticated={isAuthenticated}
          />
        </div>

        <ProductPreview dictionary={dictionary} />
      </div>
    </section>
  )
}

function LandingCtas({
  dictionary,
  locale,
  isAuthenticated,
}: {
  dictionary: Dictionary
  locale: AppLocale
  isAuthenticated: boolean
}) {
  if (isAuthenticated) {
    return (
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild size="lg" className="w-full sm:w-auto">
          <Link
            href={withLocalePath("/dashboard", locale)}
            aria-label={dictionary.landing.cta.openDashboardAria}
          >
            {dictionary.landing.cta.openDashboard}
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Button>
        <Button
          asChild
          size="lg"
          variant="outline"
          className="w-full sm:w-auto"
        >
          <a href="#product">{dictionary.landing.cta.exploreProduct}</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Button asChild size="lg" className="w-full sm:w-auto">
        <a
          href={REQUEST_ACCESS_HREF}
          aria-label={dictionary.landing.cta.requestAccessAria}
        >
          {dictionary.landing.cta.requestAccess}
          <ArrowRightIcon data-icon="inline-end" />
        </a>
      </Button>
      <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
        <Link
          href={withLocalePath("/sign-in", locale)}
          aria-label={dictionary.landing.cta.signInAria}
        >
          {dictionary.landing.cta.signIn}
        </Link>
      </Button>
    </div>
  )
}

function ProductPreview({ dictionary }: { dictionary: Dictionary }) {
  const t = dictionary.landing.visual
  const watchlist = ["XAU/USD", "EUR/USD", "BTC", "NDX"]

  return (
    <figure
      aria-label={dictionary.landing.hero.visualLabel}
      className="relative min-w-0 overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-foreground/10"
    >
      <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-foreground/30" />
          <span className="size-2 rounded-full bg-foreground/20" />
          <span className="size-2 rounded-full bg-foreground/10" />
        </div>
        <div className="text-xs font-medium text-muted-foreground">
          {dictionary.landing.hero.previewLabel}
        </div>
      </div>

      <div className="grid gap-0 xl:grid-cols-[9rem_1fr_15rem]">
        <aside className="border-b p-4 xl:border-r xl:border-b-0">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div className="text-xs font-medium text-muted-foreground uppercase">
                {t.workspace}
              </div>
              <div className="text-sm font-semibold">{t.workspaceName}</div>
            </div>
            <div className="flex flex-col gap-2">
              <div className="text-xs font-medium text-muted-foreground uppercase">
                {t.watchlist}
              </div>
              {watchlist.map((asset) => (
                <div
                  key={asset}
                  className="flex items-center justify-between gap-2 rounded-lg border bg-background px-2.5 py-2 text-xs"
                >
                  <span className="truncate font-medium">{asset}</span>
                  {asset === "XAU/USD" ? (
                    <span className="size-1.5 rounded-full bg-foreground" />
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="border-b p-4 xl:border-r xl:border-b-0">
          <div className="flex min-h-[440px] flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ChartCandlestickIcon className="text-muted-foreground" />
                <span className="text-sm font-semibold">{t.chartTitle}</span>
              </div>
              <Badge variant="outline">{t.eventMarker}</Badge>
            </div>

            <div className="relative flex flex-1 items-end overflow-hidden rounded-xl border bg-background p-4">
              <div className="absolute inset-x-4 top-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>{t.candleMove}</span>
                <span>XAU/USD</span>
              </div>
              <div className="grid h-64 w-full grid-cols-12 items-end gap-2 pt-10">
                {[46, 54, 42, 62, 56, 78, 68, 88, 74, 64, 70, 82].map(
                  (height, index) => (
                    <span
                      key={index}
                      className="relative w-full rounded-t border bg-muted"
                      style={{ height: `${height}%` }}
                    >
                      {index === 7 ? (
                        <span className="absolute -top-3 left-1/2 size-3 -translate-x-1/2 rounded-full border bg-foreground" />
                      ) : null}
                    </span>
                  )
                )}
              </div>
              <div className="absolute top-16 right-5 max-w-64 rounded-xl border bg-card p-4 shadow-xl shadow-foreground/10">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
                  <CalendarClockIcon className="text-muted-foreground" />
                  {t.eventPopupTitle}
                </div>
                <p className="mb-3 text-xs leading-5 text-muted-foreground">
                  {t.eventPopupBody}
                </p>
                <PreviewRow label={t.reactionDirection} value="XAU / USD" />
                <PreviewRow label={t.confidence} value="82%" />
                <PreviewRow label={t.evidence} value="8" />
              </div>
            </div>

            <MiniGraph dictionary={dictionary} />
          </div>
        </div>

        <aside className="p-4">
          <div className="flex h-full min-h-80 flex-col gap-4">
            <PreviewPanel icon={BrainCircuitIcon} title={t.marketQuery}>
              <p className="text-sm leading-6 text-muted-foreground">
                {t.queryPrompt}
              </p>
              <div className="rounded-lg border bg-background p-3 text-sm leading-6">
                {t.queryAnswer}
              </div>
            </PreviewPanel>

            <PreviewPanel icon={SearchIcon} title={t.keyEvents}>
              <PreviewRow label="CPI" value={t.actualValue} />
              <PreviewRow label="USD" value={t.reactionValue} />
              <PreviewRow label={t.confidence} value="82%" />
            </PreviewPanel>

            <PreviewPanel icon={ShieldCheckIcon} title={t.limitations}>
              <p className="text-sm leading-6 text-muted-foreground">
                {t.limitationsBody}
              </p>
              <Badge variant="outline">{t.evidenceButton}</Badge>
            </PreviewPanel>
          </div>
        </aside>
      </div>
    </figure>
  )
}

function MiniGraph({ dictionary }: { dictionary: Dictionary }) {
  const t = dictionary.landing.visual
  const nodes = [
    { label: t.graphEvent, icon: CalendarClockIcon },
    { label: t.graphAsset, icon: LineChartIcon },
    { label: t.graphTheme, icon: TargetIcon },
    { label: t.graphNarrative, icon: SparklesIcon },
    { label: t.graphEvidence, icon: NewspaperIcon },
  ]

  return (
    <div className="rounded-xl border bg-background p-4">
      <div className="mb-4 flex items-center gap-2 text-sm font-semibold">
        <NetworkIcon className="text-muted-foreground" />
        {t.miniGraph}
      </div>
      <div className="grid gap-2 sm:grid-cols-5">
        {nodes.map((node, index) => (
          <div key={node.label} className="grid gap-2">
            <div className="flex min-h-20 flex-col items-center justify-center gap-2 rounded-lg border bg-card p-2 text-center">
              <node.icon className="text-muted-foreground" />
              <span className="text-xs font-medium">{node.label}</span>
            </div>
            {index < nodes.length - 1 ? (
              <div className="hidden h-px bg-border sm:block" />
            ) : null}
          </div>
        ))}
      </div>
    </div>
  )
}

function PreviewPanel({
  icon: Icon,
  title,
  children,
}: {
  icon: ElementType
  title: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-background p-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Icon className="text-muted-foreground" />
        {title}
      </div>
      {children}
    </div>
  )
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="min-w-0 truncate text-muted-foreground">{label}</span>
      <span className="shrink-0 font-medium tabular-nums">{value}</span>
    </div>
  )
}

function ProblemSection({ dictionary }: { dictionary: Dictionary }) {
  const t = dictionary.landing.problem
  const points = [t.pointOne, t.pointTwo, t.pointThree, t.pointFour]

  return (
    <section id="product" className="border-b px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col gap-4">
          <Badge variant="outline">{dictionary.landing.nav.product}</Badge>
          <h2 className="max-w-3xl text-3xl font-semibold tracking-normal sm:text-4xl">
            {t.heading}
          </h2>
          <p className="max-w-2xl text-base leading-7 text-muted-foreground">
            {t.body}
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {points.map((point) => (
            <article key={point} className="rounded-xl border bg-card p-5">
              <CheckCircle2Icon className="mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">{point}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function PillarsSection({ dictionary }: { dictionary: Dictionary }) {
  const t = dictionary.landing.pillars
  const pillars = [
    {
      title: t.chartTitle,
      oneLine: t.chartOneLine,
      body: t.chartBody,
      points: [t.chartPointOne, t.chartPointTwo, t.chartPointThree],
      icon: ChartCandlestickIcon,
    },
    {
      title: t.queryTitle,
      oneLine: t.queryOneLine,
      body: t.queryBody,
      points: [t.queryPointOne, t.queryPointTwo, t.queryPointThree],
      icon: BrainCircuitIcon,
    },
    {
      title: t.graphTitle,
      oneLine: t.graphOneLine,
      body: t.graphBody,
      points: [t.graphPointOne, t.graphPointTwo, t.graphPointThree],
      icon: NetworkIcon,
    },
  ]

  return (
    <section className="border-b px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex max-w-3xl flex-col gap-4">
          <h2 className="text-3xl font-semibold tracking-normal sm:text-4xl">
            {t.heading}
          </h2>
          <p className="text-base leading-7 text-muted-foreground">{t.body}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <article
              key={pillar.title}
              className="flex min-w-0 flex-col gap-5 rounded-xl border bg-card p-6"
            >
              <div className="flex size-10 items-center justify-center rounded-lg border bg-background">
                <pillar.icon className="text-muted-foreground" />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-semibold">{pillar.title}</h3>
                  <p className="text-sm font-medium text-foreground">
                    {pillar.oneLine}
                  </p>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {pillar.body}
                </p>
              </div>
              <div className="mt-auto flex flex-col gap-2">
                {pillar.points.map((point) => (
                  <div key={point} className="flex items-center gap-2 text-sm">
                    <CheckCircle2Icon className="text-muted-foreground" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function PipelineSection({ dictionary }: { dictionary: Dictionary }) {
  const t = dictionary.landing.pipeline
  const columns = [
    {
      title: t.inputsTitle,
      items: [t.inputOne, t.inputTwo, t.inputThree, t.inputFour],
      icon: NewspaperIcon,
    },
    {
      title: t.knowledgeTitle,
      items: [
        t.knowledgeOne,
        t.knowledgeTwo,
        t.knowledgeThree,
        t.knowledgeFour,
      ],
      icon: NetworkIcon,
    },
    {
      title: t.surfacesTitle,
      items: [t.surfaceOne, t.surfaceTwo, t.surfaceThree],
      icon: SparklesIcon,
    },
  ]

  return (
    <section id="pipeline" className="border-b px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <div className="flex max-w-3xl flex-col gap-4">
          <Badge variant="outline">{dictionary.landing.nav.pipeline}</Badge>
          <h2 className="text-3xl font-semibold tracking-normal sm:text-4xl">
            {t.heading}
          </h2>
          <p className="text-base leading-7 text-muted-foreground">{t.body}</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {columns.map((column, index) => (
            <PipelineColumn
              key={column.title}
              title={column.title}
              items={column.items}
              icon={column.icon}
              showConnector={index < columns.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function PipelineColumn({
  title,
  items,
  icon: Icon,
  showConnector,
}: {
  title: string
  items: string[]
  icon: ElementType
  showConnector: boolean
}) {
  return (
    <article className="relative rounded-xl border bg-card p-6">
      {showConnector ? (
        <div className="absolute top-1/2 right-0 hidden translate-x-1/2 lg:block">
          <div className="flex size-8 items-center justify-center rounded-full border bg-background">
            <ArrowRightIcon className="text-muted-foreground" />
          </div>
        </div>
      ) : null}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg border bg-background">
          <Icon className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item}
            className="rounded-lg border bg-background px-3 py-2 text-sm"
          >
            {item}
          </div>
        ))}
      </div>
    </article>
  )
}

function PersonalizationSection({ dictionary }: { dictionary: Dictionary }) {
  const t = dictionary.landing.personalization

  return (
    <section className="border-b px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="flex flex-col gap-4">
          <Badge variant="outline">{t.eyebrow}</Badge>
          <h2 className="text-3xl font-semibold tracking-normal sm:text-4xl">
            {t.heading}
          </h2>
          <p className="text-base leading-7 text-muted-foreground">{t.body}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <article className="rounded-xl border bg-card p-6">
            <TargetIcon className="mb-5 text-muted-foreground" />
            <h3 className="mb-3 text-xl font-semibold">{t.sharedTitle}</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              {t.sharedBody}
            </p>
          </article>
          <article className="rounded-xl border bg-card p-6">
            <SparklesIcon className="mb-5 text-muted-foreground" />
            <h3 className="mb-3 text-xl font-semibold">{t.personalTitle}</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              {t.personalBody}
            </p>
          </article>
        </div>
      </div>
    </section>
  )
}

function TrustSection({ dictionary }: { dictionary: Dictionary }) {
  return (
    <section id="trust" className="border-b px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-8 rounded-2xl border bg-card p-6 sm:p-8 lg:grid-cols-[auto_1fr] lg:p-10">
        <div className="flex size-12 items-center justify-center rounded-xl border bg-background">
          <ShieldCheckIcon className="text-muted-foreground" />
        </div>
        <div className="flex max-w-4xl flex-col gap-4">
          <h2 className="text-3xl font-semibold tracking-normal">
            {dictionary.landing.trust.heading}
          </h2>
          <p className="text-base leading-7 text-muted-foreground">
            {dictionary.landing.trust.body}
          </p>
        </div>
      </div>
    </section>
  )
}

function FinalCtaSection({
  dictionary,
  locale,
  isAuthenticated,
}: {
  dictionary: Dictionary
  locale: AppLocale
  isAuthenticated: boolean
}) {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        <Badge variant="secondary">{dictionary.common.appName}</Badge>
        <div className="flex flex-col gap-4">
          <h2 className="text-3xl font-semibold tracking-normal sm:text-4xl">
            {dictionary.landing.finalCta.heading}
          </h2>
          <p className="text-base leading-7 text-muted-foreground">
            {dictionary.landing.finalCta.body}
          </p>
        </div>
        <Button asChild size="lg">
          {isAuthenticated ? (
            <Link
              href={withLocalePath("/dashboard", locale)}
              aria-label={dictionary.landing.cta.openDashboardAria}
            >
              {dictionary.landing.finalCta.openDashboard}
              <ArrowRightIcon data-icon="inline-end" />
            </Link>
          ) : (
            <a
              href={REQUEST_ACCESS_HREF}
              aria-label={dictionary.landing.cta.requestAccessAria}
            >
              {dictionary.landing.finalCta.requestAccess}
              <ArrowRightIcon data-icon="inline-end" />
            </a>
          )}
        </Button>
      </div>
    </section>
  )
}
