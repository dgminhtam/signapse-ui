import { AppLocale, getIntlLocale } from "./config"

type DateLike = string | number | Date | null | undefined

const DEFAULT_DATE_TIME_OPTIONS: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
}

function toDate(value: DateLike): Date | null {
  if (value === null || value === undefined || value === "") {
    return null
  }

  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatDateTime(
  value: DateLike,
  locale: AppLocale,
  options: Intl.DateTimeFormatOptions = DEFAULT_DATE_TIME_OPTIONS,
  fallback = "N/A"
): string {
  const date = toDate(value)

  if (!date) {
    return fallback
  }

  return new Intl.DateTimeFormat(getIntlLocale(locale), options).format(date)
}

export function formatDate(
  value: DateLike,
  locale: AppLocale,
  fallback = "N/A"
): string {
  return formatDateTime(
    value,
    locale,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
    fallback
  )
}

export function formatNumber(
  value: number,
  locale: AppLocale,
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(getIntlLocale(locale), options).format(value)
}

export function formatPercent(
  value: number,
  locale: AppLocale,
  options?: Intl.NumberFormatOptions
): string {
  return formatNumber(value, locale, {
    style: "percent",
    maximumFractionDigits: 1,
    ...options,
  })
}

export function formatCurrency(
  value: number,
  locale: AppLocale,
  currency = "VND",
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(getIntlLocale(locale), {
    style: "currency",
    currency,
    ...options,
  }).format(value)
}
