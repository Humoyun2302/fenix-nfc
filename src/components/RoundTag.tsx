import { useId } from 'react'
import { NfcMark } from './marks'

/** Small circular wooden NFC tag (gyms, keychains, machines). */
export function RoundTag({
  x,
  y,
  width = 220,
  className,
}: {
  x?: number
  y?: number
  width?: number
  className?: string
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const grad = `tg${uid}`
  const noise = `tn${uid}`
  const clip = `tc${uid}`

  return (
    <svg viewBox="0 0 220 220" x={x} y={y} width={width} height={width} className={className} aria-hidden="true">
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E9D2AA" />
          <stop offset="1" stopColor="#C79F68" />
        </linearGradient>
        <filter id={noise}>
          <feTurbulence type="fractalNoise" baseFrequency="0.03 0.3" numOctaves="2" seed="4" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <clipPath id={clip}>
          <circle cx="110" cy="110" r="101" />
        </clipPath>
      </defs>
      <circle cx="110" cy="110" r="101" fill={`url(#${grad})`} />
      <g clipPath={`url(#${clip})`}>
        <rect width="220" height="220" filter={`url(#${noise})`} opacity="0.14" style={{ mixBlendMode: 'multiply' }} />
        <path d="M10 84 C 80 78, 150 90, 212 82" stroke="#A87B45" strokeWidth="1.2" opacity="0.15" fill="none" />
        <path d="M10 150 C 90 158, 160 144, 212 152" stroke="#A87B45" strokeWidth="1.2" opacity="0.12" fill="none" />
      </g>
      <circle cx="110" cy="110" r="100.4" fill="none" stroke="rgba(90,60,28,0.5)" strokeWidth="1.3" />
      <circle cx="110" cy="110" r="90" fill="none" stroke="#6F4B23" strokeWidth="1" opacity="0.35" />
      {/* hanger hole */}
      <circle cx="110" cy="31" r="7" fill="var(--tag-hole, #F3F1EB)" stroke="rgba(90,60,28,0.55)" strokeWidth="1.4" />
      {/* engraved NFC */}
      <NfcMark x={64} y={64} scale={3.1} color="#6F4B23" relief="#F3E2C0" />
      <text
        x="110"
        y="187"
        textAnchor="middle"
        fontFamily="'Inter Tight Variable','Inter Variable',Arial,sans-serif"
        fontSize="11"
        fontWeight="650"
        letterSpacing="4.5"
        fill="#6F4B23"
      >
        FENIX
      </text>
    </svg>
  )
}
