import { Button } from '@/components/ui/button'
import { Building, User, Info, CheckCircle2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

// Only require the properties we actually use
interface OrganizationData {
	imageUrl?: string
}

export function OrganizationStep({
	hasOrganization,
	organization,
}: {
	hasOrganization: boolean
	organization: OrganizationData
}) {
	const router = useRouter()

	return (
		<div className='space-y-4'>
			<h2 className='text-center text-xl font-semibold'>
				Configurez votre organisation
			</h2>
			<p className='text-muted-foreground text-center'>
				Vous devez créer ou rejoindre une organisation pour continuer. Cela
				permettra de gérer les équipements et utilisateurs de votre entreprise.
			</p>

			{hasOrganization ? (
				<div className='mt-6 flex flex-col items-center'>
					<div className='mb-4 rounded-full bg-green-50 p-2 text-green-700'>
						<CheckCircle2 className='h-8 w-8' />
					</div>
					<p className='font-medium text-green-700'>
						Organisation configurée avec succès!
					</p>
					<p className='text-muted-foreground mt-2 text-sm'>
						Vous pouvez continuer vers l&apos;étape suivante.
					</p>
					<div className='mt-8 flex items-center gap-6'>
						<Image
							src='/logo.png'
							alt='ForTooling Logo'
							width={75}
							height={75}
						/>
						{organization?.imageUrl && (
							<>
								<span className='text-lg font-semibold italic'>x</span>
								<Image
									src={organization.imageUrl || ''}
									alt='Organization Logo'
									width={75}
									height={75}
								/>
							</>
						)}
					</div>
				</div>
			) : (
				<>
					<div className='flex flex-col justify-center gap-4 pt-4 sm:flex-row'>
						<Button
							onClick={() => router.push('/organization-profile')}
							className='w-full sm:w-auto'
						>
							<Building className='mr-2 h-4 w-4' />
							Créer une organisation
						</Button>
						<Button
							variant='outline'
							onClick={() => router.push('/organizations')}
							className='w-full sm:w-auto'
						>
							<User className='mr-2 h-4 w-4' />
							Rejoindre une organisation
						</Button>
					</div>
					<div className='mt-6 border-t pt-4'>
						<div className='rounded-lg bg-amber-50 p-4'>
							<p className='flex items-center gap-2 font-medium text-amber-700'>
								<Info className='h-5 w-5' /> Note importante
							</p>
							<p className='mt-1 text-sm text-amber-600'>
								Vous devez créer ou rejoindre une organisation avant de pouvoir
								continuer. Cliquez sur l&apos;un des boutons ci-dessus, puis
								revenez à cette page.
							</p>
						</div>
					</div>
				</>
			)}
		</div>
	)
}
