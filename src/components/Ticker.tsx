import { NfcSymbol } from './marks'

/**
 * Continuously running text band. Two identical segments scroll -50% for a
 * seamless loop; reduced-motion users get a static band. Decorative — the
 * content it repeats always exists elsewhere on the page.
 */
export function Ticker({
  items,
  variant = 'ember',
  duration = 26,
  className = '',
}: {
  items: string[]
  variant?: 'ember' | 'line'
  duration?: number
  className?: string
}) {
  const sep =
    variant === 'ember' ? (
      <NfcSymbol size={14} className="ticker__sep" strokeWidth={2.4} />
    ) : (
      <i className="ticker__dot" />
    )
  return (
    <div className={`ticker ticker--${variant} ${className}`.trim()} aria-hidden="true">
      <div className="ticker__track" style={{ animationDuration: `${duration}s` }}>
        {[0, 1].map((seg) => (
          <div className="ticker__seg" key={seg}>
            {items.map((s, i) => (
              <span className="ticker__item" key={i}>
                {s}
                {sep}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
