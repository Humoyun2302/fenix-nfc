export const navItems = [
  { id: 'products', href: '#products' },
  { id: 'solutions', href: '#solutions' },
  { id: 'work', href: '#work' },
  { id: 'process', href: '#process' },
] as const

export type NavId = (typeof navItems)[number]['id']
