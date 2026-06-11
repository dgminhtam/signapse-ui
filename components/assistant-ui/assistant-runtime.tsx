"use client"

import {
  AssistantRuntimeProvider,
  type AppendMessage,
  useExternalStoreRuntime,
} from "@assistant-ui/react"

import { useLocalization } from "@/app/lib/i18n/provider"
import { AssistantModal } from "@/components/assistant-ui/assistant-modal"
import {
  convertMarketConversationMessage,
  type AssistantConversationMessageSnapshot,
} from "@/components/assistant-ui/market-conversation-runtime"
import { useMarketConversationAssistant } from "@/components/assistant-ui/use-market-conversation-assistant"

interface AssistantRuntimeProps {
  workspaceId: number | null
}

export function AssistantRuntime({ workspaceId }: AssistantRuntimeProps) {
  const { dictionary } = useLocalization()
  const controller = useMarketConversationAssistant(workspaceId)
  const runtime = useExternalStoreRuntime<AssistantConversationMessageSnapshot>({
    messages: controller.runtimeMessages,
    isLoading: controller.isMessagesLoading,
    isRunning: controller.isSubmitting,
    isSendDisabled: workspaceId == null || controller.isSubmitting,
    convertMessage: convertMarketConversationMessage,
    onNew: (message: AppendMessage) => controller.submitMessage(message),
    unstable_capabilities: { copy: false },
  })

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <AssistantModal labels={dictionary.aiAssistant} controller={controller} />
    </AssistantRuntimeProvider>
  )
}
