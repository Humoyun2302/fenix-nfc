import type { CaseId } from '../data/usecases'
import { SCENE_PHOTOS } from '../data/works'
import './Scene.css'

const STROKE = 'rgba(91,140,255,0.65)'
const FILL = 'rgba(91,140,255,0.07)'

/**
 * Hairline props drawn beside the photographed product. The surface line is
 * split so it never crosses the multiplied photo. viewBox 0 0 560 420.
 */
function Props({ id }: { id: CaseId }) {
  const common = {
    className: 'scene__props',
    viewBox: '0 0 560 420',
    fill: 'none' as const,
    'aria-hidden': true as const,
  }

  if (id === 'restaurant') {
    return (
      <svg {...common}>
        <g stroke={STROKE} strokeWidth="1.4" strokeLinecap="round">
          <path d="M10 342 H68 M368 342 H552" />
          <ellipse cx="448" cy="336" rx="58" ry="12" />
          <ellipse cx="448" cy="335" rx="42" ry="8" opacity="0.5" />
          <path d="M518 272 L523 336 M549 272 L544 336 M523 336 H544" opacity="0.85" />
          <ellipse cx="533.5" cy="272" rx="13" ry="3.4" opacity="0.85" />
        </g>
      </svg>
    )
  }
  if (id === 'hotel') {
    return (
      <svg {...common}>
        <g stroke={STROKE} strokeWidth="1.4" strokeLinecap="round">
          <path d="M10 342 H62 M370 342 H552" />
          {/* lamp */}
          <path d="M470 342 V250" />
          <path d="M444 250 H496 L485 214 H455 Z" fill={FILL} />
          <path d="M438 342 H502" opacity="0.6" />
        </g>
      </svg>
    )
  }
  if (id === 'doctor') {
    return (
      <svg {...common}>
        <g stroke={STROKE} strokeWidth="1.4" strokeLinecap="round">
          <path d="M10 342 H60 M366 342 H552" />
          {/* monitor */}
          <rect x="408" y="222" width="126" height="80" rx="9" fill={FILL} />
          <path d="M471 302 V326 M441 328 H501" />
        </g>
      </svg>
    )
  }
  if (id === 'gym') {
    return (
      <svg {...common}>
        <g stroke={STROKE} strokeWidth="1.4" strokeLinecap="round">
          <path d="M10 342 H64 M362 342 H552" />
          {/* dumbbell */}
          <rect x="400" y="296" width="22" height="60" rx="6" fill={FILL} />
          <rect x="510" y="296" width="22" height="60" rx="6" fill={FILL} />
          <rect x="422" y="316" width="88" height="20" rx="8" />
          {/* kettlebell */}
          <circle cx="368" cy="322" r="20" fill={FILL} />
          <path d="M356 308 a16 12 0 0 1 24 0" />
        </g>
      </svg>
    )
  }
  // business
  return (
    <svg {...common}>
      <g stroke={STROKE} strokeWidth="1.4" strokeLinecap="round">
        <path d="M10 342 H70 M380 342 H552" />
        {/* coffee cup, side view */}
        <path d="M448 296 L454 336 H488 L494 296 Z" fill={FILL} />
        <path d="M494 302 a12 12 0 0 1 -2 24" />
        <ellipse cx="471" cy="342" rx="33" ry="4.5" opacity="0.6" />
        <path d="M462 282 q3 -6 0 -12 M478 282 q3 -6 0 -12" opacity="0.45" />
      </g>
    </svg>
  )
}

/** Real client product photographed in a minimal drawn environment. */
export function Scene({ id, tapLabel }: { id: CaseId; tapLabel: string }) {
  const photo = SCENE_PHOTOS[id]
  return (
    <div className={`scene scene--${id}`}>
      <div className="scene__photowrap">
        <img
          className="ph scene__photo"
          src={photo.img}
          width={photo.w}
          height={photo.h}
          alt={photo.name}
          loading="lazy"
          decoding="async"
        />
        <i className="scene__fade" aria-hidden="true" />
      </div>
      <Props id={id} />
      <span className="scene__pulse" aria-hidden="true">
        <i className="scene__ring scene__ring--1" />
        <i className="scene__ring scene__ring--2" />
        <b className="scene__tap micro">{tapLabel}</b>
      </span>
    </div>
  )
}
