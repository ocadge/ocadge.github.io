import { skillGroups } from '../../content/cv.ts'
import Section from '../Section/Section.tsx'
import styles from './Skills.module.css'

export default function Skills() {
  return (
    <Section id="skills" title="What I work with">
      <div className={styles.groups}>
        {skillGroups.map((group) => (
          <div key={group.name} className={styles.group}>
            <h3 className={styles.name}>{group.name}</h3>
            <ul className={styles.list}>
              {group.skills.map((skill) => (
                <li key={skill} className={styles.skill}>
                  {skill}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  )
}
