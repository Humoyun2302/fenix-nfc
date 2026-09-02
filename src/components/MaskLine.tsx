import type { CSSProperties, ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

/**
 * Editorial line reveal: the text rises out of an overflow-hidden slot when it
 * enters the viewport. The slot keeps a small bottom pad so descenders and
 * diacritics survive the clip.
 */
export function MaskLine({
  children,
  delay = 0,
  className = '',
  style,
}: {
  children: ReactNode
  delay?: number
  className?: string
  style?: CSSProperties
}) {
  const ref = useReveal<HTMLSpanElement>()
  return (
    <span ref={ref} className={`mline ${className}`.trim()} style={style}>
      <span className="mline__in" style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
        {children}
      </span>
    </span>
  )
}
