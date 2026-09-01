import { SceneVisual } from '@/components/SceneVisual'
import { MaskedLines, Reveal } from '@/components/Reveal'
import { projects } from '@/data/portfolio'
import { useI18n } from '@/i18n'

export function Work() {
  const { lang, t } = useI18n()

  return (
    <section id="work" className="section-y relative" aria-labelledby="work-title">
      <div className="shell">
        <div className="max-w-[36rem]">
          <p className="eyebrow">{t.projects.eyebrow}</p>
          <MaskedLines
            key={lang}
            as="h2"
            id="work-title"
            lines={[t.projects.title]}
            className="display-2 mt-4 text-ink"
          />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 sm:mt-16 sm:grid-cols-2 lg:gap-10">
          {projects.map((project, index) => {
            const copy = t.projects.items[project.id]
            return (
              <Reveal key={project.id} delay={index * 0.05}>
                <article>
                  <div className="overflow-hidden rounded-[1.35rem] sm:rounded-[1.6rem]">
                    <SceneVisual scene={project.scene} className="aspect-[5/4] rounded-none" />
                  </div>
                  <p className="mt-4 text-[0.625rem] uppercase tracking-[0.16em] text-ash">
                    {copy.category}
                  </p>
                  <h3 className="mt-1.5 text-[1.25rem] font-medium tracking-[-0.03em] text-ink">
                    {copy.title}
                  </h3>
                  <p className="mt-2 max-w-[36ch] text-[0.9375rem] leading-relaxed text-slate">
                    {copy.summary}
                  </p>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
