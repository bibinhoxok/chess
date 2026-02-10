import { useState } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils/cn"

interface Tab {
    id: string
    label: string
    content: React.ReactNode
}

interface TabsProps {
    tabs: Tab[]
    defaultTab?: string
    className?: string
}

export const Tabs = ({ tabs, defaultTab, className }: TabsProps) => {
    const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
    const activeContent = tabs.find((t) => t.id === activeTab)?.content

    return (
        <div className={cn("flex flex-col h-full", className)}>
            <div className="flex border-b border-gray-600">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                            "flex-1 py-2 px-4 text-sm font-medium transition-colors relative",
                            activeTab === tab.id
                                ? "text-white"
                                : "text-gray-400 hover:text-gray-200"
                        )}
                    >
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="active-tab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="flex-1 overflow-auto p-4">{activeContent}</div>
        </div>
    )
}
