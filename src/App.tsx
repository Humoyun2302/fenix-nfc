import { Atmosphere } from '@/components/Atmosphere'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { Contact } from '@/sections/Contact'
import { Hero } from '@/sections/Hero'
import { Process } from '@/sections/Process'
import { Products } from '@/sections/Products'
import { Solutions } from '@/sections/Solutions'
import { Work } from '@/sections/Work'

export function App() {
  return (
    <>
      <Atmosphere />
      <Navbar />
      <main id="main">
        <Hero />
        <Products />
        <Solutions />
        <Process />
        <Work />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
