'use client'

// Pinned 3D scrolling catalogue of security controls.
//
// One section, six slides. As the user scrolls vertically the current
// slide stays pinned at the viewport top and the next slide arrives
// behind it; each slide receives an rotationX + Z-recede + opacity
// fade as it leaves. The pin distance is computed from slide count
// at runtime so we never use fixed-px translations.
//
// Reduced-motion users see all six slides stacked vertically with no
// transform — same content, no animation.

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export type ControlSlide = {
	num: string
	title: string
	body: string
	bullets: string[]
	side: 'evidence' | 'grid'
	evidence?: { label: string; value: string }[]
}

export default function ControlsStack({ slides }: { slides: ControlSlide[] }) {
	const wrapRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const wrap = wrapRef.current
		if (!wrap) return
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		if (reduced) return

		const slideEls = Array.from(wrap.querySelectorAll<HTMLElement>('[data-slide]'))
		if (slideEls.length === 0) return

		// One full viewport of scroll per slide transition (n - 1 transitions
		// after the first slide is already in view). Recomputed on resize via
		// ScrollTrigger.refresh().
		const ctx = gsap.context(() => {
			const sectionHeight = () => window.innerHeight * slideEls.length

			// Pin the inner stage for the duration of the section.
			const pinTrigger = ScrollTrigger.create({
				trigger: wrap,
				start: 'top top',
				end: () => `+=${sectionHeight()}`,
				pin: '[data-stage]',
				pinSpacing: true,
				anticipatePin: 1,
				invalidateOnRefresh: true
			})

			// For each slide except the last, drive its exit transform from
			// progress over its own viewport-height window.
			slideEls.forEach((el, i) => {
				if (i === slideEls.length - 1) return
				gsap.to(el, {
					rotationX: -28,
					z: -180,
					opacity: 0,
					ease: 'none',
					scrollTrigger: {
						trigger: wrap,
						start: () => `${i * window.innerHeight} top`,
						end: () => `${(i + 1) * window.innerHeight} top`,
						scrub: true,
						invalidateOnRefresh: true
					}
				})
			})

			// Also bring each subsequent slide up from below as the prior
			// one fades. Each starts at translateY(40px) and opacity ~0.4
			// and resolves to neutral as the prior slide's exit completes.
			slideEls.forEach((el, i) => {
				if (i === 0) return
				gsap.fromTo(el,
					{ y: 60, opacity: 0.0 },
					{
						y: 0,
						opacity: 1,
						ease: 'none',
						scrollTrigger: {
							trigger: wrap,
							start: () => `${(i - 1) * window.innerHeight} top`,
							end: () => `${i * window.innerHeight} top`,
							scrub: true,
							invalidateOnRefresh: true
						}
					}
				)
			})

			return () => { pinTrigger.kill() }
		}, wrap)

		return () => ctx.revert()
	}, [slides.length])

	return (
		<div ref={wrapRef} className="relative">
			<div data-stage className="relative h-screen w-full" style={{ perspective: 1400 }}>
				<div className="relative mx-auto h-full max-w-6xl px-6">
					{slides.map((s, i) => (
						<Slide key={s.num} slide={s} index={i} total={slides.length} />
					))}
				</div>
			</div>
		</div>
	)
}

const Slide = ({ slide, index, total }: { slide: ControlSlide; index: number; total: number }) => (
	<div
		data-slide
		className="absolute inset-0 flex items-center"
		style={{
			transformStyle: 'preserve-3d',
			willChange: 'transform, opacity',
			zIndex: total - index
		}}
	>
		<div className="grid w-full items-start gap-10 lg:grid-cols-[1.15fr_0.85fr]">
			<div>
				<div className="flex items-baseline gap-4">
					<span className="font-mono text-[64px] font-semibold leading-none tracking-tight text-[var(--color-fg-subtle)]">
						{slide.num}
					</span>
					<span className="font-mono text-[11px] uppercase tracking-wider text-[var(--color-accent)]">
						control domain
					</span>
				</div>
				<h3 className="mt-4 text-[40px] font-semibold leading-[1.05] tracking-tight text-[var(--color-fg-strong)]">
					{slide.title}
				</h3>
				<p className="mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--color-fg-muted)]">
					{slide.body}
				</p>
				<ul className="mt-6 space-y-2.5 text-[13.5px] leading-relaxed text-[var(--color-fg)]">
					{slide.bullets.map(b => (
						<li key={b} className="flex gap-2.5">
							<span className="mt-[7px] inline-block h-1 w-1 shrink-0 rounded-full bg-[var(--color-accent)]" />
							<span>{b}</span>
						</li>
					))}
				</ul>
			</div>

			<div className="lg:pt-4">
				{slide.side === 'evidence' && slide.evidence ? (
					<EvidenceCard items={slide.evidence} title={slide.title} />
				) : (
					<GridPanel />
				)}
			</div>
		</div>
	</div>
)

const EvidenceCard = ({ items, title }: { items: { label: string; value: string }[]; title: string }) => (
	<div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] shadow-sm">
		<div className="flex items-center justify-between border-b border-[var(--color-border)] px-5 py-3">
			<div className="font-mono text-[10.5px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
				Evidence sample
			</div>
			<div className="font-mono text-[10.5px] text-[var(--color-ok)]">signed</div>
		</div>
		<div className="px-5 py-4">
			<div className="text-[12.5px] text-[var(--color-fg-muted)]">{title}</div>
			<dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
				{items.map(it => (
					<div key={it.label} className="contents">
						<dt className="font-mono text-[10.5px] uppercase tracking-wider text-[var(--color-fg-subtle)]">
							{it.label}
						</dt>
						<dd className="font-mono text-[11.5px] text-[var(--color-fg)]">{it.value}</dd>
					</div>
				))}
			</dl>
		</div>
		<div className="border-t border-[var(--color-border)] bg-[var(--color-surface-2)] px-5 py-2 font-mono text-[10.5px] text-[var(--color-fg-subtle)]">
			countersigned · retained 365d
		</div>
	</div>
)

const GridPanel = () => (
	<div className="relative overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]">
		<div
			className="bg-dotgrid h-[260px] w-full"
			aria-hidden
			style={{
				maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 80%)',
				WebkitMaskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 0%, transparent 80%)'
			}}
		/>
		<div
			className="pointer-events-none absolute inset-0"
			aria-hidden
			style={{
				background:
					'radial-gradient(ellipse 60% 60% at 50% 50%, color-mix(in oklab, var(--color-accent) 9%, transparent), transparent 70%)'
			}}
		/>
		<div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-[var(--color-border)] bg-[var(--color-surface-2)] px-4 py-2 font-mono text-[10.5px] text-[var(--color-fg-subtle)]">
			<span>operational lattice</span>
			<span>continuous</span>
		</div>
	</div>
)

// Used externally as part of the section frame to satisfy TS exhaustive
// type imports if a consumer needs them.
export type _ControlSlide_ = ControlSlide
export const _slidesAccept = (s: ReactNode): ReactNode => s
