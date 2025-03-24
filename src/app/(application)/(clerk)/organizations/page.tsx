import { OrganizationList } from '@clerk/nextjs'

export default function OrganizationsPage() {
	return (
		<div className='flex min-h-[calc(100vh-64px)] w-full items-center'>
			<div className='mx-auto max-w-7xl'>
				<OrganizationList
					hidePersonal
					afterSelectOrganizationUrl='/organization-profile/:slug'
				/>
			</div>
		</div>
	)
}
