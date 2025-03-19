'use client'

import * as React from 'react'

function cn(...classes: (string | boolean | undefined)[]) {
	return classes.filter(Boolean).join(' ')
}

// Simplified tooltip implementation without any library dependencies
export interface TooltipProps {
	children: React.ReactNode
}

const TooltipContext = React.createContext<{
	open: boolean
	setOpen: React.Dispatch<React.SetStateAction<boolean>>
	content: React.ReactNode
	setContent: React.Dispatch<React.SetStateAction<React.ReactNode>>
}>({
	open: false,
	setOpen: () => {},
	content: null,
	setContent: () => {},
})

export function TooltipProvider({ children }: { children: React.ReactNode }) {
	const [open, setOpen] = React.useState(false)
	const [content, setContent] = React.useState<React.ReactNode>(null)

	return (
		<TooltipContext.Provider value={{ open, setOpen, content, setContent }}>
			{children}
		</TooltipContext.Provider>
	)
}

export function Tooltip({ children }: TooltipProps) {
	return <>{children}</>
}

export interface TooltipTriggerProps
	extends React.HTMLAttributes<HTMLDivElement> {
	asChild?: boolean
}

export function TooltipTrigger({
	children,
	asChild = false,
	...props
}: TooltipTriggerProps) {
	const { setOpen, setContent } = React.useContext(TooltipContext)
	const Comp = asChild ? React.Fragment : 'div'

	const handleMouseEnter = React.useCallback(() => {
		setOpen(true)
	}, [setOpen])

	const handleMouseLeave = React.useCallback(() => {
		setOpen(false)
	}, [setOpen])

	return (
		<Comp
			onMouseEnter={handleMouseEnter}
			onMouseLeave={handleMouseLeave}
			{...props}
		>
			{children}
		</Comp>
	)
}

export interface TooltipContentProps
	extends React.HTMLAttributes<HTMLDivElement> {
	side?: 'top' | 'right' | 'bottom' | 'left'
	align?: 'start' | 'center' | 'end'
	hidden?: boolean
}

export function TooltipContent({
	children,
	className,
	side = 'top',
	align = 'center',
	hidden = false,
	...props
}: TooltipContentProps) {
	const { open, setContent } = React.useContext(TooltipContext)

	React.useEffect(() => {
		setContent(children)
	}, [children, setContent])

	if (hidden || !open) {
		return null
	}

	return (
		<div
			className={cn(
				'bg-primary text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs',
				className
			)}
			{...props}
		>
			{children}
		</div>
	)
}
