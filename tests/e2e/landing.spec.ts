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
      await expect(page.locator("#workspace-ai")).toContainText("AI Assistant")
      await expect(page.locator("#product")).not.toContainText("Market Query")
      await expect(page.locator("#product")).not.toContainText("82%")

      const dashboardLabel =
        locale === "vi"
          ? "Mở bảng điều khiển Signapse"
          : "Open the Signapse dashboard"
      const journeyLabel =
        locale === "vi"
          ? "Xem cách Signapse hỗ trợ phân tích"
          : "See how Signapse supports analysis"
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

    const summary = page.locator("[data-mobile-menu] summary")
    await summary.focus()
    await expect(summary).toBeFocused()
    await summary.press("Enter")
    await expect(page.locator("[data-mobile-menu]")).toHaveAttribute("open", "")
    await expect(page.getByRole("link", { name: "Sản phẩm", exact: true })).toBeVisible()
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

  test("renders preview metadata and localized social image references", async ({ page }) => {
    await page.goto("/vi")

    await expect(page).toHaveTitle("Signapse | Phân tích thị trường theo bối cảnh sự kiện")
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      "Signapse kết hợp dữ liệu giá với sự kiện, phản ứng, nguồn tin và quan hệ thị trường liên quan khi dữ liệu khả dụng."
    )
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      /noindex/
    )
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://dev.signapse.cloud/vi"
    )
    await expect(page.locator('link[rel="alternate"][hreflang="vi"]')).toHaveAttribute(
      "href",
      "https://dev.signapse.cloud/vi"
    )
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute(
      "href",
      "https://dev.signapse.cloud/en"
    )
    await expect(page.locator('link[rel="alternate"][hreflang="x-default"]')).toHaveAttribute(
      "href",
      /https:\/\/dev\.signapse\.cloud\/?$/
    )
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      "https://dev.signapse.cloud/vi/opengraph-image"
    )
  })
})
