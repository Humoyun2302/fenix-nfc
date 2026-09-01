export type ProductId = 'wood' | 'acrylic' | 'card' | 'custom'

export interface ProductDef {
  id: ProductId
  num: string
  field: 'white' | 'ink' | 'grey' | 'paper'
  cls: string
}

export const PRODUCTS: ProductDef[] = [
  { id: 'wood', num: '01', field: 'white', cls: 'prow--a' },
  { id: 'acrylic', num: '02', field: 'ink', cls: 'prow--b prow--flip' },
  { id: 'card', num: '03', field: 'grey', cls: 'prow--c' },
  { id: 'custom', num: '04', field: 'paper', cls: 'prow--d prow--flip' },
]
