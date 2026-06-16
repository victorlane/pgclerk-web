'use client'

// Operating week — the page's signature scroll moment.
//
// All animation distances are expressed as a fraction of the viewport
// height (window.innerHeight) so the maths scales identically across
// laptop and large-display screen sizes. No hard-coded pixel numbers,
// no runtime DOM measurement — one calculation, derived from vh.
//
// Visual model:
//   - Stage is h-screen (= 100vh).
//   - Card stack rests at vertical centre of the stage (vh 50).
//   - Heading copy occupies the top ~vh 30.
//   - Cards rotate with pivot below their centre, so positive rotation
//     sweeps them upward like a hand of cards.
//
// Constants (all in vh, multiplied by window.innerHeight at runtime):
//
//   FAN_RISE_VH   = 22  → cards rise 22 vh into the fan (lands them
//                          centred just below the heading at vh 28).
//
//   EXIT_RISE_VH  = 70  → cards keep rising another 70 vh + fade,
//                          guaranteed offscreen (above the page top).
//
//   CERT_START_VH = 60  → certificate begins 60 vh below the stage
//                          bottom — fully invisible.
//
//   CERT_END_VH   = 22  → certificate ends 22 vh below the stage
//                          bottom — its top half is in the section,
//                          bottom half overflows into the next section.
//
// ScrollTrigger end distance:
//
//   END_VH        = 250 → pin holds for 2.5 viewport heights of scroll.

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CheckCircle2, FileCheck2, PenLine, ShieldCheck } from 'lucide-react'

// All distances expressed as a fraction of viewport height so the maths
// scales identically across laptop and large-display sizes.
const FAN_RISE_VH   = 18  // how far cards translate up at the peak of the fan
const EXIT_RISE_VH  = 55  // how much further they continue rising while fading
const CERT_START_VH = 25  // cert starts this far below the stage bottom — close
                          // enough that its rise reads as the same motion as
                          // the cards leaving, not a separate beat
const CERT_END_VH   = 0   // cert ends flush with the stage bottom — no overflow
const END_VH        = 160 // pin distance; lower = faster scroll-through

interface DayEntry {
	day: string
	label: string
	headline: string
	detail: string
	tag: 'ok' | 'note' | 'change'
}

const WEEK: DayEntry[] = [
	{ day: 'Mon', label: '03 Jun', headline: 'Recovery drill',     detail: 'RPO 2m 38s · passed · signed by ops lead',           tag: 'ok' },
	{ day: 'Tue', label: '04 Jun', headline: 'Performance review', detail: 'Q2 capacity report shared with customer',            tag: 'note' },
	{ day: 'Wed', label: '05 Jun', headline: 'Change approved',    detail: 'Postgres upgrade scheduled · customer CTO signed',   tag: 'change' },
	{ day: 'Thu', label: '06 Jun', headline: 'Audit follow-up',    detail: 'Q1 evidence pack — 0 outstanding queries',           tag: 'ok' },
	{ day: 'Fri', label: '07 Jun', headline: 'Incident',           detail: 'Replication lag · 12m response · no customer impact', tag: 'note' },
	{ day: 'Sat', label: '08 Jun', headline: 'Maintenance window', detail: 'Patch applied to read replicas · zero downtime',     tag: 'ok' },
	{ day: 'Sun', label: '09 Jun', headline: 'Week closed',        detail: 'Service report drafted · countersignature pending',  tag: 'change' }
]

const TAG_TONE: Record<DayEntry['tag'], { ring: string; label: string }> = {
	ok:     { ring: 'border-[color-mix(in_oklab,var(--color-ok)_35%,var(--color-border))]',     label: 'text-[var(--color-ok)]' },
	note:   { ring: 'border-[var(--color-border-strong)]',                                       label: 'text-[var(--color-fg-muted)]' },
	change: { ring: 'border-[color-mix(in_oklab,var(--color-accent)_35%,var(--color-border))]', label: 'text-[var(--color-accent)]' }
}

export default function OperatingWeek() {
	const sectionRef = useRef<HTMLElement>(null)
	const stageRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const section = sectionRef.current
		const stage = stageRef.current
		if (!section || !stage) return

		const cards = stage.querySelectorAll<HTMLElement>('[data-week-card]')
		const certificate = stage.querySelector<HTMLElement>('[data-week-cert]')
		if (cards.length === 0 || !certificate) return

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

		// vh-to-px at the current viewport. Updated by the resize hook so
		// ScrollTrigger.refresh() recomputes with the right scale.
		const vh = () => window.innerHeight / 100

		if (reduced) {
			gsap.set(cards, { opacity: 0 })
			gsap.set(certificate, { opacity: 1, y: CERT_END_VH * vh(), scale: 1 })
			return
		}

		const ctx = gsap.context(() => {
			const fanAngle = 22
			const halfRange = (cards.length - 1) * fanAngle / 2

			// Stack — collapsed dead-centre with tiny jitter so the deck
			// reads as a stack rather than a single card.
			cards.forEach((c, i) => {
				gsap.set(c, {
					rotation: gsap.utils.random(-2, 2),
					y: 30 + i * 1.2,
					x: gsap.utils.random(-1.5, 1.5),
					transformOrigin: '50% 140%',
					zIndex: cards.length - i,
					opacity: 1
				})
			})
			gsap.set(certificate, { opacity: 0, y: CERT_START_VH * vh(), scale: 0.94 })

			const tl = gsap.timeline({
				scrollTrigger: {
					trigger: section,
					start: 'top top',
					end: () => `+=${END_VH * vh()}`,
					scrub: 0.6,
					pin: stage,
					anticipatePin: 1,
					invalidateOnRefresh: true
				}
			})

			// One smooth motion. Cards fan out as soon as they begin to
			// rise (rotation + rise run together on the same beat), and
			// the opacity fade starts at the same time so they're already
			// going translucent while spreading. No "rise → hold → fan
			// → fade" beats — every motion overlaps.
			cards.forEach((c, i) => {
				const target = -halfRange + i * fanAngle
				tl.to(c, {
					rotation: target,
					y: () => -(FAN_RISE_VH + EXIT_RISE_VH) * vh(),
					x: 0,
					opacity: 0,
					ease: 'power1.out',
					duration: 1
				}, 0)
			})

			// Certificate rises from the moment cards start moving so the
			// upward motion is shared — no waiting on each other. Final
			// y sits flush with the stage bottom; the rest of the cert
			// stays inside the section so its bottom border meets the
			// next section's top border with white-on-white.
			tl.to(certificate, {
				opacity: 1,
				y: () => CERT_END_VH * vh(),
				scale: 1,
				ease: 'power3.out',
				duration: 1
			}, 0)
		}, stage)

		// Resize — refresh ScrollTrigger so all `() => …` getters re-run
		// with the new viewport's vh.
		const onResize = () => ScrollTrigger.refresh()
		window.addEventListener('resize', onResize)
		return () => {
			window.removeEventListener('resize', onResize)
			ctx.revert()
		}
	}, [])

	return (
		<section
			ref={sectionRef}
			className="relative border-t border-[var(--color-border)] bg-[var(--color-bg)]"
		>
			{/* Pinned stage. h-screen sets the layout baseline. overflow-
			    visible lets the certificate bleed past the section's
			    bottom edge into the next block. */}
			<div
				ref={stageRef}
				className="relative h-screen w-full overflow-visible"
			>
				{/* Dotted backdrop with radial mask so it self-clips. */}
				<div
					className="pointer-events-none absolute inset-0 opacity-50"
					aria-hidden
					style={{
						backgroundImage:
							'radial-gradient(circle at 1px 1px, var(--color-border-strong) 1px, transparent 0)',
						backgroundSize: '28px 28px',
						maskImage:
							'radial-gradient(ellipse 60% 70% at 50% 50%, black 0%, black 40%, transparent 80%)',
						WebkitMaskImage:
							'radial-gradient(ellipse 60% 70% at 50% 50%, black 0%, black 40%, transparent 80%)'
					}}
				/>

				{/* Section copy — pushed down ~20vh so when the cards fade
				    and the cert lands at the stage bottom, the heading and
				    the cert frame the section together with a tight band
				    of empty space rather than a long blank middle. */}
				<div className="absolute inset-x-0 top-[20vh] z-10 mx-auto max-w-6xl px-6">
					<div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-accent)]">
						A week, on record
					</div>
					<h2 className="mt-2 max-w-2xl text-[34px] font-semibold leading-[1.15] tracking-tight text-[var(--color-fg-strong)]">
						Every operating day, written down. Closed at week's end.
					</h2>
					<p className="mt-3 max-w-xl text-[14.5px] text-[var(--color-fg-muted)]">
						An illustrative seven-day record from a Silver-tier engagement.
						Each entry is captured, attributed, and countersigned — producing
						the audit trail as a by-product of normal operations.
					</p>
				</div>

				{/* Card stack — flex-centred against the stage. */}
				<div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center px-6">
					<div className="relative h-[280px] w-full max-w-2xl">
						{WEEK.map((d, i) => (
							<DayCard key={d.day} entry={d} index={i} />
						))}
					</div>
				</div>

				{/* Certificate — bottom-anchored. Positive y values push it
				    further down (into the next section); negative would
				    push it back into the stage. */}
				<div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] flex justify-center px-6">
					<Certificate />
				</div>

			</div>
		</section>
	)
}

const DayCard = ({ entry, index: _index }: { entry: DayEntry; index: number }) => {
	const tone = TAG_TONE[entry.tag]
	return (
		<div
			data-week-card
			className={`absolute left-1/2 top-1/2 w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-[var(--color-surface)] p-4 shadow-sm sm:w-[320px] ${tone.ring}`}
			style={{ willChange: 'transform' }}
		>
			<div className="flex items-center justify-between">
				<div>
					<div className="text-[10.5px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
						{entry.day} · {entry.label}
					</div>
					<div className="mt-0.5 text-[14px] font-semibold text-[var(--color-fg-strong)]">{entry.headline}</div>
				</div>
				<div className={`${tone.label}`}>
					{entry.tag === 'ok' && <CheckCircle2 className="h-4 w-4" />}
					{entry.tag === 'change' && <PenLine className="h-4 w-4" />}
					{entry.tag === 'note' && <FileCheck2 className="h-4 w-4" />}
				</div>
			</div>
			<div className="mt-3 text-[12.5px] leading-relaxed text-[var(--color-fg-muted)]">{entry.detail}</div>
			<div className="mt-3 flex items-center justify-between border-t border-[var(--color-border)] pt-2 font-mono text-[10.5px] text-[var(--color-fg-subtle)]">
				<span>Northwind Capital</span>
				<span>signed · ops lead</span>
			</div>
		</div>
	)
}

const Certificate = () => (
	<div
		data-week-cert
		// rounded-t-2xl only — square bottom corners so the cert reads
		// as "seated" against the section divider, not floating.
		// border-x + border-t only (no bottom border) so the bottom edge
		// merges into the next section's surface for a clean continuous
		// white-on-white join.
		className="pointer-events-auto w-[360px] rounded-t-2xl border-x-2 border-t-2 border-[var(--color-fg-strong)] bg-[var(--color-surface)] p-6 sm:w-[420px]"
		// Hidden in SSR so there's no flash before GSAP picks it up.
		// 25vh matches the CERT_START_VH constant.
		style={{ willChange: 'transform, opacity', opacity: 0, transform: 'translateY(25vh) scale(0.94)' }}
	>
		<div className="flex items-center justify-between">
			<div className="flex h-9 w-9 items-center justify-center rounded-md bg-[var(--color-fg-strong)] text-white">
				<ShieldCheck className="h-4 w-4" />
			</div>
			<span className="font-mono text-[10.5px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
				Week 23 · 2026
			</span>
		</div>
		<div className="mt-4 text-[10.5px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
			Service report
		</div>
		<div className="text-[18px] font-semibold leading-tight text-[var(--color-fg-strong)]">
			Northwind Capital · weekly close
		</div>

		<div className="mt-5 space-y-1.5 text-[12.5px]">
			<Row label="Uptime"              value="99.97%" />
			<Row label="Incidents (P1 / P2)" value="0 / 1" />
			<Row label="Drills completed"    value="2 of 2" />
			<Row label="Changes recorded"    value="3, fully signed" />
			<Row label="Audit queries open"  value="0" />
		</div>

		<div className="mt-6 grid grid-cols-2 gap-4 border-t border-[var(--color-border)] pt-4">
			<SignatureLine label="pgclerk ops lead" name="A. Brinkhorst" />
			<SignatureLine label="Customer approver" name="awaiting" muted />
		</div>
	</div>
)

const Row = ({ label, value }: { label: string; value: string }) => (
	<div className="flex items-center justify-between">
		<span className="text-[var(--color-fg-muted)]">{label}</span>
		<span className="font-mono text-[var(--color-fg-strong)]">{value}</span>
	</div>
)

const SignatureLine = ({ label, name, muted = false }: { label: string; name: string; muted?: boolean }) => (
	<div>
		<div className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-fg-subtle)]">{label}</div>
		<div
			className={`mt-2 border-b border-[var(--color-border-strong)] pb-0.5 ${muted ? 'text-[var(--color-fg-subtle)]' : 'text-[var(--color-fg-strong)]'}`}
			style={{ fontFamily: 'cursive, serif' }}
		>
			{name}
		</div>
	</div>
)
