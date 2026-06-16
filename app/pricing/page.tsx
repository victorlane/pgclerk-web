// /pricing — full pricing detail.
// Stub for now; the homepage tier cards are the customer-facing summary.

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-static'

export const metadata = {
	title: 'Pricing — pgclerk',
	description: 'Monthly base by tier, topology uplift, storage uplift, setup fees, and the migration menu.'
}

export default function PricingPage() {
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
				Pricing
			</h1>
			<div className="mt-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-xs">
				<div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
					Coming soon
				</div>
				<p className="mt-3 text-[14.5px] leading-[1.55] text-[var(--color-fg-muted)]">
					Full pricing breakdown — tier base fees, topology uplift (1.0x–1.8x),
					per-GB storage bands, setup fees, the migration fixed-fee menu, and the
					stacking discount rules — is being lifted from{' '}
					<code className="font-mono text-[12.5px] text-[var(--color-fg)]">docs/pricing-model.md</code>{' '}
					into this page. The tier summary on the homepage is the headline shape.
				</p>
				<div className="mt-6">
					<a
						href="mailto:hello@pgclerk.com?subject=Pricing%20question"
						className="inline-flex items-center rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] px-3.5 py-2 text-[13px] font-medium text-[var(--color-fg)] hover:border-[var(--color-border-strong)]"
					>
						Ask for a quote
					</a>
				</div>
			</div>
		</div>
	)
}
