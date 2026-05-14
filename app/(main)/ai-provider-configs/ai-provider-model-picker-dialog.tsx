"use client"

import { useState } from "react"
import { Bot, Check } from "lucide-react"

import { AiProviderModelOptionResponse } from "@/app/lib/ai-provider-configs/definitions"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

interface AiProviderModelPickerDialogProps {
  currentModel: string
  models: AiProviderModelOptionResponse[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (modelId: string) => void
}

export function AiProviderModelPickerDialog({
  currentModel,
  models,
  open,
  onOpenChange,
  onConfirm,
}: AiProviderModelPickerDialogProps) {
  const contentKey = `${currentModel}:${models.map((model) => model.id).join("|")}`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <ModelPickerDialogContent
        key={contentKey}
        currentModel={currentModel}
        models={models}
        onConfirm={onConfirm}
      />
    </Dialog>
  )
}

function ModelPickerDialogContent({
  currentModel,
  models,
  onConfirm,
}: Omit<AiProviderModelPickerDialogProps, "open" | "onOpenChange">) {
  const [selectedModel, setSelectedModel] = useState(
    models.some((model) => model.id === currentModel) ? currentModel : ""
  )

  return (
    <DialogContent className="flex max-h-[min(80vh,720px)] flex-col sm:max-w-[720px]">
      <DialogHeader>
        <DialogTitle>Chọn model AI</DialogTitle>
        <DialogDescription>
          Chọn một model từ danh sách đã xác thực thành công với nhà cung cấp
          AI.
        </DialogDescription>
      </DialogHeader>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {models.length === 0 ? (
          <Empty className="min-h-[280px] border">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Bot />
              </EmptyMedia>
              <EmptyTitle>Không có model khả dụng</EmptyTitle>
              <EmptyDescription>
                Xác thực đã thành công nhưng nhà cung cấp hiện không trả về
                model nào để chọn.
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
                    <span className="font-medium break-words text-foreground">
                      {model.label || model.id}
                    </span>
                    {model.label && model.label !== model.id ? (
                      <span className="text-sm break-all text-muted-foreground">
                        {model.id}
                      </span>
                    ) : null}
                  </div>
                  {isSelected ? (
                    <Check className="shrink-0 text-primary" />
                  ) : null}
                </button>
              )
            })}
          </div>
        )}
      </div>

      <DialogFooter>
        <Button
          type="button"
          onClick={() => onConfirm(selectedModel)}
          disabled={!selectedModel || models.length === 0}
        >
          Xác nhận model
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
