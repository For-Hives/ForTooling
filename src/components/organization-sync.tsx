// src/components/organization-sync.tsx
'use client'
import { useOrganization } from '@clerk/nextjs'
import { useRouter, useParams } from 'next/navigation'
import { useEffect } from 'react'

export function OrganizationSync() {
	const { organization } = useOrganization()
	const params = useParams()
	const router = useRouter()
	const orgId = params?.orgId as string | undefined

	useEffect(() => {
		// If there's an active organization and it doesn't match the URL, update the URL
		if (organization && orgId && organization.id !== orgId) {
			router.replace(`/org/${organization.id}`)
		}

		// If there's no active organization but we have an orgId in the URL, set it as active
		if (!organization && orgId) {
			// This would require additional logic to set the active organization
		}
	}, [organization, orgId, router])

	return null
}
