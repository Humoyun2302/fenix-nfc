import { useEffect, useRef } from 'react'

/**
 * Subtle magnetic pull: the element leans a few pixels toward the pointer
 * while hovered and springs back on leave. Desktop fine-pointer only;
 * disabled for reduced-motion users. Uses the `translate` property so it
 * composes with any `transform` the element already has.
 */
export function useMagnet<T extends HTMLElement>(strength = 0.16, max = 7) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !window.matchMedia('(pointer: fine)').matches
    )
      return

    let raf = 0
    const clamp = (v: number) => Math.max(-max, Math.min(max, v * strength))
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        el.style.translate = `${clamp(dx).toFixed(1)}px ${clamp(dy).toFixed(1)}px`
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(raf)
      el.style.translate = '0px 0px'
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(raf)
    }
  }, [strength, max])

  return ref
}
