// pgclerk homepage.
//
// Built for enterprise buyers — Heads of Engineering, CTOs, Heads of
// Compliance / Risk. The page reads top-to-bottom without scroll-driven
// reveal-on-everything tricks. Two deliberate animation moments:
//
//   1. Hero ServiceReport runs a small entry timeline on mount.
//   2. Comparison table rows fade in once when that section enters view.
//
// Everything else is static.

import Link from 'next/link'
import {
	ArrowUpRight,
	BarChart3,
	CheckCircle2,
	ChevronRight,
	Clock,
	FileCheck2,
	Globe,
	HeartHandshake,
	LineChart,
	ScrollText,
	ShieldCheck,
	Sparkles,
	UsersRound,
	X
} from 'lucide-react'
import { Badge } from '@/components/ui'
import ServiceReport from './_components/ServiceReport'
import ComparisonReveal from './_components/ComparisonReveal'
import OperatingWeek from './_components/OperatingWeek'
import HeadingReveal from './_components/HeadingReveal'
import MagneticCTA from './_components/MagneticCTA'
import Tilt from './_components/Tilt'
import Marquee from './_components/Marquee'
import Counter from './_components/Counter'

export const dynamic = 'force-static'

export const metadata = {
	title: 'pgclerk — Postgres operations, run as a service',
	description:
		'pgclerk operates your Postgres estate to enterprise standards. Continuous cover, audit-ready recovery, documented change control. SOC 2 and HIPAA capable, on AWS, GCP, Azure, or customer-owned infrastructure.'
}

// ------------------------------------------------------------------
// Hero
// ------------------------------------------------------------------

const Hero = () => (
	<section className="relative overflow-hidden border-b border-[var(--color-border)]">
		{/* Static backdrop — subtle gradient + dotted grid, fades out toward
		    the bottom. No mouse tracking; nothing follows the cursor. */}
		<div
			className="pointer-events-none absolute inset-0 -z-10"
			aria-hidden
			style={{
				backgroundImage:
					'radial-gradient(circle at 1px 1px, var(--color-border-strong) 1px, transparent 0)',
				backgroundSize: '24px 24px',
				maskImage:
					'radial-gradient(ellipse 70% 70% at 30% 20%, black 0%, black 35%, transparent 75%)',
				WebkitMaskImage:
					'radial-gradient(ellipse 70% 70% at 30% 20%, black 0%, black 35%, transparent 75%)'
			}}
		/>
		<div
			className="pointer-events-none absolute inset-0 -z-10"
			aria-hidden
			style={{
				background:
					'radial-gradient(ellipse 1100px 600px at 20% 0%, color-mix(in oklab, var(--color-accent) 8%, transparent), transparent 60%)'
			}}
		/>
		<div className="pointer-events-none absolute inset-x-0 top-0 h-px -z-10 bg-[linear-gradient(90deg,transparent,var(--color-border-strong),transparent)]" aria-hidden />

		<div className="mx-auto max-w-6xl px-6 pb-28 pt-24">
			<div className="grid items-start gap-16 lg:grid-cols-[1.15fr_1fr]">
				<div>
					<div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-[11.5px] text-[var(--color-fg-muted)]">
						<span className="relative inline-flex h-1.5 w-1.5">
							<span className="absolute inset-0 animate-ping rounded-full bg-[var(--color-ok)] opacity-60" />
							<span className="relative inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-ok)]" />
						</span>
						<span>Now accepting engagements for Q3 2026</span>
					</div>

					<h1 className="mt-6 text-[44px] font-semibold leading-[1.05] tracking-tight text-[var(--color-fg-strong)] sm:text-[56px]">
						Postgres operations,<br />
						<span className="text-[var(--color-fg)]">run as a service.</span>
					</h1>

					<p className="mt-6 max-w-xl text-[16px] leading-relaxed text-[var(--color-fg-muted)]">
						We operate your Postgres estate to enterprise standards.
						Continuous cover, audit-ready recovery, and scheduled
						maintenance against your change windows. Available on AWS,
						GCP, Azure, or your own infrastructure.
					</p>

					<div className="mt-8 flex flex-wrap items-center gap-3">
						<MagneticCTA>
							<a
								href="mailto:hello@pgclerk.com?subject=Discovery%20call"
								className="group inline-flex items-center gap-2 rounded-md bg-[var(--color-fg-strong)] px-4 py-2.5 text-[13.5px] font-medium text-white shadow-sm transition hover:bg-black"
							>
								Book a discovery call
								<ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
							</a>
						</MagneticCTA>
						<Link
							href="/comparison"
							className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-[13.5px] text-[var(--color-fg)] transition hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)]"
						>
							Review the comparison
							<ChevronRight className="h-3.5 w-3.5" />
						</Link>
					</div>

					<div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11.5px] text-[var(--color-fg-subtle)]">
						<span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> SOC 2 roadmap · HIPAA available</span>
						<span className="inline-flex items-center gap-1.5"><FileCheck2 className="h-3.5 w-3.5" /> Written change records</span>
						<span className="inline-flex items-center gap-1.5"><HeartHandshake className="h-3.5 w-3.5" /> One named team, no tier 1</span>
					</div>
				</div>

				<div className="lg:pt-6">
					<ServiceReport />
					<div className="mt-4 grid grid-cols-3 gap-3">
						<MetricCard label="Uptime target" value="99.95%" hint="Gold tier" />
						<MetricCard label="Response, P1" value="< 15 min" hint="24 × 7 × 365" />
						<MetricCard label="Recovery point" value="≤ 5 min" hint="PITR, tested weekly" />
					</div>
				</div>
			</div>
		</div>
	</section>
)

const MetricCard = ({ label, value, hint }: { label: string; value: string; hint: string }) => (
	<div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
		<div className="text-[10.5px] uppercase tracking-wider text-[var(--color-fg-subtle)]">{label}</div>
		<div className="mt-0.5 font-mono text-[16px] font-semibold text-[var(--color-fg-strong)]">{value}</div>
		<div className="text-[10.5px] text-[var(--color-fg-muted)]">{hint}</div>
	</div>
)

// ------------------------------------------------------------------
// Trust strip — Counter still runs once when this section enters view
// ------------------------------------------------------------------

const TrustStrip = () => (
	<section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
		<div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-6 py-12 md:grid-cols-4">
			<TrustNumber label="Years operating Postgres" to={14} kind="plus" />
			<TrustNumber label="On-call cover" to={24} kind="slash7" />
			<TrustNumber label="Recovery drill cadence" to={7} kind="every-days" />
			<TrustNumber label="Last incident response (median)" to={9} kind="minutes" />
		</div>
	</section>
)

const TrustNumber = ({
	label,
	to,
	kind
}: {
	label: string
	to: number
	kind: 'plus' | 'slash7' | 'every-days' | 'minutes'
}) => (
	<div>
		<div className="font-mono text-[28px] font-semibold tracking-tight text-[var(--color-fg-strong)]">
			<Counter to={to} kind={kind} />
		</div>
		<div className="mt-1 text-[12px] text-[var(--color-fg-muted)]">{label}</div>
	</div>
)

// ------------------------------------------------------------------
// Audience
// ------------------------------------------------------------------

const Audience = () => (
	<section className="border-b border-[var(--color-border)]">
		<div className="mx-auto max-w-6xl px-6 py-24">
			<SectionEyebrow>Who we work with</SectionEyebrow>
			<SectionHeading>Engagements we accept, and those we decline.</SectionHeading>
			<p className="mt-3 max-w-2xl text-[14.5px] text-[var(--color-fg-muted)]">
				A clear statement of fit before either party invests further. Where
				the match is poor, we will say so directly and, where possible,
				recommend a more appropriate provider.
			</p>

			<div className="mt-12 grid gap-5 md:grid-cols-2">
				<AudienceCard
					tone="ok"
					title="A good fit"
					items={[
						'Downtime carries board-level financial or reputational cost.',
						'Compliance obligations require demonstrable evidence: SOC 2, HIPAA, GDPR, or equivalent.',
						'No senior database engineer in-house, or unable to recruit one at the required level.',
						'A single accountable party is preferred across all environments.',
						'Workloads operate on AWS, GCP, Azure, hybrid, or on-premises.'
					]}
				/>
				<AudienceCard
					tone="muted"
					title="Not a fit"
					items={[
						'Lower-stakes workloads running comfortably on a managed default.',
						'In-house platform teams with senior Postgres specialists already engaged.',
						'Requirements limited to hourly consultancy without continuous accountability.',
						'Procurement led primarily by lowest unit cost.'
					]}
				/>
			</div>
		</div>
	</section>
)

const AudienceCard = ({
	tone,
	title,
	items
}: {
	tone: 'ok' | 'muted'
	title: string
	items: string[]
}) => (
	<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
		<div className="flex items-center gap-2">
			{tone === 'ok'
				? <CheckCircle2 className="h-4 w-4 text-[var(--color-ok)]" />
				: <X className="h-4 w-4 text-[var(--color-fg-muted)]" />}
			<span className="text-[13.5px] font-semibold text-[var(--color-fg-strong)]">{title}</span>
		</div>
		<ul className="mt-4 space-y-2.5 text-[13.5px] leading-relaxed text-[var(--color-fg)]">
			{items.map((it, i) => (
				<li key={i} className="flex gap-2">
					<span className={`mt-[7px] inline-block h-1 w-1 shrink-0 rounded-full ${tone === 'ok' ? 'bg-[var(--color-ok)]' : 'bg-[var(--color-fg-subtle)]'}`} />
					<span>{it}</span>
				</li>
			))}
		</ul>
	</div>
)

// ------------------------------------------------------------------
// What we run — capability tiles (Tilt on hover only)
// ------------------------------------------------------------------

type Capability = {
	icon: React.ComponentType<{ className?: string }>
	title: string
	body: string
	tag: 'production' | 'available' | 'managed'
}

const CAPABILITIES: Capability[] = [
	{
		icon: ShieldCheck,
		title: 'Continuous cover',
		body: 'Monitoring, on-call rotation, and incident response operate 24/7. Every incident concludes with a written postmortem suitable for inclusion in your own reporting.',
		tag: 'production'
	},
	{
		icon: FileCheck2,
		title: 'Verified recovery',
		body: 'Backups validated weekly through restoration to an isolated environment. Reports are provided to your auditor on a defined schedule, signed by both parties.',
		tag: 'production'
	},
	{
		icon: BarChart3,
		title: 'Capacity and performance',
		body: 'A quarterly review of growth, contention, and resource utilisation. Recommendations are accompanied by written rationale and projected budget impact.',
		tag: 'production'
	},
	{
		icon: ScrollText,
		title: 'Documented change control',
		body: 'Every operational change carries an approver, a maintenance window, and a complete record. Audit evidence is produced as a by-product of normal operations.',
		tag: 'production'
	},
	{
		icon: HeartHandshake,
		title: 'A named team, not a queue',
		body: 'A single named team is assigned to each engagement, with direct lines of communication. No tier-1 triage, no escalation pathways.',
		tag: 'production'
	},
	{
		icon: Sparkles,
		title: 'Pre-engagement audit',
		body: 'A structured assessment of your existing database is provided prior to contract. The written report is yours to retain regardless of the engagement outcome.',
		tag: 'available'
	}
]

const tagToTone = (tag: Capability['tag']): { label: string; tone: 'ok' | 'accent' | 'info' } => {
	if (tag === 'production') return { label: 'Production', tone: 'ok' }
	if (tag === 'managed')    return { label: 'Managed offerings', tone: 'info' }
	return { label: 'Available', tone: 'accent' }
}

const WhatWeRun = () => (
	<section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
		<div className="mx-auto max-w-6xl px-6 py-24">
			<SectionEyebrow>Service commitments</SectionEyebrow>
			<SectionHeading>Six obligations, set out in writing.</SectionHeading>
			<p className="mt-3 max-w-2xl text-[14.5px] text-[var(--color-fg-muted)]">
				The following are contractual obligations attached to the Master
				Services Agreement, not marketing statements. Failure to meet them
				triggers a service credit and a written incident report.
			</p>

			<div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
				{CAPABILITIES.map(c => {
					const Icon = c.icon
					const tone = tagToTone(c.tag)
					return (
						<Tilt key={c.title} className="h-full">
							<div className="group h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 transition hover:border-[var(--color-border-strong)]">
								<div className="flex items-center justify-between">
									<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-surface-2)] text-[var(--color-fg-strong)]">
										<Icon className="h-4 w-4" />
									</div>
									<Badge tone={tone.tone}>{tone.label}</Badge>
								</div>
								<div className="mt-5 text-[15px] font-semibold text-[var(--color-fg-strong)]">{c.title}</div>
								<p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-fg-muted)]">{c.body}</p>
							</div>
						</Tilt>
					)
				})}
			</div>
		</div>
	</section>
)

// ------------------------------------------------------------------
// Topologies
// ------------------------------------------------------------------

type Topology = {
	title: string
	subtitle: string
	body: string
	tags: string[]
}

const TOPOLOGIES: Topology[] = [
	{
		title: 'Customer-owned infrastructure',
		subtitle: 'Self-managed virtual machines or bare metal',
		body: 'Customer-owned hardware, network, and data residency, operated to pgclerk standards. Frequently selected for regulated industries and sovereign-data requirements.',
		tags: ['On-premises', 'Hybrid cloud', 'No vendor lock-in']
	},
	{
		title: 'AWS, GCP, or Azure managed services',
		subtitle: 'Operated by pgclerk on the cloud-provider service',
		body: 'RDS, Aurora, Cloud SQL, and Azure Database for PostgreSQL. The cloud provider operates the underlying infrastructure; pgclerk operates the database — patching, configuration, recovery validation, and change control.',
		tags: ['Lowest operational overhead', 'Cloud-provider billing', 'Region of your choice']
	},
	{
		title: 'High-availability cluster',
		subtitle: 'Three-node replicated configuration with automatic failover',
		body: 'Suitable for workloads with stringent uptime requirements. Synchronous replication, continuous monitoring, and rehearsed failover procedures.',
		tags: ['99.95% target', 'Synchronous replication', 'Multi-AZ']
	},
	{
		title: 'Multi-region, multi-cloud',
		subtitle: 'Active replication across regions or providers',
		body: 'For business-continuity programmes requiring cross-region or cross-provider resilience. Recovery scenarios are documented, exercised on a defined schedule, and formally signed off.',
		tags: ['BCP / DR', 'Cross-region', 'RTO contractual']
	}
]

const Topologies = () => (
	<section className="border-b border-[var(--color-border)]">
		<div className="mx-auto max-w-6xl px-6 py-24">
			<SectionEyebrow>Deployment options</SectionEyebrow>
			<SectionHeading>Operated wherever your business runs.</SectionHeading>
			<p className="mt-3 max-w-2xl text-[14.5px] text-[var(--color-fg-muted)]">
				pgclerk is platform-agnostic. The deployment model is selected on
				the basis of regulatory, operational, and cost criteria specific to
				the engagement — not vendor preference.
			</p>

			<div className="mt-12 grid gap-4 md:grid-cols-2">
				{TOPOLOGIES.map(t => (
					<Tilt key={t.title} className="h-full" max={4}>
						<div className="group flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition hover:border-[var(--color-border-strong)]">
							<div className="flex items-center gap-2">
								<Globe className="h-4 w-4 text-[var(--color-accent)]" />
								<span className="text-[10.5px] uppercase tracking-wider text-[var(--color-fg-subtle)]">{t.subtitle}</span>
							</div>
							<div className="mt-3 text-[18px] font-semibold text-[var(--color-fg-strong)]">{t.title}</div>
							<p className="mt-2 flex-1 text-[13.5px] leading-relaxed text-[var(--color-fg-muted)]">{t.body}</p>
							<div className="mt-4 flex flex-wrap gap-1.5">
								{t.tags.map(tag => (
									<span key={tag} className="rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-0.5 font-mono text-[10.5px] text-[var(--color-fg-muted)]">{tag}</span>
								))}
							</div>
						</div>
					</Tilt>
				))}
			</div>
		</div>
	</section>
)

// ------------------------------------------------------------------
// Tiers
// ------------------------------------------------------------------

type Tier = {
	name: string
	tagline: string
	priceFrom: string
	uptime: string
	highlight?: boolean
	bullets: string[]
}

const TIERS: Tier[] = [
	{
		name: 'Bronze',
		tagline: 'For workloads with business-hours support requirements.',
		priceFrom: '$1,200',
		uptime: '99.5%',
		bullets: [
			'Business-hours response',
			'Monitoring with monthly review',
			'Weekly backup verification',
			'Quarterly performance review',
			'Single named contact'
		]
	},
	{
		name: 'Silver',
		tagline: 'Standard tier for enterprise workloads requiring continuous cover.',
		priceFrom: '$3,500',
		uptime: '99.9%',
		highlight: true,
		bullets: [
			'24/7 response, P1 within 15 minutes',
			'Weekly backup verification and recovery drills',
			'Monthly capacity and cost review',
			'Quarterly compliance evidence pack',
			'Named team with direct line of communication'
		]
	},
	{
		name: 'Gold',
		tagline: 'For business-critical workloads under continuous audit.',
		priceFrom: '$7,500',
		uptime: '99.95%',
		bullets: [
			'24/7 response, P1 within 5 minutes',
			'Twice-weekly recovery drills',
			'Quarterly on-site business review',
			'Application-specific runbooks',
			'Dedicated technical account manager'
		]
	}
]

const Tiers = () => (
	<section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
		<div className="mx-auto max-w-6xl px-6 py-24">
			<SectionEyebrow>Service tiers</SectionEyebrow>
			<SectionHeading>Three response commitments. Selected at contract.</SectionHeading>
			<p className="mt-3 max-w-2xl text-[14.5px] text-[var(--color-fg-muted)]">
				Each tier corresponds to a defined Service Level Agreement.
				Missed commitments are remediated through service credits payable
				to the customer.
			</p>

			<div className="mt-12 grid gap-4 lg:grid-cols-3">
				{TIERS.map(t => (
					<div
						key={t.name}
						className={`relative flex h-full flex-col rounded-2xl border bg-[var(--color-bg)] p-6 transition
							${t.highlight
								? 'border-[var(--color-fg-strong)] shadow-md'
								: 'border-[var(--color-border)] hover:border-[var(--color-border-strong)]'}`}
					>
						{t.highlight && (
							<div className="absolute -top-3 left-6 rounded-full bg-[var(--color-fg-strong)] px-2.5 py-0.5 text-[10.5px] font-medium text-white">
								Recommended
							</div>
						)}
						<div className="flex items-center justify-between">
							<div className="text-[15px] font-semibold text-[var(--color-fg-strong)]">{t.name}</div>
							<Badge tone={t.highlight ? 'accent' : 'muted'}>{t.uptime} uptime</Badge>
						</div>
						<p className="mt-2 text-[13px] text-[var(--color-fg-muted)]">{t.tagline}</p>
						<div className="mt-5 flex items-baseline gap-1">
							<span className="font-mono text-[28px] font-semibold text-[var(--color-fg-strong)]">{t.priceFrom}</span>
							<span className="text-[12.5px] text-[var(--color-fg-muted)]">per cluster / month, from</span>
						</div>
						<ul className="mt-5 space-y-2.5 text-[13.5px] leading-relaxed text-[var(--color-fg)]">
							{t.bullets.map(b => (
								<li key={b} className="flex gap-2">
									<CheckCircle2 className={`mt-[3px] h-3.5 w-3.5 shrink-0 ${t.highlight ? 'text-[var(--color-fg-strong)]' : 'text-[var(--color-ok)]'}`} />
									<span>{b}</span>
								</li>
							))}
						</ul>
						<Link
							href="/pricing"
							className="mt-6 inline-flex items-center gap-1 text-[13px] font-medium text-[var(--color-fg-strong)] hover:underline"
						>
							Full scope of inclusions <ChevronRight className="h-3.5 w-3.5" />
						</Link>
					</div>
				))}
			</div>

			<p className="mt-8 max-w-3xl font-mono text-[11px] text-[var(--color-fg-subtle)]">
				Indicative monthly starting prices. Final pricing is determined
				by topology, data volume, and compliance scope. Cloud-provider
				infrastructure is invoiced directly by the provider and is not
				subject to markup.
			</p>
		</div>
	</section>
)

// ------------------------------------------------------------------
// Marquee strip — outcomes ticker above the comparison
// ------------------------------------------------------------------

const MARQUEE_ITEMS = [
	'Written postmortem within 5 business days',
	'Quarterly audit evidence pack',
	'On-call rotation with continuous secondary cover',
	'Weekly recovery validation',
	'Single point of contact',
	'Maintenance windows agreed in advance',
	'Service credits on missed SLAs',
	'Change records countersigned by the customer',
	'SOC 2, HIPAA, and GDPR support included'
]

const OutcomesStrip = () => (
	<section className="border-b border-[var(--color-border)] bg-[var(--color-bg)]">
		<div className="py-6">
			<Marquee duration={48}>
				{MARQUEE_ITEMS.map(t => (
					<span key={t} className="inline-flex items-center gap-2 font-mono text-[11.5px] text-[var(--color-fg-muted)]">
						<span className="h-1 w-1 rounded-full bg-[var(--color-accent)]" />
						{t}
					</span>
				))}
			</Marquee>
		</div>
	</section>
)

// ------------------------------------------------------------------
// Comparison — rows animate in once on enter (the one scroll moment)
// ------------------------------------------------------------------

type Cell = string | { kind: 'check'; note?: string } | { kind: 'cross'; note?: string }

const COMPARISON_ROWS: { label: string; pgclerk: Cell; rds: Cell; autobase: Cell }[] = [
	{ label: '24/7 cover, P1 response time committed in writing',
	  pgclerk:  { kind: 'check', note: '< 15 min' },
	  rds:      'AWS support contract',
	  autobase: { kind: 'cross', note: 'Your team' } },
	{ label: 'Recovery tested weekly with written evidence',
	  pgclerk:  { kind: 'check' },
	  rds:      { kind: 'cross' },
	  autobase: { kind: 'cross' } },
	{ label: 'SOC 2 / HIPAA / GDPR evidence pack',
	  pgclerk:  { kind: 'check', note: 'Quarterly' },
	  rds:      'Cloud provider only',
	  autobase: { kind: 'cross' } },
	{ label: 'Single named team across all environments',
	  pgclerk:  { kind: 'check' },
	  rds:      { kind: 'cross' },
	  autobase: { kind: 'cross' } },
	{ label: 'Multi-cloud + on-prem coverage',
	  pgclerk:  { kind: 'check' },
	  rds:      'AWS only',
	  autobase: { kind: 'check', note: 'You operate it' } },
	{ label: 'Change records signed by your team',
	  pgclerk:  { kind: 'check' },
	  rds:      { kind: 'cross' },
	  autobase: { kind: 'cross' } },
	{ label: 'Failover handled for you',
	  pgclerk:  { kind: 'check' },
	  rds:      { kind: 'check', note: 'AWS does this well' },
	  autobase: { kind: 'cross', note: 'You build it' } },
	{ label: 'Capacity review with budget recommendations',
	  pgclerk:  { kind: 'check' },
	  rds:      { kind: 'cross' },
	  autobase: { kind: 'cross' } }
]

const renderCell = (cell: Cell) => {
	if (typeof cell === 'string') {
		return <span className="text-[12.5px] text-[var(--color-fg-muted)]">{cell}</span>
	}
	if (cell.kind === 'check') {
		return (
			<div className="inline-flex items-center gap-1.5">
				<CheckCircle2 className="h-4 w-4 text-[var(--color-ok)]" />
				{cell.note && <span className="font-mono text-[11px] text-[var(--color-fg-muted)]">{cell.note}</span>}
			</div>
		)
	}
	return (
		<div className="inline-flex items-center gap-1.5">
			<X className="h-4 w-4 text-[var(--color-fg-subtle)]" />
			{cell.note && <span className="font-mono text-[11px] text-[var(--color-fg-muted)]">{cell.note}</span>}
		</div>
	)
}

const Comparison = () => (
	<section className="border-b border-[var(--color-border)]">
		<div className="mx-auto max-w-6xl px-6 py-24">
			<SectionEyebrow>Comparison</SectionEyebrow>
			<SectionHeading>An honest accounting against the alternatives.</SectionHeading>
			<p className="mt-3 max-w-2xl text-[14.5px] text-[var(--color-fg-muted)]">
				The same comparison provided during the discovery call. Where a
				competing approach performs better against a given criterion, the
				table records it accordingly.
			</p>

			<ComparisonReveal>
				<div className="mt-10 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
					<table className="w-full text-left">
						<thead>
							<tr className="border-b border-[var(--color-border)] bg-[var(--color-surface-2)] text-[10.5px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
								<th className="px-5 py-3 font-medium">What matters</th>
								<th className="px-5 py-3 font-medium text-[var(--color-fg-strong)]">pgclerk</th>
								<th className="px-5 py-3 font-medium">Managed cloud, self-operated</th>
								<th className="px-5 py-3 font-medium">DIY open-source stack</th>
							</tr>
						</thead>
						<tbody>
							{COMPARISON_ROWS.map((row, i) => (
								<tr
									key={row.label}
									data-cmp-row
									className={i % 2 === 0 ? 'bg-[var(--color-surface)]' : 'bg-[var(--color-bg)]'}
								>
									<td className="px-5 py-3 text-[13px] text-[var(--color-fg)]">{row.label}</td>
									<td className="px-5 py-3">{renderCell(row.pgclerk)}</td>
									<td className="px-5 py-3">{renderCell(row.rds)}</td>
									<td className="px-5 py-3">{renderCell(row.autobase)}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</ComparisonReveal>
		</div>
	</section>
)

// ------------------------------------------------------------------
// How it works
// ------------------------------------------------------------------

const STEPS = [
	{
		num: '01',
		icon: UsersRound,
		title: 'Discovery',
		body: 'A 30-minute call to determine fit. No prepared presentation; an exchange focused on your operating context and our suitability to address it.'
	},
	{
		num: '02',
		icon: LineChart,
		title: 'Audit',
		body: 'A structured assessment of your existing Postgres estate. The written report is provided regardless of whether the engagement proceeds.'
	},
	{
		num: '03',
		icon: HeartHandshake,
		title: 'Onboarding',
		body: 'A documented handover, runbooks for both teams, a signed Master Services Agreement, and active operational cover from day one.'
	}
]

const HowItWorks = () => (
	<section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
		<div className="mx-auto max-w-6xl px-6 py-24">
			<SectionEyebrow>Engagement process</SectionEyebrow>
			<SectionHeading>Three steps from first call to live operation.</SectionHeading>

			<div className="mt-12 grid gap-6 md:grid-cols-3">
				{STEPS.map(s => {
					const Icon = s.icon
					return (
						<div key={s.num} className="relative flex h-full flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
							<div className="flex items-center justify-between">
								<span className="font-mono text-[11px] text-[var(--color-fg-subtle)]">step {s.num}</span>
								<Icon className="h-4 w-4 text-[var(--color-fg-strong)]" />
							</div>
							<div className="mt-4 text-[17px] font-semibold text-[var(--color-fg-strong)]">{s.title}</div>
							<p className="mt-2 text-[13.5px] leading-relaxed text-[var(--color-fg-muted)]">{s.body}</p>
						</div>
					)
				})}
			</div>
		</div>
	</section>
)

// ------------------------------------------------------------------
// Final CTA
// ------------------------------------------------------------------

const FinalCTA = () => (
	<section>
		<div className="mx-auto max-w-6xl px-6 py-24">
			<div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-14 text-center">
				<h2 className="mx-auto max-w-2xl text-[32px] font-semibold leading-[1.15] tracking-tight text-[var(--color-fg-strong)]">
					Open a conversation about your Postgres estate.
				</h2>
				<p className="mx-auto mt-4 max-w-xl text-[14.5px] leading-relaxed text-[var(--color-fg-muted)]">
					A 30-minute introductory call. The outcome is a written
					statement of fit. Where pgclerk is not the appropriate
					provider, we will say so and recommend alternatives.
				</p>
				<div className="mt-7 flex flex-wrap justify-center gap-3">
					<MagneticCTA>
						<a
							href="mailto:hello@pgclerk.com?subject=Discovery%20call"
							className="inline-flex items-center gap-2 rounded-md bg-[var(--color-fg-strong)] px-5 py-2.5 text-[14px] font-medium text-white shadow-sm transition hover:bg-black"
						>
							hello@pgclerk.com
						</a>
					</MagneticCTA>
					<a
						href="https://cal.com/pgclerk/discovery"
						className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-2.5 text-[14px] font-medium text-[var(--color-fg)] transition hover:bg-[var(--color-surface-2)]"
					>
						Book directly
						<Clock className="h-3.5 w-3.5" />
					</a>
				</div>
				<div className="mt-9 grid grid-cols-1 gap-y-4 border-t border-[var(--color-border)] pt-7 sm:grid-cols-3">
					<CTAFact label="Response within" value="1 business day" />
					<CTAFact label="Call duration" value="30 minutes" />
					<CTAFact label="Outcome" value="written statement of fit" />
				</div>
			</div>
		</div>
	</section>
)

const CTAFact = ({ label, value }: { label: string; value: string }) => (
	<div className="text-center">
		<div className="font-mono text-[11.5px] uppercase tracking-wider text-[var(--color-fg-subtle)]">{label}</div>
		<div className="mt-0.5 text-[14px] font-semibold text-[var(--color-fg-strong)]">{value}</div>
	</div>
)

// ------------------------------------------------------------------
// Shared bits
// ------------------------------------------------------------------

const SectionEyebrow = ({ children }: { children: React.ReactNode }) => (
	<div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-accent)]">
		{children}
	</div>
)

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
	<HeadingReveal className="mt-2 text-[34px] font-semibold leading-[1.15] tracking-tight text-[var(--color-fg-strong)]">
		{children}
	</HeadingReveal>
)

// ------------------------------------------------------------------

export default function HomePage() {
	return (
		<>
			<Hero />
			<TrustStrip />
			<Audience />
			<OperatingWeek />
			<WhatWeRun />
			<Topologies />
			<Tiers />
			<OutcomesStrip />
			<Comparison />
			<HowItWorks />
			<FinalCTA />
		</>
	)
}
