import About from './components/About/About.tsx'
import Experience from './components/Experience/Experience.tsx'
import Footer from './components/Footer/Footer.tsx'
import Header from './components/Header/Header.tsx'
import Hero from './components/Hero/Hero.tsx'
import Projects from './components/Projects/Projects.tsx'
import Section from './components/Section/Section.tsx'
import Skills from './components/Skills/Skills.tsx'

// Contact stays a placeholder until Phase 4.
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
        <Section id="contact" title="Contact">
          <p className="soon">
            Find me on{' '}
            <a href="https://github.com/ocadge" rel="noopener noreferrer">
              GitHub
            </a>{' '}
            for now.
          </p>
        </Section>
      </main>
      <Footer />
    </>
  )
}
