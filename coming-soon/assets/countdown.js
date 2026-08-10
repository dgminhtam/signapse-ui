export const LAUNCH_AT = Date.parse("2026-09-01T09:00:00+07:00")

const COPY = Object.freeze({
  en: Object.freeze({
    countdownEyebrow: "Launching · September 1, 2026",
    countdownHeading: "Launching in",
    launchedEyebrow: "Live · September 1, 2026",
    launchedHeading: "Now live",
    launchedMessage: "Signapse is live.",
  }),
  vi: Object.freeze({
    countdownEyebrow: "Sắp ra mắt · 01.09.2026",
    countdownHeading: "Ra mắt sau",
    launchedEyebrow: "Đã ra mắt · 01.09.2026",
    launchedHeading: "Đã ra mắt",
    launchedMessage: "Signapse đã ra mắt.",
  }),
})

export function getCountdown(targetMs = LAUNCH_AT, nowMs = Date.now()) {
  const remainingMs = Math.max(0, targetMs - nowMs)

  return {
    days: Math.floor(remainingMs / 86_400_000),
    hours: Math.floor((remainingMs % 86_400_000) / 3_600_000),
    minutes: Math.floor((remainingMs % 3_600_000) / 60_000),
    seconds: Math.floor((remainingMs % 60_000) / 1_000),
    remainingMs,
    state: remainingMs === 0 ? "launched" : "countdown",
  }
}

export function getCountdownView(
  locale,
  targetMs = LAUNCH_AT,
  nowMs = Date.now()
) {
  const countdown = getCountdown(targetMs, nowMs)
  const resolvedLocale = locale === "en" ? "en" : "vi"
  const copy = COPY[resolvedLocale]
  const launched = countdown.state === "launched"

  return {
    ...countdown,
    eyebrow: launched ? copy.launchedEyebrow : copy.countdownEyebrow,
    heading: launched ? copy.launchedHeading : copy.countdownHeading,
    launchedMessage: copy.launchedMessage,
    locale: resolvedLocale,
  }
}

export function formatCountdownValue(value) {
  return String(value).padStart(2, "0")
}

export function renderCountdown(root, nowMs = Date.now()) {
  const grid = root.querySelector("[data-countdown-grid]")
  const heading = root.querySelector("[data-countdown-heading]")
  const fallback = root.querySelector("[data-countdown-fallback]")
  const launchState = root.querySelector("[data-launch-state]")
  const eyebrow = root.ownerDocument?.querySelector("[data-launch-eyebrow]")
  const values = Object.fromEntries(
    ["days", "hours", "minutes", "seconds"].map((unit) => [
      unit,
      root.querySelector(`[data-countdown-unit="${unit}"]`),
    ])
  )

  if (
    !grid ||
    !fallback ||
    !launchState ||
    Object.values(values).some((value) => !value)
  ) {
    return null
  }

  const view = getCountdownView(root.dataset.locale, LAUNCH_AT, nowMs)
  root.dataset.state = view.state
  if (heading) heading.textContent = view.heading
  if (eyebrow) eyebrow.textContent = view.eyebrow
  fallback.hidden = true

  if (view.state === "launched") {
    grid.hidden = true
    launchState.textContent = view.launchedMessage
    return view.state
  }

  grid.hidden = false
  launchState.textContent = ""

  for (const unit of ["days", "hours", "minutes", "seconds"]) {
    values[unit].textContent = formatCountdownValue(view[unit])
  }

  return view.state
}

export function mountCountdown(root) {
  let intervalId

  const render = () => {
    const state = renderCountdown(root)

    if (state === "launched") {
      clearInterval(intervalId)
    }

    return state
  }

  if (render() === "countdown") {
    intervalId = setInterval(render, 1_000)
  }
}

if (typeof document !== "undefined") {
  document.querySelectorAll("[data-countdown-root]").forEach(mountCountdown)
}
