import { useId } from 'react'
import { NfcMark, QrPattern, NFC_PATH } from './marks'

/** Matte NFC business card (85.6 × 54 proportions). */
export function BusinessCard({
  x,
  y,
  width = 430,
  variant = 'front',
  className,
}: {
  x?: number
  y?: number
  width?: number
  variant?: 'front' | 'back'
  className?: string
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const height = width * (271 / 430)
  const grad = `cg${uid}`

  if (variant === 'back') {
    return (
      <svg viewBox="0 0 430 271" x={x} y={y} width={width} height={height} className={className} aria-hidden="true">
        <rect x="4" y="4" width="422" height="263" rx="18" fill="#EFECE4" stroke="rgba(10,10,10,0.16)" strokeWidth="1.1" />
        <g transform="translate(30 26) scale(0.95)">
          <circle cx="7.5" cy="14" r="2" fill="#0A0A0A" />
          <path d={NFC_PATH} stroke="#FF4B00" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        </g>
        <svg x="160" y="80" width="110" height="110" viewBox="0 0 110 110">
          <QrPattern x={0} y={0} size={110} color="#141414" />
        </svg>
        <text
          x="215"
          y="228"
          textAnchor="middle"
          fontFamily="'Inter Variable',Arial,sans-serif"
          fontSize="9"
          fontWeight="600"
          letterSpacing="3.2"
          fill="rgba(10,10,10,0.45)"
        >
          NFC + QR
        </text>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 430 271" x={x} y={y} width={width} height={height} className={className} aria-hidden="true">
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#222224" />
          <stop offset="1" stopColor="#0A0A0B" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="422" height="263" rx="18" fill={`url(#${grad})`} stroke="rgba(255,255,255,0.16)" strokeWidth="1.1" />
      <path d="M140 4 L196 4 L96 267 L64 267 Z" fill="rgba(255,255,255,0.035)" />
      {/* mark */}
      <g transform="translate(32 26) scale(1.05)">
        <circle cx="7.5" cy="14" r="2.1" fill="#F3F1EB" />
        <path d={NFC_PATH} stroke="#FF4B00" strokeWidth="2.3" strokeLinecap="round" fill="none" />
      </g>
      {/* wordmark */}
      <text
        x="32"
        y="158"
        fontFamily="'Inter Tight Variable','Inter Variable',Arial,sans-serif"
        fontSize="36"
        fontWeight="680"
        letterSpacing="9"
        fill="#F3F1EB"
      >
        FENIX
      </text>
      <text
        x="34"
        y="182"
        fontFamily="'Inter Variable',Arial,sans-serif"
        fontSize="8.5"
        fontWeight="600"
        letterSpacing="3.6"
        fill="rgba(243,241,235,0.5)"
      >
        NFC BUSINESS CARD
      </text>
      {/* contactless mark bottom-right */}
      <NfcMark x={356} y={202} scale={1.65} color="rgba(255,255,255,0.85)" />
    </svg>
  )
}
