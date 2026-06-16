// /about — who we are. Stub for now.

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const dynamic = 'force-static'

export const metadata = {
	title: 'About — pgclerk',
	description: 'pgclerk is operated by Brinkhorst Consulting — a small team running Postgres for MSPs.'
}

export default function AboutPage() {
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
				About
			</h1>
			<div className="mt-8 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-xs">
				<div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
					Coming soon
				</div>
				<p className="mt-3 text-[14.5px] leading-[1.55] text-[var(--color-fg-muted)]">
					pgclerk is operated by Brinkhorst Consulting. Senior Postgres operators
					running customer clusters across AWS, GCP and Azure — same toolchain,
					one team, one number to call. Full team page, hiring sequence, and
					compliance posture in progress.
				</p>
			</div>
		</div>
	)
}
