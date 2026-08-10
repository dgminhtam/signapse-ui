import assert from "node:assert/strict"
import { createHash } from "node:crypto"
import { access, readFile } from "node:fs/promises"
import { join } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

import {
  LAUNCH_AT,
  formatCountdownValue,
  getCountdown,
  getCountdownView,
  renderCountdown,
} from "./assets/countdown.js"

const SITE_ROOT = fileURLToPath(new URL(".", import.meta.url))
const REPO_ROOT = join(SITE_ROOT, "..")

const pages = Object.freeze([
  {
    file: "index.html",
    lang: "vi",
    canonical: "https://signapse.cloud/",
    heading: "Thấy chuyển động.",
    languageSwitchHref: "/en/",
  },
  {
    file: join("en", "index.html"),
    lang: "en",
    canonical: "https://signapse.cloud/en/",
    heading: "See the move.",
    languageSwitchHref: "/",
  },
])

async function sha256(path) {
  return createHash("sha256").update(await readFile(path)).digest("hex")
}

function createCountdownRoot(locale) {
  const grid = { hidden: false }
  const heading = { textContent: "" }
  const eyebrow = { textContent: "" }
  const fallback = { hidden: false }
  const launchState = { textContent: "" }
  const values = Object.fromEntries(
    ["days", "hours", "minutes", "seconds"].map((unit) => [
      unit,
      { textContent: "--" },
    ])
  )

  return {
    dataset: { locale },
    grid,
    heading,
    eyebrow,
    fallback,
    launchState,
    ownerDocument: {
      querySelector(selector) {
        return selector === "[data-launch-eyebrow]" ? eyebrow : null
      },
    },
    querySelector(selector) {
      if (selector === "[data-countdown-grid]") return grid
      if (selector === "[data-countdown-heading]") return heading
      if (selector === "[data-countdown-fallback]") return fallback
      if (selector === "[data-launch-state]") return launchState

      const unit = selector.match(/data-countdown-unit="([^"]+)"/)?.[1]
      return values[unit] ?? null
    },
    values,
  }
}

test("launch instant is the approved UTC+7 timestamp", () => {
  assert.equal(LAUNCH_AT, Date.UTC(2026, 8, 1, 2, 0, 0))
})

test("countdown decomposes a known pre-launch duration", () => {
  const duration =
    1 * 86_400_000 + 2 * 3_600_000 + 3 * 60_000 + 4 * 1_000
  const countdown = getCountdown(LAUNCH_AT, LAUNCH_AT - duration)

  assert.deepEqual(countdown, {
    days: 1,
    hours: 2,
    minutes: 3,
    seconds: 4,
    remainingMs: duration,
    state: "countdown",
  })
  assert.equal(formatCountdownValue(countdown.seconds), "04")
})

test("exact and post-launch times clamp to a stable launched state", () => {
  for (const now of [LAUNCH_AT, LAUNCH_AT + 86_400_000]) {
    assert.deepEqual(getCountdown(LAUNCH_AT, now), {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      remainingMs: 0,
      state: "launched",
    })
  }

  assert.equal(
    getCountdownView("vi", LAUNCH_AT, LAUNCH_AT).launchedMessage,
    "Signapse đã ra mắt."
  )
  assert.equal(
    getCountdownView("en", LAUNCH_AT, LAUNCH_AT).launchedMessage,
    "Signapse is live."
  )
})

test("DOM rendering selects localized countdown and launched states", () => {
  const beforeLaunch = createCountdownRoot("en")
  assert.equal(renderCountdown(beforeLaunch, LAUNCH_AT - 1_000), "countdown")
  assert.equal(beforeLaunch.dataset.state, "countdown")
  assert.equal(beforeLaunch.values.seconds.textContent, "01")
  assert.equal(beforeLaunch.grid.hidden, false)
  assert.equal(beforeLaunch.fallback.hidden, true)
  assert.equal(beforeLaunch.launchState.textContent, "")
  assert.equal(beforeLaunch.heading.textContent, "Launching in")
  assert.equal(beforeLaunch.eyebrow.textContent, "Launching · September 1, 2026")

  const launched = createCountdownRoot("vi")
  assert.equal(renderCountdown(launched, LAUNCH_AT), "launched")
  assert.equal(launched.dataset.state, "launched")
  assert.equal(launched.grid.hidden, true)
  assert.equal(launched.fallback.hidden, true)
  assert.equal(launched.launchState.textContent, "Signapse đã ra mắt.")
  assert.equal(launched.heading.textContent, "Đã ra mắt")
  assert.equal(launched.eyebrow.textContent, "Đã ra mắt · 01.09.2026")
})

for (const page of pages) {
  test(`${page.file} is localized, indexable, and self-contained`, async () => {
    const html = await readFile(join(SITE_ROOT, page.file), "utf8")

    assert.match(html, new RegExp(`<html lang="${page.lang}">`))
    assert.match(html, new RegExp(page.heading, "u"))
    assert.match(
      html,
      new RegExp(`<link rel="canonical" href="${page.canonical.replaceAll("/", "\\/")}" \\/>`)
    )
    assert.match(html, /hreflang="vi"/)
    assert.match(html, /hreflang="en"/)
    assert.match(html, /hreflang="x-default"/)
    assert.match(html, /<noscript>/)
    assert.match(html, /name="twitter:image:alt"/)
    assert.match(html, new RegExp(`href="${page.languageSwitchHref.replaceAll("/", "\\/")}"`))
    assert.equal(html.match(/data-countdown-root/g)?.length, 1)
    assert.equal(html.match(/data-countdown-fallback/g)?.length, 1)
    assert.equal(html.match(/<h1\b/g)?.length, 1)
    assert.equal(html.match(/<li class="capability">/g)?.length, 3)

    const launchRegion = html.match(
      /<p\s+class="launch-state"[\s\S]*?<\/p>/
    )?.[0]
    assert.ok(launchRegion)
    assert.match(launchRegion, /aria-live="polite"/)
    assert.match(launchRegion, /aria-atomic="true"/)
    assert.doesNotMatch(launchRegion, /\shidden(?:\s|>)/)
    assert.match(html, /data-countdown-grid[\s\S]*?\shidden/)

    const localAssets = [
      ...html.matchAll(/(?:href|src)="(\/assets\/[^"#?]+)"/g),
    ].map((match) => match[1])

    assert.ok(localAssets.length >= 4)
    for (const asset of localAssets) {
      await access(join(SITE_ROOT, asset.slice(1)))
    }

    assert.doesNotMatch(html, /<form\b|<input\b|<textarea\b|<button\b/i)
    assert.doesNotMatch(
      html,
      /early access|request access|waitlist|email capture|yêu cầu quyền truy cập/i
    )
    assert.doesNotMatch(
      html,
      /testimonial|guaranteed (?:returns?|predictions?)|automated (?:trading|execution)|customer logos?|scarcity|only \d+ (?:spots?|places?)|buy signal|sell signal|investment advice|\b\d[\d,.]*\s+(?:users?|traders?|customers?|members?)|\b\d+[,.]?\d*%\s+(?:of\s+)?users|lời chứng thực|lợi nhuận cam kết|dự đoán đảm bảo|giao dịch tự động|logo khách hàng|khan hiếm|chỉ còn \d+|tín hiệu mua|tín hiệu bán|lời khuyên đầu tư|\b\d[\d,.]*\s+(?:người dùng|nhà giao dịch|khách hàng)/i
    )
    assert.doesNotMatch(html, /<script[^>]+src="https?:\/\//i)
    assert.doesNotMatch(
      html,
      /<link[^>]+rel="stylesheet"[^>]+href="https?:\/\//i
    )
  })
}

test("runtime has no network or application integration", async () => {
  const script = await readFile(join(SITE_ROOT, "assets", "countdown.js"), "utf8")
  const styles = await readFile(join(SITE_ROOT, "assets", "styles.css"), "utf8")

  assert.doesNotMatch(
    script,
    /fetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon|localStorage/
  )
  assert.doesNotMatch(styles, /@import|url\(\s*["']?https?:\/\//i)
  assert.match(styles, /prefers-reduced-motion:\s*reduce/)
})

test("deployed logo is an unchanged copy of the approved dark logo", async () => {
  const source = join(REPO_ROOT, "public", "images", "signapse_logo_dark.svg")
  const deployed = join(SITE_ROOT, "assets", "signapse-logo.svg")

  assert.equal(await sha256(deployed), await sha256(source))
})

test("social preview is a valid 1200 by 630 PNG", async () => {
  const preview = await readFile(
    join(SITE_ROOT, "assets", "social-preview.png")
  )

  assert.equal(preview.subarray(0, 8).toString("hex"), "89504e470d0a1a0a")
  assert.equal(preview.readUInt32BE(16), 1200)
  assert.equal(preview.readUInt32BE(20), 630)
})
