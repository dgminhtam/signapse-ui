import Link from "next/link"
import { Suspense, type ElementType } from "react"
import {
  ArrowRightIcon,
  BrainCircuitIcon,
  CalendarClockIcon,
  LineChartIcon,
  NetworkIcon,
  ShieldCheckIcon,
} from "lucide-react"

import type { AppLocale } from "@/app/lib/i18n/config"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import { withLocalePath } from "@/app/lib/i18n/routing"
import {
  getApprovedLandingProductCapture,
  type LandingProductFeature,
} from "./landing-product-media"
import {
  createLandingAccessModel,
  type LandingAccessAction,
} from "./landing-access"
import styles from "./landing-page.module.css"
import { LandingContextFigure } from "./landing-context-figure"
import {
  LandingProductCapture,
  type LandingProductCaptureLabels,
} from "./landing-product-capture"
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

      <LandingHeader access={access} dictionary={dictionary} locale={locale} />

      <main id="main-content" tabIndex={-1}>
        <HeroSection access={access} dictionary={dictionary} locale={locale} />
        <ProductStory dictionary={dictionary} locale={locale} />
        <AnalysisFlow dictionary={dictionary} />
        <TrustBoundary dictionary={dictionary} />
        <FinalAccessCta access={access} dictionary={dictionary} />
      </main>

      <LandingFooter access={access} dictionary={dictionary} locale={locale} />
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
    { href: "#product", label: t.nav.product },
    { href: "#how-it-works", label: t.nav.flow },
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
          <span className="hidden truncate sm:inline">
            {dictionary.common.appName}
          </span>
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
            <Suspense
              fallback={
                <LandingLocaleLinksFallback
                  locale={locale}
                  labels={t.localeControl}
                />
              }
            >
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
                <Suspense
                  fallback={
                    <LandingLocaleLinksFallback
                      locale={locale}
                      labels={t.localeControl}
                    />
                  }
                >
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
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(28rem,1.1fr)] lg:items-center lg:gap-14 lg:px-8 lg:py-24">
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

        <div className={`${styles.heroVisual} flex min-w-0 flex-col gap-6`}>
          <LandingContextFigure
            labels={{
              title: t.hero.contextFigureTitle,
              description: t.hero.contextFigureDescription,
              keyboardHint: t.hero.contextFigureKeyboardHint,
              statusGraph: t.hero.contextFigureStatusGraph,
              statusPrice: t.hero.contextFigureStatusPrice,
              ready: t.hero.contextFigureReady,
              fallback: t.hero.contextFigureFallback,
            }}
          />
          <dl className="grid gap-4 border-t border-border pt-5 sm:grid-cols-2 lg:grid-cols-1">
            <ProofPoint
              title={t.hero.proofOneTitle}
              body={t.hero.proofOneBody}
            />
            <ProofPoint
              title={t.hero.proofTwoTitle}
              body={t.hero.proofTwoBody}
            />
          </dl>
        </div>
      </div>
    </section>
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

function AnalysisFlow({ dictionary }: { dictionary: Dictionary }) {
  const t = dictionary.landing.analysisFlow
  const steps = [
    { title: t.stepOneTitle, body: t.stepOneBody },
    { title: t.stepTwoTitle, body: t.stepTwoBody },
    { title: t.stepThreeTitle, body: t.stepThreeBody },
  ]

  return (
    <section
      id="how-it-works"
      data-landing-section="analysis-flow"
      aria-labelledby="landing-flow-heading"
      className="border-b border-border/80"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="flex max-w-3xl flex-col gap-5">
          <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            {t.eyebrow}
          </p>
          <h2
            id="landing-flow-heading"
            className="text-3xl leading-tight font-semibold tracking-[-0.02em] sm:text-4xl"
          >
            {t.heading}
          </h2>
        </div>

        <ol className="grid min-w-0 gap-0 border-y border-border min-[1200px]:grid-cols-3 min-[1200px]:border-y-0 min-[1200px]:border-l">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex min-w-0 flex-col gap-4 border-b border-border py-6 last:border-b-0 min-[1200px]:border-r min-[1200px]:border-b-0 min-[1200px]:px-6 min-[1200px]:py-6 min-[1200px]:first:pl-6"
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
  id: LandingProductFeature
  title: string
  outcome: string
  body: string
  detail?: string
  media?: LandingProductCaptureLabels
  icon: ElementType
}

function ProductStory({
  dictionary,
  locale,
}: {
  dictionary: Dictionary
  locale: AppLocale
}) {
  const t = dictionary.landing.product
  const chapters: ProductChapter[] = [
    {
      id: "knowledge-graph",
      title: t.knowledgeGraphTitle,
      outcome: t.knowledgeGraphOutcome,
      body: t.knowledgeGraphBody,
      media: {
        alt: t.knowledgeGraphMediaAlt,
        label: t.knowledgeGraphMediaTitle,
        caption: t.knowledgeGraphMediaCaption,
        error: t.media.error,
        annotations: [
          t.knowledgeGraphAnnotationEvent,
          t.knowledgeGraphAnnotationAsset,
          t.knowledgeGraphAnnotationSource,
        ],
      },
      icon: NetworkIcon,
    },
    {
      id: "live-charts",
      title: t.liveChartsTitle,
      outcome: t.liveChartsOutcome,
      body: t.liveChartsBody,
      detail: t.liveChartsDetail,
      media: {
        alt: t.liveChartsMediaAlt,
        label: t.liveChartsMediaTitle,
        caption: t.liveChartsMediaCaption,
        error: t.media.error,
      },
      icon: LineChartIcon,
    },
    {
      id: "ai-assistant",
      title: t.aiAssistantTitle,
      outcome: t.aiAssistantOutcome,
      body: t.aiAssistantBody,
      icon: BrainCircuitIcon,
    },
    {
      id: "telegram",
      title: t.telegramTitle,
      outcome: t.telegramOutcome,
      body: t.telegramBody,
      detail: t.telegramSetup,
      icon: CalendarClockIcon,
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
        </div>

        <div className="flex flex-col border-y border-border">
          {chapters.map((chapter) => (
            <FeatureChapter
              chapter={chapter}
              key={chapter.id}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

function FeatureChapter({
  chapter,
  locale,
}: {
  chapter: ProductChapter
  locale: AppLocale
}) {
  const Icon = chapter.icon
  const capture =
    chapter.id === "knowledge-graph" || chapter.id === "live-charts"
      ? getApprovedLandingProductCapture(locale, chapter.id)
      : null
  const hasMedia = Boolean(capture && chapter.media)
  const isKnowledgeGraph = chapter.id === "knowledge-graph"

  return (
    <article
      id={chapter.id}
      data-product-chapter
      data-media-state={hasMedia ? "approved" : "text-first"}
      className={
        isKnowledgeGraph && hasMedia
          ? "grid min-w-0 gap-8 border-b border-border py-10 last:border-b-0 min-[1200px]:grid-cols-[minmax(18rem,0.65fr)_minmax(0,1.35fr)] min-[1200px]:items-start min-[1200px]:gap-14 min-[1200px]:py-14"
          : hasMedia
            ? "grid min-w-0 gap-8 border-b border-border py-10 last:border-b-0 min-[1200px]:grid-cols-2 min-[1200px]:gap-14 min-[1200px]:py-14"
            : "flex min-w-0 flex-col gap-5 border-b border-border py-10 last:border-b-0 min-[1200px]:max-w-3xl min-[1200px]:py-14"
      }
    >
      <div className="order-0 flex min-w-0 flex-col justify-center gap-5">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-10 items-center justify-center border border-border bg-muted/30"
          >
            <Icon className="text-muted-foreground" />
          </span>
          <p className="text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            {chapter.title}
          </p>
        </div>
        <h3 className="max-w-2xl text-2xl leading-tight font-semibold tracking-[-0.02em] sm:text-3xl">
          {chapter.outcome}
        </h3>
        <p className="leading-7 text-muted-foreground">{chapter.body}</p>
        {chapter.detail ? (
          <p className="border-l-2 border-border pl-4 text-sm leading-6 text-foreground">
            {chapter.detail}
          </p>
        ) : null}
      </div>
      {capture && chapter.media ? (
        <div className="order-0 min-w-0">
          <LandingProductCapture capture={capture} labels={chapter.media} />
        </div>
      ) : null}
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
          <p className="text-sm text-muted-foreground">
            {access.requestAccessNote}
          </p>
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
          <Suspense
            fallback={
              <LandingLocaleLinksFallback
                locale={locale}
                labels={t.localeControl}
              />
            }
          >
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
      {showArrow ? (
        <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
      ) : null}
    </>
  )
  const classes = buttonVariants({ variant, size, className })

  if (action.kind === "internal") {
    return (
      <Link
        href={action.href}
        aria-label={action.ariaLabel}
        className={classes}
      >
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
      <Link
        href={action.href}
        aria-label={action.ariaLabel}
        className={className}
      >
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
    <nav
      aria-label={labels.label}
      className="flex items-center gap-1 text-xs text-muted-foreground"
    >
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
