"use client"

import { useEffect, useState } from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import { Bot, Check, XIcon } from "lucide-react"

import { AiProviderModelOptionResponse } from "@/app/lib/ai-provider-configs/definitions"
import { Button } from "@/components/ui/button"
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
  const [selectedModel, setSelectedModel] = useState(currentModel)

  useEffect(() => {
    if (!open) return
    setSelectedModel(models.some((model) => model.id === currentModel) ? currentModel : "")
  }, [currentModel, models, open])

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/10 backdrop-blur-xs data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 flex w-[min(720px,calc(100vw-2rem))] max-h-[min(80vh,720px)] -translate-x-1/2 -translate-y-1/2 flex-col gap-4 rounded-xl border bg-popover text-popover-foreground shadow-lg data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
          <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
            <div className="flex flex-col gap-1">
              <DialogPrimitive.Title className="font-heading text-lg font-medium text-foreground">
                Chọn model AI
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-sm text-muted-foreground">
                Chọn một model từ danh sách đã xác thực thành công với nhà cung cấp AI.
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close asChild>
              <Button type="button" variant="ghost" size="icon-sm">
                <XIcon />
                <span className="sr-only">Đóng</span>
              </Button>
            </DialogPrimitive.Close>
          </div>

          <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 pb-2">
            {models.length === 0 ? (
              <Empty className="min-h-[280px] rounded-lg border border-dashed">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Bot />
                  </EmptyMedia>
                  <EmptyTitle>Không có model khả dụng</EmptyTitle>
                  <EmptyDescription>
                    Xác thực đã thành công nhưng nhà cung cấp hiện không trả về model nào để chọn.
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
                        <span className="break-words font-medium text-foreground">
                          {model.label || model.id}
                        </span>
                        {model.label && model.label !== model.id ? (
                          <span className="break-all text-sm text-muted-foreground">
                            {model.id}
                          </span>
                        ) : null}
                      </div>
                      {isSelected ? <Check className="shrink-0 text-primary" /> : null}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 border-t px-6 py-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
            <Button
              type="button"
              onClick={() => onConfirm(selectedModel)}
              disabled={!selectedModel || models.length === 0}
            >
              Xác nhận model
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
