type WordmarkProps = {
  className?: string
  /** Renders the "NFC" suffix next to the name. */
  suffix?: boolean
}

/**
 * The Fenix mark: the contactless wave set as a monogram, followed by the
 * wordmark. Drawn as SVG so it stays crisp and independent of font loading.
 */
export function Wordmark({ className = '', suffix = true }: WordmarkProps) {
  return (
    <svg
      viewBox="0 0 118 22"
      className={className}
      role="img"
      aria-label="Fenix NFC"
      fill="none"
    >
      <g stroke="currentColor" strokeWidth={1.7} strokeLinecap="round">
        <path d="M3 5.4a10 10 0 0 1 0 11.2" />
        <path d="M7.6 7.6a5.9 5.9 0 0 1 0 6.8" />
        <path d="M12 9.8a1.9 1.9 0 0 1 0 2.4" />
      </g>
      <text
        x="20"
        y="17"
        fill="currentColor"
        style={{
          font: '600 18px/1 Inter, system-ui, sans-serif',
          letterSpacing: '-0.045em',
        }}
      >
        Fenix
      </text>
      {suffix ? (
        <text
          x="70"
          y="17"
          fill="currentColor"
          opacity="0.42"
          style={{
            font: '500 11px/1 Inter, system-ui, sans-serif',
            letterSpacing: '0.16em',
          }}
        >
          NFC
        </text>
      ) : null}
    </svg>
  )
}
