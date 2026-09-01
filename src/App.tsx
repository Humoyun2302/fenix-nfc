import { LangProvider, useLang } from './locales'
import { Nav } from './components/Nav'
import { Footer } from './components/Footer'
import { Hero } from './sections/Hero'
import { Statement } from './sections/Statement'
import { Products } from './sections/Products'
import { UseCases } from './sections/UseCases'
import { HowItWorks } from './sections/HowItWorks'
import { Projects } from './sections/Projects'
import { Cta } from './sections/Cta'

function Site() {
  const { t } = useLang()
  return (
    <>
      <a className="skip" href="#main">
        {t.common.skip}
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Statement />
        <Products />
        <UseCases />
        <HowItWorks />
        <Projects />
        <Cta />
      </main>
      <Footer />
      <div className="grain" aria-hidden="true" />
    </>
  )
}

export default function App() {
  return (
    <LangProvider>
      <Site />
    </LangProvider>
  )
}
