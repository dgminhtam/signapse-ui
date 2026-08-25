import AxeBuilder from "@axe-core/playwright"

import { expect, test } from "./fixtures"

test.describe("P0 feedback UI-only workflow", () => {
  test.setTimeout(90_000)

  test("opens compose from the user menu, validates, previews a file, and recovers a dirty draft", async ({
    page,
  }) => {
    await page.goto("/vi/feedback")
    const userMenu = page.getByRole("button", { name: /Signapse Developer/i })
    await userMenu.click()
    await page
      .getByRole("menuitem", { name: "Gửi phản hồi", exact: true })
      .click()

    const dialog = page.getByRole("dialog").first()
    await expect(dialog).toBeVisible()
    await expect(page).toHaveURL(/\/vi\/feedback$/)
    const composeAxe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze()
    expect(
      composeAxe.violations.filter(
        (violation) =>
          violation.impact === "serious" || violation.impact === "critical"
      )
    ).toEqual([])

    await dialog
      .getByRole("button", { name: "Gửi phản hồi", exact: true })
      .click()
    await expect(dialog.getByText("Vui lòng nhập tiêu đề.")).toBeVisible()
    await expect(dialog.locator("#feedback-title")).toBeFocused()

    await dialog.locator("#feedback-title").fill("Giao diện ý tưởng mới")
    await dialog
      .locator("#feedback-description")
      .fill(
        "Mô tả đủ dài để kiểm tra trạng thái bản nháp trong biểu mẫu fixture."
      )
    await dialog
      .locator("#feedback-expected-outcome")
      .fill("Người dùng hiểu được bước tiếp theo.")

    await dialog.getByRole("combobox", { name: "Loại phản hồi" }).click()
    await page.getByRole("option", { name: "Ý tưởng", exact: true }).click()
    await expect(dialog.locator("#feedback-reproduction-steps")).toHaveCount(0)

    await dialog
      .getByRole("switch", { name: "Đính kèm thông tin kỹ thuật" })
      .click()
    await expect(dialog.getByText("Đính kèm thông tin kỹ thuật")).toBeVisible()
    await dialog.locator("#feedback-screenshot").setInputFiles({
      name: "context.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("fixture"),
    })
    await expect(dialog.getByText("Không thể xem trước tệp này")).toBeVisible()

    await dialog.getByRole("button", { name: "Đóng biểu mẫu phản hồi" }).click()
    const discardDialog = page
      .getByRole("dialog")
      .filter({ hasText: "Bỏ bản nháp này?" })
    await expect(discardDialog).toBeVisible()
    await discardDialog
      .getByRole("button", { name: "Tiếp tục chỉnh sửa" })
      .click()
    await expect(discardDialog).toBeHidden()
    await expect(dialog).toBeVisible()
    await dialog.getByRole("button", { name: "Đóng biểu mẫu phản hồi" }).click()
    await page
      .getByRole("dialog")
      .filter({ hasText: "Bỏ bản nháp này?" })
      .getByRole("button", { name: "Bỏ bản nháp" })
      .click()
    await expect(dialog).toBeHidden()
  })

  test("submits a fixture feedback and shows it first in personal history", async ({
    page,
    fixture,
  }) => {
    await page.goto("/vi/feedback")
    await page
      .getByRole("button", { name: "Gửi phản hồi", exact: true })
      .last()
      .click()
    const dialog = page.getByRole("dialog").first()
    await dialog.locator("#feedback-title").fill("Phản hồi mới đủ dài")
    await dialog
      .locator("#feedback-description")
      .fill("Nội dung phản hồi mới đủ dài để kiểm tra submit thành công.")
    await dialog
      .locator("#feedback-expected-outcome")
      .fill("Kết quả mới hiển thị trong danh sách.")
    await fixture.setFeedbackScenario("mutation-failure", "compose")
    await dialog
      .getByRole("button", { name: "Gửi phản hồi", exact: true })
      .click()
    await expect(
      page.getByText("Không thể gửi phản hồi. Bản nháp vẫn được giữ lại.")
    ).toBeVisible()
    await expect(dialog.locator("#feedback-title")).toHaveValue(
      "Phản hồi mới đủ dài"
    )
    await fixture.setFeedbackScenario("success", "compose")
    await dialog
      .getByRole("button", { name: "Gửi phản hồi", exact: true })
      .click()
    await expect(page.getByText("Đã gửi phản hồi.")).toBeVisible()
    await expect(
      page
        .getByRole("link", { name: "Phản hồi mới đủ dài", exact: true })
        .first()
    ).toBeVisible()
  })

  test("shows personal detail and capability-gated withdrawal", async ({
    page,
  }) => {
    await page.goto("/vi/feedback/feedback-001")
    await expect(page.locator("h1")).toContainText("Biểu đồ")
    await expect(
      page.getByRole("complementary").getByText("Chờ xem xét", { exact: true })
    ).toBeVisible()
    const detailAxe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze()
    expect(
      detailAxe.violations.filter(
        (violation) =>
          violation.impact === "serious" || violation.impact === "critical"
      )
    ).toEqual([])
    await page
      .getByRole("button", { name: "Rút phản hồi", exact: true })
      .click()
    const dialog = page.getByRole("alertdialog")
    await expect(dialog).toContainText("Rút phản hồi này?")
    await dialog.getByRole("button", { name: "Hủy", exact: true }).click()
    await expect(dialog).toBeHidden()
    await page
      .getByRole("button", { name: "Rút phản hồi", exact: true })
      .click()
    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: "Rút phản hồi", exact: true })
      .click()
    await expect(page).toHaveURL(/\/vi\/feedback$/)
    await expect(
      page.getByRole("link", {
        name: "Biểu đồ không giữ bộ lọc sau khi đổi ngôn ngữ",
        exact: true,
      })
    ).toHaveCount(0)
  })

  test("keeps moderation queue controls in the URL and supports review recovery", async ({
    page,
    fixture,
  }) => {
    await page.goto(
      "/vi/feedback-submissions?feedbackPermissions=feedback:read"
    )
    await expect(
      page.getByRole("heading", { name: "Phản hồi người dùng" })
    ).toBeVisible()
    await page.goto("/vi/feedback-submissions?feedbackPermissions=none")
    await expect(
      page.getByText("Bạn không có quyền xem phản hồi người dùng.")
    ).toBeVisible()
    await page.goto(
      "/vi/feedback-submissions/feedback-001?feedbackPermissions=none"
    )
    await expect(
      page.getByText("Bạn không có quyền xem phản hồi người dùng.")
    ).toBeVisible()

    await page.goto(
      "/vi/feedback-submissions?status=PENDING_REVIEW&sort=createdAt_desc&page=1&size=10"
    )
    await expect(page.locator("h1")).toHaveText("Phản hồi người dùng")
    await expect(
      page.getByRole("combobox", { name: "Trạng thái" })
    ).toBeVisible()
    const queueAxe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze()
    expect(
      queueAxe.violations.filter(
        (violation) =>
          violation.impact === "serious" || violation.impact === "critical"
      )
    ).toEqual([])
    await page
      .getByRole("textbox", { name: "Tìm trong tiêu đề phản hồi" })
      .fill("Biểu đồ")
    await page
      .getByRole("button", { name: "Tìm trong tiêu đề phản hồi", exact: true })
      .click()
    await expect(page).toHaveURL(/search=Bi%E1%BB%83u(?:%20|\+)%C4%91%E1%BB%93/)
    await expect(
      page.getByRole("link", { name: /Biểu đồ không giữ bộ lọc/ })
    ).toBeVisible()
    await page.getByRole("link", { name: /Biểu đồ không giữ bộ lọc/ }).click()
    await expect(page).toHaveURL(/feedback-submissions\/feedback-001.*search=/)
    await page.goBack()
    await expect(
      page.getByRole("textbox", { name: "Tìm trong tiêu đề phản hồi" })
    ).toHaveValue("Biểu đồ")

    await page.goto("/vi/feedback-submissions/feedback-006")
    await page
      .getByRole("button", { name: "Chuyển xử lý", exact: true })
      .click()
    const reviewDialog = page
      .getByRole("dialog")
      .filter({ hasText: "Chuyển xử lý phản hồi này?" })
    const reviewAxe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze()
    expect(
      reviewAxe.violations.filter(
        (violation) =>
          violation.impact === "serious" || violation.impact === "critical"
      )
    ).toEqual([])
    await reviewDialog
      .getByRole("button", { name: "Xác nhận xem xét", exact: true })
      .click()
    await expect(reviewDialog.locator("textarea")).toBeFocused()
    await expect(
      reviewDialog.getByText("Vui lòng nhập nội dung xem xét.")
    ).toBeVisible()

    await reviewDialog
      .locator("textarea")
      .fill("Đã chuyển xử lý để nhóm sản phẩm xem xét.")
    await fixture.setFeedbackScenario("mutation-failure", "promote")
    await reviewDialog
      .getByRole("button", { name: "Xác nhận xem xét", exact: true })
      .click()
    await expect(
      reviewDialog.getByText("Không thể lưu kết quả xem xét. Hãy thử lại.")
    ).toBeVisible()
    await fixture.setFeedbackScenario("success", "promote")
    await reviewDialog
      .getByRole("button", { name: "Xác nhận xem xét", exact: true })
      .click()
    await expect(
      page
        .getByRole("complementary")
        .getByText("Đã chuyển xử lý", { exact: true })
    ).toBeVisible()
  })

  test("supports destructive moderation recovery and accessibility states", async ({
    page,
    fixture,
  }) => {
    await page.goto("/vi/feedback-submissions/feedback-002")
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze()
    expect(
      results.violations.filter(
        (violation) =>
          violation.impact === "serious" || violation.impact === "critical"
      )
    ).toEqual([])

    await page
      .getByRole("button", { name: "Xóa phản hồi", exact: true })
      .click()
    const dialog = page.getByRole("alertdialog")
    await fixture.setFeedbackScenario("mutation-failure", "erase")
    await dialog
      .getByRole("button", { name: "Xóa phản hồi", exact: true })
      .click()
    await expect(
      dialog.getByText("Không thể xóa phản hồi. Hãy thử lại.")
    ).toBeVisible()
    await fixture.setFeedbackScenario("success", "erase")
    await dialog
      .getByRole("button", { name: "Xóa phản hồi", exact: true })
      .click()
    await expect(page).toHaveURL(/\/vi\/feedback-submissions$/)
  })

  test("keeps personal empty and error states accessible", async ({ page }) => {
    await page.goto("/vi/feedback?state=empty")
    await expect(page.getByText("Chưa có phản hồi")).toBeVisible()
    const emptyAxe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze()
    expect(
      emptyAxe.violations.filter(
        (violation) =>
          violation.impact === "serious" || violation.impact === "critical"
      )
    ).toEqual([])

    await page.goto("/vi/feedback?state=error")
    await expect(page.getByText("Không thể tải phản hồi của bạn")).toBeVisible()
    const errorAxe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .analyze()
    expect(
      errorAxe.violations.filter(
        (violation) =>
          violation.impact === "serious" || violation.impact === "critical"
      )
    ).toEqual([])
  })
})
