import type { SceneKind } from '@/data/solutions'
import type { ProjectKey } from '@/i18n/types'

export type Project = {
  id: ProjectKey
  scene: SceneKind
}

export const projects: Project[] = [
  { id: 'restaurant', scene: 'table' },
  { id: 'hotel', scene: 'room' },
  { id: 'gym', scene: 'machine' },
  { id: 'card', scene: 'card' },
]
