import { expect, test } from "./fixtures"

test.describe("P0 market chart workbench", () => {
  test("loads controls, changes timeframe, and recovers the live SSE stream", async ({
    page,
    fixture,
  }) => {
    await fixture.setScenario("/market-charts/live", "reconnect", "GET")
    await page.goto("/vi/market-charts?assetId=101&timeframe=1h")

    await expect(page.locator("#market-chart-asset")).toBeVisible()
    await expect(page.getByRole("button", { name: "1 giờ" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    await expect(
      page.getByRole("button", { name: "Mở biểu đồ toàn màn hình" })
    ).toBeVisible()
    await expect(
      page.getByText(/Giá trực tiếp|Đang kết nối lại/, { exact: false }).first()
    ).toBeVisible()
    await expect(page.getByText("Giá trực tiếp", { exact: true })).toBeVisible()

    await expect
      .poll(async () => (await fixture.state()).streamConnections, {
        timeout: 10_000,
      })
      .toBeGreaterThanOrEqual(2)
    const initialStreamConnections = (await fixture.state()).streamConnections

    const fourHourButton = page.getByRole("button", { name: "4 giờ" })
    await expect(fourHourButton).toBeEnabled()
    await fourHourButton.click()
    await expect(page).toHaveURL(/timeframe=4h/, { timeout: 15_000 })
    await expect(page.locator("#market-chart-asset")).toBeVisible()

    await expect
      .poll(async () => (await fixture.state()).streamConnections, {
        timeout: 15_000,
      })
      .toBeGreaterThan(initialStreamConnections)
    await expect(page.getByText("Giá trực tiếp", { exact: true })).toBeVisible()
  })
})
