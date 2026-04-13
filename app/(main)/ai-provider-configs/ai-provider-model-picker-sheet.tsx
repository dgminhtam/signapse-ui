"use client"

import { useEffect, useState } from "react"
import { Bot, Check } from "lucide-react"

import { AiProviderModelOptionResponse } from "@/app/lib/ai-provider-configs/definitions"
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
  const [selectedModel, setSelectedModel] = useState(currentModel)

  useEffect(() => {
    if (!open) return
    setSelectedModel(models.some((model) => model.id === currentModel) ? currentModel : "")
  }, [currentModel, models, open])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Chọn model AI</SheetTitle>
          <SheetDescription>
            Chọn một model từ danh sách đã xác thực thành công với nhà cung cấp AI.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-4">
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
                      <span className="font-medium text-foreground">{model.label || model.id}</span>
                      <span className="truncate text-sm text-muted-foreground">{model.id}</span>
                    </div>
                    {isSelected ? <Check className="text-primary" /> : null}
                  </button>
                )
              })}
            </div>
          )}
        </div>

        <SheetFooter className="border-t">
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
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
