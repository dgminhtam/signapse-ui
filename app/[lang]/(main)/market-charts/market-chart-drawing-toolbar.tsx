"use client"

import type { ComponentType, ReactElement, SVGProps } from "react"
import {
  ChartNoAxesCombined,
  ChevronLeft,
  ChevronRight,
  Circle,
  Eye,
  EyeOff,
  Lock,
  Magnet,
  Minus,
  PenLine,
  Slash,
  Square,
  Trash2,
  Unlock,
} from "lucide-react"

import { useLocalization } from "@/app/lib/i18n/provider"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

import {
  MARKET_CHART_DRAWING_TOOLS,
  isMarketChartDrawingTool,
  type MarketChartDrawingState,
  type MarketChartDrawingTool,
} from "./market-chart-drawing"

type DrawingToolIcon = ComponentType<SVGProps<SVGSVGElement>>

const DRAWING_TOOL_ICONS: Record<MarketChartDrawingTool, DrawingToolIcon> = {
  "horizontal-line": Minus,
  "trend-line": Slash,
  channel: ChartNoAxesCombined,
  fibonacci: PenLine,
  circle: Circle,
  rectangle: Square,
}

interface MarketChartDrawingToolbarProps {
  disabled: boolean
  state: MarketChartDrawingState
  onClearAll: () => void
  onDeleteSelected: () => void
  onStateChange: (state: Partial<MarketChartDrawingState>) => void
  onToolChange: (tool: MarketChartDrawingTool | null) => void
}

export function MarketChartDrawingToolbar({
  disabled,
  state,
  onClearAll,
  onDeleteSelected,
  onStateChange,
  onToolChange,
}: MarketChartDrawingToolbarProps) {
  const { dictionary } = useLocalization()
  const labels = dictionary.marketCharts.drawings

  return (
    <TooltipProvider delayDuration={150}>
      <div
        className={cn(
          "flex shrink-0 flex-col items-center overflow-hidden border-r bg-card p-1",
          disabled ? "pointer-events-none opacity-50" : null
        )}
        aria-label={labels.toolbarLabel}
        onClick={(event) => event.stopPropagation()}
      >
        <DrawingTooltip label={state.isCollapsed ? labels.expand : labels.collapse}>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={disabled}
            aria-label={state.isCollapsed ? labels.expand : labels.collapse}
            onClick={() => onStateChange({ isCollapsed: !state.isCollapsed })}
          >
            {state.isCollapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </DrawingTooltip>

        {!state.isCollapsed ? (
          <>
            <Separator />
            <ToggleGroup
              type="single"
              orientation="vertical"
              value={state.activeTool ?? ""}
              aria-label={labels.toolsLabel}
              onValueChange={(value) => {
                onToolChange(isMarketChartDrawingTool(value) ? value : null)
              }}
            >
              {MARKET_CHART_DRAWING_TOOLS.map((tool) => {
                const Icon = DRAWING_TOOL_ICONS[tool]

                return (
                  <DrawingTooltip key={tool} label={labels.tools[tool]}>
                    <ToggleGroupItem
                      value={tool}
                      size="sm"
                      disabled={disabled}
                      aria-label={labels.tools[tool]}
                    >
                      <Icon />
                    </ToggleGroupItem>
                  </DrawingTooltip>
                )
              })}
            </ToggleGroup>

            <Separator />
            <DrawingTooltip label={labels.magnet}>
              <Toggle
                variant="default"
                size="sm"
                pressed={state.isMagnetEnabled}
                disabled={disabled}
                aria-label={labels.magnet}
                onPressedChange={(checked) =>
                  onStateChange({ isMagnetEnabled: checked })
                }
              >
                <Magnet />
              </Toggle>
            </DrawingTooltip>

            <DrawingTooltip label={state.isLocked ? labels.unlock : labels.lock}>
              <Toggle
                variant="default"
                size="sm"
                pressed={state.isLocked}
                disabled={disabled}
                aria-label={state.isLocked ? labels.unlock : labels.lock}
                onPressedChange={(checked) =>
                  onStateChange({ isLocked: checked })
                }
              >
                {state.isLocked ? <Lock /> : <Unlock />}
              </Toggle>
            </DrawingTooltip>

            <DrawingTooltip label={state.isVisible ? labels.hide : labels.show}>
              <Toggle
                variant="default"
                size="sm"
                pressed={state.isVisible}
                disabled={disabled}
                aria-label={state.isVisible ? labels.hide : labels.show}
                onPressedChange={(checked) =>
                  onStateChange({ isVisible: checked })
                }
              >
                {state.isVisible ? <Eye /> : <EyeOff />}
              </Toggle>
            </DrawingTooltip>

            <Separator />
            <DrawingTooltip label={labels.deleteSelected}>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                disabled={disabled || !state.hasSelectedDrawing}
                aria-label={labels.deleteSelected}
                onClick={onDeleteSelected}
              >
                <Trash2 />
              </Button>
            </DrawingTooltip>

            <AlertDialog>
              <DrawingTooltip label={labels.clearAll}>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    disabled={disabled}
                    aria-label={labels.clearAll}
                  >
                    <Trash2 />
                  </Button>
                </AlertDialogTrigger>
              </DrawingTooltip>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{labels.clearAllTitle}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {labels.clearAllDescription}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{labels.cancel}</AlertDialogCancel>
                  <AlertDialogAction variant="destructive" onClick={onClearAll}>
                    {labels.clearAllConfirm}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        ) : null}
      </div>
    </TooltipProvider>
  )
}

function DrawingTooltip({
  children,
  label,
}: {
  children: ReactElement
  label: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  )
}
