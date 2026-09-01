import type { ReactNode } from 'react'
import { useLang } from '../locales'
import { PROJECTS } from '../data/projects'
import type { ProjectId } from '../data/projects'
import { Reveal } from '../components/Reveal'
import { SectionMark } from '../components/SectionMark'
import { WoodPlaque } from '../components/WoodPlaque'
import { AcrylicPlaque } from '../components/AcrylicPlaque'
import { BusinessCard } from '../components/BusinessCard'
import { RoundTag } from '../components/RoundTag'
import './Projects.css'

function Visual({ id }: { id: ProjectId }): ReactNode {
  switch (id) {
    case 'menu':
      return (
        <div className="pjv pjv--menu">
          <WoodPlaque className="pjv__plaque" />
          <svg className="pjv__plate" viewBox="0 0 200 60" aria-hidden="true">
            <g stroke="rgba(10,10,10,0.4)" strokeWidth="1.3" fill="none">
              <ellipse cx="100" cy="30" rx="88" ry="20" />
              <ellipse cx="100" cy="29" rx="62" ry="13" opacity="0.5" />
            </g>
          </svg>
        </div>
      )
    case 'card':
      return (
        <div className="pjv pjv--card">
          <span className="pjv__frame" aria-hidden="true" />
          <BusinessCard className="pjv__bcard" />
        </div>
      )
    case 'custom':
      return (
        <div className="pjv pjv--custom">
          <AcrylicPlaque tone="light" className="pjv__acr" />
          <RoundTag className="pjv__tag" />
        </div>
      )
  }
}

export function Projects() {
  const { t } = useLang()
  return (
    <section id="work" className="work">
      <div className="container">
        <SectionMark num="06" label={t.work.mark} />
        <Reveal as="h2" className="display sec-title work__title" delay={60}>
          {t.work.title}
        </Reveal>
      </div>

      <div className="container work__grid">
        {PROJECTS.map((p, i) => {
          const it = t.work.items[p.id]
          const meta = `${it.type} · ${it.product} · ${it.year}`
          return (
            <Reveal as="figure" key={p.id} className={`pj ${p.cls}`} delay={i * 90}>
              <div className="pj__media">
                <Visual id={p.id} />
                <figcaption className="pj__overlay">
                  <span className="pj__oname">{it.name}</span>
                  <span className="pj__ometa micro">
                    {t.work.meta.type} — {it.type} / {t.work.meta.product} — {it.product} / {t.work.meta.year} — {it.year}
                  </span>
                </figcaption>
              </div>
              <div className="pj__info">
                <span className="micro micro--mute">{`${p.num}`}</span>
                <span className="pj__name">{it.name}</span>
                <span className="pj__meta micro micro--mute">{meta}</span>
              </div>
            </Reveal>
          )
        })}
      </div>
    </section>
  )
}
