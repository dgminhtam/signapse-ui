import { expect, test } from "./fixtures"

test.describe("P0 Telegram operations", () => {
  test("covers destination delivery states and destructive confirmation", async ({
    page,
    fixture,
  }) => {
    await page.goto("/vi/telegram")

    await expect(page.getByRole("heading", { name: "Hạ tầng Telegram" })).toBeVisible()
    await expect(page.getByText("Fixture operations bot", { exact: true })).toBeVisible()
    await expect(
      page.getByRole("cell", { name: "Operations channel", exact: true })
    ).toBeVisible()
    await expect(
      page.getByRole("listitem").filter({ hasText: "Disabled channel" }).first()
    ).toBeVisible()
    await expect(
      page.locator('button[aria-disabled="true"]').filter({ hasText: "Gửi thử" })
    ).toHaveCount(1)

    const activeTestMessage = page.getByRole("button", {
      name: "Gửi thử",
      exact: true,
    }).first()

    await fixture.setScenario(
      "/telegram/destinations/21/test-message",
      "mutation-failure",
      "POST"
    )
    await activeTestMessage.click()
    await expect(
      page.getByText("Fixture mutation failed; retry is safe", { exact: true })
    ).toBeVisible()

    await fixture.setScenario(
      "/telegram/destinations/21/test-message",
      "timeout",
      "POST"
    )
    await activeTestMessage.click()
    await expect(
      page.getByText(
        "Yêu cầu gửi đã hết thời gian chờ và kết quả chưa rõ; hãy kiểm tra Telegram trước khi thử lại.",
        { exact: true }
      )
    ).toBeVisible()

    await fixture.setScenario(
      "/telegram/destinations/21/test-message",
      "success",
      "POST"
    )
    await activeTestMessage.click()
    await expect(
      page.getByText("Đã gửi tin nhắn thử tới Operations channel.", { exact: true })
    ).toBeVisible()

    await page
      .getByRole("button", { name: "Thao tác điểm nhận", exact: true })
      .first()
      .click()
    await page.getByRole("menuitem", { name: "Xóa điểm nhận", exact: true }).click()

    const deleteDialog = page.getByRole("alertdialog")
    await expect(deleteDialog).toContainText("Xóa điểm nhận Telegram?")
    await deleteDialog.getByRole("button", { name: "Hủy", exact: true }).click()
    await expect(deleteDialog).toBeHidden()

    await expect(page.getByText("Định tuyến tính năng", { exact: true })).toBeVisible()
    await expect(page.getByText("Lịch gửi phân tích", { exact: true })).toBeVisible()
    await expect(page.getByText("BTC morning analysis", { exact: true })).toBeVisible()
  })
})
