import type { Metadata } from 'next'

import { Button } from '@/app/(marketing)/components/button'
import { Container } from '@/app/(marketing)/components/container'
import { Footer } from '@/app/(marketing)/components/footer'
import {
	Gradient,
	GradientBackground,
} from '@/app/(marketing)/components/gradient'
import { Link } from '@/app/(marketing)/components/link'
import { Navbar } from '@/app/(marketing)/components/navbar'
import { Heading, Lead, Subheading } from '@/app/(marketing)/components/text'
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import {
	CheckIcon,
	ChevronUpDownIcon,
	MinusIcon,
} from '@heroicons/react/16/solid'

export const metadata: Metadata = {
	description:
		"Gérez efficacement votre parc d'équipements avec notre plateforme SaaS. Suivi en temps réel, gestion des attributions, et analyse avancée.",
	title: 'Tarification',
}

const tiers = [
	{
		description:
			"Idéal pour les petites entreprises débutant avec la gestion d'équipements.",
		features: [
			{ name: 'Utilisateurs', section: 'Fonctionnalités', value: 5 },
			{ name: 'Équipements suivis', section: 'Fonctionnalités', value: 50 },
			{ name: 'Étiquettes NFC/QR', section: 'Fonctionnalités', value: true },
			{ name: 'Projets/Emplacements', section: 'Fonctionnalités', value: 10 },
			{
				name: "Catégories d'équipements",
				section: 'Fonctionnalités',
				value: 'Standard',
			},
			{
				name: 'Historique des mouvements',
				section: 'Analyses',
				value: '30 jours',
			},
			{ name: 'Dashboard de base', section: 'Analyses', value: true },
			{ name: 'Rapports personnalisés', section: 'Analyses', value: false },
			{ name: 'Analyses prédictives', section: 'Analyses', value: false },
			{ name: 'Support par email', section: 'Support', value: true },
			{ name: 'Support téléphonique', section: 'Support', value: false },
			{
				name: 'Gestionnaire de compte dédié',
				section: 'Support',
				value: false,
			},
		],
		highlights: [
			{ description: "Jusqu'à 5 utilisateurs actifs" },
			{ description: 'Suivi de 50 équipements' },
			{ description: 'Étiquettes NFC/QR pour le suivi' },
			{ description: 'Analyses avancées', disabled: true },
			{ description: 'API personnalisée', disabled: true },
		],
		href: '#',
		name: 'Starter' as const,
		priceMonthly: 99,
		slug: 'starter',
	},
	{
		description:
			'Pour les équipes en croissance nécessitant des fonctionnalités avancées.',
		features: [
			{ name: 'Utilisateurs', section: 'Fonctionnalités', value: 20 },
			{ name: 'Équipements suivis', section: 'Fonctionnalités', value: 200 },
			{ name: 'Étiquettes NFC/QR', section: 'Fonctionnalités', value: true },
			{
				name: 'Projets/Emplacements',
				section: 'Fonctionnalités',
				value: 'Illimité',
			},
			{
				name: "Catégories d'équipements",
				section: 'Fonctionnalités',
				value: 'Avancé',
			},
			{ name: 'Historique des mouvements', section: 'Analyses', value: '1 an' },
			{ name: 'Dashboard de base', section: 'Analyses', value: true },
			{ name: 'Rapports personnalisés', section: 'Analyses', value: true },
			{ name: 'Analyses prédictives', section: 'Analyses', value: false },
			{ name: 'Support par email', section: 'Support', value: true },
			{ name: 'Support téléphonique', section: 'Support', value: true },
			{
				name: 'Gestionnaire de compte dédié',
				section: 'Support',
				value: false,
			},
		],
		highlights: [
			{ description: "Jusqu'à 20 utilisateurs actifs" },
			{ description: 'Suivi de 200 équipements' },
			{ description: 'Points de scan automatisés' },
			{ description: "Workflows d'approbation configurables" },
			{ description: 'Rapports et analyses avancés' },
		],
		href: '#',
		name: 'Growth' as const,
		priceMonthly: 199,
		slug: 'growth',
	},
	{
		description:
			"Solution complète pour les entreprises avec un parc d'équipements important.",
		features: [
			{ name: 'Utilisateurs', section: 'Fonctionnalités', value: 'Illimité' },
			{
				name: 'Équipements suivis',
				section: 'Fonctionnalités',
				value: 'Illimité',
			},
			{ name: 'Étiquettes NFC/QR', section: 'Fonctionnalités', value: true },
			{
				name: 'Projets/Emplacements',
				section: 'Fonctionnalités',
				value: 'Illimité',
			},
			{
				name: "Catégories d'équipements",
				section: 'Fonctionnalités',
				value: 'Personnalisé',
			},
			{
				name: 'Historique des mouvements',
				section: 'Analyses',
				value: 'Complet',
			},
			{ name: 'Dashboard de base', section: 'Analyses', value: true },
			{ name: 'Rapports personnalisés', section: 'Analyses', value: true },
			{ name: 'Analyses prédictives', section: 'Analyses', value: true },
			{ name: 'Support par email', section: 'Support', value: true },
			{ name: 'Support téléphonique', section: 'Support', value: true },
			{ name: 'Gestionnaire de compte dédié', section: 'Support', value: true },
		],
		highlights: [
			{ description: 'Utilisateurs illimités' },
			{ description: 'Équipements illimités' },
			{ description: 'API complète et intégration de systèmes tiers' },
			{ description: 'Analyses prédictives pour planification' },
			{ description: 'Support et configuration personnalisés' },
		],
		href: '#',
		name: 'Enterprise' as const,
		priceMonthly: 399,
		slug: 'enterprise',
	},
]

function Header() {
	return (
		<Container className='mt-16'>
			<Heading as='h1'>
				{`Une tarification adaptée à la taille de votre parc.`}
			</Heading>
			<Lead className='mt-6 max-w-3xl'>
				{`Des entreprises de tous secteurs optimisent la gestion de leurs
				équipements grâce à notre plateforme. Commencez dès aujourd'hui et
				améliorez la traçabilité et l'efficacité de votre parc matériel.`}
			</Lead>
		</Container>
	)
}

function PricingCards() {
	return (
		<div className='relative py-24'>
			<Gradient className='absolute inset-x-2 top-48 bottom-0 rounded-4xl ring-1 ring-black/5 ring-inset' />
			<Container className='relative'>
				<div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
					{tiers.map((tier, tierIndex) => (
						<PricingCard key={tierIndex} tier={tier} />
					))}
				</div>
			</Container>
		</div>
	)
}

function PricingCard({ tier }: { tier: (typeof tiers)[number] }) {
	return (
		<div className='-m-2 grid grid-cols-1 rounded-4xl shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 ring-black/5 max-lg:mx-auto max-lg:w-full max-lg:max-w-md'>
			<div className='grid grid-cols-1 rounded-4xl p-2 shadow-md shadow-black/5'>
				<div className='rounded-3xl bg-white p-10 pb-9 shadow-2xl ring-1 ring-black/5'>
					<Subheading>{tier.name}</Subheading>
					<p className='mt-2 text-sm/6 text-gray-950/75'>{tier.description}</p>
					<div className='mt-8 flex items-center gap-4'>
						<div className='text-5xl font-medium text-gray-950'>
							{tier.priceMonthly}€
						</div>
						<div className='flex h-full flex-col items-end justify-end text-sm/5 text-gray-950/75'>
							<p className='mt-5'>/mois</p>
						</div>
					</div>
					<div className='mt-8'>
						<Button href={tier.href}>Start a free trial</Button>
					</div>
					<div className='mt-8'>
						<h3 className='text-sm/6 font-medium text-gray-950'>
							Start selling with:
						</h3>
						<ul className='mt-3 space-y-3'>
							{tier.highlights.map((props, featureIndex) => (
								<FeatureItem key={featureIndex} {...props} />
							))}
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}

function PricingTable({
	selectedTier,
}: {
	selectedTier: (typeof tiers)[number]
}) {
	return (
		<Container className='py-24'>
			<table className='w-full text-left'>
				<caption className='sr-only'>Pricing plan comparison</caption>
				<colgroup>
					<col className='w-3/5 sm:w-2/5' />
					<col
						data-selected={selectedTier === tiers[0] ? true : undefined}
						className='w-2/5 data-selected:table-column max-sm:hidden sm:w-1/5'
					/>
					<col
						data-selected={selectedTier === tiers[1] ? true : undefined}
						className='w-2/5 data-selected:table-column max-sm:hidden sm:w-1/5'
					/>
					<col
						data-selected={selectedTier === tiers[2] ? true : undefined}
						className='w-2/5 data-selected:table-column max-sm:hidden sm:w-1/5'
					/>
				</colgroup>
				<thead>
					<tr className='max-sm:hidden'>
						<td className='p-0' />
						{tiers.map(tier => (
							<th
								key={tier.slug}
								scope='col'
								data-selected={selectedTier === tier ? true : undefined}
								className='p-0 data-selected:table-cell max-sm:hidden'
							>
								<Subheading as='div'>{tier.name}</Subheading>
							</th>
						))}
					</tr>
					<tr className='sm:hidden'>
						<td className='p-0'>
							<div className='relative inline-block'>
								<Menu>
									<MenuButton className='flex items-center justify-between gap-2 font-medium'>
										{selectedTier.name}
										<ChevronUpDownIcon className='size-4 fill-gray-900' />
									</MenuButton>
									<MenuItems
										anchor='bottom start'
										className='min-w-(--button-width) rounded-lg bg-white p-1 shadow-lg ring-1 ring-gray-200 [--anchor-gap:6px] [--anchor-offset:-4px] [--anchor-padding:10px]'
									>
										{tiers.map(tier => (
											<MenuItem key={tier.slug}>
												<Link
													scroll={false}
													href={`/pricing?tier=${tier.slug}`}
													data-selected={
														tier === selectedTier ? true : undefined
													}
													className='group flex items-center gap-2 rounded-md px-2 py-1 data-focus:bg-gray-200'
												>
													{tier.name}
													<CheckIcon className='hidden size-4 group-data-selected:block' />
												</Link>
											</MenuItem>
										))}
									</MenuItems>
								</Menu>
								<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center'>
									<ChevronUpDownIcon className='size-4 fill-gray-900' />
								</div>
							</div>
						</td>
						<td colSpan={3} className='p-0 text-right'>
							<Button variant='outline' href={selectedTier.href}>
								Get started
							</Button>
						</td>
					</tr>
					<tr className='max-sm:hidden'>
						<th className='p-0' scope='row'>
							<span className='sr-only'>Get started</span>
						</th>
						{tiers.map(tier => (
							<td
								key={tier.slug}
								data-selected={selectedTier === tier ? true : undefined}
								className='px-0 pt-4 pb-0 data-selected:table-cell max-sm:hidden'
							>
								<Button variant='outline' href={tier.href}>
									Get started
								</Button>
							</td>
						))}
					</tr>
				</thead>
				{[...new Set(tiers[0].features.map(({ section }) => section))].map(
					section => (
						<tbody key={section} className='group'>
							<tr>
								<th
									scope='colgroup'
									colSpan={4}
									className='px-0 pt-10 pb-0 group-first-of-type:pt-5'
								>
									<div className='-mx-4 rounded-lg bg-gray-50 px-4 py-3 text-sm/6 font-semibold'>
										{section}
									</div>
								</th>
							</tr>
							{tiers[0].features
								.filter(feature => feature.section === section)
								.map(({ name }) => (
									<tr
										key={name}
										className='border-b border-gray-100 last:border-none'
									>
										<th
											scope='row'
											className='px-0 py-4 text-sm/6 font-normal text-gray-600'
										>
											{name}
										</th>
										{tiers.map(tier => {
											const value = tier.features.find(
												feature =>
													feature.section === section && feature.name === name
											)?.value

											return (
												<td
													key={tier.slug}
													data-selected={
														selectedTier === tier ? true : undefined
													}
													className='p-4 data-selected:table-cell max-sm:hidden'
												>
													{value === true ? (
														<>
															<CheckIcon className='size-4 fill-green-600' />
															<span className='sr-only'>
																Included in {tier.name}
															</span>
														</>
													) : value === false || value === undefined ? (
														<>
															<MinusIcon className='size-4 fill-gray-400' />
															<span className='sr-only'>
																Not included in {tier.name}
															</span>
														</>
													) : (
														<div className='text-sm/6'>{value}</div>
													)}
												</td>
											)
										})}
									</tr>
								))}
						</tbody>
					)
				)}
			</table>
		</Container>
	)
}

function FeatureItem({
	description,
	disabled = false,
}: {
	description: string
	disabled?: boolean
}) {
	return (
		<li
			data-disabled={disabled ? true : undefined}
			className='flex items-start gap-4 text-sm/6 text-gray-950/75 data-disabled:text-gray-950/25'
		>
			<span className='inline-flex h-6 items-center'>
				<PlusIcon className='size-[0.9375rem] shrink-0 fill-gray-950/25' />
			</span>
			{disabled && <span className='sr-only'>Not included:</span>}
			{description}
		</li>
	)
}

function PlusIcon(props: React.ComponentPropsWithoutRef<'svg'>) {
	return (
		<svg viewBox='0 0 15 15' aria-hidden='true' {...props}>
			<path clipRule='evenodd' d='M8 0H7v7H0v1h7v7h1V8h7V7H8V0z' />
		</svg>
	)
}

function Testimonial() {
	return (
		<div className='mx-2 my-24 rounded-4xl bg-gray-900 bg-[url(/dot-texture.svg)] pt-72 pb-24 lg:pt-36'>
			<Container>
				<div className='grid grid-cols-1 lg:grid-cols-[384px_1fr_1fr]'>
					<div className='-mt-96 lg:-mt-52'>
						<div className='-m-2 rounded-4xl bg-white/15 shadow-[inset_0_0_2px_1px_#ffffff4d] ring-1 ring-black/5 max-lg:mx-auto max-lg:max-w-xs'>
							<div className='rounded-4xl p-2 shadow-md shadow-black/5'>
								<div className='overflow-hidden rounded-3xl shadow-2xl outline outline-1 -outline-offset-1 outline-black/10'>
									<img
										alt=''
										src='/testimonials/client-testimonial.jpg'
										className='aspect-3/4 w-full object-cover'
									/>
								</div>
							</div>
						</div>
					</div>
					<div className='flex max-lg:mt-16 lg:col-span-2 lg:px-16'>
						<figure className='mx-auto flex max-w-xl flex-col gap-16 max-lg:text-center'>
							<blockquote>
								<p
									className={`relative text-3xl tracking-tight text-white before:absolute before:-translate-x-full before:content-['"'] after:absolute after:content-['"'] lg:text-4xl`}
								>
									{`Grâce à cette plateforme, nous avons considérablement réduit
									les pertes d'équipements et optimisé leur utilisation. Le
									suivi par NFC/QR a révolutionné notre gestion logistique.`}
								</p>
							</blockquote>
							<figcaption className='mt-auto'>
								<p className='text-sm/6 font-medium text-white'>Marie Dupont</p>
								<p className='text-sm/6 font-medium'>
									<span className='bg-linear-to-r from-[#fff1be] from-28% via-[#ee87cb] via-70% to-[#b060ff] bg-clip-text text-transparent'>
										Directrice Opérations, BTP Construct
									</span>
								</p>
							</figcaption>
						</figure>
					</div>
				</div>
			</Container>
		</div>
	)
}

function FrequentlyAskedQuestions() {
	return (
		<Container>
			<section id='faqs' className='scroll-mt-8'>
				<Subheading className='text-center'>{`Questions fréquentes`}</Subheading>
				<Heading as='div' className='mt-2 text-center'>
					{`Vos questions, nos réponses.`}
				</Heading>
				<div className='mx-auto mt-16 mb-32 max-w-xl space-y-12'>
					<dl>
						<dt className='text-sm font-semibold'>
							{`Quelles mesures sont en place pour assurer la sécurité de nos
							données?`}
						</dt>
						<dd className='mt-4 text-sm/6 text-gray-600'>
							{`La sécurité des données est notre priorité absolue. Nous utilisons
							des technologies de chiffrement avancées, hébergeons vos données
							dans des centres de données sécurisés, et réalisons régulièrement
							des audits de sécurité. Notre infrastructure est conforme aux
							normes RGPD et aux standards de l'industrie.`}
						</dd>
					</dl>
					<dl>
						<dt className='text-sm font-semibold'>
							Existe-t-il une application mobile pour votre plateforme?
						</dt>
						<dd className='mt-4 text-sm/6 text-gray-600'>
							{`Oui, notre plateforme est disponible sous forme d'application
							Progressive Web App (PWA) qui fonctionne sur tous les appareils
							modernes. Elle permet de scanner les codes NFC/QR, de consulter et
							modifier les informations des équipements, et de gérer les
							affectations directement depuis le terrain.`}
						</dd>
					</dl>
					<dl>
						<dt className='text-sm font-semibold'>
							Puis-je personnaliser les workflows selon les processus de mon
							entreprise?
						</dt>
						<dd className='mt-4 text-sm/6 text-gray-600'>
							{`Absolument. Notre plateforme est hautement configurable et permet
							de créer des workflows d'approbation personnalisés, d'adapter la
							terminologie à votre secteur d'activité, et de définir des champs
							spécifiques pour vos équipements. Les offres Growth et Enterprise
							incluent des options de personnalisation avancées.`}
						</dd>
					</dl>
					<dl>
						<dt className='text-sm font-semibold'>
							Quel type de support proposez-vous?
						</dt>
						<dd className='mt-4 text-sm/6 text-gray-600'>
							{`Nous offrons différents niveaux de support selon votre forfait.
							Tous les clients bénéficient d'un support par email et d'une base
							de connaissances complète. Les forfaits Growth et Enterprise
							incluent un support téléphonique, et les clients Enterprise
							profitent d'un gestionnaire de compte dédié pour un accompagnement
							personnalisé.`}
						</dd>
					</dl>
					<dl>
						<dt className='text-sm font-semibold'>
							Puis-je intégrer la plateforme à nos systèmes existants?
						</dt>
						<dd className='mt-4 text-sm/6 text-gray-600'>
							{`Oui, notre solution propose une API REST complète qui permet
							l'intégration avec vos systèmes existants comme les ERP, GMAO, ou
							logiciels comptables. Des connecteurs prédéfinis sont disponibles
							pour les systèmes les plus courants, et notre équipe technique
							peut vous accompagner dans la mise en place d'intégrations
							spécifiques.`}
						</dd>
					</dl>
				</div>
			</section>
		</Container>
	)
}

export default async function Pricing({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined }
}) {
	const searchPrms = await searchParams
	const tier =
		typeof searchPrms?.tier === 'string'
			? tiers.find(({ slug }) => slug === searchPrms.tier)!
			: tiers[0]

	return (
		<main className='overflow-hidden'>
			<GradientBackground />
			<Container>
				<Navbar />
			</Container>
			<Header />
			<PricingCards />
			<PricingTable selectedTier={tier} />
			<Testimonial />
			<FrequentlyAskedQuestions />
			<Footer />
		</main>
	)
}
