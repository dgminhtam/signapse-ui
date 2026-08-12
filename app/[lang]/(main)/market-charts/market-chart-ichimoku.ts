import {
  getSupportedIndicators,
  registerIndicator,
  type IndicatorDrawParams,
  type KLineData,
} from "klinecharts"

export const ICHIMOKU_DISPLACEMENT = 26

const ICHIMOKU_PARAMS = [9, 26, 52, ICHIMOKU_DISPLACEMENT] as const
const KUMO_ALPHA = 0.14

interface IchimokuValue {
  tenkan?: number
  kijun?: number
  senkouA?: number
  senkouB?: number
  chikou?: number
}

type IchimokuCandle = Pick<KLineData, "close" | "high" | "low">

interface IchimokuCloudPoint {
  dataIndex: number
  spanA: number
  spanB: number
}

interface IchimokuCloudPolygon {
  points: Array<{ dataIndex: number; value: number }>
  tone: "bullish" | "bearish"
}

function getRangeMidpoint(
  dataList: readonly IchimokuCandle[],
  endIndex: number,
  period: number
) {
  if (endIndex < period - 1) {
    return undefined
  }

  let highestHigh = Number.NEGATIVE_INFINITY
  let lowestLow = Number.POSITIVE_INFINITY

  // ponytail: fixed max window is 52; use monotonic queues only if periods become user-sized.
  for (let index = endIndex - period + 1; index <= endIndex; index += 1) {
    highestHigh = Math.max(highestHigh, dataList[index].high)
    lowestLow = Math.min(lowestLow, dataList[index].low)
  }

  return (highestHigh + lowestLow) / 2
}

export function calculateIchimoku(
  dataList: readonly IchimokuCandle[],
  params: readonly number[] = ICHIMOKU_PARAMS
): IchimokuValue[] {
  if (dataList.length === 0) {
    return []
  }

  const [tenkanPeriod, kijunPeriod, senkouBPeriod, displacement] = params
  if (
    [tenkanPeriod, kijunPeriod, senkouBPeriod, displacement].some(
      (value) => !Number.isInteger(value) || value <= 0
    )
  ) {
    return dataList.map(() => ({}))
  }

  const result: IchimokuValue[] = Array.from(
    { length: dataList.length + displacement },
    () => ({})
  )

  for (let index = 0; index < dataList.length; index += 1) {
    const tenkan = getRangeMidpoint(dataList, index, tenkanPeriod)
    const kijun = getRangeMidpoint(dataList, index, kijunPeriod)
    const senkouB = getRangeMidpoint(dataList, index, senkouBPeriod)

    if (tenkan !== undefined) {
      result[index].tenkan = tenkan
    }
    if (kijun !== undefined) {
      result[index].kijun = kijun
    }

    const futureIndex = index + displacement
    if (tenkan !== undefined && kijun !== undefined) {
      result[futureIndex].senkouA = (tenkan + kijun) / 2
    }
    if (senkouB !== undefined) {
      result[futureIndex].senkouB = senkouB
    }
    if (index >= displacement) {
      result[index - displacement].chikou = dataList[index].close
    }
  }

  return result
}

export function createIchimokuCloudPolygons(
  previous: IchimokuCloudPoint,
  current: IchimokuCloudPoint
): IchimokuCloudPolygon[] {
  const previousDifference = previous.spanA - previous.spanB
  const currentDifference = current.spanA - current.spanB
  const crosses =
    previousDifference !== 0 &&
    currentDifference !== 0 &&
    Math.sign(previousDifference) !== Math.sign(currentDifference)

  if (!crosses) {
    return [
      {
        points: [
          { dataIndex: previous.dataIndex, value: previous.spanA },
          { dataIndex: current.dataIndex, value: current.spanA },
          { dataIndex: current.dataIndex, value: current.spanB },
          { dataIndex: previous.dataIndex, value: previous.spanB },
        ],
        tone:
          (previousDifference || currentDifference) >= 0
            ? "bullish"
            : "bearish",
      },
    ]
  }

  const ratio = previousDifference / (previousDifference - currentDifference)
  const crossing = {
    dataIndex:
      previous.dataIndex + (current.dataIndex - previous.dataIndex) * ratio,
    value: previous.spanA + (current.spanA - previous.spanA) * ratio,
  }

  return [
    {
      points: [
        { dataIndex: previous.dataIndex, value: previous.spanA },
        crossing,
        { dataIndex: previous.dataIndex, value: previous.spanB },
      ],
      tone: previousDifference > 0 ? "bullish" : "bearish",
    },
    {
      points: [
        crossing,
        { dataIndex: current.dataIndex, value: current.spanA },
        { dataIndex: current.dataIndex, value: current.spanB },
      ],
      tone: currentDifference > 0 ? "bullish" : "bearish",
    },
  ]
}

function drawIchimoku({
  bounding,
  chart,
  ctx,
  indicator,
  xAxis,
  yAxis,
}: IndicatorDrawParams<IchimokuValue, number, unknown>) {
  const result = indicator.result
  const visibleRange = chart.getVisibleRange()
  const from = Math.max(1, Math.floor(visibleRange.realFrom) - 1)
  const to = Math.min(result.length - 1, Math.ceil(visibleRange.realTo) + 1)
  const candleStyles = chart.getStyles().candle.bar

  ctx.beginPath()
  ctx.rect(0, 0, bounding.width, bounding.height)
  ctx.clip()
  ctx.globalAlpha = KUMO_ALPHA

  for (let index = from; index <= to; index += 1) {
    const previous = result[index - 1]
    const current = result[index]

    if (
      previous?.senkouA === undefined ||
      previous.senkouB === undefined ||
      current?.senkouA === undefined ||
      current.senkouB === undefined
    ) {
      continue
    }

    const polygons = createIchimokuCloudPolygons(
      {
        dataIndex: index - 1,
        spanA: previous.senkouA,
        spanB: previous.senkouB,
      },
      {
        dataIndex: index,
        spanA: current.senkouA,
        spanB: current.senkouB,
      }
    )

    for (const polygon of polygons) {
      ctx.beginPath()
      polygon.points.forEach((point, pointIndex) => {
        const x = xAxis.convertToPixel(point.dataIndex)
        const y = yAxis.convertToPixel(point.value)
        if (pointIndex === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      ctx.closePath()
      ctx.fillStyle =
        polygon.tone === "bullish"
          ? candleStyles.upColor
          : candleStyles.downColor
      ctx.fill()
    }
  }

  ctx.globalAlpha = 1
  return false
}

export function registerMarketChartIchimoku() {
  if (getSupportedIndicators().includes("ICHIMOKU")) {
    return
  }

  registerIndicator<IchimokuValue, number>({
    name: "ICHIMOKU",
    shortName: "Ichimoku",
    calcParams: [...ICHIMOKU_PARAMS],
    series: "price",
    figures: [
      { key: "tenkan", title: "TENKAN: ", type: "line" },
      { key: "kijun", title: "KIJUN: ", type: "line" },
      { key: "senkouA", title: "SENKOU A: ", type: "line" },
      { key: "senkouB", title: "SENKOU B: ", type: "line" },
      { key: "chikou", title: "CHIKOU: ", type: "line" },
    ],
    calc(dataList, indicator) {
      return calculateIchimoku(dataList, indicator.calcParams)
    },
    draw: drawIchimoku,
  })
}
