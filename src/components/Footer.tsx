import { Wordmark } from '@/components/Wordmark'
import { contact, contactChannels } from '@/data/contact'
import { navItems, type NavId } from '@/data/navigation'
import { useI18n } from '@/i18n'

const year = new Date().getFullYear()

export function Footer() {
  const { t } = useI18n()

  const labels: Record<NavId, string> = {
    products: t.nav.products,
    solutions: t.nav.solutions,
    work: t.nav.projects,
    process: t.nav.howItWorks,
  }

  const channelLabel = {
    telegram: t.contact.telegram,
    instagram: t.contact.instagram,
    phone: t.contact.phone,
  }

  return (
    <footer className="relative border-t border-[color:var(--fx-hairline)]">
      <div className="shell py-10 sm:py-14">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-[22rem]">
            <a href="#top" className="inline-flex min-h-11 items-center" aria-label={t.a11y.home}>
              <Wordmark className="h-[1.05rem] w-auto" />
            </a>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-slate">{t.footer.tagline}</p>
          </div>

          <nav aria-label={t.a11y.footerNav}>
            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    className="text-[0.875rem] font-medium text-graphite transition-colors duration-300 hover:text-ink"
                  >
                    {labels[item.id]}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  className="text-[0.875rem] font-medium text-graphite transition-colors duration-300 hover:text-ink"
                >
                  {t.nav.contact}
                </a>
              </li>
            </ul>
          </nav>

          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {contactChannels.map((channel) => (
              <li key={channel.id}>
                <a
                  href={channel.href}
                  {...(channel.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  className="text-[0.875rem] font-medium text-slate transition-colors duration-300 hover:text-ink"
                >
                  {channelLabel[channel.id]}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-[color:var(--fx-hairline)] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[0.75rem] tracking-[-0.01em] text-ash">
            © {year} {contact.brand}
          </p>
          <p className="text-[0.75rem] tracking-[-0.01em] text-ash">{t.footer.note}</p>
        </div>
      </div>
    </footer>
  )
}
