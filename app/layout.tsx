import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { LocaleProvider } from "@/hooks/use-locale";
import { siteConfig } from "@/data/siteConfig";
import "./globals.css";

const geist = Geist({ subsets: ["latin", "cyrillic"], variable: "--font-geist" });

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: "FENIX NFC — современные NFC-решения для бизнеса",
  description: "NFC-меню, цифровые визитки, карточки для отзывов и индивидуальные NFC-решения для современного бизнеса.",
  icons: { icon: "/brand/fenix-symbol-white.png" },
  openGraph: {
    title: "FENIX NFC — современные NFC-решения для бизнеса",
    description: "NFC-меню, цифровые визитки, карточки для отзывов и индивидуальные NFC-решения для современного бизнеса.",
    url: siteConfig.url,
    siteName: "FENIX NFC",
    locale: "ru_RU",
    type: "website",
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#050505" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    email: siteConfig.email,
    sameAs: [siteConfig.telegram, siteConfig.instagram],
  };
  return (
    <html lang="ru" className={geist.variable}>
      <body>
        <LocaleProvider>{children}</LocaleProvider>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </body>
    </html>
  );
}
