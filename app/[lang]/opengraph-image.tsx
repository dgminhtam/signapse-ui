import { readFile } from "node:fs/promises"
import { join } from "node:path"

import { ImageResponse } from "next/og"

import { getDictionary, hasLocale } from "@/app/lib/i18n/dictionaries"

export const runtime = "nodejs"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"
export const alt = "Signapse"

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ lang: string }>
}) {
  const { lang } = await params
  const locale = hasLocale(lang) ? lang : "vi"
  const [dictionary, logo] = await Promise.all([
    getDictionary(locale),
    readFile(join(process.cwd(), "public/images/signapse_logo_dark.svg")),
  ])
  const logoData = `data:image/svg+xml;base64,${logo.toString("base64")}`

  return new ImageResponse(
    (
      <div
        style={{
          alignItems: "stretch",
          background: "#101114",
          color: "#f7f7f8",
          display: "flex",
          flexDirection: "column",
          fontFamily: "Geist",
          height: "100%",
          justifyContent: "space-between",
          padding: "72px 80px",
          width: "100%",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: "24px" }}>
          <img src={logoData} width="88" height="88" alt="" />
          <span style={{ fontSize: 34, fontWeight: 600 }}>
            {dictionary.common.appName}
          </span>
        </div>
        <div
          style={{
            borderLeft: "4px solid #f7f7f8",
            display: "flex",
            fontSize: 58,
            fontWeight: 600,
            lineHeight: 1.12,
            maxWidth: "1000px",
            paddingLeft: "32px",
          }}
        >
          {dictionary.landing.metadata.title}
        </div>
      </div>
    ),
    size
  )
}
