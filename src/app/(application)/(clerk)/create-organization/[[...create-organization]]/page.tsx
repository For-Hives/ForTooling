'use client'

import { Container } from '@/components/app/container'
import { CreateOrganization } from '@clerk/nextjs'

export default function CreateOrganizationPage() {
	return (
		<Container>
			<CreateOrganization afterCreateOrganizationUrl='/app' />
		</Container>
	)
}
