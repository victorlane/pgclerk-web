'use client'

// Incident response — three-step trace.
//
// As the user scrolls, an SVG stroke draws itself from the first step's
// dot down through the second and third. Each step's panel rises into
// view as the stroke reaches it. The stroke is the visual analogue of
// the incident's clock: detect → contain → postmortem.
//
// Reduced-motion users get the three steps as a static vertical list.

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { type LucideIcon, Activity, Headphones, FileText } from 'lucide-react'

export type TraceStep = {
	num: string
	icon: LucideIcon
	title: string
	body: string
	metric: { label: string; value: string }
}

export const DEFAULT_TRACE_STEPS: TraceStep[] = [
	{
		num: '01',
		icon: Activity,
		title: 'Detect',
		body: "Monitoring fires on the operator and on-call channels simultaneously. P1 incidents acknowledged within the tier's response commitment — 15 minutes (Silver) or 5 minutes (Gold).",
		metric: { label: 'p1 ack', value: '≤ 5 min' }
	},
	{
		num: '02',
		icon: Headphones,
		title: 'Contain & communicate',
		body: 'A single named operator owns the incident. Customer notified through the agreed channel within 30 minutes of confirmation. Status page updated continuously.',
		metric: { label: 'first comms', value: '≤ 30 min' }
	},
	{
		num: '03',
		icon: FileText,
		title: 'Postmortem',
		body: 'Written postmortem within 5 business days. Includes timeline, root cause, customer impact, and remediation. Countersigned by both parties for the audit record.',
		metric: { label: 'delivery', value: '≤ 5 bd' }
	}
]

export default function IncidentTrace({ steps = DEFAULT_TRACE_STEPS }: { steps?: TraceStep[] }) {
	const sectionRef = useRef<HTMLDivElement>(null)
	const pathRef = useRef<SVGPathElement>(null)

	useEffect(() => {
		const section = sectionRef.current
		const path = pathRef.current
		if (!section || !path) return
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

		const panels = Array.from(section.querySelectorAll<HTMLElement>('[data-step]'))
		const length = path.getTotalLength()
		path.style.strokeDasharray = `${length}`

		if (reduced) {
			path.style.strokeDashoffset = '0'
			panels.forEach(p => { p.style.opacity = '1'; p.style.transform = 'translateY(0)' })
			return
		}

		path.style.strokeDashoffset = `${length}`

		const ctx = gsap.context(() => {
			gsap.to(path, {
				strokeDashoffset: 0,
				ease: 'none',
				scrollTrigger: {
					trigger: section,
					start: 'top 70%',
					end: 'bottom 40%',
					scrub: 0.6
				}
			})
			panels.forEach((panel, i) => {
				gsap.fromTo(
					panel,
					{ y: 40, opacity: 0 },
					{
						y: 0,
						opacity: 1,
						ease: 'power2.out',
						scrollTrigger: {
							trigger: panel,
							start: 'top 80%',
							end: 'top 55%',
							scrub: 0.6
						}
					}
				)
				const dot = panel.querySelector<HTMLElement>('[data-dot]')
				if (dot) {
					gsap.fromTo(
						dot,
						{ scale: 0.6, opacity: 0.4 },
						{
							scale: 1,
							opacity: 1,
							ease: 'back.out(2)',
							scrollTrigger: {
								trigger: panel,
								start: 'top 70%',
								end: 'top 55%',
								scrub: 0.6
							}
						}
					)
				}
				// Stagger guard against stale i in dep array
				void i
			})
		}, section)
		return () => ctx.revert()
	}, [steps.length])

	return (
		<section
			ref={sectionRef}
			className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-surface)]"
		>
			<div
				className="pointer-events-none absolute inset-0"
				aria-hidden
				style={{
					backgroundImage:
						'radial-gradient(circle at 1px 1px, var(--color-border-strong) 1px, transparent 0)',
					backgroundSize: '22px 22px',
					maskImage:
						'radial-gradient(ellipse 60% 80% at 50% 50%, black 0%, color-mix(in oklab, black 60%, transparent) 50%, transparent 90%)',
					WebkitMaskImage:
						'radial-gradient(ellipse 60% 80% at 50% 50%, black 0%, color-mix(in oklab, black 60%, transparent) 50%, transparent 90%)',
					opacity: 0.55
				}}
			/>

			<div className="relative mx-auto max-w-6xl px-6 py-24">
				<div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-accent)]">
					Incident response
				</div>
				<h2 className="mt-2 max-w-3xl text-[34px] font-semibold leading-[1.15] tracking-tight text-[var(--color-fg-strong)]">
					What happens when something goes wrong.
				</h2>

				<div className="relative mt-16 grid grid-cols-[64px_1fr] gap-x-6">
					{/* SVG trace runs the full column height — its path
					    connects all three step dots. */}
					<svg
						className="pointer-events-none absolute inset-y-0 left-[31px] -z-0 h-full"
						width="2"
						viewBox="0 0 2 1000"
						preserveAspectRatio="none"
						aria-hidden
					>
						<path
							ref={pathRef}
							d="M1 0 L1 1000"
							stroke="var(--color-accent)"
							strokeWidth="2"
							fill="none"
						/>
					</svg>

					<div className="col-span-2 flex flex-col gap-10">
						{steps.map(step => {
							const Icon = step.icon
							return (
								<article
									key={step.num}
									data-step
									className="relative grid grid-cols-[64px_1fr] items-start gap-6"
									style={{ opacity: 0 }}
								>
									<div className="relative flex items-start justify-center pt-2">
										<span
											data-dot
											className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border-strong)] bg-[var(--color-surface)] text-[var(--color-accent)] shadow-sm"
										>
											<Icon className="h-4 w-4" />
											<span className="absolute -inset-1 rounded-full border border-[var(--color-accent)] opacity-25" />
										</span>
									</div>

									<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
										<div className="flex items-center justify-between">
											<div className="flex items-baseline gap-3">
												<span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-accent)]">
													step {step.num}
												</span>
												<h3 className="text-[20px] font-semibold leading-tight text-[var(--color-fg-strong)]">
													{step.title}
												</h3>
											</div>
											<div className="hidden items-baseline gap-2 md:flex">
												<span className="font-mono text-[10.5px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
													{step.metric.label}
												</span>
												<span className="font-mono text-[14px] font-semibold text-[var(--color-fg-strong)]">
													{step.metric.value}
												</span>
											</div>
										</div>
										<p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-[var(--color-fg-muted)]">
											{step.body}
										</p>
									</div>
								</article>
							)
						})}
					</div>
				</div>
			</div>
		</section>
	)
}
