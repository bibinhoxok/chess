"use client"

import SidebarTools from "./sidebar-tools"
import SpriteViewer from "./sprite-viewer"
import BoardPreview from "./board-preview"

export default function MapperInterface() {
    return (
        <div className="flex w-full h-full">
            <SidebarTools />
            <SpriteViewer />
            <BoardPreview />
        </div>
    )
}
