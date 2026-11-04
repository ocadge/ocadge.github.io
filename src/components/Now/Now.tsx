import { useRef, useState, type KeyboardEvent } from 'react'
import { bootcampTopics, nowItems, siteSteps, type NowItem } from '../../content/now.ts'
import { data } from '../../explorer/data.ts'
import { nextTab } from '../../lib/tabs.ts'
import { linePoints } from './helpers.ts'
import styles from './Now.module.css'

export default function Now() {
  const [active, setActive] = useState(0)
  const tabs = useRef<(HTMLButtonElement | null)[]>([])
  const item = nowItems[active]

  // Arrow keys move between tabs and select them, as screen reader users expect from tabs.
  function onKeyDown(event: KeyboardEvent) {
    const next = nextTab(event.key, active, nowItems.length)
    if (next === null) return
    event.preventDefault()
    setActive(next)
    tabs.current[next]?.focus()
  }

  if (!item) return null

  return (
    <div className={styles.now}>
      <div className={styles.head}>
        <h2 className={styles.heading}>Right now</h2>
        <div role="tablist" aria-label="What I'm working on" className={styles.tabs} onKeyDown={onKeyDown}>
          {nowItems.map((it, i) => (
            <button
              key={it.id}
              ref={(el) => {
                tabs.current[i] = el
              }}
              id={`now-tab-${it.id}`}
              role="tab"
              type="button"
              aria-selected={i === active}
              aria-controls="now-panel"
              tabIndex={i === active ? 0 : -1}
              className={styles.tab}
              onClick={() => setActive(i)}
            >
              {it.tab}
            </button>
          ))}
        </div>
      </div>

      <div
        id="now-panel"
        role="tabpanel"
        tabIndex={0}
        aria-labelledby={`now-tab-${item.id}`}
        className={styles.panel}
      >
        <p className={styles.status}>
          <span className={styles.dot} aria-hidden="true" />
          {item.status}
        </p>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.summary}>{item.summary}</p>
        <Preview item={item} />
        {item.link && (
          <a
            href={item.link.href}
            className={styles.link}
            {...(item.link.href.startsWith('https:') ? { rel: 'noopener noreferrer' } : {})}
          >
            {item.link.label} →
          </a>
        )}
      </div>
    </div>
  )
}

// A small example of each item, so the panel shows the work rather than only describing it.
function Preview({ item }: { item: NowItem }) {
  if (item.id === 'site') {
    return (
      <ol className={styles.steps}>
        {siteSteps.map((step) => (
          <li key={step.label} className={step.done ? styles.done : undefined}>
            <span className={styles.check} aria-hidden="true">
              {step.done ? '■' : '□'}
            </span>
            {step.label}
            <span className="sr-only">{step.done ? ' (done)' : ' (to do)'}</span>
          </li>
        ))}
      </ol>
    )
  }
  if (item.id === 'explorer') return <EuChart />
  return (
    <ul className={styles.topics}>
      {bootcampTopics.map((topic) => (
        <li key={topic}>{topic}</li>
      ))}
    </ul>
  )
}

function EuChart() {
  const series = data.values.T.EU27_2020 ?? {}
  const years = data.years.filter((y) => series[y] !== undefined)
  const values = years.map((y) => series[y] as number)
  const points = linePoints(values, 300, 80)
  const dip = points[years.indexOf('2020')]
  const first = years[0]
  const last = years.at(-1)

  return (
    <figure className={styles.chart}>
      <svg
        viewBox="-4 -8 308 100"
        role="img"
        aria-label={`EU average life expectancy from ${first} to ${last}: ${values[0]} rising to ${values.at(-1)} years, with a dip in 2020.`}
      >
        <polyline points={points.map((p) => `${p.x},${p.y}`).join(' ')} className={styles.line} />
        {dip && <circle cx={dip.x} cy={dip.y} r="3.5" className={styles.marker} />}
      </svg>
      <figcaption className={styles.caption}>
        <span>{first}</span>
        <span>EU average life expectancy (Eurostat)</span>
        <span>{last}</span>
      </figcaption>
    </figure>
  )
}
