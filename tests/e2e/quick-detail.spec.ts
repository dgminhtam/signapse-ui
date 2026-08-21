import { expect, test } from "./fixtures"

test.describe("P0 quick-detail overlay", () => {
  test("keeps Dashboard mounted while one Event session crosses placement breakpoints", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1600, height: 900 })
    await page.goto("/vi/dashboard")

    const trigger = page.getByRole("button", {
      name: "Mở sự kiện: Central bank signals a slower easing path",
      exact: true,
    })
    await expect(trigger).toBeVisible()
    await trigger.click()

    const overlay = page.locator("[data-quick-detail-placement]")
    const dialog = page.getByRole("dialog")
    await expect(page.locator('[data-slot="drawer-popup"]')).toBeVisible()
    await expect(overlay).toHaveAttribute(
      "data-quick-detail-placement",
      "right"
    )
    await expect(overlay).toHaveAttribute("data-quick-detail-profile", "event")
    await expect(
      dialog.getByRole("heading", { name: /Kiểm tra sự kiện/ })
    ).toBeVisible()
    await expect(
      dialog.getByRole("button", { name: "Đóng", exact: true })
    ).toBeFocused()
    await expect(page).toHaveURL(/\/vi\/dashboard$/)

    await page.setViewportSize({ width: 1024, height: 900 })
    await expect(overlay).toHaveAttribute(
      "data-quick-detail-placement",
      "bottom"
    )
    await expect(dialog).toBeVisible()

    await page.setViewportSize({ width: 640, height: 900 })
    await expect(overlay).toHaveAttribute(
      "data-quick-detail-placement",
      "bottom"
    )
    await expect(dialog).toBeVisible()

    await dialog.getByRole("button", { name: "Đóng", exact: true }).click()
    await expect(overlay).toBeHidden()
    await expect(trigger).toBeFocused()
  })
})
