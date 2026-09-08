import { createHash } from "node:crypto"
import { access, mkdir, readFile } from "node:fs/promises"
import { createRequire } from "node:module"
import path from "node:path"
import { fileURLToPath } from "node:url"

const require = createRequire(import.meta.url)
const sharp = createRequire(require.resolve("next/package.json"))("sharp")
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..")
const sourceRoot = path.join(root, "docs/design/landing-capture-review/source")
const jobs = [
  ["1.png", "vi", "knowledge-graph", { left: 345, top: 195, width: 1550, height: 720 }],
  ["1-en.png", "en", "knowledge-graph", { left: 345, top: 195, width: 1550, height: 720 }],
  ["2.png", "vi", "live-market-chart", { left: 345, top: 195, width: 1550, height: 742 }],
  ["2-en.png", "en", "live-market-chart", { left: 345, top: 195, width: 1550, height: 742 }],
]

for (const [name, locale, feature, rectangle] of jobs) {
  const source = path.join(sourceRoot, name)
  const folder = path.join(root, "docs/design/landing-capture-review", locale)
  const output = path.join(folder, feature)
  const original = await readFile(source)
  for (const extension of ["png", "webp"]) {
    await access(`${output}.${extension}`).then(
      () => { throw new Error(`Output already exists: ${output}.${extension}`) },
      (error) => { if (error.code !== "ENOENT") throw error },
    )
  }
  await mkdir(folder, { recursive: true })
  await sharp(original).extract(rectangle).png().toFile(`${output}.png`)
  await sharp(original).extract(rectangle).webp({ lossless: true }).toFile(`${output}.webp`)
  const expected = await sharp(original).extract(rectangle).ensureAlpha().raw().toBuffer()
  for (const extension of ["png", "webp"]) {
    const actual = await sharp(`${output}.${extension}`).ensureAlpha().raw().toBuffer()
    if (!expected.equals(actual)) throw new Error(`Pixels changed: ${output}.${extension}`)
  }
  if (!original.equals(await readFile(source))) throw new Error(`Source changed: ${source}`)
  console.log(JSON.stringify({ source: name, locale, feature, rectangle, pixelExact: true,
    sourceSha256: createHash("sha256").update(original).digest("hex"),
    png: `${output}.png`, webp: `${output}.webp`,
    webpBytes: (await readFile(`${output}.webp`)).length }))
}
