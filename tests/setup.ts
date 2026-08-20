import "@testing-library/jest-dom/vitest"

import { afterAll, afterEach, beforeAll } from "vitest"

import { server } from "./support/msw"

process.env.TZ = "UTC"

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" })
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
