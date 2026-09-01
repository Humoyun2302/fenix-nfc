import type { IconName } from '@/lib/icons'
import type { SolutionKey } from '@/i18n/types'

export type SceneKind = 'table' | 'desk' | 'machine' | 'room' | 'card'

export type Solution = {
  id: SolutionKey
  scene: SceneKind
  actions: { icon: IconName; primary?: boolean }[]
  hasMedia?: boolean
  hasStats?: boolean
}

export const solutions: Solution[] = [
  {
    id: 'restaurants',
    scene: 'table',
    actions: [
      { icon: 'menu-book', primary: true },
      { icon: 'wifi' },
      { icon: 'instagram' },
      { icon: 'map-pin' },
      { icon: 'star' },
    ],
  },
  {
    id: 'hotels',
    scene: 'room',
    actions: [
      { icon: 'wifi', primary: true },
      { icon: 'bell' },
      { icon: 'room-service' },
      { icon: 'menu-book' },
      { icon: 'book' },
      { icon: 'logout' },
    ],
  },
  {
    id: 'doctors',
    scene: 'desk',
    actions: [
      { icon: 'calendar', primary: true },
      { icon: 'phone' },
      { icon: 'stethoscope' },
      { icon: 'map-pin' },
      { icon: 'file' },
      { icon: 'instagram' },
    ],
  },
  {
    id: 'gyms',
    scene: 'machine',
    hasMedia: true,
    hasStats: true,
    actions: [
      { icon: 'play', primary: true },
      { icon: 'activity' },
      { icon: 'repeat' },
      { icon: 'shield' },
    ],
  },
  {
    id: 'business',
    scene: 'card',
    actions: [
      { icon: 'user-plus', primary: true },
      { icon: 'phone' },
      { icon: 'send' },
      { icon: 'instagram' },
      { icon: 'globe' },
      { icon: 'briefcase' },
    ],
  },
]
