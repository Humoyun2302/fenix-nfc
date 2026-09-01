export const contact = {
  brand: 'Fenix NFC',
  email: 'hello@fenixnfc.com',
  phoneDisplay: '+998 90 000 00 00',
  phoneHref: '+998900000000',
  telegramHandle: '@fenixnfc',
  telegramUrl: 'https://t.me/fenixnfc',
  instagramHandle: '@fenixnfc',
  instagramUrl: 'https://instagram.com/fenixnfc',
  siteUrl: 'https://fenixnfc.netlify.app',
} as const

export type ChannelId = 'telegram' | 'instagram' | 'phone'

export type ContactChannel = {
  id: ChannelId
  value: string
  href: string
  external?: boolean
}

export const contactChannels: ContactChannel[] = [
  {
    id: 'telegram',
    value: contact.telegramHandle,
    href: contact.telegramUrl,
    external: true,
  },
  {
    id: 'instagram',
    value: contact.instagramHandle,
    href: contact.instagramUrl,
    external: true,
  },
  {
    id: 'phone',
    value: contact.phoneDisplay,
    href: `tel:${contact.phoneHref}`,
  },
]
