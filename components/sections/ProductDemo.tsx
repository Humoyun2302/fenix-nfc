"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Camera, Contact, Globe2, Menu, Send, UserRound } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/data/siteConfig";

export function ProductDemo() {
  const { dictionary: d } = useLanguage();
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      gsap.fromTo(stage.current, { opacity: .35, scale: .88, rotateX: 8 }, { opacity: 1, scale: 1, rotateX: 0, scrollTrigger: { trigger: section.current, start: "top 78%", end: "center 50%", scrub: 1 } });
    }, section);
    return () => context.revert();
  }, []);
  const links = [
    { label: d.demo.profile, href: siteConfig.url, icon: UserRound },
    { label: d.demo.menu, href: "#use-cases", icon: Menu },
    { label: d.demo.website, href: siteConfig.url, icon: Globe2 },
    { label: d.demo.telegram, href: siteConfig.telegram, icon: Send },
    { label: d.demo.instagram, href: siteConfig.instagram, icon: Camera },
    { label: d.demo.contacts, href: `mailto:${siteConfig.email}`, icon: Contact },
  ];
  return (
    <section className="section demo-section" id="demo" ref={section}><div className="shell demo-grid">
      <div><SectionHeading eyebrow={d.demo.eyebrow} title={d.demo.title} text={d.demo.sentence} /></div>
      <div className="product-demo-stage" ref={stage}>
        <div className="demo-profile">
          <div className="demo-profile-head"><span>F</span><strong>FENIX NFC</strong></div>
          <div className="demo-links">{links.map(({ label, href, icon: Icon }) => <a key={label} href={href}><Icon size={18} aria-hidden />{label}</a>)}</div>
        </div>
        <div className="restaurant-menu"><strong>{d.demo.menu}</strong>{d.demo.menuItems.map((item, index) => <div key={item}><span>{item}</span><i style={{ width: `${75 - index * 12}%` }} /></div>)}</div>
      </div>
    </div></section>
  );
}
