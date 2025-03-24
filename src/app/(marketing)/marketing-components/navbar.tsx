'use client'

import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import {
	Disclosure,
	DisclosureButton,
	DisclosurePanel,
} from '@headlessui/react'
import { Bars2Icon } from '@heroicons/react/24/solid'
import { motion } from 'framer-motion'

import { Link } from './link'
import { Logo } from './logo'
import { PlusGrid, PlusGridItem, PlusGridRow } from './plus-grid'

const links = [
	{ href: '/pricing', label: 'Tarifs' },
	{ href: '/sign-in', label: 'Se connecter' },
]

function DesktopNav() {
	return (
		<nav className='relative hidden lg:flex'>
			{links.map(({ href, label }) => (
				<PlusGridItem key={href} className='relative flex'>
					{href === '/sign-in' ? (
						<>
							<SignedIn>
								<div className='flex items-center px-4 py-3 text-base font-medium text-gray-950 bg-blend-multiply data-hover:bg-black/[2.5%]'>
									<UserButton />
									<Link
										href={'/app'}
										className='ml-2 flex items-start gap-1 text-sm font-normal'
									>
										<span className='underline'>
											{`Aller à l'application `}
										</span>
										<svg
											xmlns='http://www.w3.org/2000/svg'
											viewBox='0 0 20 20'
											fill='currentColor'
											aria-hidden='true'
											data-slot='icon'
											className='size-3.5'
										>
											<path
												fillRule='evenodd'
												d='M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z'
												clipRule='evenodd'
											></path>
										</svg>
									</Link>
								</div>
							</SignedIn>
							<SignedOut>
								<Link
									href={href}
									className='flex items-center px-4 py-3 text-base font-medium text-gray-950 bg-blend-multiply data-hover:bg-black/[2.5%]'
								>
									{label}
								</Link>
							</SignedOut>
						</>
					) : (
						<Link
							href={href}
							className='flex items-center px-4 py-3 text-base font-medium text-gray-950 bg-blend-multiply data-hover:bg-black/[2.5%]'
						>
							{label}
						</Link>
					)}
				</PlusGridItem>
			))}
		</nav>
	)
}

function MobileNavButton() {
	return (
		<DisclosureButton
			className='flex size-12 items-center justify-center self-center rounded-lg data-hover:bg-black/5 lg:hidden'
			aria-label='Open main menu'
		>
			<Bars2Icon className='size-6' />
		</DisclosureButton>
	)
}

function MobileNav() {
	return (
		<DisclosurePanel className='lg:hidden'>
			<div className='flex flex-col gap-6 py-4'>
				{links.map(({ href, label }, linkIndex) => (
					<motion.div
						initial={{ opacity: 0, rotateX: -90 }}
						animate={{ opacity: 1, rotateX: 0 }}
						transition={{
							duration: 0.15,
							ease: 'easeInOut',
							rotateX: { delay: linkIndex * 0.1, duration: 0.3 },
						}}
						key={href}
					>
						<Link href={href} className='text-base font-medium text-gray-950'>
							{label}
						</Link>
					</motion.div>
				))}
			</div>
			<div className='absolute left-1/2 w-screen -translate-x-1/2'>
				<div className='absolute inset-x-0 top-0 border-t border-black/5' />
				<div className='absolute inset-x-0 top-2 border-t border-black/5' />
			</div>
		</DisclosurePanel>
	)
}

export function Navbar() {
	return (
		<Disclosure as='header' className='pt-12 sm:pt-16'>
			<PlusGrid>
				<PlusGridRow className='relative flex justify-between'>
					<div className='relative flex gap-6'>
						<PlusGridItem className='py-3'>
							<Link href='/' title='Home'>
								<Logo className='h-14 w-14' />
							</Link>
						</PlusGridItem>
					</div>
					<DesktopNav />
					<MobileNavButton />
				</PlusGridRow>
			</PlusGrid>
			<MobileNav />
		</Disclosure>
	)
}
