import { useRef, useState, type KeyboardEvent } from 'react'
import { groups, projects, type Project } from '../../content/projects.ts'
import { nextTab } from '../../lib/tabs.ts'
import Section from '../Section/Section.tsx'
import styles from './Projects.module.css'

const VIEW_LABELS = { live: 'Live demo', screenshots: 'Screenshots', writeup: 'Write-up' }

export default function Projects() {
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const group = groups[active]
  if (!group) return null
  const shown = projects.filter((p) => p.group === group.id)

  function onKeyDown(event: KeyboardEvent) {
    const next = nextTab(event.key, active, groups.length)
    if (next === null) return
    event.preventDefault()
    setActive(next)
    tabs.current[next]?.focus()
  }

  return (
    <Section id="projects" title="Things I've built">
      <div role="tablist" aria-label="Project groups" className={styles.tabs} onKeyDown={onKeyDown}>
        {groups.map((g, i) => (
          <button
            key={g.id}
            ref={(el) => {
              tabs.current[i] = el
            }}
            id={`projects-tab-${g.id}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls="projects-panel"
            tabIndex={i === active ? 0 : -1}
            className={styles.tab}
            onClick={() => setActive(i)}
          >
            {g.label}
          </button>
        ))}
      </div>
      <div
        id="projects-panel"
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={`projects-tab-${group.id}`}
        className={styles.grid}
      >
        {shown.map((p) => (
          <Card key={p.id} project={p} />
        ))}
      </div>
    </Section>
  )
}

function Card({ project: p }: { project: Project }) {
  const [cover, ...more] = p.images ?? []
  return (
    <article className={styles.card}>
      {cover && (
        <img
          className={styles.cover}
          src={cover.src}
          alt={cover.alt}
          width={cover.width}
          height={cover.height}
          loading="lazy"
        />
      )}
      <div className={styles.body}>
        <p className={styles.badge}>{VIEW_LABELS[p.view]}</p>
        <h3 className={styles.title}>{p.title}</h3>
        <p className={styles.summary}>{p.summary}</p>
        <ul className={styles.tags} aria-label="Built with">
          {p.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        {p.note && <p className={styles.note}>{p.note}</p>}

        {/* The write-up: everything a recruiter needs without a separate page. */}
        <details className={styles.more}>
          <summary>Read more</summary>
          <h4>What I built</h4>
          <p>{p.built}</p>
          <h4>What I learned</h4>
          <p>{p.learned}</p>
          {more.map((img) => (
            <img
              key={img.src}
              src={img.src}
              alt={img.alt}
              width={img.width}
              height={img.height}
              loading="lazy"
            />
          ))}
        </details>

        <div className={styles.links}>
          {p.links.live && <a href={p.links.live}>Open demo →</a>}
          {p.links.code && (
            <a href={p.links.code} rel="noopener noreferrer">
              View code ↗
            </a>
          )}
          {!p.codePublic && p.group === 'university' && (
            <span className={styles.private}>Code kept private (university coursework)</span>
          )}
        </div>
      </div>
    </article>
  )
}
