"use client"

import { useState } from "react"
import { Bot, Check } from "lucide-react"

import { AiProviderModelOptionResponse } from "@/app/lib/ai-provider-configs/definitions"
import { useLocalization } from "@/app/lib/i18n/provider"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

interface AiProviderModelPickerSheetProps {
  currentModel: string
  models: AiProviderModelOptionResponse[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (modelId: string) => void
}

export function AiProviderModelPickerSheet({
  currentModel,
  models,
  open,
  onOpenChange,
  onConfirm,
}: AiProviderModelPickerSheetProps) {
  const contentKey = `${currentModel}:${models.map((model) => model.id).join("|")}`

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <ModelPickerSheetContent
        key={contentKey}
        currentModel={currentModel}
        models={models}
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
      />
    </Sheet>
  )
}

function ModelPickerSheetContent({
  currentModel,
  models,
  onOpenChange,
  onConfirm,
}: Omit<AiProviderModelPickerSheetProps, "open">) {
  const [selectedModel, setSelectedModel] = useState(
    models.some((model) => model.id === currentModel) ? currentModel : ""
  )
  const { dictionary } = useLocalization()
  const t = dictionary.aiProviderConfigs

  return (
    <SheetContent side="right" className="w-full sm:max-w-xl">
      <SheetHeader>
        <SheetTitle>{t.modelPickerSheetTitle}</SheetTitle>
        <SheetDescription>{t.modelPickerDescription}</SheetDescription>
      </SheetHeader>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
        {models.length === 0 ? (
          <Empty className="min-h-[280px] border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Bot />
              </EmptyMedia>
              <EmptyTitle>{t.modelPickerEmptyTitle}</EmptyTitle>
              <EmptyDescription>
                {t.modelPickerEmptyDescription}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col gap-3">
            {models.map((model) => {
              const isSelected = selectedModel === model.id

              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => setSelectedModel(model.id)}
                  className="flex w-full items-start justify-between gap-4 rounded-lg border px-4 py-3 text-left transition-colors hover:border-primary/60 hover:bg-muted/40"
                  aria-pressed={isSelected}
                >
                  <div className="flex min-w-0 flex-col gap-1">
                    <span className="font-medium text-foreground">
                      {model.label || model.id}
                    </span>
                    <span className="truncate text-sm text-muted-foreground">
                      {model.id}
                    </span>
                  </div>
                  {isSelected ? <Check className="text-primary" /> : null}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <SheetFooter>
        <Button
          type="button"
          variant="ghost"
          onClick={() => onOpenChange(false)}
        >
          {dictionary.common.close}
        </Button>
        <Button
          type="button"
          onClick={() => onConfirm(selectedModel)}
          disabled={!selectedModel || models.length === 0}
        >
          {t.confirmModel}
        </Button>
      </SheetFooter>
    </SheetContent>
  )
}
