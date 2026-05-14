import {
  AI_PROVIDER_TYPES,
  AiProviderType,
} from "@/app/lib/ai-provider-configs/definitions"

export const providerOptions: { value: AiProviderType; label: string }[] = [
  { value: "GEMINI", label: "Gemini" },
  { value: "GROQ", label: "Groq" },
  { value: "OPENAI", label: "OpenAI" },
  { value: "ZAI", label: "ZAI" },
]

export function getProviderOptionLabel(providerType?: AiProviderType) {
  return (
    providerOptions.find((provider) => provider.value === providerType)?.label ??
    providerType ??
    "Nhà cung cấp AI"
  )
}

export { AI_PROVIDER_TYPES }
