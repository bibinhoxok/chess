"use client"

import { useState, useMemo } from "react"
import { motion } from "motion/react"
import { useDebounceValue, useWindowSize } from "usehooks-ts"
import { cn } from "@/lib/utils/cn"
import BorderedBox from "./bordered-box"

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

const useTabSize = () => {
	const { width: windowWidth = 0, height: windowHeight = 0 } = useWindowSize()

	const [debouncedSize] = useDebounceValue(
		{ width: windowWidth, height: windowHeight },
		50,
	)

	return useMemo(() => {
		const scale = 10
		const w = Math.floor((debouncedSize.width / 3 / scale - 17) / 4)
		const headerBoxHeight = 21 * scale
		const gap = 40
		const remainingHeight = Math.max(
			0,
			debouncedSize.height - headerBoxHeight - gap,
		)
		const h = Math.floor((remainingHeight / scale - 17) / 4)
		return {
			width: Math.max(3, w),
			height: Math.max(1, h),
		}
	}, [debouncedSize])
}


export const Tabs = ({ tabs, defaultTab, className }: TabsProps) => {
	const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
	const activeContent = tabs.find((t) => t.id === activeTab)?.content
	const boxDims = useTabSize()
	return (
		<div
			className={cn(
				"flex justify-center h-full w-full overflow-hidden",
				className,
			)}
		>
			{boxDims.width > 0 && (
				<div className="flex flex-col h-full items-center">
					<BorderedBox width={boxDims.width} height={1}>
						<div className="flex border-b border-white/20">
							{tabs.map((tab) => (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={cn(
										"flex-1 py-3 px-2 text-[10px] font-medium transition-colors relative uppercase tracking-widest",
										activeTab === tab.id
											? "text-white"
											: "text-white/40 hover:text-white/80",
									)}
								>
									{activeTab === tab.id && (
										<motion.div
											layoutId="active-tab"
											className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
											transition={{
												type: "spring",
												stiffness: 500,
												damping: 30,
											}}
										/>
									)}
									{tab.label}
								</button>
							))}
						</div>
					</BorderedBox>
					<BorderedBox width={boxDims.width} height={boxDims.height}>
						<div className="flex-1 overflow-auto p-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent w-full h-ful">
							{activeContent}
						</div>
					</BorderedBox>
				</div>
			)}
		</div>
	)
}
