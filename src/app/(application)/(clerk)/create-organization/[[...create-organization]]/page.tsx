'use client'

import { CreateOrganization } from '@clerk/nextjs'

export default function CreateOrganizationPage() {
	return (
		<div className='flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center bg-gray-50'>
			<div className='mx-auto max-w-7xl'>
				<CreateOrganization
					appearance={{
						elements: {
							card: {
								borderRadius: '0.5rem',
								boxShadow:
									'0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
							},
							rootBox: {
								maxWidth: '100%',
								width: '100%',
							},
						},
					}}
					afterCreateOrganizationUrl='/app'
				/>
			</div>
		</div>
	)
}
