import Link from 'next/link'
import {
	Construction,
	Wrench,
	User,
	Building,
	Scan,
	ClipboardList,
} from 'lucide-react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

export default function Dashboard() {
	const quickLinks = [
		{
			title: 'Équipements',
			description: 'Gérer et suivre tous les équipements',
			icon: Wrench,
			href: '/app/equipments',
			color: 'bg-blue-100 text-blue-700',
		},
		{
			title: 'Projets',
			description: 'Gérer les projets et emplacements',
			icon: Construction,
			href: '/app/projects',
			color: 'bg-amber-100 text-amber-700',
		},
		{
			title: 'Utilisateurs',
			description: 'Gérer les utilisateurs et permissions',
			icon: User,
			href: '/app/users',
			color: 'bg-green-100 text-green-700',
		},
		{
			title: 'Scanner',
			description: 'Scanner et localiser des équipements',
			icon: Scan,
			href: '/app/scan',
			color: 'bg-purple-100 text-purple-700',
		},
		{
			title: 'Inventaire',
			description: 'Rapports et inventaire complet',
			icon: ClipboardList,
			href: '/app/inventory',
			color: 'bg-red-100 text-red-700',
		},
		{
			title: 'Organisation',
			description: 'Paramètres et configuration',
			icon: Building,
			href: '/app/organization',
			color: 'bg-indigo-100 text-indigo-700',
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
