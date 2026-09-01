import { useId } from 'react'
import { NfcMark, QrPattern } from './marks'
import { plaquePhoto } from '../assets/plaquePhoto'

const ENGRAVE = '#6F4B23'
const RELIEF = '#F3E2C0'

/**
 * Studio render of the wooden Fenix plaque — landscape, rounded corners,
 * NFC engraving left, QR engraving right. Accepts x/y/width so it can be
 * nested inside larger scene SVGs. If a real photograph is provided in
 * src/assets/plaquePhoto.ts it is used instead of the vector render.
 */
export function WoodPlaque({
  x,
  y,
  width = 560,
  className,
  title,
}: {
  x?: number
  y?: number
  width?: number
  className?: string
  title?: string
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const height = width * (380 / 560)
  const grad = `wg${uid}`
  const noise = `wn${uid}`
  const clip = `wc${uid}`
  const sheen = `ws${uid}`
  const edge = `we${uid}`

  return (
    <svg
      viewBox="0 0 560 380"
      x={x}
      y={y}
      width={width}
      height={height}
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      <defs>
        <linearGradient id={grad} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#EDDCBA" />
          <stop offset="0.45" stopColor="#E0C69C" />
          <stop offset="1" stopColor="#CDAB7C" />
        </linearGradient>
        <linearGradient id={sheen} x1="0" y1="0" x2="0.9" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.26)" />
          <stop offset="0.55" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
        <linearGradient id={edge} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(255,250,238,0.8)" />
          <stop offset="1" stopColor="rgba(90,60,28,0.55)" />
        </linearGradient>
        <filter id={noise} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.26" numOctaves="3" seed="7" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <clipPath id={clip}>
          <rect x="8" y="8" width="544" height="364" rx="30" />
        </clipPath>
      </defs>

      {plaquePhoto ? (
        <g clipPath={`url(#${clip})`}>
          <image
            href={plaquePhoto}
            x="8"
            y="8"
            width="544"
            height="364"
            preserveAspectRatio="xMidYMid slice"
          />
        </g>
      ) : (
        <>
          <g clipPath={`url(#${clip})`}>
            <rect x="8" y="8" width="544" height="364" fill={`url(#${grad})`} />
            {/* wood grain */}
            <rect
              x="8"
              y="8"
              width="544"
              height="364"
              filter={`url(#${noise})`}
              opacity="0.15"
              style={{ mixBlendMode: 'multiply' }}
            />
            <g fill="none" stroke="#A87B45" strokeLinecap="round">
              <path d="M14 66 C 150 58, 330 76, 548 62" strokeWidth="1.4" opacity="0.16" />
              <path d="M14 108 C 170 100, 400 118, 548 102" strokeWidth="9" opacity="0.05" />
              <path d="M14 152 C 180 160, 310 142, 548 154" strokeWidth="1.2" opacity="0.12" />
              <path d="M14 214 C 140 206, 380 226, 548 210" strokeWidth="1.4" opacity="0.15" />
              <path d="M14 272 C 210 282, 360 260, 548 276" strokeWidth="13" opacity="0.04" />
              <path d="M14 318 C 190 326, 350 306, 548 320" strokeWidth="1.2" opacity="0.11" />
            </g>
            {/* studio light sheen */}
            <rect x="8" y="8" width="544" height="364" fill={`url(#${sheen})`} />
          </g>

          {/* engraved inner frame */}
          <g>
            <rect
              x="27"
              y="27.9"
              width="506"
              height="324"
              rx="19"
              fill="none"
              stroke={RELIEF}
              strokeWidth="1.2"
              opacity="0.8"
            />
            <rect x="27" y="27" width="506" height="324" rx="19" fill="none" stroke={ENGRAVE} strokeWidth="1.2" opacity="0.4" />
          </g>

          {/* engraved NFC symbol — left */}
          <NfcMark x={84} y={132} scale={4.1} color={ENGRAVE} relief={RELIEF} />

          {/* engraved QR — right */}
          <svg x="330" y="104" width="172" height="172" viewBox="0 0 172 172">
            <QrPattern x={0} y={0} size={172} color={ENGRAVE} relief={RELIEF} />
          </svg>

          {/* engraved wordmark */}
          <text
            x="280"
            y="345"
            textAnchor="middle"
            fontFamily="'Inter Tight Variable','Inter Variable',Arial,sans-serif"
            fontSize="15"
            fontWeight="650"
            letterSpacing="7"
            fill={RELIEF}
            opacity="0.9"
            transform="translate(0 0.9)"
          >
            FENIX
          </text>
          <text
            x="280"
            y="345"
            textAnchor="middle"
            fontFamily="'Inter Tight Variable','Inter Variable',Arial,sans-serif"
            fontSize="15"
            fontWeight="650"
            letterSpacing="7"
            fill={ENGRAVE}
          >
            FENIX
          </text>
        </>
      )}

      {/* machined edge */}
      <rect
        x="8.75"
        y="8.75"
        width="542.5"
        height="362.5"
        rx="29.4"
        fill="none"
        stroke={`url(#${edge})`}
        strokeWidth="1.5"
      />
    </svg>
  )
}
