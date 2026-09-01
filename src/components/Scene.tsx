import { useId } from 'react'
import type { CaseId } from '../data/usecases'
import { WoodPlaque } from './WoodPlaque'
import { AcrylicPlaque } from './AcrylicPlaque'
import { BusinessCard } from './BusinessCard'
import { RoundTag } from './RoundTag'

const STROKE = 'rgba(10,10,10,0.5)'
const FILL = 'rgba(10,10,10,0.055)'

function ScenePulse({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g className="scene-pulse" transform={`translate(${x} ${y})`}>
      <circle className="sp-ring sp-r1" r="17" />
      <circle className="sp-ring sp-r2" r="17" />
      <circle r="4" fill="#FF4B00" />
      <text x="16" y="-13" className="sp-label">
        {label}
      </text>
    </g>
  )
}

function SoftShadow({ id }: { id: string }) {
  return (
    <filter id={id} x="-40%" y="-200%" width="180%" height="500%">
      <feGaussianBlur stdDeviation="6" />
    </filter>
  )
}

/**
 * Minimal editorial line-art environments (hairline ink on paper) with the
 * real Fenix product rendered inside and a pulsing tap point.
 */
export function Scene({ id, tapLabel }: { id: CaseId; tapLabel: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')
  const blur = `sb${uid}`

  const common = {
    className: 'uc-scene',
    viewBox: '0 0 560 400',
    fill: 'none' as const,
  }

  if (id === 'restaurant') {
    return (
      <svg {...common} aria-hidden="true">
        <defs>
          <SoftShadow id={blur} />
        </defs>
        <g stroke={STROKE} strokeWidth="1.4" strokeLinecap="round">
          <path d="M16 322 H544" />
          <path d="M70 356 H492" opacity="0.3" />
          {/* plate + glass */}
          <ellipse cx="428" cy="312" rx="60" ry="13" />
          <ellipse cx="428" cy="311" rx="43" ry="8.5" opacity="0.5" />
          <path d="M500 246 L506 312 M534 246 L528 312 M506 312 H528" opacity="0.85" />
          <ellipse cx="517" cy="246" rx="14" ry="3.6" opacity="0.85" />
        </g>
        <ellipse cx="178" cy="326" rx="122" ry="9" fill="rgba(10,10,10,0.16)" filter={`url(#${blur})`} />
        <WoodPlaque x={52} y={156} width={248} />
        <ScenePulse x={268} y={196} label={tapLabel} />
      </svg>
    )
  }

  if (id === 'hotel') {
    return (
      <svg {...common} aria-hidden="true">
        <defs>
          <SoftShadow id={blur} />
        </defs>
        <g stroke={STROKE} strokeWidth="1.4" strokeLinecap="round">
          <path d="M16 354 H544" opacity="0.55" />
          {/* nightstand */}
          <rect x="56" y="252" width="220" height="76" fill={FILL} />
          <path d="M56 290 H276" opacity="0.6" />
          <circle cx="166" cy="309" r="3" opacity="0.7" />
          <path d="M66 328 V354 M266 328 V354" />
          {/* lamp */}
          <path d="M250 252 V198" />
          <path d="M228 198 H272 L262 168 H238 Z" fill={FILL} />
          {/* bed */}
          <rect x="336" y="182" width="208" height="116" rx="12" fill={FILL} />
          <rect x="352" y="266" width="192" height="52" rx="9" fill="rgba(10,10,10,0.08)" stroke="none" />
          <path d="M352 266 H544" opacity="0.5" />
          <ellipse cx="404" cy="242" rx="38" ry="13" opacity="0.7" />
        </g>
        <ellipse cx="146" cy="254" rx="86" ry="7.5" fill="rgba(10,10,10,0.16)" filter={`url(#${blur})`} />
        <AcrylicPlaque tone="light" x={56} y={133} width={172} />
        <ScenePulse x={212} y={150} label={tapLabel} />
      </svg>
    )
  }

  if (id === 'doctor') {
    return (
      <svg {...common} aria-hidden="true">
        <defs>
          <SoftShadow id={blur} />
        </defs>
        <g stroke={STROKE} strokeWidth="1.4" strokeLinecap="round">
          <path d="M16 330 H544" />
          {/* monitor */}
          <rect x="352" y="168" width="168" height="104" rx="10" fill={FILL} />
          <path d="M436 272 V302 M398 304 H474" />
          {/* papers + pen */}
          <path d="M292 314 L378 306 L384 318 L298 326 Z" fill="rgba(10,10,10,0.035)" opacity="0.9" />
          <path d="M420 320 L462 314" opacity="0.7" />
        </g>
        <ellipse cx="178" cy="332" rx="104" ry="8.5" fill="rgba(10,10,10,0.16)" filter={`url(#${blur})`} />
        <WoodPlaque x={68} y={186} width={214} />
        <ScenePulse x={252} y={220} label={tapLabel} />
      </svg>
    )
  }

  if (id === 'gym') {
    return (
      <svg {...common} aria-hidden="true">
        <defs>
          <SoftShadow id={blur} />
        </defs>
        <g stroke={STROKE} strokeWidth="1.4" strokeLinecap="round">
          <path d="M16 356 H544" />
          {/* frame */}
          <path d="M132 62 V356 M150 62 V356" />
          <path d="M132 62 H286" />
          <circle cx="286" cy="80" r="13" />
          <path d="M286 93 V210" opacity="0.8" />
          <path d="M256 210 H316" strokeWidth="3.4" />
          {/* weight stack on guide rods */}
          <path d="M192 118 V342 M268 118 V342" opacity="0.6" />
          <g fill="rgba(10,10,10,0.07)" stroke="rgba(10,10,10,0.32)">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <rect key={i} x="198" y={206 + i * 19} width="64" height="14" rx="3" />
            ))}
          </g>
          <rect x="262" y="248" width="17" height="5" rx="2.5" fill="#FF4B00" stroke="none" />
          {/* bench */}
          <rect x="352" y="252" width="150" height="20" rx="10" fill={FILL} />
          <path d="M372 272 V356 M474 272 V356" />
        </g>
        <ellipse cx="220" cy="358" rx="150" ry="7" fill="rgba(10,10,10,0.12)" filter={`url(#${blur})`} />
        <RoundTag x={104} y={118} width={74} />
        <ScenePulse x={196} y={140} label={tapLabel} />
      </svg>
    )
  }

  // business
  return (
    <svg {...common} aria-hidden="true">
      <defs>
        <SoftShadow id={blur} />
      </defs>
      <g stroke={STROKE} strokeWidth="1.4" strokeLinecap="round">
        <path d="M16 334 H544" />
        {/* coffee */}
        <circle cx="486" cy="296" r="25" />
        <path d="M511 288 a11 11 0 0 1 0 19" />
        <ellipse cx="486" cy="328" rx="36" ry="5.5" opacity="0.6" />
      </g>
      <ellipse cx="252" cy="336" rx="150" ry="9" fill="rgba(10,10,10,0.16)" filter={`url(#${blur})`} />
      <g transform="rotate(5 330 250)">
        <BusinessCard variant="back" x={205} y={158} width={250} />
      </g>
      <g transform="rotate(-7 240 260)">
        <BusinessCard x={92} y={150} width={292} />
      </g>
      <ScenePulse x={368} y={238} label={tapLabel} />
    </svg>
  )
}
