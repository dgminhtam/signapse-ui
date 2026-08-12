import { ClerkProvider } from "@clerk/nextjs"
import { enUS, viVN } from "@clerk/localizations"
import { notFound } from "next/navigation"
import { Geist, Geist_Mono } from "next/font/google"
import NextTopLoader from "nextjs-toploader"
import type { Metadata } from "next"

import "../globals.css"

import { getDictionary, hasLocale } from "@/app/lib/i18n/dictionaries"
import { AppLocale, SUPPORTED_APP_LOCALES } from "@/app/lib/i18n/config"
import { cn } from "@/lib/utils"
import { Providers } from "@/components/providers"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"

const fontSans = Geist({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-mono",
})

const clerkLocalizations: Record<AppLocale, typeof viVN> = {
  en: enUS,
  vi: viVN,
}

export const metadata: Metadata = {
  title: "Signapse - Market Intelligence Platform",
  description: "Real-time market data visualization and analysis",
  icons: {
    icon: "/favicon.svg",
  },
}

export async function generateStaticParams() {
  return SUPPORTED_APP_LOCALES.map((lang) => ({ lang }))
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ lang: string }>
}>) {
  const { lang } = await params

  if (!hasLocale(lang)) {
    notFound()
  }

  const dictionary = await getDictionary(lang)

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={cn(
        "h-screen antialiased",
        fontMono.variable,
        "font-sans",
        fontSans.variable
      )}
    >
      <body className="flex h-screen flex-col">
        <NextTopLoader color="var(--primary)" showSpinner={false} height={3} />
        <ClerkProvider localization={clerkLocalizations[lang]}>
          <Providers locale={lang} dictionary={dictionary}>
            {children}
          </Providers>
        </ClerkProvider>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  )
}
