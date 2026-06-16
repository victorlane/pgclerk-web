'use client'

// Data-handling Q&A — replaces the four-card factoid grid.
//
// Four big questions arrive as the user scrolls. Each question types
// itself in letter-by-letter (mask reveal) and then the matching answer
// card slides in from the opposite side, weighted with a dot-grid
// texture so it ties back to the section.
//
// The questions are deliberately phrased the way a security reviewer
// would: "Where does my data live?", "Who can read it?", etc.
//
// Reduced-motion users get the four Q/A pairs stacked, no transforms,
// no per-letter reveal.

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Database, Eye, KeyRound, Globe2 } from 'lucide-react'

export type DataQA = {
	id: string
	icon: 'database' | 'eye' | 'key-round' | 'globe-2'
	question: string
	answerLead: string  // bold, short
	answerBody: string  // body text
	chip: string        // small chip below answer
}

const ICONS = {
	database: Database,
	eye: Eye,
	'key-round': KeyRound,
	'globe-2': Globe2
}

export default function DataQASection({ items }: { items: DataQA[] }) {
	const sectionRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const section = sectionRef.current
		if (!section) return
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

		const blocks = Array.from(section.querySelectorAll<HTMLElement>('[data-qa]'))
		if (blocks.length === 0) return

		if (reduced) {
			// Just unhide everything.
			section.querySelectorAll<HTMLElement>('[data-q-letter]').forEach(el => {
				el.style.transform = 'translateY(0)'
				el.style.opacity = '1'
			})
			section.querySelectorAll<HTMLElement>('[data-answer]').forEach(el => {
				el.style.opacity = '1'
				el.style.transform = 'translateX(0)'
			})
			return
		}

		const ctx = gsap.context(() => {
			blocks.forEach((block, i) => {
				const letters = block.querySelectorAll<HTMLElement>('[data-q-letter]')
				const answer = block.querySelector<HTMLElement>('[data-answer]')

				gsap.fromTo(
					letters,
					{ yPercent: 110 },
					{
						yPercent: 0,
						ease: 'power3.out',
						stagger: { each: 0.018 },
						scrollTrigger: {
							trigger: block,
							start: 'top 70%',
							end: 'top 35%',
							scrub: 0.6,
							invalidateOnRefresh: true
						}
					}
				)

				if (answer) {
					const fromX = i % 2 === 0 ? 60 : -60
					gsap.fromTo(
						answer,
						{ x: fromX, opacity: 0 },
						{
							x: 0,
							opacity: 1,
							ease: 'power2.out',
							scrollTrigger: {
								trigger: block,
								start: 'top 60%',
								end: 'top 30%',
								scrub: 0.6,
								invalidateOnRefresh: true
							}
						}
					)
				}
			})
		}, section)
		return () => ctx.revert()
	}, [items.length])

	return (
		<section
			ref={sectionRef}
			className="relative overflow-hidden border-b border-[var(--color-border)] bg-[var(--color-bg)]"
		>
			{/* Dot grid texture — vertical seam down the middle so each Q/A
			    row reads as if the answer card is sliding off the same
			    underlying surface. */}
			<div
				className="pointer-events-none absolute inset-0"
				aria-hidden
				style={{
					backgroundImage:
						'radial-gradient(circle at 1px 1px, var(--color-border-strong) 1px, transparent 0)',
					backgroundSize: '22px 22px',
					maskImage:
						'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
					WebkitMaskImage:
						'linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%)',
					opacity: 0.45
				}}
			/>

			<div className="relative mx-auto max-w-6xl px-6 py-24">
				<div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-accent)]">
					Data handling
				</div>
				<h2 className="mt-2 max-w-3xl text-[34px] font-semibold leading-[1.15] tracking-tight text-[var(--color-fg-strong)]">
					Four questions every privacy reviewer asks first.
				</h2>

				<div className="mt-16 flex flex-col gap-24">
					{items.map((qa, i) => {
						const Icon = ICONS[qa.icon]
						const evenRow = i % 2 === 0
						return (
							<div
								key={qa.id}
								data-qa
								className={`grid gap-10 lg:grid-cols-2 lg:items-center ${evenRow ? '' : 'lg:[direction:rtl]'}`}
							>
								{/* Question column — per-letter mask reveal. */}
								<div className="lg:[direction:ltr]">
									<div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
										<span>Q{String(i + 1).padStart(2, '0')}</span>
										<span className="h-px w-8 bg-[var(--color-border-strong)]" />
										<span>question</span>
									</div>
									<h3 className="mt-4 text-[32px] font-semibold leading-[1.1] tracking-tight text-[var(--color-fg-strong)] sm:text-[40px]">
										{splitQuestion(qa.question)}
									</h3>
								</div>

								{/* Answer column — slides in from alternating side. */}
								<div className="lg:[direction:ltr]">
									<div
										data-answer
										className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-7"
										style={{ opacity: 0 }}
									>
										<div
											className="pointer-events-none absolute inset-0"
											aria-hidden
											style={{
												backgroundImage:
													'radial-gradient(circle at 1px 1px, var(--color-border-strong) 1px, transparent 0)',
												backgroundSize: '14px 14px',
												maskImage:
													'radial-gradient(ellipse 80% 80% at 80% 100%, black 0%, transparent 80%)',
												WebkitMaskImage:
													'radial-gradient(ellipse 80% 80% at 80% 100%, black 0%, transparent 80%)',
												opacity: 0.6
											}}
										/>
										<div className="relative flex items-center gap-3">
											<span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-accent-soft)] text-[var(--color-accent)]">
												<Icon className="h-4 w-4" />
											</span>
											<span className="font-mono text-[10.5px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
												answer
											</span>
										</div>
										<div className="relative mt-4 text-[18px] font-semibold leading-snug text-[var(--color-fg-strong)]">
											{qa.answerLead}
										</div>
										<p className="relative mt-3 text-[13.5px] leading-relaxed text-[var(--color-fg-muted)]">
											{qa.answerBody}
										</p>
										<div className="relative mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-1 font-mono text-[10.5px] text-[var(--color-fg-muted)]">
											<span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-accent)]" />
											{qa.chip}
										</div>
									</div>
								</div>
							</div>
						)
					})}
				</div>
			</div>
		</section>
	)
}

// Split a question into letter-mask spans. Spaces render as fixed gaps;
// every non-space character lives in an overflow-hidden box of height 1em
// so its inner span can translate freely.
const splitQuestion = (q: string) => (
	<span className="inline-block">
		{Array.from(q).map((ch, i) => {
			if (ch === ' ') {
				return (
					<span
						key={i}
						className="inline-block"
						style={{ width: '0.3em' }}
						aria-hidden
					/>
				)
			}
			return (
				<span
					key={i}
					className="relative inline-flex overflow-hidden align-bottom"
					style={{ height: '1em', lineHeight: 1 }}
				>
					<span
						data-q-letter
						className="inline-block will-change-transform"
						style={{ transform: 'translateY(110%)' }}
					>
						{ch}
					</span>
				</span>
			)
		})}
	</span>
)
