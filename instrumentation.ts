export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return
  }

  const { registerServerTelemetry } =
    await import("@/app/lib/observability/instrumentation")
  registerServerTelemetry()
}
