import { motion, useInView, type Transition } from 'motion/react'
import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type RevealProps = {
  children: ReactNode
  as?: ElementType
  className?: string
  /** Seconds of delay — keep stagger increments small (0.06–0.1). */
  delay?: number
  /** Vertical travel in pixels. */
  y?: number
  blur?: number
  once?: boolean
  amount?: number
}

const transition: Transition = {
  duration: 1.05,
  ease: [0.22, 1, 0.36, 1],
}

/**
 * The site's single reveal gesture: blur-to-clear with a short rise.
 * Everything uses this so the whole page shares one motion signature.
 */
export function Reveal({
  children,
  as = 'div',
  className,
  delay = 0,
  y = 22,
  blur = 8,
  once = true,
  amount = 0.3,
}: RevealProps) {
  const reduced = useReducedMotion()
  const MotionTag = motion[as as 'div'] ?? motion.div

  if (reduced) {
    const Tag = as as ElementType
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y, filter: `blur(${blur}px)` }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, amount }}
      transition={{ ...transition, delay }}
    >
      {children}
    </MotionTag>
  )
}

type MaskedLinesProps = {
  lines: string[]
  className?: string
  lineClassName?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p'
  id?: string
}

/**
 * Masked line-by-line headline reveal. Each line sits in an overflow-hidden
 * wrapper and rises into place — the editorial workhorse of the page.
 */
export function MaskedLines({
  lines,
  className,
  lineClassName,
  delay = 0,
  as: Tag = 'h2',
  id,
}: MaskedLinesProps) {
  const reduced = useReducedMotion()

  if (reduced) {
    return (
      <Tag className={className} id={id}>
        {lines.map((line) => (
          <span key={line} className={`block ${lineClassName ?? ''}`}>
            {line}
          </span>
        ))}
      </Tag>
    )
  }

  return (
    <Tag className={className} id={id}>
      {lines.map((line, index) => (
        <MaskedLine
          key={line}
          delay={delay + index * 0.085}
          className={lineClassName}
        >
          {line}
        </MaskedLine>
      ))}
    </Tag>
  )
}

function MaskedLine({
  children,
  delay,
  className = '',
}: {
  children: ReactNode
  delay: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.05, margin: '80px 0px' })
  const [fallback, setFallback] = useState(false)

  useEffect(() => {
    const id = window.setTimeout(() => setFallback(true), 700)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <span ref={ref} className="block overflow-hidden pb-[0.06em]">
      <motion.span
        className={`block ${className}`}
        initial={{ y: '110%' }}
        animate={inView || fallback ? { y: '0%' } : { y: '110%' }}
        transition={{
          duration: 1.15,
          ease: [0.19, 1, 0.22, 1],
          delay,
        }}
      >
        {children}
      </motion.span>
    </span>
  )
}
