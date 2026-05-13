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

export { AI_PROVIDER_TYPES }
