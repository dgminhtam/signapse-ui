export function formatMessage(
  message: string,
  values: Record<string, string | number> = {}
): string {
  return Object.entries(values).reduce(
    (output, [key, value]) => output.replaceAll(`{${key}}`, String(value)),
    message
  )
}
