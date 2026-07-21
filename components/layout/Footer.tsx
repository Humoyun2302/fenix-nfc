"use client";

import { Camera, Mail, Send } from "lucide-react";
import { navigation, siteConfig } from "@/data/siteConfig";
import { useLanguage } from "@/hooks/useLanguage";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const { dictionary: d } = useLanguage();
  return (
    <footer className="footer" id="privacy">
      <div className="shell footer-grid">
        <div><Logo /><p>{d.footer.description}</p></div>
        <div><h3>{d.footer.navigation}</h3>{navigation.map((item) => <a key={item.key} href={item.href}>{d.nav[item.key]}</a>)}</div>
        <div><h3>{d.footer.contacts}</h3><a href={siteConfig.phoneHref}>{siteConfig.phone}</a><a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a></div>
        <div><h3>{d.footer.social}</h3><a href={siteConfig.telegram}><Send size={16} />{siteConfig.telegramHandle}</a><a href={siteConfig.instagram}><Camera size={16} />{siteConfig.instagramHandle}</a><a href={`mailto:${siteConfig.email}`}><Mail size={16} />{siteConfig.email}</a></div>
      </div>
      <div className="shell footer-bottom"><span>© {new Date().getFullYear()} FENIX NFC. {d.footer.copyright}</span><a href={siteConfig.privacy}>{d.footer.privacy}</a></div>
    </footer>
  );
}
