'use client'

// Horizontally-pinned control catalogue.
//
// The user scrolls vertically; we pin the row and translate it sideways
// so the next control slides into the focus zone. A flick-book-style
// active indicator follows scroll progress and tells the reader where
// they are in the sequence. This is the effect-038 idiom adapted to a
// security-controls list: one strip, one image at a time, no fuss.
//
// Reduced-motion users get a vertical stack of the same content with no
// pinning and no horizontal translation.

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
	Eye,
	FileCheck2,
	Fingerprint,
	GitBranch,
	KeyRound,
	Lock,
	ScrollText,
	Users
} from 'lucide-react'

// Icon registry — we can't pass component references from a server page
// into a client component (Next throws on the boundary), so the page
// passes the icon by name and we resolve it here.
const ICONS = {
	eye: Eye,
	'file-check': FileCheck2,
	fingerprint: Fingerprint,
	'git-branch': GitBranch,
	'key-round': KeyRound,
	lock: Lock,
	'scroll-text': ScrollText,
	users: Users
} as const

export type ControlIconName = keyof typeof ICONS

export type ControlItem = {
	num: string
	icon: ControlIconName
	label: string
	body: string
	evidence: string
}

export default function PinnedControlsScroll({ items }: { items: ControlItem[] }) {
	const sectionRef = useRef<HTMLDivElement>(null)
	const trackRef = useRef<HTMLDivElement>(null)
	const progressRef = useRef<HTMLDivElement>(null)
	const indexRef = useRef<HTMLSpanElement>(null)

	useEffect(() => {
		const section = sectionRef.current
		const track = trackRef.current
		const progress = progressRef.current
		const indexEl = indexRef.current
		if (!section || !track) return

		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (reduced) return

		const cards = Array.from(track.querySelectorAll<HTMLElement>('[data-control]'))
		if (cards.length === 0) return

		// First card is active on entry so the strip has a stable width.
		cards[0].classList.add('is-active')
		let current = cards[0]

		const ctx = gsap.context(() => {
			const dist = () => Math.max(0, track.scrollWidth - section.clientWidth)

			gsap.to(track, {
				x: () => -dist(),
				ease: 'none',
				scrollTrigger: {
					trigger: section,
					start: 'top top',
					end: () => `+=${dist() + window.innerHeight * 0.4}`,
					pin: true,
					scrub: true,
					invalidateOnRefresh: true,
					onUpdate: self => {
						const idx = Math.min(
							cards.length - 1,
							Math.round(self.progress * (cards.length - 1))
						)
						const next = cards[idx]
						if (next !== current) {
							current.classList.remove('is-active')
							next.classList.add('is-active')
							current = next
						}
						if (progress) progress.style.transform = `scaleX(${self.progress})`
						if (indexEl) indexEl.textContent = String(idx + 1).padStart(2, '0')
					}
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
			{/* Faint dot lattice running under the strip — same vocabulary as
			    the hero, dimmer, to telegraph that this section belongs to
			    the same family without competing with the cards. */}
			<div
				className="pointer-events-none absolute inset-0"
				aria-hidden
				style={{
					backgroundImage:
						'radial-gradient(circle at 1px 1px, var(--color-border-strong) 1px, transparent 0)',
					backgroundSize: '24px 24px',
					maskImage:
						'radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, black 40%, transparent 85%)',
					WebkitMaskImage:
						'radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, black 40%, transparent 85%)',
					opacity: 0.5
				}}
			/>

			<div className="relative mx-auto flex h-screen max-w-none flex-col px-6">
				<div className="mx-auto flex w-full max-w-6xl items-end justify-between pt-24">
					<div>
						<div className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-accent)]">
							Controls catalogue
						</div>
						<h2 className="mt-2 text-[34px] font-semibold leading-[1.15] tracking-tight text-[var(--color-fg-strong)]">
							Eight control families, scrolled through.
						</h2>
						<p className="mt-2 max-w-2xl text-[14.5px] text-[var(--color-fg-muted)]">
							Each is covered by a written policy, a tested procedure, and
							recurring evidence — produced as standard, not on request.
						</p>
					</div>
					<div className="hidden shrink-0 items-baseline gap-2 md:flex">
						<span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
							scroll
						</span>
						<span ref={indexRef} className="font-mono text-[44px] font-semibold leading-none text-[var(--color-fg-strong)]">
							01
						</span>
						<span className="font-mono text-[14px] text-[var(--color-fg-subtle)]">
							/ {String(items.length).padStart(2, '0')}
						</span>
					</div>
				</div>

				{/* Progress rail */}
				<div className="mx-auto mt-8 h-px w-full max-w-6xl bg-[var(--color-border)]">
					<div
						ref={progressRef}
						className="h-px origin-left bg-[var(--color-accent)]"
						style={{ transform: 'scaleX(0)' }}
					/>
				</div>

				{/* The strip itself */}
				<div className="relative flex flex-1 items-center">
					<div
						ref={trackRef}
						className="flex gap-6 will-change-transform"
						style={{ width: 'max-content' }}
					>
						{items.map(item => {
							const Icon = ICONS[item.icon]
							return (
								<article
									key={item.num}
									data-control
									className="control-card group relative flex h-[60vh] w-[78vw] max-w-[640px] shrink-0 flex-col justify-between rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-8 transition-colors"
								>
									<div>
										<div className="flex items-center justify-between">
											<span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
												control {item.num}
											</span>
											<span className="control-icon inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-surface-2)] text-[var(--color-fg-strong)] transition">
												<Icon className="h-4 w-4" />
											</span>
										</div>
										<h3 className="mt-8 text-[30px] font-semibold leading-[1.1] tracking-tight text-[var(--color-fg-strong)]">
											{item.label}
										</h3>
										<p className="mt-5 max-w-md text-[14.5px] leading-relaxed text-[var(--color-fg-muted)]">
											{item.body}
										</p>
									</div>

									<div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4">
										<div className="font-mono text-[10.5px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
											Recurring evidence
										</div>
										<div className="mt-2 font-mono text-[12.5px] text-[var(--color-fg)]">
											{item.evidence}
										</div>
									</div>

									{/* Accent rail along the bottom — fades up when active. */}
									<div
										className="control-rail pointer-events-none absolute inset-x-8 bottom-0 h-px origin-left bg-[var(--color-accent)] opacity-0 transition"
										aria-hidden
									/>
								</article>
							)
						})}
					</div>
				</div>
			</div>
		</section>
	)
}
