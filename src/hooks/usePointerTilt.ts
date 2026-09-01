import { useCallback, useEffect, useRef } from 'react'
import { useHasFinePointer } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type TiltOptions = {
  /** Maximum rotation in degrees on each axis. */
  max?: number
  /** How far the element drifts, in pixels. */
  shift?: number
  /** Lerp factor per frame — lower is heavier. */
  ease?: number
  /** Track the whole viewport instead of only the element's own bounds. */
  global?: boolean
}

/**
 * Writes pointer-driven rotation into CSS custom properties (--tilt-x/--tilt-y/--tilt-dx/--tilt-dy)
 * on the target element, easing every frame. Kept out of React state so it never re-renders.
 */
export function usePointerTilt<T extends HTMLElement>({
  max = 8,
  shift = 10,
  ease = 0.08,
  global = false,
}: TiltOptions = {}) {
  const ref = useRef<T | null>(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const frame = useRef(0)
  const fine = useHasFinePointer()
  const reduced = useReducedMotion()

  const active = fine && !reduced

  useEffect(() => {
    const el = ref.current
    if (!el || !active) return

    const onMove = (event: PointerEvent) => {
      if (global) {
        target.current.x = (event.clientX / window.innerWidth) * 2 - 1
        target.current.y = (event.clientY / window.innerHeight) * 2 - 1
        return
      }
      const rect = el.getBoundingClientRect()
      target.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      target.current.y = ((event.clientY - rect.top) / rect.height) * 2 - 1
    }

    const onLeave = () => {
      target.current.x = 0
      target.current.y = 0
    }

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * ease
      current.current.y += (target.current.y - current.current.y) * ease

      el.style.setProperty('--tilt-y', `${(current.current.x * max).toFixed(3)}deg`)
      el.style.setProperty('--tilt-x', `${(-current.current.y * max).toFixed(3)}deg`)
      el.style.setProperty('--tilt-dx', `${(current.current.x * shift).toFixed(2)}px`)
      el.style.setProperty('--tilt-dy', `${(current.current.y * shift).toFixed(2)}px`)

      frame.current = requestAnimationFrame(tick)
    }

    const scope: HTMLElement | Window = global ? window : el
    scope.addEventListener('pointermove', onMove as EventListener, { passive: true })
    scope.addEventListener('pointerleave', onLeave as EventListener)
    frame.current = requestAnimationFrame(tick)

    return () => {
      scope.removeEventListener('pointermove', onMove as EventListener)
      scope.removeEventListener('pointerleave', onLeave as EventListener)
      cancelAnimationFrame(frame.current)
    }
  }, [active, ease, global, max, shift])

  return ref
}

/**
 * Tracks the pointer position inside an element as 0–100% CSS variables
 * (--gx/--gy) so a specular highlight can follow it.
 */
export function usePointerGlow<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const fine = useHasFinePointer()

  const onPointerMove = useCallback(
    (event: React.PointerEvent<T>) => {
      if (!fine) return
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--gx', `${(((event.clientX - rect.left) / rect.width) * 100).toFixed(2)}%`)
      el.style.setProperty('--gy', `${(((event.clientY - rect.top) / rect.height) * 100).toFixed(2)}%`)
      el.style.setProperty('--glow', '1')
    },
    [fine],
  )

  const onPointerLeave = useCallback(() => {
    ref.current?.style.setProperty('--glow', '0')
  }, [])

  return { glowRef: ref, onPointerMove, onPointerLeave }
}
