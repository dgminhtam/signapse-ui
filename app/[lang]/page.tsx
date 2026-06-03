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
import { getDictionary, hasLocale } from "@/app/lib/i18n/dictionaries"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import { withLocalePath } from "@/app/lib/i18n/routing"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
  const { isAuthenticated } = await auth()

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
      <ThesisSection dictionary={dictionary} />
      <WorkflowSection dictionary={dictionary} />
      <FeatureSection dictionary={dictionary} />
      <DifferentiationSection dictionary={dictionary} />
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
          <span className="flex size-8 items-center justify-center rounded-lg border bg-card">
            S
          </span>
          <span>{dictionary.common.appName}</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <a href="#product" className="transition-colors hover:text-foreground">
            {dictionary.landing.nav.product}
          </a>
          <a href="#workflow" className="transition-colors hover:text-foreground">
            {dictionary.landing.nav.workflow}
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
      <div className="relative mx-auto grid min-h-[82svh] w-full max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.92fr_1.08fr] lg:px-8">
        <div className="flex max-w-3xl flex-col gap-7">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{dictionary.landing.hero.eyebrow}</Badge>
            <Badge variant="outline">{dictionary.landing.hero.confidenceLabel}</Badge>
          </div>

          <div className="flex flex-col gap-5">
            <h1 className="max-w-4xl text-4xl font-semibold leading-tight tracking-normal text-foreground sm:text-5xl lg:text-6xl">
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

          <div className="grid max-w-2xl gap-3 sm:grid-cols-3">
            <SignalStep
              label={dictionary.landing.hero.eventLabel}
              value={dictionary.landing.thesis.eventBody}
            />
            <SignalStep
              label={dictionary.landing.hero.reactionLabel}
              value={dictionary.landing.thesis.reactionBody}
            />
            <SignalStep
              label={dictionary.landing.hero.narrativeLabel}
              value={dictionary.landing.thesis.narrativeBody}
            />
          </div>
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
        <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
          <a href="#workflow">{dictionary.landing.cta.learnWorkflow}</a>
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

function SignalStep({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 flex-col gap-2 rounded-xl border bg-card/80 p-3">
      <div className="text-xs font-medium uppercase text-muted-foreground">
        {label}
      </div>
      <div className="line-clamp-2 text-sm leading-5 text-foreground">{value}</div>
    </div>
  )
}

function ProductPreview({ dictionary }: { dictionary: Dictionary }) {
  const t = dictionary.landing.visual

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

      <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-b p-4 lg:border-b-0 lg:border-r">
          <div className="flex flex-col gap-4">
            <PreviewPanel icon={TargetIcon} title={t.assetScope}>
              <div className="flex flex-wrap gap-2">
                {["XAUUSD", "EURUSD", "BTC", "NDX"].map((asset) => (
                  <Badge key={asset} variant="outline">
                    {asset}
                  </Badge>
                ))}
              </div>
            </PreviewPanel>

            <PreviewPanel icon={NewspaperIcon} title={t.evidenceQueue}>
              <PreviewRow label={t.articleEvidence} value="Reuters / Macro" />
              <PreviewRow label={t.calendarEvidence} value="CPI actual" />
              <PreviewRow label={t.checkedSources} value="8" />
            </PreviewPanel>

            <PreviewPanel icon={BrainCircuitIcon} title={t.liveContext}>
              <p className="text-sm leading-6 text-muted-foreground">
                {t.queryPrompt}
              </p>
              <div className="rounded-lg border bg-background p-3 text-sm leading-6">
                {t.queryAnswer}
              </div>
            </PreviewPanel>
          </div>
        </div>

        <div className="flex min-h-[420px] flex-col gap-4 p-4">
          <div className="grid flex-1 place-items-center rounded-xl border bg-background">
            <div className="grid w-full max-w-md grid-cols-3 items-center gap-3 p-5">
              <GraphNode label={t.macroEvent} icon={CalendarClockIcon} />
              <GraphLink />
              <GraphNode label={t.goldReaction} icon={LineChartIcon} />
              <GraphLink className="col-start-1 rotate-90" />
              <GraphNode label={t.policyShift} icon={NetworkIcon} />
              <GraphLink className="rotate-90" />
              <GraphNode label={t.articleEvidence} icon={NewspaperIcon} />
              <GraphLink />
              <GraphNode label={t.narrative} icon={SparklesIcon} />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border bg-background p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm font-medium">{t.chartAnnotation}</span>
                <ChartCandlestickIcon className="text-muted-foreground" />
              </div>
              <div className="flex h-24 items-end gap-1">
                {[36, 52, 42, 68, 58, 74, 62, 88, 70, 78].map((height, index) => (
                  <span
                    key={index}
                    className="w-full rounded-t bg-foreground/20"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>

            <div className="rounded-xl border bg-background p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-sm font-medium">{t.confidence}</span>
                <ShieldCheckIcon className="text-muted-foreground" />
              </div>
              <div className="flex flex-col gap-2">
                <ConfidenceBar value="82%" />
                <PreviewRow label={t.fxReaction} value="USD" />
                <PreviewRow label={t.goldReaction} value="XAU" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </figure>
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

function GraphNode({
  label,
  icon: Icon,
}: {
  label: string
  icon: ElementType
}) {
  return (
    <div className="flex min-h-24 min-w-0 flex-col items-center justify-center gap-2 rounded-xl border bg-card p-3 text-center">
      <Icon className="text-muted-foreground" />
      <span className="text-xs font-medium leading-4">{label}</span>
    </div>
  )
}

function GraphLink({ className = "" }: { className?: string }) {
  return <div className={cn("h-px min-w-8 bg-border", className)} />
}

function ConfidenceBar({ value }: { value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-[82%] rounded-full bg-foreground" />
      </div>
      <span className="text-sm font-medium tabular-nums">{value}</span>
    </div>
  )
}

function ProblemSection({ dictionary }: { dictionary: Dictionary }) {
  const t = dictionary.landing.problem
  const questions = [
    t.questionOne,
    t.questionTwo,
    t.questionThree,
    t.questionFour,
  ]

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
          {questions.map((question) => (
            <article key={question} className="rounded-xl border bg-card p-5">
              <CheckCircle2Icon className="mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium">{question}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function ThesisSection({ dictionary }: { dictionary: Dictionary }) {
  const t = dictionary.landing.thesis
  const thesisItems = [
    { title: t.event, body: t.eventBody, icon: CalendarClockIcon },
    { title: t.reaction, body: t.reactionBody, icon: ChartCandlestickIcon },
    { title: t.narrative, body: t.narrativeBody, icon: NetworkIcon },
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
          {thesisItems.map((item) => (
            <article
              key={item.title}
              className="flex min-w-0 flex-col gap-5 rounded-xl border bg-card p-6"
            >
              <div className="flex size-10 items-center justify-center rounded-lg border bg-background">
                <item.icon className="text-muted-foreground" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {item.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function WorkflowSection({ dictionary }: { dictionary: Dictionary }) {
  const t = dictionary.landing.workflow
  const steps = [
    { title: t.stepOneTitle, body: t.stepOneBody },
    { title: t.stepTwoTitle, body: t.stepTwoBody },
    { title: t.stepThreeTitle, body: t.stepThreeBody },
    { title: t.stepFourTitle, body: t.stepFourBody },
  ]

  return (
    <section id="workflow" className="border-b px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="flex flex-col gap-4">
          <Badge variant="outline">{dictionary.landing.nav.workflow}</Badge>
          <h2 className="text-3xl font-semibold tracking-normal sm:text-4xl">
            {t.heading}
          </h2>
          <p className="text-base leading-7 text-muted-foreground">{t.body}</p>
        </div>

        <div className="grid gap-4">
          {steps.map((step, index) => (
            <article
              key={step.title}
              className="grid gap-4 rounded-xl border bg-card p-5 sm:grid-cols-[4rem_1fr]"
            >
              <div className="flex size-12 items-center justify-center rounded-lg border bg-background text-lg font-semibold tabular-nums">
                {index + 1}
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-xl font-semibold">{step.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {step.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureSection({ dictionary }: { dictionary: Dictionary }) {
  const t = dictionary.landing.features
  const features = [
    { title: t.workspaceTitle, body: t.workspaceBody, icon: TargetIcon },
    { title: t.newsTitle, body: t.newsBody, icon: NewspaperIcon },
    { title: t.calendarTitle, body: t.calendarBody, icon: CalendarClockIcon },
    { title: t.graphTitle, body: t.graphBody, icon: NetworkIcon },
    { title: t.chartTitle, body: t.chartBody, icon: ChartCandlestickIcon },
    { title: t.queryTitle, body: t.queryBody, icon: SearchIcon },
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

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="flex min-w-0 flex-col gap-4 rounded-xl border bg-card p-5"
            >
              <feature.icon className="text-muted-foreground" />
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {feature.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function DifferentiationSection({ dictionary }: { dictionary: Dictionary }) {
  const t = dictionary.landing.differentiation
  const items = [
    { title: t.chatbotTitle, body: t.chatbotBody },
    { title: t.ragTitle, body: t.ragBody },
    { title: t.signalTitle, body: t.signalBody },
  ]

  return (
    <section className="border-b px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10">
        <h2 className="max-w-4xl text-3xl font-semibold tracking-normal sm:text-4xl">
          {t.heading}
        </h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {items.map((item) => (
            <article key={item.title} className="rounded-xl border bg-card p-6">
              <h3 className="mb-3 text-xl font-semibold">{item.title}</h3>
              <p className="text-sm leading-6 text-muted-foreground">
                {item.body}
              </p>
            </article>
          ))}
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
