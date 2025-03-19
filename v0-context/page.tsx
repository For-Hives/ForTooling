import Link from 'next/link'
import { Construction, Wrench, User, Building } from 'lucide-react'
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card'

export default function Home() {
	const quickLinks = [
		{
			title: 'Projects',
			description: 'Manage construction projects and sites',
			icon: Construction,
			href: '/projects',
			color: 'bg-blue-100 text-blue-700',
		},
		{
			title: 'Equipment',
			description: 'Track and manage all equipment',
			icon: Wrench,
			href: '/equipment',
			color: 'bg-amber-100 text-amber-700',
		},
		{
			title: 'Users',
			description: 'Manage users and permissions',
			icon: User,
			href: '/users',
			color: 'bg-green-100 text-green-700',
		},
		{
			title: 'Organization',
			description: 'Company settings and configuration',
			icon: Building,
			href: '/organization',
			color: 'bg-purple-100 text-purple-700',
		},
	]

	return (
		<div className='w-full'>
			<h2 className='mb-4 text-2xl font-semibold text-gray-800'>
				Quick Access
			</h2>
			<div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
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
