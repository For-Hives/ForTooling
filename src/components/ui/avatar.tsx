'use client'

import * as React from 'react'

function cn(...classes: (string | boolean | undefined)[]) {
	return classes.filter(Boolean).join(' ')
}

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Avatar({ className, ...props }: AvatarProps) {
	return (
		<div
			className={cn(
				'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full',
				className
			)}
			{...props}
		/>
	)
}

export interface AvatarImageProps
	extends React.ImgHTMLAttributes<HTMLImageElement> {
	onLoadingStatusChange?: (status: 'loading' | 'loaded' | 'error') => void
}

export function AvatarImage({
	className,
	src,
	alt = '',
	onLoadingStatusChange,
	...props
}: AvatarImageProps) {
	const [status, setStatus] = React.useState<'loading' | 'loaded' | 'error'>(
		src ? 'loading' : 'error'
	)

	React.useEffect(() => {
		if (!src) {
			setStatus('error')
			onLoadingStatusChange?.('error')
			return
		}

		const image = new Image()
		image.src = src
		image.onload = () => {
			setStatus('loaded')
			onLoadingStatusChange?.('loaded')
		}
		image.onerror = () => {
			setStatus('error')
			onLoadingStatusChange?.('error')
		}
	}, [src, onLoadingStatusChange])

	return (
		<img
			src={src}
			className={cn(
				'h-full w-full object-cover',
				status === 'loading' && 'bg-muted animate-pulse',
				className
			)}
			alt={alt}
			{...props}
		/>
	)
}

export interface AvatarFallbackProps
	extends React.HTMLAttributes<HTMLDivElement> {}

export function AvatarFallback({ className, ...props }: AvatarFallbackProps) {
	return (
		<div
			className={cn(
				'bg-muted flex h-full w-full items-center justify-center rounded-full',
				className
			)}
			{...props}
		/>
	)
}
