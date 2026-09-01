import { useEffect, useRef } from 'react'

/**
 * Subtle pointer-driven perspective: sets --rx / --ry (max ~2deg) on the element
 * while the pointer moves over the surrounding section. Disabled for touch
 * devices and reduced-motion users.
 */
export function useTilt<T extends HTMLElement>(max = 2) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(pointer: coarse)').matches
    )
      return

    const zone = (el.closest('section') as HTMLElement | null) ?? el
    let raf = 0

    const onMove = (e: PointerEvent) => {
      const r = zone.getBoundingClientRect()
      const cx = (e.clientX - r.left) / r.width - 0.5
      const cy = (e.clientY - r.top) / r.height - 0.5
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.setProperty('--rx', `${(-cy * max).toFixed(2)}deg`)
        el.style.setProperty('--ry', `${(cx * max).toFixed(2)}deg`)
      })
    }
    const reset = () => {
      cancelAnimationFrame(raf)
      el.style.setProperty('--rx', '0deg')
      el.style.setProperty('--ry', '0deg')
    }

    zone.addEventListener('pointermove', onMove)
    zone.addEventListener('pointerleave', reset)
    return () => {
      zone.removeEventListener('pointermove', onMove)
      zone.removeEventListener('pointerleave', reset)
      cancelAnimationFrame(raf)
    }
  }, [max])

  return ref
}
