import type { Metadata } from 'next'

import { BentoCard } from '@/app/(marketing)/components/bento-card'
import { Button } from '@/app/(marketing)/components/button'
import { Container } from '@/app/(marketing)/components/container'
import { Footer } from '@/app/(marketing)/components/footer'
import { Gradient } from '@/app/(marketing)/components/gradient'
import { Keyboard } from '@/app/(marketing)/components/keyboard'
import { Logo } from '@/app/(marketing)/components/logo'
import { Map } from '@/app/(marketing)/components/map'
import { Navbar } from '@/app/(marketing)/components/navbar'
import { Heading, Subheading } from '@/app/(marketing)/components/text'
import Image from 'next/image'

import { PricingCards } from './pricing/page'

export const metadata: Metadata = {
	description:
		"ForTooling aide les entreprises BTP à suivre, attribuer et maintenir leur parc d'équipements via une interface simple et des QR codes.",
}

function Hero() {
	return (
		<div className='relative'>
			<Gradient className='absolute inset-2 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset' />
			<Container className='relative'>
				<Navbar />
				<div className='pt-16 pb-24 sm:pt-24 sm:pb-32 md:pt-32 md:pb-48'>
					<h1 className='font-display text-6xl/[0.9] font-medium tracking-tight text-balance text-gray-950 sm:text-8xl/[0.8] md:text-9xl/[0.8]'>
						ForTooling
					</h1>
					<p className='mt-8 max-w-lg text-xl/7 font-medium text-gray-950/75 sm:text-2xl/8'>
						{`Suivez votre matériel BTP sans effort et sans vous ruiner. Solution
						complète de suivi d'équipements par QR code à prix imbattable.`}
					</p>
					<div className='mt-12 flex flex-col gap-x-6 gap-y-4 sm:flex-row'>
						<Button href='#contact'>Nous contacter</Button>
						{/* 
							TODO: Ajouter bouton "Essai gratuit" quand disponible 
							<Button variant='secondary' href='/signup'>Essai gratuit</Button>
						*/}

						{/*
							TODO: Ajouter bouton de connexion Clerk quand disponible
							<Button variant='secondary' href='/signin'>Connexion</Button>
						*/}
					</div>
				</div>
			</Container>
		</div>
	)
}

function FeatureSection() {
	return (
		<div className='overflow-hidden'>
			<Container className='pb-24'>
				<Heading as='h2' className='max-w-3xl'>
					{`Gestion simplifiée de vos équipements BTP`}
				</Heading>
				<div className='mt-8 space-y-6 text-xl text-gray-700'>
					<p>
						ForTooling est une solution SaaS qui permet aux entreprises du BTP
						de:
					</p>
					<ul className='list-disc space-y-3 pl-6'>
						<li>{`Suivre la localisation de chaque équipement par QR code`}</li>
						<li>
							{`Attribuer facilement le matériel aux employés ou aux chantiers`}
						</li>
						<li>{`Réduire significativement les pertes d'équipements`}</li>
						<li>{`Simplifier la gestion quotidienne de votre parc matériel`}</li>
					</ul>
					<p>{`Le tout à un prix défiant toute concurrence.`}</p>
				</div>

				{/* 
					TODO: Ajouter des captures d'écran réelles quand disponibles
					<Screenshot
						width={1216}
						height={768}
						src='/screenshots/app.png'
						className='mt-16 h-[36rem] sm:h-auto sm:w-[76rem]'
					/>
				*/}
			</Container>
		</div>
	)
}

function ConstructionNotice() {
	return (
		<div className='mx-2 mt-2 rounded-4xl bg-gray-900 py-24'>
			<Container>
				<Subheading dark>Lancement imminent</Subheading>
				<Heading as='h3' dark className='mt-2 max-w-3xl'>
					Notre plateforme sera bientôt disponible.
				</Heading>

				<div className='mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-3'>
					<BentoCard
						dark
						eyebrow='Programme pionnier'
						title='Rejoignez nos premiers utilisateurs'
						description="Bénéficiez de 50% de réduction la première année et d'un accompagnement personnalisé en rejoignant notre programme Pionnier."
						graphic={<Logo />}
						className='lg:col-span-1'
					/>

					<BentoCard
						dark
						eyebrow='En construction'
						title="L'équipe ForTooling travaille d'arrache-pied"
						description='Notre équipe met les bouchées doubles pour vous livrer une solution clé en main adaptée aux besoins réels du terrain.'
						graphic={<Keyboard highlighted={['F', 'T']} />}
						className='lg:col-span-1'
					/>

					<BentoCard
						dark
						eyebrow='Déploiement'
						title='Prêt en un temps record'
						description='La solution sera déployée sur vos chantiers en 48h seulement, sans perturber votre activité quotidienne.'
						graphic={<Map />}
						className='lg:col-span-1'
					/>
				</div>
			</Container>
		</div>
	)
}

export default function Home() {
	return (
		<div className='overflow-hidden'>
			<Hero />
			<main>
				<div className='bg-linear-to-b from-white from-50% to-gray-100 py-16'>
					<FeatureSection />
					<ConstructionNotice />
					<PricingCards />
					{/*
						TODO: Ajouter sections quand contenu disponible
						- Problème/Solution 
						- Comment ça marche (3 étapes)
						- Avantages vs concurrence
						- Témoignages
					*/}
				</div>
			</main>
			{/*
				TODO: Remplacer par des vrais témoignages quand disponibles
				<Testimonials />
			*/}
			<Footer />
		</div>
	)
}
