import AxeBuilder from "@axe-core/playwright"

import { expect, test } from "./fixtures"

const sectionOrder = [
  "hero-product-proof",
  "analysis-flow",
  "product-story",
  "workspace-assistant",
  "trust-boundary",
  "final-access-cta",
]

test.describe("P0 public landing", () => {
  for (const locale of ["vi", "en"] as const) {
    test(`${locale} renders the canonical story and authenticated access paths`, async ({ page }) => {
      await page.goto(`/${locale}`)

      await expect(page.locator("h1")).toHaveCount(1)
      await expect(page.locator("[data-landing-section]")).toHaveCount(6)
      await expect(
        page.locator("[data-landing-section]").evaluateAll((sections) =>
          sections.map((section) => section.getAttribute("data-landing-section"))
        )
      ).resolves.toEqual(sectionOrder)

      await expect(page.locator("[data-product-chapter]")).toHaveCount(3)
      await expect(page.locator("#how-it-works")).toContainText(
        locale === "vi"
          ? "Theo dõi → Đặt vào bối cảnh → Kiểm tra → Khám phá"
          : "Track → Contextualize → Inspect → Explore"
      )
      await expect(page.locator('[data-landing-visual="context-figure"]')).toHaveAttribute(
        "aria-describedby",
        "landing-context-figure-description"
      )
      await expect(page.locator("#landing-context-figure-title")).toContainText(
        locale === "vi"
          ? "Hai góc nhìn về bối cảnh thị trường"
          : "Two views of market context"
      )
      await expect(page.locator("[data-figure-fallback]")).toContainText(
        locale === "vi"
          ? "Đồ thị Tri thức thị trường"
          : "Market Knowledge Graph"
      )
      await expect(page.locator("[data-figure-fallback]")).toContainText(
        locale === "vi" ? "Diễn biến giá" : "Price action"
      )
      await expect(page.locator("text=01 / 03")).toHaveCount(0)
      await expect(page.locator("#workspace-ai")).toContainText("AI Assistant")
      await expect(page.locator("#product")).not.toContainText("Market Query")
      await expect(page.locator("#product")).not.toContainText("82%")

      const dashboardLabel =
        locale === "vi"
          ? "Mở bảng điều khiển Signapse"
          : "Open the Signapse dashboard"
      const journeyLabel =
        locale === "vi"
          ? "Xem cách Signapse hỗ trợ phân tích thị trường"
          : "See how Signapse supports market analysis"
      await expect(
        page.getByRole("link", { name: dashboardLabel }).first()
      ).toHaveAttribute("href", `/${locale}/dashboard`)
      await expect(
        page.getByRole("link", { name: journeyLabel }).first()
      ).toHaveAttribute("href", "#how-it-works")
      await expect(page.getByText("request-access@signapse.ai")).toBeVisible()
      await expect(page.locator('a[href^="mailto:"]')).toHaveAttribute(
        "href",
        "mailto:request-access@signapse.ai?subject=Signapse%20access%20request"
      )
    })
  }

  test("switches locale while preserving query and supported hash", async ({ page }) => {
    await page.goto("/vi?source=hero#how-it-works")
    await page.getByRole("link", { name: "English", exact: true }).first().click()
    await expect(page).toHaveURL(/\/en\?source=hero#how-it-works$/)
    await expect(page.locator("html")).toHaveAttribute("lang", "en")
    await expect(page.getByRole("link", { name: "English", exact: true }).first()).toHaveAttribute(
      "aria-current",
      "page"
    )

    await page.goto("/en?source=footer#unsupported")
    await page.getByRole("link", { name: "Tiếng Việt", exact: true }).first().click()
    await expect(page).toHaveURL(/\/vi\?source=footer$/)
  })

  test("keeps the native mobile disclosure keyboard-operable", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    await page.goto("/vi")

    await expect(page.getByRole("link", { name: "Signapse", exact: true }).first()).toBeVisible()
    await expect(
      page.getByRole("link", { name: "Mở bảng điều khiển Signapse" }).first()
    ).toBeVisible()

    const summary = page.locator("[data-mobile-menu] summary")
    await summary.focus()
    await expect(summary).toBeFocused()
    await summary.press("Enter")
    await expect(page.locator("[data-mobile-menu]")).toHaveAttribute("open", "")
    await expect(page.getByRole("link", { name: "Sản phẩm", exact: true })).toBeVisible()
    await expect(page.getByRole("link", { name: "English", exact: true }).last()).toBeVisible()
    const box = await summary.boundingBox()
    expect(box?.width).toBeGreaterThanOrEqual(44)
    expect(box?.height).toBeGreaterThanOrEqual(44)
  })

  test("has no serious landing axe violations or page overflow at target widths", async ({ page }) => {
    for (const width of [375, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 })
      await page.goto("/en")
      await page.emulateMedia({ reducedMotion: "reduce", colorScheme: width % 2 ? "light" : "dark" })
      await expect
        .poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth))
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
        (violation) => violation.impact === "serious" || violation.impact === "critical"
      )
    ).toEqual([])
  })

  for (const locale of ["vi", "en"] as const) {
    test(`${locale} exposes the figure interaction contract without application semantics`, async ({ page }) => {
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
        await expect(page.locator("[data-figure-fallback]")).toBeHidden()
        await expect(
          page.getByRole("button", { name: /rotation|xoay/i })
        ).toBeVisible()
        await stage.focus()
        await stage.press("Enter")
        await expect(stage).toHaveAttribute("data-context-mode", "price")
        await stage.press("Enter")
        await expect(stage).toHaveAttribute("data-context-mode", "graph")
      } else {
        await expect(page.locator("[data-figure-fallback]")).toBeVisible()
        await expect(page.locator("[data-context-status]")).toContainText(
          locale === "vi" ? "Đang hiển thị hình tĩnh" : "Showing the static figure"
        )
      }
    })
  }

  for (const locale of ["vi", "en"] as const) {
    test(`${locale} renders preview metadata and localized social image references`, async ({ page }) => {
      await page.goto(`/${locale}`)

      await expect(page).toHaveTitle(
        locale === "vi"
          ? "Signapse | AI cho phân tích giao dịch"
          : "Signapse | AI-assisted market analysis"
      )
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
