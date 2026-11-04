import { GitHubIcon } from '../icons.tsx'
import Now from '../Now/Now.tsx'
import styles from './Hero.module.css'

export default function Hero() {
  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.inner}`}>
        <div className={styles.intro}>
          <p className={styles.status}>
            <span className={styles.dot} aria-hidden="true" />
            Open to work
          </p>
          <h1 id="hero-title" className={styles.title}>
            Ben Wilkinson
          </h1>
          <p className={styles.pitch}>
            Early-career developer from the North East. I build things in Python and enjoy turning data into
            something people can actually use.
          </p>
          <p className={styles.pitch}>
            I&apos;m looking for an apprenticeship or junior role in software development, software testing,
            data, automation, games programming, or technical and digital support, in the North East or
            remote.
          </p>
          <div className={styles.actions}>
            <a href="#projects" className={styles.primary}>
              View projects
              <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a href="#contact" className={styles.secondary}>
              Get in touch
            </a>
          </div>
          <ul className={styles.meta}>
            <li>
              <a href="https://github.com/ocadge" rel="noopener noreferrer" className={styles.metaLink}>
                <GitHubIcon />
                github.com/ocadge
              </a>
            </li>
            <li>North East England</li>
          </ul>
        </div>

        <Now />
      </div>
    </section>
  )
}
