import AxeBuilder from "@axe-core/playwright"

import { expect, test } from "./fixtures"

test("P0 critical dashboard state has no serious or critical axe violations", async ({ page }) => {
  await page.goto("/vi/dashboard")
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze()

  const blockingViolations = results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical"
  )
  expect(blockingViolations).toEqual([])
})

test("P0 user menu restores focus after keyboard close", async ({ page }) => {
  await page.goto("/vi/dashboard")
  const trigger = page.getByRole("button", { name: /Signapse Developer/i })
  await trigger.focus()
  await trigger.press("Enter")
  await expect(page.getByRole("menu")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(trigger).toBeFocused()
})

test("P0 Telegram state has no serious or critical axe violations", async ({ page }) => {
  await page.goto("/vi/telegram")
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze()

  const blockingViolations = results.violations.filter(
    (violation) => violation.impact === "serious" || violation.impact === "critical"
  )
  expect(blockingViolations).toEqual([])
})

test("P0 notes sheet restores focus after keyboard close", async ({ page }) => {
  await page.goto("/vi/dashboard")
  const trigger = page.getByRole("button", { name: "Ghi chú", exact: true })
  await trigger.focus()
  await trigger.press("Enter")
  await expect(page.getByRole("dialog")).toBeVisible()
  await page.keyboard.press("Escape")
  await expect(trigger).toBeFocused()
})
