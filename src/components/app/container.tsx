import { clsx } from 'clsx'

export function Container({
	children,
	isAlternative = false,
}: {
	children: React.ReactNode
	isAlternative?: boolean
}) {
	return (
		<div
			className={clsx(
				'flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center bg-gray-50',
				isAlternative && 'items-start justify-start'
			)}
		>
			<div
				className={clsx('', isAlternative ? 'max-w-none' : 'mx-auto max-w-7xl')}
			>
				{children}
			</div>
		</div>
	)
}
