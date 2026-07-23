import { registerLocale, getSupportedLocales, type Period, type Locales } from "klinecharts"

import type { MarketChartTimeframe } from "@/app/lib/market-charts/definitions"

const MINUTE_MS = 60 * 1000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

export const KLINE_CHART_VI_LOCALE: Locales = {
  change: "Thay đổi: ",
  close: "Đóng: ",
  day: "ngày",
  high: "Cao: ",
  hour: "giờ",
  low: "Thấp: ",
  minute: "phút",
  month: "tháng",
  open: "Mở: ",
  second: "giây",
  time: "Thời gian: ",
  turnover: "Giá trị: ",
  volume: "Khối lượng: ",
  week: "tuần",
  year: "năm",
}

let kLineChartLocalesRegistered = false

export function ensureKLineChartLocales() {
  if (kLineChartLocalesRegistered) {
    return
  }

  registerLocale("vi-VN", KLINE_CHART_VI_LOCALE)
  registerLocale("vi", KLINE_CHART_VI_LOCALE)
  kLineChartLocalesRegistered = true
}

export function resolveKLineChartLocale(locale: string) {
  ensureKLineChartLocales()

  return getSupportedLocales().includes(locale) ? locale : "en-US"
}

export function createKLinePeriod(timeframe: MarketChartTimeframe): Period {
  switch (timeframe) {
    case "1m":
      return { type: "minute", span: 1 }
    case "5m":
      return { type: "minute", span: 5 }
    case "15m":
      return { type: "minute", span: 15 }
    case "30m":
      return { type: "minute", span: 30 }
    case "1h":
      return { type: "hour", span: 1 }
    case "4h":
      return { type: "hour", span: 4 }
    case "1d":
      return { type: "day", span: 1 }
    case "1w":
      return { type: "week", span: 1 }
    case "1mo":
      return { type: "month", span: 1 }
    default:
      return { type: "hour", span: 1 }
  }
}

export { MINUTE_MS, HOUR_MS, DAY_MS }
