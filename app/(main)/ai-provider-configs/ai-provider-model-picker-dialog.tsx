"use client"

import { useId, useState } from "react"
import { Bot } from "lucide-react"

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
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
  FieldTitle,
} from "@/components/ui/field"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ScrollArea } from "@/components/ui/scroll-area"

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
  const modelChoiceId = useId()
  const [selectedModel, setSelectedModel] = useState(
    models.some((model) => model.id === currentModel) ? currentModel : ""
  )

  return (
    <DialogContent className="flex h-[min(80vh,720px)] flex-col overflow-hidden sm:max-w-[720px]">
      <DialogHeader>
        <DialogTitle>Chọn model</DialogTitle>
        <DialogDescription>
          Chọn một model từ danh sách đã xác thực thành công với nhà cung cấp
          AI.
        </DialogDescription>
      </DialogHeader>

      {models.length === 0 ? (
        <Empty className="min-h-[280px] border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Bot />
            </EmptyMedia>
            <EmptyTitle>Không có model khả dụng</EmptyTitle>
            <EmptyDescription>
              Xác thực đã thành công nhưng nhà cung cấp hiện không trả về model
              nào để chọn.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <ScrollArea className="min-h-0 flex-1">
          <RadioGroup
            value={selectedModel}
            onValueChange={setSelectedModel}
            className="pr-4"
            aria-label="Danh sách model AI"
          >
            {models.map((model, index) => {
              const optionId = `${modelChoiceId}-${index}`

              return (
                <FieldLabel key={model.id} htmlFor={optionId}>
                  <Field orientation="horizontal">
                    <FieldContent className="min-w-0">
                      <FieldTitle className="min-w-0 break-words">
                        {model.label || model.id}
                      </FieldTitle>
                      {model.label && model.label !== model.id ? (
                        <FieldDescription className="break-all">
                          {model.id}
                        </FieldDescription>
                      ) : null}
                    </FieldContent>
                    <RadioGroupItem value={model.id} id={optionId} />
                  </Field>
                </FieldLabel>
              )
            })}
          </RadioGroup>
        </ScrollArea>
      )}

      <DialogFooter>
        <Button
          type="button"
          onClick={() => onConfirm(selectedModel)}
          disabled={!selectedModel || models.length === 0}
        >
          Xác nhận
        </Button>
      </DialogFooter>
    </DialogContent>
  )
}
