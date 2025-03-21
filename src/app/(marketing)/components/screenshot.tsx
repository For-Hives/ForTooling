import { clsx } from 'clsx'

export function Screenshot({
	className,
	height,
	src,
	width,
}: {
	width: number
	height: number
	src: string
	className?: string
}) {
	return (
		<div
			style={{ '--height': height, '--width': width } as React.CSSProperties}
			className={clsx(
				className,
				'relative aspect-[var(--width)/var(--height)] [--radius:var(--radius-xl)]'
			)}
		>
			<div className='absolute -inset-[var(--padding)] rounded-[calc(var(--radius)+var(--padding))] shadow-xs ring-1 ring-black/5 [--padding:--spacing(2)]' />
			<img
				alt=''
				src={src}
				className='h-full rounded-[var(--radius)] shadow-2xl ring-1 ring-black/10'
			/>
		</div>
	)
}
