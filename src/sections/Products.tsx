import type { ReactNode } from 'react'
import { useLang } from '../locales'
import { PRODUCTS } from '../data/products'
import type { ProductId } from '../data/products'
import { PRODUCT_PHOTOS } from '../data/works'
import { Reveal } from '../components/Reveal'
import { MaskLine } from '../components/MaskLine'
import { SectionMark } from '../components/SectionMark'
import './Products.css'

function DimensionLine() {
  return (
    <svg className="pv__dim" viewBox="0 0 150 22" aria-hidden="true">
      <g stroke="rgba(91,140,255,0.6)" strokeWidth="1">
        <path d="M4 4 V14 M146 4 V14 M4 9 H146" />
      </g>
      <text
        x="75"
        y="21"
        textAnchor="middle"
        fontFamily="var(--font-b)"
        fontSize="8.5"
        letterSpacing="2"
        fill="rgba(100,116,139,0.9)"
      >
        140 × 95 MM
      </text>
    </svg>
  )
}

function Visual({ id, alt }: { id: ProductId; alt: string }): ReactNode {
  switch (id) {
    case 'wood':
      return (
        <div className="pv pv--wood">
          <img
            className="ph pv__photo"
            src={PRODUCT_PHOTOS.wood.img}
            width={PRODUCT_PHOTOS.wood.w}
            height={PRODUCT_PHOTOS.wood.h}
            alt={alt}
            loading="lazy"
            decoding="async"
          />
          <DimensionLine />
        </div>
      )
    case 'acrylic':
      return (
        <div className="pv pv--acrylic">
          <div className="pv__plate">
            <img
              className="ph"
              src={PRODUCT_PHOTOS.acrylic.img}
              width={PRODUCT_PHOTOS.acrylic.w}
              height={PRODUCT_PHOTOS.acrylic.h}
              alt={`${alt} — ${PRODUCT_PHOTOS.acrylic.name}`}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      )
    case 'card':
      return (
        <div className="pv pv--card">
          <img
            className="ph pv__photo"
            src={PRODUCT_PHOTOS.card.img}
            width={PRODUCT_PHOTOS.card.w}
            height={PRODUCT_PHOTOS.card.h}
            alt={`${alt} — ${PRODUCT_PHOTOS.card.name}`}
            loading="lazy"
            decoding="async"
          />
        </div>
      )
    case 'custom':
      return (
        <div className="pv pv--custom">
          {([PRODUCT_PHOTOS.customA, PRODUCT_PHOTOS.customB] as const).map((p) => (
            <img
              key={p.name}
              className="ph pv__mini"
              src={p.img}
              width={p.w}
              height={p.h}
              alt={`${alt} — ${p.name}`}
              loading="lazy"
              decoding="async"
            />
          ))}
          <svg className="pv__dash" viewBox="0 0 200 200" aria-hidden="true">
            <rect
              x="4"
              y="4"
              width="192"
              height="192"
              rx="28"
              fill="none"
              stroke="rgba(91,140,255,0.5)"
              strokeWidth="1.5"
              strokeDasharray="7 8"
            />
            <path d="M100 74 V126 M74 100 H126" stroke="#5B8CFF" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <img
            className="ph pv__mini"
            src={PRODUCT_PHOTOS.customC.img}
            width={PRODUCT_PHOTOS.customC.w}
            height={PRODUCT_PHOTOS.customC.h}
            alt={`${alt} — ${PRODUCT_PHOTOS.customC.name}`}
            loading="lazy"
            decoding="async"
          />
        </div>
      )
  }
}

export function Products() {
  const { t } = useLang()
  const labels = t.products.labels

  return (
    <section id="products" className="products">
      <div className="container">
        <SectionMark num="03" label={t.products.mark} />
        <h2 className="display sec-title">
          {t.products.title.map((line, i) => (
            <MaskLine key={line} className="sec-title__line" delay={i * 100}>
              {line}
            </MaskLine>
          ))}
        </h2>
      </div>

      <div className="container products__list">
        {PRODUCTS.map((p) => {
          const item = t.products.items[p.id]
          return (
            <article key={p.id} className={`prow ${p.cls}`}>
              <Reveal className="prow__mediawrap">
                <span className="num-ghost prow__num" aria-hidden="true">
                  {p.num}
                </span>
                <div className={`prow__media field--${p.field}`}>
                  <Visual id={p.id} alt={item.name} />
                </div>
              </Reveal>

              <div className="prow__body">
                <Reveal className="micro micro--mute prow__kicker">{`${t.products.mark} / ${p.num}`}</Reveal>
                <Reveal as="h3" className="display prow__name" delay={70}>
                  {item.name}
                </Reveal>
                <Reveal as="p" className="prow__line" delay={130}>
                  {item.line}
                </Reveal>
                <Reveal as="dl" className="prow__specs" delay={190}>
                  <div>
                    <dt className="micro micro--mute">{labels.material}</dt>
                    <dd>{item.material}</dd>
                  </div>
                  <div>
                    <dt className="micro micro--mute">{labels.tech}</dt>
                    <dd>{item.tech}</dd>
                  </div>
                  <div>
                    <dt className="micro micro--mute">{labels.custom}</dt>
                    <dd>{item.custom}</dd>
                  </div>
                </Reveal>
                <Reveal className="prow__uses" delay={250}>
                  <span className="micro micro--mute">{labels.uses}</span>
                  <span className="prow__usesline">{item.uses}</span>
                </Reveal>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
