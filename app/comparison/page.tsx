// /comparison — full comparison vs autobase, CloudNativePG, managed DBaaS.
// Stub for now; an abbreviated version lives on the homepage.

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-static'

export const metadata = {
	title: 'Comparison — pgclerk',
	description: 'pgclerk vs vitabaks/autobase, vs RDS-and-a-DBA, vs CloudNativePG, vs DBaaS.'
}

export default function ComparisonPage() {
	return (
		<div className="mx-auto max-w-3xl px-6 py-24">
			<Link
				href="/"
				className="inline-flex items-center gap-1.5 text-[12.5px] text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]"
			>
				<ArrowLeft className="h-3.5 w-3.5" />
				Back to home
			</Link>
			<h1 className="mt-6 text-[36px] font-semibold tracking-tight text-[var(--color-fg-strong)]">
				Comparison
			</h1>
			<div className="mt-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-xs">
				<div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
					Coming soon
				</div>
				<p className="mt-3 text-[14.5px] leading-[1.55] text-[var(--color-fg-muted)]">
					Long-form: where pgclerk fits in the landscape (VM-Ansible vs K8s operators
					vs SaaS), where vitabaks/autobase is ahead, where managed DBaaS wins, and
					when you should pick CloudNativePG instead of us. Source material in{' '}
					<code className="font-mono text-[12.5px] text-[var(--color-fg)]">docs/comparison.md</code>.
				</p>
			</div>
		</div>
	)
}
