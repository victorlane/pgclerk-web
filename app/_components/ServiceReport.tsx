'use client'

// Service report card for the hero.
//
// Looks like an artefact we'd actually email a CTO at end of month: a
// compact summary of how the customer's databases are doing — uptime,
// incident count, last recovery drill, named owner. No fake commands,
// no fake CLI. Static after entrance; the only animation is the entry
// timeline run once on mount.
//
// The customer name "Aurora Health" + numbers are illustrative — same
// shape we'd ship for any real engagement.

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { CheckCircle2, FileCheck2, ShieldCheck, UserRound } from 'lucide-react'

interface Row {
	label: string
	value: string
	tone?: 'ok' | 'warn' | 'muted'
}

const ROWS: Row[] = [
	{ label: 'Uptime, last 30 days',   value: '99.97%',           tone: 'ok' },
	{ label: 'Incidents (P1 / P2)',    value: '0 / 1',            tone: 'ok' },
	{ label: 'Recovery drill',         value: 'Mon 09 Jun · pass', tone: 'ok' },
	{ label: 'Change records signed',  value: '6 / 6',            tone: 'ok' },
	{ label: 'Open audit queries',     value: '0',                tone: 'ok' },
	{ label: 'Capacity headroom',      value: '38% · review Jul', tone: 'muted' }
]

export default function ServiceReport() {
	const wrap = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (reduced) return
		const el = wrap.current
		if (!el) return

		const ctx = gsap.context(() => {
			const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
			tl.from('[data-report-header]', { y: 14, opacity: 0, duration: 0.6 })
				.from('[data-report-row]', {
					y: 10, opacity: 0, duration: 0.55, stagger: 0.05
				}, '-=0.35')
				.from('[data-report-footer]', { y: 10, opacity: 0, duration: 0.5 }, '-=0.2')
		}, el)
		return () => ctx.revert()
	}, [])

	return (
		<div ref={wrap} className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
			<div data-report-header className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3.5">
				<div className="flex items-center gap-2.5">
					<div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-fg-strong)] text-white">
						<ShieldCheck className="h-3.5 w-3.5" />
					</div>
					<div>
						<div className="text-[13px] font-semibold text-[var(--color-fg-strong)]">Northwind Capital · Service report</div>
						<div className="font-mono text-[10.5px] text-[var(--color-fg-subtle)]">Period: June 2026 · Silver tier</div>
					</div>
				</div>
				<div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-2 py-0.5 text-[10.5px] text-[var(--color-ok)]">
					<span className="relative inline-flex h-1.5 w-1.5">
						<span className="absolute inset-0 animate-ping rounded-full bg-[var(--color-ok)] opacity-60" />
						<span className="relative inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-ok)]" />
					</span>
					Healthy
				</div>
			</div>

			<div className="px-5 py-4">
				<div className="divide-y divide-[var(--color-border)]">
					{ROWS.map(r => (
						<div key={r.label} data-report-row className="flex items-center justify-between py-2.5 text-[13px]">
							<span className="text-[var(--color-fg-muted)]">{r.label}</span>
							<span
								className={`font-mono ${
									r.tone === 'ok' ? 'text-[var(--color-fg-strong)]' :
									r.tone === 'warn' ? 'text-[var(--color-warn)]' :
									'text-[var(--color-fg-muted)]'
								}`}
							>
								{r.value}
							</span>
						</div>
					))}
				</div>
			</div>

			<div data-report-footer className="flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-bg)] px-5 py-3 text-[11.5px]">
				<div className="inline-flex items-center gap-1.5 text-[var(--color-fg-muted)]">
					<UserRound className="h-3.5 w-3.5" />
					Named owner: Alice Brinkhorst
				</div>
				<div className="inline-flex items-center gap-1.5 text-[var(--color-fg-muted)]">
					<FileCheck2 className="h-3.5 w-3.5" />
					Signed for audit
					<CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-ok)]" />
				</div>
			</div>
		</div>
	)
}
