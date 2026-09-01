import type { Finish } from '@/components/NfcSurface'
import type { ProductKey } from '@/i18n/types'

export type Product = {
  id: ProductKey
  index: string
  finish: Finish
  image?: string
}

export const products: Product[] = [
  { id: 'acrylic', index: '01', finish: 'acrylic' },
  { id: 'wood', index: '02', finish: 'wood', image: '/products/wood-nfc.jpg' },
  { id: 'card', index: '03', finish: 'card' },
  { id: 'custom', index: '04', finish: 'custom' },
]
