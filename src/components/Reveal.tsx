import type { CSSProperties, ElementType, ReactNode } from 'react'
import { useReveal } from '../hooks/useReveal'

interface RevealProps {
  as?: ElementType
  delay?: number
  className?: string
  style?: CSSProperties
  id?: string
  children?: ReactNode
}

export function Reveal({ as = 'div', delay = 0, className = '', style, children, ...rest }: RevealProps) {
  const ref = useReveal<HTMLElement>()
  const Tag = as as ElementType
  return (
    <Tag
      ref={ref}
      className={`rv ${className}`.trim()}
      style={{ ...style, transitionDelay: delay ? `${delay}ms` : undefined }}
      {...rest}
    >
      {children}
    </Tag>
  )
}
