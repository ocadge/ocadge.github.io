import { timeline } from '../../content/cv.ts'
import Section from '../Section/Section.tsx'
import styles from './Experience.module.css'

export default function Experience() {
  return (
    <Section id="experience" title="Experience and education">
      <ol className={styles.timeline}>
        {timeline.map((entry) => (
          <li key={entry.title} className={styles.entry}>
            <span className={entry.current ? `${styles.marker} ${styles.current}` : styles.marker} />
            <p className={styles.dates}>{entry.dates}</p>
            <div className={styles.detail}>
              <h3 className={styles.title}>
                {entry.title} · {entry.place}
              </h3>
              <p className={styles.summary}>{entry.summary}</p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  )
}
