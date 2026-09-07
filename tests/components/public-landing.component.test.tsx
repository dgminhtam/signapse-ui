import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it, vi } from "vitest"

vi.mock("@/app/[lang]/landing-locale-links", () => ({
  LandingLocaleLinks: ({
    labels,
  }: {
    labels: { vi: string; en: string }
  }) => (
    <nav data-locale-links>
      {labels.vi} / {labels.en}
    </nav>
  ),
}))

import { LandingPage } from "@/app/[lang]/landing-page"
import { en as enDictionary } from "@/app/lib/i18n/dictionaries/en"
import { vi as viDictionary } from "@/app/lib/i18n/dictionaries/vi"

function renderLanding(locale: "vi" | "en") {
  return renderToStaticMarkup(
    <LandingPage
      dictionary={locale === "vi" ? viDictionary : enDictionary}
      locale={locale}
      isAuthenticated
    />
  )
}

describe("localized landing composition", () => {
  it.each([
    ["vi", "Hiểu thị trường qua Đồ thị Tri thức và AI."],
    ["en", "Understand markets through the Knowledge Graph and AI."],
  ] as const)("renders the four-feature %s story", (locale, heading) => {
    const html = renderLanding(locale)
    const sectionOrder = [
      "hero-product-proof",
      "product-story",
      "analysis-flow",
      "trust-boundary",
      "final-access-cta",
    ]
    const positions = sectionOrder.map((section) =>
      html.indexOf(`data-landing-section=\"${section}\"`)
    )

    expect(positions.every((position) => position >= 0)).toBe(true)
    expect(positions).toEqual([...positions].sort((a, b) => a - b))
    expect((html.match(/<h1/g) ?? []).length).toBe(1)
    expect(html).toContain(heading)
    expect(html).toContain("MARKET INTELLIGENCE PLATFORM")
    expect(html).toContain('href="#product"')

    for (const anchor of [
      "knowledge-graph",
      "live-charts",
      "ai-assistant",
      "telegram",
    ]) {
      expect(html).toContain(`href="#${anchor}"`)
      expect(html).toContain(`data-landing-media-slot="${anchor}"`)
    }

    expect((html.match(/data-product-chapter/g) ?? []).length).toBe(4)
    expect((html.match(/data-landing-media-slot/g) ?? []).length).toBe(4)
    expect(html).toContain(
      locale === "vi"
        ? "Chọn tài sản, xem diễn biến giá"
        : "Choose an asset, review price action"
    )
    expect(html).toContain(
      locale === "vi"
        ? "Mở chi tiết sự kiện để đọc phản ứng thị trường và đối chiếu với các nguồn tin."
        : "Open event details to read market reactions and cross-check them against news sources."
    )
    expect(html).toContain(
      locale === "vi"
        ? "Trợ lý AI hỗ trợ bạn phân tích quan hệ giữa sự kiện, tài sản và tin tức để tìm hiểu thêm những thông tin liên quan."
        : "The AI Assistant helps you analyze relationships between events, assets, and news to explore related information."
    )
    expect(html).not.toContain("workspace-ai")
    expect(html).not.toContain("Reaction &amp; Evidence")
    expect(html).not.toContain("Track → Contextualize → Inspect → Explore")
    expect(html).not.toContain("Biến dữ liệu thị trường thành Đồ thị Tri thức.")
    expect(html).not.toContain("Specialized AI Assistant")
    expect(html).not.toContain("Market Query")
    expect(html).not.toContain(locale === "vi" ? "kênh công khai" : "public channel")
    expect(html).not.toContain(locale === "vi" ? "độc quyền" : "exclusive")
    expect(html).toContain('data-landing-visual="context-figure"')
    expect(html).toContain('<figcaption class="sr-only">')
  })
})
