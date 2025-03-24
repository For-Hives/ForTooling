'use client'

import { Container } from '@/components/app/container'
import { CreateOrganization } from '@clerk/nextjs'

export default function CreateOrganizationPage() {
	return (
		<Container>
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
		</Container>
	)
}
