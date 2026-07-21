"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/siteConfig";
import { useLanguage } from "@/hooks/useLanguage";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SectionHeading } from "@/components/ui/SectionHeading";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Projects() {
  const { dictionary: d } = useLanguage();
  const reduced = useReducedMotion();
  return (
    <section className="section" id="projects"><div className="shell">
      <SectionHeading eyebrow={d.projects.eyebrow} title={d.projects.title} text={d.projects.subtitle} />
      <div className="projects-grid">{projects.map((project, index) => (
        <motion.article
          className="project"
          key={project.name}
          initial={reduced ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE, delay: (index % 2) * 0.1 }}
        >
          <div className={`project-art ${project.visual}`}>
            <span>{project.mark}</span>
            <div className="mock-card">{project.name}</div>
          </div>
          <div className="project-meta">
            <div>
              <span>{d.projects.categories[project.category]}</span>
              <h3>{project.name}</h3>
              <p>{d.projects.descriptions[project.description]}</p>
            </div>
            <a href={siteConfig.telegram} aria-label={`${d.projects.view}: ${project.name}`}><ArrowUpRight /></a>
          </div>
          <a className="project-link" href={siteConfig.telegram}>{d.projects.view}<ArrowUpRight size={16} /></a>
        </motion.article>
      ))}</div>
    </div></section>
  );
}
