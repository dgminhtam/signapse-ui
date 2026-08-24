import { readFileSync } from "node:fs"
import { describe, expect, it } from "vitest"

describe("localized landing social artwork", () => {
  it("uses deterministic 1200 by 630 brand-card dimensions", () => {
    const source = readFileSync(
      "app/[lang]/opengraph-image.tsx",
      "utf8"
    )

    expect(source).toContain("export const size = { width: 1200, height: 630 }")
    expect(source).toContain('export const contentType = "image/png"')
  })

  it("contains no product proof or additional claim in the card renderer", () => {
    const source = readFileSync(
      "app/[lang]/opengraph-image.tsx",
      "utf8"
    )

    expect(source).not.toMatch(/Market Query|Product workspace|82%|evidence count|Theme node/i)
    expect(source).not.toContain("dictionary.landing.hero.body")
    expect(source).toContain("dictionary.landing.metadata.title")
  })
})
