import { about } from '../../content/cv.ts'
import Section from '../Section/Section.tsx'
import styles from './About.module.css'

export default function About() {
  return (
    <Section id="about" title={about.headline}>
      <div className={styles.body}>
        <div className={styles.text}>
          {about.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
        {/* A description list pairs each label with its value for screen readers. */}
        <dl className={styles.facts}>
          {about.facts.map((fact) => (
            <div key={fact.label} className={styles.fact}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Section>
  )
}
