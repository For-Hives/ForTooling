import { ClipboardList, Construction, Scan, Wrench } from 'lucide-react'

export function FeaturesStep() {
	return (
		<div className='flex w-full flex-col items-center justify-center space-y-4'>
			<h2 className='text-center text-xl font-semibold'>
				Découvrez nos fonctionnalités clés
			</h2>
			<div className='grid h-full w-full grid-cols-1 items-center gap-4 py-8 md:grid-cols-2'>
				<div className='rounded-lg border bg-white p-4 transition-shadow duration-200 hover:shadow-md'>
					<div className='mb-2 flex items-center gap-2'>
						<Wrench className='h-5 w-5 text-blue-500' />
						<h3 className='font-medium'>Suivi d&apos;équipements</h3>
					</div>
					<p className='text-muted-foreground text-sm'>
						Localisez et suivez tous vos équipements en temps réel avec la
						technologie NFC/QR
					</p>
				</div>
				<div className='rounded-lg border bg-white p-4 transition-shadow duration-200 hover:shadow-md'>
					<div className='mb-2 flex items-center gap-2'>
						<Construction className='h-5 w-5 text-amber-500' />
						<h3 className='font-medium'>Attribution aux projets</h3>
					</div>
					<p className='text-muted-foreground text-sm'>
						Affectez facilement des équipements aux utilisateurs et aux projets
					</p>
				</div>
				<div className='rounded-lg border bg-white p-4 transition-shadow duration-200 hover:shadow-md'>
					<div className='mb-2 flex items-center gap-2'>
						<Scan className='h-5 w-5 text-purple-500' />
						<h3 className='font-medium'>Scan rapide</h3>
					</div>
					<p className='text-muted-foreground text-sm'>
						Scannez les équipements en quelques secondes pour obtenir leur
						statut et les gérer
					</p>
				</div>
				<div className='rounded-lg border bg-white p-4 transition-shadow duration-200 hover:shadow-md'>
					<div className='mb-2 flex items-center gap-2'>
						<ClipboardList className='h-5 w-5 text-red-500' />
						<h3 className='font-medium'>Rapports détaillés</h3>
					</div>
					<p className='text-muted-foreground text-sm'>
						Générez des analyses détaillées sur l&apos;utilisation de votre parc
						matériel
					</p>
				</div>
			</div>
		</div>
	)
}
