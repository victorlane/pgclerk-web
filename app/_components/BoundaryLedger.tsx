'use client'

// Shared-responsibility boundary ledger.
//
// A vertical dotted rail runs down the middle of the section. Rows pile
// up alongside it: pgclerk-owned cells slide in from the left of the
// rail, customer-owned cells slide in from the right. As scroll
// progresses, an accent glow walks down the rail and rows reveal in
// staggered order.
//
// Reduced-motion users get a static two-column list with no transforms.

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CheckCircle2, MinusCircle } from 'lucide-react'

export type BoundaryRow = {
	area: string
	pgclerk: string | null   // null renders as an explicit no-op cell
	customer: string
}

export default function BoundaryLedger({ rows }: { rows: BoundaryRow[] }) {
	const sectionRef = useRef<HTMLDivElement>(null)
	const railFillRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const section = sectionRef.current
		if (!section) return
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

		const left = Array.from(section.querySelectorAll<HTMLElement>('[data-left]'))
		const right = Array.from(section.querySelectorAll<HTMLElement>('[data-right]'))
		if (left.length === 0) return

		if (reduced) {
			[...left, ...right].forEach(el => {
				el.style.opacity = '1'
				el.style.transform = 'translateX(0)'
			})
			return
		}

		const ctx = gsap.context(() => {
			gsap.fromTo(
				left,
				{ x: -50, opacity: 0 },
				{
					x: 0,
					opacity: 1,
					stagger: 0.08,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: section,
						start: 'top 70%',
						end: 'bottom 60%',
						scrub: 0.6
					}
				}
			)
			gsap.fromTo(
				right,
				{ x: 50, opacity: 0 },
				{
					x: 0,
					opacity: 1,
					stagger: 0.08,
					ease: 'power2.out',
					scrollTrigger: {
						trigger: section,
						start: 'top 70%',
						end: 'bottom 60%',
						scrub: 0.6
					}
				}
			)
			gsap.to(railFillRef.current, {
				scaleY: 1,
				ease: 'none',
				scrollTrigger: {
					trigger: section,
					start: 'top 80%',
					end: 'bottom 50%',
					scrub: true
				}
			})
		}, section)
		return () => ctx.revert()
	}, [rows.length])

	return (
		<section
			id="shared-responsibility"
			ref={sectionRef}
			className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-bg)]"
		>
			<div
				className="pointer-events-none absolute inset-0"
				aria-hidden
				style={{
					backgroundImage:
						'radial-gradient(circle at 1px 1px, var(--color-border-strong) 1px, transparent 0)',
					backgroundSize: '20px 20px',
					maskImage:
						'linear-gradient(to right, transparent 0%, black 8%, color-mix(in oklab, black 35%, transparent) 50%, black 92%, transparent 100%)',
					WebkitMaskImage:
						'linear-gradient(to right, transparent 0%, black 8%, color-mix(in oklab, black 35%, transparent) 50%, black 92%, transparent 100%)',
					opacity: 0.5
				}}
			/>

			<div className="relative mx-auto max-w-6xl px-6 py-24">
				<div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-accent)]">
					Shared-responsibility model
				</div>
				<h2 className="mt-2 max-w-3xl text-[34px] font-semibold leading-[1.15] tracking-tight text-[var(--color-fg-strong)]">
					Who is on the hook for what, in writing.
				</h2>
				<p className="mt-3 max-w-2xl text-[14.5px] text-[var(--color-fg-muted)]">
					The boundary is set at contract and reproduced verbatim in the
					Master Services Agreement. There is no ambiguity about ownership
					when an incident occurs.
				</p>

				<div className="relative mt-14">
					{/* Central rail. The static dashed line is always visible; an
					    accent line on top scales-Y from 0 → 1 with scroll. */}
					<div className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2">
						<div
							className="h-full w-px"
							style={{
								backgroundImage:
									'linear-gradient(to bottom, var(--color-border-strong) 50%, transparent 50%)',
								backgroundSize: '1px 8px'
							}}
						/>
						<div
							ref={railFillRef}
							className="absolute inset-x-0 top-0 h-full w-px origin-top bg-[var(--color-accent)]"
							style={{ transform: 'scaleY(0)' }}
						/>
					</div>

					{/* Column headers. */}
					<div className="mb-6 grid grid-cols-[1fr_auto_1fr] items-end gap-6">
						<div className="text-right font-mono text-[10.5px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
							pgclerk operates
						</div>
						<div className="w-16 text-center font-mono text-[10.5px] uppercase tracking-wider text-[var(--color-accent)]">
							area
						</div>
						<div className="text-left font-mono text-[10.5px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
							customer owns
						</div>
					</div>

					<ul className="flex flex-col gap-3">
						{rows.map(r => (
							<li
								key={r.area}
								className="grid grid-cols-[1fr_auto_1fr] items-center gap-6"
							>
								<div
									data-left
									className="ml-auto inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 px-4 py-2.5 text-[13px] text-[var(--color-fg)] backdrop-blur"
									style={{ opacity: 0 }}
								>
									{r.pgclerk === null
										? (
											<span className="inline-flex items-center gap-2 text-[var(--color-fg-subtle)]">
												<MinusCircle className="h-3.5 w-3.5" />
												not in scope
											</span>
										)
										: (
											<span className="inline-flex items-center gap-2">
												<CheckCircle2 className="h-3.5 w-3.5 text-[var(--color-ok)]" />
												{r.pgclerk}
											</span>
										)
									}
								</div>

								<div className="w-32 text-center font-mono text-[11px] text-[var(--color-fg-strong)]">
									{r.area}
								</div>

								<div
									data-right
									className="mr-auto inline-flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)]/95 px-4 py-2.5 text-[13px] text-[var(--color-fg-muted)] backdrop-blur"
									style={{ opacity: 0 }}
								>
									{r.customer}
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	)
}
