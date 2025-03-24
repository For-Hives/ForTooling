export function Container({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex min-h-[calc(100vh-16rem)] flex-col items-center justify-center bg-gray-50'>
			<div className='mx-auto max-w-7xl'>{children}</div>
		</div>
	)
}
