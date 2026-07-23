import {
  getSupportedIndicators,
  registerIndicator,
  type KLineData,
} from "klinecharts"

interface AtrValue {
  atr?: number
}

type AtrCandle = Pick<KLineData, "close" | "high" | "low">

export function calculateAtr(
  dataList: readonly AtrCandle[],
  period = 14
): AtrValue[] {
  const result: AtrValue[] = dataList.map(() => ({}))

  if (!Number.isInteger(period) || period <= 0) {
    return result
  }

  let trueRangeSum = 0
  let previousAtr = 0

  for (let index = 0; index < dataList.length; index += 1) {
    const candle = dataList[index]
    const previousClose = dataList[index - 1]?.close
    const trueRange =
      previousClose === undefined
        ? candle.high - candle.low
        : Math.max(
            candle.high - candle.low,
            Math.abs(candle.high - previousClose),
            Math.abs(candle.low - previousClose)
          )

    if (index < period) {
      trueRangeSum += trueRange
    }

    if (index === period - 1) {
      previousAtr = trueRangeSum / period
      result[index] = { atr: previousAtr }
    } else if (index >= period) {
      previousAtr = (previousAtr * (period - 1) + trueRange) / period
      result[index] = { atr: previousAtr }
    }
  }

  return result
}

export function registerMarketChartAtr() {
  if (getSupportedIndicators().includes("ATR")) {
    return
  }

  registerIndicator<AtrValue, number>({
    name: "ATR",
    shortName: "ATR",
    calcParams: [14],
    series: "price",
    figures: [{ key: "atr", title: "ATR: ", type: "line" }],
    calc(dataList, indicator) {
      return calculateAtr(dataList, indicator.calcParams[0])
    },
  })
}
