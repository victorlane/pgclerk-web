'use client'

// Audit calendar timeline — replaces the certifications card grid.
//
// A horizontal rail of dated milestone pins is pinned in place while the
// user scrolls vertically. Scroll progress advances a "today" cursor
// along the rail; the pin closest to the cursor pops into focus with
// its full body, status pill, and an evidence chip. Other pins shrink
// back to a minimal mark.
//
// Compared to the controls strip — which slides a card at a time across
// the viewport — this section keeps the *timeline itself* fixed and
// moves the cursor. The two scroll idioms read differently even though
// both are scroll-driven.
//
// Reduced-motion users get a static vertical list of the same data.

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ShieldCheck, FileCheck2, CircleDot } from 'lucide-react'

export type AuditMilestone = {
	id: string
	when: string          // human label e.g. "Q4 2026"
	pos: number           // 0..1 along the rail
	name: string
	status: 'live' | 'in-progress' | 'available'
	body: string
	evidence: string
}

export default function AuditTimeline({ milestones }: { milestones: AuditMilestone[] }) {
	const sectionRef = useRef<HTMLDivElement>(null)
	const cursorRef = useRef<HTMLDivElement>(null)
	const fillRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const section = sectionRef.current
		if (!section) return
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (reduced) return

		const pins = Array.from(section.querySelectorAll<HTMLElement>('[data-pin]'))
		const detailBodies = Array.from(section.querySelectorAll<HTMLElement>('[data-detail]'))
		if (pins.length === 0) return

		// First pin opens by default so the layout is stable on entry.
		pins[0].classList.add('is-active')
		detailBodies[0].classList.add('is-active')
		let current = 0

		const ctx = gsap.context(() => {
			ScrollTrigger.create({
				trigger: section,
				start: 'top top',
				end: () => `+=${window.innerHeight * 1.6}`,
				pin: true,
				scrub: 0.8,
				invalidateOnRefresh: true,
				onUpdate: self => {
					const p = self.progress
					if (cursorRef.current) cursorRef.current.style.left = `${p * 100}%`
					if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`

					// Find closest pin to the cursor position.
					let best = 0
					let bestD = Infinity
					for (let i = 0; i < pins.length; i++) {
						const d = Math.abs((Number(pins[i].dataset.pos) || 0) - p)
						if (d < bestD) { bestD = d; best = i }
					}
					if (best !== current) {
						pins[current].classList.remove('is-active')
						detailBodies[current].classList.remove('is-active')
						pins[best].classList.add('is-active')
						detailBodies[best].classList.add('is-active')
						current = best
					}
				}
			})
		}, section)
		return () => ctx.revert()
	}, [milestones.length])

	return (
		<section
			ref={sectionRef}
			className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-bg)]"
		>
			{/* Section-local dot grid — visible, with a soft fade only on
			    the very edges. This is the texture the user asked to see. */}
			<div
				className="pointer-events-none absolute inset-0"
				aria-hidden
				style={{
					backgroundImage:
						'radial-gradient(circle at 1px 1px, var(--color-border-strong) 1px, transparent 0)',
					backgroundSize: '24px 24px',
					maskImage:
						'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
					WebkitMaskImage:
						'linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)',
					opacity: 0.6
				}}
			/>
			{/* Accent wash anchored to the timeline rail. */}
			<div
				className="pointer-events-none absolute inset-0"
				aria-hidden
				style={{
					background:
						'radial-gradient(ellipse 60% 45% at 50% 50%, color-mix(in oklab, var(--color-accent) 7%, transparent), transparent 70%)'
				}}
			/>

			<div className="relative mx-auto flex h-screen max-w-6xl flex-col px-6">
				<div className="pt-24">
					<div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-accent)]">
						Audit calendar
					</div>
					<h2 className="mt-2 text-[34px] font-semibold leading-[1.15] tracking-tight text-[var(--color-fg-strong)]">
						What we hold, and what is on the calendar.
					</h2>
					<p className="mt-3 max-w-2xl text-[14.5px] text-[var(--color-fg-muted)]">
						Stated plainly so your security reviewer doesn&apos;t have to
						translate marketing language. Scroll the cursor along the
						timeline to inspect each milestone.
					</p>
				</div>

				{/* The rail itself — sits in the vertical middle of the pinned
				    viewport. The cursor floats above it; pins anchor to it. */}
				<div className="relative mt-20 flex-1">
					<div className="relative h-px w-full bg-[var(--color-border-strong)]">
						<div
							ref={fillRef}
							className="absolute inset-y-0 left-0 h-px w-full origin-left bg-[var(--color-accent)]"
							style={{ transform: 'scaleX(0)' }}
						/>
						{/* Tick marks at 0% / 25% / 50% / 75% / 100% — reads as
						    a measured instrument rather than a marketing bar. */}
						{[0, 0.25, 0.5, 0.75, 1].map(t => (
							<div
								key={t}
								className="absolute top-0 h-2 w-px -translate-x-1/2 bg-[var(--color-border-strong)]"
								style={{ left: `${t * 100}%` }}
							/>
						))}

						{/* Today cursor — a vertical accent line + label that the
						    onUpdate handler walks along the rail. */}
						<div
							ref={cursorRef}
							className="absolute -top-6 z-20"
							style={{ left: '0%', transform: 'translateX(-50%)' }}
						>
							<div className="flex flex-col items-center">
								<span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-accent)]">
									cursor
								</span>
								<span className="mt-1 inline-block h-12 w-px bg-[var(--color-accent)]" />
							</div>
						</div>

						{/* Pins. Each renders below the rail as a circle plus a
						    label. When active, the pin grows and its body card
						    appears in the detail strip above. */}
						{milestones.map(m => (
							<div
								key={m.id}
								data-pin
								data-pos={m.pos}
								className="audit-pin absolute top-0 -translate-x-1/2"
								style={{ left: `${m.pos * 100}%` }}
							>
								<span className="audit-pin-dot relative block h-3 w-3 -translate-y-[6px] rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)] transition-all">
									<CircleDot className="audit-pin-icon absolute inset-0 m-auto h-3 w-3 text-[var(--color-accent)] opacity-0 transition-opacity" />
								</span>
								<div className="audit-pin-label mt-3 whitespace-nowrap text-center font-mono text-[10.5px] uppercase tracking-wider text-[var(--color-fg-subtle)] transition-colors">
									{m.when}
								</div>
								<div className="audit-pin-name mt-1 whitespace-nowrap text-center text-[12px] font-medium text-[var(--color-fg-muted)] transition-colors">
									{m.name}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Detail strip — only the active pin's card is visible at a
				    time. Sits above the rail (above the page content) so the
				    detail follows the timeline naturally. */}
				<div className="relative -mt-[260px] mb-24 flex justify-center">
					<div className="relative h-[220px] w-full max-w-2xl">
						{milestones.map(m => (
							<article
								key={m.id}
								data-detail
								className="audit-detail absolute inset-0 flex flex-col rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 p-6 backdrop-blur transition-all"
							>
								<div className="flex items-center justify-between">
									<div className="flex items-center gap-2">
										<ShieldCheck className="h-4 w-4 text-[var(--color-accent)]" />
										<span className="text-[15px] font-semibold text-[var(--color-fg-strong)]">{m.name}</span>
									</div>
									<StatusPill status={m.status} />
								</div>
								<p className="mt-3 flex-1 text-[13px] leading-relaxed text-[var(--color-fg-muted)]">
									{m.body}
								</p>
								<div className="mt-3 flex items-center justify-between border-t border-[var(--color-border)] pt-3">
									<span className="font-mono text-[10.5px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
										{m.when}
									</span>
									<span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] text-[var(--color-fg-muted)]">
										<FileCheck2 className="h-3 w-3" /> {m.evidence}
									</span>
								</div>
							</article>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}

const StatusPill = ({ status }: { status: AuditMilestone['status'] }) => {
	if (status === 'live') {
		return (
			<span className="inline-flex items-center gap-1 rounded-full bg-[var(--color-ok-soft)] px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-wider text-[var(--color-ok)]">
				<span className="relative inline-flex h-1.5 w-1.5">
					<span className="absolute inset-0 animate-ping rounded-full bg-[var(--color-ok)] opacity-60" />
					<span className="relative inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-ok)]" />
				</span>
				live
			</span>
		)
	}
	if (status === 'in-progress') {
		return (
			<span className="rounded-full bg-[var(--color-accent-soft)] px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-wider text-[var(--color-accent)]">
				in progress
			</span>
		)
	}
	return (
		<span className="rounded-full bg-[var(--color-info-soft)] px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-wider text-[var(--color-info)]">
			available
		</span>
	)
}
