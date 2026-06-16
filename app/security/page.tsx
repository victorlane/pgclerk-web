// /security — Security & Compliance.
//
// One long-form page setting out the controls, certifications, data-
// handling commitments, and shared-responsibility boundary. Aimed at
// buyers who need to forward something to their security or compliance
// reviewer before a discovery call gets scheduled.
//
// The whole page sits on top of a continuous dot-grid surface — the same
// grid we use on the operator console — with each section masking it
// differently so the texture is visible but never competes with copy.
// Animation is scroll-driven and section-specific:
//
//   - Hero      : animated dot grid in radar mode + per-letter heading
//                 reveal + monospaced KPI strip.
//   - Audit     : horizontal timeline rail pinned in place while a
//                 cursor walks across it (AuditTimeline).
//   - Controls  : horizontally-pinned card strip (PinnedControlsScroll).
//   - Data Q&A  : four big questions type in letter-by-letter as their
//                 matching answer card slides in (DataQASection).
//   - Boundary  : two-column ledger with a dotted central rail; rows
//                 resolve from opposite sides (BoundaryLedger).
//   - Incident  : vertical trace with an SVG stroke that draws itself
//                 between three step dots (IncidentTrace).

import Link from 'next/link'
import { ArrowUpRight, ChevronRight, FileCheck2, Lock, ShieldCheck } from 'lucide-react'
import AnimatedDotGrid from '../_components/AnimatedDotGrid'
import MagneticCTA from '../_components/MagneticCTA'
import SecurityHeroLetters from '../_components/SecurityHeroLetters'
import PinnedControlsScroll, { type ControlItem } from '../_components/PinnedControlsScroll'
import AuditTimeline, { type AuditMilestone } from '../_components/AuditTimeline'
import DataQASection, { type DataQA } from '../_components/DataQA'
import BoundaryLedger, { type BoundaryRow } from '../_components/BoundaryLedger'
import IncidentTrace from '../_components/IncidentTrace'

export const dynamic = 'force-static'

export const metadata = {
	title: 'Security & Compliance — pgclerk',
	description:
		'How pgclerk handles access, secrets, data residency, and audit evidence. SOC 2 roadmap, HIPAA-capable engagements, GDPR data-processing terms, and the shared-responsibility boundary set out in plain language.'
}

// ------------------------------------------------------------------
// Hero
// ------------------------------------------------------------------

const Hero = () => (
	<section className="relative overflow-hidden border-b border-[var(--color-border)]">
		{/* Animated radar-mode dot grid. Mask is a gentle bottom fade only
		    so the grid is actually visible across most of the hero — the
		    previous tight radial mask hid the texture and is gone. */}
		<div
			className="pointer-events-none absolute inset-0"
			aria-hidden
			style={{
				maskImage:
					'linear-gradient(to bottom, black 0%, black 78%, transparent 100%)',
				WebkitMaskImage:
					'linear-gradient(to bottom, black 0%, black 78%, transparent 100%)'
			}}
		>
			<AnimatedDotGrid className="relative h-full w-full" mode="radar" />
		</div>

		{/* Soft accent wash anchored above the heading. Lower opacity so
		    it doesn't drown the canvas. */}
		<div
			className="pointer-events-none absolute inset-0"
			aria-hidden
			style={{
				background:
					'radial-gradient(ellipse 1100px 520px at 50% 0%, color-mix(in oklab, var(--color-accent) 9%, transparent), transparent 60%)'
			}}
		/>
		<div
			className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--color-border-strong),transparent)]"
			aria-hidden
		/>

		<div className="relative mx-auto max-w-5xl px-6 pb-28 pt-28 text-center">
			<div className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/85 px-3 py-1 text-[11.5px] text-[var(--color-fg-muted)] backdrop-blur">
				<ShieldCheck className="h-3.5 w-3.5 text-[var(--color-accent)]" />
				<span>Security &amp; Compliance</span>
			</div>

			<SecurityHeroLetters
				className="mt-8 text-[44px] font-semibold leading-[1.05] tracking-tight sm:text-[60px]"
				lines={['Operated like a regulated', 'production system.']}
				accentLineIndex={1}
			/>

			<p className="mx-auto mt-7 max-w-2xl text-[16px] leading-relaxed text-[var(--color-fg-muted)]">
				Every control your auditor expects to see — access, secrets,
				change records, recovery evidence — produced as a by-product of
				normal operation, not as a one-off exercise before review.
			</p>

			<div className="mt-9 flex flex-wrap items-center justify-center gap-3">
				<MagneticCTA>
					<a
						href="mailto:hello@pgclerk.com?subject=Security%20review%20package"
						className="group inline-flex items-center gap-2 rounded-md bg-[var(--color-fg-strong)] px-4 py-2.5 text-[13.5px] font-medium text-white shadow-sm transition hover:bg-black"
					>
						Request the security pack
						<ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
					</a>
				</MagneticCTA>
				<a
					href="#shared-responsibility"
					className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-[13.5px] text-[var(--color-fg)] transition hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-2)]"
				>
					Shared-responsibility model
					<ChevronRight className="h-3.5 w-3.5" />
				</a>
			</div>

			<div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-border)] sm:grid-cols-4">
				<HeroStat label="Encryption" value="TLS 1.3" hint="in transit" />
				<HeroStat label="KMS" value="Customer" hint="managed keys" />
				<HeroStat label="Restore drill" value="Weekly" hint="signed report" />
				<HeroStat label="P1 ack" value="≤ 5 min" hint="Gold tier" />
			</div>

			<div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11.5px] text-[var(--color-fg-subtle)]">
				<span className="inline-flex items-center gap-1.5">
					<ShieldCheck className="h-3.5 w-3.5" /> SOC 2 Type II — on roadmap
				</span>
				<span className="inline-flex items-center gap-1.5">
					<FileCheck2 className="h-3.5 w-3.5" /> HIPAA-capable engagements
				</span>
				<span className="inline-flex items-center gap-1.5">
					<Lock className="h-3.5 w-3.5" /> GDPR DPA on request
				</span>
			</div>
		</div>
	</section>
)

const HeroStat = ({ label, value, hint }: { label: string; value: string; hint: string }) => (
	<div className="bg-[var(--color-surface)]/90 px-5 py-4 text-left backdrop-blur">
		<div className="font-mono text-[10.5px] uppercase tracking-wider text-[var(--color-fg-subtle)]">{label}</div>
		<div className="mt-1 font-mono text-[18px] font-semibold leading-none text-[var(--color-fg-strong)]">{value}</div>
		<div className="mt-1 font-mono text-[10.5px] text-[var(--color-fg-muted)]">{hint}</div>
	</div>
)

// ------------------------------------------------------------------
// Data
// ------------------------------------------------------------------

const AUDIT_MILESTONES: AuditMilestone[] = [
	{
		id: 'gdpr',
		when: 'Live',
		pos: 0.08,
		name: 'GDPR / UK GDPR',
		status: 'live',
		body: 'Data Processing Agreement provided as standard. Sub-processor list maintained and notified in advance of any change. EU and UK data-residency options at the deployment layer.',
		evidence: 'DPA.pdf · subprocessors.json'
	},
	{
		id: 'hipaa',
		when: 'Available',
		pos: 0.3,
		name: 'HIPAA',
		status: 'available',
		body: 'Business Associate Agreement available for healthcare workloads. Engagements scoped against the HIPAA Security Rule administrative, physical, and technical safeguards.',
		evidence: 'BAA-template.pdf'
	},
	{
		id: 'soc2',
		when: 'Q4 2026',
		pos: 0.6,
		name: 'SOC 2 Type II',
		status: 'in-progress',
		body: 'Audit period opens Q4 2026 with a Big Four firm. Interim evidence — policies, control narratives, sample reports — is available under NDA today.',
		evidence: 'interim-evidence-pack.zip'
	},
	{
		id: 'iso',
		when: 'H2 2027',
		pos: 0.9,
		name: 'ISO/IEC 27001',
		status: 'in-progress',
		body: 'Information Security Management System aligned to 27001:2022 controls. Certification audit scheduled for H2 2027 once SOC 2 Type II concludes.',
		evidence: 'isms-narrative.pdf'
	}
]

const CONTROL_ITEMS: ControlItem[] = [
	{
		num: '01',
		icon: 'fingerprint',
		label: 'Identity & access',
		body: 'Operator accounts are SSO-federated through your identity provider where supported. MFA is mandatory. Short-lived credentials are issued through a session broker; no long-lived shared accounts exist.',
		evidence: 'access_audit.csv · monthly · countersigned'
	},
	{
		num: '02',
		icon: 'key-round',
		label: 'Secrets management',
		body: 'Database credentials and infrastructure secrets live in customer-controlled vaults (AWS Secrets Manager, GCP Secret Manager, HashiCorp Vault). pgclerk never stores plaintext secrets at rest in its own systems.',
		evidence: 'secret_rotation_report.pdf · 90d'
	},
	{
		num: '03',
		icon: 'scroll-text',
		label: 'Change records',
		body: 'Every operational change carries a ticket, an approver, and a window. The complete record — diff, runbook, and outcome — is countersigned and retained for the duration of the engagement plus seven years.',
		evidence: 'change_log_q*.ndjson · ticketed'
	},
	{
		num: '04',
		icon: 'file-check',
		label: 'Recovery evidence',
		body: 'Backups are restored to an isolated environment weekly and integrity-checked. The signed report is delivered to your audit folder on a defined schedule, suitable for inclusion in your own SOC 2 or ISO submissions.',
		evidence: 'restore_drill_yyyywwNN.pdf · weekly'
	},
	{
		num: '05',
		icon: 'lock',
		label: 'Encryption',
		body: 'In-transit TLS 1.3 between every component. At-rest encryption uses customer-managed KMS keys where the platform supports it (AWS KMS, GCP CMEK, Azure Key Vault). pgclerk never holds the master key.',
		evidence: 'kms_attestation.json · per-region'
	},
	{
		num: '06',
		icon: 'users',
		label: 'Personnel security',
		body: 'Every operator with production access is a direct employee of Brinkhorst Consulting — no contractors, no offshore tier-1. Background-checked, NDA-bound, and named to the customer at contract.',
		evidence: 'operator_roster.pdf · per-engagement'
	},
	{
		num: '07',
		icon: 'eye',
		label: 'Session recording',
		body: 'Every break-glass operator session against customer infrastructure is recorded — keystrokes, command output, and timings. Available to your auditor on request; never inspected without an incident ticket.',
		evidence: 'session_*.cast · 365d retained'
	},
	{
		num: '08',
		icon: 'git-branch',
		label: 'Configuration as code',
		body: 'Every change to your Postgres estate goes through pull request review — runbook, parameter changes, and HA topology decisions land in a versioned repository before they touch a running system.',
		evidence: 'pr_history.json · GitHub-attested'
	}
]

const DATA_QA: DataQA[] = [
	{
		id: 'where',
		icon: 'globe-2',
		question: 'Where does my data live?',
		answerLead: 'In the region you pick.',
		answerBody: "Your database and backups stay in the region you select at contract — never replicated out. pgclerk's own operational metadata (tickets, audit log) lives in EU-West.",
		chip: 'eu-west · us-east · ap-southeast · custom'
	},
	{
		id: 'who',
		icon: 'eye',
		question: 'Who can read my data?',
		answerLead: 'Break-glass only, recorded.',
		answerBody: "Operators do not run ad-hoc queries against your data. Production access requires a ticket, an approver, and an automatic session recording attached to that ticket.",
		chip: 'session-broker · 4-eye-approval'
	},
	{
		id: 'keys',
		icon: 'key-round',
		question: 'Who holds the keys?',
		answerLead: 'You do, in your KMS.',
		answerBody: "At-rest encryption uses customer-managed keys in AWS KMS, GCP CMEK, or Azure Key Vault. Revoking the key revokes our access — there is no separate master key on our side.",
		chip: 'aws kms · gcp cmek · azure kv'
	},
	{
		id: 'who-else',
		icon: 'database',
		question: 'Who else touches it?',
		answerLead: 'A short, named list.',
		answerBody: "Three sub-processors: your cloud provider, your identity provider, and our observability vendor. The list is published, and we notify 30 days before any change.",
		chip: 'subprocessors.json · 30-day-notice'
	}
]

const BOUNDARY_ROWS: BoundaryRow[] = [
	{ area: 'Physical infra', pgclerk: null, customer: 'Cloud provider or own data centre' },
	{ area: 'OS patching', pgclerk: 'Operated', customer: 'Approves window' },
	{ area: 'Postgres conf', pgclerk: 'Operated', customer: 'States app needs' },
	{ area: 'Backups', pgclerk: 'Operated · verified', customer: 'Sets retention' },
	{ area: 'Monitoring', pgclerk: '24/7 on-call', customer: 'Escalation list' },
	{ area: 'Schema · code', pgclerk: 'Reviewed on request', customer: 'Owned' },
	{ area: 'Identity', pgclerk: 'Integrated', customer: 'Operated' },
	{ area: 'Data class', pgclerk: 'Honours scheme', customer: 'Owned' }
]

// ------------------------------------------------------------------
// Final CTA
// ------------------------------------------------------------------

const FinalCTA = () => (
	<section className="relative overflow-hidden">
		<div
			className="pointer-events-none absolute inset-0"
			aria-hidden
			style={{
				backgroundImage:
					'radial-gradient(circle at 1px 1px, var(--color-border-strong) 1px, transparent 0)',
				backgroundSize: '24px 24px',
				maskImage:
					'radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 80%)',
				WebkitMaskImage:
					'radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 80%)',
				opacity: 0.5
			}}
		/>
		<div className="relative mx-auto max-w-6xl px-6 py-24">
			<div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-14 text-center">
				<h2 className="mx-auto max-w-2xl text-[32px] font-semibold leading-[1.15] tracking-tight text-[var(--color-fg-strong)]">
					Forward this page to your security reviewer.
				</h2>
				<p className="mx-auto mt-4 max-w-xl text-[14.5px] leading-relaxed text-[var(--color-fg-muted)]">
					The full security package — policies, control narratives,
					sample reports, sub-processor list, and DPA — is available
					under NDA. Reviewer questions are welcome at any stage.
				</p>
				<div className="mt-7 flex flex-wrap justify-center gap-3">
					<MagneticCTA>
						<a
							href="mailto:hello@pgclerk.com?subject=Security%20review%20package"
							className="inline-flex items-center gap-2 rounded-md bg-[var(--color-fg-strong)] px-5 py-2.5 text-[14px] font-medium text-white shadow-sm transition hover:bg-black"
						>
							Request the security pack
						</a>
					</MagneticCTA>
					<Link
						href="/comparison"
						className="inline-flex items-center gap-2 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-2.5 text-[14px] font-medium text-[var(--color-fg)] transition hover:bg-[var(--color-surface-2)]"
					>
						See the comparison
						<ChevronRight className="h-3.5 w-3.5" />
					</Link>
				</div>
			</div>
		</div>
	</section>
)

// ------------------------------------------------------------------

export default function SecurityPage() {
	return (
		<>
			<Hero />
			<AuditTimeline milestones={AUDIT_MILESTONES} />
			<PinnedControlsScroll items={CONTROL_ITEMS} />
			<DataQASection items={DATA_QA} />
			<BoundaryLedger rows={BOUNDARY_ROWS} />
			<IncidentTrace />
			<FinalCTA />
		</>
	)
}
