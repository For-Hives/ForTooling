'use client'
import { usePathname } from 'next/navigation'
import { Search } from 'lucide-react'

import { Input } from '@/components/ui/input'

export function TopBar() {
	const pathname = usePathname()

	// Function to generate page title based on pathname
	const getPageTitle = () => {
		if (pathname === '/') return 'Dashboard'

		const paths = pathname.split('/').filter(Boolean)
		if (paths.length === 0) return 'Dashboard'

		const lastPath = paths[paths.length - 1]
		return lastPath.charAt(0).toUpperCase() + lastPath.slice(1)
	}

	const pageTitle = getPageTitle()

	return (
		<header className='flex h-16 w-full shrink-0 items-center justify-between bg-[#0f2942] px-6 text-white'>
			<div className='flex flex-1 items-center gap-2'>
				<div className='rounded-lg bg-white px-4 py-2 text-gray-900 shadow-sm'>
					<h1 className='text-xl font-semibold'>{pageTitle}</h1>
				</div>
			</div>
			<div className='relative w-64'>
				<Search className='absolute top-1/2 left-2 h-4 w-4 -translate-y-1/2 text-gray-400' />
				<Input
					placeholder='Search...'
					className='focus-visible:ring-primary h-9 w-full rounded-md border-white/20 bg-white/10 pl-8 text-white placeholder:text-white/50'
				/>
			</div>
		</header>
	)
}
