import Link from "next/link"
import { Suspense, type ElementType } from "react"
import {
  ArrowRightIcon,
  BrainCircuitIcon,
  CalendarClockIcon,
  LineChartIcon,
  NetworkIcon,
  NewspaperIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react"

import type { AppLocale } from "@/app/lib/i18n/config"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import { withLocalePath } from "@/app/lib/i18n/routing"
import {
  createLandingAccessModel,
  type LandingAccessAction,
} from "./landing-access"
import styles from "./landing-page.module.css"
import { LandingLocaleLinks } from "./landing-locale-links"
import { Logo } from "@/components/logo"
import { buttonVariants } from "@/components/ui/button"

type LandingPageProps = {
  dictionary: Dictionary
  locale: AppLocale
  isAuthenticated: boolean
}

type LandingActionButtonProps = {
  action: LandingAccessAction
  className?: string
  size?: "default" | "lg"
  variant?: "default" | "ghost" | "outline" | "secondary"
  showArrow?: boolean
}

export function LandingPage({
  dictionary,
  locale,
  isAuthenticated,
}: LandingPageProps) {
  const t = dictionary.landing
  const access = createLandingAccessModel(locale, isAuthenticated, t)

  return (
    <div className="min-h-svh overflow-x-clip bg-background text-foreground">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:ring-2 focus:ring-ring"
      >
        {t.accessibility.skipToContent}
      </a>

      <LandingHeader
        access={access}
        dictionary={dictionary}
        locale={locale}
      />

      <main id="main-content" tabIndex={-1}>
        <HeroSection
          access={access}
          dictionary={dictionary}
          locale={locale}
        />
        <AnalysisFlow dictionary={dictionary} />
        <ProductStory dictionary={dictionary} />
        <WorkspaceAssistant dictionary={dictionary} />
        <TrustBoundary dictionary={dictionary} />
        <FinalAccessCta access={access} dictionary={dictionary} />
      </main>

      <LandingFooter
        access={access}
        dictionary={dictionary}
        locale={locale}
      />
    </div>
  )
}

function LandingHeader({
  access,
  dictionary,
  locale,
}: {
  access: ReturnType<typeof createLandingAccessModel>
  dictionary: Dictionary
  locale: AppLocale
}) {
  const t = dictionary.landing
  const sectionLinks = [
    { href: "#how-it-works", label: t.nav.flow },
    { href: "#product", label: t.nav.product },
    { href: "#workspace-ai", label: t.nav.workspace },
    { href: "#trust", label: t.nav.trust },
  ]

  return (
    <header
      data-landing-part="header"
      className="border-b border-border/80 bg-background/95"
    >
      <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href={withLocalePath("/", locale)}
          aria-label={dictionary.common.appName}
          className="flex shrink-0 items-center gap-3 rounded-md font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <span aria-hidden="true">
            <Logo width={32} height={32} />
          </span>
          <span className="hidden truncate sm:inline">{dictionary.common.appName}</span>
        </Link>

        <nav
          aria-label={t.accessibility.headerNavigation}
          className="ml-auto hidden items-center gap-5 text-sm text-muted-foreground lg:flex"
        >
          {sectionLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-md px-2 py-2 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2 lg:ml-4">
          <div className="hidden sm:block">
            <Suspense fallback={<LandingLocaleLinksFallback locale={locale} labels={t.localeControl} />}>
              <LandingLocaleLinks
                currentLocale={locale}
                labels={{
                  group: t.localeControl.label,
                  vi: t.localeControl.vietnamese,
                  en: t.localeControl.english,
                }}
              />
            </Suspense>
          </div>

          {access.headerSecondary ? (
            <div className="hidden sm:block">
              <LandingActionButton
                action={access.headerSecondary}
                variant="ghost"
              />
            </div>
          ) : null}
          <LandingActionButton action={access.headerPrimary} />

          <details className="relative lg:hidden" data-mobile-menu>
            <summary className="flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center rounded-md border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&::-webkit-details-marker]:hidden">
              <span className="sr-only">{t.nav.openMenu}</span>
              <span aria-hidden="true" className="text-lg leading-none">
                ≡
              </span>
            </summary>
            <div className="absolute top-[calc(100%+0.5rem)] right-0 z-20 flex w-[min(19rem,calc(100vw-2rem))] flex-col gap-3 border border-border bg-background p-3 shadow-lg">
              <div className="border-b border-border pb-3 sm:hidden">
                <Suspense fallback={<LandingLocaleLinksFallback locale={locale} labels={t.localeControl} />}>
                  <LandingLocaleLinks
                    currentLocale={locale}
                    labels={{
                      group: t.localeControl.label,
                      vi: t.localeControl.vietnamese,
                      en: t.localeControl.english,
                    }}
                  />
                </Suspense>
              </div>
              <nav
                aria-label={t.accessibility.headerNavigation}
                className="flex flex-col gap-1"
              >
                {sectionLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                  >
                    {link.label}
                  </a>
                ))}
                <a
                  href="#access"
                  className="flex min-h-11 items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  {t.nav.access}
                </a>
              </nav>
              {access.headerSecondary ? (
                <LandingActionButton
                  action={access.headerSecondary}
                  className="w-full"
                  variant="outline"
                />
              ) : null}
            </div>
          </details>
        </div>
      </div>
    </header>
  )
}

function HeroSection({
  access,
  dictionary,
}: {
  access: ReturnType<typeof createLandingAccessModel>
  dictionary: Dictionary
  locale: AppLocale
}) {
  const t = dictionary.landing

  return (
    <section
      id="top"
      data-landing-section="hero-product-proof"
      aria-labelledby="landing-hero-heading"
      className={`${styles.heroSection} relative overflow-hidden border-b border-border/80`}
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(24rem,0.86fr)] lg:items-center lg:gap-14 lg:px-8 lg:py-24">
        <div className={`${styles.heroCopy} flex min-w-0 flex-col gap-7`}>
          <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            {t.hero.eyebrow}
          </p>
          <div className="flex max-w-3xl flex-col gap-5">
            <h1
              id="landing-hero-heading"
              className="text-3xl leading-[1.08] font-semibold tracking-[-0.03em] sm:text-5xl lg:text-6xl"
            >
              {t.hero.title}
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              {t.hero.body}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <LandingActionButton
              action={access.heroPrimary}
              className="w-full sm:w-auto"
              size="lg"
            />
            <LandingActionButton
              action={access.heroSecondary}
              className="w-full sm:w-auto"
              size="lg"
              variant="outline"
              showArrow={false}
            />
          </div>
          {access.heroPrimary.kind === "email" ? (
            <p className="max-w-xl text-sm text-muted-foreground">
              {access.requestAccessNote}
            </p>
          ) : null}
          <p className="max-w-xl border-l-2 border-chart-2 pl-4 text-sm leading-6 text-foreground">
            {t.hero.trustNote}
          </p>
        </div>

        <div className={`${styles.heroVisual} flex min-w-0 flex-col gap-6 lg:pl-4`}>
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              {t.hero.sectionLabel}
            </p>
            <h2 className="max-w-xl text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
              {t.hero.proofLabel}
            </h2>
          </div>
          <ContextFigure dictionary={dictionary} />
          <dl className="grid gap-4 border-t border-border pt-5 sm:grid-cols-3 lg:grid-cols-1">
            <ProofPoint title={t.hero.proofOneTitle} body={t.hero.proofOneBody} />
            <ProofPoint title={t.hero.proofTwoTitle} body={t.hero.proofTwoBody} />
            <ProofPoint title={t.hero.proofThreeTitle} body={t.hero.proofThreeBody} />
          </dl>
        </div>
      </div>
    </section>
  )
}

function ContextFigure({ dictionary }: { dictionary: Dictionary }) {
  const t = dictionary.landing.hero

  return (
    <figure
      data-landing-visual="context-figure"
      aria-labelledby="landing-context-figure-title"
      aria-describedby="landing-context-figure-description"
      className={`${styles.contextFigure} min-w-0`}
    >
      <figcaption className="mb-4 flex items-center justify-between gap-3">
        <span
          id="landing-context-figure-title"
          className="font-mono text-xs tracking-[0.16em] text-muted-foreground uppercase"
        >
          {t.contextFigureTitle}
        </span>
        <span className="font-mono text-xs text-muted-foreground" aria-hidden="true">
          {t.contextMeta}
        </span>
        <span id="landing-context-figure-description" className="sr-only">
          {t.contextFigureDescription}
        </span>
      </figcaption>

      <div className="relative isolate min-h-72 overflow-hidden border border-border bg-muted/10 px-4 py-5 sm:min-h-80 sm:px-6 sm:py-6">
        <div aria-hidden="true" className={styles.contextGrid} />
        <div aria-hidden="true" className={`${styles.contextLine} ${styles.contextLineTop}`} />
        <div aria-hidden="true" className={`${styles.contextLine} ${styles.contextLineMiddle}`} />
        <div aria-hidden="true" className={`${styles.contextLine} ${styles.contextLineBottom}`} />
        <div aria-hidden="true" className={`${styles.contextDot} ${styles.contextDotTop}`} />
        <div aria-hidden="true" className={`${styles.contextDot} ${styles.contextDotMiddle}`} />
        <div aria-hidden="true" className={`${styles.contextDot} ${styles.contextDotBottom}`} />

        <div className="relative z-10 grid min-h-64 grid-cols-[minmax(0,0.85fr)_minmax(6.5rem,1fr)_minmax(0,0.85fr)] items-center gap-3 sm:min-h-72 sm:grid-cols-[minmax(0,0.9fr)_minmax(9rem,1fr)_minmax(0,0.9fr)] sm:gap-6">
          <div data-context-stage="inputs" className={`${styles.contextStage} flex flex-col gap-2`}>
            <ContextNode label={t.contextPrice} tone="muted" />
            <ContextNode label={t.contextEvents} tone="muted" />
            <ContextNode label={t.contextReactions} tone="muted" />
            <ContextNode label={t.contextSources} tone="muted" />
          </div>

          <div
            data-context-stage="context"
            className={`${styles.contextStage} flex min-h-28 flex-col items-center justify-center gap-2 border border-chart-2/60 bg-background/90 px-2 text-center shadow-sm sm:min-h-32`}
          >
            <BrainCircuitIcon aria-hidden="true" className="size-5 text-chart-2" />
            <span className="text-sm font-semibold">{t.contextLayer}</span>
            <span className="font-mono text-[0.65rem] tracking-[0.14em] text-muted-foreground uppercase">
              {t.contextMode}
            </span>
          </div>

          <div data-context-stage="actions" className={`${styles.contextStage} flex flex-col gap-2`}>
            <ContextNode label={t.contextAsk} tone="accent" />
            <ContextNode label={t.contextExplore} tone="accent" />
            <ContextNode label={t.contextInspect} tone="accent" />
          </div>
        </div>
      </div>
    </figure>
  )
}

function ContextNode({ label, tone }: { label: string; tone: "muted" | "accent" }) {
  return (
    <span
      className={`flex min-h-9 items-center border px-2 text-xs font-medium sm:min-h-10 sm:px-3 ${
        tone === "accent"
          ? "border-chart-2/50 bg-chart-2/10 text-foreground"
          : "border-border bg-background/75 text-muted-foreground"
      }`}
    >
      <span aria-hidden="true" className="mr-2 size-1.5 shrink-0 rounded-full bg-chart-2" />
      {label}
    </span>
  )
}

function ProofPoint({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-sm font-semibold">{title}</dt>
      <dd className="text-sm leading-6 text-muted-foreground">{body}</dd>
    </div>
  )
}

function RelationshipTreatment() {
  return (
    <div
      aria-hidden="true"
      className="relative isolate h-40 overflow-hidden border-y border-border/80 bg-muted/20"
    >
      <div className="absolute top-1/2 right-8 left-8 h-px bg-border" />
      <div className="absolute top-8 bottom-8 left-1/3 w-px bg-border/80" />
      <div className="absolute top-8 bottom-8 left-2/3 w-px bg-border/80" />
      <span className="absolute top-1/2 left-[16%] size-3 -translate-y-1/2 rounded-full border-2 border-foreground bg-background" />
      <span className="absolute top-1/2 left-[34%] size-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-foreground bg-background" />
      <span className="absolute top-[31%] left-[67%] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-foreground bg-background" />
      <span className="absolute top-[70%] left-[67%] size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-foreground bg-background" />
      <span className="absolute top-1/2 right-[13%] size-6 -translate-y-1/2 rounded-full border-2 border-foreground bg-background" />
    </div>
  )
}

function AnalysisFlow({ dictionary }: { dictionary: Dictionary }) {
  const t = dictionary.landing.analysisFlow
  const steps = [
    { title: t.stepOneTitle, body: t.stepOneBody },
    { title: t.stepTwoTitle, body: t.stepTwoBody },
    { title: t.stepThreeTitle, body: t.stepThreeBody },
    { title: t.stepFourTitle, body: t.stepFourBody },
  ]

  return (
    <section
      id="how-it-works"
      data-landing-section="analysis-flow"
      aria-labelledby="landing-flow-heading"
      className="border-b border-border/80"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[minmax(16rem,0.65fr)_minmax(0,1.35fr)] lg:px-8">
        <div className="flex flex-col gap-5">
          <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            {t.eyebrow}
          </p>
          <h2
            id="landing-flow-heading"
            className="text-3xl leading-tight font-semibold tracking-[-0.02em] sm:text-4xl"
          >
            {t.heading}
          </h2>
          <p className="max-w-xl leading-7 text-muted-foreground">{t.body}</p>
          <p className="border-l-2 border-border pl-4 text-base font-medium leading-7">
            {t.sequence}
          </p>
          <RelationshipTreatment />
        </div>

        <ol className="grid min-w-0 gap-0 border-t border-border lg:grid-cols-2 lg:border-t-0">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex min-w-0 flex-col gap-4 border-b border-border py-6 first:pt-0 last:border-b-0 lg:border-t lg:px-6 lg:py-6 lg:first:border-t-0 lg:first:pt-0 lg:nth-[2]:border-t-0 lg:nth-[2]:pt-0 lg:nth-[3]:border-b-0 lg:nth-[4]:border-b-0"
            >
              <span className="font-mono text-xs text-muted-foreground tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="text-xl font-semibold">{step.title}</h3>
              <p className="max-w-md leading-7 text-muted-foreground">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

type ProductChapter = {
  title: string
  outcome: string
  body: string
  qualifier: string
  points: string[]
  icon: ElementType
}

function ProductStory({ dictionary }: { dictionary: Dictionary }) {
  const t = dictionary.landing.product
  const chapters: ProductChapter[] = [
    {
      title: t.chartsTitle,
      outcome: t.chartsOutcome,
      body: t.chartsBody,
      qualifier: t.chartsQualifier,
      points: [t.chartsPointOne, t.chartsPointTwo, t.chartsPointThree],
      icon: LineChartIcon,
    },
    {
      title: t.reactionTitle,
      outcome: t.reactionOutcome,
      body: t.reactionBody,
      qualifier: t.reactionQualifier,
      points: [t.reactionPointOne, t.reactionPointTwo, t.reactionPointThree],
      icon: NewspaperIcon,
    },
    {
      title: t.graphTitle,
      outcome: t.graphOutcome,
      body: t.graphBody,
      qualifier: t.graphQualifier,
      points: [t.graphPointOne, t.graphPointTwo, t.graphPointThree],
      icon: NetworkIcon,
    },
  ]

  return (
    <section
      id="product"
      data-landing-section="product-story"
      aria-labelledby="landing-product-heading"
      className="border-b border-border/80"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex max-w-3xl flex-col gap-5">
          <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            {t.eyebrow}
          </p>
          <h2
            id="landing-product-heading"
            className="text-3xl leading-tight font-semibold tracking-[-0.02em] sm:text-4xl"
          >
            {t.heading}
          </h2>
          <p className="leading-7 text-muted-foreground">{t.body}</p>
        </div>

        <div className="grid gap-0 border-y border-border lg:grid-cols-3 lg:border-y-0 lg:border-l">
          {chapters.map((chapter) => {
            const Icon = chapter.icon
            return (
              <article
                key={chapter.title}
                data-product-chapter
                className="flex min-w-0 flex-col gap-6 border-b border-border px-0 py-8 last:border-b-0 lg:border-r lg:border-b-0 lg:px-7 lg:py-0 lg:first:pl-0"
              >
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex size-10 items-center justify-center border border-border bg-muted/30"
                  >
                    <Icon className="text-muted-foreground" />
                  </span>
                  <h3 className="text-xl font-semibold">{chapter.title}</h3>
                </div>
                <p className="text-base font-medium leading-7">{chapter.outcome}</p>
                <p className="leading-7 text-muted-foreground">{chapter.body}</p>
                <ul className="flex flex-col gap-3 text-sm leading-6">
                  {chapter.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <SparklesIcon
                        aria-hidden="true"
                        className="mt-1 shrink-0 text-muted-foreground"
                      />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-auto border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
                  {chapter.qualifier}
                </p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function WorkspaceAssistant({ dictionary }: { dictionary: Dictionary }) {
  const t = dictionary.landing.workspaceAi

  return (
    <section
      id="workspace-ai"
      data-landing-section="workspace-assistant"
      aria-labelledby="landing-workspace-heading"
      className="border-b border-border/80"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[minmax(16rem,0.7fr)_minmax(0,1.3fr)] lg:px-8">
        <div className="flex flex-col gap-5">
          <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            {t.eyebrow}
          </p>
          <h2
            id="landing-workspace-heading"
            className="text-3xl leading-tight font-semibold tracking-[-0.02em] sm:text-4xl"
          >
            {t.heading}
          </h2>
          <p className="leading-7 text-muted-foreground">{t.body}</p>
        </div>
        <div className="grid gap-0 border-y border-border sm:grid-cols-2 sm:border-y-0 sm:border-l">
          <SupportCard
            icon={CalendarClockIcon}
            title={t.trackedAssetsTitle}
            body={t.trackedAssetsBody}
          />
          <SupportCard
            icon={BrainCircuitIcon}
            title={t.conversationsTitle}
            body={t.conversationsBody}
          />
        </div>
      </div>
      <p className="mx-auto w-full max-w-7xl px-4 pb-16 text-sm leading-6 text-muted-foreground sm:px-6 sm:pb-24 lg:px-8">
        {t.qualifier}
      </p>
    </section>
  )
}

function SupportCard({
  icon: Icon,
  title,
  body,
}: {
  icon: ElementType
  title: string
  body: string
}) {
  return (
    <article className="flex min-w-0 flex-col gap-4 border-b border-border py-7 sm:border-r sm:border-b-0 sm:px-7 sm:first:pl-0 sm:last:border-r-0">
      <Icon aria-hidden="true" className="text-muted-foreground" />
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="leading-7 text-muted-foreground">{body}</p>
    </article>
  )
}

function TrustBoundary({ dictionary }: { dictionary: Dictionary }) {
  const t = dictionary.landing.trust

  return (
    <section
      id="trust"
      data-landing-section="trust-boundary"
      aria-labelledby="landing-trust-heading"
      className="border-b border-border/80"
    >
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[auto_minmax(0,1fr)] lg:gap-10 lg:px-8">
        <div
          aria-hidden="true"
          className="flex size-12 items-center justify-center border border-border bg-muted/30"
        >
          <ShieldCheckIcon className="text-muted-foreground" />
        </div>
        <div className="flex max-w-4xl flex-col gap-5">
          <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            {t.eyebrow}
          </p>
          <h2
            id="landing-trust-heading"
            className="text-3xl leading-tight font-semibold tracking-[-0.02em] sm:text-4xl"
          >
            {t.heading}
          </h2>
          <p className="leading-7 text-muted-foreground">{t.body}</p>
          <ul className="grid gap-3 border-t border-border pt-5 sm:grid-cols-3">
            {[t.pointOne, t.pointTwo, t.pointThree].map((point) => (
              <li key={point} className="text-sm leading-6">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}

function FinalAccessCta({
  access,
  dictionary,
}: {
  access: ReturnType<typeof createLandingAccessModel>
  dictionary: Dictionary
}) {
  const t = dictionary.landing.finalCta

  return (
    <section
      id="access"
      data-landing-section="final-access-cta"
      aria-labelledby="landing-access-heading"
      className="border-b border-border/80"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 sm:py-28">
        <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
          {t.accessLabel}
        </p>
        <h2
          id="landing-access-heading"
          className="text-3xl leading-tight font-semibold tracking-[-0.02em] sm:text-4xl"
        >
          {t.heading}
        </h2>
        <p className="max-w-2xl leading-7 text-muted-foreground">{t.body}</p>
        <LandingActionButton action={access.finalCta} size="lg" />
        {access.finalCta.kind === "email" ? (
          <p className="text-sm text-muted-foreground">{access.requestAccessNote}</p>
        ) : null}
      </div>
    </section>
  )
}

function LandingFooter({
  access,
  dictionary,
  locale,
}: {
  access: ReturnType<typeof createLandingAccessModel>
  dictionary: Dictionary
  locale: AppLocale
}) {
  const t = dictionary.landing

  return (
    <footer data-landing-part="footer" className="bg-muted/20">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:px-8">
        <div className="flex max-w-md flex-col gap-4">
          <Link
            href={withLocalePath("/", locale)}
            aria-label={t.footer.brandLabel}
            className="flex w-fit items-center gap-3 rounded-md font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span aria-hidden="true">
              <Logo width={28} height={28} />
            </span>
            <span>{dictionary.common.appName}</span>
          </Link>
          <p className="text-sm leading-6 text-muted-foreground">
            {t.footer.description}
          </p>
        </div>

        <nav
          aria-label={t.accessibility.footerNavigation}
          className="flex flex-col items-start gap-4 text-sm sm:items-end"
        >
          <Suspense fallback={<LandingLocaleLinksFallback locale={locale} labels={t.localeControl} />}>
            <LandingLocaleLinks
              currentLocale={locale}
              labels={{
                group: t.localeControl.label,
                vi: t.localeControl.vietnamese,
                en: t.localeControl.english,
              }}
            />
          </Suspense>
          <LandingActionLink
            action={access.footerAppEntry}
            className="rounded-md px-2 py-2 font-medium hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          />
          <a
            href={access.footerRequestAccess.href}
            aria-label={t.footer.requestAccessEmailLabel}
            className="rounded-md px-2 py-2 font-mono text-xs text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            {access.footerRequestAccess.label}
          </a>
          <p className="max-w-xs text-left text-xs leading-5 text-muted-foreground sm:text-right">
            {t.footer.requestAccessEmailNote}
          </p>
        </nav>
      </div>
    </footer>
  )
}

function LandingActionButton({
  action,
  className,
  size = "default",
  variant = "default",
  showArrow = true,
}: LandingActionButtonProps) {
  const content = (
    <>
      {action.label}
      {showArrow ? <ArrowRightIcon data-icon="inline-end" aria-hidden="true" /> : null}
    </>
  )
  const classes = buttonVariants({ variant, size, className })

  if (action.kind === "internal") {
    return (
      <Link href={action.href} aria-label={action.ariaLabel} className={classes}>
        {content}
      </Link>
    )
  }

  return (
    <a href={action.href} aria-label={action.ariaLabel} className={classes}>
      {content}
    </a>
  )
}

function LandingActionLink({
  action,
  className,
}: {
  action: LandingAccessAction
  className?: string
}) {
  if (action.kind === "internal") {
    return (
      <Link href={action.href} aria-label={action.ariaLabel} className={className}>
        {action.label}
      </Link>
    )
  }

  return (
    <a href={action.href} aria-label={action.ariaLabel} className={className}>
      {action.label}
    </a>
  )
}

function LandingLocaleLinksFallback({
  locale,
  labels,
}: {
  locale: AppLocale
  labels: {
    label: string
    vietnamese: string
    english: string
  }
}) {
  return (
    <nav aria-label={labels.label} className="flex items-center gap-1 text-xs text-muted-foreground">
      <Link
        href={withLocalePath("/", "vi")}
        lang="vi"
        hrefLang="vi"
        aria-current={locale === "vi" ? "page" : undefined}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-2 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {labels.vietnamese}
      </Link>
      <span aria-hidden="true">/</span>
      <Link
        href={withLocalePath("/", "en")}
        lang="en"
        hrefLang="en"
        aria-current={locale === "en" ? "page" : undefined}
        className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md px-2 py-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        {labels.english}
      </Link>
    </nav>
  )
}
