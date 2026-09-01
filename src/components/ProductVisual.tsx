import { PlaqueStage } from '@/components/PlaqueStage'
import type { Product } from '@/data/products'
import type { Dictionary } from '@/i18n/types'

const finishToShape = {
  acrylic: 'square',
  wood: 'square',
  card: 'card',
  custom: 'round',
} as const

type ProductVisualProps = {
  product: Product
  copy: Dictionary['products']['items'][Product['id']]
  priority?: boolean
}

export function ProductVisual({ product, copy, priority = false }: ProductVisualProps) {
  if (product.image) {
    return (
      <figure className="product-stage">
        <img
          src={product.image}
          alt={copy.alt}
          width={1600}
          height={1200}
          className="product-stage-img"
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
        />
      </figure>
    )
  }

  return (
    <div className="product-stage product-stage-generated" role="img" aria-label={copy.alt}>
      <PlaqueStage
        finish={product.finish}
        shape={finishToShape[product.finish]}
        className="w-full max-w-[18rem] sm:max-w-[20rem]"
        baseRotate={product.finish === 'card' ? { x: 8, y: -18, z: -8 } : { x: 6, y: -12, z: -2 }}
      />
    </div>
  )
}

export function HeroProduct({ alt }: { alt: string }) {
  return (
    <figure className="product-stage product-stage-hero">
      <img
        src="/products/wood-nfc.jpg"
        alt={alt}
        width={1600}
        height={1200}
        className="product-stage-img"
        loading="eager"
        decoding="async"
        fetchPriority="high"
      />
    </figure>
  )
}
