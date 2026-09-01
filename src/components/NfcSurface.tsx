import type { CSSProperties, ReactNode } from 'react'
import { NfcGlyph } from '@/lib/icons'

export type Finish = 'acrylic' | 'wood' | 'card' | 'custom'
export type Shape = 'square' | 'round' | 'card'

type NfcSurfaceProps = {
  finish?: Finish
  shape?: Shape
  /** Number of concentric tap rings. */
  rings?: number
  showBrand?: boolean
  showMark?: boolean
  brandLabel?: string
  className?: string
  style?: CSSProperties
  /** Content layered above the rings, e.g. an engraved caption. */
  children?: ReactNode
  /** Dims the engraving for small thumbnails. */
  compact?: boolean
}

const surfaceByFinish: Record<Finish, CSSProperties> = {
  acrylic: {
    background: `
      radial-gradient(115% 90% at 12% 6%, rgba(203,223,243,0.55), rgba(203,223,243,0) 52%),
      radial-gradient(100% 85% at 90% 94%, rgba(240,213,224,0.5), rgba(240,213,224,0) 55%),
      radial-gradient(90% 70% at 78% 14%, rgba(216,207,239,0.4), rgba(216,207,239,0) 60%),
      linear-gradient(148deg, rgba(255,255,255,0.97) 0%, rgba(250,251,253,0.9) 36%, rgba(243,245,250,0.88) 64%, rgba(255,255,255,0.95) 100%)
    `,
    border: '1px solid rgba(255,255,255,0.92)',
    boxShadow: `
      inset 0 1.5px 0 rgba(255,255,255,1),
      inset 0 -1.5px 0 rgba(255,255,255,0.62),
      inset 0 0 44px rgba(255,255,255,0.7),
      inset 0 0 0 1px rgba(255,255,255,0.4)
    `,
    backdropFilter: 'blur(7px) saturate(130%)',
    WebkitBackdropFilter: 'blur(7px) saturate(130%)',
  },
  wood: {
    background: `
      radial-gradient(110% 90% at 14% 8%, rgba(255,244,228,0.55), rgba(255,244,228,0) 55%),
      repeating-linear-gradient(101deg, rgba(120,84,52,0.05) 0px, rgba(120,84,52,0) 3px, rgba(120,84,52,0.045) 7px, rgba(120,84,52,0) 12px),
      linear-gradient(150deg, #e2c9a6 0%, #d3b48c 40%, #c9a77e 68%, #dcc19c 100%)
    `,
    border: '1px solid rgba(255,250,240,0.55)',
    boxShadow: `
      inset 0 1.5px 0 rgba(255,248,235,0.7),
      inset 0 -2px 6px rgba(94,64,38,0.2),
      inset 0 0 40px rgba(255,240,220,0.25)
    `,
  },
  card: {
    background: `
      radial-gradient(120% 100% at 8% 0%, rgba(255,255,255,0.16), rgba(255,255,255,0) 46%),
      radial-gradient(90% 80% at 92% 100%, rgba(200,220,242,0.14), rgba(200,220,242,0) 55%),
      linear-gradient(146deg, #232326 0%, #17171a 44%, #1e1e21 72%, #2a2a2e 100%)
    `,
    border: '1px solid rgba(255,255,255,0.14)',
    boxShadow: `
      inset 0 1px 0 rgba(255,255,255,0.2),
      inset 0 -1px 0 rgba(255,255,255,0.06),
      inset 0 0 60px rgba(255,255,255,0.04)
    `,
  },
  custom: {
    background: `
      radial-gradient(115% 90% at 10% 6%, rgba(255,255,255,0.75), rgba(255,255,255,0) 50%),
      radial-gradient(100% 90% at 92% 96%, rgba(206,214,228,0.7), rgba(206,214,228,0) 55%),
      repeating-linear-gradient(96deg, rgba(120,130,150,0.05) 0px, rgba(120,130,150,0) 2px, rgba(120,130,150,0.045) 5px, rgba(120,130,150,0) 9px),
      linear-gradient(150deg, #f2f4f7 0%, #e3e7ee 42%, #dce1e9 70%, #eef1f5 100%)
    `,
    border: '1px solid rgba(255,255,255,0.85)',
    boxShadow: `
      inset 0 1.5px 0 rgba(255,255,255,0.95),
      inset 0 -1.5px 0 rgba(255,255,255,0.5),
      inset 0 0 44px rgba(255,255,255,0.55)
    `,
  },
}

const inkByFinish: Record<Finish, { engrave: string; brand: string; ring: string }> = {
  acrylic: { engrave: 'rgba(17,17,17,0.72)', brand: 'rgba(17,17,17,0.9)', ring: 'rgba(17,17,17,0.075)' },
  wood: { engrave: 'rgba(72,46,24,0.72)', brand: 'rgba(66,42,22,0.86)', ring: 'rgba(72,46,24,0.13)' },
  card: { engrave: 'rgba(255,255,255,0.85)', brand: 'rgba(255,255,255,0.95)', ring: 'rgba(255,255,255,0.11)' },
  custom: { engrave: 'rgba(28,34,46,0.7)', brand: 'rgba(24,28,38,0.88)', ring: 'rgba(28,34,46,0.09)' },
}

const radiusByShape: Record<Shape, string> = {
  square: 'clamp(1.25rem, 8%, 2.75rem)',
  round: '50%',
  card: 'clamp(0.75rem, 5%, 1.25rem)',
}

const aspectByShape: Record<Shape, string> = {
  square: '1 / 1',
  round: '1 / 1',
  card: '1.586 / 1',
}

/**
 * A physically-modelled Fenix surface: frosted acrylic, engraved wood, or a matte
 * PVC card. Concentric tap rings, the contactless mark and the Fenix wordmark are
 * engraved into the face. Pure CSS, so it works as a real placeholder until the
 * product photography arrives.
 */
export function NfcSurface({
  finish = 'acrylic',
  shape = 'square',
  rings = 11,
  showBrand = true,
  showMark = true,
  brandLabel = 'Fenix',
  className = '',
  style,
  children,
  compact = false,
}: NfcSurfaceProps) {
  const ink = inkByFinish[finish]
  const ringNodes = Array.from({ length: rings }, (_, i) => 6.5 + i * 3.6)

  return (
    <div
      className={`relative isolate overflow-hidden ${className}`}
      style={{
        aspectRatio: aspectByShape[shape],
        borderRadius: radiusByShape[shape],
        containerType: 'inline-size',
        ...surfaceByFinish[finish],
        ...style,
      }}
    >
      {/* Engraved concentric tap rings */}
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g fill="none" stroke={ink.ring} strokeWidth={compact ? 0.5 : 0.34}>
          {ringNodes.map((r) => (
            <circle key={r} cx="50" cy="48" r={r} />
          ))}
        </g>
      </svg>

      {/* Contactless mark */}
      {showMark ? (
        <div
          className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2"
          style={{ width: shape === 'card' ? '17%' : '15%', color: ink.engrave }}
        >
          <NfcGlyph className="size-full" strokeWidth={1.35} />
        </div>
      ) : null}

      {children}

      {/* Fenix wordmark, engraved bottom-right as on the reference object */}
      {showBrand ? (
        <div
          className="absolute bottom-[7%] right-[7%] text-right leading-none"
          style={{ color: ink.brand }}
        >
          {!compact ? (
            <span
              className="block text-[max(5px,0.32em)] font-medium uppercase leading-none opacity-70"
              style={{ letterSpacing: '0.16em', fontSize: 'clamp(5px, 1.7cqw, 9px)' }}
            >
              Powered by
            </span>
          ) : null}
          <span
            className="block font-semibold leading-[0.95] tracking-[-0.035em]"
            style={{ fontSize: compact ? 'clamp(9px, 6cqw, 16px)' : 'clamp(13px, 6.4cqw, 34px)' }}
          >
            {brandLabel}
          </span>
        </div>
      ) : null}

      {/* Specular sheen across the face */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            finish === 'card'
              ? 'linear-gradient(118deg, rgba(255,255,255,0) 28%, rgba(255,255,255,0.14) 44%, rgba(255,255,255,0.02) 56%, rgba(255,255,255,0) 70%)'
              : 'linear-gradient(118deg, rgba(255,255,255,0) 26%, rgba(255,255,255,0.62) 44%, rgba(255,255,255,0.1) 58%, rgba(255,255,255,0) 72%)',
          mixBlendMode: finish === 'card' ? 'screen' : 'soft-light',
        }}
      />

      {/* Hairline edge — reads as the polished cut of the material */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: 'inherit',
          boxShadow:
            finish === 'card'
              ? 'inset 0 0 0 1px rgba(255,255,255,0.09)'
              : 'inset 0 0 0 1px rgba(255,255,255,0.6)',
        }}
      />
    </div>
  )
}
