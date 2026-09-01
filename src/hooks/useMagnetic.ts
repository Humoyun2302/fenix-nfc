import { useEffect, useRef } from 'react'
import { useHasFinePointer } from '@/hooks/useMediaQuery'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type MagneticOptions = {
  /** Radius in px from the element centre where attraction begins. */
  radius?: number
  /** How strongly the element leans toward the pointer, 0–1. */
  strength?: number
  ease?: number
}

/**
 * Subtle hardware-like attraction: the element eases toward the pointer when
 * it is nearby. Does not replace the cursor.
 */
export function useMagnetic<T extends HTMLElement>({
  radius = 140,
  strength = 0.22,
  ease = 0.12,
}: MagneticOptions = {}) {
  const ref = useRef<T | null>(null)
  const target = useRef({ x: 0, y: 0 })
  const current = useRef({ x: 0, y: 0 })
  const frame = useRef(0)
  const fine = useHasFinePointer()
  const reduced = useReducedMotion()

  useEffect(() => {
    const el = ref.current
    if (!el || !fine || reduced) return

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = event.clientX - cx
      const dy = event.clientY - cy
      const dist = Math.hypot(dx, dy)

      if (dist < radius) {
        const t = 1 - dist / radius
        target.current.x = dx * strength * t
        target.current.y = dy * strength * t
      } else {
        target.current.x = 0
        target.current.y = 0
      }
    }

    const onLeave = () => {
      target.current.x = 0
      target.current.y = 0
    }

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * ease
      current.current.y += (target.current.y - current.current.y) * ease
      el.style.setProperty('--mag-x', `${current.current.x.toFixed(2)}px`)
      el.style.setProperty('--mag-y', `${current.current.y.toFixed(2)}px`)
      frame.current = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    el.addEventListener('pointerleave', onLeave)
    frame.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(frame.current)
    }
  }, [ease, fine, radius, reduced, strength])

  return ref
}
