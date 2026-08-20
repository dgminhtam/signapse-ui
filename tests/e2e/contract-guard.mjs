import { readFile } from "node:fs/promises"
import { resolve } from "node:path"
import { fixtureContracts } from "./fixtures/contract-registry.mjs"

const mappingDocument = await readFile(
  resolve(process.cwd(), "docs/APIMAPPING.md"),
  "utf8"
)
const errors = []
const documentedPaths = [...mappingDocument.matchAll(/`(\/[^`]+)`/g)].map(
  (match) => match[1]
)
const normalizePath = (path) => path.replace(/\{[^}]+\}/g, "{param}")

for (const contract of fixtureContracts) {
  if (!/^(GET|POST|PUT|PATCH|DELETE)$/.test(contract.method)) {
    errors.push(`${contract.mapping}: unsupported method ${contract.method}`)
  }

  if (!contract.path.startsWith("/")) {
    errors.push(`${contract.mapping}: path must start with /`)
  }

  if (!Number.isInteger(contract.status)) {
    errors.push(`${contract.mapping}: response status is missing`)
  }

  if (
    !documentedPaths.some(
      (path) => normalizePath(path) === normalizePath(contract.path)
    )
  ) {
    errors.push(
      `${contract.mapping}: ${contract.method} ${contract.path} is not present in docs/APIMAPPING.md`
    )
  }
}

const duplicateKeys = new Set()
for (const contract of fixtureContracts) {
  const key = `${contract.method} ${contract.path}`
  if (duplicateKeys.has(key)) {
    errors.push(`duplicate fixture contract: ${key}`)
  }
  duplicateKeys.add(key)
}

if (errors.length > 0) {
  console.error(`Fixture contract guard failed with ${errors.length} issue(s):`)
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(`Fixture contract guard passed for ${fixtureContracts.length} routes.`)
