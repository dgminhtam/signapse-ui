import AxeBuilder from "@axe-core/playwright"

import { expect, test } from "./fixtures"

const sectionOrder = [
  "hero-product-proof",
  "product-story",
  "analysis-flow",
  "trust-boundary",
  "final-access-cta",
]

test.describe("P0 public landing", () => {
  for (const locale of ["vi", "en"] as const) {
    test(`${locale} renders the four-feature story and authenticated access paths`, async ({
      page,
    }) => {
      await page.goto(`/${locale}`)

      await expect(page.locator("h1")).toHaveCount(1)
      await expect(page.locator("[data-landing-section]")).toHaveCount(5)
      await expect(
        page
          .locator("[data-landing-section]")
          .evaluateAll((sections) =>
            sections.map((section) =>
              section.getAttribute("data-landing-section")
            )
          )
      ).resolves.toEqual(sectionOrder)

      await expect(page.locator("[data-product-chapter]")).toHaveCount(4)
      await expect(
        page.locator('[data-product-chapter][data-media-state="text-first"]')
      ).toHaveCount(4)
      await expect(page.locator("[data-landing-media-slot]")).toHaveCount(0)
      await expect(page.locator("[data-product-chapter] h3")).toHaveCount(4)
      await expect(
        page.locator("[data-product-chapter] h3").first()
      ).toContainText(
        locale === "vi"
          ? "Nhìn thấy các mối liên hệ trong thị trường."
          : "See how market information connects."
      )
      await expect(page.locator("#how-it-works")).toContainText(
        locale === "vi"
          ? "Chọn tài sản, xem diễn biến giá"
          : "Choose an asset, review price action"
      )
      await expect(page.locator("#how-it-works")).toContainText(
        locale === "vi"
          ? "Phân tích cùng Trợ lý AI"
          : "Analyze with the AI Assistant"
      )
      await expect(page.locator("#workspace-ai")).toHaveCount(0)
      await expect(page.locator("#product")).not.toContainText("Market Query")

      for (const anchor of [
        "knowledge-graph",
        "live-charts",
        "ai-assistant",
        "telegram",
      ]) {
        await expect(
          page.locator(`[data-feature-link="${anchor}"]`)
        ).toHaveAttribute("href", `#${anchor}`)
      }

      const dashboardLabel =
        locale === "vi"
          ? "Mở bảng điều khiển Signapse"
          : "Open the Signapse dashboard"
      await expect(
        page.getByRole("link", { name: dashboardLabel }).first()
      ).toHaveAttribute("href", `/${locale}/dashboard`)
      await expect(page.locator('a[href="#product"]').first()).toBeVisible()
      await expect(page.getByText("request-access@signapse.ai")).toBeVisible()
      await expect(page.locator('a[href^="mailto:"]')).toHaveAttribute(
        "href",
        "mailto:request-access@signapse.ai?subject=Signapse%20access%20request"
      )

      const figure = page.locator('[data-landing-visual="context-figure"]')
      await expect(figure.locator("figcaption")).toHaveClass(/sr-only/)
      await expect(figure.locator("[data-context-stage] button")).toHaveCount(0)
      await expect(
        page.locator('[data-landing-section="hero-product-proof"]')
      ).toContainText(
        locale === "vi"
          ? "Hiểu thị trường qua Đồ thị Tri thức và AI."
          : "Understand markets through the Knowledge Graph and AI."
      )
    })
  }

  test("switches locale while preserving query and supported feature hash", async ({
    page,
  }) => {
    await page.goto("/vi?source=hero#knowledge-graph")
    await page
      .getByRole("link", { name: "English", exact: true })
      .first()
      .click()
    await expect(page).toHaveURL(/\/en\?source=hero#knowledge-graph$/)
    await expect(page.locator("html")).toHaveAttribute("lang", "en")

    await page.goto("/en?source=footer#workspace-ai")
    await page
      .getByRole("link", { name: "Tiếng Việt", exact: true })
      .first()
      .click()
    await expect(page).toHaveURL(/\/vi\?source=footer$/)
  })

  test("keeps the native mobile disclosure keyboard-operable", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto("/vi")

    await expect(
      page.getByRole("link", { name: "Signapse", exact: true }).first()
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "Mở bảng điều khiển Signapse" }).first()
    ).toBeVisible()

    const summary = page.locator("[data-mobile-menu] summary")
    await summary.focus()
    await expect(summary).toBeFocused()
    await summary.press("Enter")
    await expect(page.locator("[data-mobile-menu]")).toHaveAttribute("open", "")
    await expect(
      page.getByRole("link", { name: "Tính năng", exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole("link", { name: "English", exact: true }).last()
    ).toBeVisible()
    const box = await summary.boundingBox()
    expect(box?.width).toBeGreaterThanOrEqual(44)
    expect(box?.height).toBeGreaterThanOrEqual(44)
  })

  test("has no serious landing axe violations or page overflow at target widths", async ({
    page,
  }) => {
    for (const width of [375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto("/en")
      await page.emulateMedia({
        reducedMotion: "reduce",
        colorScheme: width % 2 ? "light" : "dark",
      })
      await expect
        .poll(() =>
          page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth
          )
        )
        .toBe(true)
    }

    await page.setViewportSize({ width: 375, height: 900 })
    await page.goto("/en")
    await page.evaluate(() => {
      document.documentElement.style.zoom = "2"
    })
    await expect(page.locator("h1")).toBeVisible()
    await expect
      .poll(() =>
        page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth * 2
        )
      )
      .toBe(true)

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze()
    expect(
      results.violations.filter(
        (violation) =>
          violation.impact === "serious" || violation.impact === "critical"
      )
    ).toEqual([])
  })

  for (const locale of ["vi", "en"] as const) {
    test(`${locale} exposes the figure interaction contract without application semantics`, async ({
      page,
    }) => {
      await page.goto(`/${locale}`)

      const stage = page.locator('[data-context-stage="interactive"]')
      await expect(stage).toHaveAttribute("data-context-mode", "graph")
      await expect(stage).not.toHaveAttribute("role", "application")
      await expect(page.locator("[data-context-status]")).toHaveAttribute(
        "aria-live",
        "polite"
      )
      await expect
        .poll(() => stage.getAttribute("data-renderer-state"), {
          timeout: 8000,
        })
        .not.toBe("loading")

      if ((await stage.getAttribute("data-enhanced")) === "true") {
        await expect(stage).toHaveAttribute("role", "group")
        const box = await stage.boundingBox()
        expect(box).not.toBeNull()
        if (!box) return
        await page.mouse.move(Math.max(0, box.x - 8), Math.max(0, box.y - 8))
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
        await expect(stage).toHaveAttribute("data-context-mode", "price")
        await page.mouse.move(Math.max(0, box.x - 8), Math.max(0, box.y - 8))
        await expect(stage).toHaveAttribute("data-context-mode", "graph")
        await stage.focus()
        await expect(stage).toBeFocused()
        await stage.press("Enter")
        await expect(stage).toHaveAttribute("data-context-mode", "price")
      } else {
        await expect(page.locator("[data-figure-fallback]")).toBeVisible()
        await expect(page.locator("[data-context-status]")).toContainText(
          locale === "vi"
            ? "Đang hiển thị hình tĩnh"
            : "Showing the static figure"
        )
      }
    })
  }

  test("coarse pointers do not get a hidden tap-to-switch mode", async ({
    browser,
  }) => {
    const context = await browser.newContext({
      hasTouch: true,
      viewport: { width: 375, height: 800 },
    })
    const coarsePage = await context.newPage()

    try {
      await coarsePage.goto("http://127.0.0.1:3100/en")
      const stage = coarsePage.locator('[data-context-stage="interactive"]')
      await expect
        .poll(() => stage.getAttribute("data-renderer-state"), {
          timeout: 8000,
        })
        .not.toBe("loading")
      await coarsePage.waitForTimeout(1000)
      await expect(stage).toHaveAttribute("data-context-mode", "graph")
      await stage.tap()
      await expect(stage).toHaveAttribute("data-context-mode", "graph")
    } finally {
      await context.close()
    }
  })

  for (const locale of ["vi", "en"] as const) {
    test(`${locale} renders preview metadata and localized social image references`, async ({
      page,
    }) => {
      await page.goto(`/${locale}`)

      await expect(page).toHaveTitle("Signapse | Market Intelligence Platform")
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        locale === "vi"
          ? "Signapse kết nối giá, sự kiện, phản ứng và nguồn tin liên quan để hỗ trợ phân tích thị trường bằng AI với bối cảnh có thể kiểm tra."
          : "Signapse connects price, events, market reactions, and related sources to support AI-assisted market analysis with context you can verify."
      )
      await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
        "content",
        /noindex/
      )
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://dev.signapse.cloud/${locale}`
      )
      await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
        "content",
        `https://dev.signapse.cloud/${locale}/opengraph-image`
      )
    })
  }
})
