import { ArrowUpRight } from 'lucide-react'
import { useState, type FormEvent, type InputHTMLAttributes } from 'react'
import { MaskedLines, Reveal } from '@/components/Reveal'
import { Button } from '@/components/ui/Button'
import { contactChannels } from '@/data/contact'
import { useI18n } from '@/i18n'
import { usePointerGlow } from '@/hooks/usePointerTilt'

export function Contact() {
  const { lang, t } = useI18n()
  const { glowRef, onPointerMove, onPointerLeave } = usePointerGlow<HTMLDivElement>()
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const channelLabel = {
    telegram: t.contact.telegram,
    instagram: t.contact.instagram,
    phone: t.contact.phone,
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const params = new URLSearchParams()
    for (const [key, value] of data.entries()) {
      if (typeof value === 'string') params.append(key, value)
    }
    setSending(true)
    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      })
    } catch {
      /* Local preview still acknowledges the attempt. */
    } finally {
      setSending(false)
      setSent(true)
    }
  }

  return (
    <section id="contact" className="section-y relative" aria-labelledby="contact-title">
      <div className="shell">
        <div
          ref={glowRef}
          onPointerMove={onPointerMove}
          onPointerLeave={onPointerLeave}
          className="glass glass-sheen pointer-glow relative overflow-hidden rounded-[1.75rem] px-6 py-12 sm:rounded-[2.25rem] sm:px-12 sm:py-16 lg:px-16 lg:py-20"
        >
          <p className="eyebrow">{t.contact.eyebrow}</p>
          <MaskedLines
            key={lang}
            as="h2"
            id="contact-title"
            lines={[t.contact.title]}
            className="display-2 mt-5 text-ink"
          />
          <p className="lede mt-5 max-w-[32ch]">{t.contact.line}</p>

          <ul className="mt-10 max-w-[28rem] divide-y divide-[color:var(--fx-hairline)] border-y border-[color:var(--fx-hairline)]">
            {contactChannels.map((channel) => (
              <li key={channel.id}>
                <a
                  href={channel.href}
                  {...(channel.external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
                  className="group flex min-h-14 items-center justify-between gap-4 py-3"
                >
                  <span>
                    <span className="block text-[0.625rem] uppercase tracking-[0.16em] text-ash">
                      {channelLabel[channel.id]}
                    </span>
                    <span className="mt-0.5 block text-[1.0625rem] font-medium tracking-[-0.02em] text-ink">
                      {channel.value}
                    </span>
                  </span>
                  <ArrowUpRight className="size-4 shrink-0 text-ash transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-ink" />
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[0.8125rem] text-ash">{t.contact.location}</p>
        </div>

        <Reveal className="mx-auto mt-14 max-w-[32rem] sm:mt-16" delay={0.08}>
          {sent ? (
            <div>
              <p className="text-[1.5rem] font-medium tracking-[-0.03em] text-ink">
                {t.contact.formReceived}
              </p>
              <p className="mt-3 max-w-[36ch] text-[1.0625rem] leading-relaxed text-slate">
                {t.contact.formReceivedBody}
              </p>
            </div>
          ) : (
            <form
              name="project"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={onSubmit}
              className="flex flex-col gap-5"
            >
              <input type="hidden" name="form-name" value="project" />
              <p className="hidden">
                <label>
                  {t.contact.honeypot}
                  <input name="bot-field" />
                </label>
              </p>

              <Field label={t.contact.formName} name="name" autoComplete="name" required />
              <Field
                label={t.contact.formReach}
                name="contact"
                placeholder={t.contact.formReachPlaceholder}
                required
              />
              <label className="block">
                <span className="text-[0.625rem] uppercase tracking-[0.16em] text-ash">
                  {t.contact.formIdea}
                </span>
                <textarea
                  name="message"
                  required
                  rows={4}
                  placeholder={t.contact.formIdeaPlaceholder}
                  className="mt-2 w-full resize-y rounded-2xl border border-[color:var(--fx-hairline)] bg-white/45 px-4 py-3 text-[1rem] text-ink outline-none placeholder:text-ash/80 focus:border-ink/20"
                />
              </label>

              <Button type="submit" variant="ink" arrow disabled={sending}>
                {sending ? t.contact.formSending : t.contact.formSend}
              </Button>
              <p className="text-[0.75rem] text-ash">{t.contact.formHint}</p>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  )
}

function Field({
  label,
  name,
  ...rest
}: {
  label: string
  name: string
} & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-[0.625rem] uppercase tracking-[0.16em] text-ash">{label}</span>
      <input
        name={name}
        className="mt-2 min-h-12 w-full rounded-2xl border border-[color:var(--fx-hairline)] bg-white/45 px-4 text-[1rem] text-ink outline-none placeholder:text-ash/80 focus:border-ink/20"
        {...rest}
      />
    </label>
  )
}
