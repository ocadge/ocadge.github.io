import About from './components/About/About.tsx'
import Contact from './components/Contact/Contact.tsx'
import Experience from './components/Experience/Experience.tsx'
import Footer from './components/Footer/Footer.tsx'
import Header from './components/Header/Header.tsx'
import Hero from './components/Hero/Hero.tsx'
import Projects from './components/Projects/Projects.tsx'
import Skills from './components/Skills/Skills.tsx'

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
