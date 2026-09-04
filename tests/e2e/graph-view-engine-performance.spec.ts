import { mkdir, writeFile } from "node:fs/promises"
import { resolve } from "node:path"

import type { Page } from "@playwright/test"

import { expect, test } from "./fixtures"

const PERFORMANCE_ENABLED = process.env.SIGNAPSE_GRAPH_VIEW_PERF === "1"
const RUNS_PER_CASE = Number(process.env.SIGNAPSE_GRAPH_VIEW_PERF_RUNS ?? 5)
const EDGE_COUNTS = [100, 400, 1000] as const
const ENGINES = ["sigma", "g6"] as const
const CACHE_STATES = ["cold", "warm"] as const
const ONLY_ENGINE = process.env.SIGNAPSE_GRAPH_VIEW_PERF_ENGINE as
  Engine | undefined
const ONLY_EDGE_COUNT = Number(
  process.env.SIGNAPSE_GRAPH_VIEW_PERF_EDGE_COUNT ?? 0
)
const ONLY_CACHE_STATE = process.env.SIGNAPSE_GRAPH_VIEW_PERF_CACHE_STATE as
  CacheState | undefined
const PERFORMANCE_REPORT_PATH = resolve(
  process.cwd(),
  "test-results",
  "graph-view-engine-performance.json"
)
const BENCHMARK_VIEWPORT = { height: 900, width: 1600 } as const

type Engine = (typeof ENGINES)[number]
type CacheState = (typeof CACHE_STATES)[number]
type EdgeCount = (typeof EDGE_COUNTS)[number]

const PERFORMANCE_ENGINES = ONLY_ENGINE
  ? ENGINES.filter((engine) => engine === ONLY_ENGINE)
  : ENGINES
const PERFORMANCE_EDGE_COUNTS = ONLY_EDGE_COUNT
  ? EDGE_COUNTS.filter((edgeCount) => edgeCount === ONLY_EDGE_COUNT)
  : EDGE_COUNTS
const PERFORMANCE_CACHE_STATES = ONLY_CACHE_STATE
  ? CACHE_STATES.filter((cacheState) => cacheState === ONLY_CACHE_STATE)
  : CACHE_STATES
const IS_FULL_MATRIX = !ONLY_ENGINE && !ONLY_EDGE_COUNT && !ONLY_CACHE_STATE

type BrowserPerformanceWindow = {
  frameDeltas: number[]
  longTasks: number[]
}

type PerformanceMeasurement = {
  cacheState: CacheState
  edgeCount: EdgeCount
  engine: Engine
  run: number
  firstVisibleMs: number
  idleFrameP95Ms: number
  idleFrameDeltas: number[]
  longTaskCount: number
  longTaskMaxMs: number
  longTasks: number[]
  settleMs: number
  dragFrameP95Ms: number
  dragFrameDeltas: number[]
  panFrameP95Ms: number
  panFrameDeltas: number[]
  zoomFrameP95Ms: number
  zoomFrameDeltas: number[]
}

type PerformanceAggregate = {
  cacheState: CacheState
  edgeCount: EdgeCount
  engine: Engine
  firstVisibleMsP50: number
  firstVisibleMsP95: number
  idleFrameP95MsP50: number
  idleFrameP95MsP95: number
  dragFrameP95MsP50: number
  dragFrameP95MsP95: number
  panFrameP95MsP50: number
  panFrameP95MsP95: number
  zoomFrameP95MsP50: number
  zoomFrameP95MsP95: number
  settleMsP50: number
  settleMsP95: number
  longTaskMaxMsP95: number
  longTaskRuns: number
  runs: number
}

function percentile(values: readonly number[], percentileValue: number) {
  if (values.length === 0) {
    return 0
  }

  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.min(
    sorted.length - 1,
    Math.ceil((percentileValue / 100) * sorted.length) - 1
  )

  return Number(sorted[index]?.toFixed(2) ?? 0)
}

function aggregateMeasurements(
  measurements: readonly PerformanceMeasurement[]
): PerformanceAggregate[] {
  const groups = new Map<string, PerformanceMeasurement[]>()

  for (const measurement of measurements) {
    const key = `${measurement.engine}|${measurement.edgeCount}|${measurement.cacheState}`
    const group = groups.get(key) ?? []
    group.push(measurement)
    groups.set(key, group)
  }

  return Array.from(groups.values()).flatMap((group) => {
    const firstMeasurement = group[0]

    if (!firstMeasurement) {
      return []
    }

    return [
      {
        cacheState: firstMeasurement.cacheState,
        edgeCount: firstMeasurement.edgeCount,
        engine: firstMeasurement.engine,
        firstVisibleMsP50: percentile(
          group.map((measurement) => measurement.firstVisibleMs),
          50
        ),
        firstVisibleMsP95: percentile(
          group.map((measurement) => measurement.firstVisibleMs),
          95
        ),
        idleFrameP95MsP50: percentile(
          group.map((measurement) => measurement.idleFrameP95Ms),
          50
        ),
        idleFrameP95MsP95: percentile(
          group.map((measurement) => measurement.idleFrameP95Ms),
          95
        ),
        dragFrameP95MsP50: percentile(
          group.map((measurement) => measurement.dragFrameP95Ms),
          50
        ),
        dragFrameP95MsP95: percentile(
          group.map((measurement) => measurement.dragFrameP95Ms),
          95
        ),
        panFrameP95MsP50: percentile(
          group.map((measurement) => measurement.panFrameP95Ms),
          50
        ),
        panFrameP95MsP95: percentile(
          group.map((measurement) => measurement.panFrameP95Ms),
          95
        ),
        zoomFrameP95MsP50: percentile(
          group.map((measurement) => measurement.zoomFrameP95Ms),
          50
        ),
        zoomFrameP95MsP95: percentile(
          group.map((measurement) => measurement.zoomFrameP95Ms),
          95
        ),
        settleMsP50: percentile(
          group.map((measurement) => measurement.settleMs),
          50
        ),
        settleMsP95: percentile(
          group.map((measurement) => measurement.settleMs),
          95
        ),
        longTaskMaxMsP95: percentile(
          group.map((measurement) => measurement.longTaskMaxMs),
          95
        ),
        longTaskRuns: group.filter(
          (measurement) => measurement.longTaskCount > 0
        ).length,
        runs: group.length,
      },
    ]
  })
}

function getRoute(engine: Engine, edgeCount: EdgeCount) {
  const route =
    engine === "sigma"
      ? "/vi/graph-view-sigma-demo"
      : "/vi/graph-view-g6-baseline"

  return `${route}?edges=${edgeCount}`
}

function getEngineCanvas(page: Page, engine: Engine) {
  return engine === "sigma"
    ? page.getByTestId("graph-demo-canvas")
    : page.locator('[data-engine-canvas="g6"]')
}

async function installPerformanceRecorder(page: Page) {
  await page.addInitScript(() => {
    const state = {
      frameDeltas: [] as number[],
      lastFrame: null as number | null,
      longTasks: [] as number[],
      recording: false,
    }

    if (typeof PerformanceObserver !== "undefined") {
      try {
        const observer = new PerformanceObserver((list) => {
          if (state.recording) {
            state.longTasks.push(
              ...list.getEntries().map((entry) => entry.duration)
            )
          }
        })

        observer.observe({ buffered: true, type: "longtask" })
      } catch {
        // Long-task observation is not available in every browser context.
      }
    }

    const recordFrame = (timestamp: number) => {
      if (state.recording && state.lastFrame !== null) {
        state.frameDeltas.push(timestamp - state.lastFrame)
      }

      state.lastFrame = timestamp
      window.requestAnimationFrame(recordFrame)
    }

    window.requestAnimationFrame(recordFrame)

    const recorder = {
      start() {
        state.frameDeltas = []
        state.lastFrame = null
        state.longTasks = []
        state.recording = true
      },
      stop(): BrowserPerformanceWindow {
        state.recording = false
        return {
          frameDeltas: [...state.frameDeltas],
          longTasks: [...state.longTasks],
        }
      },
    }

    ;(
      window as unknown as {
        __signapseGraphPerformance: typeof recorder
      }
    ).__signapseGraphPerformance = recorder
  })
}

async function startPerformanceWindow(page: Page) {
  await page.evaluate(() => {
    const recorder = (
      window as unknown as {
        __signapseGraphPerformance?: { start: () => void }
      }
    ).__signapseGraphPerformance

    recorder?.start()
  })
}

async function stopPerformanceWindow(page: Page) {
  return page.evaluate(() => {
    const recorder = (
      window as unknown as {
        __signapseGraphPerformance?: {
          stop: () => BrowserPerformanceWindow
        }
      }
    ).__signapseGraphPerformance

    return recorder?.stop() ?? { frameDeltas: [], longTasks: [] }
  })
}

async function measureAction(page: Page, action: () => Promise<void>) {
  await startPerformanceWindow(page)
  await action()
  await page.waitForTimeout(750)
  return stopPerformanceWindow(page)
}

async function getAnchorPoint(page: Page, engine: Engine) {
  const canvas = getEngineCanvas(page, engine)
  const box = await canvas.boundingBox()
  const anchorX = Number(await canvas.getAttribute("data-benchmark-anchor-x"))
  const anchorY = Number(await canvas.getAttribute("data-benchmark-anchor-y"))

  if (!box) {
    throw new Error(`Missing ${engine} graph canvas bounds`)
  }

  return {
    x: box.x + (Number.isFinite(anchorX) ? anchorX : box.width / 2),
    y: box.y + (Number.isFinite(anchorY) ? anchorY : box.height / 2),
    box,
  }
}

async function openGraph(
  page: Page,
  engine: Engine,
  edgeCount: EdgeCount,
  cacheState: CacheState
) {
  if (cacheState === "cold" && page.url() !== "about:blank") {
    await page.evaluate(() => localStorage.clear())
  }

  const startedAt = performance.now()
  console.log(`[graph perf] goto ${engine}/${edgeCount}`)
  await page.goto(getRoute(engine, edgeCount), {
    waitUntil: "domcontentloaded",
    timeout: 180_000,
  })
  console.log(`[graph perf] route returned ${engine}/${edgeCount}`)

  const canvas = getEngineCanvas(page, engine)
  await expect(canvas).toBeVisible({ timeout: 180_000 })
  await expect(canvas.locator("canvas").first()).toBeVisible({
    timeout: 180_000,
  })
  console.log(`[graph perf] canvas visible ${engine}/${edgeCount}`)

  const firstVisibleMs = performance.now() - startedAt
  const settleStartedAt = performance.now()

  if (engine === "sigma") {
    await expect
      .poll(
        () =>
          page
            .locator("[data-layout-status]")
            .getAttribute("data-layout-status"),
        {
          timeout: 30_000,
        }
      )
      .toMatch(/ready|cached/)
  } else {
    await page.waitForTimeout(2_000)
  }

  const settleMs = performance.now() - settleStartedAt

  return { firstVisibleMs, settleMs }
}

async function measureGraphInteractions(page: Page, engine: Engine) {
  const anchor = await getAnchorPoint(page, engine)
  const dragMeasurement = await measureAction(page, async () => {
    await page.mouse.move(anchor.x, anchor.y)
    await page.mouse.down()
    await page.mouse.move(anchor.x + 72, anchor.y + 36, { steps: 12 })
    await page.mouse.up()
  })
  const panMeasurement = await measureAction(page, async () => {
    const centerX = anchor.box.x + anchor.box.width / 2
    const centerY = anchor.box.y + anchor.box.height / 2

    await page.mouse.move(centerX, centerY)
    await page.mouse.down()
    await page.mouse.move(centerX + 48, centerY + 24, { steps: 10 })
    await page.mouse.up()
  })
  const zoomButton =
    engine === "sigma"
      ? page.getByTestId("graph-demo-zoom-in")
      : page.getByRole("button", { name: "Phóng to biểu đồ" })
  const zoomMeasurement = await measureAction(page, async () => {
    await zoomButton.click()
  })

  return {
    drag: dragMeasurement,
    pan: panMeasurement,
    zoom: zoomMeasurement,
  }
}

test.describe("Knowledge Graph engine performance", () => {
  test.skip(
    !PERFORMANCE_ENABLED,
    "Set SIGNAPSE_GRAPH_VIEW_PERF=1 to run the long performance matrix."
  )
  test.describe.configure({ mode: "serial" })
  test.setTimeout(1_800_000)

  test("records reproducible G6/Sigma measurements", async ({ page }) => {
    const measurements: PerformanceMeasurement[] = []
    await page.setViewportSize(BENCHMARK_VIEWPORT)
    await installPerformanceRecorder(page)

    for (const engine of PERFORMANCE_ENGINES) {
      for (const edgeCount of PERFORMANCE_EDGE_COUNTS) {
        for (const cacheState of PERFORMANCE_CACHE_STATES) {
          for (let run = 0; run < RUNS_PER_CASE; run += 1) {
            console.log(
              `[graph perf] start ${engine}/${edgeCount}/${cacheState}/run-${run + 1}`
            )
            const { firstVisibleMs, settleMs } = await openGraph(
              page,
              engine,
              edgeCount,
              cacheState
            )
            console.log(
              `[graph perf] visible ${engine}/${edgeCount}/${cacheState}/run-${run + 1} first=${firstVisibleMs.toFixed(0)}ms settle=${settleMs.toFixed(0)}ms`
            )
            const idleMeasurement = await measureAction(page, async () => {
              await page.waitForTimeout(500)
            })
            const interactions = await measureGraphInteractions(page, engine)
            console.log(
              `[graph perf] measured ${engine}/${edgeCount}/${cacheState}/run-${run + 1}`
            )

            measurements.push({
              cacheState,
              edgeCount,
              engine,
              run: run + 1,
              firstVisibleMs: Number(firstVisibleMs.toFixed(2)),
              idleFrameP95Ms: percentile(idleMeasurement.frameDeltas, 95),
              idleFrameDeltas: idleMeasurement.frameDeltas,
              longTaskCount: [
                ...idleMeasurement.longTasks,
                ...interactions.drag.longTasks,
                ...interactions.pan.longTasks,
                ...interactions.zoom.longTasks,
              ].filter((duration) => duration > 100).length,
              longTaskMaxMs: Number(
                Math.max(
                  0,
                  ...idleMeasurement.longTasks,
                  ...interactions.drag.longTasks,
                  ...interactions.pan.longTasks,
                  ...interactions.zoom.longTasks
                ).toFixed(2)
              ),
              longTasks: [
                ...idleMeasurement.longTasks,
                ...interactions.drag.longTasks,
                ...interactions.pan.longTasks,
                ...interactions.zoom.longTasks,
              ],
              settleMs: Number(settleMs.toFixed(2)),
              dragFrameP95Ms: percentile(interactions.drag.frameDeltas, 95),
              dragFrameDeltas: interactions.drag.frameDeltas,
              panFrameP95Ms: percentile(interactions.pan.frameDeltas, 95),
              panFrameDeltas: interactions.pan.frameDeltas,
              zoomFrameP95Ms: percentile(interactions.zoom.frameDeltas, 95),
              zoomFrameDeltas: interactions.zoom.frameDeltas,
            })
          }
        }
      }
    }

    const report = {
      bundler: process.env.SIGNAPSE_E2E_NEXT_BUNDLER ?? "turbopack",
      generatedAt: new Date().toISOString(),
      runsPerCase: RUNS_PER_CASE,
      serverMode: "fixture-development",
      viewport: await page.evaluate(() => ({
        devicePixelRatio: window.devicePixelRatio,
        height: window.innerHeight,
        userAgent: navigator.userAgent,
        width: window.innerWidth,
      })),
      fixture: {
        edgeCounts: EDGE_COUNTS,
        nodeCount: 100,
      },
      aggregates: aggregateMeasurements(measurements),
      measurements,
    }

    await mkdir(resolve(process.cwd(), "test-results"), { recursive: true })

    const denseSigma = measurements.filter(
      (measurement) =>
        measurement.engine === "sigma" && measurement.edgeCount === 1000
    )
    const standardSigma = measurements.filter(
      (measurement) =>
        measurement.engine === "sigma" && measurement.edgeCount === 400
    )

    if (IS_FULL_MATRIX) {
      expect(denseSigma.length).toBe(RUNS_PER_CASE * CACHE_STATES.length)
    } else {
      expect(measurements.length).toBeGreaterThan(0)
    }

    const evaluation = IS_FULL_MATRIX
      ? {
          standardSigmaDragP95Under50Ms: standardSigma.every(
            (measurement) => measurement.dragFrameP95Ms <= 50
          ),
          denseSigmaTwoTimesFasterThanG6: denseSigma.every(
            (sigmaMeasurement) => {
              const g6Measurement = measurements.find(
                (measurement) =>
                  measurement.engine === "g6" &&
                  measurement.edgeCount === sigmaMeasurement.edgeCount &&
                  measurement.cacheState === sigmaMeasurement.cacheState &&
                  measurement.run === sigmaMeasurement.run
              )

              return Boolean(
                g6Measurement &&
                sigmaMeasurement.dragFrameP95Ms * 2 <=
                  g6Measurement.dragFrameP95Ms
              )
            }
          ),
          standardSigmaHasNoLongTaskOver100Ms: standardSigma.every(
            (measurement) => measurement.longTaskMaxMs <= 100
          ),
        }
      : null

    await writeFile(
      PERFORMANCE_REPORT_PATH,
      JSON.stringify({ ...report, evaluation }, null, 2),
      "utf8"
    )
  })
})
