import { expect, test } from "./fixtures"

const ENGINE_ROUTES = {
  g6: "/vi/graph-view-g6-baseline",
  sigma: "/vi/graph-view-sigma-demo",
} as const

test.describe("Knowledge Graph engine trial", () => {
  test.describe.configure({ mode: "serial" })
  test.setTimeout(180_000)

  test("renders the Sigma fixture and switches edge density without backend graph data", async ({
    page,
    fixture,
  }) => {
    await page.goto(`${ENGINE_ROUTES.sigma}?edges=100`, {
      waitUntil: "domcontentloaded",
    })

    await expect(page.getByTestId("graph-view-sigma-demo")).toBeVisible({
      timeout: 90_000,
    })
    await expect(page.getByTestId("graph-demo-node-count")).toHaveText(
      "100 nút"
    )
    await expect(page.getByTestId("graph-demo-edge-count")).toHaveText(
      "100 cạnh"
    )
    const canvas = page.getByTestId("graph-demo-canvas")
    await expect(canvas.locator("canvas").first()).toBeVisible({
      timeout: 90_000,
    })
    await expect(page.getByTestId("graph-demo-layout-status")).toHaveText(
      /Bố cục sẵn sàng|Đang dùng bố cục đã lưu/,
      { timeout: 8_000 }
    )
    await page.waitForTimeout(350)
    await expect(canvas).toHaveAttribute("data-benchmark-anchor-id", "event:1")

    const canvasBox = await canvas.boundingBox()
    const anchorX = Number(await canvas.getAttribute("data-benchmark-anchor-x"))
    const anchorY = Number(await canvas.getAttribute("data-benchmark-anchor-y"))

    if (!canvasBox || !Number.isFinite(anchorX) || !Number.isFinite(anchorY)) {
      throw new Error("Missing Sigma benchmark anchor")
    }

    await page.mouse.click(canvasBox.x + anchorX, canvasBox.y + anchorY)
    await expect(page.getByTestId("graph-demo-inspector")).toBeVisible()
    await page.getByTestId("graph-demo-open-quick-detail").click()
    await expect(page.getByRole("dialog")).toContainText(
      "Sự kiện thị trường 01"
    )
    await page.getByRole("dialog").getByRole("button", { name: "Đóng" }).click()
    await page.getByTestId("graph-demo-close-inspector").click()

    await page.getByTestId("graph-demo-density-400").click()
    await expect(page.getByTestId("graph-demo-edge-count")).toHaveText(
      "400 cạnh"
    )
    await expect(page.getByTestId("graph-demo-density-400")).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    const state = await fixture.state()
    expect(
      state.requests.filter((request) => request.path === "/graph-view")
    ).toEqual([])
  })

  test("renders the same fixture through the G6 baseline route", async ({
    page,
    fixture,
  }) => {
    await page.goto(`${ENGINE_ROUTES.g6}?edges=400`, {
      waitUntil: "domcontentloaded",
    })

    await expect(page.locator("canvas").first()).toBeVisible({
      timeout: 90_000,
    })
    await expect(page.getByText("100 nút · 400 cạnh")).toBeVisible()

    const state = await fixture.state()
    expect(
      state.requests.filter((request) => request.path === "/graph-view")
    ).toEqual([])
  })

  test("reuses a generated Sigma layout after reload", async ({ page }) => {
    await page.goto(`${ENGINE_ROUTES.sigma}?edges=100`, {
      waitUntil: "domcontentloaded",
    })
    await expect(
      page.getByTestId("graph-demo-canvas").locator("canvas").first()
    ).toBeVisible({ timeout: 90_000 })

    await expect
      .poll(() => page.getByTestId("graph-demo-layout-status").textContent(), {
        timeout: 8_000,
      })
      .toMatch(/Bố cục sẵn sàng|Đang dùng bố cục đã lưu/)

    await page.close()
    const cachedPage = await page.context().newPage()
    await cachedPage.goto(`${ENGINE_ROUTES.sigma}?edges=100`, {
      waitUntil: "domcontentloaded",
    })
    await expect(
      cachedPage.getByTestId("graph-demo-canvas").locator("canvas").first()
    ).toBeVisible({ timeout: 90_000 })
    await expect
      .poll(
        () => cachedPage.getByTestId("graph-demo-layout-status").textContent(),
        {
          timeout: 3_000,
        }
      )
      .toBe("Đang dùng bố cục đã lưu")
  })

  test("keeps the demo behind the graph-view permission", async ({
    page,
    fixture,
  }) => {
    await fixture.setPermissions([])
    await page.goto(ENGINE_ROUTES.sigma, { waitUntil: "domcontentloaded" })

    await expect(
      page.getByText("Bạn không có quyền truy cập biểu đồ tri thức.")
    ).toBeVisible()
    await expect(page.getByTestId("graph-view-sigma-demo")).toHaveCount(0)
  })
})
