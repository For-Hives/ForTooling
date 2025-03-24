import { OrganizationProfile } from '@clerk/nextjs'

export default function OrganizationProfilePage() {
	return (
		<div className='flex min-h-[calc(100vh-64px)] w-full items-center'>
			<div className='mx-auto max-w-7xl'>
				<OrganizationProfile />
			</div>
		</div>
	)
}
