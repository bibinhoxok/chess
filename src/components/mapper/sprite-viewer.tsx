"use client"

import useMapperStore from "@/lib/store/use-mapper-store"
import { MouseEvent, useRef, useState } from "react"

export default function SpriteViewer() {
    const { spriteImage, zoom, regions, addRegion } = useMapperStore()
    const containerRef = useRef<HTMLDivElement>(null)

    const [isDrawing, setIsDrawing] = useState(false)
    const [startPos, setStartPos] = useState({ x: 0, y: 0 })
    const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 })

    const getMousePos = (e: MouseEvent) => {
        if (!containerRef.current) return { x: 0, y: 0 }
        const rect = containerRef.current.getBoundingClientRect()

        // Use zoom logic strictly handling scroll if any, but since we are scaling through CSS transform or width/height,
        // Mouse coordinates relative to the image need to be divided by zoom
        return {
            x: Math.floor((e.clientX - rect.left) / zoom),
            y: Math.floor((e.clientY - rect.top) / zoom),
        }
    }

    const handleMouseDown = (e: MouseEvent) => {
        if (!spriteImage) return
        e.preventDefault()
        const pos = getMousePos(e)
        setIsDrawing(true)
        setStartPos(pos)
        setCurrentPos(pos)
    }

    const handleMouseMove = (e: MouseEvent) => {
        if (!isDrawing) return
        setCurrentPos(getMousePos(e))
    }

    const handleMouseUp = () => {
        if (!isDrawing) return
        setIsDrawing(false)

        const x = Math.min(startPos.x, currentPos.x)
        const y = Math.min(startPos.y, currentPos.y)
        const width = Math.abs(currentPos.x - startPos.x)
        const height = Math.abs(currentPos.y - startPos.y)

        if (width > 0 && height > 0) {
            addRegion({
                name: `part_${regions.length + 1}`,
                x,
                y,
                width,
                height,
            })
        }
    }

    return (
        <div className="flex-1 border-r border-gray-700 bg-gray-900 overflow-auto relative flex items-center justify-center">
            {!spriteImage ? (
                <div className="text-gray-500">Upload an image to start mapping</div>
            ) : (
                <div
                    className="relative cursor-crosshair m-auto shadow-2xl"
                    ref={containerRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    style={{
                        // The container itself is sized based on the scaled image dimensions
                        // so that scrollbars appear exactly right on the parent div.
                        width: `calc(max-content * ${zoom})`,
                        height: `calc(max-content * ${zoom})`,
                    }}
                >
                    {/* This internal wrapper handles the visual scaling without messing with the container bounds */}
                    <div
                        style={{
                            transformOrigin: "top left",
                            transform: `scale(${zoom})`,
                            width: "max-content", // Real unscaled width
                            height: "max-content", // Real unscaled height
                            position: "absolute",
                            top: 0,
                            left: 0,
                        }}
                    >
                        {/* Checkerboard background for transparency */}
                        <div
                            className="absolute inset-0 z-0 select-none pointer-events-none"
                            style={{
                                backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIvPgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNjY2MiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNjY2MiLz4KPC9zdmc+')`,
                            }}
                        />

                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={spriteImage}
                            alt="Sprite Sheet"
                            className="pixelated block relative z-10 pointer-events-none select-none drop-shadow-lg"
                            draggable={false}
                        />

                        {/* Drawing layer is rendered at scale 1, taking exactly the image's intrinsic size */}
                        <div
                            className="absolute inset-0 z-20 pointer-events-none"
                        >
                            {/* Current drawing box */}
                            {isDrawing && (
                                <div
                                    className="absolute border-2 border-green-500 bg-green-500/20"
                                    style={{
                                        left: `${Math.min(startPos.x, currentPos.x)}px`,
                                        top: `${Math.min(startPos.y, currentPos.y)}px`,
                                        width: `${Math.abs(currentPos.x - startPos.x)}px`,
                                        height: `${Math.abs(currentPos.y - startPos.y)}px`,
                                    }}
                                />
                            )}

                            {/* Saved regions */}
                            {regions.map((region) => (
                                <div
                                    key={region.id}
                                    className="absolute border border-blue-500 bg-blue-500/10"
                                    style={{
                                        left: `${region.x}px`,
                                        top: `${region.y}px`,
                                        width: `${region.width}px`,
                                        height: `${region.height}px`,
                                    }}
                                >
                                    {/* Because the parent is visually scaled up, text here would scale up too.
											To keep text readable and small, we inverse the scale just for the label. */}
                                    <div
                                        className="absolute -top-6 left-0 bg-blue-600 text-white text-xs px-1 rounded whitespace-nowrap"
                                        style={{
                                            transform: `scale(${1 / zoom})`,
                                            transformOrigin: "bottom left"
                                        }}
                                    >
                                        {region.name}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
