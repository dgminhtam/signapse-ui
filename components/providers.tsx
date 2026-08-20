"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { AppLocale } from "@/app/lib/i18n/config"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"
import { LocalizationProvider } from "@/app/lib/i18n/provider"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

interface ProvidersProps {
  locale: AppLocale
  dictionary: Dictionary
  children: React.ReactNode
}

export function Providers({ locale, dictionary, children }: ProvidersProps) {
  return (
    <LocalizationProvider locale={locale} dictionary={dictionary}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <TooltipProvider delay={0}>{children}</TooltipProvider>
        <Toaster richColors position="top-right" />
      </NextThemesProvider>
    </LocalizationProvider>
  )
}
