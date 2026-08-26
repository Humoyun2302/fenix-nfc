import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond } from "next/font/google";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: { absolute: "Ibrohim Abdurahmonovich | Contact" },
  description:
    "Digital contact card for Ibrohim Abdurahmonovich. Connect instantly via Telegram, Instagram, or phone.",
  applicationName: "Ibrohim Abdurahmonovich",
  manifest: "/ibrohim.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Ibrohim",
    statusBarStyle: "black-translucent",
  },
  robots: { index: true, follow: true },
  openGraph: {
    type: "profile",
    title: "Ibrohim Abdurahmonovich | Contact",
    description:
      "Connect with Ibrohim Abdurahmonovich instantly via Telegram, Instagram, or phone.",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function IbrohimLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className={cormorant.variable}>{children}</div>;
}
