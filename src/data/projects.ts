export type ProjectId = 'menu' | 'card' | 'custom'

export interface ProjectDef {
  id: ProjectId
  num: string
  cls: string
}

export const PROJECTS: ProjectDef[] = [
  { id: 'menu', num: '01', cls: 'pj--a' },
  { id: 'card', num: '02', cls: 'pj--b' },
  { id: 'custom', num: '03', cls: 'pj--c' },
]
