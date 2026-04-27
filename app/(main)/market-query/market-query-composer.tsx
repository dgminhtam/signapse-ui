import { type FormEvent } from "react"
import { ChevronRight, SearchCheck, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Spinner } from "@/components/ui/spinner"
import { Textarea } from "@/components/ui/textarea"

import { EXAMPLE_PROMPTS } from "./market-query-format"
import { SectionHeading } from "./market-query-section"

interface MarketQueryComposerProps {
  question: string
  questionId: string
  questionError: string | null
  isPending: boolean
  showExamples: boolean
  onQuestionChange: (value: string) => void
  onExampleClick: (prompt: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function MarketQueryComposer({
  question,
  questionId,
  questionError,
  isPending,
  showExamples,
  onQuestionChange,
  onExampleClick,
  onSubmit,
}: MarketQueryComposerProps) {
  return (
    <section className="rounded-2xl border border-border bg-muted/15 p-5">
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <SectionHeading
          icon={SearchCheck}
          title="Câu hỏi phân tích"
          description="Tập trung vào một câu hỏi cụ thể để nhận kết luận, độ tin cậy và bằng chứng liên quan."
        />

        <FieldGroup>
          <Field data-invalid={!!questionError}>
            <FieldLabel htmlFor={questionId}>Nội dung truy vấn</FieldLabel>
            <Textarea
              id={questionId}
              value={question}
              onChange={(event) => onQuestionChange(event.target.value)}
              placeholder="Ví dụ: Những sự kiện nào đang hỗ trợ xu hướng tăng của vàng trong 7 ngày gần đây?"
              className="min-h-[150px] resize-y bg-background"
              aria-invalid={questionError ? true : undefined}
              disabled={isPending}
            />
            <FieldDescription>
              Câu hỏi càng cụ thể, hệ thống càng dễ trả về kết luận và bằng chứng bám sát ngữ cảnh.
            </FieldDescription>
            <FieldError>{questionError}</FieldError>
          </Field>

          {showExamples ? (
            <Field>
              <FieldLabel>Gợi ý bắt đầu</FieldLabel>
              <div className="grid gap-2 lg:grid-cols-3">
                {EXAMPLE_PROMPTS.map((prompt) => (
                  <Button
                    key={prompt}
                    type="button"
                    variant="outline"
                    className="h-auto justify-start py-3 text-left whitespace-normal"
                    disabled={isPending}
                    onClick={() => onExampleClick(prompt)}
                  >
                    <ChevronRight data-icon="inline-start" />
                    {prompt}
                  </Button>
                ))}
              </div>
              <FieldDescription>
                Chọn một mẫu rồi chỉnh lại theo tài sản, giai đoạn hoặc luận điểm cần kiểm chứng.
              </FieldDescription>
            </Field>
          ) : null}

          <Field className="items-start sm:items-end">
            <FieldLabel className="sr-only">Thực thi truy vấn</FieldLabel>
            <Button type="submit" size="lg" disabled={isPending} className="w-full sm:w-auto">
              {isPending ? <Spinner data-icon="inline-start" /> : <Sparkles data-icon="inline-start" />}
              {isPending ? "Đang phân tích..." : "Phân tích"}
            </Button>
            <FieldDescription>
              Phiên bản hiện tại luôn dùng thời điểm hệ thống nhận truy vấn.
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </section>
  )
}
