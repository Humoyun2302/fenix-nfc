import type { Dictionary } from './types'

export type { Dictionary }

export const uz: Dictionary = {
  meta: {
    title: 'Fenix NFC — Bir tegish. Hammasi tayyor.',
    description:
      'Restoranlar, mehmonxonalar, klinikalar, sport zallari va bizneslar uchun NFC mahsulotlari.',
  },
  a11y: {
    skip: 'Asosiy kontentga o‘tish',
    openMenu: 'Menyuni ochish',
    closeMenu: 'Menyuni yopish',
    close: 'Yopish',
    lang: 'Til',
    primaryNav: 'Asosiy navigatsiya',
    footerNav: 'Pastki navigatsiya',
    useCases: 'Qayerda ishlatiladi',
    home: 'Fenix NFC — bosh sahifa',
    tapPlaque: 'NFC sirtini bosing',
  },
  nav: {
    products: 'Mahsulotlar',
    solutions: 'Yechimlar',
    projects: 'Loyihalar',
    howItWorks: 'Qanday ishlaydi',
    contact: 'Bog‘lanish',
  },
  hero: {
    kicker: 'Fenix NFC',
    line1: 'Bir tegish.',
    line2: 'Hammasi tayyor.',
    lede: 'Restoranlar, mehmonxonalar, klinikalar, sport zallari va bizneslar uchun zamonaviy NFC yechimlari.',
    ctaProducts: 'Mahsulotlarni ko‘rish',
    ctaContact: 'Bog‘lanish',
    scroll: 'Pastga',
  },
  products: {
    eyebrow: 'Mahsulotlar',
    title: 'Fenix mahsulotlari',
    items: {
      acrylic: {
        name: 'Akril NFC',
        line: 'Sovuq sirt. Ko‘rinmas texnologiya.',
        labels: ['Restoran', 'Mehmonxona', 'Ofis'],
        alt: 'Fenix akril NFC plaketasi',
      },
      wood: {
        name: 'Yog‘och NFC',
        line: 'Tabiiy material va zamonaviy NFC texnologiyasining birlashuvi.',
        labels: ['Restoran', 'Mehmonxona', 'Ofis'],
        alt: 'Yorug‘ yog‘ochdan Fenix NFC plaketasi, NFC belgisi va QR kod bilan',
      },
      card: {
        name: 'NFC vizitka',
        line: 'Bitta karta. Butun identitet.',
        labels: ['Tadbirkor', 'Shifokor', 'Jamoa'],
        alt: 'Fenix NFC vizitkasi',
      },
      custom: {
        name: 'Maxsus NFC',
        line: 'Sizning obyektingiz atrofida yaratiladi.',
        labels: ['Sport zali', 'Tadbir', 'Do‘kon'],
        alt: 'Maxsus Fenix NFC yorlig‘i',
      },
    },
  },
  solutions: {
    eyebrow: 'Yechimlar',
    title: 'Har bir biznes uchun',
    tapHint: 'Teging',
    restaurants: {
      label: 'Restoranlar',
      headline: 'Stoldan menyugacha — bir tegishda.',
      sentence: 'Mehmon telefonni yaqinlashtiradi va menyu ochiladi.',
      screen: {
        kicker: 'Fenix · Restoran',
        title: 'Menyu',
        subtitle: '14-stol · Bugun 23:00 gacha',
        actions: ['Menyu', 'Wi-Fi', 'Instagram', 'Manzil', 'Sharhlar'],
      },
    },
    hotels: {
      label: 'Mehmonxonalar',
      headline: 'Mehmon uchun hammasi, qo‘ng‘iroqsiz.',
      sentence: 'Xonadagi bitta plaketa Wi-Fi, xizmat va chiqishni ochadi.',
      screen: {
        kicker: 'Fenix · Mehmonxona',
        title: '412-xona',
        subtitle: 'Xush kelibsiz · Chiqish 12:00',
        actions: ['Wi-Fi', 'Resepshn', 'Xona xizmati', 'Restoran', 'Mehmonxona haqida', 'Chiqish'],
      },
    },
    doctors: {
      label: 'Shifokorlar',
      headline: 'Profil va kontaktlar — qidiruvsiz.',
      sentence: 'Stol plaketasi qabul, mutaxassislik va klinikani ochadi.',
      screen: {
        kicker: 'Fenix · Klinika',
        title: 'Shifokor profili',
        subtitle: 'Kardiolog · 12 yillik tajriba',
        actions: ['Qabulga yozilish', 'Kontakt', 'Mutaxassislik', 'Klinika', 'Hujjatlar', 'Instagram'],
      },
    },
    gyms: {
      label: 'Sport zallari',
      headline: 'Har bir trenajyor — shaxsiy qo‘llanma.',
      sentence: 'NFC orqali mashq texnikasi, video va tavsiyalarni bir tegishda oching.',
      screen: {
        kicker: 'Fenix · Sport zali',
        title: 'Yuqori tortish',
        subtitle: 'Orqa · 07-trenajyor',
        media: '0:48 · texnika',
        stats: [
          { label: 'To‘plam', value: '3–4' },
          { label: 'Takror', value: '8–12' },
          { label: 'Dam', value: '90s' },
        ],
        actions: ['Qanday bajariladi', 'Mushaklar', 'Yondashuv', 'Xavfsizlik'],
      },
    },
    business: {
      label: 'Biznes',
      headline: 'Butun identitet — bir tegishda.',
      sentence: 'Kontakt, Telegram, Instagram va sayt telefonda ochiladi.',
      screen: {
        kicker: 'Fenix · Vizitka',
        title: 'Vizitka',
        subtitle: 'Kontaktlar va havolalar',
        actions: ['Kontaktni saqlash', 'Qo‘ng‘iroq', 'Telegram', 'Instagram', 'Sayt', 'Portfolio'],
      },
    },
  },
  howItWorks: {
    eyebrow: 'Jarayon',
    title: 'Qanday ishlaydi?',
    steps: [
      {
        index: '01',
        title: 'Tanlang',
        body: 'Nima ochilishi kerakligini aytasiz — menyu, Wi-Fi, profil yoki qo‘llanma.',
      },
      {
        index: '02',
        title: 'Biz yaratamiz',
        body: 'Jismoniy NFC mahsulot va uning ortidagi sahifani tayyorlaymiz.',
      },
      {
        index: '03',
        title: 'Telefonni yaqinlashtiring',
        body: 'Mehmon yoki mijoz telefonni yaqinlashtiradi. Qolganini Fenix qiladi.',
      },
    ],
  },
  projects: {
    eyebrow: 'Loyihalar',
    title: 'Biz yaratgan loyihalar',
    items: {
      restaurant: {
        title: 'Restoran menyusi',
        category: 'Mehmondo‘stlik',
        summary: 'Stol belgisi menyu, Wi-Fi va manzilni ochadi.',
      },
      hotel: {
        title: 'Mehmonxona xonasi',
        category: 'Mehmondo‘stlik',
        summary: 'Xona plaketasi xizmatlar va chiqishni bir joyda ushlaydi.',
      },
      gym: {
        title: 'Sport zali qo‘llanmasi',
        category: 'Fitnes',
        summary: 'Har bir trenajyor texnika va yondashuvni ochadi.',
      },
      card: {
        title: 'NFC vizitka',
        category: 'Identitet',
        summary: 'Kontakt va havolalar telefonda saqlanadi.',
      },
    },
  },
  contact: {
    eyebrow: 'Bog‘lanish',
    title: 'G‘oyangiz bormi?',
    line: 'Uni bir tegishda ochiladigan qilamiz.',
    cta: 'Bog‘lanish',
    telegram: 'Telegram',
    instagram: 'Instagram',
    phone: 'Telefon',
    email: 'Email',
    location: 'Toshkent, O‘zbekiston',
    formName: 'Ism',
    formReach: 'Qanday bog‘lanaylik',
    formReachPlaceholder: 'Telegram, email yoki telefon',
    formIdea: 'G‘oya',
    formIdeaPlaceholder: 'Bir tegishda nima ochilishi kerak?',
    formSend: 'Yuborish',
    formSending: 'Yuborilmoqda…',
    formHint: 'Telegram — eng tez yo‘l.',
    formReceived: 'Qabul qilindi.',
    formReceivedBody: 'Tez orada javob beramiz. Shoshilinch bo‘lsa, Telegram yozing.',
    honeypot: 'Bu maydonni to‘ldirmang',
  },
  footer: {
    tagline: 'Jismoniy obyekt. Raqamli tajriba.',
    note: 'Jismoniy mahsulot · Raqamli tajriba',
  },
  phoneUi: {
    poweredBy: 'Fenix orqali',
    idleHint: 'Yorliqqa yaqinlashtiring',
    time: '9:41',
  },
}
