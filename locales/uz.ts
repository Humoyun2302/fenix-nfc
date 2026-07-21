import type { Dictionary } from "./types";

export const uz = {
  meta: { title: "FENIX NFC — biznes uchun zamonaviy NFC yechimlari", description: "NFC menyu, raqamli tashrif qog‘ozlari, sharh kartalari va zamonaviy biznes uchun individual NFC yechimlari." },
  common: { contact: "Loyihani muhokama qilish", learn: "Batafsil", menu: "Menyuni ochish", close: "Menyuni yopish", language: "Tilni tanlash", scroll: "Pastga aylantirish", privacy: "Maxfiylik siyosati", top: "Yuqoriga", next: "Keyingi" },
  nav: { solutions: "Yechimlar", how: "Qanday ishlaydi", projects: "Loyihalar", about: "Biz haqimizda", contacts: "Kontaktlar" },
  journey: {
    label: "Sayt qanday ishlaydi",
    hints: {
      solutions: "Nima qilamiz",
      how: "Qanday ishlaydi",
      projects: "Namunalar",
      contacts: "Loyihani boshlash",
    },
  },
  hero: { kicker: "NFC experiences for modern business", title: "Biznes kelajagi bir teginishdan boshlanadi", subtitle: "Jismoniy mahsulotni raqamli tajriba bilan bog‘laydigan NFC yechimlarini yaratamiz.", solutions: "Yechimlarni ko‘rish", discuss: "Loyihani muhokama qilish", connected: "Ulandi", cardLabel: "Interaktiv NFC karta" },
  marquee: ["NFC MENU", "DIGITAL BUSINESS CARD", "SMART REVIEWS", "HOTEL SERVICE", "WI-FI ACCESS", "CUSTOM NFC"],
  solutions: {
    eyebrow: "Bir teginish — ko‘plab imkoniyatlar", title: "Bitta jismoniy obyekt. Cheksiz raqamli tajriba.", subtitle: "NFC texnologiyasini kartalar, belgilar va interyer elementlariga joylab, ularni biznes uchun qulay raqamli vositaga aylantiramiz.",
    items: [
      ["NFC menyu", "Restoran menyusi ilova va QR-kod qidiruvisiz darhol ochiladi."],
      ["NFC tashrif qog‘ozlari", "Kontaktlar, portfolio va ijtimoiy tarmoqlar bitta zamonaviy kartada."],
      ["Sharhlar", "Mijozlarga kerakli platformada tez sharh qoldirishga yordam bering."],
      ["Mehmonxonalar", "Xodim chaqirish, mehmonxona xizmatlari, menyu va mehmonlar uchun ma’lumot."],
      ["Wi-Fi", "Bir teginish orqali tarmoqqa qulay ulanish."],
      ["Individual yechimlar", "Brendingiz vazifalari va uslubiga mos NFC mahsulotlarini yaratamiz."],
    ],
  },
  how: {
    eyebrow: "Qanday ishlaydi", title: "Bir teginish. Uch oddiy qadam.",
    items: [["01", "Teginish", "Mijoz smartfonini NFC mahsulotiga yaqinlashtiradi."], ["02", "Darhol ochilish", "Telefon kerakli sahifani ilova o‘rnatmasdan avtomatik ochadi."], ["03", "Harakat", "Mijoz menyuni ko‘radi, kontaktni saqlaydi, sharh qoldiradi yoki xizmatdan foydalanadi."]],
    wave: "Bir teginish",
  },
  demo: {
    eyebrow: "Teginishdan harakatgacha", title: "Jismoniy mahsulot brendingiz raqamli ekotizimiga kirish nuqtasiga aylanadi.", sentence: "Bir teginish chiroyli raqamli profil, menyu yoki xizmatni ilovasiz va tez ochadi.",
    profile: "Profil", menu: "Menyu", website: "Sayt", telegram: "Telegram", instagram: "Instagram", contacts: "Kontaktlar", menuItems: ["Nonushtalar", "Asosiy taomlar", "Ichimliklar"],
  },
  uses: {
    eyebrow: "Bizning yechimlar", title: "Biznesingiz vazifalari uchun texnologiya", subtitle: "Tayyor mahsulotdan individual raqamli ekotizimgacha.",
    items: [
      { title: "Restoran va kafelar", description: "Elektron menyu, NFC belgilar va taomlar, toifalar, narxlar hamda suratlarni boshqarish paneli.", benefits: ["Qayta chop etmasdan yangilash", "Shaxsiy dizayn", "Qulay boshqaruv paneli"] },
      { title: "Shaxsiy NFC tashrif qog‘ozlari", description: "Kontaktlar, portfolio va ijtimoiy tarmoqlar joylashgan zamonaviy karta.", benefits: ["Barcha havolalar bir joyda", "Kontaktni darhol saqlash", "Brend uslubidagi dizayn"] },
      { title: "Mehmonxona va servis", description: "Mehmonlarga xizmat va ma’lumotlarga tez kirish uchun NFC belgilar.", benefits: ["Xodim chaqirish", "Menyu va xizmatlar", "Doimo dolzarb ma’lumot"] },
      { title: "Sharhlar va ijtimoiy tarmoqlar", description: "Teginishdan so‘ng mijozni kerakli platformaga yo‘naltiring.", benefits: ["Sharhga tez yo‘l", "Ijtimoiy tarmoq havolalari", "Mijoz uchun sodda"] },
      { title: "Maxsus yechimlar", description: "Kompaniya vazifalari uchun individual NFC mahsulotlari, saytlar va boshqaruv panellari.", benefits: ["Noyob jismoniy mahsulot", "Shaxsiy raqamli mantiq", "Brendga to‘liq moslashuv"] },
    ],
  },
  projects: {
    eyebrow: "Loyihalar", title: "Foydalanishni istaydigan mahsulotlar yaratamiz", subtitle: "Har bir NFC yechimi biznes uslubi, vazifalari va auditoriyasiga moslashtiriladi.", view: "Loyihani ko‘rish",
    categories: { hospitality: "Mehmondo‘stlik", business: "Biznes", events: "Tadbirlar" },
    descriptions: { nova: "Mehmonlarga xizmat, menyu va xodimlar bilan aloqaga kirish uchun NFC ssenariy.", volt: "Zamonaviy jamoa uchun yagona raqamli tashrif qog‘ozlari tizimi.", artline: "Tadbir dasturi, ro‘yxatdan o‘tish va kontaktlari bilan interaktiv vosita." },
  },
  benefits: {
    eyebrow: "Afzalliklar", title: "Ko‘rinmaydigan texnologiya. Mijoz his qiladigan natija.",
    items: [["Ilovasiz", "Smartfonda to‘g‘ridan-to‘g‘ri ochiladi."], ["Soniyalarda ishlaydi", "Teginishdan kerakli harakatgacha bir lahza."], ["Zamonaviy dizayn", "Jismoniy va raqamli mahsulot yagona ko‘rinadi."], ["Havola yangilanadi", "Mahsulotni qayta tayyorlamasdan manzilni o‘zgartiring."], ["Ko‘pchilik smartfonlarga mos", "Zamonaviy iPhone va Android modellarda ishlaydi."], ["Brendga to‘liq moslashuv", "Rang, tipografika va interfeys sizning uslubingizda."], ["Ishga tushgandan keyin yordam", "Yechimni yangilash va rivojlantirishga yordam beramiz."], ["Shaxsiy raqamli infratuzilma", "Sahifalar, saytlar va boshqaruv panellarini yaratamiz."]],
  },
  about: {
    eyebrow: "FENIX NFC haqida", title: "Jismoniy va raqamli olamni bog‘laymiz",
    paragraphs: ["FENIX NFC — biznes uchun zamonaviy NFC mahsulotlarini yaratuvchi texnologik studiya. Har bir brend bilan muloqot tez, tushunarli va esda qolarli bo‘lishi uchun dizayn, jismoniy mahsulot va raqamli ishlab chiqishni birlashtiramiz.", "Biz shunchaki NFC teglarini dasturlamaymiz. Mahsulot ko‘rinishidan teginishdan keyin ochiladigan sahifagacha to‘liq foydalanuvchi tajribasini loyihalaymiz."],
  },
  process: {
    eyebrow: "Ish jarayoni", title: "Birinchi g‘oyadan tayyor teginishgacha",
    items: [["01", "Tanishuv", "Vazifa, auditoriya va loyiha maqsadlarini muhokama qilamiz."], ["02", "Konsepsiya", "Mos NFC ssenariy va vosita formatini taklif qilamiz."], ["03", "Dizayn", "Jismoniy mahsulot va raqamli interfeysni loyihalaymiz."], ["04", "Ishlab chiqish", "Sahifa, sayt yoki boshqaruv panelini yaratib, NFC’ni sozlaymiz."], ["05", "Ishga tushirish", "Yechimni tekshiramiz, topshiramiz va aloqada qolamiz."]],
  },
  faq: {
    eyebrow: "FAQ", title: "Ko‘p beriladigan savollar", open: "Javobni ochish",
    items: [["Ilova o‘rnatish kerakmi?", "Yo‘q. Ko‘pchilik zamonaviy smartfonlarda NFC alohida ilovasiz ishlaydi."], ["Karta tayyorlangandan keyin havolani o‘zgartirish mumkinmi?", "Ha. Boshqariladigan havolani jismoniy mahsulotni qayta tayyorlamasdan o‘zgartirish mumkin."], ["Dizaynni brendimiz uslubida qilish mumkinmi?", "Ha. Rang, tipografika, kompozitsiya va interfeysni kompaniya uslubiga moslaymiz."], ["Shaxsiy sayt yoki menyu buyurtma qilish mumkinmi?", "Ha. Kontent boshqaruvi uchun raqamli sahifa, menyu, profil va boshqaruv panellarini yaratamiz."], ["NFC iPhone va Android’da ishlaydimi?", "Ko‘pchilik zamonaviy iPhone va Android modellari NFC’ni o‘qiydi. Ishlash qurilma modeli va tizim sozlamalariga bog‘liq bo‘lishi mumkin."]],
  },
  cta: { eyebrow: "Keyingi teginish", title: "Brendingiz bilan yangi teginish yaratamizmi?", subtitle: "Vazifangizni ayting — mos NFC yechimini taklif qilamiz.", telegram: "Telegram’da yozish", contact: "Biz bilan bog‘lanish" },
  footer: { description: "Biznes, brend va tadbirlar uchun zamonaviy NFC yechimlari.", navigation: "Navigatsiya", contacts: "Kontaktlar", social: "Ijtimoiy tarmoqlar", copyright: "Barcha huquqlar himoyalangan.", privacy: "Maxfiylik siyosati" },
} satisfies Dictionary;
