import { About } from "./About";
import { Benefits } from "./Benefits";
import { ContactCTA } from "./ContactCTA";
import { FAQ } from "./FAQ";
import { Hero } from "./Hero";
import { HowItWorks } from "./HowItWorks";
import { Journey } from "./Journey";
import { Marquee } from "./Marquee";
import { Process } from "./Process";
import { ProductDemo } from "./ProductDemo";
import { Projects } from "./Projects";
import { Solutions } from "./Solutions";
import { UseCases } from "./UseCases";
import { SectionDots } from "@/components/layout/SectionDots";
import { BackToTop } from "@/components/ui/BackToTop";
import { PageEffects } from "@/components/ui/PageEffects";

export function HomeSections() {
  return (
    <>
      <PageEffects />
      <SectionDots />
      <BackToTop />
      <main>
        <Hero />
        <Marquee />
        <Journey />
        <Solutions />
        <HowItWorks />
        <ProductDemo />
        <UseCases />
        <Projects />
        <Benefits />
        <About />
        <Process />
        <FAQ />
        <ContactCTA />
      </main>
    </>
  );
}
