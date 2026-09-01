import { NfcMark, QrPattern } from './marks'

/**
 * Frosted acrylic plaque with corner standoffs. `tone="dark"` is designed
 * for ink backgrounds (frosted white), `tone="light"` for paper backgrounds.
 */
export function AcrylicPlaque({
  x,
  y,
  width = 520,
  tone = 'dark',
  className,
}: {
  x?: number
  y?: number
  width?: number
  tone?: 'dark' | 'light'
  className?: string
}) {
  const height = width * (360 / 520)
  const dark = tone === 'dark'
  const base = dark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.6)'
  const border = dark ? 'rgba(255,255,255,0.42)' : 'rgba(10,10,10,0.35)'
  const borderSoft = dark ? 'rgba(255,255,255,0.12)' : 'rgba(10,10,10,0.08)'
  const content = dark ? 'rgba(255,255,255,0.92)' : 'rgba(10,10,10,0.78)'
  const sheen = dark ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.55)'
  const standOut = dark ? 'rgba(255,255,255,0.2)' : '#E6E2D8'
  const standRing = dark ? 'rgba(255,255,255,0.55)' : 'rgba(10,10,10,0.4)'
  const standCore = dark ? '#101010' : '#66625A'

  return (
    <svg viewBox="0 0 520 360" x={x} y={y} width={width} height={height} className={className} aria-hidden="true">
      <rect x="6" y="6" width="508" height="348" rx="24" fill={base} stroke={border} strokeWidth="1.3" />
      <rect x="14" y="14" width="492" height="332" rx="18" fill="none" stroke={borderSoft} strokeWidth="1" />
      {/* light sweep */}
      <path d="M132 6 L232 6 L96 354 L48 354 Z" fill={sheen} />
      <path d="M268 6 L296 6 L196 354 L176 354 Z" fill={sheen} opacity="0.6" />
      {/* standoffs */}
      {[
        [34, 34],
        [486, 34],
        [34, 326],
        [486, 326],
      ].map(([cx, cy]) => (
        <g key={`${cx}-${cy}`}>
          <circle cx={cx} cy={cy} r="8" fill={standOut} stroke={standRing} strokeWidth="1.1" />
          <circle cx={cx} cy={cy} r="3.1" fill={standCore} />
        </g>
      ))}
      {/* frosted print */}
      <NfcMark x={76} y={116} scale={3.6} color={content} />
      <svg x="304" y="94" width="152" height="152" viewBox="0 0 152 152">
        <QrPattern x={0} y={0} size={152} color={content} />
      </svg>
      <text
        x="76"
        y="312"
        fontFamily="'Inter Tight Variable','Inter Variable',Arial,sans-serif"
        fontSize="13"
        fontWeight="650"
        letterSpacing="5.5"
        fill={content}
      >
        FENIX
      </text>
      <circle cx="452" cy="308" r="4" fill="#FF4B00" />
    </svg>
  )
}
