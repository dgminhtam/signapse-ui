import { expect, test } from "./fixtures"

test("captures stable application chrome", async ({ page }) => {
  await page.goto("/vi/dashboard")
  await expect(page.locator("header").first()).toHaveScreenshot("dashboard-header.png")
})

test("captures the stable responsive header", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/vi/dashboard")
  await expect(page.locator("header").first()).toHaveScreenshot("dashboard-header-mobile.png")
})
