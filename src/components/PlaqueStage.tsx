import { useEffect, useState } from 'react'
import { NfcSurface, type Finish, type Shape } from '@/components/NfcSurface'
import { useIsDesktop } from '@/hooks/useMediaQuery'
import { usePointerTilt } from '@/hooks/usePointerTilt'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type PlaqueStageProps = {
  finish?: Finish
  shape?: Shape
  className?: string
  /** Base rotation of the object before pointer influence. */
  baseRotate?: { x: number; y: number; z: number }
  /** Continuous soft ripple, as if the field were always live. */
  ambientRipple?: boolean
  /** Increment to fire a single ripple burst. */
  burst?: number
  float?: boolean
  tilt?: boolean
  onActivate?: () => void
  /** Renders the object as a real button (used by the tap demo). */
  interactive?: boolean
  label?: string
  brandLabel?: string
  shadow?: boolean
}

/**
 * Puts a Fenix surface into a lit studio: mild perspective, material thickness,
 * a long soft floor shadow, gentle float and a small pointer-driven parallax.
 * Perspective softens as the viewport narrows so mobile reads more frontal.
 */
export function PlaqueStage({
  finish = 'acrylic',
  shape = 'square',
  className = '',
  baseRotate = { x: 7, y: -14, z: -3 },
  ambientRipple = false,
  burst = 0,
  float = true,
  tilt = true,
  onActivate,
  interactive = false,
  label,
  brandLabel = 'Fenix',
  shadow = true,
}: PlaqueStageProps) {
  const reduced = useReducedMotion()
  const isDesktop = useIsDesktop()
  const tiltRef = usePointerTilt<HTMLDivElement>({ max: 9, shift: 12, ease: 0.07 })
  const [bursts, setBursts] = useState<number[]>([])

  useEffect(() => {
    if (!burst) return
    setBursts((prev) => [...prev.slice(-2), burst])
  }, [burst])

  /* Mobile flattens the object; desktop gets the full three-quarter view. */
  const scale = isDesktop ? 1 : 0.55
  const rotate = {
    x: baseRotate.x * scale,
    y: baseRotate.y * scale,
    z: baseRotate.z * scale,
  }

  const Body = interactive ? 'button' : 'div'

  return (
    <div
      ref={tilt ? tiltRef : undefined}
      className={`relative ${className}`}
      style={{ perspective: isDesktop ? '1600px' : '2400px' }}
    >
      {/* Live NFC field */}
      <div className="pointer-events-none absolute inset-0 grid place-items-center">
        <div className="relative aspect-square w-[124%]">
          {ambientRipple && !reduced
            ? [0, 1, 2].map((i) => (
                <span
                  key={`ambient-${i}`}
                  className="absolute inset-0 rounded-full border border-[rgba(120,140,180,0.28)]"
                  style={{
                    animation: 'fx-ripple 6.5s cubic-bezier(0.22,1,0.36,1) infinite',
                    animationDelay: `${i * 2.16}s`,
                  }}
                />
              ))
            : null}
          {bursts.map((id) =>
            [0, 1, 2].map((i) => (
              <span
                key={`burst-${id}-${i}`}
                className="absolute inset-0 rounded-full border border-[rgba(96,124,172,0.42)]"
                style={{
                  animation: reduced
                    ? undefined
                    : 'fx-ripple 1.5s cubic-bezier(0.22,1,0.36,1) forwards',
                  animationDelay: `${i * 0.16}s`,
                }}
              />
            )),
          )}
        </div>
      </div>

      <Body
        {...(interactive
          ? {
              type: 'button' as const,
              onClick: onActivate,
              'aria-label': label ?? 'Tap the Fenix surface',
            }
          : {})}
        className={`relative block w-full ${interactive ? 'cursor-pointer' : ''}`}
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(calc(${rotate.x}deg + var(--tilt-x, 0deg))) rotateY(calc(${rotate.y}deg + var(--tilt-y, 0deg))) rotateZ(${rotate.z}deg) translate3d(var(--tilt-dx, 0px), var(--tilt-dy, 0px), 0)`,
          transition: 'transform 120ms linear',
        }}
      >
        <div
          style={{
            transformStyle: 'preserve-3d',
            animation: float && !reduced ? 'fx-float 9s ease-in-out infinite' : undefined,
            willChange: 'transform',
          }}
        >
          {/* Material thickness */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              transform: 'translateZ(-14px)',
              borderRadius: shape === 'round' ? '50%' : 'clamp(1.25rem, 8%, 2.75rem)',
              background:
                finish === 'card'
                  ? 'linear-gradient(150deg, #0e0e10, #26262a)'
                  : finish === 'wood'
                    ? 'linear-gradient(150deg, #a8855c, #c9a97e)'
                    : 'linear-gradient(150deg, rgba(214,220,232,0.95), rgba(238,242,248,0.9))',
              boxShadow: '0 1px 2px rgba(40,46,82,0.12)',
            }}
          />

          <NfcSurface
            finish={finish}
            shape={shape}
            brandLabel={brandLabel}
            className="w-full"
            style={{
              boxShadow: `
                inset 0 1.5px 0 rgba(255,255,255,1),
                inset 0 -1.5px 0 rgba(255,255,255,0.62),
                inset 0 0 44px rgba(255,255,255,0.7),
                var(--fx-shadow-plaque)
              `,
            }}
          />
        </div>
      </Body>

      {/* Floor shadow — cool lavender, as in the reference render */}
      {shadow ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[92%] -z-1 h-[26%] w-[86%] -translate-x-1/2 rounded-[50%] blur-[28px] sm:blur-[42px]"
          style={{
            background:
              'radial-gradient(closest-side, rgba(88,96,140,0.3), rgba(120,126,168,0.12) 55%, rgba(255,255,255,0) 80%)',
            animation: float && !reduced ? 'fx-float 9s ease-in-out infinite reverse' : undefined,
          }}
        />
      ) : null}
    </div>
  )
}
