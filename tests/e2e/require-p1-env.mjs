const required = [
  "P1_BASE_URL",
  "P1_CLERK_PUBLISHABLE_KEY",
  "P1_CLERK_SECRET_KEY",
  "P1_BACKEND_URL",
  "P1_TELEGRAM_CHAT_ID",
]

const missing = required.filter((name) => !process.env[name])
if (missing.length > 0) {
  console.error(
    [
      "P1 integration coverage is reserved for the authenticated canary and is not configured.",
      `Missing environment variables: ${missing.join(", ")}`,
      "No integration tests were run; this command fails closed by design.",
    ].join("\n")
  )
  process.exit(1)
}

console.error(
  "P1 environment is configured, but the authenticated canary is intentionally not implemented in the P0 foundation change."
)
process.exit(1)
