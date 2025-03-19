import type React from 'react'
import { Inter } from 'next/font/google'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/app/app-sidebar'
import { TopBar } from '@/components/app/top-bar'

const inter = Inter({ subsets: ['latin'] })

export default function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className={`${inter.className} h-full min-h-screen`}>
			<ThemeProvider>
				<SidebarProvider defaultOpen={true}>
					<AppSidebar />
					<div className='ml-20 min-h-screen'>
						<TopBar />
						<main className='min-h-[calc(100vh-4rem)] w-full overflow-auto bg-gray-100'>
							<div className='h-full w-full max-w-full p-4'>{children}</div>
						</main>
					</div>
				</SidebarProvider>
			</ThemeProvider>
		</div>
	)
}
