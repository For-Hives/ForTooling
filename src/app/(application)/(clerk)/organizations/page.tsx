import { Container } from '@/components/app/container'
import { OrganizationList } from '@clerk/nextjs'

export default function OrganizationsPage() {
	return (
		<Container>
			<OrganizationList
				hidePersonal
				afterSelectOrganizationUrl='/organization-profile/:slug'
			/>
		</Container>
	)
}
