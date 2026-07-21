export const siteConfig = {
  name: "FENIX NFC",
  url: "https://fenixnfc.uz",
  email: "hello@fenixnfc.uz",
  phone: "+998 XX XXX XX XX",
  phoneHref: "tel:+998000000000",
  telegramHandle: "@fenix_nfc",
  telegram: "https://t.me/fenix_nfc",
  instagramHandle: "@fenix.nfc",
  instagram: "https://instagram.com/fenix.nfc",
  privacy: "#privacy",
} as const;

export const navigation = [
  { href: "#solutions", key: "solutions" },
  { href: "#how", key: "how" },
  { href: "#projects", key: "projects" },
  { href: "#about", key: "about" },
  { href: "#contact", key: "contacts" },
] as const;
