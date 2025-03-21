import type React from 'react'

import { AppSidebar } from '@/components/app/app-sidebar'
import { TopBar } from '@/components/app/top-bar'
import { SidebarProvider } from '@/components/ui/sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className={`h-full min-h-screen`}>
			<SidebarProvider defaultOpen={true}>
				<AppSidebar />
				<div className='ml-20 min-h-screen w-full'>
					<TopBar />
					<main className='min-h-[calc(100vh-4rem)] w-full overflow-auto bg-gray-100'>
						<div className='h-full w-full max-w-full p-4'>{children}</div>
					</main>
				</div>
			</SidebarProvider>
		</div>
	)
}
