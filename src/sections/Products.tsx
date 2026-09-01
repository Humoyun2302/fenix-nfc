import { ProductVisual } from '@/components/ProductVisual'
import { MaskedLines, Reveal } from '@/components/Reveal'
import { products } from '@/data/products'
import { useI18n } from '@/i18n'

export function Products() {
  const { lang, t } = useI18n()

  return (
    <section id="products" className="section-y relative" aria-labelledby="products-title">
      <div className="shell">
        <div className="max-w-[36rem]">
          <p className="eyebrow">{t.products.eyebrow}</p>
          <MaskedLines
            key={lang}
            as="h2"
            id="products-title"
            lines={[t.products.title]}
            className="display-2 mt-4 text-ink"
          />
        </div>

        <div className="mt-16 flex flex-col gap-20 sm:mt-20 lg:gap-28">
          {products.map((product, index) => {
            const copy = t.products.items[product.id]
            const reverse = index % 2 === 1
            return (
              <article
                key={product.id}
                className="grid items-center gap-8 lg:grid-cols-12 lg:gap-14"
              >
                <Reveal
                  className={`order-1 lg:col-span-5 ${reverse ? 'lg:col-start-8' : ''}`}
                  delay={0.06}
                >
                  <span className="numeral text-[0.6875rem] tracking-[0.2em] text-ash">
                    {product.index}
                  </span>
                  <h3 className="display-3 mt-3 text-ink">{copy.name}</h3>
                  <p className="mt-4 max-w-[34ch] text-[1.125rem] font-medium tracking-[-0.02em] text-graphite">
                    {copy.line}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1">
                    {copy.labels.map((item) => (
                      <li key={item} className="text-[0.8125rem] text-slate">
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>

                <Reveal
                  className={`order-2 lg:col-span-7 ${reverse ? 'lg:col-start-1 lg:row-start-1' : ''}`}
                  delay={0.04}
                >
                  <ProductVisual product={product} copy={copy} priority={index === 0} />
                </Reveal>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
