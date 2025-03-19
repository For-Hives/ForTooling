import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'
import {
	Construction,
	Wrench,
	User,
	Building,
	Scan,
	ClipboardList,
} from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
	const quickLinks = [
		{
			color: 'bg-blue-100 text-blue-700',
			description: 'Gérer et suivre tous les équipements',
			href: '/app/equipments',
			icon: Wrench,
			title: 'Équipements',
		},
		{
			color: 'bg-amber-100 text-amber-700',
			description: 'Gérer les projets et emplacements',
			href: '/app/projects',
			icon: Construction,
			title: 'Projets',
		},
		{
			color: 'bg-green-100 text-green-700',
			description: 'Gérer les utilisateurs et permissions',
			href: '/app/users',
			icon: User,
			title: 'Utilisateurs',
		},
		{
			color: 'bg-purple-100 text-purple-700',
			description: 'Scanner et localiser des équipements',
			href: '/app/scan',
			icon: Scan,
			title: 'Scanner',
		},
		{
			color: 'bg-red-100 text-red-700',
			description: 'Rapports et inventaire complet',
			href: '/app/inventory',
			icon: ClipboardList,
			title: 'Inventaire',
		},
		{
			color: 'bg-indigo-100 text-indigo-700',
			description: 'Paramètres et configuration',
			href: '/app/organization',
			icon: Building,
			title: 'Organisation',
		},
	]

	return (
		<div className='w-full'>
			<h2 className='mb-4 text-2xl font-semibold text-gray-800'>
				Accès rapide
			</h2>
			<div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
				{quickLinks.map(link => (
					<Link href={link.href} key={link.title} className='group block'>
						<Card className='h-full transition-all hover:shadow-md'>
							<CardHeader className='pb-2'>
								<div
									className={`flex h-12 w-12 items-center justify-center rounded-lg ${link.color}`}
								>
									<link.icon className='h-6 w-6' />
								</div>
							</CardHeader>
							<CardContent>
								<CardTitle className='group-hover:text-primary text-lg transition-colors'>
									{link.title}
								</CardTitle>
								<CardDescription className='mt-1 text-sm'>
									{link.description}
								</CardDescription>
							</CardContent>
						</Card>
					</Link>
				))}
			</div>
		</div>
	)
}
