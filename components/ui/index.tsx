// Minimal UI primitives for the marketing site.
//
// The operator console has a full design system (Card, Tabs, Sheet,
// Tooltip, DataTable, …) — those don't belong here. The only thing the
// marketing pages reach for from the system today is `Badge`, so we
// keep just Badge plus the tiny `cn` helper it uses.

import type { ReactNode } from 'react'
import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))

export type BadgeTone = 'default' | 'ok' | 'warn' | 'err' | 'accent' | 'muted' | 'info'

export const Badge = ({
	tone = 'default',
	children,
	className,
	dot
}: {
	tone?: BadgeTone
	children: ReactNode
	className?: string
	dot?: boolean
}) => (
	<span
		className={cn(
			'inline-flex items-center gap-1 rounded-md px-1.5 py-[1px] text-[10.5px] font-medium border tracking-wide',
			tone === 'default' &&
				'bg-[var(--color-surface-2)] text-[var(--color-fg)] border-[var(--color-border)]',
			tone === 'muted' &&
				'bg-transparent text-[var(--color-fg-muted)] border-[var(--color-border)]',
			tone === 'ok' && 'bg-[var(--color-ok-soft)] text-[var(--color-ok)] border-[#bbf7d0]',
			tone === 'warn' && 'bg-[var(--color-warn-soft)] text-[var(--color-warn)] border-[#fde68a]',
			tone === 'err' && 'bg-[var(--color-err-soft)] text-[var(--color-err)] border-[#fecaca]',
			tone === 'accent' && 'bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-[#c7d2fe]',
			tone === 'info' && 'bg-[var(--color-info-soft)] text-[var(--color-info)] border-[#a5f3fc]',
			className
		)}
	>
		{dot && (
			<span
				className={cn(
					'inline-block h-1.5 w-1.5 rounded-full',
					tone === 'ok' && 'bg-[var(--color-ok)]',
					tone === 'warn' && 'bg-[var(--color-warn)]',
					tone === 'err' && 'bg-[var(--color-err)]',
					tone === 'accent' && 'bg-[var(--color-accent)]',
					tone === 'info' && 'bg-[var(--color-info)]',
					tone === 'default' && 'bg-[var(--color-fg-subtle)]',
					tone === 'muted' && 'bg-[var(--color-fg-subtle)]'
				)}
				aria-hidden
			/>
		)}
		{children}
	</span>
)
