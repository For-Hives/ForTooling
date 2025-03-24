import { CardDescription, CardTitle } from '@/components/ui/card'
import SpotlightCard from '@/components/ui/spotlight-card'
import { auth, currentUser } from '@clerk/nextjs/server'
import {
	Construction,
	Wrench,
	User,
	Building,
	Scan,
	ClipboardList,
} from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'

export default async function Dashboard() {
	const { orgId, orgRole, userId } = await auth()

	if (!userId || !orgId) {
		redirect('/onboarding')
	}

	const user = await currentUser()

	const quickLinks = [
		{
			bgColor: 'bg-blue-100',
			color: 'text-blue-600',
			description: 'Gérer et suivre tous les équipements et outils',
			href: '/app/equipments',
			icon: Wrench,
			spotlightColor:
				'rgba(59, 130, 246, 0.25)' as `rgba(${number}, ${number}, ${number}, ${number})`,
			title: 'Équipements',
		},
		{
			bgColor: 'bg-amber-100',
			color: 'text-amber-600',
			description: 'Gérer les projets, chantiers et emplacements',
			href: '/app/projects',
			icon: Construction,
			spotlightColor:
				'rgba(245, 158, 11, 0.25)' as `rgba(${number}, ${number}, ${number}, ${number})`,
			title: 'Projets',
		},
		{
			bgColor: 'bg-green-100',
			color: 'text-green-600',
			description: 'Gérer les utilisateurs et permissions',
			href: '/app/users',
			icon: User,
			spotlightColor:
				'rgba(34, 197, 94, 0.25)' as `rgba(${number}, ${number}, ${number}, ${number})`,
			title: 'Utilisateurs',
		},
		{
			bgColor: 'bg-purple-100',
			color: 'text-purple-600',
			description: 'Scanner et localiser des équipements',
			href: '/app/scan',
			icon: Scan,
			spotlightColor:
				'rgba(168, 85, 247, 0.25)' as `rgba(${number}, ${number}, ${number}, ${number})`,
			title: 'Scanner',
		},
		{
			bgColor: 'bg-red-100',
			color: 'text-red-600',
			description: 'Rapports et inventaire complet',
			href: '/app/inventory',
			icon: ClipboardList,
			spotlightColor:
				'rgba(239, 68, 68, 0.25)' as `rgba(${number}, ${number}, ${number}, ${number})`,
			title: 'Inventaire',
		},
		{
			bgColor: 'bg-indigo-100',
			color: 'text-indigo-600',
			description: 'Paramètres et configuration',
			href: '/organizations',
			icon: Building,
			spotlightColor:
				'rgba(99, 102, 241, 0.25)' as `rgba(${number}, ${number}, ${number}, ${number})`,
			title: 'Organisation',
		},
	]

	return (
		<div className='w-full'>
			<h2 className='mb-4 text-2xl font-semibold text-gray-800'>
				Bonjour {user?.firstName} !
			</h2>
			<div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
				{quickLinks.map(link => (
					<Link href={link.href} key={link.title} className='group block'>
						<SpotlightCard
							className='h-full bg-white transition-all hover:shadow-md'
							spotlightColor={link.spotlightColor}
						>
							<div className='flex flex-col space-y-4'>
								<div
									className={`flex h-12 w-12 items-center justify-center rounded-lg ${link.bgColor}`}
								>
									<link.icon className={`h-6 w-6 ${link.color}`} />
								</div>

								<div>
									<CardTitle className='group-hover:text-primary text-lg text-slate-900 transition-colors'>
										{link.title}
									</CardTitle>
									<CardDescription className='mt-1 text-sm text-slate-600'>
										{link.description}
									</CardDescription>
								</div>
							</div>
						</SpotlightCard>
					</Link>
				))}
			</div>
		</div>
	)
}
