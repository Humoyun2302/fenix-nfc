import type { ReactNode } from 'react'
import { NfcSurface } from '@/components/NfcSurface'
import type { SceneKind } from '@/data/solutions'

type SceneVisualProps = {
  scene: SceneKind
  className?: string
}

function Tag({ compact = false }: { compact?: boolean }) {
  return (
    <NfcSurface
      finish="acrylic"
      compact
      rings={compact ? 7 : 9}
      className="w-full"
      showBrand={!compact}
    />
  )
}

function Studio({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(80% 60% at 18% 12%, rgba(186,214,240,0.38), transparent 58%),
            radial-gradient(70% 55% at 88% 88%, rgba(236,214,224,0.32), transparent 60%),
            radial-gradient(50% 40% at 70% 18%, rgba(214,206,236,0.28), transparent 55%),
            linear-gradient(165deg, #f7f8fb 0%, #eef1f6 48%, #f6f7fa 100%)
          `,
        }}
      />
      {children}
    </div>
  )
}

function TableScene() {
  return (
    <Studio className="size-full">
      <div className="absolute inset-x-[6%] bottom-[8%] top-[22%]" style={{ perspective: '900px' }}>
        {/* Table top */}
        <div
          className="absolute inset-x-[4%] bottom-[18%] h-[58%] rounded-[50%]"
          style={{
            background:
              'radial-gradient(closest-side, rgba(232,236,244,0.95) 0%, rgba(214,220,232,0.7) 62%, rgba(196,204,218,0.2) 100%)',
            boxShadow: '0 28px 50px -24px rgba(40,46,82,0.28)',
            transform: 'rotateX(62deg)',
            transformOrigin: 'center bottom',
          }}
        />
        <div
          className="absolute inset-x-[18%] bottom-0 h-[22%]"
          style={{
            background:
              'linear-gradient(180deg, rgba(180,188,204,0.35), rgba(180,188,204,0))',
            filter: 'blur(8px)',
          }}
        />
        <div className="absolute bottom-[38%] left-1/2 w-[34%] -translate-x-1/2">
          <Tag />
        </div>
      </div>
    </Studio>
  )
}

function DeskScene() {
  return (
    <Studio className="size-full">
      {/* Desk surface */}
      <div
        className="absolute inset-x-0 bottom-0 h-[46%]"
        style={{
          background:
            'linear-gradient(180deg, #e8edf4 0%, #dbe2ec 38%, #d4dce8 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)',
        }}
      />
      <div
        className="absolute bottom-[46%] left-0 right-0 h-px bg-white/70"
        aria-hidden="true"
      />
      {/* Standing plaque */}
      <div
        className="absolute bottom-[28%] left-1/2 w-[42%] -translate-x-1/2"
        style={{ transform: 'translateX(-50%) rotateX(8deg) rotateY(-8deg)', transformStyle: 'preserve-3d' }}
      >
        <Tag />
        <div
          aria-hidden="true"
          className="mx-auto mt-[-2px] h-2 w-[70%] rounded-b-md"
          style={{ background: 'linear-gradient(180deg, #d4dae6, #c5ccd8)' }}
        />
      </div>
    </Studio>
  )
}

function MachineScene() {
  return (
    <Studio className="size-full">
      <svg
        viewBox="0 0 260 320"
        className="absolute inset-0 size-full"
        aria-hidden="true"
        fill="none"
      >
        <ellipse cx="130" cy="292" rx="86" ry="14" fill="rgba(80,88,120,0.1)" />
        {/* Frame */}
        <rect x="52" y="36" width="11" height="230" rx="3.5" fill="#c9d0dc" />
        <rect x="198" y="36" width="11" height="230" rx="3.5" fill="#bec6d4" />
        <rect x="52" y="32" width="157" height="14" rx="4" fill="#d5dbe6" />
        <rect x="52" y="254" width="157" height="10" rx="3" fill="#c2c9d6" />
        {/* Weight stack */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <rect
            key={i}
            x="66"
            y={68 + i * 13}
            width="42"
            height="11"
            rx="1.6"
            fill={i % 2 === 0 ? '#d8dde8' : '#c5ccd8'}
            stroke="rgba(255,255,255,0.55)"
          />
        ))}
        {/* Guide rods */}
        <rect x="74" y="58" width="3" height="128" rx="1.5" fill="#aeb6c4" />
        <rect x="97" y="58" width="3" height="128" rx="1.5" fill="#aeb6c4" />
        {/* Seat */}
        <rect x="118" y="206" width="62" height="12" rx="4" fill="#b7bfcc" />
        <rect x="142" y="218" width="12" height="36" rx="3" fill="#c5ccd8" />
        <rect x="124" y="250" width="48" height="8" rx="3" fill="#d0d6e0" />
        {/* Pulley + bar */}
        <path d="M130 46v42" stroke="#9aa3b4" strokeWidth="1.6" />
        <path d="M78 88h104" stroke="#8b95a8" strokeWidth="3.4" strokeLinecap="round" />
        <circle cx="78" cy="88" r="4" fill="#a8b0c0" />
        <circle cx="182" cy="88" r="4" fill="#a8b0c0" />
        {/* Highlight on right post — where the tag sits */}
        <rect x="196" y="132" width="15" height="36" rx="3" fill="rgba(255,255,255,0.35)" />
      </svg>
      <div className="absolute right-[16%] top-[42%] w-[22%] sm:w-[20%]">
        <NfcSurface finish="custom" compact rings={6} showBrand={false} className="w-full" />
      </div>
    </Studio>
  )
}

function RoomScene() {
  return (
    <Studio className="size-full">
      {/* Back wall */}
      <div className="absolute inset-x-0 top-0 h-[58%] bg-[linear-gradient(180deg,#f3f5f9,#e8edf4)]" />
      {/* Window light */}
      <div
        className="absolute right-[10%] top-[10%] h-[32%] w-[28%] rounded-[0.35rem]"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(206,224,242,0.7) 55%, rgba(232,214,226,0.45))',
          boxShadow: '0 0 40px 8px rgba(210,226,244,0.45)',
        }}
      />
      <div className="absolute right-[10%] top-[10%] h-[32%] w-[28%] rounded-[0.35rem] border border-white/70" />
      {/* Floor */}
      <div
        className="absolute inset-x-0 bottom-0 h-[42%]"
        style={{
          background: 'linear-gradient(180deg, #dde3ec 0%, #d0d7e2 100%)',
        }}
      />
      {/* Bed */}
      <div
        className="absolute bottom-[16%] left-[10%] right-[28%] h-[22%] rounded-t-[0.6rem]"
        style={{
          background: 'linear-gradient(180deg, #f4f6fa, #e4e9f1)',
          boxShadow: '0 18px 30px -18px rgba(40,46,82,0.3)',
        }}
      />
      <div className="absolute bottom-[30%] left-[14%] h-[8%] w-[22%] rounded-[0.4rem] bg-white/80" />
      {/* Wall plaque */}
      <div className="absolute left-[12%] top-[28%] w-[18%]">
        <Tag compact />
      </div>
    </Studio>
  )
}

function CardScene() {
  return (
    <Studio className="size-full">
      <div
        className="absolute left-1/2 top-1/2 w-[68%] -translate-x-1/2 -translate-y-1/2"
        style={{
          transform: 'translate(-50%, -50%) rotate(-18deg)',
          filter: 'drop-shadow(0 28px 40px rgba(24,30,56,0.22))',
        }}
      >
        <NfcSurface finish="card" shape="card" rings={8} className="w-full" />
      </div>
      <div
        className="absolute left-1/2 top-[58%] w-[62%] -translate-x-1/2 opacity-40"
        style={{
          transform: 'translateX(-50%) rotate(-10deg) translateY(18%)',
          filter: 'blur(0.4px)',
        }}
      >
        <NfcSurface finish="acrylic" shape="card" rings={6} compact showBrand={false} className="w-full" />
      </div>
    </Studio>
  )
}

const scenes: Record<SceneKind, () => ReactNode> = {
  table: TableScene,
  desk: DeskScene,
  machine: MachineScene,
  room: RoomScene,
  card: CardScene,
}

export function SceneVisual({ scene, className = '' }: SceneVisualProps) {
  const Scene = scenes[scene]
  return (
    <div className={`relative isolate overflow-hidden rounded-[1.75rem] sm:rounded-[2rem] ${className}`}>
      <Scene />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.55)' }}
      />
    </div>
  )
}
