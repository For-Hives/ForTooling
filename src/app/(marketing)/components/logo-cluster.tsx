'use client'

import { clsx } from 'clsx'
import { motion } from 'framer-motion'

function Circle({
	delay,
	opacity,
	size,
}: {
	size: number
	delay: number
	opacity: string
}) {
	return (
		<motion.div
			variants={{
				active: {
					height: [`${size}px`, `${size + 10}px`, `${size}px`],
					transition: {
						delay,
						duration: 0.75,
						ease: 'easeInOut',
						repeat: Infinity,
						repeatDelay: 1.25,
					},
					width: [`${size}px`, `${size + 10}px`, `${size}px`],
				},
				idle: { height: `${size}px`, width: `${size}px` },
			}}
			style={{ '--opacity': opacity } as React.CSSProperties}
			className={clsx(
				'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full',
				'bg-[radial-gradient(circle,transparent_25%,color-mix(in_srgb,var(--color-blue-500)_var(--opacity),transparent)_100%)]',
				'ring-1 ring-blue-500/[8%] ring-inset'
			)}
		/>
	)
}

function Circles() {
	return (
		<div className='absolute inset-0'>
			<Circle size={528} opacity='3%' delay={0.45} />
			<Circle size={400} opacity='5%' delay={0.3} />
			<Circle size={272} opacity='5%' delay={0.15} />
			<Circle size={144} opacity='10%' delay={0} />
			<div className='absolute inset-0 bg-linear-to-t from-white to-35%' />
		</div>
	)
}

function MainLogo() {
	return (
		<div className='absolute top-32 left-44 flex size-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5'></div>
	)
}

function Logo({
	hover,
	left,
	src,
	top,
}: {
	src: string
	left: number
	top: number
	hover: { x: number; y: number; rotate: number; delay: number }
}) {
	return (
		<motion.img
			variants={{
				active: {
					rotate: [0, hover.rotate, 0],
					transition: {
						delay: hover.delay,
						duration: 0.75,
						ease: 'easeInOut',
						repeat: Infinity,
						repeatDelay: 1.25,
					},
					x: [0, hover.x, 0],
					y: [0, hover.y, 0],
				},
				idle: { rotate: 0, x: 0, y: 0 },
			}}
			alt=''
			src={src}
			style={{ left, top } as React.CSSProperties}
			className='absolute size-16 rounded-full bg-white shadow-sm ring-1 ring-black/5'
		/>
	)
}

export function LogoCluster() {
	return (
		<div aria-hidden='true' className='relative h-full overflow-hidden'>
			<Circles />
			<div className='absolute left-1/2 h-full w-[26rem] -translate-x-1/2'>
				<MainLogo />
				<Logo
					src='/logo-cluster/career-builder.svg'
					left={360}
					top={144}
					hover={{ delay: 0.38, rotate: 5, x: 6, y: 1 }}
				/>
				<Logo
					src='/logo-cluster/dribbble.svg'
					left={285}
					top={20}
					hover={{ delay: 0.3, rotate: 6, x: 4, y: -5 }}
				/>
				<Logo
					src='/logo-cluster/glassdoor.svg'
					left={255}
					top={210}
					hover={{ delay: 0.2, rotate: 7, x: 3, y: 5 }}
				/>
				<Logo
					src='/logo-cluster/linkedin.svg'
					left={144}
					top={40}
					hover={{ delay: 0.15, rotate: -6, x: -2, y: -5 }}
				/>
				<Logo
					src='/logo-cluster/upwork.svg'
					left={36}
					top={56}
					hover={{ delay: 0.35, rotate: -6, x: -4, y: -5 }}
				/>
				<Logo
					src='/logo-cluster/we-work-remotely.svg'
					left={96}
					top={176}
					hover={{ delay: 0.15, rotate: 3, x: -3, y: 5 }}
				/>
			</div>
		</div>
	)
}
