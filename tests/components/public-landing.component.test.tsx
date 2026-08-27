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
import { vi as viDictionary } from "@/app/lib/i18n/dictionaries/vi"
import { en as enDictionary } from "@/app/lib/i18n/dictionaries/en"

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
    ["vi", "Theo dõi → Đặt vào bối cảnh → Kiểm tra → Khám phá"],
    ["en", "Track → Contextualize → Inspect → Explore"],
  ] as const)("renders the canonical %s story", (locale, sequence) => {
    const html = renderLanding(locale)
    const sectionOrder = [
      "hero-product-proof",
      "analysis-flow",
      "product-story",
      "workspace-assistant",
      "trust-boundary",
      "final-access-cta",
    ]
    const positions = sectionOrder.map((section) =>
      html.indexOf(`data-landing-section=\"${section}\"`)
    )

    expect(positions.every((position) => position >= 0)).toBe(true)
    expect(positions).toEqual([...positions].sort((a, b) => a - b))
    expect((html.match(/<h1/g) ?? []).length).toBe(1)
    expect(html).toContain(sequence)
    expect(html).toContain("AI Assistant")
    expect(html).toContain(
      locale === "vi"
        ? "Biến dữ liệu thị trường thành bối cảnh giao dịch có thể kiểm chứng."
        : "Turn market data into trading context you can verify."
    )
    expect(html).toContain(
      locale === "vi" ? "Trợ lý AI chuyên biệt" : "Specialized AI Assistant"
    )
    expect(html).toContain(
      locale === "vi"
        ? "Vận hành trên Đồ thị Tri thức, được xây dựng từ dữ liệu thị trường đa nguồn đã qua tổng hợp, đánh giá và phân tích."
        : "Powered by a Knowledge Graph built from multi-source market data—aggregated, evaluated, and analyzed."
    )
    expect(html).toContain(
      locale === "vi"
        ? "Đọc bối cảnh, không chỉ nhìn nến"
        : "Read the context, not just the candles"
    )
    expect(html).toContain(
      locale === "vi"
        ? "Đọc diễn biến giá trên chart cùng phản ứng thị trường, sự kiện và lịch kinh tế liên quan."
        : "Read price action alongside market reactions, related events, and economic-calendar context."
    )
    expect((html.match(/<dt\b/g) ?? []).length).toBe(2)
    expect(html).not.toContain(
      locale === "vi" ? "Kiểm tra mối liên hệ" : "Inspect relationships"
    )
    expect(html).not.toContain("Product workspace preview")
    expect(html).not.toContain("Market Query")
    expect(html).not.toContain("82%")
    expect(html).not.toContain("evidence counts")
    expect(html).toContain('data-landing-visual="context-figure"')
    expect(html).toContain('<figcaption class="sr-only">')
    expect(html).not.toContain(
      locale === "vi" ? "Bối cảnh có thể kiểm tra" : "Context you can verify"
    )
    expect(html).not.toContain(
      locale === "vi"
        ? "Từ dữ liệu đến bối cảnh giao dịch"
        : "From data to trading context"
    )
    expect(html).toContain(
      locale === "vi"
        ? "Hai góc nhìn về bối cảnh thị trường"
        : "Two views of market context"
    )
    expect(html).not.toContain(
      locale === "vi"
        ? "Đồ thị Tri thức thị trường kết nối các quan hệ hiện có"
        : "The Market Knowledge Graph connects existing relationships"
    )
    expect(html).not.toContain(
      locale === "vi"
        ? "Di chuột để xem diễn biến giá · Nhấp để ghim"
        : "Hover to preview price action · Click to pin"
    )
    expect(html).not.toContain(">Pause rotation<")
    expect(html).not.toContain(">Tạm dừng xoay<")
    expect(html).not.toContain("01 / 03")
    expect(html).not.toContain("graph generates")
  })

  it("renders the three primary English product chapters", () => {
    const html = renderLanding("en")

    expect(html).toContain("Event-aware Charts")
    expect(html).toContain("Reaction &amp; Evidence")
    expect(html).toContain("Connected Market Graph")
    expect((html.match(/data-product-chapter/g) ?? []).length).toBe(3)
  })
})
