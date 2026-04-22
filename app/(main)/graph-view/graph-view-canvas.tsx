"use client"

import {
  SigmaContainer,
  useCamera,
  useLoadGraph,
  useRegisterEvents,
  useSetSettings,
  useSigma,
} from "@react-sigma/core"
import { LocateFixed, Minus, Plus } from "lucide-react"
import { useEffect, useEffectEvent, useRef, useState } from "react"

import { Button } from "@/components/ui/button"

import { getGraphViewRelationLabel } from "@/app/lib/graph-view/definitions"

import type {
  GraphEdgeAttributes,
  GraphModel,
  GraphNodeAttributes,
  LocalFocusState,
  SelectedGraphItem,
} from "./graph-view-workbench"

const DIM_NODE_COLOR = "rgba(148, 163, 184, 0.42)"
const DIM_EDGE_COLOR = "rgba(148, 163, 184, 0.26)"

function getFocusState(
  graphModel: GraphModel,
  hoveredNodeId: string | null,
  selectedItem: SelectedGraphItem
) {
  const focusNodes = new Set<string>()
  const focusEdges = new Set<string>()

  const addNodeNeighborhood = (nodeId: string) => {
    graphModel.relatedNodesByNodeId.get(nodeId)?.forEach((relatedNodeId) => {
      focusNodes.add(relatedNodeId)
    })

    graphModel.relatedEdgesByNodeId.get(nodeId)?.forEach((edgeId) => {
      focusEdges.add(edgeId)
    })
  }

  if (hoveredNodeId && graphModel.nodeMap.has(hoveredNodeId)) {
    addNodeNeighborhood(hoveredNodeId)
  }

  if (
    selectedItem?.type === "node" &&
    graphModel.nodeMap.has(selectedItem.id)
  ) {
    addNodeNeighborhood(selectedItem.id)
  }

  if (selectedItem?.type === "edge") {
    const edge = graphModel.edgeMap.get(selectedItem.id)

    if (edge) {
      focusEdges.add(edge.id)
      focusNodes.add(edge.sourceNodeId)
      focusNodes.add(edge.targetNodeId)
    }
  }

  return {
    focusNodes,
    focusEdges,
    hasFocus: focusNodes.size > 0 || focusEdges.size > 0,
  }
}

function GraphCanvasScene({
  graphModel,
  localFocusDepth,
  localFocusState,
  onSelectionChange,
  selectedItem,
  showContextualEdgeLabels,
}: {
  graphModel: GraphModel
  localFocusDepth: number
  localFocusState: LocalFocusState | null
  onSelectionChange: (selectedItem: SelectedGraphItem) => void
  selectedItem: SelectedGraphItem
  showContextualEdgeLabels: boolean
}) {
  const loadGraph = useLoadGraph<GraphNodeAttributes, GraphEdgeAttributes>()
  const registerEvents = useRegisterEvents<
    GraphNodeAttributes,
    GraphEdgeAttributes
  >()
  const setSettings = useSetSettings<GraphNodeAttributes, GraphEdgeAttributes>()
  const sigma = useSigma<GraphNodeAttributes, GraphEdgeAttributes>()
  const previousFocusNodeIdRef = useRef<string | null>(null)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [isSettling, setIsSettling] = useState(false)
  const { gotoNode, reset, zoomIn, zoomOut } = useCamera({
    duration: 320,
    factor: 1.45,
  })

  const handleEnterNode = useEffectEvent((nodeId: string) => {
    setHoveredNodeId(nodeId)
  })

  const handleLeaveNode = useEffectEvent(() => {
    setHoveredNodeId(null)
  })

  const handleClickNode = useEffectEvent((nodeId: string) => {
    onSelectionChange({
      type: "node",
      id: nodeId,
    })
  })

  const handleClickEdge = useEffectEvent((edgeId: string) => {
    onSelectionChange({
      type: "edge",
      id: edgeId,
    })
  })

  const handleClickStage = useEffectEvent(() => {
    onSelectionChange(null)
  })

  const handleResetViewport = () => {
    if (localFocusState?.centerNodeId) {
      void gotoNode(localFocusState.centerNodeId, {
        duration: 520,
      })

      return
    }

    reset({
      duration: 520,
    })
  }

  useEffect(() => {
    loadGraph(graphModel.graph, true)

    let settleTimeout: number | null = null
    const animationTimeout = window.setTimeout(() => {
      sigma.refresh()

      const camera = sigma.getCamera()
      const settledState = camera.getState()
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches

      if (prefersReducedMotion) {
        setIsSettling(false)

        return
      }

      setIsSettling(true)
      camera.setState({
        ...settledState,
        angle: settledState.angle - 0.015,
        ratio: Math.min(settledState.ratio * 1.16, settledState.ratio + 0.24),
        x: settledState.x - 0.03,
        y: settledState.y + 0.025,
      })
      void camera.animate(settledState, {
        duration: 820,
      })

      settleTimeout = window.setTimeout(() => {
        setIsSettling(false)
      }, 840)
    }, 60)

    return () => {
      window.clearTimeout(animationTimeout)

      if (settleTimeout !== null) {
        window.clearTimeout(settleTimeout)
      }
    }
  }, [graphModel, loadGraph, sigma])

  useEffect(() => {
    registerEvents({
      clickEdge: ({ edge }) => handleClickEdge(edge),
      clickNode: ({ node }) => handleClickNode(node),
      clickStage: () => handleClickStage(),
      enterNode: ({ node }) => handleEnterNode(node),
      leaveNode: () => handleLeaveNode(),
    })
  }, [registerEvents])

  useEffect(() => {
    const focusCenterNodeId = localFocusState?.centerNodeId ?? null

    if (focusCenterNodeId) {
      previousFocusNodeIdRef.current = focusCenterNodeId
      void gotoNode(focusCenterNodeId, {
        duration: 540,
      })

      return
    }

    if (previousFocusNodeIdRef.current) {
      previousFocusNodeIdRef.current = null
      reset({
        duration: 540,
      })
    }
  }, [gotoNode, localFocusState, reset])

  useEffect(() => {
    const focusState = getFocusState(graphModel, hoveredNodeId, selectedItem)
    const localFocusNodeIds = localFocusState?.nodeIds ?? null
    const localFocusEdgeIds = localFocusState?.edgeIds ?? null
    const shouldRevealAllLocalEdgeLabels =
      showContextualEdgeLabels &&
      !!localFocusState &&
      localFocusState.edgeIds.size <= 12 &&
      !hoveredNodeId &&
      selectedItem?.type !== "edge"

    setSettings({
      edgeReducer: (edgeId, data) => {
        const isVisible = !localFocusEdgeIds || localFocusEdgeIds.has(edgeId)
        const isSelectedEdge =
          selectedItem?.type === "edge" && selectedItem.id === edgeId
        const isInteractionFocused =
          !focusState.hasFocus || focusState.focusEdges.has(edgeId)
        const shouldDim =
          isVisible &&
          focusState.hasFocus &&
          !isInteractionFocused &&
          !localFocusState
        const shouldRevealLabel =
          isSelectedEdge ||
          (showContextualEdgeLabels &&
            isVisible &&
            (focusState.focusEdges.has(edgeId) || shouldRevealAllLocalEdgeLabels))

        return {
          ...data,
          color: shouldDim ? DIM_EDGE_COLOR : data.baseColor,
          forceLabel: shouldRevealLabel,
          hidden: !isVisible,
          label: shouldRevealLabel ? data.baseLabel : null,
          size:
            data.baseSize +
            (isSelectedEdge
              ? 1
              : focusState.focusEdges.has(edgeId)
                ? 0.28
                : localFocusEdgeIds?.has(edgeId)
                  ? 0.12
                  : 0),
          zIndex: isSelectedEdge ? 3 : focusState.focusEdges.has(edgeId) ? 1 : 0,
        }
      },
      enableEdgeEvents: true,
      labelDensity: showContextualEdgeLabels ? 0.1 : 0.06,
      labelGridCellSize: showContextualEdgeLabels ? 132 : 164,
      nodeReducer: (nodeId, data) => {
        const isVisible = !localFocusNodeIds || localFocusNodeIds.has(nodeId)
        const isHoveredNode = hoveredNodeId === nodeId
        const isSelectedNode =
          selectedItem?.type === "node" && selectedItem.id === nodeId
        const isFocusedNode =
          !focusState.hasFocus || focusState.focusNodes.has(nodeId)
        const isSelectedEdgeEndpoint =
          selectedItem?.type === "edge" && focusState.focusNodes.has(nodeId)
        const isLocalFocusCenter = localFocusState?.centerNodeId === nodeId
        const shouldDim =
          isVisible &&
          focusState.hasFocus &&
          !isFocusedNode &&
          !isSelectedEdgeEndpoint &&
          !localFocusState
        const shouldRevealLabel =
          isHoveredNode ||
          isSelectedNode ||
          isSelectedEdgeEndpoint ||
          isLocalFocusCenter

        return {
          ...data,
          color: shouldDim ? DIM_NODE_COLOR : data.baseColor,
          forceLabel: shouldRevealLabel,
          hidden: !isVisible,
          highlighted:
            isHoveredNode ||
            isSelectedNode ||
            isSelectedEdgeEndpoint ||
            isLocalFocusCenter,
          label: shouldRevealLabel ? data.baseLabel : null,
          size:
            data.baseSize +
            (isSelectedNode
              ? 3.4
              : isHoveredNode
                ? 1.8
                : isSelectedEdgeEndpoint || isLocalFocusCenter
                  ? 0.9
                  : 0),
          zIndex: isSelectedNode
            ? 4
            : isHoveredNode || isSelectedEdgeEndpoint || isLocalFocusCenter
              ? 2
              : 0,
        }
      },
      renderEdgeLabels: true,
    })

    sigma.refresh()
  }, [
    graphModel,
    hoveredNodeId,
    localFocusState,
    selectedItem,
    setSettings,
    showContextualEdgeLabels,
    sigma,
  ])

  const selectedLabel =
    selectedItem?.type === "node"
      ? graphModel.nodeMap.get(selectedItem.id)?.label
      : selectedItem?.type === "edge"
        ? getGraphViewRelationLabel(
            graphModel.edgeMap.get(selectedItem.id)?.relationType ||
              selectedItem.id
          )
        : null

  const hoveredLabel = hoveredNodeId
    ? graphModel.nodeMap.get(hoveredNodeId)?.label
    : null

  return (
    <>
      <div className="pointer-events-none absolute inset-x-4 top-4 z-10 flex flex-wrap items-start justify-between gap-3">
        <div className="pointer-events-auto flex max-w-[min(100%,30rem)] flex-col gap-1 rounded-2xl border border-border/80 bg-background/88 px-3.5 py-2.5 shadow-sm backdrop-blur">
          <span className="text-[11px] font-medium tracking-[0.16em] text-muted-foreground uppercase">
            {isSettling
              ? "Đang ổn định bố cục"
              : localFocusState
                ? "Chế độ tập trung cụm"
                : "Không gian toàn cảnh"}
          </span>
          <span className="text-xs leading-5 text-foreground/85">
            {selectedLabel
              ? `Đang neo chi tiết: ${selectedLabel}`
              : hoveredLabel
                ? `Đang rà qua: ${hoveredLabel}`
                : "Rê chuột để đọc vùng lân cận, nhấp để mở hộp thoại chi tiết mà không rời khỏi góc nhìn hiện tại."}
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-border/80 bg-background/90 p-1 shadow-sm backdrop-blur">
          <Button
            aria-label="Thu nhỏ biểu đồ"
            onClick={() => zoomOut()}
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <Minus />
          </Button>
          <Button
            aria-label={
              localFocusState
                ? "Căn lại khung nhìn của cụm đang tập trung"
                : "Đưa về toàn cảnh"
            }
            onClick={handleResetViewport}
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <LocateFixed />
          </Button>
          <Button
            aria-label="Phóng to biểu đồ"
            onClick={() => zoomIn()}
            size="icon-xs"
            type="button"
            variant="ghost"
          >
            <Plus />
          </Button>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 flex flex-wrap items-end justify-between gap-3">
        <div className="pointer-events-auto rounded-full border border-border/80 bg-background/88 px-3 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur">
          {localFocusState
            ? `${localFocusState.nodeIds.size} nút · ${localFocusState.edgeIds.size} cạnh trong ${localFocusDepth} bậc`
            : `${graphModel.nodes.length} nút · ${graphModel.edges.length} cạnh trong toàn cảnh`}
        </div>

        <div className="pointer-events-auto rounded-full border border-border/80 bg-background/88 px-3 py-1.5 text-xs text-muted-foreground shadow-sm backdrop-blur">
          {showContextualEdgeLabels
            ? "Nhãn cạnh theo ngữ cảnh đang bật"
            : "Nhãn cạnh chỉ hiện khi cần"}
        </div>
      </div>
    </>
  )
}

export function GraphViewCanvas({
  graphModel,
  localFocusDepth,
  localFocusState,
  onSelectionChange,
  selectedItem,
  showContextualEdgeLabels,
}: {
  graphModel: GraphModel
  localFocusDepth: number
  localFocusState: LocalFocusState | null
  onSelectionChange: (selectedItem: SelectedGraphItem) => void
  selectedItem: SelectedGraphItem
  showContextualEdgeLabels: boolean
}) {
  return (
    <SigmaContainer
      className="relative h-full min-h-[640px] w-full animate-in fade-in duration-500"
      settings={{
        autoCenter: true,
        autoRescale: true,
        defaultEdgeColor: "#94a3b8",
        defaultNodeColor: "#94a3b8",
        enableEdgeEvents: true,
        enableCameraPanning: true,
        enableCameraZooming: true,
        hideEdgesOnMove: false,
        hideLabelsOnMove: true,
        labelDensity: 0.06,
        labelGridCellSize: 164,
        labelRenderedSizeThreshold: 12,
        maxCameraRatio: 6,
        minCameraRatio: 0.06,
        renderEdgeLabels: true,
        renderLabels: true,
        stagePadding: 42,
        zIndex: true,
      }}
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <GraphCanvasScene
        graphModel={graphModel}
        localFocusDepth={localFocusDepth}
        localFocusState={localFocusState}
        onSelectionChange={onSelectionChange}
        selectedItem={selectedItem}
        showContextualEdgeLabels={showContextualEdgeLabels}
      />
    </SigmaContainer>
  )
}
