import type { ReactNode } from 'react'
import styles from './Section.module.css'

interface Props {
  id: string
  title: string
  children: ReactNode
}

// Every page section shares this frame: a small label, a heading, then its content.
export default function Section({ id, title, children }: Props) {
  return (
    <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.head}>
          <span className={styles.label} aria-hidden="true">
            {id}
          </span>
          <h2 id={`${id}-title`} className={styles.title}>
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  )
}
