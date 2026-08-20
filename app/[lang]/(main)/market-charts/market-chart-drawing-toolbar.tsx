"use client"

import type { ComponentType, SVGProps } from "react"
import {
  ArrowUpRight,
  Boxes,
  ChartNoAxesCombined,
  ChartNoAxesGantt,
  ChartSpline,
  Circle,
  CircleDot,
  Eraser,
  Eye,
  EyeOff,
  GitBranch,
  Lock,
  Magnet,
  Minus,
  MoveDiagonal,
  MoveHorizontal,
  MoveVertical,
  Orbit,
  PencilLine,
  Route,
  Rows3,
  Shapes,
  Slash,
  Spline,
  Square,
  Trash2,
  Triangle,
  Unlock,
  Workflow,
} from "lucide-react"

import { useLocalization } from "@/app/lib/i18n/provider"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AlertDialogContentInOverlay } from "@/components/ui/alert-dialog-content-in-overlay"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DropdownMenuContentInOverlay as DropdownMenuContent } from "@/components/ui/dropdown-menu-content-in-overlay"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

import {
  MARKET_CHART_DRAWING_PALETTES,
  MARKET_CHART_DRAWING_PALETTE_TOOLS,
  getMarketChartDrawingToolPalette,
  type MarketChartDrawingPalette,
  type MarketChartDrawingState,
  type MarketChartDrawingTool,
} from "./market-chart-drawing"

type DrawingToolIcon = ComponentType<SVGProps<SVGSVGElement>>
type DrawingStateToggleValue = "magnet" | "locked" | "visible"

const DRAWING_TOOL_ICONS: Record<MarketChartDrawingTool, DrawingToolIcon> = {
  "horizontal-line": MoveHorizontal,
  "horizontal-ray": MoveHorizontal,
  "horizontal-segment": Minus,
  "vertical-line": MoveVertical,
  "vertical-ray": MoveVertical,
  "vertical-segment": MoveVertical,
  "trend-line": Slash,
  ray: Spline,
  segment: MoveDiagonal,
  arrow: ArrowUpRight,
  "free-draw": PencilLine,
  "price-line": ChartNoAxesCombined,
  "price-channel-line": ChartNoAxesCombined,
  "parallel-line": ChartSpline,
  circle: Circle,
  rectangle: Square,
  parallelogram: Shapes,
  triangle: Triangle,
  "fibonacci-line": Rows3,
  "fibonacci-segment": Rows3,
  "fibonacci-circle": CircleDot,
  "fibonacci-spiral": Orbit,
  "fibonacci-sector": ChartNoAxesGantt,
  "fibonacci-extension": ChartSpline,
  "gann-box": Boxes,
  "xabcd-pattern": Workflow,
  "abcd-pattern": GitBranch,
  "three-waves": Route,
  "five-waves": Route,
  "eight-waves": Route,
  "any-waves": Route,
}

const DRAWING_PALETTE_ICONS: Record<
  MarketChartDrawingPalette,
  DrawingToolIcon
> = {
  line: Slash,
  channel: ChartNoAxesCombined,
  shape: Circle,
  fibonacci: Rows3,
  pattern: Workflow,
}

function getDrawingStateToggleValues(
  state: MarketChartDrawingState
): DrawingStateToggleValue[] {
  return [
    state.isMagnetEnabled ? "magnet" : null,
    state.isLocked ? "locked" : null,
    state.isVisible ? "visible" : null,
  ].filter((value): value is DrawingStateToggleValue => value !== null)
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
    <div
      className={cn(
        "flex shrink-0 flex-col items-center gap-1 overflow-hidden border-r bg-card p-1",
        disabled ? "pointer-events-none opacity-50" : null
      )}
      aria-label={labels.toolbarLabel}
      onClick={(event) => event.stopPropagation()}
    >
      <div
        className="flex flex-col items-center gap-1"
        aria-label={labels.toolsLabel}
      >
        {MARKET_CHART_DRAWING_PALETTES.map((palette) => {
          const selectedTool = state.selectedTools[palette]
          const selectedToolIsActive = state.activeTool
            ? getMarketChartDrawingToolPalette(state.activeTool) === palette
            : false
          const TriggerIcon =
            DRAWING_TOOL_ICONS[selectedTool] ?? DRAWING_PALETTE_ICONS[palette]

          return (
            <DropdownMenu key={palette}>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    variant={selectedToolIsActive ? "secondary" : "ghost"}
                    size="sm"
                    disabled={disabled}
                    aria-label={`${labels.palettes[palette]}: ${labels.tools[selectedTool]}`}
                    aria-pressed={selectedToolIsActive}
                  />
                }
              >
                <TriggerIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-56">
                <DropdownMenuGroup>
                  {MARKET_CHART_DRAWING_PALETTE_TOOLS[palette].map((tool) => {
                    const Icon = DRAWING_TOOL_ICONS[tool]

                    return (
                      <DropdownMenuItem
                        key={tool}
                        onClick={() => {
                          onToolChange(tool)
                        }}
                      >
                        <Icon />
                        {labels.tools[tool]}
                      </DropdownMenuItem>
                    )
                  })}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        })}
      </div>

      <Separator />
      <ToggleGroup
        multiple
        orientation="vertical"
        spacing={1}
        value={getDrawingStateToggleValues(state)}
        aria-label={labels.stateControlsLabel}
        onValueChange={(values) => {
          const nextValues = new Set(values)

          onStateChange({
            isLocked: nextValues.has("locked"),
            isMagnetEnabled: nextValues.has("magnet"),
            isVisible: nextValues.has("visible"),
          })
        }}
      >
        <ToggleGroupItem
          value="magnet"
          size="sm"
          disabled={disabled}
          aria-label={labels.magnet}
        >
          <Magnet />
        </ToggleGroupItem>

        <ToggleGroupItem
          value="locked"
          size="sm"
          disabled={disabled}
          aria-label={state.isLocked ? labels.unlock : labels.lock}
        >
          {state.isLocked ? <Lock /> : <Unlock />}
        </ToggleGroupItem>

        <ToggleGroupItem
          value="visible"
          size="sm"
          disabled={disabled}
          aria-label={state.isVisible ? labels.hide : labels.show}
        >
          {state.isVisible ? <Eye /> : <EyeOff />}
        </ToggleGroupItem>
      </ToggleGroup>

      <Separator />
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={disabled || !state.hasSelectedDrawing}
        aria-label={labels.deleteSelected}
        onClick={onDeleteSelected}
      >
        <Eraser />
      </Button>

      <AlertDialog>
        <AlertDialogTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={disabled}
              aria-label={labels.clearAll}
            />
          }
        >
          <Trash2 />
        </AlertDialogTrigger>
        <AlertDialogContentInOverlay>
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
        </AlertDialogContentInOverlay>
      </AlertDialog>
    </div>
  )
}
