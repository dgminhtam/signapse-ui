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
    expect(html).not.toContain("Product workspace preview")
    expect(html).not.toContain("Market Query")
    expect(html).not.toContain("82%")
    expect(html).not.toContain("evidence counts")
    expect(html).toContain('data-landing-visual="context-figure"')
    expect(html).toContain(
      locale === "vi" ? "Lớp bối cảnh Signapse" : "Signapse context layer"
    )
  })

  it("renders the three primary English product chapters", () => {
    const html = renderLanding("en")

    expect(html).toContain("Event-aware Charts")
    expect(html).toContain("Reaction &amp; Evidence")
    expect(html).toContain("Connected Market Graph")
    expect((html.match(/data-product-chapter/g) ?? []).length).toBe(3)
  })
})
