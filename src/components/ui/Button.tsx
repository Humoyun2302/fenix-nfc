import { ArrowRight } from 'lucide-react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'ink' | 'glass' | 'quiet'
type Size = 'md' | 'lg'

const base =
  'group relative inline-flex w-auto shrink-0 min-h-11 items-center justify-center gap-2 rounded-full font-medium tracking-[-0.01em] transition-[transform,background-color,box-shadow,color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.985] select-none disabled:pointer-events-none disabled:opacity-55'

const sizes: Record<Size, string> = {
  md: 'px-5 text-[0.9375rem] sm:px-6',
  lg: 'px-6 py-3.5 text-[0.9375rem] sm:px-8 sm:text-base',
}

const variants: Record<Variant, string> = {
  ink: 'bg-ink text-white shadow-[0_1px_2px_rgba(17,17,17,0.16),0_16px_36px_-16px_rgba(17,17,17,0.45)] hover:bg-[#1c1c1e] hover:shadow-[0_1px_2px_rgba(17,17,17,0.2),0_22px_46px_-18px_rgba(17,17,17,0.5)]',
  glass:
    'glass text-ink hover:bg-[rgba(255,255,255,0.68)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_2px_4px_rgba(24,30,56,0.05),0_28px_56px_-24px_rgba(24,30,56,0.22)]',
  quiet:
    'text-ink/80 hover:text-ink border border-[color:var(--fx-hairline)] hover:border-[color:var(--fx-hairline-strong)] bg-white/30',
}

type CommonProps = {
  children: ReactNode
  variant?: Variant
  size?: Size
  /** Renders the sliding arrow affordance. */
  arrow?: boolean
  className?: string
}

function content(children: ReactNode, arrow: boolean) {
  return (
    <>
      <span className="relative z-1">{children}</span>
      {arrow ? (
        <ArrowRight
          className="relative z-1 size-4 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-1"
          aria-hidden="true"
        />
      ) : null}
    </>
  )
}

export function ButtonLink({
  children,
  variant = 'ink',
  size = 'lg',
  arrow = false,
  className = '',
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} {...rest}>
      {content(children, arrow)}
    </a>
  )
}

export function Button({
  children,
  variant = 'ink',
  size = 'lg',
  arrow = false,
  className = '',
  type = 'button',
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type={type}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...rest}
    >
      {content(children, arrow)}
    </button>
  )
}
