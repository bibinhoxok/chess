"use client"

import useMapperStore from "@/lib/store/use-mapper-store"
import { ChangeEvent, useRef } from "react"

export default function SidebarTools() {
    const {
        setSpriteImage,
        zoom,
        setZoom,
        regions,
        removeRegion,
        updateRegion,
        placedRegions,
        setIsDragging,
        setActiveDragRegion,
        setDragOriginOffset,
    } = useMapperStore()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (event) => {
                setSpriteImage(event.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleExport = () => {
        const exportedData = {
            regions,
            placedRegions,
        }
        const dataStr =
            "data:text/json;charset=utf-8," +
            encodeURIComponent(JSON.stringify(exportedData, null, 2))
        const downloadAnchorNode = document.createElement("a")
        downloadAnchorNode.setAttribute("href", dataStr)
        downloadAnchorNode.setAttribute("download", "mapper_data.json")
        document.body.appendChild(downloadAnchorNode) // required for firefox
        downloadAnchorNode.click()
        downloadAnchorNode.remove()
    }

    return (
        <div className="w-64 border-r border-gray-700 bg-gray-800 p-4 flex flex-col h-full overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Mapper Tools</h2>

            {/* Image Upload */}
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                    Upload Sprite Sheet
                </label>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Choose Image
                </button>
            </div>

            {/* Zoom Control */}
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                    Zoom: {zoom}x
                </label>
                <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.5"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full"
                />
            </div>

            {/* Regions List */}
            <div className="grow mb-6">
                <h3 className="text-lg font-semibold mb-2">Defined Parts</h3>
                {regions.length === 0 ? (
                    <p className="text-gray-400 text-sm">
                        Draw rectangles on the image to define parts.
                    </p>
                ) : (
                    <ul className="space-y-2">
                        {regions.map((region) => (
                            <li
                                key={region.id}
                                className="bg-gray-700 p-2 rounded flex flex-col gap-2"
                                draggable
                                onDragStart={(e) => {
                                    const dragOffsetX = 0
                                    const dragOffsetY = 0

                                    e.dataTransfer.setData(
                                        "application/json",
                                        JSON.stringify({
                                            regionId: region.id,
                                            dragOffsetX,
                                            dragOffsetY
                                        }),
                                    )
                                    setActiveDragRegion(region.id)
                                    setDragOriginOffset({ x: dragOffsetX, y: dragOffsetY })

                                    // Exposing offset data to global store so the preview box can instantly read it
                                    // before the drop event fires.
                                    e.dataTransfer.setDragImage(new Image(), 0, 0) // Optional: hide native browser ghost if we want purely our green box
                                    setTimeout(() => setIsDragging(true), 0)
                                }}
                                onDragEnd={() => {
                                    setIsDragging(false)
                                    setActiveDragRegion(null)
                                    setDragOriginOffset(null)
                                }}
                            >
                                <div className="flex justify-between items-center">
                                    <input
                                        value={region.name}
                                        onChange={(e) =>
                                            updateRegion(region.id, {
                                                name: e.target.value,
                                            })
                                        }
                                        className="bg-gray-800 text-sm p-1 rounded w-2/3"
                                        placeholder="Part Name"
                                    />
                                    <button
                                        onClick={() => removeRegion(region.id)}
                                        className="text-red-400 hover:text-red-500 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                                <div className="text-xs text-gray-400">
                                    x: {region.x}, y: {region.y}, w:{" "}
                                    {region.width}, h: {region.height}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Export Button */}
            <button
                onClick={handleExport}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded mt-auto"
            >
                Export JSON
            </button>
        </div>
    )
}
