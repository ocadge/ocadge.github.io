import { useEffect, useState } from 'react'
import styles from './Header.module.css'

const LINKS = [
  { href: '#about', label: 'About' },
  { href: '#skills', label: 'Skills' },
  { href: '#experience', label: 'Experience' },
  { href: '#projects', label: 'Projects' },
  { href: '#contact', label: 'Contact' },
]

export default function Header() {
  const [current, setCurrent] = useState('')

  // Watches which section is being read, so its menu link can be highlighted. The hero
  // (#top) is watched too, so nothing is highlighted back at the top of the page.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setCurrent(`#${entry.target.id}`)
      },
      // A section counts as current while it crosses a thin band 40% of the way down the screen.
      { rootMargin: '-40% 0px -55% 0px' },
    )
    for (const id of ['top', ...LINKS.map((link) => link.href.slice(1))]) {
      const section = document.getElementById(id)
      if (section) observer.observe(section)
    }
    return () => observer.disconnect()
  }, [])

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <a href="#top" className={styles.logo} aria-label="Ben Wilkinson, back to top">
          <span aria-hidden="true">/ben-wilkinson</span>
        </a>
        <nav aria-label="Main">
          <ul className={styles.links}>
            {LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={styles.link}
                  aria-current={current === link.href ? 'true' : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
