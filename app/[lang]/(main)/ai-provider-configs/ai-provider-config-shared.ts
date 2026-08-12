import {
  AI_PROVIDER_TYPES,
  AiProviderType,
} from "@/app/lib/ai-provider-configs/definitions"
import type { Dictionary } from "@/app/lib/i18n/dictionary-types"

export const providerOptions: { value: AiProviderType; label: string }[] = [
  { value: "DEEPSEEK", label: "DeepSeek" },
  { value: "GEMINI", label: "Gemini" },
  { value: "GROQ", label: "Groq" },
  { value: "OPENAI", label: "OpenAI" },
  { value: "ZAI", label: "ZAI" },
]

export function getProviderOptionLabel(
  providerType?: AiProviderType,
  dictionary?: Dictionary
) {
  return (
    providerOptions.find((provider) => provider.value === providerType)
      ?.label ??
    providerType ??
    dictionary?.aiProviderConfigs.unknownProvider ??
    "AI provider"
  )
}

export { AI_PROVIDER_TYPES }
