'use client'

import Image from 'next/image'

export function Logo({ className }: { className?: string }) {
	return (
		<Image
			src={'/logo.png'}
			alt='logo ForTooling'
			width={100}
			height={100}
			className={className}
		/>
	)
}
