import { appendFileSync, mkdirSync, createWriteStream } from "node:fs"
import { dirname, resolve } from "node:path"
import { spawn } from "node:child_process"

if (process.env.NODE_ENV === "production") {
  console.error("P0 browser server refuses NODE_ENV=production.")
  process.exit(1)
}

if (process.env.SIGNAPSE_AUTH_MODE !== "disabled" || process.env.SIGNAPSE_E2E_MODE !== "fixture") {
  console.error("P0 browser server requires SIGNAPSE_AUTH_MODE=disabled and SIGNAPSE_E2E_MODE=fixture.")
  process.exit(1)
}

const port = Number(process.env.P0_APP_PORT ?? 3100)
const logFile = process.env.APP_LOG_FILE
if (logFile) mkdirSync(dirname(logFile), { recursive: true })

const nextCli = resolve(process.cwd(), "node_modules/next/dist/bin/next")
const child = spawn(process.execPath, [nextCli, "dev", "--turbopack", "--port", String(port)], {
  env: {
    ...process.env,
    NODE_ENV: "development",
    SIGNAPSE_AUTH_MODE: "disabled",
    SIGNAPSE_E2E_MODE: "fixture",
  },
  stdio: ["ignore", "pipe", "pipe"],
})

const logStream = logFile ? createWriteStream(logFile, { flags: "a" }) : null

function forward(chunk, isError = false) {
  const value = chunk.toString()
  if (logStream) logStream.write(value)
  if (isError) process.stderr.write(value)
  else process.stdout.write(value)
}

child.stdout.on("data", (chunk) => forward(chunk))
child.stderr.on("data", (chunk) => forward(chunk, true))
child.on("error", (error) => {
  appendFileSync(logFile ?? "test-results/app.log", `${error.stack ?? error}\n`)
  process.exit(1)
})
child.on("exit", (code, signal) => {
  if (logStream) logStream.end()
  process.exit(code ?? (signal ? 1 : 0))
})

function shutdown() {
  child.kill()
}

process.on("SIGINT", shutdown)
process.on("SIGTERM", shutdown)
