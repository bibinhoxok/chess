"use client"

import useMapperStore from "@/lib/store/use-mapper-store"
import { DragEvent as ReactDragEvent, useRef, useState, useEffect } from "react"
import { calculateBoardScale } from "@/lib/utils/scaling"
import { ASSETS } from "@/lib/utils/assets"

export default function BoardPreview() {
    const {
        spriteImage, regions, placedRegions,
        placeRegion, removePlacedRegion, updatePlacedRegion,
        boardZoom, setBoardZoom,
        isDragging, setIsDragging,
        activeDragRegion, setActiveDragRegion,
        dragOriginOffset, setDragOriginOffset
    } = useMapperStore()

    const boardScale = calculateBoardScale(boardZoom)

    const boardRef = useRef<HTMLDivElement>(null)
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
    const previewOffsetRef = useRef({ x: 0, y: 0 })
    const previewCursorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        let rafId: number
        const updatePreviewPosition = () => {
            if (previewCursorRef.current && isDragging) {
                const rawX = previewOffsetRef.current.x - (dragOriginOffset?.x || 0)
                const rawY = previewOffsetRef.current.y - (dragOriginOffset?.y || 0)

                // Snap the preview strictly to the "original pixel grid" representing the unscaled sprite pixels
                // just like the drop mechanic itself rounds to integers on the unscaled scale
                const snappedX = Math.round(rawX / boardZoom) * boardZoom
                const snappedY = Math.round(rawY / boardZoom) * boardZoom

                previewCursorRef.current.style.left = `${snappedX}px`
                previewCursorRef.current.style.top = `${snappedY}px`
            }
            if (isDragging) {
                rafId = requestAnimationFrame(updatePreviewPosition)
            }
        }

        if (isDragging) {
            rafId = requestAnimationFrame(updatePreviewPosition)
        }

        return () => {
            if (rafId) cancelAnimationFrame(rafId)
        }
    }, [isDragging, dragOriginOffset, boardZoom])

    const handleDragOver = (e: ReactDragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault()
        setDragOverIndex(index)
    }

    const handleDragLeave = (e: ReactDragEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDragOverIndex(null)
    }

    const handleDrop = (e: ReactDragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault()
        setDragOverIndex(null)
        try {
            const data = JSON.parse(e.dataTransfer.getData("application/json"))

            // Calculate offset relative to the TOP-LEFT of the square to make the mental 
            // model of "position in square" identical to pixel coordinates.
            const rect = e.currentTarget.getBoundingClientRect()
            const mouseX = e.clientX - rect.left
            const mouseY = e.clientY - rect.top

            // Using the top-left rather than center as requested by the mental model of exactly 
            // where something sits in a grid cell (e.g x: 2, y: 1 inside the 15x15 cell).
            // We record the pure translation distance divided by zoom so it perfectly tracks unaffected pixels.
            const dragOffsetX = data.dragOffsetX || 0
            const dragOffsetY = data.dragOffsetY || 0

            const offsetX = Math.round((mouseX / boardZoom) - dragOffsetX)
            const offsetY = Math.round((mouseY / boardZoom) - dragOffsetY)

            if (data.placedId) {
                // Moving an existing placed region
                updatePlacedRegion(data.placedId, {
                    squareIndex: index,
                    offsetX,
                    offsetY,
                })
            } else if (data.regionId) {
                // Placing a new region from the left sidebar
                const region = regions.find((r) => r.id === data.regionId)
                if (region) {
                    placeRegion({
                        regionId: region.id,
                        squareIndex: index,
                        offsetX,
                        offsetY,
                    })
                }
            }
        } catch (error) {
            console.error("Drop error", error)
        }
    }

    return (
        <div className="flex-1 flex h-full">
            {/* Board Area */}
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 p-8 overflow-auto border-r border-gray-700">
                <h2 className="text-xl font-bold mb-4">Board Preview</h2>

                <div className="relative w-fit">
                    <div
                        className="relative bg-size-[100%_100%] pixelated shadow-2xl"
                        style={{
                            backgroundImage: `url(${ASSETS.boards.purple})`,
                            width: `${boardScale.scaledBoardImageSize}px`,
                            height: `${boardScale.scaledBoardImageSize}px`,
                        }}
                        onDragOver={(e) => {
                            e.preventDefault()
                            if (!boardRef.current) return

                            // Track mouse offset relative to the inner board bounding box
                            const rect = boardRef.current.getBoundingClientRect()
                            previewOffsetRef.current = {
                                x: e.clientX - rect.left,
                                y: e.clientY - rect.top
                            }
                        }}
                    >
                        <div
                            className="absolute"
                            style={{
                                top: `${boardScale.scaledBorderSize}px`,
                                left: `${boardScale.scaledBorderSize}px`,
                                width: `${8 * boardScale.scaledSquareSize}px`,
                                height: `${8 * boardScale.scaledSquareSize}px`,
                            }}
                        >
                            {/* 1. Grid Drop Targets Layer */}
                            <div
                                className="absolute inset-0 grid grid-cols-[repeat(8,1fr)] grid-rows-[repeat(8,1fr)]"
                                ref={boardRef}
                            >
                                {Array.from({ length: 64 }).map((_, index) => {
                                    const isOver = dragOverIndex === index
                                    return (
                                        <div
                                            key={index}
                                            className={`relative border ${isOver
                                                ? "bg-white/30 border-white/50 z-20"
                                                : isDragging
                                                    ? "border-white/20 bg-white/5"
                                                    : "border-transparent"
                                                }`}
                                            onDragOver={(e) => handleDragOver(e, index)}
                                            onDragLeave={handleDragLeave}
                                            onDrop={(e) => handleDrop(e, index)}
                                        />
                                    )
                                })}
                            </div>

                            {/* 2. Placed Pieces Layer (Rendered on top to avoid overlapping grid cells blocking clicks) */}
                            <div className="absolute inset-0 pointer-events-none">
                                {placedRegions.map((placed) => {
                                    const region = regions.find((r) => r.id === placed.regionId)
                                    if (!region || !spriteImage) return null

                                    const squareX = placed.squareIndex % 8
                                    const squareY = Math.floor(placed.squareIndex / 8)

                                    const leftPx = (squareX * boardScale.scaledSquareSize) + (placed.offsetX * boardZoom)
                                    const topPx = (squareY * boardScale.scaledSquareSize) + (placed.offsetY * boardZoom)

                                    return (
                                        <div
                                            key={placed.id}
                                            draggable
                                            className={`absolute pixelated cursor-grab active:cursor-grabbing group ${isDragging ? "pointer-events-none" : "pointer-events-auto"
                                                }`}
                                            onDragStart={(e) => {
                                                e.stopPropagation()
                                                const rect = e.currentTarget.getBoundingClientRect()
                                                const dragOffsetX = (e.clientX - rect.left) / boardZoom
                                                const dragOffsetY = (e.clientY - rect.top) / boardZoom

                                                e.dataTransfer.setData(
                                                    "application/json",
                                                    JSON.stringify({
                                                        placedId: placed.id,
                                                        dragOffsetX,
                                                        dragOffsetY
                                                    })
                                                )
                                                setActiveDragRegion(region.id)
                                                setDragOriginOffset({ x: dragOffsetX * boardZoom, y: dragOffsetY * boardZoom })

                                                e.dataTransfer.setDragImage(new Image(), 0, 0) // Optional: hide native browser ghost if we want purely our green box
                                                // Defer to prevent drag cancellation by the browser
                                                setTimeout(() => setIsDragging(true), 0)
                                            }}
                                            onDragEnd={() => {
                                                setIsDragging(false)
                                                setActiveDragRegion(null)
                                                setDragOriginOffset(null)
                                            }}
                                            style={{
                                                left: `${leftPx}px`,
                                                top: `${topPx}px`,
                                                width: `${region.width}px`,
                                                height: `${region.height}px`,
                                                transform: `scale(${boardZoom})`,
                                                transformOrigin: "top left",
                                                backgroundImage: `url(${spriteImage})`,
                                                backgroundPosition: `-${region.x}px -${region.y}px`,
                                                backgroundRepeat: "no-repeat"
                                            }}
                                        >
                                            <div className="hidden group-hover:flex absolute inset-0 bg-red-500/50 items-center justify-center text-[8px] text-white z-10 leading-none pb-0.5" style={{ pointerEvents: 'none' }}>
                                                x
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* 3. Drop Preview Cursor Overlay */}
                            {isDragging && activeDragRegion && (() => {
                                const region = regions.find(r => r.id === activeDragRegion)
                                if (!region) return null

                                return (
                                    <div
                                        ref={previewCursorRef}
                                        className="absolute pointer-events-none z-50 border-2 border-emerald-400 border-dashed bg-emerald-400/20"
                                        style={{
                                            width: `${region.width}px`,
                                            height: `${region.height}px`,
                                            transform: `scale(${boardZoom})`,
                                            transformOrigin: "top left"
                                        }}
                                    />
                                )
                            })()}
                        </div>
                    </div>
                </div>
                <div className="mt-4 text-center text-sm text-gray-400">
                    Drag pieces from the sidebar onto squares.<br />
                    Drag placed pieces to reposition them.
                </div>
            </div>

            {/* Placed Tools Sidebar */}
            <div className="w-64 bg-gray-800 p-4 flex flex-col h-full overflow-y-auto shrink-0 border-l border-gray-700">
                <h2 className="text-xl font-bold mb-4">Board Tools</h2>

                {/* Board Zoom Control */}
                <div className="mb-6">
                    <label className="block text-sm font-medium mb-2">
                        Board Zoom: {boardZoom}x
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="8"
                        step="0.5"
                        value={boardZoom}
                        onChange={(e) => setBoardZoom(parseFloat(e.target.value))}
                        className="w-full"
                    />
                </div>

                {/* Placed Parts List */}
                <div className="grow mb-6">
                    <h3 className="text-lg font-semibold mb-2">Placed Parts</h3>
                    {placedRegions.length === 0 ? (
                        <p className="text-gray-400 text-sm">
                            Drag pieces onto the board to place them.
                        </p>
                    ) : (
                        <ul className="space-y-2">
                            {placedRegions.map((placed) => {
                                const region = regions.find(r => r.id === placed.regionId)
                                return (
                                    <li
                                        key={placed.id}
                                        className="bg-gray-700 p-2 rounded flex flex-col gap-1 text-sm"
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-white">
                                                {region?.name || "Unknown"}
                                            </span>
                                            <button
                                                onClick={() => removePlacedRegion(placed.id)}
                                                className="text-red-400 hover:text-red-500 text-xs"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        <div className="text-xs text-gray-400 font-mono">
                                            Sq: {placed.squareIndex} | offsetX: {placed.offsetX} | offsetY: {placed.offsetY}
                                        </div>
                                    </li>
                                )
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    )
}
