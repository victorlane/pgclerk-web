'use client'

// Per-letter mask reveal for the security hero heading.
//
// Each non-space character lives inside its own overflow-hidden box of
// height 1em. On mount the inner letter starts translated 100% below the
// mask and tweens up into place, staggered left-to-right. The result
// reads as a flick-board "type-on" without re-running on scroll.
//
// Reduced-motion users get the static heading with no transforms.

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

type Props = {
	lines: string[]
	className?: string
	// Lines whose visible colour should be the softer body fg instead of
	// the strong heading fg. Used to tint the second line of the hero.
	accentLineIndex?: number
}

export default function SecurityHeroLetters({ lines, className, accentLineIndex }: Props) {
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const el = ref.current
		if (!el) return
		const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
		const letters = el.querySelectorAll<HTMLElement>('[data-letter] > span')
		if (reduced) {
			gsap.set(letters, { yPercent: 0, opacity: 1 })
			return
		}

		const ctx = gsap.context(() => {
			gsap.fromTo(
				letters,
				{ yPercent: 100 },
				{
					yPercent: 0,
					duration: 0.7,
					ease: 'power3.out',
					stagger: { each: 0.022, from: 'start' }
				}
			)
		}, el)
		return () => ctx.revert()
	}, [lines])

	return (
		<div ref={ref} className={className}>
			{lines.map((line, li) => {
				const accent = li === accentLineIndex
				return (
					<div key={li} className="flex flex-wrap justify-center">
						{Array.from(line).map((ch, ci) => {
							if (ch === ' ') {
								return (
									<span
										key={ci}
										className="inline-block"
										style={{ width: '0.3em' }}
										aria-hidden
									/>
								)
							}
							return (
								<span
									key={ci}
									data-letter
									className="relative inline-flex overflow-hidden"
									style={{
										lineHeight: 1,
										height: '1em',
										color: accent ? 'var(--color-fg)' : 'var(--color-fg-strong)'
									}}
								>
									<span className="inline-block will-change-transform">{ch}</span>
								</span>
							)
						})}
					</div>
				)
			})}
		</div>
	)
}
