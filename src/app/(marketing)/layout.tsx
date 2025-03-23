import '@/app/globals.css'

import type { Metadata } from 'next'

import { ClerkProvider } from '@clerk/nextjs'
export const metadata: Metadata = {
	title: {
		default: 'Radiant - Close every deal',
		template: '%s - Radiant',
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<ClerkProvider>
			<html lang='en'>
				<head>
					<link
						rel='stylesheet'
						href='https://api.fontshare.com/css?f%5B%5D=switzer@400,500,600,700&amp;display=swap'
					/>
				</head>
				<body className='text-gray-950 antialiased'>{children}</body>
			</html>
		</ClerkProvider>
	)
}
