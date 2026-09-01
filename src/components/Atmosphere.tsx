import { useEffect } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

type Blob = {
  id: string
  className: string
  style: React.CSSProperties
}

/**
 * Diffused physical light on a white surface. Several very large, very low-opacity
 * blobs drift on long cycles; a fine grain layer keeps the white field from banding.
 * Fixed to the viewport so the lighting flows continuously between sections.
 */
const blobs: Blob[] = [
  {
    id: 'ice-left',
    className: 'bg-[radial-gradient(closest-side,rgba(168,201,235,0.36),rgba(168,201,235,0)_72%)]',
    style: {
      width: '78vmax',
      height: '58vmax',
      top: '-14vmax',
      left: '-26vmax',
      animationDuration: '46s',
    },
  },
  {
    id: 'lavender-right',
    className: 'bg-[radial-gradient(closest-side,rgba(196,182,232,0.3),rgba(196,182,232,0)_70%)]',
    style: {
      width: '70vmax',
      height: '70vmax',
      top: '2vmax',
      right: '-30vmax',
      animationDuration: '58s',
      animationDelay: '-12s',
    },
  },
  {
    id: 'blush-mid',
    className: 'bg-[radial-gradient(closest-side,rgba(240,206,218,0.28),rgba(240,206,218,0)_70%)]',
    style: {
      width: '62vmax',
      height: '52vmax',
      top: '46%',
      left: '18%',
      animationDuration: '64s',
      animationDelay: '-28s',
    },
  },
  {
    id: 'ice-low',
    className: 'bg-[radial-gradient(closest-side,rgba(176,206,235,0.28),rgba(176,206,235,0)_72%)]',
    style: {
      width: '84vmax',
      height: '54vmax',
      bottom: '-18vmax',
      left: '-18vmax',
      animationDuration: '52s',
      animationDelay: '-6s',
    },
  },
  {
    id: 'lavender-low',
    className: 'bg-[radial-gradient(closest-side,rgba(203,192,235,0.24),rgba(203,192,235,0)_70%)]',
    style: {
      width: '58vmax',
      height: '58vmax',
      bottom: '-14vmax',
      right: '-14vmax',
      animationDuration: '70s',
      animationDelay: '-34s',
    },
  },
]

export function Atmosphere() {
  const reduced = useReducedMotion()

  /* A single scroll-linked variable slowly rotates the overall light direction. */
  useEffect(() => {
    if (reduced) return
    let raf = 0
    const read = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? window.scrollY / max : 0
      document.documentElement.style.setProperty('--fx-scroll', progress.toFixed(4))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(read)
    }
    read()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [reduced])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-pearl"
    >
      {/* Base pearl wash with a faint vertical falloff */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#ffffff_0%,#fafafa_38%,#f5f6f9_74%,#fafafa_100%)]" />

      <div
        className="absolute inset-0 opacity-[0.42] mix-blend-normal"
        style={{
          transform: 'translate3d(0, calc(var(--fx-scroll, 0) * -6vh), 0)',
          willChange: 'transform',
        }}
      >
        {blobs.map((blob) => (
          <div
            key={blob.id}
            className={`absolute rounded-full blur-[80px] sm:blur-[110px] ${blob.className}`}
            style={{
              ...blob.style,
              animationName: reduced ? undefined : 'fx-drift',
              animationTimingFunction: 'ease-in-out',
              animationIterationCount: 'infinite',
              willChange: 'transform',
            }}
          />
        ))}
      </div>

      {/* Specular streak, echoing the light band in the reference render */}
      <div
        className="absolute inset-x-[-20%] top-[26vh] h-[38vh] opacity-[0.5] blur-[60px] sm:blur-[90px]"
        style={{
          background:
            'linear-gradient(100deg, rgba(255,255,255,0) 0%, rgba(214,230,246,0.55) 22%, rgba(255,255,255,0.85) 46%, rgba(238,224,232,0.5) 70%, rgba(255,255,255,0) 100%)',
          transform:
            'rotate(-7deg) translate3d(0, calc(var(--fx-scroll, 0) * 26vh), 0)',
          willChange: 'transform',
        }}
      />

      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.5] mix-blend-multiply"
        style={{ backgroundImage: 'var(--fx-noise)', backgroundSize: '180px 180px' }}
      />
    </div>
  )
}
