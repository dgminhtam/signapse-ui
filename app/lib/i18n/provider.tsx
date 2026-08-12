"use client"

import * as React from "react"

import { AppLocale, getIntlLocale } from "./config"
import type { Dictionary } from "./dictionary-types"
import {
  formatCurrency,
  formatDate,
  formatDateTime,
  formatNumber,
  formatPercent,
} from "./format"
import { formatMessage } from "./messages"

type DateLike = Parameters<typeof formatDateTime>[0]
type BoundDateFormatter = (value: DateLike, fallback?: string) => string
type BoundDateTimeFormatter = (
  value: DateLike,
  options?: Intl.DateTimeFormatOptions,
  fallback?: string
) => string
type BoundNumberFormatter = (
  value: number,
  options?: Intl.NumberFormatOptions
) => string
type BoundCurrencyFormatter = (
  value: number,
  currency?: string,
  options?: Intl.NumberFormatOptions
) => string

interface LocalizationContextValue {
  locale: AppLocale
  intlLocale: string
  dictionary: Dictionary
  formatMessage: typeof formatMessage
  formatDate: BoundDateFormatter
  formatDateTime: BoundDateTimeFormatter
  formatNumber: BoundNumberFormatter
  formatPercent: BoundNumberFormatter
  formatCurrency: BoundCurrencyFormatter
}

const LocalizationContext =
  React.createContext<LocalizationContextValue | null>(null)

interface LocalizationProviderProps {
  locale: AppLocale
  dictionary: Dictionary
  children: React.ReactNode
}

export function LocalizationProvider({
  locale,
  dictionary,
  children,
}: LocalizationProviderProps) {
  const value = React.useMemo<LocalizationContextValue>(() => {
    const boundFormatDate: BoundDateFormatter = (value, fallback) => {
      return formatDate(value, locale, fallback)
    }
    const boundFormatDateTime: BoundDateTimeFormatter = (
      value,
      options,
      fallback
    ) => {
      return formatDateTime(value, locale, options, fallback)
    }
    const boundFormatNumber: BoundNumberFormatter = (value, options) => {
      return formatNumber(value, locale, options)
    }
    const boundFormatPercent: BoundNumberFormatter = (value, options) => {
      return formatPercent(value, locale, options)
    }
    const boundFormatCurrency: BoundCurrencyFormatter = (
      value,
      currency,
      options
    ) => {
      return formatCurrency(value, locale, currency, options)
    }

    return {
      locale,
      intlLocale: getIntlLocale(locale),
      dictionary,
      formatMessage,
      formatDate: boundFormatDate,
      formatDateTime: boundFormatDateTime,
      formatNumber: boundFormatNumber,
      formatPercent: boundFormatPercent,
      formatCurrency: boundFormatCurrency,
    }
  }, [dictionary, locale])

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  )
}

export function useLocalization() {
  const context = React.useContext(LocalizationContext)

  if (!context) {
    throw new Error("useLocalization must be used within LocalizationProvider")
  }

  return context
}
