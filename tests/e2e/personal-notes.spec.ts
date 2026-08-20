import { expect, test } from "./fixtures"

test.describe("P0 Personal Notes lifecycle", () => {
  test("creates a draft and autosaves its first content", async ({
    page,
    fixture,
  }) => {
    await page.goto("/vi/dashboard")
    await page.getByRole("button", { name: "Ghi chú", exact: true }).click()
    await page.getByRole("button", { name: "Ghi chú mới", exact: true }).click()

    const editor = page.locator('[contenteditable="true"]')
    await editor.fill("A newly created fixture note.")
    await fixture.setScenario("/me/notes", "success", "POST")
    await page.getByRole("button", { name: "Lưu", exact: true }).click()

    await expect(page.getByRole("status")).toContainText("Đã lưu")
    await expect(
      page.getByText("Ghi chú chưa có tiêu đề", { exact: true })
    ).toBeVisible()
  })

  test("recovers the notes surface from a fixture-backed outage", async ({
    page,
    fixture,
  }) => {
    await page.goto("/vi/dashboard")
    await fixture.setScenario("/me/notes", "outage", "GET")
    await page.getByRole("button", { name: "Ghi chú", exact: true }).click()

    await expect(page.getByRole("alert")).toContainText("Không thể tải ghi chú")
    await fixture.setScenario("/me/notes", "success", "GET")
    await page.getByRole("button", { name: "Thử lại", exact: true }).click()
    await expect(page.getByText("Morning brief", { exact: true })).toBeVisible()
  })

  test("shows save failure, retry success, and destructive delete confirmation", async ({
    page,
    fixture,
  }) => {
    await page.goto("/vi/dashboard")
    await page.getByRole("button", { name: "Ghi chú", exact: true }).click()

    await expect(page.getByText("Morning brief", { exact: true })).toBeVisible()
    const editor = page.locator('[contenteditable="true"]')
    await expect(editor).toBeVisible()

    await fixture.setScenario("/me/notes/31", "mutation-failure", "PUT")
    await editor.fill("Fixture note changed before retry.")
    await page.getByRole("button", { name: "Lưu", exact: true }).click()
    await expect(
      page.getByRole("alert").filter({
        hasText: "Không thể lưu thay đổi mới nhất",
      })
    ).toBeVisible()

    await fixture.setScenario("/me/notes/31", "success", "PUT")
    await page.getByRole("button", { name: "Lưu", exact: true }).click()
    await expect(page.getByRole("status")).toContainText("Đã lưu")

    const actions = page.getByRole("button", {
      name: "Hành động cho Morning brief",
    })
    await actions.click()
    await page.getByRole("menuitem", { name: "Xóa", exact: true }).click()

    const deleteDialog = page.getByRole("alertdialog")
    await expect(deleteDialog).toContainText("Xóa ghi chú?")
    await deleteDialog.getByRole("button", { name: "Hủy", exact: true }).click()
    await expect(deleteDialog).toBeHidden()

    await fixture.setScenario("/me/notes/31", "success", "DELETE")
    await actions.click()
    await page.getByRole("menuitem", { name: "Xóa", exact: true }).click()
    await page
      .getByRole("alertdialog")
      .getByRole("button", { name: "Xóa", exact: true })
      .click()

    await expect(page.getByText("Morning brief", { exact: true })).toHaveCount(0)
  })
})
